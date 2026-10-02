> **What this page proves:** that we could design, build and verify the
> molecule the rest of the project depends on.
> **Where the evidence is:** [Results](/results),
> [experiments and lab book](/wet-lab-experiments), and Workstream 1 on
> [Engineering](/engineering).

Why, what, and what happened. Exactly how is in
[experiments and lab book](/wet-lab-experiments), and the cycle-by-cycle record, with
every failure and its diagnosis, is on [Engineering](/engineering).

## The molecule

NECTAR's dsRNA is a **loop-ended dumbbell**: a ~500 bp duplex stem closed at
both ends by ~150 nt single-stranded loops, transcribed as one RNA from a single
T7 promoter. The shape is the point. Conventional dsRNA falls to ~25% of
starting intensity within 3 h in 50% sucrose and is undetectable by 6 h, while
loop-ended dsRNA holds **~40–70% at day 2** and produces mite mortality where
conventional dsRNA produces none `[LIT]`. Terminal loops remove the free ends
that exonucleases need.

Two consequences follow immediately, and they shape everything below. The
molecule **self-anneals intramolecularly**, so one promoter and no heat-denaturation
step are required. And a closed loop is spare capacity: it can carry a cargo
without touching the duplex that does the silencing.

Loop ends were not our idea alone. We arrived at them from the literature on dsRNA
stability, and **Sean Leonard and Jeffrey E. Barrick** both supported the approach
for a delivery system like ours. Stability matters here more than in most RNAi work
because our route is two handovers long: into the bee, then into the mite.

**Four genes, one molecule.** The first design silenced a single gene. Published
multigene concatenation constructs carry several target sequences in one dsRNA, so
we took the ranked gene pools from [RNA design](/software), chose **four target
genes**, took one favourable **175 bp** region from each, and concatenated them into
a **700 bp** multigene stem. Two such constructs were designed and produced, one
from each candidate pool: a literature-derived pool of genes with previously
demonstrated direct RNAi effects, and an exploratory pool selected on functional
network connectivity. Which genes, and how the pools were filtered, is at cycle 1.1.

> **TODO —** The stem length is written two ways on this page: ~500 bp for the Muita
> geometry above, 700 bp for the four-region concatenate here, and the folding model
> at cycle 1.1 uses 709 bp. Say which number belongs to which construct. Owner: wet
> lab.

**An asymmetric bulge every 23 nt.** Muita et al. tested loop-ended dsRNA carrying
either G–U wobble base pairs or **asymmetric bulges (ASY)** in _Varroa_; both raised
persistence, and with it RNAi and mite mortality, against conventional dsRNA `[LIT]`.
We chose ASY. The antisense strand is left intact and **one nucleotide is deleted
from the sense strand every 23 nt**, leaving one unpaired antisense base per
deletion and a regular single-nucleotide bulge along the stem. **Our 23 nt register
is untested**; Muita's validated construct uses 22. See cycle 1.1.

