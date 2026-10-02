/* The engineering cycles, read from src/content/cycles/.
 *
 * One Markdown file per cycle, and they are the record: the engineering page
 * itself is now a paragraph and a comb of hexagons, so these files are the only
 * place this prose lives. Editing a cycle means opening its file and writing in
 * it. Nothing is typed into this module.
 *
 * A file looks like this, and the frontmatter is the whole of the format:
 *
 *   ---
 *   number: 3.3b
 *   lab: wet                     <- dry | wet | bee
 *   workstream: Workstream 3: Measuring dsRNA in bee material
 *   status: Demonstrated. The one to read if you read only one.
 *   ---
 *
 *   # Is the band in our water control dimer or contamination?
 *
 *   **Question.** ...
 *
 *   **Design.** ...
 *
 * Order on the page is filename order, which is why the files carry a numeric
 * prefix. To add a cycle, drop in a file; to reorder, renumber the prefixes.
 * Nothing else needs touching.
 *
 * THE SEVEN BEATS FOLD INTO FOUR. WIKI_PAGE_RULES.md fixes the shape of a cycle
 * as Question -> Design -> Build -> Test -> Result -> What we learnt -> What it
 * changed. DBTL has four stages, so: Question becomes the title and the framing
 * line, Result and any Limitation join Test (they are what the test produced),
 * and What it changed joins What we learnt (they are what the team took from
 * it). A cycle not yet written into the beats parses to empty stages, and the
 * hexagon says so rather than inventing them.
 *
 * ANCHORS. A cycle's id is the one the rest of the wiki already links to:
 * contribution.md, results.md, timeline.md and data/timeline.ts hold some fifty
 * links of the form /engineering#cycle-3-3b. The id is built with the shared
 * headingId() so those keep resolving, and the gallery opens the cycle whose id
 * the URL names.
 */

import { headingId } from "./headingId";
import families from "../content/cycle-families.md?raw";
import { EVENTS } from "../data/timeline";

export type Lab = "dry" | "wet" | "bee";
export type StageKey = "design" | "build" | "test" | "learn";

export interface Cycle {
  /** `cycle-3-3b`. What the rest of the wiki links to. */
  id: string;
  /** "1.1", "3.3b", "B1", "M1-M3". */
  number: string;
  question: string;
  lab: Lab;
  /** The workstream or lab heading this cycle sat under. */
  workstream: string;
  status: string;
  /** The `**Question.**` paragraph, label stripped. Markdown. */
  framing: string;
  /** Prose with no beat label, for a cycle not yet written into the beats. */
  summary: string;
  /** Markdown per stage. Empty where the file has not written that beat. */
  stages: Record<StageKey, string>;
  /**
   * Roughly when this was explored, as a month or a span of months: "July",
   * "July to August". Empty where nothing says, and then the page shows no date
   * rather than a guess. See whenOf() for where it comes from.
   */
  when: string;
  /** The source file, so an editor knows which one to open. */
  file: string;
}

/** One overarching cycle: a workstream, and the iterations that turned it. */
export interface Family {
  /** `family-workstream-1-making-the-molecule`. */
  id: string;
  /** The `##` heading, which is also the key the cycle files join on. */
  name: string;
  /** The overarching question. Empty where the team has not stated one. */
  question: string;
  /** Markdown standfirst under the question. */
  blurb: string;
  lab: Lab;
  cycles: Cycle[];
}

export const LAB_NAME: Record<Lab, string> = {
  dry: "Dry lab",
  wet: "Wet lab",
  bee: "Bee lab",
};

/** Selector order, as the team asked for it. */
export const LAB_ORDER: Lab[] = ["dry", "wet", "bee"];

export const STAGE_ORDER: StageKey[] = ["design", "build", "test", "learn"];

export const STAGE_NAME: Record<StageKey, string> = {
  design: "Design",
  build: "Build",
  test: "Test",
  learn: "Learn",
};

/**
 * A family's name split at its colon: "Workstream 1" and "Making the molecule",
 * "Bee lab" and "Delivering a dose".
 *
 * A closed hexagon is small, and a flat-top one offers only about half its width
 * as a rectangle to set text in, so it shows the short half as its label with the
 * other half as a kicker over it. The overarching question is too long for that
 * box; it belongs to the opened panel, and to the hover preview.
 */
export function splitName(name: string): { lead: string; rest: string } {
  const at = name.indexOf(": ");
  return at === -1
    ? { lead: "", rest: name }
    : { lead: name.slice(0, at), rest: name.slice(at + 2) };
}

/* ---------- parsing ---------- */

