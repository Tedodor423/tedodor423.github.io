# Engineering page: sections lifted off the page

**This file is not routed and renders nowhere.** It is the page-level material
that used to sit around the cycles on `/engineering`, kept here rather than
deleted when the page was cut back to a comb of hexagons.

Two parts of it have already been taken back out of here and are live:

- the cycles themselves are now one file each in `src/content/cycles/`;
- the `## Workstream` and `## Bee lab` / `## Dry lab` intros below were copied
  into `src/content/cycle-families.md`, which is what titles the six hexagons.
  Editing them here changes nothing. Edit them there.

Both are rendered by the `dbtl-cycles` component.

Every word below is the team's, unchanged. It needs a decision: fold each part
into another page, put some of it back on `/engineering`, or drop it. Until
then it is only preserved, not published.

> **TODO —** Decide where these sections go. Candidates: "What went wrong" and
> "Cross-cutting lessons" read like [Results](/results) or
> [Contribution](/contribution); "Still missing" is a standing honesty note that
> may belong back on the engineering page; "How to read a cycle" is reference
> material that the hexagons now imply. Owner: whoever owns the engineering page.

---

NECTAR is built from nineteen wet-lab engineering cycles in four workstreams, plus
the bee-lab and dry-lab cycles that test what the wet lab makes. This page records
the decisions: what we asked, what we built, what happened, and what we did
differently afterwards. Chronology belongs to [the timeline](/timeline), evidence
to [Results](/results), protocols to the notebooks.

Four of those cycles are dead ends, and we draw them at the same weight as the
rest. Three of them are the most useful things we can hand the next team: the
extraction null (3.1) saves a week, the toehold rejection (3.6) saved us £1,250
and six weeks, and the Mango correction (3.4) is a better measurement result than
the "success" it replaced.

> **FIGURE: the cycle map.** One image, six lanes, one per workstream, cycles
> left to right in each lane. Arrows along a lane are the "what it changed" links;
> the cross-lane arrows are drawn too (1.4 into all of Workstream 3; 2.3 back into
> 2.1; 3.6 into 4.1; 4.1 back into 3.6; 4.2 out of 2.3; M1–M3 into 2.2). Three
> arrows enter from outside the lab and are drawn differently: human practices and
> regulation into 2.1, the IP position into 2.2, the cost model into the required
> yeast titre. Dead ends (2.3, 3.4-as-quantifier, 3.6, and the 3.1 null) are stubs
> at full weight, labelled with what each cost and what it saved. Each node links
> to its cycle below, so the figure is also this page's table of contents.

## How to read a cycle

Seven beats, the same seven every time, so that reading one cycle teaches you how
to read all of them:

**Question → Design → Build → Test → Result → What we learnt → What it changed**

Every cycle carries a status:

| Status           | Means                                        |
| ---------------- | -------------------------------------------- |
| **Demonstrated** | We did it and we have the data               |
| **Investigated** | We ran it; the result is partial or negative |
| **Modelled**     | Computational only, no bench data            |
| **Proposed**     | Designed, not built                          |

Citation tags are the wiki's: `[LIT]` from a source we retrieved and read, `[CALC]`
our own arithmetic with the assumptions stated inline, `[FLAG]` the literature is
silent or we could not verify it, never stated as fact.

## The cycles at a glance

One hexagon per cycle. Pick a lab to light up its cycles, open a hexagon to read
that cycle's four stages, and the table under it says the same thing in one screen.

```component
dbtl-cycles
```

