> **What this page proves:** that we can say how much intact dsRNA is present
> in a biological sample, with stated limits, and that another lab could do the
> same.
> **Where the evidence is:** [Results](/results),
> [experiments and lab book](/wet-lab-experiments), and cycles 1.4 and 3.1–3.6 on
> [Engineering](/engineering).

Measurement is where this project has the strongest claim to having built
something reusable, and it is also where **the most instructive mistake** was made
and corrected. The correction is on this page at full length, because it is
worth more than the result it replaced.

## The measurement problem

Total RNA concentration answers a different question from ours. Absorbance at
260 nm **counts every nucleotide in the tube**, including the free NTPs left over
from transcription, and cannot distinguish them `[LIT]`. What matters here is
how much of a _specific_, _intact_, _double-stranded_ molecule is present in a
matrix built to destroy it.

The gap is not ours alone. Of six published _Varroa_ RNAi papers, three quantify
"spectrophotometrically", three state no method at all, and none reports a Qubit
value, an A260/A280 or mass-ladder densitometry. Maori et al. 2019 fed 500 ng of
DIG-labelled dsRNA per bee and recovered it from raw haemolymph at 5 h, but
published no concentration `[LIT]`. Muita et al. 2026 could see their dsRNA only
because it was Cy3-labelled `[LIT]`. **There is no published working range for
ingested dsRNA in honeybee haemolymph to calibrate against.** That absence is
why this page exists.

## What exactly we are measuring

The measurand, stated so it can be argued with:

**Mass of intact double-stranded RNA of a defined construct, per µL of crude
adult haemolymph or larval extract, at a stated time after a stated oral dose,
in ng/µL.**

Three words in that sentence each cost an experiment. _Intact_ rules out
absorbance. _Double-stranded_ rules out anything that reads total RNA.
_Construct_ rules out any generic stain used on its own.

## The approaches we compared

| Approach                       | What it promised                                                 | Where it stands                                                                                       |
| ------------------------------ | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| NanoDrop A260                  | Free, instant, already in the lab                                | **Rejected as a dose.** Counts unincorporated NTPs; disagreed with Qubit by 3.3–18.2×                 |
| Nuclease digest + Qubit        | Duplex-specific mass, using reagents already in the kit          | **Adopted as the dose.** Cycle 1.4                                                                    |
| One-step RT-qPCR               | The orthogonal reference method, sequence-specific               | **Built, not yet validated to MIQE.** Cycle 3.3                                                       |
| Mango aptamer + TO1-Biotin     | The molecule reports its own concentration, no purification step | **Demoted from quantifier to selector.** Cycle 3.4, and the correction below                          |
| Generic stain (SYBR Gold)      | 25–250× more sensitive for about a seventh of the cost `[FLAG]`  | **Proposed.** Two protocols written, neither run. Cycle 3.5                                           |
| Toehold switch                 | Extraction-free, amplification-free, cheap for other teams       | **Modelled and rejected** on four independent grounds, saving £1,250 and six weeks. Cycle 3.6         |

## The Mango system, and what it actually measures

**Status: Investigated.** RNA Mango is a fluorogenic aptamer: a thermostable
G-quadruplex that binds the fluorophore TO1-Biotin with Kd 3.2 ± 0.7 nM and
turns its fluorescence on ~1,100-fold `[LIT]`. Because it is a short structured
loop, it can _be_ the terminal loop of our loop-ended construct rather than
sitting next to it — genetically encoded, one copy, at a defined position, at no
marginal cost. **Mango II was kept** over the brighter Mango III on Prof. Peter
Unrau's advice about environmental robustness for eventual _in vivo_ use.

### Calibration in water: one real run

**Run 1, in water, 1 µM TO1-Biotin.** A linear fit over the lowest four points
gave **slope 4,952 RFU per ng/µL, R² = 0.9999, CVs 0.8–7.4%, LOD 0.23 ng/µL and
LOQ 0.69 ng/µL** `[CALC]`. LOD and LOQ are blank + 3 SD and blank + 10 SD.

### Run 2: a failed run, published with its diagnosis

**Run 2, 125 nM dye, no Tween-20, plate-reader auto-gain left unlocked.** The
response was **non-monotonic**, varied 2.6-fold within a single run, and
degraded the limits roughly sixfold, to **LOD ≈ 1.3 and LOQ ≈ 4.1 ng/µL**
`[CALC]`. Two causes, both procedural: unlocked auto-gain rescales every well
against its own reading, so the axis moves under the standards; and without
Tween-20 the dye and the RNA adsorb to the plastic at the low end of the series.

