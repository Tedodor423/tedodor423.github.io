/* The stakeholder record and the seven HIVE questions, loaded from Markdown.
 *
 * The content lives where the team can edit it without touching code:
 *
 *   - one file per conversation in `src/content/stakeholders/*.md`
 *     (frontmatter for the fields, sections for the key points, why we
 *     interviewed them, what we learned, the verbatim quote and how we
 *     implemented the advice);
 *   - one file per question in `src/content/questions/q1.md` … `q7.md`
 *     (frontmatter for the title and the per-stage people, sections for the
 *     summary and each stage of the cycle panel).
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

/** The HIVE questions the page is organised around. */
export type QuestionId = "Q1" | "Q2" | "Q3" | "Q4" | "Q5" | "Q6" | "Q7";

export const QUESTION_IDS: QuestionId[] = [
  "Q1",
  "Q2",
  "Q3",
  "Q4",
  "Q5",
  "Q6",
  "Q7",
];

/** The four stages of the team's HIVE loop, in cycle order. */
export type HiveStage = "H" | "I" | "V" | "E";

export const STAGE_ORDER: HiveStage[] = ["H", "I", "V", "E"];

export const STAGE_NAMES: Record<HiveStage, string> = {
  H: "Hear",
  I: "Investigate",
  V: "Verdict",
  E: "Evaluate",
};

/** Frontmatter key and body heading for each stage, in the question files. */
const STAGE_KEYS: Record<HiveStage, string> = {
  H: "hear",
  I: "investigate",
  V: "verdict",
  E: "evaluate",
};

/** The kinds of stakeholder, in the order the team's write-up groups them. */
export const GROUPS = [
  "Academics",
  "Industry",
  "Beekeepers",
  "Regulators",
] as const;

export type StakeholderGroup = (typeof GROUPS)[number];