| #                     | Question                                                   | Status       | Where it went                                        |
| --------------------- | ---------------------------------------------------------- | ------------ | ---------------------------------------------------- |
| [1.1](#cycle-1-1)     | What shape should the dsRNA be?                            | Modelled     | Loop ends chosen; the molecule became unbuyable      |
| [1.2](#cycle-1-2)     | How do you build a construct nobody will synthesise?       | Investigated | Modular L0/L1/L2 collection, two-step Gibson         |
| [1.3](#cycle-2-1)     | Can we transcribe it reliably?                             | Demonstrated | Four build failures, four fixes, a primer checklist  |
| [1.4](#cycle-2-6)     | How much dsRNA do we actually have?                        | Demonstrated | NanoDrop abandoned; digest-Qubit became the dose     |
| [2.1](#cycle-2-2)     | Which production and delivery chassis?                     | Investigated | Live symbiont dropped; yeast adopted                 |
| [2.2](#cycle-2-4)     | How do you express a loop-ended dsRNA in yeast?            | Proposed     | Cassette designed; no yeast transformed              |
| [2.3](#cycle-2-5)     | Should _E. coli_ be the production host?                   | Investigated | Deprioritised; kept as a cloning host                |
| [3.1](#cycle-3-1)     | How do we get RNA out of bee material?                     | Demonstrated | A clean null; column beat TRIzol on variance         |
| [3.2](#cycle-3-2)     | Can we detect ingested dsRNA at all?                       | Demonstrated | Yes, qualitatively, at 24 h in larval haemolymph     |
| [3.3](#cycle-3-3)     | Can we quantify it by RT-qPCR?                             | Investigated | Method built; MIQE standard curve outstanding        |
| [3.3b](#cycle-3-3b)   | Is the band in our water control dimer or contamination?   | Demonstrated | Contamination; a diagnostic worth publishing         |
| [3.4](#cycle-4-1)     | Can the dsRNA report its own concentration?                | Investigated | No. Mango demoted from quantifier to selector        |
| [3.4b](#cycle-4-2)   | Can we wash the matrix away instead of reading through it? | Proposed     | Capture format designed on Unrau's advice            |
| [3.5](#cycle-4-3)     | Would an ordinary stain do better?                         | Proposed     | SYBR Gold, 25–250× more sensitive, not yet run       |
| [3.6](#cycle-4-4)     | Could a toehold switch read the dsRNA?                     | Modelled     | Rejected on four independent grounds                 |
| [4.1](#cycle-5-1)     | Can we put a protein-binding site in the loop?             | Modelled     | Identical hairpins do not fold; stems synonymised    |
| [4.2](#cycle-5-2)     | Can we make and quantify the adaptor protein?              | Proposed     | Active sites, not mass, defined as the measurement   |
| [4.3](#cycle-5-3)     | Can we target the dsRNA to the mite?                       | Proposed     | Demonstration moved from the bee to the feeder       |
| [4.4](#cycle-5-4)     | Does a protein ride the dsRNA across the bee gut?          | Investigated | Assay run; readout not yet in the record             |
| [B1](#cycle-b1)       | Can we deliver a known dose to a bee?                      | Demonstrated | Newly-emerged bees and PCR-tube feeders standardised |
| [B2](#cycle-b3)       | Can we get enough haemolymph out of an adult bee?          | Demonstrated | 8–15 µL per bee, centrifugal method standardised     |
| [B3](#cycle-v1)       | Does it kill the mite?                                     | Investigated | Husbandry: a host is required, the soak is not fatal |
| [D1](#cycle-d1)       | Which sequence silences the mite?                          | Modelled     | NectarDesigner; concatenation tested and set aside   |
| [M1–M3](#cycle-m1-m3) | What treatment efficacy is worth reaching?                 | Modelled     | Sets the titre the wet lab has to hit                |

## Workstream 1: Making the molecule

Can we produce a defined, measurable quantity of a structurally non-trivial dsRNA?

## Workstream 2: Where the dsRNA is made

Which chassis both produces the dsRNA and delivers it?

## Workstream 3: Measuring dsRNA in bee material

There is no established method for quantifying ingested dsRNA in honeybee
haemolymph. Maori et al. 2019 fed 500 ng of DIG-labelled dsRNA per bee and recovered
it from raw haemolymph at 5 h, but published no concentration `[LIT]`. Muita et al.
2026 could see their dsRNA only because it was Cy3-labelled `[LIT]`. Of six
published _Varroa_ RNAi papers, three quantify "spectrophotometrically", three state
no method at all, and none reports a Qubit value, an A260/A280 or mass-ladder
densitometry. We could not cite an expected working range because none exists. That
absence is why this workstream exists, and why [measurement](/measurement) is where
we make our strongest claim.

## Workstream 4: Functionalising the dsRNA

Can we attach protein to the dsRNA to change where it goes?

## Bee lab

The wet lab makes the molecule; the bee lab is where it meets an animal. These
cycles are method development, and we count them as engineering because without them
there is nothing to test NECTAR with. Detail and dated entries on
[bee lab](/bee-lab).

## Dry lab

## What went wrong

Collected rather than scattered, because this is the section a future team reads
first.

| What broke                                | How we knew                                     | What changed                                                                                                                                            |
| ----------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 ng/µL from IVT (E1)                     | Two constructs, repeatedly, while others worked | T7 promoter was on both primers. Rebuilt single-orientation; those became the workhorse templates                                                       |
| T7 reverse primers dead (E2)              | No transcript from correct-looking template     | The kit needs GGG after the promoter, not a single G. Reordered, and a construct-series parity error propagated from the replacement order              |
| Gels and iterations failing (E3)          | Two iterations failed together                  | Primer stock had not been mixed. Re-vortexed                                                                                                            |
| dsRNA would not anneal (E4, 20 Jul)       | No duplex band                                  | No salt in the annealing reaction. Salt mix added at a defined ratio                                                                                    |
| Step-2 Gibson PCR gave a smear (7 Sep)    | Smear, not a band                               | Incomplete Gibson leaving short fragments that amplify faster. Ethanol carryover and annealing temperature resolved it; the wrong band had been excised |
| Water controls amplifying (31 Jul)        | Perfect 100 bp band with no template            | Template contamination, not primer-dimer. Diagnosed in 3.3b and published as a protocol                                                                 |
| A perfect calibration curve (3.4)         | R² = 0.9999                                     | The assay was measuring intercalation, not the aptamer. Mango demoted to selector                                                                       |
| Five extraction methods, no winner (3.1)  | All comparable                                  | Chose on variance instead of yield. Published as a null                                                                                                 |
| Mites would not survive husbandry (B3)    | 9/20 with a host, 0/18 alone (p = 0.0013)       | Efficacy screen postponed; endpoint moved to molecular knockdown                                                                                        |
| Foragers died before their timepoint (B1) | 22 of 50 survived the day                       | Newly emerged bees became the standard animal, at 5–10 µL instead of ~30 µL                                                                             |

## Cross-cutting lessons

Four things hold across every workstream, and they are what we would tell ourselves
in week one. They feed directly into [Contribution](/contribution).

1. **When two hypotheses predict the same observation, repeating the experiment is
   worthless.** Design the one where they differ (3.3b), vary everything at once
   factorially (3.3b), or model the thing you cannot see (4.1).
2. **A perfect-looking result is the one to distrust.** R² = 0.9999 in 3.4 was the
   clearest signal that the assay was measuring the wrong thing, because the wrong
   thing happens to be rigorously linear.
3. **Regulatory and IP constraints are design inputs, not paperwork.** They selected
   the chassis (2.1), they selected the marker (2.2), and they constrain the strain
   genotype (2.2).
4. **Negative and null results did the most work.** The extraction null (3.1) saves a
   future team a week, the toehold rejection (3.6) saved us £1,250 and six weeks, and
   the Mango correction (3.4) is a better measurement result than the "success" it
   replaced.

## Still missing

- The cycle map figure.
- D1 and M1–M3 written into the full seven beats, and the larval and mite-assay
  iterations in the bee lab, with their numbers checked against the journals.
- The 4.4 readout, without which the functionalisation arm claims nothing.
- The reference pack. Every `[LIT]` tag on this page resolves to an entry in a
  verified 100-item list that is not yet published on the wiki. Four DOIs in it are
  unconfirmed and one source is a four-year-old preprint; none of those may be cited
  as fact until checked.
- Sequence verification for every construct (1.2).
- The four outstanding bench experiments flagged above: post-cleanup requantification
  (1.4), the MIQE standard curve and spike-recovery (3.3), the Mango specificity
  controls (3.4), and the SYBR Gold standard curve (3.5).

## Where this connects

[Results](/results) · [Wet lab](/wet-lab) · [Bee lab](/bee-lab) ·
[Yeast](/wet-lab-experiments#yeast-production) · [Measurement](/measurement) · [Parts](/parts) ·
[Dry lab and modelling](/model) · [RNA design](/software) ·
[Human practices](/human-practices) · [Contribution](/contribution)

> **TODO —** Link with human practices and other pages. The list above is a flat
> run of links; each cycle that a dialogue or a model actually changed should say
> so at the cycle, and the page it points at should point back. Owner: whoever
> writes human practices.
