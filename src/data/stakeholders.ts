/* The stakeholder record and the six HONEY questions, loaded from Markdown.
 *
 * The content lives where the team can edit it without touching code:
 *
 *   - one file per conversation in `src/content/stakeholders/*.md`
 *     (frontmatter for the fields, sections for what they told us, the
 *     verbatim quote and what it changed);
 *   - one file per question in `src/content/questions/q1.md` … `q6.md`
 *     (frontmatter for the title and the per-stage people, sections for the
 *     cycle panel's text).
 *
 * The editing rules — provenance, verbatim quotes, the consent handling for
 * withheld interviews, photos — are in each folder's README.md. This module
 * only parses; it adds nothing. The parser accepts a deliberately small
 * dialect: flat `key: value` frontmatter, comma-separated lists, `## `
 * sections, and continuation lines that fold into the bullet or paragraph
 * above them, so a hand edit cannot silently change meaning.
 *
 * A file with `consent-status` is a withheld interview: the page renders it
 * anonymously and the search index skips it. The body of such a file is
 * ignored on purpose.
 */

/** The six HONEY questions the page is organised around. */
export type QuestionId = "Q1" | "Q2" | "Q3" | "Q4" | "Q5" | "Q6";

export const QUESTION_IDS: QuestionId[] = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"];

/** The five stages of the team's HONEY loop, in cycle order. */
export type HoneyStage = "H" | "O" | "N" | "E" | "Y";

export const STAGE_ORDER: HoneyStage[] = ["H", "O", "N", "E", "Y"];

export const STAGE_NAMES: Record<HoneyStage, string> = {
  H: "Hear",
  O: "Observe",
  N: "Navigate",
  E: "Evaluate",
  Y: "Yield",
};

/** Frontmatter key and body heading for each stage, in the question files. */
const STAGE_KEYS: Record<HoneyStage, string> = {
  H: "hear",
  O: "observe",
  N: "navigate",
  E: "evaluate",
  Y: "yield",
};

export interface Stakeholder {
  id: string;
  /** As written in the source. */
  name: string;
  /** Role and institution, as written in the source. */
  role: string;
  /** Human-readable place, shown on the card. */
  place: string;
  /** Grouping key for the roster. */
  region: string;
  lat: number;
  lon: number;
  /** Interview date. Omitted where the source records none. */
  date?: string;
  /** Questions where the table lists this as a supporting interview. */
  questions: QuestionId[];
  /** Questions where the table names this as the anchor interview. */
  anchors?: QuestionId[];
  /** Tags not stated in the table, inferred from profile content. */
  provisional?: QuestionId[];
  /** What they told us. Transcribed, one point per bullet. */
  learnt: string[];
  /** A verbatim quote, exactly as the team transcribed it. */
  quote?: string;
  /** What it changed, where the source states it. */
  changed?: string;
  /** Profile photograph URL. Never set for a withheld entry. */
  photo?: string;
  /** Who the photograph actually shows, when that is not simply `name`. */
  photoShows?: string;
  /** Set if this interview may not be published yet. */
  consent?: {
    status: "not-given" | "review-pending";
    note: string;
  };
  /** Explicit lattice cell, where snapping picks the wrong landmass. */
  hex?: [col: number, row: number];
  /** Sort key from the file; keeps roster and map assignment stable. */
  order: number;
}

/** One stage of one question's cycle, for the panel and the map. */
export interface CycleStage {
  stage: HoneyStage;
  /** Conversation ids placed in this stage by the question file. */
  people: string[];
  /** The subset central to the question: only these wear the badge. */
  key: string[];
  /** The panel's text for this stage, plain Markdown. */
  body: string;
}

export interface QuestionCycle {
  id: QuestionId;
  title: string;
  /** Only stages with people or text, in H > O > N > E > Y order. */
  stages: CycleStage[];
}

/* ---------- the tiny Markdown dialect ---------- */

interface ParsedFile {
  front: Record<string, string>;
  sections: Record<string, string>;
}

function parseFile(raw: string): ParsedFile | null {
  const text = raw.replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const front: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i <= 0) continue;
    front[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const sections: Record<string, string> = {};
  const parts = m[2].split(/^## +/m);
  for (const part of parts.slice(1)) {
    const nl = part.indexOf("\n");
    if (nl < 0) continue;
    sections[part.slice(0, nl).trim()] = part.slice(nl + 1).trim();
  }
  return { front, sections };
}

/** Comma-separated frontmatter list; empty or missing value means []. */
function list(v: string | undefined): string[] {
  return v
    ? v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
}

/** Bullets, with lines that do not open a new bullet folded into the one
 * above, so a hand-wrapped bullet stays a single point. */
function bullets(section: string | undefined): string[] {
  if (!section) return [];
  const out: string[] = [];
  for (const line of section.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("- ")) out.push(t.slice(2));
    else if (out.length) out[out.length - 1] += ` ${t}`;
  }
  return out;
}

/** A paragraph (or blockquote) reflowed to one string, as the record keeps
 * quotes and change notes. */
function flow(section: string | undefined): string | undefined {
  if (!section) return undefined;
  const s = section
    .split("\n")
    .map((line) => line.replace(/^> ?/, "").trim())
    .filter(Boolean)
    .join(" ")
    .trim();
  return s || undefined;
}

const warn = (msg: string) => {
  if (import.meta.env.DEV) console.warn(`[stakeholders] ${msg}`);
};

/* ---------- photos ---------- */

/**
 * Where the photos live once uploaded. The uploads tool converts every
 * image to `.avif` and keeps the basename, so the URL is knowable before
 * the upload happens. In dev the same-named local file is served from the
 * gitignored `wiki-assets-source/stakeholder-photos/` (the plugin in
 * vite.config.ts), so faces show before the upload; the published site
 * loads only from iGEM servers and falls back to silhouettes until then.
 */
