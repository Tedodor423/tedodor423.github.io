/* The home page's deck of slides, as words.
 *
 * The slides are components (BeeImportance, VarroaSlide, TreatmentsSlide,
 * RnaiChallenges in src/components/), and their copy used to be typed into
 * each one. It lives here instead so that the search index
 * (src/utils/search.ts) reads the same strings the slides render: a claim
 * reworded here changes on the page and in the results in one edit, and
 * nothing can be found that is not shown. The slides import from here and
 * add nothing of their own.
 *
 * The numbers are the slides' own, and the notes on where each one stands
 * (what is [LIT], what is [FLAG]) stay in the component that draws it.
 */

import { tag, type Run } from "../utils/runs";

/**
 * Where a result lands, per slide. The slide's section carries the id, so a
 * result opens on the slide; on a wide screen a ride that has a better rest
 * for a passage (the evidence under the claim, the challenges) renders a
 * marker at that point of its track under the same id instead.
 */
export const DECK_ANCHORS = {
  bees: "why-bees-matter",
  mite: "the-varroa-mite",
  treatments: "existing-treatments",
  evidence: (charge: Charge) => `ts-evidence-${charge}`,
  challenges: "rnai-challenges",
};

/* ---------- slide two: why bees matter ---------- */

export const BEES = {
  /** The slide shows no title, by the team's choice; this names it for
   * screen readers. */
  title: "Why bees matter",
  food: {
    /** Two lines, as set. */
    when: ["by 2050, humanity", "will require"],
    /** Per cent; the number the count climbs to. */
    figure: 50,
    words: "more food",
    caption: [
      {
        text: "World population times food supply per head, 1960 to 2020; dashed, our projection to 9.7 billion people at 3,050 kcal a head in 2050. ",
      },
      tag("CALC"),
    ] as Run[],
    ref: [
      {
        text: "FAO 2017, The future of food and agriculture: Trends and challenges. Rome: FAO. ",
      },
      tag("LIT"),
    ] as Run[],
  },
  harvest: {
    when: "pollinators account for",
    /** Per cent; the share the hand sweeps out. */
    figure: 35,
    words: "of the world's crop production",
    note: "Of global production by volume, counting every crop that depends on animal pollination. Honeybees are the most valuable of those pollinators.",
    ref: [
      {
        text: "Klein et al. 2007, Proc. R. Soc. B 274: 303-313. doi:10.1098/rspb.2006.3721 ",
      },
      tag("LIT"),
    ] as Run[],
  },
};

/** The two claims as one line each, the way a result names them. */
export const foodClaim = () =>
  `${BEES.food.when.join(" ")} ${BEES.food.figure}% ${BEES.food.words}`;
export const harvestClaim = () =>
  `${BEES.harvest.when} ${BEES.harvest.figure}% ${BEES.harvest.words}`;

/* ---------- slide three: the mite ---------- */

const ARS_2025 =
  "https://www.ars.usda.gov/news-events/news/research-news/2025/usda-researchers-find-viruses-from-miticide-resistant-parasitic-mites-are-cause-of-recent-honey-bee-colony-collapses/";

export const MITE = {
  lead: "The world is facing a silent epidemic,",
  /** "the Varroa mite", the mite set in red. */
  subject: { before: "the ", red: "Varroa mite" },
  when: "Every year in the US alone:",
  /** Millions of colonies, and billions of dollars. */
  colonies: 1.6,
  dollars: 2,
  /** "are lost to Varroa-associated colony collapse", Varroa in red. */
  lost: {
    before: "are lost to ",
    red: "Varroa",
    after: "-associated colony collapse",
  },
  refs: [
    {
      text: "Colonies: Project Apis m., US colony loss survey, June 2024 to March 2025 ",
    },
    tag("LIT"),
    { text: "; the viruses varroa carries as the cause: " },
    { text: "USDA ARS, June 2025", href: ARS_2025 },
    { text: " " },
    tag("LIT"),
    { text: ". Dollars: team jamboree deck, source still to be traced " },
    tag("FLAG"),
    { text: "." },
  ] as Run[],
  chart: [
    { text: "Estimated values, not yet data " },
    tag("FLAG"),
    { text: "." },
  ] as Run[],
  verdict:
    "With unstoppable climate change effects, the problem Will get worse",
};

