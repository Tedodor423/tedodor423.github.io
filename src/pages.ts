// The single route table for the whole wiki.
//
// Every page is a Markdown file in src/content/. This file maps each one to a
// URL, a nav label, an <h1> and a one-line lead. To add a page: create the .md
// file, import it below, and add an entry. Nothing else is needed.
//
// See WIKI_PAGE_RULES.md for how to write a page.
//
// THE HEADER STRUCTURE IS AGREED, not improvised: it lives in
// references/structure_source.md (gitignored team material). Any change to the
// menu below — a page added, removed, renamed, moved or re-pathed — must be
// mirrored there in the same sitting. A PreToolUse hook
// (.claude/hooks/structure-sync.mjs) reminds AI assistants of this on every
// edit to this file; humans, consider yourselves reminded here.
//
// The menu has two visible levels, plus two decorations the structure asks for:
//
//   Section  an overarching non-interactive title ("The project in detail")
//            shown above a run of consecutive groups that share it
//   Group    a dropdown label with no page behind it (Project, Team, ...)
//     Page   the link, optionally with a `subtitle` under it
//
// Home is not in the menu bar. It is marked `hidden` below, so it stays
// routed and searchable while the bar carries only the groups the agreed
// structure lists; the header logo is the way back to it.
//
// A page's own `children` are routed and listed by SectionLinks at the top of
// that page, but never appear in the menu. A page marked `hidden` is routed
// and searchable but absent from the menu entirely — that is where pages the
// agreed header no longer lists live on, so their URLs and inbound links keep
// working until the team decides their fate.
//
// IMPORTANT, paths marked "iGEM standard URL" are fixed by the competition.
// Judges navigate to them directly and will not hunt for a renamed page. The
// grouping below is for humans and is independent of those paths: a page can
// sit anywhere in the menu while living at its required URL. The 2026 standard
// URL list is still uncaptured (IGEM_WIKI_REQUIREMENTS.md §4 GAP) — verify
// /project-description and /project-safety against it when it lands.

import home from "./content/home.md?raw";
import description from "./content/project-description.md?raw";
import timeline from "./content/timeline.md?raw";
import contribution from "./content/contribution.md?raw";
import results from "./content/results.md?raw";
import engineering from "./content/engineering.md?raw";
import beeLab from "./content/bee-lab.md?raw";
import beeLabExperiments from "./content/bee-lab-experiments.md?raw";
import beeLabLabbook from "./content/bee-lab-labbook.md?raw";
import workingWithBees from "./content/working-with-bees.md?raw";
import hardware from "./content/hardware.md?raw";
import userManual from "./content/user-manual.md?raw";
import wetLab from "./content/wet-lab.md?raw";
import wetLabExperiments from "./content/wet-lab-experiments.md?raw";
import wetLabLabbook from "./content/wet-lab-labbook.md?raw";
import model from "./content/model.md?raw";
import software from "./content/software.md?raw";
import economicModelling from "./content/economic-modelling.md?raw";
import ecologicalModelling from "./content/ecological-modelling.md?raw";
import measurement from "./content/measurement.md?raw";
import parts from "./content/parts.md?raw";
import safety from "./content/project-safety.md?raw";
import humanPractices from "./content/human-practices.md?raw";
import caseStudies from "./content/case-studies.md?raw";
import caseStudyAustralia from "./content/case-study-australia.md?raw";
import caseStudyCalifornia from "./content/case-study-california.md?raw";
import future from "./content/future.md?raw";
import sustainability from "./content/sustainability.md?raw";
import entrepreneurship from "./content/entrepreneurship.md?raw";
import education from "./content/education.md?raw";
import team from "./content/team.md?raw";
import partners from "./content/partners.md?raw";
import members from "./content/members.md?raw";
import attributions from "./content/attributions.md?raw";

export interface Page {
  /** Label shown in the menu. */
  name: string;
  /** The page <h1>. */
  title: string;
  /** URL, always lowercase and hyphen-separated. */
  path: string;
  /** Raw Markdown, imported above. */
  content: string;
  /** One-line standfirst under the title. Optional. */
  lead?: string;
  /** Small, muted line under the menu label. Optional. */
  subtitle?: string;
  /** Sub-pages: routed, listed at the top of this page, never in the menu. */
  children?: Page[];
  /** Routed and searchable, but absent from the menu. Top level only. */
  hidden?: boolean;
}

