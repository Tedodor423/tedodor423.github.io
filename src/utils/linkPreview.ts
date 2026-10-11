import source from "../content/link-previews.md?raw";
import { getPathMapping, type PageEntry } from "./getPathMapping";
import { headingAt, prepareIndex } from "./search";

/** What the preview card shows for a link to one page of the wiki. */
export interface LinkPreview {
  /** The entry's heading, else the page's own title. */
  title: string;
  /** The heading the link's fragment opens at, when it names one. */
  section?: string;
  /** The entry's summary. Absent when none is written. */
  summary?: string;
  /** The entry's image, if it has one. */
  image?: string;
  /** Source and licence of an image that is not the team's own. */
  credit?: string;
}

/** One entry of link-previews.md. */
interface Entry {
  title: string;
  summary?: string;
  image?: string;
  credit?: string;
}

/* `## Card title (/path)`: the words are the card's, the path is the key. */
const HEADING = /^##\s+(.*?)\s*\((\/[^()\s]*)\)$/;
/* `![alt](url)` alone on a line, the target optionally in angle brackets. */
const IMAGE = /^!\[[^\]]*\]\(\s*(?:<([^>]*)>|([^)\s]+))(?:\s+"[^"]*")?\s*\)$/;
const CREDIT = /^credit:\s*(.*)$/i;
const RULE = /^-{3,}$/;

/** Said in the console while `yarn dev` runs, never on the published site. */
const warn = (problem: string) => {
  if (import.meta.env.DEV) console.warn(`link-previews.md: ${problem}`);
};

/**
 * src/content/link-previews.md, read into one entry per page path.
 *
 * Every `##` heading opens an entry and everything up to the next belongs to
 * it. Within an entry, a line that is an image is the image, a line opening
 * `Credit:` is its credit, a `---` is only for the eye, and every other line
 * is the summary, run together. Fenced blocks are stepped over, so the
 * example in the file's own instructions is not read as an entry, and so is
 * everything above the first `##`.
 */
function parse(markdown: string): Map<string, Entry> {
  const entries = new Map<string, Entry>();
  let path = "";
  let entry: Entry | null = null;
  let summary: string[] = [];
  let fenced = false;

  const close = () => {
    if (entry && summary.length) entry.summary = summary.join(" ");
    summary = [];
  };

  for (const line of markdown.split("\n").map((raw) => raw.trim())) {
    if (/^(```|~~~)/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;

    if (/^##\s/.test(line)) {
      close();
      const match = HEADING.exec(line);
      if (!match) {
        warn(`"${line}" has no page path in brackets, so it previews nothing`);
        entry = null;
        continue;
      }
      path = match[2].replace(/(.)\/$/, "$1");
      if (entries.has(path))
        warn(`${path} has two entries; the later one wins`);
      entry = { title: match[1] };
      entries.set(path, entry);
      continue;
    }

    if (!entry || !line || RULE.test(line)) continue;

    const image = IMAGE.exec(line);
    const credit = CREDIT.exec(line);
    if (image) {
      entry.image = image[1] ?? image[2];
      // iGEM servers only (IGEM_WIKI_REQUIREMENTS.md §1). A path on this
      // site passes, for a dev-only image awaiting its upload.
      if (!/^(https:\/\/[^/]+\.igem\.(wiki|org)\/|\/)/i.test(entry.image)) {
        warn(`the image for ${path} is not on static.igem.wiki`);
      }
    } else if (credit) {
      entry.credit = credit[1] || undefined;
    } else {
      summary.push(line);
    }
  }
  close();

  return entries;
}

let pages: Record<string, PageEntry> | null = null;
let entries: Map<string, Entry> | null = null;

/** The route table and the file, read once and kept. */
function load() {
  if (!pages || !entries) {
    pages = getPathMapping();
    entries = parse(source);
    for (const key of entries.keys()) {
      if (!pages[key]) warn(`${key} is not a page in src/pages.ts`);
    }
  }
  return { pages, entries };
}

/**
 * Does now the work the first card would otherwise wait for: reading the
 * route table and this file, and building the search index the section
 * names come from. LinkPreview calls it once the browser is idle.
 */
export function preparePreviews(): void {
  load();
  prepareIndex();
}

/**
 * The preview for a link to `path`, or null when no page lives there.
 *
 * The title, summary and image are the page's entry in link-previews.md, so
 * the card says what that file says and nothing else: no summary there, none
 * on the card; no image there, none on the card. The one thing read from the
 * page itself is the heading a link's fragment lands on.
 */
export function previewOf(path: string, hash: string): LinkPreview | null {
  const { pages, entries } = load();
  const page = pages[path];
  if (!page) return null;
  const entry = entries.get(path);

  let anchor = hash.replace(/^#/, "");
  try {
    anchor = decodeURIComponent(anchor);
  } catch {
    // A malformed escape is left as typed, and matches nothing.
  }

  return {
    title: entry?.title || page.title,
    section: headingAt(path, anchor),
    summary: entry?.summary,
    image: entry?.image,
    credit: entry?.image ? entry.credit : undefined,
  };
}
