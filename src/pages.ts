// The single route table for the whole wiki.
//
// Every page is a Markdown file in src/content/. This file maps each one to a
// URL, a nav label, an <h1> and a one-line lead. To add a page: create the .md
// file, import it below, and add an entry. Nothing else is needed.
//
// See WIKI_PAGE_RULES.md for how to write a page.
//
// The menu has exactly two visible levels:
//
//   Group    a dropdown label with no page behind it (Project, Team, ...)
//     Page   the link, optionally with a `subtitle` under it
//
// A page's own `children` are routed and listed by SectionLinks at the top of
// that page, but never appear in the menu. That is how RNA design, the lab
// books and the case studies stay reachable without a third menu level.
//
// IMPORTANT, paths marked "iGEM standard URL" are fixed by the competition.
// Judges navigate to them directly and will not hunt for a renamed page. The
// grouping below is for humans and is independent of those paths: a page can
// sit anywhere in the menu while living at its required URL.

import home from "./content/home.md?raw";
import description from "./content/description.md?raw";
import timeline from "./content/timeline.md?raw";
import contribution from "./content/contribution.md?raw";
import results from "./content/results.md?raw";
import engineering from "./content/engineering.md?raw";
import beeLab from "./content/bee-lab.md?raw";
import beeLabNotebook from "./content/bee-lab-notebook.md?raw";
import wetLab from "./content/wet-lab.md?raw";
import yeast from "./content/yeast.md?raw";
import experiments from "./content/experiments.md?raw";
import model from "./content/model.md?raw";
import software from "./content/software.md?raw";
import economicModelling from "./content/economic-modelling.md?raw";
import ecologicalModelling from "./content/ecological-modelling.md?raw";
import measurement from "./content/measurement.md?raw";
import parts from "./content/parts.md?raw";
import safety from "./content/safety-and-security.md?raw";
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
}

/** A top-level menu label that opens a dropdown and has no page of its own. */
export interface Group {
  name: string;
  children: Page[];
}

export type MenuEntry = Page | Group;

/** A group is the entry with no URL behind it. */
export function isGroup(entry: MenuEntry): entry is Group {
  return !("path" in entry);
}