We publish this run rather than the clean one alone. A failed run with a named
cause is **a usable warning**; a failed run quietly dropped is a trap left for the
next person.

### The correction: a perfect line was the evidence against us

We initially reported Run 1 as a successful Mango calibration. **On re-analysis
it was not measuring the aptamer.** TO1's dissociation constant for duplex RNA
is ~1–10 µM, and Run 1 was performed at 1 µM TO1-Biotin, where dye intercalated
along a 700 bp duplex dominates the signal `[CALC]`. Intercalation is rigorously
linear in dsRNA mass. **R² = 0.9999 is exactly what a pure-intercalation signal
produces, so the quality of the line was evidence against the aptamer working,
not for it.**

Two independent confirmations of the same conclusion: our in-gel bands sat at
9–18 fmol against a published in-gel Mango-II detection limit of 62.5 fmol
`[LIT]`, and you cannot see something three to seven times below the detection
limit; and a Mango aptamer base-paired inside a duplex does not fluoresce, with
4 bp of complementarity **suppressing signal 78-fold**
`[FLAG, source DOI unverified]`.

## Three quantified failure mechanisms

These are **results, not embarrassments**. Each is a number another team can use to
decide whether to attempt the same assay.

**1 · Haemolymph autofluorescence sits on the detection channel.** Haemolymph
carries flavins, excited at ~440–450 nm with emission ~510–550 nm `[LIT]`, which
overlaps the 520–532 nm channel the assay reads on; flavin quantum yield is
~0.26 `[LIT]`. Melanisation adds a variable inner-filter loss on top, and it
proceeds at different rates in different bees.

> **TODO —** The on-channel measurement has not been made. Record the absorbance
> and emission spectrum of our own crude haemolymph at 440–550 nm, with and
> without PTU, and state the autofluorescence contribution in RFU rather than
> citing it from the literature. Owner: measurement. Hours.

**2 · One aptamer against a hundred-odd intercalation sites.** A 700 bp duplex
presents on the order of 10² intercalation sites — 125–250 by site counting, of
which roughly 140 would be occupied at the dye concentrations used — against the
construct's **single** Mango site `[CALC]`. One fluorophore per 410 kDa against
one per 2–4 bp is not a gap that optimisation closes.

> **A correction we publish as a correction.** An earlier version of this
> analysis converted that site count into a claim that intercalation outshines
> Mango by 110–140×. That was a saturation calculation applied to a
> sub-saturating regime, and **we retract the brightness ratio.** The site count
> stands; the ratio derived from it does not.

**3 · Well retention from protein complexation, and this one is recoverable.**
Adult haemolymph runs at 12.3–32.4 mg/mL protein `[LIT]`, so an 8 µL lane
carries **98–536 µg of protein against 0.408 µg of dsRNA** — 240:1 by mass at
the top of our standard series and rising past 30,000:1 at the bottom `[CALC]`.
We had run an unintentional EMSA with the bee proteome as the shift partner. The
diagnostic detail matters: **the band stayed at the correct migration position**,
so this is retention, not degradation. Degradation gives a downward smear.

### What the matrix costs, measured

In-gel, the water dilution series was visible to **~3–6 ng** per band; the same
series spiked into haemolymph was visible only to **~50–100 ng**. That is a
**10–30× matrix penalty** `[CALC]`, and it is the number that decides whether an
assay is worth running on crude material at all.

## Sample preparation: proteinase K is not optional

Ingested dsRNA does not circulate naked. In bee haemolymph it circulates as a
ribonucleoprotein complex (Maori et al. 2019, _Cell Reports_ 27:1949) `[LIT]`.
Any assay that reads free duplex — intercalating stain, aptamer, capture — is
reading a molecule that is already bound to something. **Proteinase K digestion
of crude haemolymph before the read is therefore mandatory, not a clean-up
nicety,** and failure mechanism 3 above is what happens without it.

## Orthogonal validation

### NanoDrop against Qubit, eight preparations

**Status: Demonstrated.** Across **8 independent preparations, 3 constructs and
5 dates**, a DNase I + RNase T1 digestion removed 48% of the A260 signal every
time: **N₁/N₀ = 52.1% ± 4.2%** `[CALC]`. The low scatter across independent
preparations is itself the repeatability evidence, and it is why the digest, not
the raw NanoDrop reading, defines every dose in this project. Method and
rationale in cycle 1.4 on [Engineering](/engineering).

