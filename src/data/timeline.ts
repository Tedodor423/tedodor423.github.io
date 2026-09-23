/* The dated record of the project, as data.
 *
 * PROVENANCE. Every entry below is reconstructed from the team's own material:
 * the working channels the team ran between 12 February and 23 September 2026,
 * the lab journals, and the calendars. Nothing here is inferred, dramatised or
 * filled in. Where the source is ambiguous the entry says less rather than
 * more, and where a number exists only as a message rather than as a journal
 * entry it carries `check: true` and the page says so out loud.
 *
 * WHAT IS DELIBERATELY NOT HERE. Three kinds of thing were taken out and must
 * not be put back: access credentials and facility details, internal conduct
 * matters, and individuals' personal circumstances. Interviewees are described
 * by role and organisation rather than by name unless their profile is already
 * published in src/data/stakeholders.ts without a `consent` field; the four
 * carrying one are not named here either, for the same reason the search index
 * skips them.
 *
 * WHERE INTERPRETATION LIVES. Not here. This file carries dates and what
 * happened; the argument about what it meant belongs to the page that owns it,
 * which is what `links` is for. Where the engineering page and a message
 * archive disagree about a result, the engineering page is the team's reviewed
 * position and this file defers to it.
 */

/* ---------------------------------------------------------------- tracks */

export type TrackId = "wet" | "bee" | "dry" | "hp" | "team";

export interface Track {
  id: TrackId;
  /** Column heading, and the tag shown on a card when the columns collapse. */
  name: string;
  /** One line on what this thread of work was. */
  blurb: string;
  /** The page that owns this workstream. */
  page: string;
}

/* Five lanes, because five things were happening at once and the parallelism
 * is the story: the bee lab, the wet lab and the interviews redirected each
 * other repeatedly, and a single chronological list hides that completely. */
export const TRACKS: Track[] = [
  {
    id: "wet",
    name: "Wet lab",
    blurb: "Making the molecule.",
    page: "/wet-lab",
  },
  {
    id: "bee",
    name: "Bee lab",
    blurb: "Getting it into a bee, and onto a mite.",
    page: "/bee-lab",
  },
  {
    id: "dry",
    name: "Dry lab",
    blurb: "Choosing the sequence, and modelling what it is worth.",
    page: "/model",
  },
  {
    id: "hp",
    name: "Human practices",
    blurb: "Who we asked, and what they sent back to the bench.",
    page: "/human-practices",
  },
  {
    id: "team",
    name: "Team and money",
    blurb: "Paying for it, running it, and telling people about it.",
    page: "/team",
  },
];

export const TRACK_NAMES: Record<TrackId, string> = Object.fromEntries(
  TRACKS.map((t) => [t.id, t.name]),
) as Record<TrackId, string>;

/* ---------------------------------------------------------------- threads */

export type ThreadId =
  | "chassis"
  | "target"
  | "build"
  | "quantify"
  | "dose"
  | "mite"
  | "money"
  | "story";

export interface Thread {
  id: ThreadId;
  name: string;
  /** What the thread is about, in one line. */
  line: string;
  /** Where the finished argument lives. */
  page: string;
}

/* A thread is a question that took months and crossed lanes. Following one is
 * the only way to see that the decision to drop the living symbiont was made
 * in interviews and regulation, not at a bench, and that the mite assay was
 * redesigned three times by the bee lab before the wet lab could use it. */
export const THREADS: Thread[] = [
  {
    id: "chassis",
    name: "From symbiont to yeast",
    line: "The project's largest change, and it was decided by regulation and cost rather than by an experiment.",
    page: "/engineering#cycle-2-1",
  },
  {
    id: "target",
    name: "Choosing the sequence",
    line: "From 33 candidate mite genes to a shortlist, by off-target screening and by what the bee lab could actually test.",
    page: "/software",
  },
  {
    id: "build",
    name: "Building an unbuyable molecule",
    line: "No vendor will synthesise the construct, so it had to be assembled, and the assembly kept failing.",
    page: "/engineering#cycle-1-2",
  },
  {
    id: "quantify",
    name: "Learning to measure it",
    line: "Every readout the project needed had to be built and calibrated first, and most of them broke before they worked.",
    page: "/measurement",
  },
  {
    id: "dose",
    name: "Getting a dose into a bee",
    line: "Harnesses, feeders, larvae and the arithmetic of how much RNA a whole assay would consume.",
    page: "/engineering#cycle-b1",
  },
  {
    id: "mite",
    name: "Getting to the mite",
    line: "Three redesigns, driven by a mite shortage and by the discovery that a mite alone does not survive.",
    page: "/engineering#cycle-b3",
  },
  {
    id: "money",
    name: "Paying for it",
    line: "A registration deadline in April, a consumables budget in May, and a trip to Paris to fund by September.",
    page: "/partners",
  },
  {
    id: "story",
    name: "Learning to tell it",
    line: "The journal, the wiki, the presentations, and the feedback that made the team rebuild all three.",
    page: "/contribution",
  },
];

export const THREAD_NAMES: Record<ThreadId, string> = Object.fromEntries(
  THREADS.map((t) => [t.id, t.name]),
) as Record<ThreadId, string>;

/* ------------------------------------------------------------------- acts */

export interface Act {
  id: string;
  name: string;
  /** First and last month it covers, as YYYY-MM. */
  from: string;
  to: string;
  line: string;
}

export const ACTS: Act[] = [
  {
    id: "act-1",
    name: "Choosing a problem",
    from: "2026-02",
    to: "2026-04",
    line: "Fourteen students, seven pitches, one vote, and a supervisor who rejected the winner.",
  },
  {
    id: "act-2",
    name: "Designing the system",
    from: "2026-05",
    to: "2026-06",
    line: "Sequences, promoters, protocols and permissions, all written before anyone had bench access.",
  },
  {
    id: "act-3",
    name: "Two labs at once",
    from: "2026-07",
    to: "2026-08",
    line: "The wet lab and the bee lab open in the same week and spend two months correcting each other.",
  },
  {
    id: "act-4",
    name: "Making it land",
    from: "2026-09",
    to: "2026-11",
    line: "Mites, a construct that will not assemble, and a wiki with a fixed deadline.",
  },
];

/* ----------------------------------------------------------------- events */

