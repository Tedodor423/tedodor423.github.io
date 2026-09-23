import { createContext } from "react";

/**
 * The words a reader searched for, for text that is not Markdown.
 *
 * The rehype plugin in markTree.ts marks the rendered Markdown, but a page can
 * also carry components with text of their own (the stakeholder profiles are
 * read from src/data, not from the page file). Those sit below MarkdownPage in
 * the tree but outside the Markdown, so the words reach them through this
 * context rather than through a chain of props that every component in between
 * would have to carry.
 *
 * Empty everywhere except on a page opened from a search result. Read it with
 * the Marked component; this file holds only the context, because a module
 * that exports both a context and a component breaks fast refresh.
 */
export const MarksContext = createContext<string[]>([]);
