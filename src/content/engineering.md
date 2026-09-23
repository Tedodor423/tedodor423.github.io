NECTAR is built from sixteen wet-lab engineering cycles in four workstreams, plus
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

| #                     | Question                                                 | Status       | Where it went                                        |
| --------------------- | -------------------------------------------------------- | ------------ | ---------------------------------------------------- |
| [1.1](#cycle-1-1)     | What shape should the dsRNA be?                          | Modelled     | Loop ends chosen; the molecule became unbuyable      |
| [1.2](#cycle-1-2)     | How do you build a construct nobody will synthesise?     | Investigated | Modular L0/L1/L2 collection, two-step Gibson         |
| [1.3](#cycle-1-3)     | Can we transcribe it reliably?                           | Demonstrated | Four build failures, four fixes, a primer checklist  |
| [1.4](#cycle-1-4)     | How much dsRNA do we actually have?                      | Demonstrated | NanoDrop abandoned; digest-Qubit became the dose     |
| [2.1](#cycle-2-1)     | Which production and delivery chassis?                   | Investigated | Live symbiont dropped; yeast adopted                 |
| [2.2](#cycle-2-2)     | How do you express a loop-ended dsRNA in yeast?          | Proposed     | Cassette designed; no yeast transformed              |
| [2.3](#cycle-2-3)     | Should _E. coli_ be the production host?                 | Investigated | Deprioritised; kept as a cloning host                |
| [3.1](#cycle-3-1)     | How do we get RNA out of bee material?                   | Demonstrated | A clean null; column beat TRIzol on variance         |
| [3.2](#cycle-3-2)     | Can we detect ingested dsRNA at all?                     | Demonstrated | Yes, qualitatively, at 24 h in larval haemolymph     |
| [3.3](#cycle-3-3)     | Can we quantify it by RT-qPCR?                           | Investigated | Method built; MIQE standard curve outstanding        |
| [3.3b](#cycle-3-3b)   | Is the band in our water control dimer or contamination? | Demonstrated | Contamination; a diagnostic worth publishing         |
| [3.4](#cycle-3-4)     | Can the dsRNA report its own concentration?              | Investigated | No. Mango demoted from quantifier to selector        |
| [3.5](#cycle-3-5)     | Would an ordinary stain do better?                       | Proposed     | SYBR Gold, 25–250× more sensitive, not yet run       |
| [3.6](#cycle-3-6)     | Could a toehold switch read the dsRNA?                   | Modelled     | Rejected on four independent grounds                 |
| [4.1](#cycle-4-1)     | Can we put a protein-binding site in the loop?           | Modelled     | Identical hairpins do not fold; stems synonymised    |
| [4.2](#cycle-4-2)     | Can we make and quantify the adaptor protein?            | Proposed     | Active sites, not mass, defined as the measurement   |
| [4.3](#cycle-4-3)     | Can we target the dsRNA to the mite?                     | Proposed     | Demonstration moved from the bee to the feeder       |
| [B1](#cycle-b1)       | Can we deliver a known dose to a bee?                    | Demonstrated | Newly-emerged bees and PCR-tube feeders standardised |
| [B3](#cycle-b3)       | Does it kill the mite?                                   | Investigated | Husbandry DBTL-1 closed negative                     |
| [D1](#cycle-d1)       | Which sequence silences the mite?                        | Modelled     | NectarDesigner; concatenation tested and set aside   |
| [M1–M3](#cycle-m1-m3) | What treatment efficacy is worth reaching?               | Modelled     | Sets the titre the wet lab has to hit                |

## Workstream 1: Making the molecule

Can we produce a defined, measurable quantity of a structurally non-trivial dsRNA?

### 1.1 · What shape should the dsRNA be?

**Status: Modelled, now in production use.**

**Question.** Conventional dsRNA is destroyed in a hive feeder within hours. What
molecular architecture survives long enough to reach the mite?

**Design.** The failure that defines this project is persistence, not potency.
Muita et al. 2026 measured it in our exact system: conventional dsRNA fell to ~25%
of starting intensity within 3 h in 50% sucrose and was undetectable by 6 h, while
loop-ended dsRNA (ledRNA) retained ~40–70% at day 2 and produced significant mite
mortality where conventional dsRNA produced none `[LIT]`. Terminal loops remove the
free ends that exonucleases require. siRNA was excluded outright, because dietary
RNAi in insects needs dsRNA above ~60 bp `[LIT]`.

**Build.** The Muita geometry: a ~500 bp duplex stem flanked by two ~150 nt
single-stranded loops, transcribed as one RNA from a single T7 promoter. We also
designed a variant, led[Δ23], carrying a single-nucleotide deletion every 23 nt in
the sense strand, giving 670 nt of sense against 700 nt of antisense `[CALC]`.

**Test.** Folding assessed _in silico_ before synthesis (ViennaRNA 2.7.2, Turner
2004, 37 °C, partition function), then by IVT yield and annealing behaviour at the
bench in 1.3.

**Result.** The 709 bp duplex arm is predicted paired at p = 0.998–0.999 under every
perturbation we modelled `[CALC]`. The bench comparison of ledRNA against
conventional duplex belongs to the bee lab, not here.

**What we learnt.** Architecture, not sequence, is the dominant lever on dsRNA
persistence in a hive, and it is a variable we control at the DNA level for no
marginal cost. It also bounds our novelty claim: ledRNA against _Varroa_ is
published. Putting a functional cargo inside one of the loops is not.

**What it changed.** An inverted-repeat, loop-ended molecule cannot be bought. That
forced 1.2.

> **Δ22 against Δ23, stated plainly.** Muita's published, _Varroa_-validated
> construct is led[Δ22], one deletion every 22 nt. Ours is Δ23, on the reasoning
> that led[Δ22]-_Pero_ siRNAs peaked in the 23–24 nt size class, so a 23 nt register
> may sit better on the Dicer product distribution `[LIT]`. **Δ23 is untested. We
> present it as a rationale, not a result** `[FLAG]`.

### 1.2 · How do you build a construct nobody will synthesise?

**Status: Investigated. Assembly works; no construct is sequence-verified.**

**Question.** Every iGEM synthesis sponsor refused our loop-ended constructs as too
complex. How do we build inverted-repeat templates from parts we can order?

**Design.** Inverted repeats are the specific thing that breaks commercial gene
synthesis and recombines out in standard cloning strains. Rather than re-solve that
per construct, we designed a modular collection so any future loop cargo drops into
a fixed backbone: **L0** a plain loop-ended dumbbell with no cargo (the control, and
the comparator that makes L1 an Improved Part), **L1** a Mango reporter loop, **L2**
an MS2 adaptor loop. Loop spacers are constrained to exclude BsaI, BsmBI and BbsI
sites, homopolymer runs longer than 3, and yeast poly(A) elements. Detail on
[parts](/parts).

**Build.** Three gBlock fragments assembled by two-step Gibson: two fragments first,
verified, then the third. A three-part one-pot that fails tells you nothing about
which junction broke; a two-step tells you exactly.

**Test.** Gel size of the step-1 product, then PCR across the assembly with
universal T7-U1 / U2-rev primers, then gel extraction and re-amplification.

**Result.** Step 1 gave the expected ~500 bp product (5 Sep). Step 2 PCR gave a
smear (7 Sep), diagnosed as incomplete Gibson leaving ~180 bp U1/U2 fragments that
amplify faster than the full product. Three rounds of troubleshooting followed:
residual ethanol removed from the gel extract by dry-spinning with lids open; Q5
with GC enhancer at 1× and template at 5 ng/µL; a 57–63 °C annealing gradient. By
10 Sep, W5 gave a clean band at 60 °C and W3 gave no band at any temperature, which
told us the wrong band had been excised from the earlier gel.

**What we learnt.** The lesson is about gel extraction, not Gibson. An impure
extract poisons downstream PCR, and a temperature gradient distinguishes "the
product is absent" from "the product is outcompeted". A single failed PCR cannot
tell those apart.

**Limitation, stated plainly.** **No construct has been sequence-verified.** All QC
to date is gel band size plus NanoDrop ratios. No Sanger, no whole-plasmid
sequencing, no miniprep is recorded. We do not claim sequence-verified constructs.

**What it changed.** A full re-run was adopted (Gibson → PCR → gel extract → PCR →
gel extract → IVT-ready, loading the entire sample at each extraction), and Sanger
sequencing across both junctions was added to the protocol before any Registry
submission.

### 1.3 · Can we transcribe it reliably?

**Status: Demonstrated.**

**Question.** Can we produce enough correctly-annealed dsRNA, reproducibly, to dose
bees and larvae?

**Design.** ledRNA is a single transcript from a single T7 promoter: the loops mean
the molecule self-anneals intramolecularly, so no second promoter and no
heat-denaturation step are needed `[LIT]`. That is not the standard route, and the
literature now says why it is the right one for us: for _in vitro_ transcription,
divergent single-direction promoters outperform convergent dual-opposing promoters
by up to 6.46-fold, while convergent wins _in vivo_ above 400 bp `[LIT]`.

**Build.** Templates by colony-lysis PCR with adaptor-bearing primers, purified and
transcribed with T7 polymerase. A GFP length series (300, 500 and 700 bp, each ±
Mango) was built in parallel as the measurement and feeding-assay substrate.

**Test.** IVT yield by NanoDrop and Qubit. Annealing by gel: ssRNA runs streaky,
correctly annealed dsRNA runs as a thick discrete band, and a band at twice the
expected mass means dimerisation. Mango-bearing constructs need 1% formaldehyde
gels to denature the aptamer so the RNA migrates at true size.

**Result: four documented build failures, each with a diagnosis and a fix.** These
are the cycle.

| #   | Failure                                                                 | Diagnosis                                                                                 | Fix                                                                                                                                                                                         |
| --- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E1  | Iterations .1 and .9 gave **0 ng/µL** for the 300 and 500 bp constructs | T7 promoter placed on **both** primers through a labelling error; the two promoters clash | Rebuilt as T7-forward-only (.11) and T7-reverse-only (.10). Both worked and became the workhorse templates                                                                                  |
| E2  | 300 and 500 bp T7 reverse primers non-functional                        | The kit requires the T7 promoter to be followed by **GGG, not a single G**                | Reordered. Knock-on: replacements predate the random-up/down adaptor system, so iteration .18 lacks a random-down adaptor, is 25 bp shorter than .17 and carries a single-stranded overhang |
| E3  | Iterations .2 and .3 failed, gels failed                                | Full-Mango forward primer stock had not been mixed sufficiently                           | Re-vortexed; .4 then worked cleanly                                                                                                                                                         |
| E4  | dsRNA did not anneal (20 Jul)                                           | **No salt in the annealing reaction**, the phosphate backbones repel                      | EDTA / NaCl / Tris pH 7.5 salt mix, 20× stock added at (predicted conc ÷ 20 × 1.1)                                                                                                          |

Two process optimisations came out of the same period: **2 h IVT is insufficient and
overnight incubation roughly doubles yield**, and magnetic-bead purification gives
2,500–3,500 ng/µL per strand. The 6 Sep annealing run produced four stocks at
589–623 ng/µL, stored at −80 °C.

**What we learnt.** Promoter topology is the highest-consequence design decision in
dsRNA IVT and the easiest to get wrong on paper. E1 and E2 are both promoter errors
and between them cost roughly three weeks. The fix is procedural: a primer-design
checklist that verifies promoter orientation, the kit's +1 GGG requirement, and
adaptor parity across a construct series, before any oligo is ordered. We publish it
as a [Contribution](/contribution).

**Limitation.** Two of the four 6 Sep stocks (300 bp, and 500 without Mango) have
260/280 and 260/230 ratios far outside spec (4.69/4.93 and 4.97/3.08) against
2.3–2.7 for the other two. We report all four and flag those two. We do not present
the set as uniformly clean.

**What it changed.** Yields were adequate, but two instruments disagreed about what
"adequate" meant by up to 18-fold. That is 1.4.

### 1.4 · How much dsRNA do we actually have?

**Status: Demonstrated. This is the measurement headline.**

**Question.** NanoDrop and Qubit disagree about our dsRNA concentration by up to
18×. Which is right, and what should we report as a dose?

**Design.** Every dose claim, knockdown figure and economic projection in this
project is downstream of one number: µg of intact duplex. Absorbance at 260 nm
counts anything that absorbs at 260 nm, including the free NTPs left over from
transcription, and cannot distinguish them `[LIT]`. A second error compounds it: the
correct A260 conversion factor for dsRNA is 45.9–46.5 µg/mL per A260 unit, not the
40 that every kit manual quotes `[LIT]`. We were over-reading for one reason and
under-converting for another.

**Build.** A nuclease-digestion protocol that turns A260 into a duplex-specific
number. DNase I removes template DNA, RNase T1 removes single-stranded RNA at G
residues, and what survives is duplex. RNase T1 was chosen over RNase A
deliberately: T1 is single-strand-specific at normal ionic strength, whereas RNase A
only becomes so above ~300 mM salt, and residual RNase A carried into a low-salt gel
becomes dsRNA-active. Reagents came from the kit already in use, so this adds no
cost.

**Test.** Eight independent preparations, three constructs, five dates. NanoDrop and
Qubit read before digestion and after. Controls: a water-plus-nuclease blank, and a
DNase + RNase A low-salt arm that should go to near zero.

**Result.** **Digestion removes 48% of the A260 signal every single time: N₁/N₀ =
52.1% ± 4.2%** across 8 independent preparations, 3 constructs and 5 dates `[CALC]`.
The low scatter across independent preparations is itself the repeatability
evidence. The full eight-row table is on [measurement](/measurement).

**What we learnt.** Do not publish a correction factor. The NanoDrop-to-Qubit ratio
runs from 3.3× to 18.2× across our preparations, because it depends on how much
unincorporated NTP a given reaction left behind. Publish the method (digest, clean
up, re-quantify) and the duplex fraction. That transfers; a factor does not.

**Two negatives we publish rather than bury.** The fitted power law
`Q₁ = 0.6 × N₀^0.696` is an instrument artefact, not chemistry: "too high" appears at
exactly N₀ > 1000, the Qubit RNA BR ceiling, and the lowest post-digest value is
exactly 20.0, the BR floor. A saturating top and a compressed bottom reproduce a
sublinear fit from nothing, and it must not be used as a correction curve. And a
hole in our own headline number: RNase T1 cuts ssRNA to mononucleotides that still
absorb at 260 nm but are invisible to Qubit, so an N₁ read without post-digest
cleanup is partly counting the debris of what we just destroyed.

> **TODO: post-cleanup re-measurement.** Repeat the 8-preparation panel with SPRI
> cleanup and a fixed 30 µL elution between digest and read. Pre-registered rule: if
> N₁/N₀ falls within 52.1 ± 4.2%, the uncorrected figure stands and we say so; if it
> falls below ~45%, we report the cleanup-corrected value as primary and show the
> uncorrected value alongside as the artefact it is. Owner: wet lab. Half a day, and
> it moves 52.1% from attackable to solid.

**What it changed.** Every µg-per-bee figure in this project is re-derived from
digest-Qubit, not NanoDrop. It also gave us the orthogonal-method discipline that
runs through the whole of Workstream 3.

## Workstream 2: Where the dsRNA is made

Which chassis both produces the dsRNA and delivers it?

### 2.1 · Which production and delivery chassis?

**Status: Investigated. Comparative, decision made.**

**Question.** dsRNA has to be manufactured cheaply _and_ arrive inside a mite. Which
chassis does both?

**Design.** We evaluated four routes against four criteria: does the molecule
survive production intact, can it be made at agricultural scale, does it reach the
mite, and is it deployable under EU and UK regulation?

| Route                                             | Why considered                                                                                                                                                         | Outcome                                                                                                                                                                                                                                                                                |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sucrose solution**, naked dsRNA                 | The published standard                                                                                                                                                 | **Rejected as the product, retained as the assay.** Conventional dsRNA is ~75% degraded in 50% sucrose by 3 h `[LIT]`. No protection, no shelf life, and the dsRNA is the most expensive component                                                                                     |
| **_Snodgrassella alvi_**, engineered gut symbiont | The strongest published _Varroa_ result: engineered _S. alvi_ made bees 36.5% more likely to survive DWV challenge and mites ~70% more likely to die by day 10 `[LIT]` | **Rejected.** A living GMO in a hive faces prohibitive EU and UK regulatory barriers, and the toolkit is thin: apart from transposon mutagenesis the group that built it reports no genetic tools, and culture needs Columbia agar with 5% sheep's blood at 35 °C under 5% CO₂ `[LIT]` |
| **_E. coli_ HT115**                               | The default dsRNA factory since Timmons and Fire `[LIT]`                                                                                                               | **Rejected for our molecule.** Full-length hairpin RNA is degraded in HT115, and RNase III deficiency is not sufficient to prevent processing `[LIT]`. Cheap and scalable, and it destroys the architecture 1.1 exists to create                                                       |
| **_S. cerevisiae_**                               | The cell is both factory and carrier: heat-inactivated, dried and formulated into a feed supplement with no RNA extraction step                                        | **Adopted**                                                                                                                                                                                                                                                                            |

The mechanistic argument for yeast is the one worth repeating: full-length hairpin
RNA accumulates predominantly **intact** in _S. cerevisiae_ (~2 ng per µg total
yeast RNA), is degraded in _E. coli_ HT115, and is processed in _N. benthamiana_
`[LIT]`. Yeast lacks Dicer, so nothing in the cell recognises and cleaves the loop.
**The chassis is chosen for the absence of a machine, not the presence of one.** Two
supports follow: heat-inactivated engineered yeast retains full larvicidal activity
(85–88% against 95–97% live, no significant difference) `[LIT]`, and inactivated
_S. cerevisiae_ cell walls are already an approved EU crop-protection active
substance `[LIT]`.

**Build.** Consultation, not construction. We approached Prof. Nancy Moran and
Prof. Sean Leonard, whose group published the _S. alvi_ work, on the regulatory
feasibility of a live GMO therapeutic and on routes to improve _S. alvi_ dsRNA
yield. We separately analysed _S. alvi_ transcriptomic data for high-expression
promoters and built an _S. alvi_-compatible loop-ended construct before deciding to
deprioritise it.

**Test.** The criterion was set before the consultation: would a route plausibly
reach a deployable product, and could we make meaningful progress on it inside a
three-month iGEM wet-lab window?

**Result.** Both experts confirmed that regulatory restrictions on a live GMO in the
environment currently preclude adoption in the US and Europe. With slow doubling
times, demanding culture conditions and a limited engineering toolkit, _S. alvi_
failed both halves of the criterion.

**What we learnt.** The regulatory constraint is a design input, not paperwork. It
is what selects the chassis. An inactivated, non-replicating yeast is not merely
more acceptable than a live symbiont: it is the only one of the four routes with an
existing approved-substance precedent to point at.

**Limitation, and an honest framing point.** Engineered inactivated yeast as an oral
dsRNA delivery vehicle is **not novel**. It is anticipated by US 11,252,965 B2
(priority 2016, in force to 2037) and adjacent to US 9,540,642 B2. We do not
describe the yeast chassis as novel anywhere on this wiki. Our novel core is the RNA
design method and the instrumented loop.

**What it changed.** Chassis fixed as _S. cerevisiae_, which created a
cassette-design problem with no obvious answer, because yeast will not transcribe
what we need the way bacteria do. This is also the one decision on this page that
[human practices](/human-practices) tells from the other end: the same pivot,
driven by regulatory and stakeholder evidence, against the stated preference of two
of the beekeepers we spoke to.

### 2.2 · How do you express a loop-ended dsRNA in yeast?

**Status: Proposed. Designed, not built.**

**Question.** How do you get a long, structured, defined-ended RNA out of a
_S. cerevisiae_ promoter?

**Design.** Four sub-decisions, each with a reason. Detail on [yeast](/yeast).

- **Pol II, not Pol III**, ruled out with a mechanism. Yeast Pol III terminates on
  runs of thymidine, with T₅ the shortest functional signal `[LIT]`. An inverted
  repeat turns every A-run in the sense strand into a T-run in the antisense, so a
  Pol III transcript of our construct would terminate internally, repeatedly, by
  construction. Length is the second problem: the largest well-characterised yeast
  Pol III transcript is ~519 nt `[LIT]`, against a ~1,300 nt target.
- **Ribozyme-flanked**, to get defined ends. A Pol II transcript arrives capped and
  polyadenylated, which our molecule must not be; a 5′ hammerhead and a 3′ HDV
  ribozyme let it self-cleave to defined ends _in vivo_ `[LIT]`. Caveat we state
  openly: two published yeast RNAi-pesticide papers used bare Pol II with no
  ribozymes and worked. This is a testable design question, not a settled one.
- **Copy number: test both.** The _leu2-d_ allele forces very high plasmid copy
  number under leucine starvation `[LIT]`; δ (Ty LTR) integration gives 3–5 copies
  that are mitotically stable over 50 generations without selection `[LIT]`. For a
  product where every cell in a 100 m³ fermenter must still carry the cassette after
  ~25 generations, stability may beat copy number.
- **Auxotrophic selection, not antibiotic.** EFSA's position on antibiotic-resistance
  markers gives the regulatory reason to design them out `[LIT]`; auxotrophy is not
  free either, since the markers themselves perturb growth `[LIT]`; δ-integration is
  the route out of both. We chose a leucine dropout because leu⁻ plates are the
  cheapest defined medium available to us.

**Build.** Designed cassette: `[Pol II promoter] → HH ribozyme → ledRNA → HDV
ribozyme → terminator`, with GAL1 inducible and TDH3/TEF1 constitutive variants. The
MCP adaptor protein of 4.2 is purified separately from _E. coli_ and added _in
vitro_, not co-expressed. As of 20 Sep the yeast plasmid has been linearised and
DpnI-treated; purification is outstanding.

**Test and result.** **No yeast has been transformed. No yeast-produced dsRNA
exists. No yeast titre has been measured.** This arm is Proposed, and the
[yeast](/yeast) page says so at the top.

> **TODO: µg intact dsRNA per mg dry yeast.** The single measurement this project
> most needs, and it is unmeasured. Every economic and application claim depends on
> it. Protocol, built as spike-recovery: known mass of IVT dsRNA into yeast lysate →
> full extraction → digest-Qubit (1.4) → loss factor, then the same extraction on
> transformed yeast. Pre-registered rule: if titre reaches the threshold derived
> from the scale-up model, the whole-cell formulation stands and we report the
> number; if it falls short we report it as the constraint it is. Owner: wet lab.
> Blocked on transformation.

**What it changed.** Because no yeast material exists, all dsRNA for bee-lab
validation is IVT-derived, which makes 1.4's quantification the load-bearing
measurement for the entire project.

### 2.3 · Should _E. coli_ be the production host?

**Status: Investigated from the literature, then deprioritised.**

**Question.** Should _E. coli_ be our production host, given that it is the field
default?

**Design.** _E. coli_ HT115(DE3) is the standard dsRNA factory: the RNase III-null
strain gives full interference in >98% of _C. elegans_ progeny against <15% for
RNase III-competent BL21(DE3) `[LIT]`. The economics are good, at 53.3 µg/mL and
~US$4.29/mg `[LIT]`. `[CALC]` At that titre a 1 L shake flask yields ~53 mg dsRNA,
and Muita dosed at ~1 µg per bee, so one preparation covers a full dose-response
plus survival series. **Cost is not the constraint.**

**Build.** _E. coli_ was used throughout as a cloning host, not a production host.
Two transformations of Gibson product were performed (3 Sep, 7 Sep) under kanamycin
selection.

**Test and result.** No colony counts or colony-PCR outcomes were logged for either
transformation, and strains and plasmids are unnamed in the record. **We do not
claim an _E. coli_ dsRNA production result.**

**What we learnt.** The decisive argument against _E. coli_ as our production host is
not yield and not cost, it is molecular: full-length hairpin RNA is degraded in
HT115, and RNase III deficiency is not sufficient to prevent it `[LIT]`. That
tension is the cycle. The best-established bacterial chassis is disqualified by the
specific molecule we chose in 1.1.

**What it changed.** Confirmed the 2.1 decision from a second, independent
direction, and reframed _E. coli_ in our workflow as a cloning and protein-expression
host only. It returns in 4.2 for MCP purification.

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

### 3.1 · How do we get RNA out of bee material at all?

**Status: Demonstrated, including a useful null.**

**Question.** Which extraction method recovers dsRNA from larvae and larval
haemolymph with the least loss and the least variance?

**Design.** The working principle was as little processing as possible: the dsRNA
mass we are chasing is small and every step loses some. We compared five methods
against each other rather than adopting a default.

**Build.** Five extraction methods on 5th-instar larvae fed 1 µg dsRNA: liquid
nitrogen grinding, standard protocol, DTT addition, extended 40 min Vezol
incubation, and spin-down after Vezol addition.

**Test.** Yield and purity by NanoDrop across all five, same larvae, same day
(29 Jul).

**Result: a clean null.** **All five methods gave comparable yields.** No method was
better. All five also gave very low 260/230 ratios, traced to residual ethanol and
fixed by using 1× volume ethanol instead of 0.5×, a dry spin after the ethanol has
passed the column, and leaving the lid open until the ethanol has evaporated. A
second, quantitative comparison gave the decision that mattered: **silica column CV
18.5% (n = 7) against TRIzol/Vezol CV 27.4% (n = 8)**, with TRIzol A260/230 at
0.51–0.88, which is real guanidine and phenol carryover and a qPCR inhibition risk.

**What we learnt.** Column beats TRIzol on variance, not on yield, and TRIzol's
variance is structural: five operator-dependent steps stack multiplicatively, and
the manual specifies the aqueous-phase transfer only as "angling the tube at 45°",
with no defined volume. Two people differ by more than 20%. The five-method null
saves a future team a week, so we publish it.

**Limitation.** The comparison was on total RNA yield by NanoDrop, not on
dsRNA-specific recovery. A method could give identical total RNA and different
duplex recovery. Spike-recovery is the missing control.

**What it changed.** Column extraction standardised. The sample-prep question then
moved to the matrix itself, which turned out to be the real problem.

### 3.2 · Can we detect ingested dsRNA in bee material at all?

**Status: Demonstrated, qualitatively.**

**Question.** After a bee or larva eats our dsRNA, can we recover it intact?

**Design.** Before a quantitative method is worth building, the qualitative question
has to answer yes. We used RT-PCR with construct-specific reverse primers across the
300/500/700 bp length series, because a length series answers a second question for
free: is uptake length-dependent? That matters, and the literature disagrees with
itself. SID-1's extracellular domain binds dsRNA in a length-dependent manner
`[LIT]`, yet equivalent masses of long and short dsRNA accumulate equally in
SID-1-expressing cells `[LIT]`. **Two good papers disagree, and we say so.**

**Build.** 5th-instar larvae fed 1 µg dsRNA, with haemolymph and whole larvae
collected at 24 h; adult bees dosed with haemolymph collected at 3 h. RNA extracted
by column, flash-denatured (95 °C for 3.5 min, then ice, skipping this is the main
cause of false negatives on duplex RNA), reverse-transcribed and amplified.

**Test.** Gel electrophoresis with a full control set on the same gel: dosed larvae,
undosed larvae from the same frame, and water-plus-primer no-template controls.

**Result.** On 4 Aug, whole larvae gave bands at 300, 500 and 700 bp in both
samples. On 5 Aug, **intact bands were recovered from larval haemolymph 24 h after a
1 µg dose**, with undosed and water controls on the same gel. This is the strongest
single wet-lab result the project has. On 12 Aug an adult haemolymph sample gave a
~700 bp band at 3 h, reported with the contamination caveat of 3.3b attached.

**What we learnt.** Ingested dsRNA crosses into larval haemolymph and survives at
least 24 h at all three lengths. We present this as a qualitative result with a
stated limitation, and we do not stretch it toward a quantitative claim the standard
curve cannot yet support.

**Limitation.** RT-PCR endpoint gels are presence or absence. Band intensity is not
concentration.

**What it changed.** Qualitative detection worked. Every remaining cycle in this
workstream is an attempt to put a number on it.

### 3.3 · Can we quantify it by RT-qPCR?

**Status: Investigated. Method development; MIQE standard curve outstanding.**

**Question.** Can RT-qPCR give a defensible concentration of dsRNA in bee
haemolymph?

**Design.** RT-qPCR is the orthogonal method every other assay here is benchmarked
against, so it has to meet MIQE minimums: slope, y-intercept, efficiency, R²,
melt-curve specificity, no-template Cq and no-RT Cq `[LIT]`. Two constraints are
specific to dsRNA work. **Primers must sit outside the dsRNA fragment**, because
residual input dsRNA carries into the RNA prep and, in a dose-response, carryover
scales with dose, producing an artefact that looks like the exact opposite of
knockdown `[LIT]`. And **denaturation is mandatory, but our construct breaks the
usual fix**: in a conventional duplex, heat-then-dilute works because two separate
strands must find each other again, whereas in a dumbbell the arms are covalently
tethered, so re-annealing is intramolecular and first-order and dilution cannot help
`[FLAG, inference from topology, not measured]`.

**Build.** Primer pairs tiling 100 bp windows across the GFP constructs. For the
_Varroa_ target, published primers for the target gene and its reference genes, with
SDHA as primary reference and NADH as a second. Actin was avoided, and 18S used only
as a secondary, because 18S sits at Ct 8–12 against a target Ct of 25–30.

**Test.** Serial dilution standard curves (200 ng to 0.02 ng in 1:10 steps, plus a
low-range series), triplicates throughout, melt curve on every run.

**Result: partial, and honestly qualified.** A standard curve was generated on
30 Jul, and needed a diagnostic of its own: the 20–200 ng/µL points appeared to
fail, but their Ct was so low that the baseline had been set below the trend, and
resetting the baseline to 1 Ct recovered the curve. A temperature gradient across
all primer pairs found a different optimum for each and non-specific product for
most; only one pair had a clean usable Tm, so only that pair went forward. **No
valid efficiency, slope, R², LOD or dynamic range has yet been recorded to MIQE
standard.** The only written internal acceptance rule was R ≥ 0.9, which is below
MIQE practice.

> **TODO: MIQE standard curve.** 10-fold series, ≥6 points, triplicate, on a PCR
> product or plasmid standard, which needs no RT step. Report E, R², slope and
> y-intercept; uninhibited slope is −3.32 and the acceptance window is 90–110%
> efficiency. Pre-registered rule: if efficiency lands in window with a single melt
> peak, RT-qPCR becomes the quantitative backbone and every other assay is reported
> against it; if not, we report RT-qPCR as inhibited by the haemolymph matrix,
> quantify the inhibition, and fall back to gel densitometry against a matrix-matched
> spike ladder. Owner: wet lab.

> **TODO: spike-recovery.** An unrelated dsRNA added at the moment of lysis, three
> mass levels, acceptance 80–120%. This has never been run and is the largest
> remaining hole in the workstream. Owner: wet lab.

**What we learnt.** Also worth a line: GFP dsRNA is our extraction spike, but it is a
**post-mortem** spike only. Fed GFP dsRNA alters around 1,400 bee genes
`[FLAG, source DOI unverified]`, so it is not an inert control in a live bee. It
remains the correct control in mite work.

**What it changed.** Forced the contamination diagnostic below, and made
spike-recovery a standing requirement.

### 3.3b · Is the band in our water control dimer or contamination?

**Status: Demonstrated. The one to read if you read only one.**

**Question.** Our water negative controls produce a perfect 100 bp band. Is this
primer-dimer, or is it template contamination?

**Design.** The two hypotheses predict the same observation, a 100 bp band, so no
amount of repeating the original experiment distinguishes them. **We designed an
experiment where they predict different observations.** Primer pairs 1+2 and 3+4 each
give a 100 bp product, but primers 1 and 4 flank a 200 bp region. If the band is
primer-dimer, 1+4 gives 100 bp. If it is contaminating template, 1+4 gives 200 bp.

**Build and test.** A PCR with primers 1 and 4 from the working stocks, alongside
the original pairs, then four further rounds each eliminating one hypothesis.

**Result.**

| Date   | Experiment                                                                                        | Result                                          | Eliminated                                    |
| ------ | ------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------- |
| 31 Jul | Water NTC gives a 100 bp band for pairs 1+2 and 3+4                                               | the observation                                 | ,                                             |
| 1 Aug  | **The discriminating experiment: primers 1 + 4**                                                  | **200 bp band**                                 | Primer-dimer                                  |
| 3 Aug  | Extended to five more pairs, all in water with no DNA                                             | All gave bands                                  | A single bad pair. Source suspected: the Tris |
| 10 Aug | Four arms: DNase I + phenol-chloroform / no DNase + phenol-chloroform / untreated extract / water | Amplification in all four                       | Anything but extract-borne contamination      |
| 10 Aug | Swapped the loading dye, re-ran                                                                   | Still amplification                             | Loading dye                                   |
| 11 Aug | **2×2×2 factorial: Phanta/Q5 × old/new water × old/new primers**                                  | Only Phanta + new primers + new water was clean | Everything else                               |

**What we learnt.** When two hypotheses predict the same observation, the only useful
next experiment is the one where they predict different observations. And when
several inputs are simultaneously suspect, a factorial design resolves in one plate
what serial substitution takes a fortnight to do. Primers were reordered, water
replaced, Phanta adopted over Q5 for these reactions, and Tris identified as the
probable original source.

**What it changed.** All pre-11-Aug qPCR data is reported with the contamination
caveat attached, including the 12 Aug adult haemolymph band. We publish the decision
tree as a [Contribution](/contribution): a contamination diagnostic any team can
run.

> **An honest note we keep on the page.** Contamination of negative controls is close
> to inevitable in high-cycle qPCR. Our standing rule is that if the negative-control
> Ct differs from the sample by more than 4–5 cycles (5 Ct is about 32-fold in
> template) it can be disregarded; below that, the run is discarded.

### 3.4 · Can the dsRNA report its own concentration?

**Status: Investigated. Corrective, negative, and one of the strongest results on
this wiki.**

**Question.** Can we build a dsRNA that reports its own concentration and integrity
in crude haemolymph, with no purification, no labelled nucleotide and no blot?

**Design.** Every existing method for seeing dsRNA in bee material needs either a
blot or a chemically-labelled nucleotide. We wanted a tag that is genetically encoded
in the plasmid, one copy, at a defined position, at no marginal cost, so the same
construct works for IVT now and for in-yeast expression later. RNA Mango is a
fluorogenic aptamer that binds TO1-Biotin with Kd 3.2 ± 0.7 nM and gives a
~1,100-fold fluorescence turn-on `[LIT]`.

**Build.** Mango inserted into one terminal loop of the ledRNA construct (the L1
part), with the 300/500/700 bp series ± Mango as substrate. Two readouts developed
in parallel: a 96-well plate assay and an in-gel post-stain.

**Test.** Calibration series in water and in spiked adult haemolymph, triplicates,
water blanks, on a plate reader and two gel imagers.

**Result: run 1 looked excellent, and that is the problem.** A linear fit over the
lowest four points gave **slope 4,952 RFU per ng/µL, R² = 0.9999, CVs 0.8–7.4%, LOD
0.23 ng/µL, LOQ 0.69 ng/µL** `[CALC]`. Run 2, at 125 nM dye with no Tween-20, was
**non-monotonic**, varied 2.6-fold in response within a single run, and degraded
LOD and LOQ roughly sixfold.

**What we learnt: and this is the cycle.** We initially reported run 1 as a
successful Mango calibration. **On re-analysis it was not measuring the aptamer.**
TO1's dissociation constant for duplex RNA is ~1–10 µM, and run 1 was performed at
1 µM TO1-Biotin, where intercalated dye along a 700 bp duplex dominates the signal
`[CALC]`. Intercalation is rigorously linear in dsRNA mass. **R² = 0.9999 is exactly
what a pure-intercalation signal produces, so a perfect calibration line was
evidence against the aptamer working, not for it.**

Two independent confirmations of the same conclusion: our in-gel bands sat at
9–18 fmol against a published in-gel Mango-II detection limit of 62.5 fmol `[LIT]`,
and you cannot see something three to seven times below the detection limit; and a
Mango aptamer base-paired inside a duplex does not fluoresce, with 4 bp of
complementarity suppressing signal 78-fold `[FLAG, source DOI unverified]`.

Three further failure mechanisms are quantified rather than glossed: flavin
autofluorescence sits almost exactly on the detection channel (ex ~440–450, em
~510–550 nm) `[LIT]`; a 700 bp duplex presents 125–250 intercalation sites against
one Mango site `[CALC]`; and adult haemolymph at 12.3–32.4 mg/mL protein `[LIT]`
means 98–536 µg of protein against 0.408 µg of dsRNA in an 8 µL lane, so we had run
an unintentional EMSA with the entire bee proteome as the shift partner. That last
one is **retention, not degradation**: the band stayed at the correct migration
position, and degradation would have given a downward smear.

> **A correction we publish as a correction.** An earlier version of this analysis
> claimed intercalation outshines Mango by 110–140×. That was a saturation
> calculation applied to a sub-saturating regime, and **we retract it.**

**Decision.** **Mango is demoted from quantifier to selector.** As a detector of
mass, an ordinary intercalating stain wins by orders of magnitude and always will:
one fluorophore per 410 kDa against one per 2–4 bp is not a gap you optimise away.
What Mango can still do is answer the questions that need sequence specificity,
tagged against untagged, and selective capture.

> **TODO: the three controls that close this out.** (1) An untagged-dsRNA control at
> the same length, mass, gel and stain, plus a tagged lane with 100× excess untagged.
> If the untagged lane is as bright, the signal is entirely intercalation; if the
> tagged lane is measurably brighter, that difference is the result. This has never
> been run and the whole assay depends on it. (2) The K⁺ to Li⁺ swap: specific Mango
> signal must collapse in 140 mM LiCl and intercalation will not notice. Cost: a
> buffer. (3) Streptavidin capture with a K⁺ wash. Owner: wet lab. Hours, not weeks.

**Novelty claim, narrowed, with the prior art named.** Mango has already been used
for quantification in a crude biological matrix `[LIT]`. Our claim is the
intersection of three things and we state it that way: amplification-free, direct
Mango quantification of dsRNA (not a fused tag) in an insect matrix.

**What it changed.** Mango reassigned from quantifier to selector. Method development
moved to a generic stain (3.5); quantitative numbers moved to RT-qPCR (3.3).

### 3.5 · Would an ordinary stain do better?

**Status: Proposed. Two full protocols written, neither yet run.**

**Question.** If Mango cannot carry the mass measurement, what can, and how sensitive
is the cheapest option?

**Design.** SYBR Gold shows a ~1,000-fold fluorescence enhancement on nucleic-acid
binding at a quantum yield of ~0.7 `[LIT]`. Head to head against our Mango format:

| Stain                          | LOD per band | Cost per 25 mL bath | Sequence-specific |
| ------------------------------ | ------------ | ------------------- | ----------------- |
| Mango-II + TO1-Biotin at 20 nM | ~25.6 ng     | ~$7.50              | In principle      |
| SYBR Gold                      | 0.1–1 ng     | ~£1                 | No                |

**25–250× more sensitive for roughly a seventh of the cost.** `[FLAG]` There is no
published or vendor dsRNA detection limit for SYBR Gold from anyone; the widely
quoted 25 pg is a dsDNA figure. Any dsRNA LOD we put on this wiki has to be our own
measurement, which makes this the highest-value half-day experiment on the list.

**Build.** Two protocols written: a design review and a full bench protocol with an
RNase T1 arm. TBE rather than TAE, because LOD on a gel is peak intensity and not
total mass; 1.5% agarose no more than 5 mm thick; a fresh stain bath per gel; 15 µL
loaded rather than 20, because `[CALC]` the taller starting zone costs 25–33% of
peak height for identical mass; no tracking dye in any quantified lane; and a
pre-stain scan every time, which costs ten minutes and separates matrix
autofluorescence from dye binding.

**Test and result.** Not yet run.

> **TODO: run the SYBR Gold series.** Half-log standards from 30 ng to 0.01 ng
> across 3.5 logs, rebuilt on true post-digest values from 1.4, because our previous
> standards were 1.87× lower than nominal. LOD as mean blank + 3 SD, LOQ as mean
> blank + 10 SD, three blank lanes. Expected outcome, stated before we run it
> `[CALC]`: at an uptake fraction of 10⁻⁴ the band is invisible, at 10⁻³ it is
> marginal with pooling and concentration, at 10⁻² it is visible. **We run it anyway:
> a calibrated upper bound is a publishable result, and the standard curve is what
> turns a blank lane into a number.** Owner: wet lab.

**What we learnt before running it.** Dose is the lever, not the stain. And pooling
only helps if you pool _and_ concentrate: pooling five 8 µL samples and loading 8 µL
gives the mean of five bees and no sensitivity gain at all, so a labelled aliquot is
retained from every individual bee before pooling.

**What it changed.** Method development shifted to SYBR Gold. TO1-Biotin is reserved
for the only two questions that require sequence specificity. The Mango stain washes
out completely in water, so SYBR Gold can counterstain the same gel afterwards,
giving a Mango channel and a total-nucleic-acid channel on identical lanes for about
£1: that is the loading control and the denominator, and we do it every time.

### 3.6 · Could a toehold switch read the dsRNA?

**Status: Modelled and rejected.**

**Question.** Could a synthetic toehold switch detect our dsRNA directly in crude
haemolymph, with no purification and no amplification?

**Design.** Toehold switches are de-novo riboregulators with mean ON/OFF ratios of
406 in the original library `[LIT]`, and paper-based cell-free versions have been
deployed as field diagnostics `[LIT]`. If one worked here it would be rapid, cheap,
extraction-free and genuinely accessible to other teams.

**Build.** A 36 nt handle designed to be simultaneously a legal MS2-array spacer, a
clean toehold trigger and an RNase-H / capture / northern site. Switch geometry to
the standard scaffold, NanoLuc as reporter, PURExpress with a linear gBlock, so no
plasmid, no strain and no cloning. Costed at ~£1,250.

**Test.** ViennaRNA 2.7.2 partition-function modelling across ten candidate
insertion sites and two trigger classes on the full 1,598 nt construct, plus a
literature-based feasibility assessment against four failure modes.

**Result: four walls, any one of which is fatal.**

1. **The trigger cannot be single-stranded inside a perfect duplex.** Invading a
   blunt, fully paired duplex is a zero-toehold branch migration; `[CALC]` at a
   generous 100 nM switch concentration, t½ ≈ **57 days**. `[FLAG]` The rate
   constants are DNA measurements, and no published toehold switch has ever been
   activated by a sequence inside a perfect RNA duplex.
2. **Sensitivity is short by 15–31,000×.** The best unamplified toehold LOD is
   0.1 nM and a typical colorimetric readout is ~1.54 ng/µL in the well `[CALC]`,
   against our own Mango run-1 LOQ of 0.69 ng/µL. The toehold is less sensitive than
   an assay we had already run and rejected.
3. **Crude haemolymph destroys cell-free transcription and translation.** Serum at
   10% v/v causes >98% loss of protein output, and bee haemolymph is serum-class
   `[LIT]`. `[FLAG]` No published example exists of insect haemolymph from any
   species being added to a cell-free reaction. Every "direct from crude sample"
   headline routes the sample through isothermal amplification first.
4. **RNase III.** Every standard cell-free lysate strain is *rnc*⁺, and RNase III's
   preferred substrate is precisely a long perfect duplex.

Plus a practical fifth: first-generation toehold hit rates are 11.9% for ON/OFF
above 100, and every published predictor performs near chance on external data. It
could not be built by 21 October.

**What we learnt.** The rejection is mechanistic reasoning from published constants,
not a cited experimental result, and we say so rather than overreaching. The
modelling was not wasted: it produced three transferable design rules. **Never place
pyrimidine-rich sequence next to Mango**, the Mango-II core is 24 nt of nothing but
A and G, so its complement is pure pyrimidine, and Mango closing-stem integrity
collapsed from 1.000 to 0.333 at the adjacent position for every trigger class.
**G-containing insertions degrade the MS2 array** (integrity 0.978 down to
0.732–0.828, against 0.973–0.977 for G-free). **The 709 bp duplex arm never cares**,
at p = 0.998–0.999 at every site tested.

**Named successor.** Catalytic hairpin assembly: 10 fM LOD, enzyme-free, one hour at
37 °C, read on a plain agarose gel with a cheap intercalating dye, validated in crude
lysate, two hairpins for about £15. iGEM-feasible next season, out of scope for our
remaining time.

**What it changed.** £1,250 and six weeks not spent. The 36 nt handle survives as the
MS2 spacer and capture site it was co-designed to be.

## Workstream 4: Functionalising the dsRNA

Can we attach protein to the dsRNA to change where it goes?

### 4.1 · Can we put a protein-binding site in the loop?

**Status: Modelled. Contains a genuinely novel finding.**

**Question.** Can we install an array of protein-binding hairpins inside a ledRNA
loop without disrupting the molecule?

**Design.** The MS2 coat protein binds a specific 19 nt RNA hairpin `[LIT]`, and the
C-variant of that hairpin binds 50–100× more tightly than wild type `[LIT]`. Tandem
arrays bound by MCP fusions are the standard tool for tracking single RNA molecules
in live cells `[LIT]`. If we can put such an array in a ledRNA loop, we can attach
**any** protein to our dsRNA by fusing it to MCP: a modular adaptor, decoupled from
the RNA.

**Build.** Three identical published C-variant hairpins on spacers inside a 149 nt
ledRNA loop, then a redesign.

**Test.** ViennaRNA 2.7.2, Turner 2004, 37 °C, partition function with hard
constraints. Probability that each hairpin adopts its intended fold, as
P = exp(−(F_constrained − F_ensemble)/RT).

**Result: the array does not fold, and the reason is general.**

| Hairpin            | Predicted fold       | P(correct) |
| ------------------ | -------------------- | ---------- |
| MS2-1              | All opening brackets | **0.181**  |
| MS2-2              | Correct              | 0.704      |
| MS2-3              | All closing brackets | **0.181**  |
| All three together | ,                    | **0.060**  |

Every base pair MS2-1 forms is with MS2-3. Two identical copies of a
self-complementary hairpin are also complementary to _each other_, and a ~19 bp
inter-hairpin duplex beats two separate 7 bp hairpins. MS2-2 survives only because it
sits in the middle with no partner left. Changing one variable at a time: three
identical hairpins with poly-A spacers give 0.06, identical with optimised spacers
0.13, three **distinct** stems with poly-A 0.71, distinct with optimised 0.70.
**Spacer composition contributes almost nothing; hairpin identity contributes
everything** `[CALC]`. With fully optimised spacers and a 75 nt loop, three identical
C-variants give P = 0.000.

**What we learnt.** The fix is synonymous stem redesign: preserve the invariant core
and vary all five lower-stem base pairs. Enumerating all 1,024 lower-stem 5-mers and
filtering on fold quality, mutual Hamming distance and GC content gives a set of
hairpins at P = 0.90–0.93 each. Two further decisions, both quantitative: spacing of
at least 20 nt rather than abutted, because two MCP dimers need ~4.5 nm centre to
centre and a worm-like-chain model gives 4.7 nm of reach at 20 nt `[CALC]`; and four
hairpins rather than three, because P(≥3 usable sites) jumps from 0.78 at n = 3 to
0.97 at n = 4, and a four-hairpin array needs a 156 nt loop, which is 6 nt from
Muita's published 150 nt loop, the only ledRNA loop size with _in vivo_ efficacy
behind it.

**The novel finding.** `[FLAG: absence of evidence]` **Nobody in the MS2 field has
published a folding model of an array larger than two hairpins.** We checked the
principal methods papers: zero hits for mfold, RNAfold, ViennaRNA, NUPACK or "kcal"
across all 41 supplementary pages, and every published array structure is a
hand-drawn cartoon. The field solved a different problem, recombination of repeats in
_E. coli_, and the synonymised-stem fix incidentally removed the sequence identity
that causes cross-pairing. Nobody appears to have noticed the folding consequence. We
register it as a [Contribution](/contribution).

**Limitation.** Everything here is computational. `[FLAG]` Nobody has inserted a
functional cargo into a ledRNA loop, so there is no precedent for whether the loop
tolerates it _in vivo_.

**What it changed.** Array redesigned with distinct synonymous stems, n = 4, ≥20 nt
spacing, 156 nt loop. It also set the hard design rule used in 3.6: zero-G spacers
and the Mango-II core must never be neighbours.

### 4.2 · Can we make and quantify the adaptor protein?

**Status: Proposed. Designed and costed.**

**Question.** How much _active_ MCP do we have, and how would we know?

**Design.** Mass is not the measurement. The MS2 RNA-binding site is formed across
the dimer, a ten-stranded β-sheet contributed by both subunits, so one binding site
requires two polypeptides and unpaired monomer is dead protein that is invisible on
SDS-PAGE. We therefore define titre as **active binding sites, measured by
stoichiometric EMSA titration**, not by A280.

**Build.** His6-MBP-MCP from a published construct, expressed in _E. coli_ and
purified over Ni-NTA followed by a polyanion-discriminating second column. Fusion
geometry rule: fuse at a terminus, never into the β-sheet, since both termini sit on
the capsid exterior opposite the RNA-binding face.

**Test.** EMSA titration with RNA fixed at 200 nM, 10–12 protein points spaced 1.25×
apart near the expected endpoint, triplicate, fitting two straight lines and taking
the intersection. **Quantify disappearance of the free RNA band, not appearance of
the shift**, because MBP-MCP is 56 kDa and the complex may barely enter a native gel.

**Result.** Not yet built.

> **TODO: MCP expression and titration.** Pre-registered acceptance criteria:
> A260/A280 ≤ 0.70, because at A260/A280 ≈ 1.0 there is roughly one RNA binding
> footprint per coat-protein dimer `[CALC]`, which is stoichiometric contamination
> and not trace; active fraction reported as sites per two polypeptides; realistic
> accuracy stated as ±15–25% and never ±5%. Owner: wet lab. Blocked on the 8 Sep
> plasmid order.

**A reportable methods finding, free.** `[CALC]` Recomputing the extinction
coefficient from sequence gives ε₂₈₀ = 83,310 and MW = 56,192.5 for MBP-MCP. The
widely circulated protocol conversion factor implies ε = 60,606 and MW = 53,939, so
**it overstates molarity by 1.37× and mass by 1.32×.** The discrepancy is in ε, not
MW. Anyone using that factor is over-reporting their protein by about a third.

**Timeline honesty.** The plasmid was ordered on 8 Sep with protein expected 6–10 Oct
against a 21 Oct freeze. **A drop-without-regret date of 6 Oct was set in advance.**
Pre-committing to an abandonment date is a design decision, and we report it as one.

**What it changed.** Established that "how much protein" and "how much _working_
protein" are different measurements, and that only the second licenses any
stoichiometric claim about the array.

### 4.3 · Can we target the dsRNA to the mite?

**Status: Proposed. The highest-risk cycle in the project, and we label it that
way.**

**Question.** Can we functionalise the dsRNA with a host protein that the mite
concentrates, so that the dose follows the parasite?

**Design.** Vitellogenin (Vg) is an ~180 kDa egg-yolk precursor synthesised in the
worker fat body and the principal protein source for the jelly fed to larvae
`[LIT]`. It already crosses the bee midgut epithelium by receptor-mediated
endocytosis `[LIT]`. If _Varroa_ concentrates it, attaching our dsRNA to Vg via the
MS2/MCP adaptor of 4.1 would route the dose to the compartment where the mite
reproduces. `[CALC]` The affinity requirement is permissive: haemolymph Vg is
~27.8 µM, so at Kd = 1 µM 96.5% of the fusion is loaded and at 10 µM still 73.5%.
**Micromolar affinity is sufficient; nanomolar is not required.** Two rules follow:
bind Vg, never compete with it, because a mimic faces 28–231 µM of native competitor;
and riding Vg buys routing and protection, not amplification, since at 100 nM of
fusion against 30 µM Vg only 0.33% of Vg molecules carry cargo `[CALC]`.

**Build.** Designed, not built: an MCP–Vg-binder fusion added _in vitro_ to
MS2-tagged ledRNA, with a fusion-compatibility panel that includes one
predicted-bad control, because a screen that never predicts failure is not a screen.
Array size for this arm is n = 1–2 rather than 4, because an MCP–Vg dimer is ~390 kDa
per site and n = 5 would load ~1.9 MDa of protein onto a 429 kDa RNA.

**Test and result.** Not built.

**The evidence audit, which is the honest part of this cycle.**

| Claim                                                                               | Status                                                                                                                                                                      |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bee Vg is among the dominant bee proteins in the _Varroa_ gut                       | **Published**                                                                                                                                                               |
| _Varroa_ feeds primarily on fat body, not haemolymph                                | **Published** `[LIT]`, and it matters: our cargo needs to be in or on fat body, not merely circulating                                                                      |
| _Varroa_ has its own vitellogenin genes                                             | **Published** `[LIT]`, so bee-derived Vg reaching the egg is a separate question                                                                                            |
| Bee Vg accumulates in _Varroa_ eggs at higher concentration than in the gravid mite | **Preprint only**, four years unpublished. **Our entire targeting rationale rests on this, and we state that dependency here rather than burying it**                       |
| A characterised binder to bee Vg exists                                             | **No** `[FLAG]`. No receptor ectodomain, nanobody, antibody, aptamer or designed binder with a measured Kd exists for bee Vg or for any of the other six candidate carriers |
| Vg transfer to the mite egg is receptor-mediated                                    | **Evidence points the other way**: the published mechanism runs through the lyrate organ, which the authors state circumvents a receptor-mediated pathway                   |
| MCP fusions have been used to functionalise dsRNA in insects                        | **No precedent found** `[FLAG]`, which supports the novelty claim and means zero efficacy precedent                                                                         |
| MS2 hairpins survive the bee gut and MCP stays bound _in vivo_                      | **No data in any insect** `[FLAG]`. The biggest unlit experimental risk here                                                                                                |

**What we learnt.** Three things. **Do not write "selective uptake" anywhere on this
wiki**: 53–61% mite reduction was achieved in a 60-day trial with naked, untargeted
dsRNA `[LIT]`, so the bee-mite feeding relationship already provides the selectivity.
What targeting could add is the egg compartment, and that is the claim, stated
narrowly. **The most likely real gain is not in the bee at all**: the largest loss
happens before ingestion, since conventional dsRNA falls to ~25% within 3 h in the
feeder `[LIT]`, so if MCP decoration protects anywhere, the feeder is the cheapest
and highest-value place to demonstrate it, and it needs no bees. And
**protein-bound is the natural surviving state**: ingested dsRNA in bee haemolymph
already circulates as a ribonucleoprotein complex `[LIT]`. We are not making the
molecule unnatural, we are choosing which protein binds it.

> **TODO: the one experiment that de-risks the whole arm, and it takes an
> afternoon.** RNase A at 350 mM NaCl, 2 ng/µL, 15 min at 37 °C, on a 1.2% agarose
> gel, run ± MBP-MCP. High salt makes RNase A single-strand-specific, so the loops
> are cleaved and the duplex is not. The loop should shorten the band and MCP should
> protect it, so one gel reports loop accessibility and MCP binding at the same time.
> Owner: wet lab.

**What it changed.** Array size for the targeting arm dropped from 4 to 1–2. The
primary demonstration moved from the bee to the feeder. The dependency on an
unpublished preprint is stated on the page rather than buried.

## Bee lab

The wet lab makes the molecule; the bee lab is where it meets an animal. These
cycles are method development, and we count them as engineering because without them
there is nothing to test NECTAR with. Detail and dated entries on
[bee lab](/bee-lab).

### B1 · Can we deliver a known dose to a bee?

**Status: Demonstrated, as a method.**

Four sub-cycles, each a design decision that came out of something not working:
large feeders wasted dsRNA in dead volume and were replaced by cut-down Eppendorf
tubes with PCR-tube adaptors; the proboscis extension response assay was moved from
foragers to newly-emerged bees, because foragers took up to 30 µL but did not
survive the day reliably, while newly-emerged bees are calm and take a controlled
5–10 µL; larval dosing moved to in-frame spiking; and a sucrose and salt tolerance
assay established the background mortality against which any treatment effect has to
be read.

> **TODO: write B1 into the seven beats.** The decisions above are settled and
> documented in the bee-lab journal; the numbers (cage counts, uptake volumes,
> survival at each iteration) need pulling from it and checking before they go on
> the page. Owner: bee lab.

**What it changed.** Newly-emerged bees and PCR-tube feeders became standard for
every dosing experiment on this project, which is what makes a µg-per-bee figure
mean anything.

### B3 · Does it kill the mite?

**Status: Investigated. Husbandry DBTL-1 closed negative; the efficacy screen is
planned.**

Before a mortality screen can run, mites have to survive in the lab long enough to
be dosed. **DBTL-1 was a negative result and we report it as one:** mites soaked and
placed on pupae reached 35.7% survival, while both the no-pupae and unsoaked control
arms were near zero. That result is what forced a husbandry redesign rather than a
dosing redesign, and it is the reason the efficacy screen has not yet run.

> **TODO: B3 DBTL-2.** Whole-mite knockdown by RT-qPCR as the primary endpoint,
> then dose-response. Owner: bee lab. Blocked on mite husbandry. The mortality titre
> numbers are not in yet and nothing on this wiki claims them.

**What it changed.** The primary endpoint moved from mortality to molecular
knockdown, because knockdown can be measured on the mites we can keep alive.

## Dry lab

### D1 · Which sequence silences the mite?

**Status: Modelled.**

NectarDesigner ranks candidate target genes, then scores 24 nt windows within them
on accessibility, thermodynamic asymmetry and enrichment in native _Varroa_ viral
siRNA populations, then screens the survivors for off-target homology. The
off-target screen follows advice we were given directly on choosing representative
species rather than scanning everything. A sequence-concatenation strategy was
tested computationally and set aside on our own calculations: we present it as
tested and rejected, not as an active construct. Detail on
[RNA design](/software).

> **TODO: D1 into the seven beats, and check the IP gate first.** The metric names
> and the biology are publishable; the weights, coefficients, thresholds, feature
> engineering and training corpus are not, and naming the target gene publicly needs
> checking against the patent filing date. Owner: dry lab, with whoever holds the IP
> question.

### M1–M3 · What treatment efficacy is worth reaching?

**Status: Modelled.**

Three BEEHAVE cycles, each adding something the previous one showed was missing:
establish the model and characterise steady state; add hive profiles with
unconstrained forage to find the treatment efficacy a colony actually needs and what
that efficacy is worth economically; then build the dsRNA transfer chain into the
model explicitly, as a series of individually adjustable probabilities (a bee eats
the patty, transfers it to a phoretic mite, the mite dies), so that the model says
which of those is the biggest needle-mover. Detail on
[dry lab and modelling](/model).

**What it changed.** This is the chain that turns a biological target into a number
the wet lab has to hit: required efficacy → allowable cost → manufacturing cost →
**required yeast titre**, the measurement 2.2 cannot yet supply.

> **TODO: every model on this wiki is literature-parameterised.** No model
> currently uses a parameter we measured. We say so plainly rather than letting a
> judge find it. Owner: dry lab.

## What went wrong

Collected rather than scattered, because this is the section a future team reads
first.

| What broke                               | How we knew                                     | What changed                                                                                                                                            |
| ---------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 ng/µL from IVT (E1)                    | Two constructs, repeatedly, while others worked | T7 promoter was on both primers. Rebuilt single-orientation; those became the workhorse templates                                                       |
| T7 reverse primers dead (E2)             | No transcript from correct-looking template     | The kit needs GGG after the promoter, not a single G. Reordered, and a construct-series parity error propagated from the replacement order              |
| Gels and iterations failing (E3)         | Two iterations failed together                  | Primer stock had not been mixed. Re-vortexed                                                                                                            |
| dsRNA would not anneal (E4, 20 Jul)      | No duplex band                                  | No salt in the annealing reaction. Salt mix added at a defined ratio                                                                                    |
| Step-2 Gibson PCR gave a smear (7 Sep)   | Smear, not a band                               | Incomplete Gibson leaving short fragments that amplify faster. Ethanol carryover and annealing temperature resolved it; the wrong band had been excised |
| Water controls amplifying (31 Jul)       | Perfect 100 bp band with no template            | Template contamination, not primer-dimer. Diagnosed in 3.3b and published as a protocol                                                                 |
| A perfect calibration curve (3.4)        | R² = 0.9999                                     | The assay was measuring intercalation, not the aptamer. Mango demoted to selector                                                                       |
| Five extraction methods, no winner (3.1) | All comparable                                  | Chose on variance instead of yield. Published as a null                                                                                                 |
| Mites would not survive husbandry (B3)   | 35.7% survival on pupae, near zero in controls  | Efficacy screen postponed; endpoint moved to molecular knockdown                                                                                        |

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
- B1, B3, D1 and M1–M3 written into the full seven beats, with their numbers checked
  against the journals.
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
[Yeast](/yeast) · [Measurement](/measurement) · [Parts](/parts) ·
[Dry lab and modelling](/model) · [RNA design](/software) ·
[Human practices](/human-practices) · [Contribution](/contribution)