export interface TimelineEvent {
  /** Slug. The anchor in the written record is `tl-<id>`. */
  id: string;
  /** ISO date. Where the source gives a range, this is the start. */
  date: string;
  /** End of a range, where the source gives one. */
  until?: string;
  track: TrackId;
  title: string;
  /** One or two sentences. Longer belongs on the page in `links`. */
  detail?: string;
  /** A turning point: the entries a reader short of time should see. */
  turn?: boolean;
  /** Something failed, was lost, or forced a redesign. */
  setback?: boolean;
  /** Not yet happened. The two fixed deadlines ahead of the record. */
  ahead?: boolean;
  /** Numbers here are from the message archive and not yet reconciled. */
  check?: boolean;
  threads?: ThreadId[];
  /** Where on the wiki this is argued out properly. */
  links?: { label: string; href: string }[];
}

export const EVENTS: TimelineEvent[] = [
  /* ---------------- Act 1: choosing a problem (Feb to Apr) ---------------- */
  {
    id: "team-forms",
    date: "2026-02-12",
    track: "team",
    title: "The team forms",
    detail:
      "First meeting in person, about fourteen students. A shared drive, an interests sheet and an ideas board go up the same day.",
    links: [{ label: "Team members", href: "/team/members" }],
  },
  {
    id: "first-meeting",
    date: "2026-02-21",
    track: "team",
    title: "First general meeting",
    detail:
      "Everyone arrives with at least one researched idea, and the team structure is argued out.",
  },
  {
    id: "supervisor-chats",
    date: "2026-02-26",
    until: "2026-03-03",
    track: "team",
    title: "One-to-one idea chats with the supervisor",
    detail:
      "A standing Tuesday meeting begins, and the fundraising channel opens alongside it.",
    threads: ["money"],
  },
  {
    id: "pitches",
    date: "2026-03-10",
    track: "dry",
    title: "Seven project pitches",
    detail:
      "Five minutes and questions each, to the supervisor and the mentors. One was submitted as a video three days later.",
  },
  {
    id: "vote-1",
    date: "2026-03-16",
    track: "dry",
    title: "First project vote, and the wrong winner",
    detail:
      "A Deinococcus-based space project takes eight first preferences. Work and fundraising start behind it.",
    turn: true,
  },
  {
    id: "registration-target",
    date: "2026-03-20",
    track: "team",
    title: "£5,450 needed by 1 April",
    detail:
      "The registration fee sets the project's first hard deadline. A fundraising spreadsheet, industry-specific email templates and a Monday outreach cadence follow within the week.",
    threads: ["money"],
    links: [{ label: "How we fundraised", href: "/partners" }],
  },
  {
    id: "project-rejected",
    date: "2026-03-29",
    track: "dry",
    title: "The supervisor rejects the chosen project",
    detail:
      "Five objections: a multi-year scope, little visible synthetic biology for judges, no method for separating or connecting the layered organisms, trial and error rather than directed design, and no holistic vision. A quantitative feasibility study is asked for instead.",
    turn: true,
    setback: true,
    links: [{ label: "How we read a cycle", href: "/engineering" }],
  },
  {
    id: "emergency-meeting",
    date: "2026-03-30",
    track: "team",
    title: "Emergency project meeting",
    detail:
      "A written response follows on 2 April. The project does not survive it, and nothing had been built yet.",
  },
  {
    id: "bee-direction",
    date: "2026-04-03",
    track: "dry",
    title: "The bee and dsRNA idea comes back",
    detail:
      "One of the original seven pitches is identified as both feasible and within the competition's remit. Three finalists go forward.",
  },
  {
    id: "vote-2",
    date: "2026-04-06",
    track: "dry",
    title: "Final vote: Varroa, nine to two",
    detail: "The carbon-to-protein idea takes two, the space project none.",
    turn: true,
    links: [{ label: "Project description", href: "/description" }],
  },
  {
    id: "budge",
    date: "2026-04-09",
    track: "hp",
    title: "A Varroa specialist joins as an advisor",
    detail:
      "The first external expert on the project, and the first of roughly thirty conversations.",
    links: [{ label: "The conversation", href: "/human-practices#sm-budge" }],
  },
  {
    id: "chassis-debate",
    date: "2026-04-19",
    track: "dry",
    title: "Bioreactor, or an engineered gut symbiont",
    detail:
      "The objection that decides the project five months later is already on the table: making dsRNA costs the bacterium energy, so it may not compete in the bee gut. Deferred to a hackathon.",
    threads: ["chassis"],
    links: [
      { label: "Which chassis, in the end", href: "/engineering#cycle-2-1" },
    ],
  },
  {
    id: "donation-10k",
    date: "2026-04-28",
    track: "team",
    title: "A £10,000 donation lands",
    detail: "Registration is covered, and a research hackathon is called.",
    threads: ["money"],
  },

  /* --------------- Act 2: designing the system (May to Jun) --------------- */
  {
    id: "hackathon",
    date: "2026-05-02",
    track: "dry",
    title: "Research hackathon",
    detail:
      "A full day. The project document is drafted and the work splits into two tracks, microbiome engineering and a bioreactor.",
  },
  {
    id: "promoter-ladder",
    date: "2026-05-07",
    track: "dry",
    title: "Promoter ladder work begins",
    detail:
      "A shortlist of symbiont promoters that might beat the existing ones for dsRNA expression, matched against published transcriptomics in R. Without the expression data the team is, in its own words, shooting in the dark.",
    threads: ["chassis"],
  },
  {
    id: "bee-lab-first",
    date: "2026-05-08",
    track: "bee",
    title: "First meeting with the Oxford Bee Lab",
    detail:
      "The meeting that makes live bee work possible at all, and that the whole bee-lab track hangs on.",
    turn: true,
    links: [{ label: "Bee lab", href: "/bee-lab" }],
  },
  {
    id: "hp-first",
    date: "2026-05-12",
    track: "hp",
    title: "First human practices meeting",
  },
  {
    id: "repeat-or-two-promoters",
    date: "2026-05-14",
    track: "dry",
    title: "Inverted repeat, or two promoters",
    detail:
      "The open design question that eventually becomes the loop-ended construct, and with it the problem that no vendor will synthesise the molecule.",
    threads: ["build"],
    links: [
      {
        label: "What shape should the dsRNA be?",
        href: "/engineering#cycle-1-1",
      },
    ],
  },
  {
    id: "protocols-signed",
    date: "2026-05-15",
    track: "wet",
    title: "Protocols signed off, and a promoter shortlist",
    detail:
      "The top seven promoters are expected to give about a five-fold expression range in the gut, already wider than the existing toolkit. Four of roughly 29 target sequences are screened.",
    threads: ["chassis", "target"],
    check: true,
  },
  {
    id: "protocol-sprint",
    date: "2026-05-16",
    until: "2026-05-21",
    track: "wet",
    title: "Protocol-writing sprint",
    detail:
      "Nearly three pages of protocols and assays, numbered and claimed individually across the team.",
    links: [{ label: "Protocol library", href: "/experiments" }],
  },
  {
    id: "hiscribe",
    date: "2026-05-18",
    track: "wet",
    title: "The shortcut that unlocked the summer",
    detail:
      "Candidate targets can be tested with a T7 transcription kit before anything is engineered, so weak ones can be dropped before they cost a cloning round.",
    turn: true,
    threads: ["target", "build"],
  },
  {
    id: "scope-discipline",
    date: "2026-05-20",
    track: "team",
    title: "Scope discipline imposed",
    detail:
      "A conference trip is cut. Effort goes to human practices, parts design and characterisation instead.",
  },
  {
    id: "consumables-sponsor",
    date: "2026-05-22",
    track: "team",
    title: "A consumables budget sponsored",
    detail:
      "Negotiated down further in August. It is what pays for most of what follows.",
    threads: ["money"],
    links: [{ label: "Sponsors and funders", href: "/partners" }],
  },
  {
    id: "gmo-regs",
    date: "2026-05-27",
    track: "bee",
    title: "The GMO question reaches the safety office",
    detail:
      "Testing an engineered organism in the bee lab needs its own approvals, moving one between labs needs more, and the risk assessment needs an animal form because bees count as higher invertebrates.",
    threads: ["chassis"],
    links: [{ label: "Safety and security", href: "/safety-and-security" }],
  },
  {
    id: "registered",
    date: "2026-05-28",
    track: "team",
    title: "Registered as team 6391",
  },
  {
    id: "promoter-spec",
    date: "2026-06-01",
    track: "dry",
    title: "The promoter library, specified",
    detail:
      "Three lengths per promoter, with transcription start sites mapped from raw transcriptomics rather than predicted, giving at least fifty promoters to test.",
    threads: ["chassis"],
  },
  {
    id: "bee-scope",
    date: "2026-06-01",
    track: "bee",
    title: "Ambitious but possible",
    detail:
      "The bee lab's verdict on the proposed experiments. Because the team has to write its own bee protocols, only the first two weeks of work can be planned in advance.",
  },
  {
    id: "off-target",
    date: "2026-06-07",
    track: "dry",
    title: "Off-target screening, before anything is ordered",
    detail:
      "Every candidate runs against the honeybee, three bumblebee species and human sequence, and one major off-target match disqualifies it. A check for illegal restriction sites is added the next day.",
    turn: true,
    threads: ["target"],
    links: [{ label: "NectarDesigner", href: "/software" }],
  },
  {
    id: "screen-split",
    date: "2026-06-07",
    track: "dry",
    title: "Twenty-six mite sequences split across the team",
    detail:
      "Roughly five each, for the five members not sitting exams, due that Friday. The candidates come from the published Varroa RNAi literature.",
    threads: ["target"],
  },
  {
    id: "winners-call",
    date: "2026-06-08",
    track: "team",
    title: "A call with last year's winners",
    detail:
      "Three things came back: everything that can go wrong in a lab will, so keep the goals simple; motivation is the limiting resource; and when you need an answer, contact every single person who might have it.",
    threads: ["story"],
  },
  {
    id: "rnd-lecture",
    date: "2026-06-11",
    track: "dry",
    title: "The whole project, explained once, on the record",
    detail:
      "A recorded session so that everybody knows the system and the first experiments. From here on it is assumed knowledge.",
  },
  {
    id: "induction",
    date: "2026-06-12",
    track: "bee",
    title: "First bee lab induction at the field station",
  },
  {
    id: "name",
    date: "2026-06-16",
    track: "team",
    title: "NECTAR, and the Agriculture village",
    detail:
      "Novel Engineered Colony Therapy for Apiary Resilience, after two rounds of voting. Agriculture takes the village poll with six.",
  },
  {
    id: "varroa-scarcity",
    date: "2026-06-18",
    track: "bee",
    title: "Almost no mites in the frames",
    detail:
      "Collecting enough Varroa for mite assays before August turns out to be impossible. The plan inverts: dose live bees first, use the result to cut the target list, and test on mites later with more statistical power.",
    turn: true,
    setback: true,
    threads: ["mite", "dose"],
    links: [{ label: "Varroa work", href: "/bee-lab#varroa-work" }],
  },
  {
    id: "target-cut",
    date: "2026-06-22",
    track: "dry",
    title: "The target list is cut from thirty-three to about fifteen",
    detail:
      "Bee-lab capacity, not sequence quality, is what decides the size of the list.",
    threads: ["target"],
  },
  {
    id: "dsrna-arithmetic",
    date: "2026-06-23",
    track: "wet",
    title: "The dsRNA arithmetic does not work",
    detail:
      "Adult assays across every treatment would need about 140 mg of dsRNA; transcription yields about 45 mg from 250 reactions. Larval studies need about 20 mg, so larvae become the route.",
    turn: true,
    setback: true,
    threads: ["dose", "build"],
    check: true,
  },
  {
    id: "spending-freeze",
    date: "2026-06-29",
    track: "team",
    title: "Spending freeze",
    detail:
      "With roughly £10,000 still needed to reach Paris, everything outside rent has to be cleared first.",
    threads: ["money"],
  },
  {
    id: "bee-lab-opens",
    date: "2026-06-29",
    track: "bee",
    title: "Bee lab work begins, and the lab journal opens",
    detail: "The first entry is sucrose preparation.",
    threads: ["story"],
    links: [{ label: "Bee lab notebook", href: "/bee-lab/notebook" }],
  },

  /* ------------------ Act 3: two labs at once (Jul to Aug) ---------------- */
  {
    id: "schools-talk",
    date: "2026-07-01",
    track: "hp",
    title: "A schools session arranged",
    detail:
      "A careers and synthetic biology talk, also used to collect the students' own views on genetic modification. Delivered mid-July; a second session was cancelled for lack of people.",
    links: [{ label: "Public outreach", href: "/education" }],
  },
  {
    id: "wet-lab-opens",
    date: "2026-07-03",
    track: "wet",
    title: "Wet lab access",
    detail: "Bench work starts the following Monday.",
  },
  {
    id: "bee-group",
    date: "2026-07-03",
    track: "bee",
    title: "The bee lab group is formed",
    detail:
      "Ten members, protective equipment and first aid in place, and a haemolymph extraction demonstrated.",
  },
  {
    id: "australia-case",
    date: "2026-07-03",
    track: "hp",
    title: "Australia case study, and the first survey draft",
    detail:
      "Feedback on the draft asks for beekeeper location and operation scale, so that answers line up with the hive profiles in the model.",
    links: [
      { label: "Case study: Australia", href: "/case-studies/australia" },
    ],
  },
  {
    id: "anjum-training",
    date: "2026-07-06",
    track: "bee",
    title: "Training in larval staging and haemolymph extraction",
    detail:
      "The team commits to keeping the journal detailed enough to write the wiki from.",
    threads: ["story"],
  },
  {
    id: "ecotox-interview",
    date: "2026-07-06",
    track: "hp",
    title: "Environmental risk interview",
    detail:
      "A former government consultant in environmental chemistry and ecotoxicological risk assessment.",
    links: [{ label: "The conversation", href: "/human-practices#sm-lam" }],
  },
  {
    id: "sequencing-credit",
    date: "2026-07-08",
    track: "wet",
    title: "Sequencing credit secured",
    detail:
      "A discount later in the month brings the per-reaction cost down by roughly two thirds, which is what makes repeated sequencing rounds affordable in September.",
    threads: ["money", "build"],
  },
  {
    id: "feeders",
    date: "2026-07-11",
    until: "2026-07-21",
    track: "bee",
    title: "Feeding hardware, printed in house",
    detail:
      "Feeding-tube adapters printed on the team's own machine, then a batch of sixty-six, with an evaporation assay across six adapter combinations to check they hold a dose.",
    threads: ["dose"],
    links: [{ label: "The hive insert", href: "/bee-lab#the-hive-insert" }],
  },
  {
    id: "wrong-fragments",
    date: "2026-07-13",
    track: "wet",
    title: "Only two of six ordered fragments are the right ones",
    setback: true,
    threads: ["build"],
  },
  {
    id: "harness-fails",
    date: "2026-07-14",
    track: "bee",
    title: "The first harnessing attempt fails",
    detail:
      "Bees slip out of the tape and feed poorly. They were older, already-fed foragers rather than newly emerged bees, which is the fix.",
    setback: true,
    threads: ["dose"],
    links: [
      { label: "Can we deliver a known dose?", href: "/engineering#cycle-b1" },
    ],
  },
  {
    id: "assay-400",
    date: "2026-07-15",
    track: "bee",
    title: "The four-hundred-bee assay is designed",
    detail:
      "Four constructs, five concentrations, five replicates and two collection points, to ask whether construct length changes what reaches the haemolymph.",
    threads: ["dose", "quantify"],
  },
  {
    id: "improvised-tubes",
    date: "2026-07-16",
    track: "bee",
    title: "Extraction tubes improvised",
    detail:
      "Purpose-made tubes are unavailable, so PCR tubes with a punctured base sit inside Eppendorfs. Four hundred and fifty proper ones are needed before the real assay.",
    setback: true,
    threads: ["dose"],
  },
  {
    id: "throughput",
    date: "2026-07-18",
    track: "bee",
    title: "Throughput measured: twenty bees per person per hour",
    detail:
      "The number that decides how large any bee experiment on this project is allowed to be.",
    threads: ["dose"],
    check: true,
  },
  {
    id: "construct-comparison",
    date: "2026-07-19",
    track: "wet",
    title: "The first quantitative comparison of constructs",
    detail:
      "Yields split three ways across the length series, and the diagnosis is sequence errors in the promoter region of two of the templates. Of roughly eleven primer iterations, one pairing works.",
    threads: ["build"],
    check: true,
    links: [
      {
        label: "Can we transcribe it reliably?",
        href: "/engineering#cycle-1-3",
      },
    ],
  },
  {
    id: "qpcr-ceiling",
    date: "2026-07-19",
    track: "wet",
    title: "A 700 bp amplicon cannot be quantified by qPCR",
    detail:
      "Cycling is too fast for complete extension, and the practical ceiling is around 150 bp. The interim readout becomes reverse transcription and conventional PCR against a ladder, with gel staining as the route to a number.",
    turn: true,
    threads: ["quantify"],
    links: [
      {
        label: "Can we quantify it by RT-qPCR?",
        href: "/engineering#cycle-3-3",
      },
    ],
  },
  {
    id: "first-feed",
    date: "2026-07-22",
    track: "bee",
    title: "First adult feeding, haemolymph two hours later",
    detail:
      "Thirty nurse bees, dosed with dsRNA carried over from the wet lab.",
    threads: ["dose"],
  },
  {
    id: "frame-measured",
    date: "2026-07-22",
    track: "bee",
    title: "A hive frame measured for the insert",
    links: [{ label: "The hive insert", href: "/bee-lab#the-hive-insert" }],
  },
  {
    id: "honey-company",
    date: "2026-07-23",
    track: "hp",
    title: "The interview that moved the project",
    detail:
      "A honey company's science and regulatory leads. Two things came back: a strict national ban makes the engineered-organism route unusable in that market while a yeast-extract route is feasible, and price rather than efficacy decides what a beekeeper buys, because honey is a low-margin business.",
    turn: true,
    threads: ["chassis"],
    links: [
      {
        label: "What must it cost?",
        href: "/human-practices#q5-what-must-it-cost",
      },
    ],
  },
  {
    id: "almond-interview",
    date: "2026-07-24",
    track: "hp",
    title: "Almond industry interview",
    links: [{ label: "The conversation", href: "/human-practices#sm-lewis" }],
  },
  {
    id: "overlap-extension",
    date: "2026-07-25",
    track: "wet",
    title: "Overlap-extension assembly adopted",
    detail:
      "Three reactions per fragment, and only two targets carried forward rather than the fifty-one a full panel would need.",
    threads: ["build"],
  },
  {
    id: "hp-gap-review",
    date: "2026-07-25",
    track: "hp",
    title: "The human practices gap review",
    detail:
      "Stakeholders had been collected but not connected to each other, markets and the public were under-explored, and misuse was unaddressed. The stakeholder map, the profiles and the debate podcast all come out of this meeting.",
    turn: true,
    threads: ["story"],
    links: [{ label: "Who we spoke to", href: "/human-practices#the-record" }],
  },
  {
    id: "first-dbtl-week",
    date: "2026-07-26",
    track: "wet",
    title: "The week plan written as a cycle",
    detail:
      "Validate the primers, make enough dsRNA at each length for both assays, then spike haemolymph with known concentrations and compare recovery against buffer. It is the first plan on the project written as design, build and test rather than as a task list.",
    threads: ["quantify", "dose"],
    links: [{ label: "Engineering", href: "/engineering" }],
  },
  {
    id: "field-scope",
    date: "2026-07-27",
    track: "hp",
    title: "Field testing scope fixed",
    detail:
      "Testing stays in Oxford, and the engineered gut symbiont will not be field tested at all. It is described in the team's own words as a regulation landmine.",
    turn: true,
    threads: ["chassis"],
    links: [
      {
        label: "Regulatory position",
        href: "/safety-and-security#regulatory-position",
      },
    ],
  },
  {
    id: "larval-spiking",
    date: "2026-07-27",
    until: "2026-07-30",
    track: "bee",
    title: "Larval spiking begins",
    detail:
      "Twelve larvae dosed directly with 20 µL, with the frames marked and photographed so the same larvae can be found again.",
    threads: ["dose"],
    check: true,
  },
  {
    id: "resistance-literature",
    date: "2026-07-29",
    track: "hp",
    title: "Reading on resistance, to acaricides and to dsRNA",
    detail:
      "Pests evolve resistance to RNA interference too. It becomes a stewardship question rather than a footnote.",
    links: [
      {
        label: "Resistance and stewardship",
        href: "/safety-and-security#resistance-and-stewardship",
      },
    ],
  },
  {
    id: "website",
    date: "2026-07-29",
    until: "2026-08-03",
    track: "team",
    title: "A project website, and a redesigned summary",
    threads: ["story"],
  },
  {
    id: "prototypes-application",
    date: "2026-07-24",
    until: "2026-08-03",
    track: "hp",
    title: "Prototypes for Humanity application",
    detail:
      "Human practices supplies the problem definition, the existing products, and the economic case. Submitted on deadline day.",
    threads: ["story"],
  },
  {
    id: "larvae-24h",
    date: "2026-08-01",
    until: "2026-08-04",
    track: "bee",
    title: "Intact dsRNA recovered from larvae at 24 hours",
    detail:
      "Whole larvae extracted a day after a 1 µg dose. Reverse transcription and PCR show the construct still intact, and plenty of it. It is the project's first real result.",
    turn: true,
    threads: ["dose", "quantify"],
    check: true,
    links: [
      {
        label: "Can we detect ingested dsRNA?",
        href: "/engineering#cycle-3-2",
      },
    ],
  },
  {
    id: "water-controls",
    date: "2026-08-05",
    track: "wet",
    title: "The water controls produce clean bands",
    detail:
      "Traced to primer stocks carrying template DNA. In the same week the team mandates backdating the journal with every gel image and reading, because only two gels existed in a form anyone else could look at.",
    turn: true,
    setback: true,
    threads: ["quantify", "story"],
    links: [
      { label: "Dimer or contamination?", href: "/engineering#cycle-3-3b" },
    ],
  },
  {
    id: "restain",
    date: "2026-08-07",
    track: "wet",
    title: "Why the denaturing gel shows nothing",
    detail:
      "Denaturation removes the structure the dye binds to, so the dye never stays in the gel. Soaking the gel after the run brings the bands back within half an hour.",
    threads: ["quantify"],
    links: [
      {
        label: "Can the dsRNA report its own concentration?",
        href: "/engineering#cycle-3-4",
      },
    ],
  },
  {
    id: "concatenation",
    date: "2026-08-07",
    track: "dry",
    title: "Concatenating the best windows makes the design worse",
    detail:
      "A single 200 bp window yields around 176 perfectly matching small RNAs. Eight concatenated best 24-mers of similar total length yield eight, because the products spanning the junctions mismatch. The scoring has to penalise junctions.",
    turn: true,
    threads: ["target"],
    check: true,
    links: [
      {
        label: "Which sequence silences the mite?",
        href: "/engineering#cycle-d1",
      },
    ],
  },
  {
    id: "sucrose",
    date: "2026-08-07",
    track: "wet",
    title: "Sucrose hides single strands, not double ones",
    detail:
      "Single-stranded RNA in sucrose never leaves the well; correctly annealed dsRNA in sucrose runs normally. The feeding vehicle is therefore fine for the product, but standard curves have to be made without it.",
    threads: ["quantify", "dose"],
  },
  {
    id: "route-to-market",
    date: "2026-08-07",
    track: "hp",
    title: "Route to market mapped across six jurisdictions",
    detail:
      "Written for both the yeast-extract and the engineered-organism route, side by side. It is the document the chassis decision is eventually made on.",
    turn: true,
    threads: ["chassis"],
    links: [
      { label: "Regulatory path", href: "/entrepreneurship#regulatory-path" },
    ],
  },
  {
    id: "sterility",
    date: "2026-08-08",
    track: "bee",
    title: "Controls tightened after suspected carryover",
    detail:
      "Ethanol preserves nucleic acid rather than removing it. Every batch now carries five sucrose-only negative controls, and the bleach and dry-ice steps are written down in order.",
    setback: true,
    threads: ["quantify"],
  },
  {
    id: "dye-heat",
    date: "2026-08-09",
    track: "wet",
    title: "The chronic weak bands were heat",
    detail:
      "The dye degrades above about 50 °C, which a gel passes after twenty minutes at 100 V. Run shorter and cooler, or run at the recommended field strength and wait longer.",
    turn: true,
    threads: ["quantify"],
    links: [{ label: "The measurement cycle", href: "/engineering#cycle-3-4" }],
  },
  {
    id: "stability-course",
    date: "2026-08-11",
    track: "bee",
    title: "Adult stability time course",
    detail:
      "Forty holders prepared, equipment bleached daily, and haemolymph taken at one, three, six and twenty-four hours.",
    threads: ["dose"],
  },
  {
    id: "ivt-six-hours",
    date: "2026-08-12",
    track: "wet",
    title: "Transcription runs for at least six hours, from here on",
    detail:
      "Two poor yields traced back to a two-hour reaction rather than an overnight one. It becomes a standing rule.",
    threads: ["build"],
    links: [
      {
        label: "Can we transcribe it reliably?",
        href: "/engineering#cycle-1-3",
      },
    ],
  },
  {
    id: "promo-video",
    date: "2026-08-12",
    track: "team",
    title: "Promotional video released",
    detail: "With original music written by a member of the team.",
    threads: ["story"],
  },
  {
    id: "wiki-starts",
    date: "2026-08-14",
    track: "team",
    title: "Wiki work begins",
    detail:
      "Structure, ideation and a shared content document. Everyone is asked to read winning wikis first, for the level of detail rather than the look.",
    threads: ["story"],
  },
  {
    id: "integrated-hp",
    date: "2026-08-14",
    track: "hp",
    title: "Integrated human practices reassessed",
    detail:
      "So many design changes had come out of stakeholder conversations that the team stops treating integrated work as a secondary target and pursues both.",
    threads: ["chassis", "story"],
    links: [
      { label: "Before and after", href: "/human-practices#before-and-after" },
    ],
  },
  {
    id: "mrna-correction",
    date: "2026-08-15",
    track: "hp",
    title: "A public description corrected",
    detail:
      "A beekeeping group's blog had described the project as an mRNA vaccine. The team asks for RNA-based biopesticide instead, and uses the same wording everywhere afterwards.",
    threads: ["story"],
  },
  {
    id: "ggg",
    date: "2026-08-16",
    track: "wet",
    title: "The kit wants GGG, not G",
    detail:
      "The awkward transcription yields trace back to the transcription start site. The advice taken is to stop optimising around a single base and order promoter flaps that match the kit.",
    setback: true,
    threads: ["build"],
    links: [
      { label: "The four build failures", href: "/engineering#cycle-1-3" },
    ],
  },
  {
    id: "competing-paper",
    date: "2026-08-17",
    track: "dry",
    title: "A directly competing paper publishes",
    detail:
      "Loop-ended dsRNA in Varroa, from a preprint the team had been following. External validation of the design premise, arriving mid-project.",
    threads: ["build"],
  },
  {
    id: "honey-framework",
    date: "2026-08-18",
    track: "hp",
    title: "The HONEY framework adopted",
    detail:
      "Hear, Observe, Navigate, Evaluate, Yield. It gives the human practices work the same shape as a design cycle, with the chassis decision sitting inside Navigate.",
    turn: true,
    threads: ["story"],
    links: [
      { label: "How we worked", href: "/human-practices#honey-how-we-worked" },
    ],
  },
  {
    id: "no-mango-lost",
    date: "2026-08-18",
    track: "bee",
    title: "An entire assay arm is lost",
    detail:
      "The bees escaped, the wrong tape having been used, and could no longer be identified. The twenty-four hour arm was never repeated.",
    setback: true,
    threads: ["dose"],
  },
  {
    id: "gblocks",
    date: "2026-08-20",
    track: "wet",
    title: "Eighteen fragments ordered",
    detail:
      "Six assemblies, each split into three pieces so that a vendor would synthesise them at all. Quoted at two days, they arrive in twelve.",
    threads: ["build"],
    links: [
      {
        label: "A construct nobody will synthesise",
        href: "/engineering#cycle-1-2",
      },
    ],
  },
  {
    id: "mini-jamboree",
    date: "2026-08-24",
    track: "team",
    title: "Mini jamboree at Imperial",
    detail:
      "The feedback shaped this wiki: keep one story running throughout, show the cycle rather than the conclusion, use numbers including how many people you spoke to, and say plainly what is novel.",
    turn: true,
    threads: ["story"],
  },
  {
    id: "to1-arrives",
    date: "2026-08-25",
    track: "wet",
    title: "The fluorescent ligand arrives",
    detail: "It unlocks the whole aptamer-based quantification arm.",
    threads: ["quantify"],
  },
  {
    id: "cbd-interview",
    date: "2026-08-26",
    track: "hp",
    title: "Convention on Biological Diversity interview",
    detail:
      "A scientist who assesses synthetic biology solutions, with dsRNA experience.",
    links: [
      {
        label: "Should we be making a GMO at all?",
        href: "/human-practices#q1-should-we-be-making-a-gmo-at-all",
      },
    ],
  },
  {
    id: "haemolymph-bank",
    date: "2026-08-27",
    track: "bee",
    title: "A haemolymph bank for calibration",
    detail:
      "Untreated haemolymph from forty bees, most giving five to ten microlitres. Yield turned out to depend on exactly where the antenna is cut, which the protocol had never specified.",
    threads: ["quantify"],
  },
  {
    id: "budget-tightens",
    date: "2026-08-29",
    track: "team",
    title: "The budget tightens",
    detail:
      "A reagent had not been accounted for, leaving little margin. Travel is booked early while it is cheap, and outreach restarts.",
    threads: ["money"],
  },
  {
    id: "survey-ethics",
    date: "2026-08-28",
    until: "2026-09-09",
    track: "hp",
    title: "Survey ethics process",
    detail:
      "University approval, named researchers and completed training, all before a single response can be collected. Submitted on 9 September.",
  },

  /* ------------------- Act 4: making it land (Sep onward) ----------------- */
  {
    id: "wax-chandlers",
    date: "2026-09-01",
    track: "team",
    title: "A £5,000 donation from a livery company",
    detail:
      "It covers the remaining wet lab costs and pays for additional people to travel.",
    threads: ["money"],
    links: [{ label: "Sponsors and funders", href: "/partners" }],
  },
  {
    id: "five-workstreams",
    date: "2026-09-01",
    track: "wet",
    title: "Five parallel workstreams assigned",
    detail:
      "Assembly, transcription, standard curves, calibration, and RNA extraction, with the extraction taught to a second person so it does not sit with one pair of hands.",
  },
  {
    id: "calibration-plate",
    date: "2026-09-01",
    track: "wet",
    title: "The calibration plate designed as a one-person job",
    detail:
      "Twenty dilutions across ninety-six wells, deliberately run by a single person so that handling error stays constant across the curve.",
    threads: ["quantify"],
  },
  {
    id: "stakeholder-profiles",
    date: "2026-09-01",
    track: "hp",
    title: "Stakeholder profiles started",
    detail:
      "Key takeaways per interview, and what each one led the team to do differently.",
    threads: ["story"],
    links: [{ label: "Who we spoke to", href: "/human-practices#the-record" }],
  },
  {
    id: "mite-soak-designed",
    date: "2026-09-01",
    track: "bee",
    title: "The mite soaking protocol designed",
    detail:
      "Six hours in solution, turned every half hour, then into capsules with pupae. Built from three published methods.",
    threads: ["mite"],
  },
  {
    id: "sugar-shake",
    date: "2026-09-02",
    track: "bee",
    title: "No mites from the most infested hive",
    setback: true,
    threads: ["mite"],
  },
  {
    id: "first-mites",
    date: "2026-09-03",
    track: "bee",
    title: "First mites collected, first pilot run",
    detail:
      "About sixty mites by sieve. None of them move once dry after the soak, which is either slow recovery or death, and the pilot cannot tell which.",
    setback: true,
    threads: ["mite"],
  },
  {
    id: "rna-extraction",
    date: "2026-09-03",
    track: "wet",
    title: "An insect RNA extraction protocol adopted",
    detail:
      "With one check that matters more than the rest: a reading is only trustworthy if a tenfold dilution of the sample scales linearly, because the cleanup chemistry inflates absorbance on its own.",
    threads: ["quantify"],
    links: [
      {
        label: "Getting RNA out of bee material",
        href: "/engineering#cycle-3-1",
      },
    ],
  },
  {
    id: "podcast-debate",
    date: "2026-09-03",
    track: "hp",
    title: "A design requirement nobody had asked for",
    detail:
      "Recorded as a debate between a researcher on natural mite resistance and a commercial beekeeper. Both supported the project, and both pointed out that current treatments cannot be used while honey supers are on the hive. If NECTAR can be, beekeepers could treat at the right moment and less often.",
    turn: true,
    threads: ["story", "chassis"],
    links: [
      {
        label: "What would a beekeeper use?",
        href: "/human-practices#q4-what-would-a-beekeeper-actually-use",
      },
    ],
  },
  {
    id: "dont-wash",
    date: "2026-09-04",
    track: "bee",
    title: "Washing the mites kills them",
    setback: true,
    threads: ["mite"],
  },
  {
    id: "gibson-1",
    date: "2026-09-05",
    track: "wet",
    title: "First assembly round: no colonies at all",
    setback: true,
    threads: ["build"],
  },
  {
    id: "econ-model",
    date: "2026-09-05",
    track: "dry",
    title: "The economic model turns into a specification",
    detail:
      "Four hive profiles, and a landscape module deleted because beekeepers' landscape data was too coarse to use. Its next output is the treatment efficacy the lab has to reach, per profile.",
    turn: true,
    links: [{ label: "Economic modelling", href: "/economic-modelling" }],
  },
  {
    id: "housing-comparison",
    date: "2026-09-07",
    track: "bee",
    title: "Four ways of housing a mite, compared",
    detail:
      "Forty mites soaked, then split between capped cells in the frame, capsules with pupae, capsules with larvae, and capsules alone.",
    threads: ["mite"],
  },
  {
    id: "autofluorescence",
    date: "2026-09-07",
    track: "bee",
    title: "Haemolymph autofluorescence characterised",
    detail:
      "Absorbance and emission mapped from 300 to 700 nm, to measure how much the matrix itself glows inside each dye's window. The whole quantification strategy rests on this control.",
    threads: ["quantify"],
    links: [
      {
        label: "Validation in matrix",
        href: "/measurement#validation-in-biological-matrix",
      },
    ],
  },
  {
    id: "mites-need-host",
    date: "2026-09-08",
    track: "bee",
    title: "A mite on its own does not survive",
    detail:
      "At twenty-four hours: four of ten in capped cells, three of five on pupae, two of five on larvae, and none of the eighteen kept alone, soaked or not. Every subsequent design keeps the mite on a host.",
    turn: true,
    threads: ["mite"],
    check: true,
    links: [{ label: "Does it kill the mite?", href: "/engineering#cycle-b3" }],
  },
  {
    id: "sybr-series",
    date: "2026-09-10",
    track: "bee",
    title: "A stain dilution series, logged",
    detail:
      "A tenfold series gives signal at the low end of the range. The calibrated detection and quantification limits described in cycle 3.5, with blanks and replicates, have still to be run.",
    threads: ["quantify"],
    check: true,
    links: [
      {
        label: "Would an ordinary stain do better?",
        href: "/engineering#cycle-3-5",
      },
    ],
  },
  {
    id: "gibson-2",
    date: "2026-09-11",
    track: "wet",
    title: "Second assembly round: two plates of four",
    detail:
      "Colonies on two. One of the remaining two grows the following day, and one never does.",
    setback: true,
    threads: ["build"],
  },
  {
    id: "soak-abandoned",
    date: "2026-09-12",
    track: "bee",
    title: "The soak method is abandoned",
    detail:
      "Three findings force it: the delivered dose was far below what was intended, the mites were still not awake five hours later, and most of the controls did not survive. The replacement spikes larvae, lets the hive cap them, then inserts live mites into the cells and scores survival at seventy-two hours.",
    turn: true,
    setback: true,
    threads: ["mite", "dose"],
    links: [{ label: "Husbandry, cycle B3", href: "/engineering#cycle-b3" }],
  },
  {
    id: "nanodrop-qubit",
    date: "2026-09-12",
    track: "wet",
    title: "Two instruments disagree, so build a correction",
    detail:
      "Read on one, read on the other, treat with nuclease, read both again. The disagreement is resolved by measurement rather than by picking a favourite.",
    turn: true,
    threads: ["quantify"],
    links: [
      { label: "How much dsRNA do we have?", href: "/engineering#cycle-1-4" },
    ],
  },
  {
    id: "linearity-test",
    date: "2026-09-14",
    track: "wet",
    title: "The decision rule written before the experiment",
    detail:
      "A twofold dilution series, with the interpretation fixed in advance: a flat line means the conversion reflects real chemistry, and readings that rise on dilution mean the instrument is compressing its range.",
    threads: ["quantify"],
    links: [
      { label: "The measurement headline", href: "/engineering#cycle-1-4" },
    ],
  },
  {
    id: "journal-split",
    date: "2026-09-14",
    track: "team",
    title: "The lab journal splits in three",
    detail:
      "Wet lab, bee lab and standard operating procedures. The single file had outgrown itself.",
    threads: ["story"],
    links: [{ label: "Experiments and lab book", href: "/experiments" }],
  },
  {
    id: "sequencing-1",
    date: "2026-09-16",
    track: "wet",
    title: "First sequencing round reads as failure",
    detail:
      "Every assembly appears to have failed, but the diagnosis is muddled: the gel band had been the right size and some sequence features matched.",
    setback: true,
    threads: ["build"],
  },
  {
    id: "wiki-plan",
    date: "2026-09-18",
    track: "team",
    title: "The wiki plan, with page-level owners",
    detail:
      "A functional wiki by 7 October, two weeks before the freeze, and a standing rule: cite every claim, and make clear what is our result and what is literature.",
    threads: ["story"],
  },
  {
    id: "miniprep",
    date: "2026-09-20",
    track: "wet",
    title: "The miniprep had been shearing the reads",
    detail:
      "The provider reports heavy shearing and almost nothing usable. Reducing one handling step fixes it, and twenty-five plasmids go out the next day.",
    threads: ["build"],
  },
  {
    id: "wiki-questions",
    date: "2026-09-20",
    track: "hp",
    title: "The wiki restructured around the questions",
    detail:
      "Each design question gets its own cycle: an anchor interview, the research behind it, how the answer changed the design, the modelling, and one paragraph on what the product became.",
    threads: ["story"],
    links: [
      {
        label: "The six questions",
        href: "/human-practices#the-six-questions",
      },
    ],
  },
  {
    id: "sequencing-2",
    date: "2026-09-21",
    track: "wet",
    title: "Clean reads, and apparently no insert",
    detail:
      "The miniprep fix worked and the reads are good. The first reading is that none of the plasmids carry the fragment, partly walked back on re-examination because the reported lengths suggest otherwise. Unresolved at the end of the record.",
    setback: true,
    threads: ["build"],
  },
  {
    id: "yeast-fallback",
    date: "2026-09-22",
    track: "wet",
    title: "A route into the yeast plasmid, as a fallback",
    detail:
      "One ribozyme-flanked fragment either side of a bidirectional promoter, in two sequential assembly rounds. A yeast titre is needed whichever route reaches it first.",
    turn: true,
    threads: ["chassis", "build"],
    links: [{ label: "Yeast", href: "/yeast" }],
  },
  {
    id: "safety-form",
    date: "2026-09-22",
    track: "team",
    title: "Safety check-in submitted",
    links: [{ label: "Safety and security", href: "/safety-and-security" }],
  },
  {
    id: "beekeeping-differentiator",
    date: "2026-09-22",
    track: "team",
    title: "The beekeeping experience named as the thing to publish",
    detail:
      "No other team found has worked with live bees at this depth, so the experimental beekeeping methods become a contribution in their own right rather than a means to an end.",
    threads: ["story"],
    links: [{ label: "Contribution", href: "/contribution" }],
  },
  {
    id: "gels-for-wiki",
    date: "2026-09-23",
    track: "wet",
    title: "Gel evidence gathered for the wiki",
    detail:
      "Including the contaminated-primer gels. The failures go on the wiki next to the results.",
    threads: ["story"],
    links: [{ label: "Results", href: "/results" }],
  },

  /* ------------------------------ still ahead ----------------------------- */
  {
    id: "wiki-freeze",
    date: "2026-10-21",
    track: "team",
    title: "Wiki freeze",
    detail: "Nothing on this site changes after this date.",
    turn: true,
    ahead: true,
  },
  {
    id: "jamboree",
    date: "2026-11-13",
    until: "2026-11-16",
    track: "team",
    title: "Grand Jamboree, Paris",
    detail:
      "Ten members and the supervisor, with the hive insert in a suitcase.",
    turn: true,
    ahead: true,
  },
];

