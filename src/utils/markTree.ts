import type { Element, Root, RootContent } from "hast";
import { highlight } from "./search";

/**
 * Marks the searched words in a rendered Markdown page.
 *
 * Written as a rehype plugin, so the marks become part of the tree React
 * renders. React then owns them, and nothing has to be re-applied, undone or
 * kept in step after a navigation, which is the trouble with highlighting by
 * walking the finished DOM instead.
 *
 * It splits text nodes only. Element structure, attributes and order are left
 * exactly as they were, so a match spanning a link or an emphasis is marked in
 * the parts that carry it rather than breaking the markup around it.
 *
 * Used by MarkdownPage; kept out of it so the walk can be tested on its own.
 */

/** Code is quoted, not prose: marking inside it would change what it says. */
const UNMARKED = new Set(["code", "pre"]);

/** Marks every occurrence of `forms` in the text nodes under `node`. */
export function markTree(node: Root | Element, forms: string[]): void {
  if (!node.children?.length) return;

  const out: RootContent[] = [];
  let marked = false;

  for (const child of node.children) {
    if (child.type === "element" && !UNMARKED.has(child.tagName)) {
      markTree(child, forms);
    }
    if (child.type !== "text") {
      out.push(child);
      continue;
    }

    const segments = highlight(child.value, forms);
    if (segments.length === 1 && !segments[0].match) {
      out.push(child);
      continue;
    }

    marked = true;
    for (const segment of segments) {
      out.push(
        segment.match
          ? {
              type: "element",
              tagName: "mark",
              properties: { className: ["page-match"] },
              children: [{ type: "text", value: segment.text }],
            }
          : { type: "text", value: segment.text },
      );
    }
  }

  if (marked) node.children = out;
}

/** `markTree` as a rehype plugin, for react-markdown's `rehypePlugins`. */
export function rehypeMark(forms: string[]) {
  return () => (tree: Root) => markTree(tree, forms);
}