const PHOTO_BASE =
  "https://static.igem.wiki/teams/6391/wiki/human-practices/stakeholders/";

function photoUrl(basename: string): string {
  if (import.meta.env.DEV) {
    return `${import.meta.env.BASE_URL}stakeholder-photos/${basename}.avif`;
  }
  return `${PHOTO_BASE}${basename}.avif`;
}

/* ---------- the stakeholders ---------- */

const stakeholderFiles = import.meta.glob("../content/stakeholders/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const QUESTION_SET = new Set<string>(QUESTION_IDS);

function qids(v: string | undefined, file: string): QuestionId[] {
  const out: QuestionId[] = [];
  for (const q of list(v)) {
    if (QUESTION_SET.has(q)) out.push(q as QuestionId);
    else warn(`${file}: unknown question tag "${q}"`);
  }
  return out;
}

export const STAKEHOLDERS: Stakeholder[] = Object.entries(stakeholderFiles)
  .flatMap(([path, raw]) => {
    const file = path.split("/").pop()!;
    if (file === "README.md") return [];
    const id = file.replace(/\.md$/, "");
    const parsed = parseFile(raw);
    if (!parsed) {
      warn(`${file}: no frontmatter, skipped`);
      return [];
    }
    const f = parsed.front;
    if (!f.name || !f.role || !f.region || !f.lat || !f.lon) {
      warn(`${file}: missing a required field, skipped`);
      return [];
    }
    const withheld = Boolean(f["consent-status"]);
    if (withheld && f.photo) {
      warn(`${file}: photo on a withheld entry is ignored`);
    }
    const hex = list(f.hex).map(Number);
    const s: Stakeholder = {
      id,
      name: f.name,
      role: f.role,
      place: f.place ?? f.region,
      region: f.region,
      lat: Number(f.lat),
      lon: Number(f.lon),
      date: f.date || undefined,
      questions: qids(f.questions, file),
      anchors: f.anchors ? qids(f.anchors, file) : undefined,
      provisional: f.provisional ? qids(f.provisional, file) : undefined,
      // The body of a withheld file is ignored on purpose: nothing from
      // that conversation may render until consent is resolved.
      learnt: withheld ? [] : bullets(parsed.sections["What they told us"]),
      quote: withheld ? undefined : flow(parsed.sections["Quote"]),
      changed: withheld ? undefined : flow(parsed.sections["What it changed"]),
      photo: !withheld && f.photo ? photoUrl(f.photo) : undefined,
      photoShows: f["photo-shows"] || undefined,
      consent: withheld
        ? {
            status:
              f["consent-status"] === "not-given"
                ? "not-given"
                : "review-pending",
            note: f["consent-note"] ?? "Consent is outstanding.",
          }
        : undefined,
      hex: hex.length === 2 ? [hex[0], hex[1]] : undefined,
      order: Number(f.order ?? 9999),
    };
    return [s];
  })
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

const BY_ID = new Map(STAKEHOLDERS.map((s) => [s.id, s]));

/** Every question a stakeholder is tagged with, stated or provisional. */
export function questionsOf(s: Stakeholder): QuestionId[] {
  return [
    ...new Set([...(s.anchors ?? []), ...s.questions, ...(s.provisional ?? [])]),
  ];
}

/* ---------- the questions ---------- */

const questionFiles = import.meta.glob("../content/questions/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const QUESTION_TITLES = {} as Record<QuestionId, string>;
export const QUESTION_CYCLES = {} as Record<QuestionId, QuestionCycle>;

for (const q of QUESTION_IDS) {
  const path = Object.keys(questionFiles).find((p) =>
    p.endsWith(`/${q.toLowerCase()}.md`),
  );
  const parsed = path ? parseFile(questionFiles[path]) : null;
  if (!parsed || !parsed.front.title) {
    warn(`questions/${q.toLowerCase()}.md missing or without a title`);
    QUESTION_TITLES[q] = q;
    QUESTION_CYCLES[q] = { id: q, title: q, stages: [] };
    continue;
  }
  QUESTION_TITLES[q] = parsed.front.title;
  const stages: CycleStage[] = [];
  for (const stage of STAGE_ORDER) {
    const people: string[] = [];
    const key: string[] = [];
    for (const entry of list(parsed.front[STAGE_KEYS[stage]])) {
      const starred = entry.endsWith("*");
      const id = starred ? entry.slice(0, -1).trim() : entry;
      if (!BY_ID.has(id)) {
        warn(`${q}: stage ${stage} names unknown conversation "${id}"`);
        continue;
      }
      people.push(id);
      if (starred) key.push(id);
    }
    const body = parsed.sections[STAGE_NAMES[stage]] ?? "";
    if (people.length || body) stages.push({ stage, people, key, body });
  }
  QUESTION_CYCLES[q] = { id: q, title: QUESTION_TITLES[q], stages };
}

/**
 * The HONEY stage of one conversation within one question's cycle: the
 * stage list that names it, else Hear — the write-up's own definition of
 * the stage ("Hear - stakeholders"). See questions/README.md.
 */
export function stageOf(q: QuestionId, id: string): HoneyStage {
  for (const st of QUESTION_CYCLES[q].stages) {
    if (st.people.includes(id)) return st.stage;
  }
  return "H";
}

/** Whether the question file marks this conversation as central (`*`). */
export function isKeyTo(q: QuestionId, id: string): boolean {
  return QUESTION_CYCLES[q].stages.some((st) => st.key.includes(id));
}