> **TABLE —** The eight preparations, one row each: date, construct, N₀
> (NanoDrop pre-digest), N₁ (post-digest), Q₀ and Q₁ (Qubit), N₁/N₀, and the
> NanoDrop:Qubit ratio. This is the table the 52.1% ± 4.2% is computed from and
> it belongs on this page in full.

**Do not use the fitted power law.** A fit of `Q₁ = 0.6 × N₀^0.696` across those
preparations is an instrument artefact, not chemistry: "too high" appears at
exactly N₀ > 1000, the Qubit RNA BR ceiling, and the lowest post-digest value is
exactly 20.0, the BR floor. A saturating top and a compressed bottom reproduce a
sublinear fit from nothing. Publish the method, not a correction factor — the
NanoDrop:Qubit ratio runs from 3.3× to 18.2× across our own preparations,
because it depends on how much unincorporated NTP each reaction left behind.

**A hole in our own headline number.** RNase T1 cuts ssRNA to mononucleotides
that still absorb at 260 nm but are invisible to Qubit, so an N₁ read without
post-digest cleanup is partly counting the debris of what we just destroyed. The
re-measurement that closes this, with its pre-registered acceptance rule, is
recorded at cycle 1.4.

### RT-qPCR

RT-qPCR is the orthogonal method everything else here is benchmarked against, so
it has to meet MIQE minimums: efficiency, slope, y-intercept, R², melt-curve
specificity, no-template and no-RT controls `[LIT]`. **It does not yet.**

> **TODO —** MIQE standard curve: 10-fold series, ≥6 points, triplicate, on a
> PCR product or plasmid standard. Report E, R², slope and y-intercept;
> acceptance window 90–110% efficiency, uninhibited slope −3.32. Owner: wet lab.
> ~2 days, and it is mandatory — without it this page has no reference method.

### The toehold switch, modelled and rejected

A synthetic toehold reporter would have been the cheapest and most transferable
option of all. It was **rejected on four independent grounds** before any money was
spent — the trigger cannot be single-stranded inside a perfect duplex,
sensitivity falls short by 15–31,000×, crude haemolymph destroys cell-free
expression, and every standard lysate strain is RNase III-competent. Full
reasoning at cycle 3.6.

## Controls

A measurement page without its controls is an assertion. Ours, with their honest
status:

| Control                                        | Status                                               |
| ---------------------------------------------- | ------------------------------------------------------ |
| Untagged dsRNA, same length and mass           | **Never run.** The whole assay depends on it — below  |
| Dye/reagent blank                              | Run, and the basis of the LOD/LOQ figures above       |
| Matrix blank (unspiked haemolymph)             | Run                                                   |
| No-template and no-RT controls (RT-qPCR)       | Run; see the contamination diagnostic at cycle 3.3b   |
| Positive control at known concentration        | Run, from digest-Qubit-quantified IVT stock           |
| Spike-recovery into crude matrix, n ≥ 6        | **Never run.** The largest remaining hole             |

> **TODO —** The untagged-dsRNA control. Same length, same mass, same gel, same
> stain, plus a tagged lane with 100× excess untagged competitor. If the
> untagged lane is as bright, the signal is entirely intercalation; if the
> tagged lane is measurably brighter, that difference _is_ the result. This is
> Prof. Unrau's own question back to us, it has never been run, and every Mango
> claim on this wiki is contingent on it. Owner: wet lab. Hours, not weeks.

## Limits of detection and quantification

Stated with the method used to get them, because "sensitive" is not a number.

| Condition                                  | LOD           | LOQ           |
| ------------------------------------------ | ------------- | ------------- |
| Mango Run 1, water, 1 µM dye               | 0.23 ng/µL    | 0.69 ng/µL    |
| Mango Run 2, water, 125 nM dye, no Tween   | ~1.3 ng/µL    | ~4.1 ng/µL    |
| In-gel, water series                       | ~3–6 ng/band  | not determined |
| In-gel, haemolymph-spiked series           | ~50–100 ng/band | not determined |
| Crude haemolymph, plate reader             | not determined | not determined |

All LOD/LOQ values are blank + 3 SD and blank + 10 SD respectively `[CALC]`. The
water figures belong to an assay we have since shown was reading intercalation,
so they describe **the dye's response to duplex mass**, not the aptamer's
response to our tag. We state them that way rather than withdrawing them,
because as an intercalation calibration they are still usable.