export const miteTitle = () =>
  `${MITE.lead} ${MITE.subject.before}${MITE.subject.red}`;

/* ---------- slide four: the treatments ---------- */

export type Charge = "ineffective" | "toxic";

export interface Evidence {
  figure: string;
  claim: string;
  detail?: string;
  source: Run[];
}

const LAMAS_2025 = "https://doi.org/10.1101/2025.05.28.656706";
const TANG_2021 = "https://doi.org/10.1038/s41561-021-00712-5";

export const TREATMENTS = {
  /** "Existing treatments are ineffective and toxic", each charge a word
   * that opens its evidence. */
  lead: "Existing treatments",
  are: "are",
  and: "and",
  charges: ["ineffective", "toxic"] as Charge[],
  evidence: {
    ineffective: {
      figure: "100%",
      claim: "of screened Varroa mites carry a resistance mutation.",
      detail:
        "Every mite USDA scientists screened from US commercial operations hit by the 2025 collapses carried the mutation that lets it survive amitraz, a miticide used widely by beekeepers.",
      source: [
        { text: "Lamas et al., bioRxiv, 2025", href: LAMAS_2025 },
        { text: ", 39 mites from five operations, preprint; " },
        { text: "USDA ARS, June 2025", href: ARS_2025 },
        { text: " " },
        tag("LIT"),
      ],
    },
    toxic: {
      figure: "64%",
      claim:
        "of the world's farmland is already at risk of pollution from more than one pesticide.",
      source: [
        { text: "Tang et al., Nature Geoscience, 2021", href: TANG_2021 },
        { text: ", 92 pesticides mapped across 168 countries " },
        tag("LIT"),
      ],
    },
  } as Record<Charge, Evidence>,
  solution: "The solution is",
  answer: "RNA interference",
};

export const treatmentsTitle = () =>
  `${TREATMENTS.lead} ${TREATMENTS.are} ${TREATMENTS.charges[0]} ${TREATMENTS.and} ${TREATMENTS.charges[1]}`;

/* ---------- slide five: what RNAi is up against ---------- */

export type Demand = "model" | "design" | "vivo";

export interface DemandCopy {
  key: Demand;
  joint?: string;
  word: string;
  /** The proof, with its number (if any) between `lead` and `tail`. */
  lead?: string;
  count?: number;
  tail: string;
  /** A clip beside the proof, from public/local/ for now. */
  clip?: string;
  /** How much faster than the file the clip plays. */
  rate?: number;
  to: string;
  page: string;
  flag?: boolean;
}

export const CHALLENGES = {
  title: "…This technology faces numerous challenges",
  barriers: [
    "Rational target selection",
    "Off-target screening",
    "Single-target resistance",
    "Manufacturing cost",
    "Environmental degradation",
    "Inefficient delivery",
  ],
  requiring: "Requiring us to do",
  demands: [
    {
      key: "model",
      word: "Modelling,",
      count: 6,
      tail: " different models and a novel dsRNA-design pipeline",
      clip: "vdchibin_fold.mp4",
      to: "/model",
      page: "The models",
    },
    {
      key: "design",
      word: "Design",
      tail: "Hundreds of experiments, an infinite amount of time in the wet lab",
      to: "/wet-lab-experiments",
      page: "The wet lab",
      flag: true,
    },
    {
      key: "vivo",
      joint: "and",
      word: "In-vivo measurement",
      lead: "Unprecedented scale of honeybee testing: ",
      count: 1200,
      tail: "+ hours in our bee lab",
      clip: "beehive_work.mp4",
      rate: 2,
      to: "/bee-lab",
      page: "The bee lab",
      flag: true,
    },
  ] as DemandCopy[],
};

/** A demand's row as one line, the way the index reads it. */
export const demandText = (d: DemandCopy) =>
  `${d.joint ? `${d.joint} ` : ""}${d.word} ${d.lead ?? ""}${d.count ?? ""}${d.tail} ${d.page}`;
