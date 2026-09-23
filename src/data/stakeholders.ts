/* The stakeholder record.
 *
 * PROVENANCE. Every field below is transcribed from the team's own write-up
 * (`wiki-assets-source/WRITEUP.docx`, extracted to `references/writeup.md`:
 * the "# H" narrative write-ups, the "(stakeholder profiles)" section and the
 * six-questions table). Nothing here is generated, summarised from outside
 * that document, or inferred. Where a profile has no date in the source,
 * `date` is omitted and the page says so rather than guessing one.
 *
 * QUOTES are verbatim as the team transcribed them, including their bracketed
 * insertions and ellipses. Do not tidy them. A quote that is not in the source
 * word for word does not go in this file.
 *
 * CONSENT. Four interviewees have outstanding conditions recorded in the
 * source and none may be published yet:
 *
 *   - Comvita (Evans / Oliver / Kenyon)  "Consent + Review by Comvita needed
 *                                         before publication!"
 *   - Michael Morrison (HeLEX)            "Review needed before publication!"
 *   - Sarah Coy (Oxford Eng Bio)          "Review needed before publication!"
 *   - Theotime Colin (Wheen Bee Fdn)      "Would like to review any content
 *                                         from the interview before we
 *                                         publish it."
 *
 * Each carries `consent` below and renders as a withheld entry: the
 * conversation is acknowledged, because hiding it would misstate how many
 * people we spoke to, but no name, role or content is shown on the page.
 * `learnt` is left EMPTY for them on purpose - this file ships in a public
 * repository and a public bundle, so text that may not be published does not
 * belong in it even unrendered. Their name and role are kept so the team can
 * publish the moment consent lands; whether even that much should sit in a
 * public repo is the team's call, and is flagged on the page.
 *
 * LOCATIONS are the institution or region named in the source, resolved to
 * coordinates. They are a plotting position, not a claim about where a person
 * was sitting. One cell of the map spans roughly 4.7 degrees, so Oxford,
 * Reading and Bristol share a cell - which is why the map groups by country.
 *
 * QUESTION TAGS reproduce the six-questions table exactly: `anchors` where the
 * table names the anchor interview, `questions` where it lists a supporting
 * one. `provisional` tags are ones the table does not state and that follow
 * from the profile's own content; they render dashed so a reader can tell the
 * two apart, and the team should confirm or delete them.
 */

/** The six HONEY questions the page is organised around. */
export type QuestionId = "Q1" | "Q2" | "Q3" | "Q4" | "Q5" | "Q6";

/**
 * The questions, as the source table words them. Kept here so the map's tags
 * and the page's headings cannot drift apart.
 */
export const QUESTION_TITLES: Record<QuestionId, string> = {
  Q1: "Should we be making a GMO at all?",
  Q2: "Why RNAi rather than another chemical?",
  Q3: "What is wrong with today's Varroa treatments?",
  Q4: "What would a beekeeper actually use?",
  Q5: "What must it cost?",
  Q6: "What if it ends up in the honey?",
};

export const QUESTION_IDS: QuestionId[] = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"];

export interface Stakeholder {
  id: string;
  /** As written in the source. */
  name: string;
  /** Role and institution, as written in the source. */
  role: string;
  /** Human-readable place, shown on the card. */
  place: string;
  /** Grouping key for the map. Hovering any cell shows the whole region. */
  region: string;
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
  /** What they told us. Transcribed, one point per bullet. */
  learnt: string[];
  /** A verbatim quote, exactly as the team transcribed it. */
  quote?: string;
  /** What it changed, where the source states it. */
  changed?: string;
  /** Set if this interview may not be published yet. See CONSENT above. */
  consent?: {
    status: "not-given" | "review-pending";
    note: string;
  };
  /**
   * Explicit lattice cell, where snapping to the nearest cell picks the wrong
   * landmass. Only Queensland needs this: the nearest cell to Brisbane is a
   * Coral Sea island 0.1 units closer than the Queensland coast cell.
   */
  hex?: [col: number, row: number];
}

/** Every question a stakeholder is tagged with, stated or provisional. */
export function questionsOf(s: Stakeholder): QuestionId[] {
  return [...new Set([...(s.anchors ?? []), ...s.questions, ...(s.provisional ?? [])])];
}