## Repeatability

- Within-run, Mango Run 1: CVs **0.8–7.4%** across triplicates `[CALC]`.
- Between preparations, digest-Qubit: **N₁/N₀ = 52.1% ± 4.2%** across 8
  preparations, 3 constructs and 5 dates `[CALC]`. This is the strongest
  repeatability evidence on the page, and it is deliberately across operators and
  days rather than within one plate.
- Between runs, Mango: **poor, and quantified as such.** Run 1 and Run 2 differ
  in LOD by roughly sixfold. Run-to-run comparability requires locked gain,
  Tween-20 and a fresh standard series on every plate.
- RNA extraction, from cycle 3.1: silica column **CV 18.5% (n = 7)** against
  TRIzol/Vezol **CV 27.4% (n = 8)**. Column was chosen on variance, not yield.

## Protocol for future teams

The reusable output of this work is **three written procedures**, not a single
number:

1. **The nuclease-digest quantification protocol** — how to turn an A260 reading
   into a duplex-specific mass with reagents already in a standard IVT kit, and
   why RNase T1 rather than RNase A at normal ionic strength.
2. **The NanoDrop/Qubit correction note** — why not to publish a correction
   factor, and what to publish instead.
3. **The qPCR contamination diagnostic** — the decision tree from cycle 3.3b,
   reusable by any team with an amplifying negative control.

Working versions are on [experiments and lab book](/wet-lab-experiments); the reusable
summaries belong to [Contribution](/contribution).

> **PDF —** The dsRNA quantification protocol plus the analysis spreadsheet,
> uploaded to `static.igem.wiki` and linked here. This pair is the Measurement
> deliverable. Owner: measurement.

## Limitations

- **Mango signal is not proof of an intact molecule.** A folded aptamer reports
  that a quadruplex is present, not that 1,598 nt of construct survived around
  it. Only a size-resolved read does that, which is why the gel channel exists.
- **The tagged/untagged control has not been run**, so no Mango measurement on
  this wiki can yet be attributed to the aptamer rather than to intercalation.
- **No matrix-matched calibration exists.** Every calibration above is in water;
  the matrix penalty is characterised but not corrected for.
- **RT-qPCR is not yet MIQE-validated**, so the orthogonal reference is a method
  under development rather than an anchor.
- **The in-gel and plate-reader routes have not been cross-compared** on the same
  material on the same day.

## What remains feasible by 21 October

Written as a plan with a cost, because a measurement page that ends in a wish
list is not a plan.

| #   | Experiment                                                                                                                     | Feasible?                                |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 1   | **Untagged-dsRNA control** — does streptavidin also capture dsRNA carrying intercalated TO1-Biotin? Never run; the assay depends on it | Yes — hours                              |
| 2   | **Streptavidin capture + K⁺ wash** (never Na⁺ — Mango is a G-quadruplex). Turns a failed homogeneous assay into a capture format that removes both failure modes: the matrix is washed away and weak intercalation washes off | Yes — days                               |
| 3   | **Matrix-matched calibration + spike-recovery in crude haemolymph, n ≥ 6** — gives LOD/LOQ and matrix recovery on one plate     | Yes — the highest-value single experiment |
| 4   | **RT-qPCR standard curve to MIQE minimums** (efficiency, slope, R², melt, no-RT)                                               | Yes — ~2 days, and mandatory              |
| 5   | **Mango on both ends + exonuclease + wash**, so only the quadruplex survives and signal-to-background rises                    | Yes — 1–2 gels                            |
| 6   | **SYBR Gold** — run one of the two protocols already written                                                                   | Yes                                       |
| 7   | **6× Mango array** for single-molecule sensitivity                                                                             | At risk — IDT synthesis wall; write up as designed-not-built |

## What this changed in NECTAR

Every µg-per-bee figure in this project is **re-derived from digest-Qubit** rather
than NanoDrop. Mango was reassigned from quantifier to selector, which freed the
mass measurement to move to a generic stain and the quantitative numbers to move
to RT-qPCR. And the matrix work turned "crude haemolymph, no purification" from
a design goal into **a measured 10–30× penalty** with a named route around it —
capture and wash rather than a homogeneous read.

## Where this connects

[Results](/results) · [Bee lab](/bee-lab) · [Wet lab](/wet-lab) ·
[Experiments and lab book](/wet-lab-experiments) · [Parts](/parts) ·
[Contribution](/contribution) · [Engineering](/engineering)
