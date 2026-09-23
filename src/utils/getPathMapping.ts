import Pages, { isGroup, type MenuEntry, type Page } from "../pages.ts";

export interface PageEntry {
  name: string;
  title: string;
  content: string;
  lead?: string;
}

/**
 * Flattens the page tree in pages.ts into a flat path -> page map, so the
 * router can register one route per page regardless of menu depth.
 *
 * Menu groups have no page of their own, so they contribute nothing here
 * beyond their children.
 */
export const getPathMapping = (): Record<string, PageEntry> => {
  const map: Record<string, PageEntry> = {};

  const addPage = (page: Page) => {
    map[page.path] = {
      name: page.name,
      title: page.title,
      content: page.content,
      lead: page.lead,
    };
    page.children?.forEach(addPage);
  };

  const walk = (entries: MenuEntry[]) => {
    entries.forEach((entry) => {
      if (isGroup(entry)) {
        walk(entry.children);
      } else {
        addPage(entry);
      }
    });
  };

  walk(Pages);
  return map;
};