export const STAKEHOLDERS: Stakeholder[] = [
  /* ---------- Australia ---------- */
  {
    id: "le-feuvre",
    name: "Danny Le Feuvre",
    role: "Chief Executive Officer, Australian Honey Bee Industry Council",
    place: "Adelaide, South Australia",
    region: "Australia",
    lat: -34.93,
    lon: 138.6,
    date: "28 May 2026",
    questions: [],
    anchors: ["Q3"],
    provisional: ["Q1", "Q4"],
    learnt: [
      "Varroa was declared endemic in Australia after eradication failed. Beekeepers across eastern Australia have moved to permanent monitoring and treatment, complicated by resistant mites and by reinvasion from untreated feral colonies.",
      "Even successfully treated hives are back at threshold within weeks, so a treatment that only kills mites well is not enough: it has to cut repeated labour, hold up under reinfestation, and fit a resistance-management rotation.",
      "New South Wales has lost 35% of its commercial beekeepers, and 40% of Queensland's commercial beekeepers plan to leave the industry within 12 to 24 months, citing profitability and Varroa control.",
      "Honeybee pollination is about 15% of Australian agriculture, so beekeeper attrition threatens the country's ability to meet pollination demand.",
      "Considered a live engineered bacterial system attractive because persistence in the hive could support longer-term treatment - but stressed public acceptance, containment, communication and regulation. A non-live product may be easier to implement even at some cost in persistence.",
      "His ideal treatment: cost-effective, perceived as natural, harmless to bee health, residue-free, and effective from a single feeding.",
    ],
    quote:
      "Beekeepers are unable to use those synthetic treatments largely…we’re getting these re-infestation of mites, so they’re pulling out [treatments] and within weeks they’re back at threshold having to treat again.",
    changed:
      "Redefined the problem as reinfestation, resistance and repeated labour rather than mite mortality. Fed the economic modelling and the decision to test for dsRNA in honey.",
  },
  {
    id: "allerton",
    name: "Mike Allerton",
    role: "Vice President and Biosecurity Officer, Amateur Beekeepers Australia",
    place: "New South Wales",
    region: "Australia",
    lat: -33.87,
    lon: 151.21,
    questions: ["Q3", "Q4"],
    provisional: ["Q1"],
    learnt: [
      "Feral colonies in Australia are dense because forage is available all year. Under Varroa and small hive beetle together they collapsed within weeks rather than the projected two or three years, seeding managed colonies and removing free pollination that agriculture had relied on.",
      "Membership of Amateur Beekeepers Australia fell from 5,000 to 3,000 when Varroa arrived in 2022.",
      "Bayvarol was initially the most effective treatment, but is expensive, slow to install and now faces resistance. Oxalic acid, as strips or vapour, is the most used treatment today.",
      "Cost and labour are the biggest problems with every treatment, and hit small commercial operators of 200-300 hives hardest - they are being bought out by larger operators with more staff.",
      "A recreational beekeeper himself: he produced 500-700 kg of honey a year before Varroa and is now focused on keeping bees alive. Some hobbyists cannot afford treatments and resort to off-label homemade ones.",
      "Was especially interested in the S. alvi route for its lower labour, expecting it to appeal to commercial rather than recreational beekeepers - but said that if the yeast patty proves effective it will probably be the most widely accepted version. Suggested developing both, for two distinct markets.",
    ],
  },
  {
    id: "ogtr",
    name: "Geraldine Lester and colleagues",
    role: "Office of the Gene Technology Regulator (OGTR), Australian Government",
    place: "Canberra",
    region: "Australia",
    lat: -35.28,
    lon: 149.13,
    date: "24 July 2026",
    questions: [],
    anchors: ["Q1"],
    learnt: [
      "A non-living engineered yeast product would not be regulated by the OGTR. Both S. alvi delivery systems, constitutive or inducible, would fall within its remit.",
      "Constitutive and inducible S. alvi would be regulated similarly: an inducible switch changes aspects of the risk assessment but not the regulatory route, even if it makes the system seem more acceptable to the public.",
      "One of the most important concerns would be effects on non-target species - native bees, mites and other organisms the bacterium or dsRNA might reach - and whether the bacterium could spread between colonies or colonise other insects.",
      "The applicant is responsible for providing sufficient evidence of safety, and there is no universal set of experiments because GM organisms and their risks vary.",
      "If the engineered bacterium or its products were found in honey, additional assessment would be needed.",
      "Unlike some other regulators, the OGTR does not consider the potential benefits of a GMO release in its assessment.",
    ],
    changed:
      "The only binary, jurisdictionally authoritative answer we obtained, and the anchor for the chassis decision: the inducible switch buys nothing.",
  },
  {
    id: "frost",
    name: "Elizabeth Frost",
    role: "Technical Specialist Honey Bees, NSW Department of Primary Industries",
    place: "Paterson, New South Wales",
    region: "Australia",
    lat: -32.69,
    lon: 151.6,
    date: "12 August 2026",
    questions: ["Q3"],
    provisional: ["Q1", "Q4"],
    learnt: [
      "Dual resistance has been detected, which means essentially all legal synthetic miticide options will soon be unusable.",
      "Formic acid is hard to use in Australian heat and humidity, and most of the continent has a long brood period with often no brood break at all.",
      "Oxalic acid, vaporised or as AluenCap strips, is the most popular option for beekeepers with dual-resistant mites. Homemade off-label products are in use, which she does not recommend.",
      "Compared NECTAR to Norroa: Norroa is fed in sugar syrup and needs a total absence of nectar flow, which is hard to find in the Australian season. Pollen is limiting there, so a patty could realistically be a colony's main protein source.",
      "Commercial beekeepers used to synthetics driving infestation down to undetectable may find a product that leaves a detectable alcohol-wash count a hard sell.",
      "A dietary RNA platform could work for other pests and diseases - small hive beetle, American foulbrood, chalkbrood - though she was sceptical of a single patty targeting both Varroa and small hive beetle, which nobody has built.",
      "Australian consumers would most likely be against anything genetically modified, even given large economic and welfare benefits, which would make the S. alvi version hard to put in front of beekeepers.",
    ],
  },
  {
    id: "ford",
    name: "Wade Ford",
    role: "Beekeeper Services Manager, Hive & Wellness Australia",
    place: "Queensland",
    region: "Australia",
    lat: -27.47,
    lon: 153.03,
    // See the `hex` note on the interface: nearest-cell snapping picks a Coral
    // Sea island here, by a tenth of a unit. This is the Queensland coast cell.
    hex: [137, 26],
    date: "13 August 2026",
    questions: ["Q6"],
    anchors: ["Q4"],
    learnt: [
      "Varroa has had a huge impact on Australia, although honey supply has not fallen yet, partly because suppliers hold on to their yields. New South Wales beekeepers have lost over 1,200 hives and seen about a 50% drop in honey production.",
      "Mainstream Australian treatments are oxalic and formic acid, with off-label use and a temperature ceiling on formic. Synthetics like Apivar and Bayvarol face resistance, and thyme oil leaves a bitter taste in honey.",
      "Varroa management costs split roughly 60% treatment and 40% additional labour. Formic acid runs to A$7 per hive, which adds up over 1,000+ hives, before counting synthetics bought and colonies replaced only to discover resistant mites.",
      "After talking to his beekeepers, cost is the factor to prioritise, then effectiveness, time and labour, and ease of use.",
      "Preferred pollen patties over S. alvi: his beekeepers already feed patties regularly, and attitudes towards living GMOs matter. Stressed being transparent about the biotechnology used.",
      "Asked us to test how honey composition changes under treatment, including after processing - honey is heated to 65 degrees C for 8 hours to be sent into Western Australia - and how efficacy varies regionally with temperature.",
      "Provided hive profiles from his beekeepers for our modelling.",
    ],
    changed:
      "The 60/40 cost split and the existing use of patties made the delivery format a stakeholder choice rather than a lab one. Fed the honey-residue tests and the region-specific hive profiles in the model.",
  },
  {
    id: "colin",
    name: "Dr Theotime Colin",
    role: "Research Apiary Technical Advisory Committee, Wheen Bee Foundation; Postdoctoral Researcher, Macquarie University",
    place: "Sydney",
    region: "Australia",
    lat: -33.77,
    lon: 151.11,
    date: "10 August 2026",
    questions: ["Q2", "Q5"],
    learnt: [],
    consent: {
      status: "review-pending",
      note: "Asked to review any content from the interview before we publish it. Nothing from this conversation is published until that review is done.",
    },
  },

  /* ---------- New Zealand ---------- */
  {
    id: "comvita",
    name: "Dr Jackie Evans, Dr John Oliver, Sarah Kenyon",
    role: "Chief Science Officer, Head of Research, and Head of Quality and Regulatory Affairs, Comvita",
    place: "New Zealand",
    region: "New Zealand",
    lat: -37.79,
    lon: 176.32,
    date: "23 July 2026",
    questions: ["Q5", "Q6"],
    provisional: ["Q1"],
    learnt: [],
    consent: {
      status: "not-given",
      note: "Consent and review by Comvita are needed before publication. The conversation is recorded here so the count of interviews is honest; nothing from it is published.",
    },
  },

  /* ---------- Hong Kong ---------- */
  {
    id: "lam",
    name: "Professor Paul Lam",
    role: "President and Chair Professor of Environmental Chemistry, Hong Kong Metropolitan University",
    place: "Hong Kong",
    region: "Hong Kong",
    lat: 22.32,
    lon: 114.17,
    date: "6 July 2026",
    questions: [],
    anchors: ["Q2"],
    learnt: [
      "The major environmental impacts of chemical pesticides are toxicity to non-target species, bioaccumulation and biomagnification, and the development of resistance.",
      "Off-target effects were his key environmental concern for our project. He agreed with screening against representative species with bioinformatic tools, and said the choice of those species has to be justified.",
      "When we said cost-benefit analysis, he urged us to say risk-benefit analysis instead, so that the risks of an idea count alongside its costs.",
      "Set out risk handling as identify, assess, manage and communicate, and singled out communication with beekeepers and the public as the hardest and most important step.",
    ],
    changed:
      "BLAST off-target screening with justified representative species in the dsRNA design pipeline; the risk assessment; and the podcast and talks aimed at the public.",
  },

  /* ---------- United States ---------- */
  {
    id: "barrick",
    name: "Professor Jeff Barrick",
    role: "Hannah Distinguished Professor of Microbiology, Genetics & Immunology and Entomology, Michigan State University",
    place: "East Lansing, Michigan",
    region: "United States",
    lat: 42.73,
    lon: -84.48,
    date: "27 May 2026",
    questions: [],
    provisional: ["Q1"],
    learnt: [
      "Has engineered S. alvi to produce dsRNA against Varroa. Spoke to us while we were still deciding between yeast and S. alvi.",
      "His team had found no S. alvi promoter stronger than the synthetic CP25, though characterised by GFP rather than dsRNA output. Suggested vanillic acid as an inducer: wide expression range, low leak, non-toxic, and already used in bee supplements, so a beekeeper could control dosage through feed.",
      "Called T7 a 'beast': strong enough that constitutive expression burdens the cell, so a chromosomally integrated, tightly repressed T7 polymerase is one way to tame it.",
      "RNase III degrades dsRNA after expression. Options: knock out the gene (uncharacterised in S. alvi), choose sequences that fold into paper-clip RNA, or target dsRNA to extracellular vesicles.",
      "Had built a split-YFP biosensor for dsRNA, but it is not very quantitative and not sequence-specific, with a lot of background - which pointed us toward an aptamer-tagged method.",
      "S. alvi can persist in wild bee species, which shapes containment, and US GMO regulation is complex.",
    ],
    changed:
      "We did not use S. alvi, but the conversation shaped the aptamer-based dsRNA quantification method, and its regulatory and containment warnings fed the switch to heat-inactivated yeast.",
  },
  {
    id: "thurman",
    name: "Professor Wally Thurman",
    role: "William Neal Reynolds Professor of Agricultural and Resource Economics, North Carolina State University",
    place: "Raleigh, North Carolina",
    region: "United States",
    lat: 35.78,
    lon: -78.64,
    date: "29 July 2026",
    questions: [],
    anchors: ["Q5"],
    learnt: [
      "Start from an average commercial beekeeping operation, use existing treatments as the counterfactual, and assess the change in costs and revenues rather than non-monetary metrics like survival rates and honey yields.",
      "Use a simpler partial-equilibrium approach, assuming elasticities of supply and demand, to estimate market-level outcomes such as market surpluses.",
      "For the US, focus on paid pollination markets and crops heavily reliant on managed bees, like almonds; ignore wild pollinators and incidental pollination outside the market.",
      "Demand for pollination is derived from demand for food, so benefits to growers are ultimately passed along the supply chain to consumers.",
    ],
    changed:
      "Set the structure of the economic model: the counterfactual is the best existing treatment, operation level first, then market surplus. Confirmed running country-specific analyses.",
  },
  {
    id: "lewis",
    name: "Josette Lewis",
    role: "Chief Executive Officer, Sustainable Conservation; former Vice President and Chief Scientific Officer, Almond Board of California",
    place: "California",
    region: "United States",
    lat: 37.77,
    lon: -122.42,
    date: "24 July 2026",
    questions: ["Q4"],
    provisional: ["Q1"],
    learnt: [
      "Almonds bloom early and require insect pollination. Around 80% of US honeybee colonies are transported to California for the February to March bloom, and after it move on to cherries, apples, melons and sunflowers.",
      "Almond growers and commercial beekeepers are economically codependent: growers need the bees, and almond pollination is the main income for many commercial beekeepers.",
      "Almost 100% of commercial beekeepers in almond pollination are affected by Varroa in the sense that virtually all must manage it. Its arrival coincided with rapid almond expansion, and together they drove pollination costs sharply up.",
      "Bee brokers, who contract colonies from beekeepers to growers, are a stakeholder group in their own right.",
      "Any treatment must be simple, inexpensive and scalable across thousands of colonies. A pollen patty is particularly scalable because it fits existing practice.",
      "From her agricultural biotechnology experience, a living GMO would face a longer and more expensive route to market than a non-living alternative.",
    ],
    quote:
      "codependency between the tree and the bee and between the almond grower and the beekeeper",
    changed:
      "Widened the problem from bees and mites to the burden a treatment places on the beekeeper. A solution has to be manageable, not only effective.",
  },
  {
    id: "hiatt",
    name: "Chris Hiatt",
    role: "Commercial beekeeper and almond grower",
    place: "California, North Dakota and Washington",
    region: "United States",
    lat: 36.75,
    lon: -119.77,
    date: "30 July 2026",
    questions: ["Q3", "Q4"],
    learnt: [
      "Manages around 18,000 colonies with his five brothers, in a business his father started 58 years ago, and owns a 46-acre almond farm. Colonies move from California almonds to North Dakota for honey and on to Washington for apples.",
      "In the mid-2000s a single annual CheckMite+ (coumaphos organophosphate) strip gave highly effective control. By the third year the mites were resistant and he lost 55% of his colonies.",
      "Now rotates amitraz, oxalic acid, formic acid and brood breaks. The worst years of the past decade still ran to 50-60% losses, with viral loads in the 80th-90th percentile of national surveillance in those years.",
      "Losses have left him short of colonies for almond pollination contracts, forcing him to buy in colonies while paying to rebuild his own with queens, packages and splits.",
      "Norroa is not available at commercial scale. A useful solution must work across thousands of colonies.",
      "Strongly supported pollen patties: they are already widely used, so combining treatment with feeding avoids an extra trip to every hive. Wants 3 to 4 months of protection.",
    ],
    quote:
      "But it’s just throwing everything but the kitchen sink at them. And some of our worst years over the last 10 years, we’ve had like 60% loss, 50%.",
    changed:
      "Changed our definition of efficacy. An intervention cannot simply kill Varroa: it must work cheaply, simply and reliably across thousands of colonies, without repeated visits. Efficacy has to include practicality.",
  },
  {
    id: "goodrich",
    name: "Professor Brittney Goodrich",
    role: "Assistant Professor, Department of Agricultural and Consumer Economics, University of Illinois Urbana-Champaign",
    place: "Urbana-Champaign, Illinois",
    region: "United States",
    lat: 40.11,
    lon: -88.21,
    date: "7 August 2026",
    questions: ["Q5"],
    learnt: [
      "Models the costs and revenues of a commercial operation across a year: 8,500 colonies, of which about 5,000 go to California for almond pollination.",
      "About 27% of total costs are capital recovery and equipment, 21% labour, and 9% Varroa treatment products alone - excluding the labour to administer them and the cost of replacing lost hives, so the real figure is higher.",
      "The modelled operation uses two amitraz treatments, one oxalic acid and one formic acid each year.",
      "Roughly 700 colonies per worker, so labour-intensive treatments are difficult at commercial scale.",
      "Almond pollination brings in about $195 per colony and honey about 70 lb per hive, so a lost colony costs both its rebuilding and its revenue.",
    ],
    changed:
      "Treatment price is an incomplete measure of the cost of Varroa. The model now counts treatment labour, repeated administration, colony rebuilding and lost pollination and honey revenue.",
  },
  {
    id: "us-regulators",
    name: "Mike Mendelsohn and Alan Reynolds (EPA), Adam Moyer and Laura Epstein (FDA), Alan Pearson (USDA)",
    role: "US Environmental Protection Agency, Food and Drug Administration, and Department of Agriculture",
    place: "Washington, DC",
    region: "United States",
    lat: 38.9,
    lon: -77.04,
    date: "14 August 2026",
    questions: ["Q1"],
    learnt: [
      "US biotechnology regulation is split across agencies, with jurisdiction set by how a product functions and what it is intended for.",
      "Living GMO versus non-living engineered product does not by itself make the path easier or harder. It changes what evidence of safety is required.",
      "Four areas would need addressing: safety to the honeybee, environmental impact, safety to the people handling the product, and whether anything enters honey or another food. Honey would not need to be labelled as bioengineered.",
      "An intervention intended to treat a condition in the bee may fall under an animal-drug pathway rather than being treated simply as a pesticide, which changes who assesses it.",
    ],
    changed:
      "US regulation is product- and risk-focused rather than triggered by the word GMO. The questions are what the treatment does, where it goes, what is exposed, and whether the evidence shows that is safe.",
  },

  /* ---------- United Kingdom ---------- */
  {
    id: "sandham",
    name: "Mark Sandham",
    role: "Treatment-free beekeeper, Oxford",
    place: "Oxford",
    region: "United Kingdom",
    lat: 51.75,
    lon: -1.26,
    date: "29 May 2026",
    questions: ["Q3"],
    provisional: ["Q1"],
    learnt: [
      "Keeps bees at University College and Botley Meadow with no chemical treatments, preferring to let them live as naturally as possible.",
      "Varroa arrived in the UK in the 1990s but has not, in his experience, devastated the Oxford beekeepers he knows. He has never seen mites in his established colonies, though colonies acquired from a beekeeper who had died showed deformed wings consistent with Varroa-associated disease.",
      "Believes treatment interferes with bees adapting naturally, and that some selective pressure produces more resilient bees.",
      "His position is not absolute: if his colonies were infested and unable to adapt, the argument for treatment would be different.",
      "Was concerned that a living engineered bacterium could pass between bees of different colonies, making its spread hard to control. A non-living treatment avoids that but must be reapplied, at a cost in time and money.",
    ],
    changed:
      "Challenged the assumption at the core of the project. We had asked how to treat Varroa more effectively; Mark made us ask whether a one-time treatment that works continuously is actually better than one that has to be reapplied.",
  },
  {
    id: "oxnatbees",
    name: "Oxfordshire Natural Beekeeping Group",
    role: "Around 20 hobbyist beekeepers practising low-intervention, chemical-free beekeeping",
    place: "Garsington, Oxfordshire",
    region: "United Kingdom",
    lat: 51.71,
    lon: -1.17,
    date: "30 May 2026",
    questions: ["Q3"],
    learnt: [
      "Joined their lunch gathering at Mark's invitation, and were welcomed despite a different approach to Varroa - down to being lent suits to get close to a treatment-free apiary.",
      "Many of them used chemical treatments in the past, moved to treatment-free beekeeping, and report lower Varroa counts since. Their view is that Varroa may not need managing at all if bees are given the chance to adapt.",
      "They drew the distinction that mattered: small apiaries with varied genetics can go treatment-free because some bees show hygienic behaviour, while large, genetically uniform commercial operations cannot.",
    ],
    changed:
      "Made us reconsider whether our project was the best solution at all, and then narrowed the target audience from beekeepers in general to commercial beekeepers, whose scale and uniformity rule the treatment-free route out. That set the outreach strategy for everything after it.",
  },
  {
    id: "krebs",
    name: "Lord John Krebs",
    role: "Zoologist and behavioural ecologist, member of the House of Lords; first Chairman of the UK Food Standards Agency (2000-2005); Principal of Jesus College, Oxford (2005-2015)",
    place: "Oxford",
    region: "United Kingdom",
    lat: 51.75,
    lon: -1.26,
    date: "23 July 2026",
    questions: ["Q1", "Q6"],
    learnt: [
      "Deployment in the UK could touch three regulatory areas: contained GMO use (the Health and Safety Executive), environmental release (ACRE), and food and feed safety (the Food Standards Agency).",
      "Even though our product is used on bees rather than being the food, regulators would want to know that none of it could reach honey, beeswax, pollen or the environment.",
      "Off-target effects must be addressed, and he specifically pointed at species close to Varroa: other mites and potentially other arachnids.",
      "If components were detectable in honey, we would need evidence that they are harmless to consumers. That enforced tracing the complete pathway, from what happens to Varroa through to what happens afterwards.",
      "Cautioned against assuming GMO opposition is a lack of understanding. Responses are emotional and values-driven, and France and Austria are protective of traditional agriculture. Frame the product around protecting bees and sustainable food production rather than around GMOs.",
    ],
    changed:
      "Responsible deployment needs both a rigorous assessment of what the technology does and a real explanation of why it is needed.",
  },
  {
    id: "dunwell",
    name: "Professor Jim Dunwell",
    role: "Chair, Advisory Committee on Releases to the Environment (ACRE)",
    place: "Reading",
    region: "United Kingdom",
    lat: 51.44,
    lon: -0.94,
    date: "4 August 2026",
    questions: ["Q1"],
    learnt: [
      "ACRE is the statutory committee advising the UK Government on the risks of releasing GMOs, and assesses whether a release could harm human health or the environment.",
      "Environmental regulation is about identifying every plausible pathway to harm: could the dsRNA or organism leave the bee gut, what would encounter it, and could that cause harm. Non-target mites are the particular concern, and experimental evidence in relevant off-target organisms would likely be required.",
      "Challenged our assumption that regulators would distinguish our approaches by delivery system. What matters is what happens once the treatment reaches the bee and where it travels afterwards.",
      "If components entered honey or other bee products, that could bring in additional food-safety regulation.",
    ],
    quote: "the delivery method is secondary to the endpoint",
    changed:
      "The clearest dissent we recorded. It cuts against part of our own justification for the chassis switch, and the page says so rather than smoothing it over.",
  },
  {
    id: "hartley",
    name: "Tom Hartley",
    role: "Senior Certification Officer and Inspector, Soil Association Certification",
    place: "Bristol",
    region: "United Kingdom",
    lat: 51.45,
    lon: -2.59,
    date: "27 July 2026",
    questions: ["Q1", "Q6"],
    learnt: [
      "GMOs are fundamentally incompatible with organic production standards, and that extends to products made using GMOs: a GMO anywhere in the production pathway can cost a product its organic status.",
      "Organic compatibility therefore depends on more than whether the final treatment contains a living GMO. The production process and method of use matter too.",
      "A product could satisfy conventional regulatory requirements and still be incompatible with organic certification.",
      "The S. alvi pathway could cost beekeepers their certified organic status. He was hopeful that the heat-killed yeast pathway was more likely to stand up.",
    ],
    changed:
      "Legal approval and organic acceptability are not the same thing. Keeping honey organic was non-negotiable for the beekeepers we spoke to, and this ruled the living system out for them.",
  },
  {
    id: "budge",
    name: "Professor Giles Budge",
    role: "Director of Research and Innovation, School of Natural and Environmental Sciences, Newcastle University",
    place: "Newcastle",
    region: "United Kingdom",
    lat: 54.98,
    lon: -1.61,
    date: "9 April and 13 July 2026",
    questions: ["Q2"],
    learnt: [
      "We had read Ramsey et al. (2019), which found Varroa feed on the fat body rather than haemolymph, and feared dsRNA in haemolymph would never reach the mite. His view: the fat body is bathed in haemolymph, so mites feeding on it do ingest haemolymph and are exposed to dsRNA in it - consistent with Garbian et al. (2012) measuring mite mortality off dsRNA-fed adult bees.",
      "Considered Mango-biotin fluorescence a logical way to quantify dsRNA in our samples. We went on to complete that assay.",
      "Seconded the GFP-length assay (300, 500 and 700 bp) to resolve any length-dependent effect on haemolymph uptake.",
    ],
    changed:
      "Kept the adult-bee feeding route alive when a paper appeared to sink it, and backed both the Mango quantification and the length series in the bee lab.",
  },
  {
    id: "scottish-government",
    name: "Susan Curran, Luis Molero and Claire Gill",
    role: "Scottish Government Honey Bee Health Team",
    place: "Edinburgh",
    region: "United Kingdom",
    lat: 55.95,
    lon: -3.19,
    questions: ["Q1", "Q6"],
    learnt: [
      "Varroa is recognised as one of the top three threats to bees in Scotland, which puts the problem beyond our two main case studies.",
      "Raised concern over pesticide contamination in honey.",
      "Supported a biocontrol therapeutic, but described the regulation around it as complex.",
    ],
    changed: "Led us to Laura Bowden for regulatory advice.",
  },
  {
    id: "bowden",
    name: "Laura Bowden",
    role: "GM manager, Science and Advice for Scottish Agriculture (SASA)",
    place: "Edinburgh",
    region: "United Kingdom",
    lat: 55.95,
    lon: -3.19,
    questions: ["Q1"],
    learnt: [
      "Set out the regulatory protocol in Scotland.",
      "Our product sits in a grey area, which confirms that heat-killed yeast does help to potentially bypass GM regulation.",
    ],
    changed:
      "We contacted the HSE and explored documentation on containment and active release. Reinforced how much model output it is worth giving a regulator when asking for permissions.",
  },
  {
    id: "teece",
    name: "Melanie Teece",
    role: "Head of Technical, Hilltop Honey",
    place: "Newtown, Powys",
    region: "United Kingdom",
    lat: 52.51,
    lon: -3.31,
    date: "20 August 2026",
    questions: [],
    anchors: ["Q6"],
    provisional: ["Q5"],
    learnt: [
      "Thirty years in the food industry. Most of Hilltop's honey originates from China or South America, and Varroa has not majorly affected their colonies or supply; transport and testing costs are high.",
      "Their beekeepers will often choose the cheapest option, so cost-effectiveness is the factor to prioritise.",
      "Honey is unusual among food products: consumers expect it to be natural and healthy, so wide acceptability matters.",
      "Asked us to test whether dsRNA leaves residues in honey and, if so, whether it affects NMR and LC-HRMS results - the two industry tests for honey purity.",
    ],
    changed:
      "Honey-residue and NMR / LC-HRMS testing were added to the wet-lab plan. The honey industry's concerns outside our two case studies turned out to be the same three: cost, consumer perception, contamination.",
  },
  {
    id: "morrison",
    name: "Michael Morrison",
    role: "Senior Researcher in Social Science, HeLEX (Centre for Health, Law and Emerging Technologies), University of Oxford",
    place: "Oxford",
    region: "United Kingdom",
    lat: 51.75,
    lon: -1.26,
    date: "30 July 2026",
    questions: ["Q1"],
    learnt: [],
    consent: {
      status: "review-pending",
      note: "Review needed before publication. Nothing from this conversation is published until that review is done.",
    },
  },
  {
    id: "coy",
    name: "Sarah Coy",
    role: "Responsible Exploitation and Translation Officer, Engineering Biology, University of Oxford",
    place: "Oxford",
    region: "United Kingdom",
    lat: 51.75,
    lon: -1.26,
    date: "8 September 2026",
    questions: ["Q1"],
    learnt: [],
    consent: {
      status: "review-pending",
      note: "Review needed before publication. Nothing from this conversation is published until that review is done.",
    },
  },

  /* ---------- Canada ---------- */
  {
    id: "mcloughlin",
    name: "Austein McLoughlin",
    role: "Secretariat of the Convention on Biological Diversity",
    place: "Montreal",
    region: "Canada",
    lat: 45.5,
    lon: -73.57,
    questions: ["Q1", "Q2"],
    learnt: [
      "Under the Cartagena Protocol our product is not a living modified organism.",
      "Comparisons to conventional practice are essential.",
      "A major barrier to sustainable development is the gap between claim and reality, and not having baseline evidence to compare against.",
    ],
    changed:
      "Global biodiversity frameworks were folded into the SDG work, and baseline comparisons built into the modelling.",
  },
];
