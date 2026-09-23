/**
 * Full-text search over the whole wiki.
 *
 * WHY THERE IS NO SEARCH LIBRARY HERE
 *
 * The build has a hard 5 MB ceiling (see .claude/IGEM_WIKI_REQUIREMENTS.md),
 * and a search library would cost twice: the library itself, plus a pre-built
 * index shipped alongside it. Neither is needed. Every page of Markdown is
 * already in the bundle, because pages.ts imports each file with `?raw` so
 * the router can render it. The corpus is therefore in memory the moment the
 * app loads, and all that is missing is the reading of it. That is this file:
 * no dependencies, no generated index, no build step.
 *
 * The index is built once, on the first query, and kept for the session.
 * Thirty pages is a few hundred kilobytes of text and parses in a few
 * milliseconds; doing it lazily keeps it off the first paint of the home
 * page, which most visitors never search from.
 *
 * WHAT IT SEARCHES
 *
 * Not whole pages. A page is split into passages at its headings, so a result
 * can say "Wet Lab, Assembly strategy" and link to `/wet-lab#assembly-strategy`
 * instead of dropping the reader at the top of four thousand words.
 *
 * Matching is substring, not whole-word: "titr" finds "titre" and "titration",
 * which is what someone half-remembering a term needs. A match at the start of
 * a word scores higher than one in the middle, so "rna" ranks "RNA design"
 * above "mRNA fragment". Several words are ANDed: each one has to appear
 * somewhere in the passage.
 *
 * A term that appears nowhere at all is read again, twice over, in this
 * order. First with the punctuation put back, so "ecoli" finds "E. coli" and
 * "loopended" finds "loop-ended": those are the words that were asked for,
 * written the way the wiki writes them. Then, failing that, against the
 * wiki's own vocabulary within one or two edits, so "yest" finds yeast and
 * "varoa" finds Varroa.
 *
 * Both are fallbacks and neither is a widening: a term with a real match is
 * used exactly as typed, a corrected one scores below an exact one, and
 * either reading is reported back, so the page can say how it read the query
 * instead of quietly answering a different question.
 */

import { getPathMapping, type PageEntry } from "./getPathMapping";
import { headingId } from "./headingId";
import { STAKEHOLDERS } from "../data/stakeholders";
import {
  EVENTS_BY_DATE,
  TRACK_NAMES,
  THREAD_NAMES,
  fullDate,
} from "../data/timeline";

/** One run of snippet text, either matched or not. */
export interface Segment {
  text: string;
  match: boolean;
}

/** One matching passage within a page. */
export interface Hit {
  /** The heading this passage sits under. Empty at the top of a page. */
  heading: string;
  /** The page it is on. */
  path: string;
  /** The heading's id, for the fragment. Empty when there is no heading. */
  anchor: string;
  /** The text around the match, split for highlighting. */
  snippet: Segment[];
  score: number;
}

/** A page with at least one matching passage. */
export interface PageResult {
  path: string;
  title: string;
  lead?: string;
  score: number;
  /** Best passages first, capped: one page should not flood the results. */
  hits: Hit[];
}

/** A passage: the text under one heading of one page. */
interface Passage {
  path: string;
  title: string;
  lead?: string;
  heading: string;
  anchor: string;
  text: string;
  foldedTitle: string;
  foldedHeading: string;
  foldedText: string;
}

/** Shortest query worth running. One character matches half the wiki. */
const MIN_TERM = 2;

/** Passages shown per page, beyond which a result stops being a result. */
const HITS_PER_PAGE = 3;

/** Characters of context around a match. */
const SNIPPET_WIDTH = 200;

/**
 * Lowercases and strips accents, for matching.
 *
 * Offsets into the folded text are used to highlight the original, so the two
 * have to line up character for character. Latin accents survive the round
 * trip: e-acute decomposes to e plus a combining accent, and dropping the
 * accent leaves one character again. Anything that does not survive it falls
 * back to a plain lowercase, which is always aligned.
 */
function fold(text: string): string {
  // \p{M} is "any combining mark", written as a property escape because a
  // literal range of combining characters does not survive a formatter.
  const folded = text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  return folded.length === text.length ? folded : text.toLowerCase();
}