export interface Stakeholder {
  id: string;
  /** As written in the source. */
  name: string;
  /** What the write-up heads a group interview with, where it is not the
   * names: "Comvita", "United States Federal Regulators". */
  label?: string;
  /** Role and institution, as written in the source. */
  role: string;
  /** Human-readable place, shown on the card. */
  place: string;
  /** Country, shown instead of `place` for a withheld interview. */
  region: string;
  /** Which kind of stakeholder, as the write-up groups them. */
  group: StakeholderGroup;
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
  /** The write-up's bullet points: what the card on the map shows. */
  points: string[];
  /** Why the team chose this conversation, where the write-up says. */
  why?: string;
  /** What we learnt from them, transcribed: bullets or paragraphs. */
  learnt: string[];
  /** Whether `learnt` is a list of points rather than paragraphs. */
  learntIsList: boolean;
  /** A verbatim quote, exactly as the team transcribed it. */
  quote?: string;
  /** How it changed the project, where the source states it. */
  changed?: string;
  /** Profile photograph URL. Never set for a withheld entry. */
  photo?: string;
  /** Where to try next if `photo` does not load. See localPhotos. */
  photoFallbacks?: string[];
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
  stage: HiveStage;
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
  /** The question in one paragraph, shown above its stages. Plain Markdown. */
  summary: string;
  /** Only stages with people or text, in H > I > V > E order. */
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

/** A section written either as bullets or as prose: the bullets, or the
 * paragraphs (split at blank lines) each reflowed to one string. */
function pointsOrParagraphs(section: string | undefined): {
  items: string[];
  list: boolean;
} {
  if (!section) return { items: [], list: false };
  if (/^\s*- /m.test(section)) return { items: bullets(section), list: true };
  const items = section
    .split(/\n\s*\n/)
    .map((para) => flow(para))
    .filter((para): para is string => Boolean(para));
  return { items, list: false };
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

/**
 * TEMPORARY FALLBACK, as for the comb icons and the hive badge. Until the
 * upload is done, a published build that cannot load the static.igem.wiki
 * photo tries the original in the gitignored public/local/, which the
 * GitHub Pages preview fills from wiki-assets-source/stakeholder-photos/ and
 * the wiki's own CI never has. The originals are jpg or png and nothing here
 * knows which, so both are tried. Once the static.igem.wiki URLs answer,
 * drop this and photoFallbacks.
 */
function localPhotos(basename: string): string[] {
  if (import.meta.env.DEV) return [];
  const base = `${import.meta.env.BASE_URL}local/stakeholder-photos/${basename}`;
  return [`${base}.jpg`, `${base}.png`];
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
    const group = GROUPS.find((g) => g === f.group);
    if (!group) {
      warn(
        `${file}: group "${f.group ?? ""}" is not one of ${GROUPS.join(", ")}`,
      );
    }
    const learnt = withheld
      ? { items: [], list: false }
      : pointsOrParagraphs(parsed.sections["What we learned"]);
    const s: Stakeholder = {
      id,
      name: f.name,
      label: f.label || undefined,
      role: f.role,
      place: f.place ?? f.region,
      region: f.region,
      // Unknown or missing goes last rather than vanishing from the record.
      group: group ?? "Regulators",
      lat: Number(f.lat),
      lon: Number(f.lon),
      date: f.date || undefined,
      questions: qids(f.questions, file),
      anchors: f.anchors ? qids(f.anchors, file) : undefined,
      provisional: f.provisional ? qids(f.provisional, file) : undefined,
      // The body of a withheld file is ignored on purpose: nothing from
      // that conversation may render until consent is resolved.
      points: withheld ? [] : bullets(parsed.sections["Key points"]),
      why: withheld ? undefined : flow(parsed.sections["Why we interviewed"]),
      learnt: learnt.items,
      learntIsList: learnt.list,
      quote: withheld ? undefined : flow(parsed.sections["Quote"]),
      changed: withheld
        ? undefined
        : flow(
            parsed.sections["How we implemented the advice to change NECTAR"],
          ),
      photo: !withheld && f.photo ? photoUrl(f.photo) : undefined,
      photoFallbacks: !withheld && f.photo ? localPhotos(f.photo) : undefined,
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

/** What the card on the map lists: the write-up's bullet points, or, for a
 * record written only as bullets, those (they are its key points). */
export function cardPointsOf(s: Stakeholder): string[] {
  if (s.points.length) return s.points;
  return s.learntIsList ? s.learnt : [];
}

/** The heading a conversation goes under: the label for a group interview,
 * otherwise the names. */
export const titleOf = (s: Stakeholder) => s.label ?? s.name;

/**
 * Where a conversation's full write-up sits, at the foot of the human
 * practices page (StakeholderRecord). The card's "Read full interview" link,
 * the list beside the record and the search index all use this, so they
 * cannot drift apart.
 */
export function recordAnchor(id: string): string {
  return `sm-${id}`;
}

/** The stakeholder map itself, which the small map beside the interviews
 * links back up to. */
export const MAP_ANCHOR = "stakeholder-map";

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
    QUESTION_CYCLES[q] = { id: q, title: q, summary: "", stages: [] };
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
  QUESTION_CYCLES[q] = {
    id: q,
    title: QUESTION_TITLES[q],
    summary: parsed.sections["Summary"] ?? "",
    stages,
  };
}

/**
 * The HIVE stage of one conversation within one question's cycle: the
 * stage list that names it, else Hear — the write-up's own definition of
 * the stage ("Hear - stakeholders"). See questions/README.md.
 */
export function stageOf(q: QuestionId, id: string): HiveStage {
  for (const st of QUESTION_CYCLES[q].stages) {
    if (st.people.includes(id)) return st.stage;
  }
  return "H";
}

/** Whether the question file marks this conversation as central (`*`). */
export function isKeyTo(q: QuestionId, id: string): boolean {
  return QUESTION_CYCLES[q].stages.some((st) => st.key.includes(id));
}

/* ---------- where a search result lands ---------- */

/**
 * The fragments that open a question on the map: `hive-q3` opens Q3 on its
 * summary, `hive-q3-verdict` opens it with the HIVE write-up unfolded at
 * Verdict. The search index builds results with these (src/utils/search.ts)
 * and StakeholderMap answers to them, so the two cannot drift apart.
 */
export function questionAnchor(q: QuestionId): string {
  return `hive-${q.toLowerCase()}`;
}

export function stageAnchor(q: QuestionId, stage: HiveStage): string {
  return `${questionAnchor(q)}-${STAGE_KEYS[stage]}`;
}

/** What a fragment asks the map to open, or null for any other fragment. */
export function parseHiveAnchor(
  hash: string,
): { q: QuestionId; stage: HiveStage | null } | null {
  let id: string;
  try {
    id = decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return null;
  }
  const m = /^hive-(q\d)(?:-([a-z]+))?$/.exec(id);
  if (!m) return null;
  const q = m[1].toUpperCase() as QuestionId;
  if (!QUESTION_IDS.includes(q)) return null;
  if (!m[2]) return { q, stage: null };
  const stage = STAGE_ORDER.find((s) => STAGE_KEYS[s] === m[2]);
  return stage ? { q, stage } : null;
}
