import Pages, { isGroup, type MenuEntry, type Page } from "../pages.ts";

/** One view of a switcher page (Page.switcher). */
export interface SwitchView {
  name: string;
  path: string;
  lead?: string;
  content: string;
}

/** The switcher page a URL belongs to, and which of its views it opens. */
export interface SwitchInfo {
  /** The switcher page's own path, title, lead and Markdown. */
  path: string;
  title: string;
  lead?: string;
  shared: string;
  views: SwitchView[];
  /** Index into `views` of the view this URL opens. */
  active: number;
}

export interface PageEntry {
  name: string;
  title: string;
  /**
   * This URL's own Markdown. For a switcher view that is the view alone,
   * which is what the search index reads; the page composes the rest.
   */
  content: string;
  lead?: string;
  layout?: Page["layout"];
  centredTitle?: boolean;
  titleInBody?: boolean;
  switcher?: SwitchInfo;
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
      layout: page.layout,
      centredTitle: page.centredTitle,
      titleInBody: page.titleInBody,
    };
    page.children?.forEach(addPage);

    if (page.switcher && page.children?.length) {
      const views = page.children.map((child) => ({
        name: child.name,
        path: child.path,
        lead: child.lead,
        content: child.content,
      }));
      const base = {
        path: page.path,
        title: page.title,
        lead: page.lead,
        shared: page.content,
        views,
      };
      map[page.path].switcher = { ...base, active: 0 };
      views.forEach((view, i) => {
        map[view.path].switcher = { ...base, active: i };
      });
    }
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