/**
 * Markdown to the plain text a reader sees.
 *
 * Link targets, image URLs and emphasis markers go; link text and alt text
 * stay, because both are real prose someone might search for. Table pipes
 * become spaces rather than vanishing, so cells do not run into each other.
 */
function toPlainText(markdown: string): string {
  return (
    markdown
      // Images first: the alt text is content, the URL is not.
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      // Emphasis and inline code.
      .replace(/[*_~`]+/g, "")
      // Line-level markup: quote markers, list bullets, table rules.
      .replace(/^\s*>+\s?/gm, "")
      .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
      .replace(/^\s*\|?[\s:|-]*\|[\s:|-]*$/gm, " ")
      .replace(/\|/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/** Splits one page of Markdown into passages, one per heading. */
function passagesOf(
  path: string,
  page: { title: string; lead?: string; content: string },
): Passage[] {
  const passages: Passage[] = [];
  const foldedTitle = fold(page.title);

  let heading = "";
  let anchor = "";
  let buffer: string[] = [];
  let fenced = false;

  const flush = () => {
    const text = toPlainText(buffer.join("\n"));
    buffer = [];
    // A heading with nothing under it is still findable by its own words.
    if (!text && !heading) return;
    passages.push({
      path,
      title: page.title,
      lead: page.lead,
      heading,
      anchor,
      text,
      foldedTitle,
      foldedHeading: fold(heading),
      foldedText: fold(text),
    });
  };

  // The lead belongs to the opening passage: it is the summary of the page,
  // written for exactly this kind of skim.
  if (page.lead) buffer.push(page.lead);

  for (const line of page.content.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      continue;
    }
    const match = fenced ? null : /^(#{2,6})\s+(.*)$/.exec(line);
    if (!match) {
      buffer.push(line);
      continue;
    }

    flush();
    heading = toPlainText(match[2]);
    // Only h2 and h3 carry ids in the rendered page (see MarkdownPage), so a
    // deeper heading links to the section it sits in rather than to a
    // fragment that does not exist.
    if (match[1].length <= 3) anchor = headingId(heading);
  }
  flush();

  return passages;
}

/**
 * The stakeholder profiles, as passages, one per person.
 *
 * CONSENT. A profile with `consent` set is withheld on the page: no name, no
 * role, no content, only an acknowledgement that the conversation happened.
 * Those are skipped here, and the filter is the point of this function. An
 * index is published text. Indexing a withheld name would make it findable by
 * typing it, which publishes exactly what the page is withholding, and the
 * integrity rules in WIKI_PAGE_RULES.md §5 make that the team's problem rather
 * than a bug. If the consent lands, deleting the `consent` field makes the
 * profile render and become searchable in the same move.
 *
 * Indexed fields are the ones a reader can see on the card: role, place, date,
 * quote, what we learnt, what it changed. The question tags are deliberately
 * not indexed. Their titles show only in a tooltip, and a result whose match
 * cannot be found on the page it points at is worse than no result.
 */
function stakeholderPassages(path: string, page: PageEntry): Passage[] {
  const foldedTitle = fold(page.title);

  return STAKEHOLDERS.filter((person) => !person.consent).map((person) => {
    const text = [
      person.role,
      person.place,
      person.date,
      person.quote,
      ...person.learnt,
      person.changed,
    ]
      .filter(Boolean)
      .join(" ");

    return {
      path,
      title: page.title,
      lead: page.lead,
      heading: person.name,
      // Matches the id StakeholderMap puts on the profile in its roster.
      anchor: `sm-${person.id}`,
      text,
      foldedTitle,
      foldedHeading: fold(person.name),
      foldedText: fold(text),
    };
  });
}

/**
 * The timeline entries, as passages, one per event.
 *
 * Same reasoning as the stakeholder profiles: they are data rather than
 * Markdown, so the walk over the page source cannot see a word of them, and a
 * reader searching for "sucrose" or "miniprep" should reach the day it
 * happened. The heading is the event title and the anchor is the id the
 * component puts on the written record underneath the grid, not on the entry
 * in the grid itself, so a result lands somewhere that shows the whole entry
 * whatever the reader has the grid focused on.
 *
 * The date is indexed in its long form, so "September 2026" finds the month.
 * The workstream and thread names are indexed because both are written on the
 * entry; nothing is indexed here that a reader cannot then see on the page.
 */
function timelinePassages(path: string, page: PageEntry): Passage[] {
  const foldedTitle = fold(page.title);

  return EVENTS_BY_DATE.map((event) => {
    const text = [
      fullDate(event),
      TRACK_NAMES[event.track],
      event.detail,
      ...(event.threads ?? []).map((id) => THREAD_NAMES[id]),
    ]
      .filter(Boolean)
      .join(" ");

    return {
      path,
      title: page.title,
      lead: page.lead,
      heading: event.title,
      anchor: `tl-${event.id}`,
      text,
      foldedTitle,
      foldedHeading: fold(event.title),
      foldedText: fold(text),
    };
  });
}

let index: Passage[] | null = null;

/** Builds the index on first use, then reuses it for the session. */
function corpus(): Passage[] {
  if (!index) {
    const pages = getPathMapping();
    index = Object.entries(pages).flatMap(([path, page]) =>
      passagesOf(path, page),
    );

    // The stakeholder profiles are data, not Markdown: they reach the page
    // through a component slot, so the walk above cannot see a word of them.
    // The host page is found rather than named, so the search follows if the
    // component is moved to another page.
    const host = Object.entries(pages).find(([, page]) =>
      /```component\s+stakeholder-map\s*```/.test(page.content),
    );
    if (host) index.push(...stakeholderPassages(host[0], host[1]));

    // Same again for the timeline, and found the same way.
    const timelineHost = Object.entries(pages).find(([, page]) =>
      /```component\s+project-timeline\s*```/.test(page.content),
    );
    if (timelineHost) {
      index.push(...timelinePassages(timelineHost[0], timelineHost[1]));
    }
  }
  return index;
}

let vocabulary: Map<string, number> | null = null;

/**
 * Every distinct word on the wiki, with how often it occurs. This is what a
 * mistyped term gets corrected against: the vocabulary of this project, so
 * "varoa" can only ever become "varroa", never some word from a dictionary
 * that appears nowhere on the wiki.
 *
 * Words shorter than four characters are left out. They are below the length
 * where a correction is allowed at all, and they are most of the tokens.
 */
function words(): Map<string, number> {
  if (!vocabulary) {
    vocabulary = new Map();
    for (const passage of corpus()) {
      const source = `${passage.foldedTitle} ${passage.foldedHeading} ${passage.foldedText}`;
      for (const word of source.split(/[^a-z0-9]+/)) {
        if (word.length < 4) continue;
        vocabulary.set(word, (vocabulary.get(word) ?? 0) + 1);
      }
    }
  }
  return vocabulary;
}

/**
 * Edit distance between two words, counting a swap of neighbours as one edit
 * rather than two, because "yaest" for "yeast" is one slip of the fingers.
 * (Optimal string alignment: the restricted form of Damerau-Levenshtein.)
 *
 * Returns `max + 1` for anything further apart than `max`, and gives up as
 * soon as a whole row of the matrix exceeds it, so a word that cannot be
 * close costs almost nothing to reject.
 */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;

  let twoBack = new Array<number>(b.length + 1);
  let previous = new Array<number>(b.length + 1);
  let current = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) previous[j] = j;

  for (let i = 1; i <= a.length; i++) {
    current[0] = i;
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let step = Math.min(
        previous[j] + 1, // deletion
        current[j - 1] + 1, // insertion
        previous[j - 1] + cost, // substitution
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        step = Math.min(step, twoBack[j - 2] + 1); // transposition
      }
      current[j] = step;
      if (step < best) best = step;
    }
    if (best > max) return max + 1;

    const spare = twoBack;
    twoBack = previous;
    previous = current;
    current = spare;
  }

  return previous[b.length];
}

/**
 * How wrong a word of this length is allowed to be.
 *
 * Nothing under four characters may be corrected at all: at that length an
 * edit turns one real word into another real word, and "mite" would answer to
 * "site". The second edit is only allowed once a word is long enough that two
 * slips still leave it recognisable.
 */
function maxEdits(term: string): number {
  if (term.length < 4) return 0;
  return term.length < 8 ? 1 : 2;
}

/** A query term, and the forms of it actually looked for. */
interface Term {
  /** As typed. */
  typed: string;
  /** What to look for: the term itself, or the near words it was read as. */
  forms: string[];
  /** Below 1 when the forms are corrections, so a real match always wins. */
  weight: number;
  /** How the forms were arrived at, when they are not the term itself. */
  kind?: Correction["kind"];
}

/** A term that matched nothing as typed, and what was searched for instead. */
export interface Correction {
  typed: string;
  used: string[];
  /**
   * `spacing` when the words are on the wiki and only the punctuation between
   * them differed, `spelling` when the term had to be corrected to a near one.
   * The page says something different for each, because one found what was
   * asked for and the other found something close to it.
   */
  kind: "spacing" | "spelling";
}

/**
 * What a name may be broken up with: "E. coli", "loop-ended", "in vitro".
 *
 * Two characters is the most that ever separates the parts of one name (a
 * full stop and a space). Allowing more would let a term wander across a
 * sentence and match words that merely follow one another.
 */
const SEPARATOR = "[\\s.\\-–—·/]{0,2}";

/** Corrections never outrank an exact match, and rank below one another. */
const NEAR_WEIGHT = 0.55;

/** Enough alternatives to cover a plural or a compound, not enough to drift. */
const MAX_FORMS = 4;

/**
 * The same term written with the punctuation put back: what "ecoli" looks
 * like on a page that says "E. coli".
 *
 * The term is stripped to its letters and digits and rebuilt as a pattern
 * that tolerates a separator between any two of them, then run over the
 * corpus. What comes back is not the pattern but the strings it actually
 * matched, so everything downstream keeps working on plain substrings and
 * highlighting needs no special case.
 *
 * A match must start a word. Without that, "ecoli" would also match the tail
 * of a longer word that happens to end that way.
 */
function spacedForms(typed: string): string[] {
  const bare = typed.replace(/[^a-z0-9]+/g, "");
  // Below three characters this stops being a name and starts being a way to
  // match anything: "rna" would find "r n a" across three separate words.
  if (bare.length < 3) return [];

  // Every character left is a letter or a digit, so none of them needs
  // escaping in the pattern.
  const pattern = new RegExp(bare.split("").join(SEPARATOR), "g");
  const found = new Set<string>();

  for (const passage of corpus()) {
    for (const text of [
      passage.foldedTitle,
      passage.foldedHeading,
      passage.foldedText,
    ]) {
      pattern.lastIndex = 0;
      for (let hit = pattern.exec(text); hit; hit = pattern.exec(text)) {
        if (atWordStart(text, hit.index)) found.add(hit[0]);
        if (found.size >= MAX_FORMS) return [...found];
      }
    }
  }

  return [...found];
}

/**
 * Reads a term against the wiki's vocabulary.
 *
 * A term found in the text is used exactly as typed: correction is a fallback,
 * never a widening. Only when a term appears nowhere is it matched against the
 * vocabulary, and then only against words starting with the same letter. That
 * last rule is what keeps the results quiet, since a typo rarely lands on the
 * first character, and it also removes nineteen twentieths of the work.
 *
 * Of the candidates, only the closest are kept, most frequent first: at
 * distance 1 the answer is usually one word, and mixing in the distance-2
 * candidates would bury it.
 */
function read(typed: string): Term {
  const asTyped: Term = { typed, forms: [typed], weight: 1 };

  // The test for "found" is the matcher's own test, run over the same text,
  // so a term is never read as anything else while it still has a real hit
  // somewhere. Whole words are what the vocabulary holds, but a term need not
  // be one: "loop-ended" is in the prose and in no single word of it.
  const found = corpus().some(
    (passage) =>
      passage.foldedText.includes(typed) ||
      passage.foldedHeading.includes(typed) ||
      passage.foldedTitle.includes(typed),
  );
  if (found) return asTyped;

  // Punctuation before spelling: "ecoli" written out as "E. coli" is the word
  // that was asked for, while a near word is only the closest thing to it.
  const spaced = spacedForms(typed);
  if (spaced.length) {
    return { typed, forms: spaced, weight: 1, kind: "spacing" };
  }

  const limit = maxEdits(typed);
  if (!limit) return asTyped;

  const vocab = words();
  let closest = limit + 1;
  let near: Array<[string, number]> = [];

  for (const [word, count] of vocab) {
    if (word[0] !== typed[0]) continue;
    const distance = editDistance(typed, word, limit);
    if (distance > limit) continue;
    if (distance < closest) {
      closest = distance;
      near = [];
    }
    if (distance === closest) near.push([word, count]);
  }

  // Nothing close enough: the term stands as typed and finds nothing, which
  // is the honest answer to a word that is not on this wiki.
  if (!near.length) return asTyped;

  return {
    typed,
    forms: near
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_FORMS)
      .map(([word]) => word),
    weight: NEAR_WEIGHT,
    kind: "spelling",
  };
}

const WORD = /[a-z0-9]/;

/**
 * Shortest term still worth matching inside a word. At three characters "rna"
 * finding "mRNA" is useful; at two, "le" finding "unable" is not.
 */
const SHORT_TERM = 3;

/** Every position of `term` in `text`. Cheaper than a global regex. */
function positions(text: string, term: string): number[] {
  // A one or two character term counts only where it starts a word. Without
  // this, searching a name like "Le Feuvre" marks the "le" in every "unable"
  // on the page, and scores the passage for it.
  const wordsOnly = term.length < SHORT_TERM;

  const found: number[] = [];
  for (let i = text.indexOf(term); i !== -1; i = text.indexOf(term, i + 1)) {
    if (!wordsOnly || atWordStart(text, i)) found.push(i);
  }
  return found;
}

/** True when the match at `at` starts a word rather than sitting inside one. */
function atWordStart(text: string, at: number): boolean {
  return at === 0 || !WORD.test(text[at - 1]);
}

/**
 * How well one passage answers one term. Zero means it does not, and the
 * passage is dropped, because terms are ANDed.
 *
 * The weights say: the page this sits on matters most, the heading above it
 * next, the prose least, and a word starting with the term beats one merely
 * containing it. Repetition counts a little and then stops counting, so a long
 * page cannot win on volume alone.
 */
function scoreForm(passage: Passage, term: string): number {
  let score = 0;

  const inTitle = positions(passage.foldedTitle, term);
  if (inTitle.length) {
    score += inTitle.some((at) => atWordStart(passage.foldedTitle, at))
      ? 14
      : 8;
  }

  const inHeading = positions(passage.foldedHeading, term);
  if (inHeading.length) {
    score += inHeading.some((at) => atWordStart(passage.foldedHeading, at))
      ? 10
      : 6;
  }

  const inText = positions(passage.foldedText, term);
  if (inText.length) {
    score += inText.some((at) => atWordStart(passage.foldedText, at)) ? 4 : 2;
    score += Math.min(inText.length, 4);
  }

  return score;
}

/**
 * How well one passage answers one term, whichever of its forms fits best.
 *
 * The best form rather than the sum of them: a term read as both "yeast" and
 * "yeasts" is one word the reader meant, not two they asked for.
 */
function scoreTerm(passage: Passage, term: Term): number {
  let best = 0;
  for (const form of term.forms) {
    const score = scoreForm(passage, form);
    if (score > best) best = score;
  }
  return best * term.weight;
}

/**
 * Splits `text` into marked and unmarked runs, one mark per occurrence of any
 * form. Overlaps are merged, so searching "rna rnai" cannot open two marks
 * over the same characters.
 *
 * This is what highlights a result's snippet, its heading, its page title and,
 * once the reader clicks through, the words on the page itself, so all four
 * agree about what counts as a match.
 */
export function highlight(text: string, forms: string[]): Segment[] {
  const folded = fold(text);

  const ranges: Array<[number, number]> = [];
  for (const form of forms) {
    for (const at of positions(folded, form)) {
      ranges.push([at, at + form.length]);
    }
  }
  if (!ranges.length) return [{ text, match: false }];
  ranges.sort((a, b) => a[0] - b[0]);

  const merged: Array<[number, number]> = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([range[0], range[1]]);
  }

  const segments: Segment[] = [];
  let cursor = 0;
  for (const [from, to] of merged) {
    if (from > cursor) {
      segments.push({ text: text.slice(cursor, from), match: false });
    }
    segments.push({ text: text.slice(from, to), match: true });
    cursor = to;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), match: false });
  }

  return segments;
}

/** The text around the first match, with every matched run marked. */
function snippetOf(passage: Passage, terms: string[]): Segment[] {
  const { text, foldedText } = passage;

  const first = terms
    .map((term) => foldedText.indexOf(term))
    .filter((at) => at !== -1)
    .sort((a, b) => a - b)[0];

  // A passage can match on its heading alone. Then the snippet is simply the
  // start of the prose under it.
  let start = first === undefined ? 0 : Math.max(0, first - 60);
  if (start > 0) {
    const space = text.indexOf(" ", start);
    start = space === -1 ? start : space + 1;
  }
  let end = Math.min(text.length, start + SNIPPET_WIDTH);
  if (end < text.length) {
    const space = text.lastIndexOf(" ", end);
    end = space > start ? space : end;
  }

  const body = text.slice(start, end);
  const segments = highlight(body, terms);

  if (start > 0) {
    segments[0] = { ...segments[0], text: `... ${segments[0].text}` };
  }
  if (end < text.length) {
    const last = segments[segments.length - 1];
    segments[segments.length - 1] = { ...last, text: `${last.text} ...` };
  }

  return segments;
}

/** The query, split into the terms every result has to satisfy. */
export function termsOf(query: string): string[] {
  return fold(query)
    .split(/\s+/)
    .filter((term) => term.length >= MIN_TERM);
}

/** What a search found, and what it had to read differently to find it. */
export interface Results {
  pages: PageResult[];
  /** Mistyped terms, with the words used in their place. Usually empty. */
  corrections: Correction[];
  /** Every form looked for, for highlighting headings and titles. */
  forms: string[];
}

/**
 * Searches the wiki. Returns pages, best first, each carrying the passages
 * that matched, and a note of any term that had to be corrected to match at
 * all, so the page can say so rather than quietly answering a different
 * question.
 *
 * A query with nothing in it of at least two characters returns nothing
 * rather than everything.
 */
export function search(query: string, limit = 30): Results {
  const typed = termsOf(query);
  if (!typed.length) return { pages: [], corrections: [], forms: [] };

  const terms = typed.map(read);
  const corrections = terms
    .filter((term) => term.kind)
    .map((term) => ({
      typed: term.typed,
      used: term.forms,
      kind: term.kind as Correction["kind"],
    }));

  // Only when nothing was corrected: the phrase as typed is not in the text
  // if one of its words was not either.
  const phrase =
    terms.length > 1 && !corrections.length ? fold(query.trim()) : null;
  const forms = terms.flatMap((term) => term.forms);
  const byPath = new Map<string, PageResult>();

  for (const passage of corpus()) {
    let score = 0;
    for (const term of terms) {
      const termScore = scoreTerm(passage, term);
      if (!termScore) {
        score = 0;
        break;
      }
      score += termScore;
    }
    if (!score) continue;

    // The whole phrase, intact: far likelier to be what was meant.
    const whole = `${passage.foldedHeading} ${passage.foldedText}`;
    if (phrase && whole.includes(phrase)) score += 10;

    const hit: Hit = {
      heading: passage.heading,
      path: passage.path,
      anchor: passage.anchor,
      snippet: snippetOf(passage, forms),
      score,
    };

    const page = byPath.get(passage.path);
    if (page) {
      page.hits.push(hit);
    } else {
      byPath.set(passage.path, {
        path: passage.path,
        title: passage.title,
        lead: passage.lead,
        score: 0,
        hits: [hit],
      });
    }
  }

  const results = [...byPath.values()];
  for (const page of results) {
    page.hits.sort((a, b) => b.score - a.score);
    // A page ranks on its best passage. The rest only break ties, or a page
    // mentioning a term once in forty sections would outrank the page about it.
    page.score =
      page.hits[0].score +
      page.hits.slice(1).reduce((sum, hit) => sum + hit.score, 0) * 0.3;
    page.hits = page.hits.slice(0, HITS_PER_PAGE);
  }

  return {
    pages: results.sort((a, b) => b.score - a.score).slice(0, limit),
    corrections,
    forms,
  };
}

/**
 * The forms a query is looked for as, corrections included.
 *
 * A page reached from a result carries the query in `?q=`, and re-derives the
 * forms here rather than having them passed in the URL. That way one rule
 * decides what counts as a match, and the link stays legible: `?q=yest` is
 * what was typed, and the page still highlights "yeast".
 */
export function formsOf(query: string): string[] {
  return termsOf(query).flatMap((term) => read(term).forms);
}