const Pages: MenuEntry[] = [
  // --- Route-only pages. No menu entry; reached from the wordmark or from
  // links inside other pages.
  {
    name: "Home",
    title: "NECTAR",
    path: "/",
    content: home,
    lead: "Oxford iGEM 2026.",
  },
  {
    name: "NECTAR for the future",
    title: "NECTAR for the Future",
    path: "/future",
    content: future,
    lead: "Where this goes after iGEM.",
  },
  {
    name: "Team",
    title: "Team",
    path: "/team", // iGEM standard URL
    content: team,
    lead: "The people behind NECTAR.",
  },

  // --- The menu.
  {
    name: "Project",
    children: [
      {
        name: "Project description",
        subtitle: "what is NECTAR",
        title: "Project Description",
        path: "/description", // iGEM standard URL
        content: description,
        lead: "The problem, the idea, and what we set out to build.",
      },
      {
        name: "Contribution and Results",
        title: "Results",
        path: "/results", // iGEM standard URL
        content: results,
        lead: "What we found, and how strongly the evidence supports it.",
        children: [
          {
            name: "Contribution",
            title: "Contribution",
            path: "/contribution", // iGEM standard URL
            content: contribution,
            lead: "What we leave behind for the teams that come after us.",
          },
        ],
      },
      {
        name: "Timeline",
        subtitle: "when is NECTAR",
        title: "Timeline",
        path: "/timeline",
        content: timeline,
        lead: "Eight months, five workstreams running at once, and the dates each one turned.",
      },
    ],
  },
  {
    name: "Building NECTAR",
    children: [
      {
        name: "Our engineering cycles",
        title: "Engineering NECTAR",
        path: "/engineering", // iGEM standard URL
        content: engineering,
        lead: "Design, Build, Test, Learn, and what each turn of the cycle changed.",
      },
      {
        name: "Bee lab",
        subtitle: "experiments, bee biology",
        title: "Bee Lab",
        path: "/bee-lab",
        content: beeLab,
        lead: "Working with live bees: delivery, dosing and the assays we had to invent.",
        children: [
          {
            name: "Experiments, lab book",
            title: "Bee Lab, Experiments and Lab Book",
            path: "/bee-lab/notebook",
            content: beeLabNotebook,
            lead: "Bee lab protocols and the dated record.",
          },
        ],
      },
      {
        name: "Wet lab",
        subtitle: "RNA",
        title: "Wet Lab",
        path: "/wet-lab",
        content: wetLab,
        lead: "Making the molecule: construct design, assembly and production.",
        children: [
          {
            name: "Experiments, lab book",
            title: "Experiments and Lab Book",
            path: "/experiments", // iGEM standard URL
            content: experiments,
            lead: "Protocols in enough detail for another team to repeat them.",
          },
          {
            name: "Yeast",
            title: "Yeast",
            path: "/yeast",
            content: yeast,
            lead: "Why S. cerevisiae, and how we engineered it to make loop-ended dsRNA.",
          },
        ],
      },
      {
        name: "Dry lab / modelling",
        subtitle: "RNA design, econ and ecol modelling",
        title: "Dry Lab and Modelling",
        path: "/model", // iGEM standard URL
        content: model,
        lead: "The models, their assumptions, and the decisions they changed.",
        children: [
          {
            name: "RNA design",
            title: "RNA Design",
            path: "/software", // iGEM standard URL
            content: software,
            lead: "NectarDesigner: how we choose the sequence that silences the mite.",
          },
          {
            name: "Economical modelling",
            title: "Economic Modelling",
            path: "/economic-modelling",
            content: economicModelling,
            lead: "Allowable cost, manufacturing cost, and the yeast titre they imply.",
          },
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
        name: "Measurement",
        title: "Measurement",
        path: "/measurement", // iGEM standard URL
        content: measurement,
        lead: "Quantifying dsRNA in bee material, and the methods we had to build to do it.",
      },
      {
        name: "Parts design",
        title: "Parts",
        path: "/parts", // iGEM standard URL
        content: parts,
        lead: "The modular loop-ended dsRNA part collection.",
      },
      {
        name: "Safety",
        title: "Safety and Security",
        path: "/safety-and-security", // iGEM standard URL
        content: safety,
        lead: "Risks of our system, and what we did about each of them.",
      },
    ],
  },
  {
    name: "NECTAR in the real world",
    children: [
      {
        name: "Human practices",
        title: "NECTAR in the Real World",
        path: "/human-practices", // iGEM standard URL
        content: humanPractices,
        lead: "Who we spoke to, what they told us, and what it changed.",
      },
      {
        name: "Public outreach",
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
    ],
  },
  {
    name: "NECTAR for the future",
    children: [
      {
        name: "Sustainable development",
        title: "Sustainable Development",
        path: "/sustainability", // iGEM standard URL
        content: sustainability,
        lead: "Which SDGs we affect, including where we affect them negatively.",
      },
      {
        name: "Entrepreneurship",
        title: "Entrepreneurship",
        path: "/entrepreneurship", // iGEM standard URL
        content: entrepreneurship,
        lead: "The product, the user, the cost, and the route to market.",
      },
    ],
  },
  {
    name: "Team",
    children: [
      {
        name: "Fundraising / partners",
        title: "Fundraising and Partners",
        path: "/partners",
        content: partners,
        lead: "Who supported this project, and how.",
      },
      {
        name: "Team members",
        title: "Team Members",
        path: "/team/members",
        content: members,
        lead: "Who we are.",
      },
      {
        name: "Attributions",
        title: "Attributions",
        path: "/attributions", // iGEM standard URL
        content: attributions,
        lead: "Who did what, and what help we received.",
      },
    ],
  },
];

export default Pages;