> **FIGURE: construct architecture.** The dumbbell drawn once, annotated: T7
> promoter, U1 and U2 universal adaptors, the ~500 bp duplex stem, the two
> ~150 nt loops with the L0 / L1 / L2 cargo slot marked, and the ribozyme-flanked
> yeast variant shown underneath as a second row. This figure is reused on
> [parts](/parts) and [yeast](/wet-lab-experiments#yeast-production), so draw it once and draw it properly.

## Why it cannot be bought

Every iGEM synthesis sponsor we approached declined our loop-ended constructs as
too complex. Inverted repeats are the specific thing that breaks commercial gene
synthesis and that recombines out in standard cloning strains. Rather than
re-solve that for each new cargo, **we made the construct modular**:

| Level  | What it is                                    | Role                                                       |
| ------ | --------------------------------------------- | ---------------------------------------------------------- |
| **L0** | Plain loop-ended dumbbell, no cargo           | The control, and the comparator that makes L1 an improvement |
| **L1** | Mango reporter loop                           | The construct reports on itself                            |
| **L2** | MS2 adaptor loop                              | Any protein can be attached via an MCP fusion              |

Universal adaptors **U1** and **U2** flank the cassette, so a single primer pair
amplifies any member of the collection and any future loop cargo drops into a
fixed backbone. Loop spacers exclude BsaI, BsmBI and BbsI sites, homopolymer runs
longer than 3, and yeast poly(A) elements. Assembly is a **two-step Gibson** from
three gBlocks: a three-part one-pot that fails tells you nothing about which
junction broke, a two-step tells you exactly. Part-level detail on
[parts](/parts).

## Cargo in the loops

**Mango (L1).** RNA Mango is a **thermostable G-quadruplex aptamer** that lights up
TO1-Biotin ~1,100-fold `[LIT]`. Because it is itself a short structured loop, it
can _be_ one of the dumbbell's terminal loops rather than being appended to the
molecule: one copy, defined position, no marginal cost, and the same construct
serves IVT now and in-yeast expression later. What it turned out to measure, and
what it did not, is on [measurement](/measurement).

**MS2 (L2).** An array of MS2 coat-protein hairpins in the opposite loop makes
the RNA a docking site for any protein fused to MCP. The array as first designed
**does not fold**, for a reason that generalises beyond our construct, and the
redesign is on [parts](/parts) and at cycle 4.1.

## Where the molecule gets made

Four production routes were compared against one question: does the molecule
survive production intact, at scale, and can it be deployed? Naked dsRNA in
sucrose was kept as an assay and rejected as a product. _Snodgrassella alvi_ was
dropped on regulatory and toolkit grounds. _E. coli_ HT115 was rejected for a
molecular reason rather than an economic one: full-length hairpin RNA is
**degraded in HT115** and RNase III deficiency is not sufficient to prevent it
`[LIT]`, so the best-established bacterial chassis destroys the architecture the
design exists to create. _S. cerevisiae_ was adopted, for **the absence of a
machine** rather than the presence of one. The argument is on [yeast](/wet-lab-experiments#yeast-production) and
the comparison at cycle 2.1.

**An honest framing point we repeat wherever it is relevant.** Engineered
inactivated yeast as an oral dsRNA delivery vehicle against _Varroa_ is **not
novel**: it is anticipated by US 11,252,965 B2 and adjacent to US 9,540,642 B2.
We do not describe the chassis as novel anywhere on this wiki. The novel core of
NECTAR is the RNA design method on [RNA design](/software), and the instrumented
loop.

## How it gets into the hive

**Status: Proposed.** A pollen patty is an existing honeybee nutrient supplement —
sugars, protein supplements such as yeasts, and binding agents — administered as a
slab on top of the hive that worker and nurse bees feed on. Choosing yeast as the
chassis means **the chassis and the delivery vehicle are the same object**, and the
argument for that came from literature review plus discussion with **Prof. Geraldine
Wright**, who has engineered yeast to deliver vital sterols in a pollen patty. Four
advantages, in her and our terms:

- Engineered yeast can be **heat-inactivated** and put into a supplement bees
  readily feed on.
- Yeast can be **significantly enriched in the patty without affecting
  palatability**, which raises the dose administered.
- **Heat-inactivated yeast is not considered a GMO.**
- dsRNA fed to nurse bees, in sucrose, is **transferred to the mite via the
  glandular secretions of nurse bees**, which is what the mite feeds on.

The problem this addresses is a delivery problem. A key limitation of current
_Varroa_ dsRNA therapeutics is that they deliver in a sucrose solution, **in which
dsRNA has a very short half-life**.

> **TODO —** "Stability in sucrose vs stability in pollen patty." The comparison the
> whole delivery argument rests on, flagged as owed in our own write-up with no data
> attached. Until it exists the sucrose half-life is cited from the literature and
> the patty side of it is **unmeasured**, so nothing on this wiki shows that the
> patty is the better carrier. The formulation itself is owed too; see
> [experiments and lab book](/wet-lab-experiments#from-culture-to-product).
> Owner: wet lab.

## Producing the RNA

**Status: Demonstrated.** All dsRNA used for bee-lab and measurement work to
date is IVT-derived, because **no yeast has been transformed**. Templates come from
colony-lysis PCR with adaptor-bearing primers; the product is purified,
transcribed with T7 polymerase, annealed and quantified.

Three process results came out of optimising that route:

- **2 h of IVT is insufficient; overnight incubation roughly doubles yield.**
- **Magnetic-bead purification gives 2,500–3,500 ng/µL per strand** (6 Sep).
- **Annealing needs salt.** On 20 Jul the dsRNA would not anneal at all: without
  counter-ions the phosphate backbones repel. An EDTA / NaCl / Tris pH 7.5 mix
  added as a 20× stock fixed it.

The 6 Sep annealing run gave four stocks at 589–623 ng/µL, stored at −80 °C.
Mango-bearing constructs need **1% formaldehyde gels**, because the aptamer has to be
denatured before the RNA migrates at its true size.

**Limitation, stated with the result.** Two of those four stocks (300 bp, and
500 bp without Mango) have 260/280 and 260/230 ratios far outside spec
(4.69/4.93 and 4.97/3.08) against 2.3–2.7 for the other two. We report all four
and flag those two rather than presenting the set as uniformly clean.

## Build errors worth showing

Four documented build failures, each with a diagnosis and a fix, are tabulated at
cycle 2.1. Two are worth naming here because they are the ones another team is
most likely to repeat:

- **T7 on both strands gave 0 ng/µL.** A labelling error put the T7 promoter on
  both primers for the 300 and 500 bp constructs. Two opposing promoters clash and
  the reaction yields nothing. Rebuilt as T7-forward-only and T7-reverse-only,
  both of which became the workhorse templates.
- **GGG, not G.** The 300 and 500 bp T7 reverse primers were non-functional
  because the kit requires the promoter to be followed by **GGG, not a single G**
  (5 Aug). Reordering them propagated a second, quieter error: the replacements
  predate the random-up/down adaptor system, so iteration .18 lacks a random-down
  adaptor, is 25 bp shorter than .17, and carries a single-stranded overhang.

Between them these two errors **cost roughly three weeks**. The fix is procedural
rather than clever, and we publish it as a
[Contribution](/contribution): a primer-design checklist that verifies promoter
orientation, the kit's +1 GGG requirement, and adaptor parity across a construct
series, before any oligo is ordered.

## Quality control, and what it cannot tell us

What we check: gel band size after assembly and after transcription, annealing
behaviour on a gel (ssRNA runs streaky, correctly annealed dsRNA runs as a thick
discrete band, a band at twice the expected mass means dimerisation), NanoDrop
ratios, and duplex-specific mass by nuclease digest followed by Qubit. That last
step replaced NanoDrop as the number we dose from, because the two instruments
**disagreed by up to 18-fold**. See [measurement](/measurement).

> **TODO —** **No construct has been sequence-verified.** All QC to date is gel
> band size plus NanoDrop ratios: no Sanger, no whole-plasmid sequencing, no
> miniprep is recorded. No sequence-level claim appears anywhere on this wiki, and
> Sanger across both Gibson junctions is in the protocol before any Registry
> submission. Owner: wet lab.

## Troubleshooting worth reusing

**The contamination saga, 29 July to 11 August.** Our qPCR water controls
produced clean 100 bp bands. Primer-dimer and contaminating template predict the
same observation, so repeating the run could not separate them. Primers 1 and 4
flank a 200 bp region while pairs 1+2 and 3+4 each give 100 bp, so we ran 1+4:
the **200 bp band** ruled out primer-dimer on 1 August. Five further pairs then
amplified in water with no DNA, which ruled out a single bad pair and put the
Tris under suspicion. A **2×2×2 factorial** on 11 August (Phanta/Q5 × old/new
water × old/new primers) left only Phanta with new primers and new water clean.
Primers were reordered and the water replaced. All pre-11 August qPCR data
carries the contamination caveat. The full decision tree is at cycle 3.3b and is
published as a [Contribution](/contribution).

The other diagnoses that cost real time (a smeared step-2 Gibson PCR traced to
ethanol carryover and to the wrong band having been excised, and an unmixed
primer stock) are recorded in the same place.

## Still missing

- The construct architecture figure.
- Sequence verification for every construct.
- Yeast-produced dsRNA of any kind. See [yeast](/wet-lab-experiments#yeast-production).
- IVT yields for the loop-ended constructs reported side by side with the
  dual-promoter designs.
- Any test of the multigene loop-ended constructs. They were produced; nothing was
  read out of them.
- The pollen patty formulation, and dsRNA stability in it against stability in
  sucrose.

> **TODO —** Dual-promoter against loop-ended IVT yield. The comparison was run
> but the paired numbers are not yet written up. Owner: wet lab.

## Where this connects

[Experiments and lab book](/wet-lab-experiments) · [Yeast](/wet-lab-experiments#yeast-production) ·
[Parts](/parts) · [Measurement](/measurement) · [Results](/results) ·
[Engineering](/engineering) · [RNA design](/software)