/* ------------------------------------------------------------- derivation */

/** Every month the record covers, oldest first, as YYYY-MM. */
export function months(events: TimelineEvent[] = EVENTS): string[] {
  const seen = new Set<string>();
  for (const e of events) seen.add(e.date.slice(0, 7));
  return [...seen].sort();
}

/** The act a month belongs to. Every month in the record has one. */
export function actOf(month: string): Act {
  return (
    ACTS.find((a) => month >= a.from && month <= a.to) ?? ACTS[ACTS.length - 1]
  );
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "September 2026" from "2026-09". */
export function monthLabel(month: string): string {
  const [year, m] = month.split("-");
  return `${MONTH_NAMES[Number(m) - 1]} ${year}`;
}

/** "23 Sep", or "27–30 Jul" where the source records a range. */
export function dayLabel(event: TimelineEvent): string {
  const short = (iso: string) => {
    const [, m, d] = iso.split("-");
    return {
      day: String(Number(d)),
      mon: MONTH_NAMES[Number(m) - 1].slice(0, 3),
    };
  };
  const from = short(event.date);
  if (!event.until) return `${from.day} ${from.mon}`;
  const to = short(event.until);
  return from.mon === to.mon
    ? `${from.day}–${to.day} ${to.mon}`
    : `${from.day} ${from.mon} – ${to.day} ${to.mon}`;
}

/** The long form, for the written record: "23 September 2026". */
export function fullDate(event: TimelineEvent): string {
  const long = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return `${Number(d)} ${MONTH_NAMES[Number(m) - 1]} ${y}`;
  };
  return event.until
    ? `${long(event.date)} to ${long(event.until)}`
    : long(event.date);
}

/** Chronological, and stable where two things happened on the same day. */
export const EVENTS_BY_DATE = [...EVENTS].sort(
  (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
);