/** A top-level menu label that opens a dropdown and has no page of its own. */
export interface Group {
  name: string;
  children: Page[];
  /** Small, muted line at the top of the dropdown. Optional. */
  subtitle?: string;
  /**
   * Overarching header title. Consecutive groups sharing the same `section`
   * are clustered under one such title in the menu bar. Optional.
   */
  section?: string;
}

export type MenuEntry = Page | Group;

/** A group is the entry with no URL behind it. */
export function isGroup(entry: MenuEntry): entry is Group {
  return !("path" in entry);
}

const Pages: MenuEntry[] = [
  // --- The menu, in header order. Home leads the table because it is the
  // root route, but it is hidden, so the bar starts at Project and the
  // header logo is the only link back to it.
  {
    name: "Home",
    title: "NECTAR",
    path: "/",
    content: home,
    lead: "Oxford iGEM 2026.",
    hidden: true,
  },
  {
    name: "Project",
    children: [
      {
        name: "Description",
        title: "Project Description",
        path: "/project-description", // per structure_source.md — verify against the standard URL list
        content: description,
        lead: "The problem, the idea, and what we set out to build.",
      },
      {
        name: "Engineering",
        title: "Engineering",
        path: "/engineering", // iGEM standard URL
        content: engineering,
        // No lead: the page opens on its own paragraph and then the comb.
      },
      {
        name: "Results",
        title: "Results",
        path: "/results", // iGEM standard URL
        content: results,
        lead: "What we found, and how strongly the evidence supports it.",
      },
      {
        name: "Contribution",
        title: "Contribution",
        path: "/contribution", // iGEM standard URL
        content: contribution,
        lead: "What we leave behind for the teams that come after us.",
      },
      {
        name: "Measurement",
        title: "Measurement",
        path: "/measurement", // iGEM standard URL
        content: measurement,
        lead: "Quantifying dsRNA in bee material, and the methods we had to build to do it.",
      },
      {
        name: "Timeline",
        title: "Timeline",
        path: "/timeline",
        content: timeline,
        lead: "Eight months, five workstreams running at once, and the dates each one turned.",
      },
    ],
  },
  {
    name: "Human practices",
    section: "The project in detail",
    children: [
      {
        name: "Integrated human practices",
        title: "NECTAR in the Real World",
        path: "/human-practices", // iGEM standard URL
        content: humanPractices,
        // No lead: the page opens straight onto the approach + HONEY figure.
      },
      {
        name: "Outreach and Education",
        title: "Public Outreach",
        path: "/education", // iGEM standard URL
        content: education,
        lead: "What we taught, to whom, and what we learned back.",
      },
      {
        name: "Case studies",
        title: "Case Studies",
        path: "/case-studies",
        content: caseStudies,
        lead: "The same technology meets very different realities.",
        children: [
          {
            name: "Australia",
            title: "Case Study: Australia",
            path: "/case-studies/australia",
            content: caseStudyAustralia,
            lead: "Recent establishment, reinvasion pressure and an industry under strain.",
          },
          {
            name: "California",
            title: "Case Study: California",
            path: "/case-studies/california",
            content: caseStudyCalifornia,
            lead: "Migratory beekeeping at enormous scale, and the almond pollination market.",
          },
        ],
      },
      {
        name: "Economical modelling",
        title: "Economic Modelling",
        path: "/economic-modelling",
        content: economicModelling,
        lead: "Allowable cost, manufacturing cost, and the yeast titre they imply.",
      },
    ],
  },
  {
    name: "Wet lab",
    section: "The project in detail",
    children: [
      {
        name: "Wet lab",
        title: "Wet Lab",
        path: "/wet-lab",
        content: wetLab,
        lead: "Making the molecule: construct design, assembly and production.",
      },
      {
        name: "RNA design",
        title: "RNA Design",
        path: "/software", // iGEM standard URL
        content: software,
        lead: "NectarDesigner: how we choose the sequence that silences the mite.",
      },
      {
        name: "Parts",
        title: "Parts",
        path: "/parts", // iGEM standard URL
        content: parts,
        lead: "The modular loop-ended dsRNA part collection.",
      },
      {
        // Was /experiments, an iGEM standard URL. Re-pathed per
        // structure_source.md; if the 2026 standard list keeps /experiments,
        // this has to move back or gain a redirect.
        name: "Experiments & protocols",
        title: "Wet Lab Experiments and Protocols",
        path: "/wet-lab-experiments",
        content: wetLabExperiments,
        lead: "Protocols in enough detail for another team to repeat them, and why yeast is the chassis.",
      },
      {
        name: "Lab book",
        title: "Wet Lab Lab Book",
        path: "/wet-lab-labbook",
        content: wetLabLabbook,
        lead: "The dated record of the wet lab.",
      },
    ],
  },
  {
    name: "Bee lab",
    section: "The project in detail",
    children: [
      {
        name: "Bee lab",
        title: "Bee Lab",
        path: "/bee-lab",
        content: beeLab,
        lead: "Working with live bees: delivery, dosing and the assays we had to invent.",
      },
      {
        name: "Experiments & protocols",
        title: "Bee Lab Experiments and Protocols",
        path: "/bee-lab-experiments",
        content: beeLabExperiments,
        lead: "The bee-lab methods, written to be followed.",
      },
      {
        name: "Safety",
        title: "Safety and Security",
        path: "/project-safety", // per structure_source.md — verify against the standard URL list
        content: safety,
        lead: "Risks of our system, and what we did about each of them.",
      },
      {
        name: "Hardware",
        title: "Hardware",
        path: "/hardware", // iGEM standard URL
        content: hardware,
        lead: "The hive insert and the equipment we built around it.",
      },
      {
        name: "NECTAR user manual",
        title: "NECTAR User Manual",
        path: "/user-manual",
        content: userManual,
        lead: "How a beekeeper would actually use this.",
      },
      {
        name: "Bee research guide (for iGEM teams)",
        title: "How to Work with Bees as an iGEM Team",
        path: "/working-with-bees",
        content: workingWithBees,
        lead: "What we wish another team had told us before our first hive.",
      },
      {
        name: "Lab book",
        title: "Bee Lab Lab Book",
        path: "/bee-lab-labbook",
        content: beeLabLabbook,
        lead: "The dated record of the bee lab, 29 June to 25 September 2026.",
      },
    ],
  },
  {
    name: "Team",
    children: [
      {
        name: "Team members",
        title: "Team",
        path: "/team", // iGEM standard URL
        content: team,
        lead: "The people behind NECTAR.",
        children: [
          {
            name: "Members",
            title: "Team Members",
            path: "/team/members",
            content: members,
            lead: "Who we are.",
          },
        ],
      },
      {
        name: "Attributions",
        title: "Attributions",
        path: "/attributions", // iGEM standard URL
        content: attributions,
        lead: "Who did what, and what help we received.",
      },
      {
        name: "Sponsors and partners",
        title: "Fundraising and Partners",
        path: "/partners",
        content: partners,
        lead: "Who supported this project, and how.",
      },
    ],
  },

  // --- Routed, but not in the agreed header. Reached by URL and by links
  // inside other pages. Each is either awaiting a decision (fold in, or drop)
  // or lives at an iGEM standard URL that must keep resolving regardless of
  // the menu.
  {
    name: "NECTAR for the future",
    title: "NECTAR for the Future",
    path: "/future",
    content: future,
    lead: "Where this goes after iGEM.",
    hidden: true,
  },
  {
    name: "Dry lab / modelling",
    title: "Dry Lab and Modelling",
    path: "/model", // iGEM standard URL
    content: model,
    lead: "The models, their assumptions, and the decisions they changed.",
    hidden: true,
    children: [
      {
        name: "Ecological modelling",
        title: "Ecological Modelling",
        path: "/ecological-modelling",
        content: ecologicalModelling,
        lead: "Colony and Varroa dynamics, and what treatment efficacy has to reach.",
      },
    ],
  },
  {
    name: "Sustainable development",
    title: "Sustainable Development",
    path: "/sustainability", // iGEM standard URL
    content: sustainability,
    lead: "Which SDGs we affect, including where we affect them negatively.",
    hidden: true,
  },
  {
    name: "Entrepreneurship",
    title: "Entrepreneurship",
    path: "/entrepreneurship", // iGEM standard URL
    content: entrepreneurship,
    lead: "The product, the user, the cost, and the route to market.",
    hidden: true,
  },
];

export default Pages;