/** Which stage a beat label feeds. `null` continues the stage before it. */
function beatOf(label: string): StageKey | "status" | "question" | null {
  const text = label.trim().toLowerCase();
  if (text.startsWith("status")) return "status";
  if (text.startsWith("question")) return "question";
  if (text.startsWith("design")) return "design";
  if (text.startsWith("build")) return "build";
  if (text.startsWith("test")) return "test";
  if (text.startsWith("result")) return "test";
  if (text.startsWith("limitation")) return "test";
  if (text.startsWith("what we learnt")) return "learn";
  if (text.startsWith("what it changed")) return "learn";
  if (text.startsWith("decision")) return "learn";
  // The team writes its own DBTL notes as Design/Build/Test/Learn, so a cycle
  // pasted in from a write-up uses the bare stage name. Without this it parses as
  // a continuation of Test and the Learn stage silently reads as empty.
  if (text.startsWith("learn")) return "learn";
  return null;
}

/**
 * Everything a hexagon has to hold.
 *
 * Paragraphs, lists, blockquotes and tables all go in. Tables were left out
 * while the full cycle still rendered further down the page; now the hexagon is
 * the only place this content exists, so leaving anything out would put it
 * beyond reach. Only the file's own `# ` title and fenced blocks are dropped.
 */
function isProse(block: string): boolean {
  return !/^\s{0,3}(#|```|~~~)/.test(block);
}

/** A paragraph that is only its own bold lead, because a table follows it. */
function isBareLead(block: string): boolean {
  return /^\*\*[^*]+\*\*\s*$/.test(block.trim());
}

/** A block's leading `**Bold lead.**`, if it has one. */
function leadOf(block: string): string | null {
  const match = /^\*\*([^*]+)\*\*/.exec(block.trimStart());
  return match ? match[1] : null;
}

/**
 * Drops a block's own label when it only repeats the stage heading above it.
 * `**Design.**` goes; `**Result: a clean null.**` and `**What it changed.**`
 * stay, because they say something the stage name does not.
 */
function stripOwnLabel(block: string, stage: StageKey): string {
  const match = /^\*\*([^*]+)\*\*\s*/.exec(block);
  if (!match) return block;
  const label = match[1]
    .trim()
    .replace(/[.:,]+$/, "")
    .toLowerCase();
  return label === stage ? block.slice(match[0].length) : block;
}

/** Blocks, split on blank lines, fenced blocks kept whole. */
function blocksOf(markdown: string): string[] {
  const blocks: string[] = [];
  let held: string[] = [];
  let fenced = false;

  const flush = () => {
    if (held.some((line) => line.trim())) blocks.push(held.join("\n").trim());
    held = [];
  };

  for (const line of markdown.split("\n")) {
    if (/^\s{0,3}(```|~~~)/.test(line)) fenced = !fenced;
    if (!fenced && !line.trim()) {
      flush();
      continue;
    }
    held.push(line);
  }
  flush();

  return blocks;
}

/** The `---` fenced header. Split on the first colon, so a value may hold one. */
function frontmatterOf(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { meta: {}, body: raw };

  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const at = line.indexOf(":");
    if (at === -1) continue;
    meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  return { meta, body: raw.slice(match[0].length) };
}

function isLab(value: string | undefined): value is Lab {
  return value === "dry" || value === "wet" || value === "bee";
}

/* ---------- when a cycle was explored ---------- */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Roughly when a cycle was worked on, derived rather than written down.
 *
 * src/data/timeline.ts is the dated record, and its entries already point at the
 * cycles they belong to (`/engineering#cycle-2-2`). So the months come from
 * there: first and last dated entry that links to this cycle, as a month or a
 * span. That keeps one set of dates in the project instead of two, and a new
 * timeline entry updates the cycle without anyone editing it.
 *
 * Ten of the twenty-four cycles have no dated entry pointing at them, and they
 * get nothing. A date is a claim about when an experiment happened, and the
 * dates written into a cycle's own prose are not usable for this: 4.2's are
 * deadlines in a TODO, not the month it was explored. Where the record does not
 * say, the page does not say either. A cycle file can carry its own
 * `when: July` to fill the gap, which wins over anything derived here.
 */
function whenOf(id: string): string {
  const dates: string[] = [];
  for (const event of EVENTS) {
    const links = event.links ?? [];
    if (!links.some((link) => link.href === `/engineering#${id}`)) continue;
    if (event.date) dates.push(event.date);
    if (event.until) dates.push(event.until);
  }
  if (!dates.length) return "";

  dates.sort();
  const first = MONTHS[new Date(dates[0]).getUTCMonth()];
  const last = MONTHS[new Date(dates[dates.length - 1]).getUTCMonth()];
  return first === last ? first : `${first} to ${last}`;
}

function parseCycle(file: string, raw: string): Cycle {
  const { meta, body } = frontmatterOf(raw);

  // The file's `# ` line is the question. Taken out of the body so it cannot
  // turn up inside a stage.
  const title = /^#\s+(.*)$/m.exec(body);
  const question = title ? title[1].trim() : "";
  const rest = title ? body.replace(title[0], "") : body;

  const number = meta.number ?? "";
  const stages: Record<StageKey, string[]> = {
    design: [],
    build: [],
    test: [],
    learn: [],
  };
  const summary: string[] = [];
  let framing = "";
  let current: StageKey | null = null;

  for (const block of blocksOf(rest)) {
    const lead = leadOf(block);
    const beat = lead ? beatOf(lead) : null;

    if (beat === "status") {
      current = null;
      continue;
    }
    if (beat === "question") {
      framing = block.replace(/^\*\*[^*]+\*\*\s*/, "");
      current = null;
      continue;
    }
    if (beat) current = beat;
    if (!isProse(block) || isBareLead(block)) continue;
    if (current) stages[current].push(stripOwnLabel(block, current));
    else summary.push(block);
  }

  // Built from the same string headingId saw on the old page, so every
  // /engineering#cycle-... link across the wiki still resolves.
  const id = headingId(`${number} · ${question}`);

  return {
    id,
    number,
    question,
    lab: isLab(meta.lab) ? meta.lab : "wet",
    workstream: meta.workstream ?? "",
    status: meta.status ?? "",
    framing,
    summary: summary.join("\n\n"),
    stages: {
      design: stages.design.join("\n\n").trim(),
      build: stages.build.join("\n\n").trim(),
      test: stages.test.join("\n\n").trim(),
      learn: stages.learn.join("\n\n").trim(),
    },
    // A file may state its own month; otherwise the dated record supplies it.
    when: meta.when ?? whenOf(id),
    file,
  };
}

/* Every cycle file, in filename order. Vite inlines these at build time, so
 * there is no fetch and no loading state, and adding a file is the only step in
 * adding a cycle. */
const FILES = import.meta.glob<string>("../content/cycles/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export const CYCLES: Cycle[] = Object.keys(FILES)
  .sort()
  .map((file) => parseCycle(file.replace(/^.*\//, ""), FILES[file]));

/* ---------- the six overarching cycles ---------- */

/**
 * Splits cycle-families.md into its `##` sections, and joins each to the cycles
 * whose `workstream:` names it.
 *
 * The order of the sections in that file is the order of the comb. A family with
 * no cycles is dropped rather than drawn empty, and a cycle whose `workstream:`
 * matches no section would be lost, so that case makes its own family from the
 * name it gave, which shows up on the page as an odd hexagon rather than
 * vanishing quietly.
 */
function parseFamilies(markdown: string, cycles: Cycle[]): Family[] {
  const sections = new Map<string, string[]>();
  let name = "";
  let fenced = false;

  for (const line of markdown.split("\n")) {
    if (/^\s{0,3}(```|~~~)/.test(line)) fenced = !fenced;
    if (!fenced) {
      const heading = /^##\s+(.*)$/.exec(line);
      if (heading) {
        name = heading[1].trim();
        sections.set(name, []);
        continue;
      }
    }
    if (name) sections.get(name)?.push(line);
  }

  const byName = new Map<string, Cycle[]>();
  for (const cycle of cycles) {
    const held = byName.get(cycle.workstream);
    if (held) held.push(cycle);
    else byName.set(cycle.workstream, [cycle]);
  }

  const families: Family[] = [];
  const build = (name: string, body: string) => {
    const own = byName.get(name) ?? [];
    if (!own.length) return;

    // The `**Question.**` paragraph is the title; the rest is the standfirst.
    const blocks = blocksOf(body);
    let question = "";
    const blurb: string[] = [];
    for (const block of blocks) {
      const lead = leadOf(block);
      if (!question && lead && /^question/i.test(lead.trim())) {
        question = block.replace(/^\*\*[^*]+\*\*\s*/, "").replace(/\s+/g, " ");
        continue;
      }
      if (!/^\s{0,3}(<!--|#)/.test(block)) blurb.push(block);
    }

    families.push({
      id: `family-${headingId(name)}`,
      name,
      /* A section holding one turn needs no question of its own: that turn's
       * question IS the overarching one, and repeating it in the family file
       * would be two copies to keep in step. The five bee lab and dry lab
       * sections work this way. */
      question: question || (own.length === 1 ? own[0].question : ""),
      blurb: blurb.join("\n\n").trim(),
      lab: own[0].lab,
      cycles: own,
    });
    byName.delete(name);
  };

  for (const [heading, lines] of sections) build(heading, lines.join("\n"));
  // Anything the family file does not mention, so it cannot disappear.
  for (const orphan of [...byName.keys()]) build(orphan, "");

  return families;
}

export const FAMILIES: Family[] = parseFamilies(families, CYCLES);

/** The Markdown of one cycle, flattened, for the search index. */
export function cycleText(cycle: Cycle): string {
  return [
    cycle.status,
    cycle.framing,
    cycle.summary,
    ...STAGE_ORDER.map((stage) => cycle.stages[stage]),
  ]
    .filter(Boolean)
    .join("\n\n");
}
