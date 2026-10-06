Throughout the literature to date there are few methods to quantify the
concentration of dsRNA within our intended target host, _Apis mellifera_. To better
understand how dsRNA design can be optimised within this host, NECTAR's measurement
system explored quantitative approaches to dsRNA detection.

## What this work produced

1. An **A260 → intact-duplex correction** for T7 IVT dsRNA, with the digest protocol
   and the measured conversion factor.
2. The first absorbance characterisation of _Apis_ haemolymph at fluorophore-relevant
   wavelengths, and the first melanisation time-course for bee haemolymph.
3. A head-to-head **cost and sensitivity comparison of four dsRNA detection
   chemistries**, with a selection decision tree.
4. A **dosing method that delivers a known mass to an individual bee**, with a
   24-fold reduction in animal use.

## Prior art, and why published doses are not reproducible quantities

Dosing _Varroa destructor_ with dsRNA has been done by mite immersion since
**Campbell et al. (2010)**, who soaked mites overnight in 20 µL of dsRNA at
2.5 µg/µL. Later work by **Becchimanzi et al. (2024)** soaked groups of ten mites in
20 µL at 1 µg/µL, **Muita et al. (2026)** used groups of four in 20 µL at 1 µg/µL,
and **Bortolin et al. (2025)** soaked at 2.5 µg/µL for 14 h. **Muntaabski et al.
(2025)** is the exception — a dorsal topical application of 1 µL at 2.5 µg/µL, and
the only genuine per-mite _applied_ dose in the literature.

We set out to reproduce these immersion assays and found that, as published, **they
are not reproducible quantities**. There are three independent reasons.

**They are mostly not per-mite doses.** They are bath concentrations. Dividing bath
mass by mite count gives 2 µg (Becchimanzi) or 5 µg (Muita) of dsRNA _available_ per
mite, an upper bound on exposure rather than a delivered dose. Campbell never states
mites per tube, so no per-mite figure can be recovered at all, and the paper is
explicit that "it is not known what is the site of dsRNA entry into the mite". Only
Muntaabski's 2.5 µg is a mass actually placed on an animal.

**Every figure is an A260 number read with the wrong conversion factor.** Kit
manuals including MEGAscript RNAi specify 40 ng/µL per A260 unit. **That is the ssRNA
factor.** Duplex base stacking is hypochromic, so dsRNA absorbs less per unit mass
and sits between ssRNA and dsDNA. Two independent measurements agree:
**45.9 ± 0.52 µg/mL/A260** by complete enzymatic digestion to nucleosides followed by
RP-HPLC (Strezsak et al. 2021), and **46.52 µg/mL/A260** (range 46.18–47.29) by DMSO
chemical denaturation and UV hypochromicity (Nwokeoji et al. 2017) `[LIT]`. Two
orthogonal methods agreeing within 1.3%. **Using 40 under-reads a duplex by 13–14%.**

**No paper states its purification state or its instrument.** This matters because
the opposite error is unbounded by the reader. In a crude T7 reaction most of the
A260 is unincorporated nucleotides: on the Vazyme TR101 chemistry (0.80 µmol NTP per
20 µL reaction), a 50 µg yield leaves **87% of A260 as free NTPs and over-reads
duplex by 7.7×** `[CALC]`. Purification collapses this — a silica spin column removes
>99% of NTPs `[LIT]` — leaving ~1–3% inflation at normal yields, but the reader
cannot tell which regime a published number sits in.

**The two errors point in opposite directions.** Free nucleotides inflate; the 40
factor deflates. A reader cannot sign the error on a published _Varroa_ dose, let
alone correct it. The field knows: Strezsak et al. open by noting that RNAi research
"has created a need for a robust method that can accurately determine the
concentration of long dsRNA."

On our own material the gap is measurable. A 500 bp Mango-tagged duplex read
**182 ng/µL by NanoDrop, 55 ng/µL by Qubit, and 29.2 ng/µL after DNase I and
RNase T1 digestion** — a **6.3-fold over-read** against nuclease-resistant duplex,
with 47% of even the Qubit signal attributable to single-stranded byproduct rather
than duplex `[CALC]`.

Detection of ingested dsRNA in honey bee haemolymph has been reported by Northern
blot (Maori et al. 2019; Garbian et al. 2012), but we found **no published method for
the absolute quantification of dsRNA from honey bee haemolymph**; the nearest
analogue is a qRT-PCR persistence assay in non-bee insect haemolymph (Garbutt et al.
2013). **That is the gap this project addresses.**

> **TODO —** Figure: "The dose you think you gave." Stacked bar of the A260 budget for a T7
> IVT: free NTPs, template DNA, ssRNA byproduct and intact duplex, at three yield
> scenarios (80 / 50 / 20 µg true yield → 2.8× / 4.8× / 12.8× over-read).

## What exactly we are measuring

The measurand:

**Mass of intact double-stranded RNA of a defined construct, per µL of crude
adult haemolymph or larval extract, at a stated time after a stated oral dose,
in ng/µL.**

Three words in that sentence each cost an experiment. _Intact_ rules out
absorbance. _Double-stranded_ rules out anything that reads total RNA.
_Construct_ rules out any generic stain used on its own.

## The incumbent, and what it cannot measure

The standard method for detecting a specific RNA in a biological sample is RT-qPCR,
and it was run throughout this project. It is the most sequence-specific readout
available here and the only one with single-copy sensitivity. **It was not sufficient
on its own, and the reason determined everything that follows.**

**RT-qPCR counts copies of a sequence window roughly 100 bp wide. It does not report
whether the molecule carrying that window is intact.** A degradation fragment
spanning the two primer sites amplifies as efficiently as full-length duplex. For an
RNAi experiment this distinction _is_ the experiment: the active species is a duplex
long enough to be processed by Dicer, and a 100 bp fragment of it is quantitatively
detectable and biologically inert. A readout that cannot separate the two over-reports
the delivered dose by a margin that grows with degradation — precisely the regime a
haemolymph sample occupies.

The dependence runs deeper than an edge case. Reverse transcription of a duplex
requires denaturation, and omitting the 95 °C step costs **125-fold in signal**
`[LIT]`. A readout whose answer moves that far depending on whether the duplex was
first forced apart is, by construction, reporting sequence presence rather than
duplex integrity.

**The unit this work is built on — nanograms of intact duplex — is therefore not a
quantity RT-qPCR naturally returns.** Three alternative chemistries were evaluated
against that requirement. Each counts something different, and the comparison is
between what they count, not between how sensitive they are.

| Method                      | What is counted                           | Blind to                                                  |
| --------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| A260                        | every molecule bearing a base             | structure, size, sequence                                 |
| **RT-qPCR**                 | **copies of a ~100 bp sequence window**   | **whether the molecule is intact, duplex, or long enough** |
| Intercalating stain, in gel | mass of nucleic acid, resolved by size    | sequence identity                                          |
| Dye assay in solution       | mass of polymeric nucleic acid            | sequence _and_ size                                        |
| Aptamer tag, as intended    | one sequence, one molecule, size-resolved | in principle nothing; in practice see below                |

## The approaches we compared

| Approach                       | What it promised                                                 | Where it stands                                                                                       |
| ------------------------------ | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| NanoDrop A260                  | Free, instant, already in the lab                                | **Rejected as a dose.** Counts unincorporated NTPs; disagreed with Qubit by 3.3–18.2×                 |
| Viral dsRNA-binding domain fused to a fluorescent protein | Fast to build and readily engineerable        | **Rejected before building.** High background from non-construct-specific dsRNA binding in crude haemolymph. Recommended to us by Prof. Jeffrey Barrick |
| Nuclease digest + Qubit        | Duplex-specific mass, using reagents already in the kit          | **Adopted as the dose.** Cycle 2.6                                                                    |
| One-step RT-qPCR               | The orthogonal reference method, sequence-specific               | **Built, not yet validated to MIQE.** Cycle 3.3                                                       |
| Mango aptamer + TO1-Biotin     | The molecule reports its own concentration, no purification step | **Demoted from quantifier to selector.** Cycle 4.1, and the correction below                          |
| Generic stain (SYBR Gold)      | Comparable sensitivity for about a seventh of the cost `[FLAG]`  | **Proposed.** Two protocols written, one gel run and not yet quantified. Cycle 4.3                    |
| Toehold switch                 | Extraction-free, amplification-free, cheap for other teams       | **Modelled and rejected** on four independent grounds, saving £1,250 and six weeks. Cycle 4.4         |

## The Mango system, and what it actually measures

**Status: Investigated.** RNA Mango is a fluorogenic aptamer: a thermostable
G-quadruplex that binds the fluorophore TO1-Biotin with **Kd 1.1 ± 0.3 nM** and a
fluorescence turn-on exceeding **1,500-fold** `[LIT]`. Because it is a short
structured loop, it can _be_ the terminal loop of our loop-ended construct rather
than sitting next to it — genetically encoded, one copy, at a defined position, at no
marginal cost. **Mango II was kept** over the brighter Mango III on Prof. Peter
Unrau's advice about environmental robustness for eventual _in vivo_ use.

The construct carries the Mango-II insert
`GGCACGTACGAAGGAGAGGAGAGGAAGAGGAGAGTACGTGCC` — 42 nt, the terminal addition included
to avoid asymmetric bulges when the same sequence is used as a dumbbell loop — on a
550 bp duplex, giving **592 bp and 381 kDa**. At that mass **1 fmol = 0.381 ng**,
which fixes every conversion below. If the signal were background-limited, predicted
detection limits would run from **0.003 nM at 50 nM dye to 0.063 nM at 1 µM**.

### The control that decides it

**Setup.** A Mango-tagged and an untagged construct were run on the same gel at
nominally matched mass and post-stained together in TO1-Biotin. Separately, a
commercial nucleic acid ladder was stained alone.

**Result.** **No difference in staining was observed between tagged and untagged
constructs. The ladder stained.**

**The ladder is the decisive observation.** A commercial ladder carries no Mango
aptamer at any position, so its staining cannot be attributed to aptamer binding
under any model of affinity, occupancy or stoichiometry. It demonstrates directly
that TO1-Biotin binds nucleic acid non-specifically under the staining conditions
used, and it is reproducible by any team holding the dye and a ladder.

The untagged construct appeared marginally more heavily stained, and **we do not
report that as a result**: the two lanes were matched by A260, a metric unreliable
for duplex RNA, by an amount that differs between two
constructs of different length and secondary structure. **No enhancement attributable
to the aptamer was detectable under these conditions**, and the loading caveat stands
alongside that statement.

**Mechanism.** Specific binding saturates once dye exceeds
roughly ten times Kd, around 11 nM; non-specific binding to duplex remains linear in
dye concentration well into the micromolar. Every nanomolar of dye above the
saturation point therefore buys background and no signal.

### In-gel performance

**Setup.** A 592 bp Mango construct was loaded as an eight-point two-fold series from
408 ng to 3.19 ng, in parallel in nuclease-free water and in crude haemolymph, on one
gel, post-stained with TO1-Biotin. Twenty lanes: ladder, unspiked haemolymph, eight
water, two controls, eight haemolymph. Densitometry was by fixed-width lane
integration with background taken from empty gel below the band row.

LOD is 3.3σ/S and LOQ is 10σ/S (ICH Q2), where σ is the standard deviation of the
blank lanes and S the calibration slope in integrated intensity per ng.

| Fit range          | Slope     | R²         | LOD         | LOQ         |
| ------------------ | --------- | ---------- | ----------- | ----------- |
| **3.19 – 51 ng**   | **7,273** | **0.9983** | **0.42 ng** | **1.27 ng** |
| 6.39 – 102 ng      | 6,212     | 0.9911     | 0.49 ng     | 1.48 ng     |
| 3.19 – 408 ng      | 2,913     | 0.8878     | 1.04 ng     | 3.17 ng     |

**The usable quantitative window is 3.19–51 ng, about 1.2 logs.** Above 51 ng the
response saturates: a two-fold step from 204 to 408 ng returns only 1.25× rather than
2.00×, and fitting through the saturated points collapses R² to 0.89 while inflating
the LOD 2.5-fold. **Bands above ~51 ng on this system can be called present but not
quantified.**

**The matrix.** Over the matched range the haemolymph slope is 971 against 6,247 in
water: a **6.4× matrix penalty**, giving **LOD 3.1 ng and LOQ 9.5 ng per band in
crude haemolymph** `[CALC]`.

⚠ Two qualifications. Haemolymph signal as a fraction of water rises from 12.3% at
408 ng to 50.8% at 3.19 ng; a pure attenuation would be flat, and the rising trend
indicates an **additive pedestal of host nucleic acid** inflating the low-mass lanes.
The high-mass figures, implying a 5–8× penalty, are the more conservative reading.
Separately, the unspiked haemolymph lane integrates above every spiked haemolymph
lane, which is consistent with that pedestal but has not been independently
confirmed.

⚠ **σ was taken from two blank lanes only**, giving a relative standard error on σ of
roughly ±70%. These are factor-of-two estimates. Four or more blank lanes on
subsequent gels would halve that uncertainty at no cost, and is adopted as standing
practice.

### The correction: a signal fifty-seven-fold below its own mechanism

Converting at 381 kDa:

| Measured        | ng   | fmol     | against the published aptamer LOD of 62.5 fmol |
| --------------- | ---- | -------- | ---------------------------------------------- |
| Water LOD       | 0.42 | **1.10** | **57× below**                                  |
| Water LOQ       | 1.27 | 3.33     | 19× below                                      |
| Haemolymph LOD  | 3.13 | 8.22     | 7.6× below                                     |

The published in-gel detection limit for Mango-II on native gels is **62.5 fmol**
`[LIT]`, equal to **23.8 ng of this construct**. We detected bands at 1.1 fmol.
**A signal cannot be seen fifty-seven-fold below the detection limit of the mechanism
supposedly producing it.** The sensitivity is real; its source is intercalation.

⚠ **This supersedes the ~75 ng/band in-gel figure carried in two of our own project
documents**, which is 24× higher than the value measured here. That figure is
retired rather than reconciled.

We initially reported our water-series plate calibration as a successful Mango
calibration. **On re-analysis it was not measuring the aptamer.** TO1's dissociation
constant for duplex RNA is ~1–10 µM, and that run was performed at ~1 µM TO1-Biotin,
where dye intercalated along the duplex dominates the signal `[CALC]`. Intercalation
is rigorously linear in dsRNA mass. **R² = 0.9999 is exactly what a pure-intercalation
signal produces, so the quality of the line was evidence against the aptamer working,
not for it.** A third, independent confirmation: a Mango aptamer base-paired inside a
duplex does not fluoresce, with base-pairing reported to suppress signal 78–234-fold
`[LIT]`.

### Plate-reader performance: four runs, all four reported

Two produced usable curves and two did not. **The failures bound the conditions under
which the assay works.**

| Run        | Matrix     | Dye     | Buffer note       | Outcome                                                                                                                                                    |
| ---------- | ---------- | ------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 26 Aug     | haemolymph | 20 nM   | no Mg²⁺, no Tween | **No discrimination** between spiked and control                                                                                                           |
| 27 Aug     | water      | 20 nM   | as above          | **Compressed** — a ten-fold dilution series returned no ten-fold steps                                                                                     |
| **28 Aug** | water      | ~1 µM ⚠ | no Mg²⁺, no Tween | **Slope 4,952 RFU per ng/µL, R² = 0.9999** over 3.91–31.25 ng/µL. **LOD 0.23 ng/µL (0.64 nM), LOQ 0.69 ng/µL (1.94 nM).** Per-point CV **0.8–7.4%**        |
| 29 Aug     | water      | 125 nM  | 10 mM MgCl₂       | **Non-monotonic** — the 7.5 ng/µL point read below 3.75. CV to **105%**. LOD 1.3, LOQ 4.1 ng/µL                                                             |

⚠ The 28 Aug dye concentration is recorded as 1 µM, but 1 µL of a 10 µM working stock
into 20 µL gives 500 nM. The figure is reported as approximate.

**The 29 Aug result is the informative failure: six-fold worse than 28 Aug despite
eight-fold less dye.** Signal per ng varied 2.6-fold within a single run, which is a
preparation error rather than scatter. Ranked causes: auto-gain not locked between
runs, so the axis moves under the standards; dye adsorption to unpassivated plastic,
proportionally far worse at 125 nM than at 1 µM; and a ten-fold change in Mg²⁺.

**Observed limits fall 10–480× short of what dye background alone would permit**
(0.64 nM observed against 0.063 nM predicted at 1 µM; 3.8 nM against 0.008 nM at
125 nM). **The assay is therefore not background-limited — it is limited by replicate
scatter**: pipetting, plate position, folding efficiency and dye adsorption. That
diagnosis is what makes a capture-and-wash format the rational next step rather than
more dye optimisation.

The **0.8–7.4% CV from the 28 Aug run is our technical-variance yardstick**,
against which extraction and biological variance are judged.

### SYBR Gold

> **TODO —** A spiked-haemolymph dilution series stained with SYBR Gold has been run
> with two arms — proteinase K alone, and proteinase K with RNase T1 — plus a water
> control and both treated and untreated haemolymph blanks. **Densitometry awaits the
> lane masses.** Owed: SYBR Gold LOD and LOQ in water and in haemolymph, its matrix
> penalty, and the ±RNase T1 comparison, which reports what fraction of the stained
> material is nuclease-resistant duplex rather than single-stranded byproduct. Owner:
> measurement.

⚠ **No published or vendor detection limit for SYBR Gold on dsRNA appears to exist**
`[FLAG]` — the widely quoted 25 pg figure is a dsDNA value, and the manufacturer
recommends against SYBR Gold for dsRNA. If the measurement lands, it is the first
dsRNA figure for this stain on record.

⚠ **One claim is held pending that data.** The in-gel limit measured for TO1-Biotin,
0.42 ng in water, **is not worse than SYBR Gold's quoted dsDNA-derived range of
0.1–1 ng**. Until the gel is quantified, we make no claim that Mango is less
sensitive in gel: the sensitivity argument rests on the plate reader, and the gel
argument rests on specificity and cost.

### The verdict

| Chemistry                   | LOD per band                                        | Cost          | Sequence-specific in practice   | Reports integrity        |
| --------------------------- | --------------------------------------------------- | ------------- | ------------------------------- | ------------------------ |
| **TO1-Biotin, in gel**      | **0.42 ng water / 3.1 ng haemolymph** (measured)    | **$7.50/bath** | **No** — untagged and ladder both stain | **Yes** — size-resolved |
| **SYBR Gold, in gel**       | pending                                             | ~£1/bath      | No                              | **Yes** — size-resolved  |
| TO1-Biotin, plate reader    | 0.23 ng/µL (0.64 nM)                                | —             | No                              | No                       |
| QuantiFluor RNA, solution   | 0.5 ng/mL                                           | ~$0.25/assay  | No                              | No                       |
| _RT-qPCR_                   | _single copy_                                       | _~£2/reaction_ | **Yes**                        | **No**                   |

The final column is why no row dominates: **the only readouts that report integrity
are the two that cannot report sequence, and the only readout that reports sequence
cannot report integrity.** No single method answers the question. Our approach is to
run two that fail differently and require them to agree.

**The conclusion is not that the chemistry fails. It is that the chemistry works and
the tag does not.** TO1-Biotin is a capable non-specific nucleic acid stain — 0.42 ng
in gel is a respectable limit. What it is not is sequence-specific, which was the
entire reason for choosing it over a cheaper intercalator. **Roughly seven times the
cost of SYBR Gold is being paid for a property the untagged control and the ladder
show is absent.**

**Mango is accordingly demoted from quantifier to selector**, the outcome of a
decision gate written down before the data existed. The gel chemistries are retained
for what they are good for: confirming that material of the right size is present, at
about £1 and 90 minutes with no reverse-transcription step.

## The matrix: what bee haemolymph does to an optical readout

Every optical readout has to survive being put into bee haemolymph. Two properties
could plausibly destroy it: background absorbance and fluorescence in the Mango
excitation and emission bands, and the melanisation that begins the moment haemolymph
leaves the animal. **Neither has been characterised for _Apis mellifera_ in published
literature, so we measured both.**

### Is the matrix actually a problem?

**Setup.** Haemolymph was collected from five adult workers (H1–H5) and read neat at
507 and 535 nm, the excitation and emission maxima relevant to Mango/TO1-Biotin. A
twofold-to-tenfold dilution series in nuclease-free water was run alongside, four
replicates per level.

**Result: the dilution series does not behave like a dilution series** `[CALC]`.

| % neat | Fold | Mean A₅₀₇ | SD     | Predicted if signal were real | Observed / predicted |
| ------ | ---- | --------- | ------ | ----------------------------- | -------------------- |
| 100    | 1×   | 0.0343    | 0.0045 | 0.0343                        | 1.00×                |
| 50     | 2×   | 0.0262    | 0.0123 | 0.0171                        | 1.53×                |
| 20     | 5×   | 0.0295    | 0.0113 | 0.0069                        | 4.31×                |
| 10     | 10×  | 0.0348    | 0.0161 | 0.0034                        | **10.15×**           |

A linear fit returns **A₅₀₇ = 1.25 × 10⁻⁵ · (% neat) + 0.0306, R² = 0.0013**. A
genuinely dilutable absorbance would carry a slope of 3.43 × 10⁻⁴; the observed slope
is **4% of that and indistinguishable from zero.** Diluting the sample tenfold
changed nothing.

The remaining readings are consistent with that interpretation. All sixteen dilution
readings fall between 0.006 and 0.055; H1–H5 fall between 0.020 and 0.042. **Every
value in the dataset lies inside the blank-to-blank reproducibility the instrument
manufacturer specifies (≤0.04 A at 10 mm equivalent)** `[LIT]`. One pooled replicate
returns A₅₃₅ (0.045) above A₅₀₇ (0.039), a ratio of 1.15, which no pigment produces
and which is a straightforward signature of reading noise rather than sample.

**Absorbance at 507 nm, 0.0298, is below what this instrument can resolve.** The
dilution series was run to characterise the matrix and instead characterised the
detection limit, which answers the operational question more decisively than the
original design would have.

**The operational consequence.** For 20 µL in a
standard 96-well plate the liquid column is 0.625 mm, so A_well = A_NanoDrop ×
(0.625 mm / 10 mm) = 0.0298 × 0.0625 = **0.00186** `[CALC]`. Against the 0.434
threshold — the absorbance at which the function A·10⁻ᴬ is maximal, above which
diluting improves rather than degrades a measurement — that is **233× below the point
at which dilution starts to help.** Taking the upper bound of the observed spread
moves this only to ~126×. **Diluting crude bee haemolymph to reduce optical
interference costs signal and buys nothing**, a conclusion that holds whether the
readings represent real absorbance or instrument noise, because both are far below
the threshold.

### Which fluorophores could interfere, and why none of them do

This argument is built from published photophysical constants rather than from the
readings above, so it is unaffected by the resolution limit.

| Fluorophore | Ex / Em (nm)                  | Contribution at 510 nm excitation                                                        |
| ----------- | ----------------------------- | ---------------------------------------------------------------------------------------- |
| Riboflavin  | 445–450 / 520–532, Φ = 0.26   | Excitation at 510 nm is **≤1% of peak**; a 20 nm FWHM bandpass raises this to 2–8%        |
| NAD(P)H     | 340 / 460                     | None                                                                                       |
| Tryptophan  | 280 / 340                     | None                                                                                       |
| Melanin     | broad, Φ ≈ 10⁻⁴               | ~5,000× dimmer per photon than Mango-III (Φ = 0.56), **negligible as an emitter**          |

**Riboflavin is the only credible interferent**, and the mitigation is
counter-intuitive: because its excitation tail rises steeply toward shorter
wavelengths, **narrowing** the excitation bandpass reduces matrix background more
effectively than widening it to gain signal.

**Melanin should be designed around as an absorber, not as an emitter.** Its relative
absorption coefficients are 0.58 at 510 nm and 0.44 at 535 nm, so it attenuates both
the excitation and the emission path — a double inner-filter effect — while
contributing essentially no photons of its own.

### Melanisation kinetics

**Setup.** Haemolymph was taken from three adult workers (samples 10, 19 and 38),
drawn from a single box holding frames from several hives; hives of origin were not
controlled and the three are **not guaranteed to be from different colonies**. These
are different animals from H1–H5. A₅₀₇ and A₅₃₅ were read at 0, 5, 10, 15 and 20
minutes.

| Sample | A₅₀₇ t0 | A₅₀₇ t20 | Late slope (A·min⁻¹) | A₅₃₅/A₅₀₇ at t0 | at t20 |
| ------ | ------- | -------- | -------------------- | --------------- | ------ |
| 10     | 0.073   | 0.273    | **0.0166**           | 0.493           | 0.872  |
| 19     | 0.030   | 0.042    | **−0.0008**          | 0.567           | 0.905  |
| 38     | 0.060   | 0.337    | **0.0252**           | 0.617           | 0.979  |

**What the data supports.** A **lag of 5–10 minutes**, with a dip at t = 5 in both
trending samples, followed by acceleration. The late slope is 1.7–1.8× the mean slope
in both, so the process is **accelerating rather than first-order**, consistent with
autocatalytic quinone polymerisation. Two metrics are therefore reported: **lag time**
(the intercept of the 10–20 min tangent with the t = 0 baseline) and **late slope in
A₅₀₇·min⁻¹**.

**What the data does not support.** No sigmoid is fitted: twenty minutes is too short
to observe a plateau, so the top of any sigmoid would be unconstrained by data.
**Fold-rise is not used as a headline metric** either, because t = 0 varies 2.4-fold
across the three samples and is the lowest and noisiest reading in each trace.

**Sample 19 is reported, not averaged in and not discarded.** Its entire trace spans
0.030–0.050, inside the band identified above as the instrument's resolution limit.
It did not behave anomalously so much as **never produce enough signal to leave the
noise floor**.

**The spectral ratio problem, which is the limiting problem for this dataset.** If
the rising absorbance were melanin, the ratio A₅₃₅/A₅₀₇ should match melanin's
absorption spectrum. It does not.

| Source                                          | Predicted A₅₃₅/A₅₀₇ |
| ----------------------------------------------- | ------------------- |
| Melanin, λ^−3.48 (Jacques & McAuliffe 1991)     | **0.830**           |
| Rayleigh scatter, λ^−4                          | 0.807               |
| Large-particle (Mie) scatter                    | ~1.00, near-flat    |

**Melanin and Rayleigh scatter differ by 0.023 across this wavelength pair. They
cannot be told apart with two wavelengths 28 nm apart.** Observed ratios of
0.872–0.979 lie above both, which leaves large-particle scatter — coagulation and
aggregation — as the only candidate. Treating the signal as a two-component mixture,
with f = (r − r_mel) / (r_sc − r_mel) where r_mel = 0.830 and r_sc = 1.00:

| Sample | Observed _r_ at t20 | Scatter fraction _f_ |
| ------ | ------------------- | -------------------- |
| 10     | 0.872               | ~25%                 |
| 19     | 0.905               | ~44%                 |
| 38     | 0.979               | **~88%**             |

**The sample with the largest apparent melanisation carries the largest scatter
contribution.** Until a far-red baseline is subtracted, **none of these traces can be
attributed to melanin**, and the kinetic parameters above describe the combined
optical change on exposure to air rather than melanisation specifically.

### What the matrix work changed

**Phenylthiourea at 1 mg/mL in PBS on thawing.** PTU is a competitive phenoloxidase
inhibitor that chelates the dicopper active site, and has been validated on _Apis_
`[LIT]`. Prophenoloxidase has been reported to activate spontaneously during
haemolymph extraction itself `[LIT]`, so inhibition at the point of collection is
ideal rather than after samples are collected. **This conclusion was drawn after many
haemolymph samples had already been collected.**

**The proteinase K step is an incidental PTU substitute, and it is free.** The
65 °C / 15 min proteinase K treatment adopted to release dsRNA from its circulating
ribonucleoprotein also denatures prophenoloxidase. **One step both frees the dsRNA
and stops melanisation.** Any team running a proteinase K release step is already
suppressing melanisation whether or not that was the intention.

**TO3-Biotin: a cost hold with a written trigger.** TO3-Biotin (ex 637 / em 658,
Kd 1.4 ± 0.3 nM) would move detection clear of flavins, pterins and most melanin
absorbance in a single step. It is held rather than ordered for two stated reasons:
**$375 per 100 µL with a three-month shelf life**, and the available Typhoon's 488 nm
laser cannot excite it. **The trigger is explicit: order only if pre-stain
background exceeds ~30% of post-stain signal at the same spot.**

> **TODO —** Figure: "The dilution that wasn't." A₅₀₇ against % neat haemolymph, all sixteen
> replicates as points, the fitted line (slope ≈ 0) against the dashed line a real
> signal would have followed, and the manufacturer's ≤0.04 A blank band shaded across
> the plot. One glance shows every point inside the band.

> **TODO —** Figure: The dilution-threshold plot. Measured A_eff against the 0.434
> threshold on a log axis, with the 233× gap annotated.

> **TODO —** Figure: Melanisation time course. A₅₀₇ against time, three samples, sample 19
> in grey and labelled as not having left the noise floor, with the lag and the
> 10–20 min tangent drawn on.

> **TODO —** Figure: What is actually being measured. A₅₃₅/A₅₀₇ against time for all three
> samples, with reference lines at 0.830 (melanin), 0.807 (Rayleigh) and 1.00
> (large-particle scatter). The melanin and Rayleigh lines nearly coincide, which is
> the point.

## Sample preparation: proteinase K is not optional

Ingested dsRNA does not circulate naked. In bee haemolymph it circulates as a
ribonucleoprotein complex (Maori et al. 2019, _Cell Reports_ 27:1949) `[LIT]`.
Any assay that reads free duplex — intercalating stain, aptamer, capture — is
reading a molecule that is already bound to something. **Proteinase K digestion
of crude haemolymph before the read is therefore mandatory, not a clean-up
nicety.**

What happens without it is measurable. Adult haemolymph runs at 12.3–32.4 mg/mL
protein `[LIT]`, so an 8 µL lane carries **98–536 µg of protein against 0.408 µg of
dsRNA** — 240:1 by mass at the top of our standard series and rising past 30,000:1 at
the bottom `[CALC]`. We had run an unintentional EMSA with the bee proteome as the
shift partner. The diagnostic detail matters: **the band stayed at the correct
migration position**, so this is retention, not degradation. Degradation gives a
downward smear.

## Orthogonal validation

### NanoDrop against Qubit, eight preparations

**Status: Demonstrated.** Across **8 independent preparations, 3 constructs and
5 dates**, a DNase I + RNase T1 digestion removed 48% of the A260 signal every
time: **N₁/N₀ = 52.1% ± 4.2%** `[CALC]`. The low scatter across independent
preparations is itself the repeatability evidence, and it is why the digest, not
the raw NanoDrop reading, defines every dose in this project.

> **TODO —** Table: The eight preparations, one row each: date, construct, N₀
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
recorded at cycle 2.6.

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
reasoning at cycle 4.4.

## Controls

| Control                                        | Status                                               |
| ---------------------------------------------- | ------------------------------------------------------ |
| Untagged dsRNA, same length and mass           | **Run, and it is the decisive result above**          |
| Commercial ladder stained alone                | **Run.** It stains, and it carries no aptamer         |
| Dye/reagent blank                              | Run, and the basis of the LOD/LOQ figures above       |
| Matrix blank (unspiked haemolymph)             | Run                                                   |
| No-template and no-RT controls (RT-qPCR)       | Run; see the contamination diagnostic at cycle 3.3b   |
| Positive control at known concentration        | Run, from digest-Qubit-quantified IVT stock           |
| Untagged dsRNA under streptavidin capture      | **Never run.** The capture format depends on it       |
| Spike-recovery into crude matrix, n ≥ 6        | **Never run.** The largest remaining hole             |

> **TODO —** The capture-format control: does streptavidin also capture dsRNA
> carrying intercalated TO1-Biotin? This is Prof. Unrau's own question back to us,
> and every claim made for the capture assay at cycle 4.2 is contingent on it.
> Owner: wet lab. Hours, not weeks.

## Limits of detection and quantification

| Condition                                  | LOD             | LOQ            |
| ------------------------------------------ | --------------- | -------------- |
| Plate reader, water, ~1 µM dye (28 Aug)    | 0.23 ng/µL      | 0.69 ng/µL     |
| Plate reader, water, 125 nM dye (29 Aug)   | ~1.3 ng/µL      | ~4.1 ng/µL     |
| In-gel, water series, 3.19–51 ng window    | **0.42 ng/band** | 1.27 ng/band  |
| In-gel, haemolymph-spiked series           | **3.1 ng/band** | 9.5 ng/band    |
| Crude haemolymph, plate reader             | not determined  | not determined |

All LOD/LOQ values are 3.3σ/S and 10σ/S respectively `[CALC]`. **These figures
describe the dye's response to duplex mass, not the aptamer's response to our tag.**
As an intercalation calibration they remain usable.

## Repeatability

- Within-run, 28 Aug plate: CVs **0.8–7.4%** across triplicates `[CALC]`.
- Between preparations, digest-Qubit: **N₁/N₀ = 52.1% ± 4.2%** across 8
  preparations, 3 constructs and 5 dates `[CALC]`. This is our strongest
  repeatability evidence, deliberately across operators and days rather than
  within one plate.
- Between runs, plate reader: **poor, and quantified as such.** The 28 and 29 Aug
  runs differ in LOD by roughly sixfold. Run-to-run comparability requires locked
  gain, Tween-20 and a fresh standard series on every plate.
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

> **TODO —** The method-selection tree should open one branch earlier than
> currently drafted. Its first node is not _do you need sequence specificity?_ but
> **do you need to know the molecule is intact, or only that the sequence is
> present?** — _sequence present_ routes to RT-qPCR and stops; _intact molecule_
> continues into the optical branch. A tree that routes some readers away from this
> project's own methods is more credible than one that routes everyone towards them.

Working versions are on [experiments and lab book](/wet-lab-experiments); the reusable
summaries belong to [Contribution](/contribution).

> **TODO —** PDF: The dsRNA quantification protocol plus the analysis spreadsheet,
> uploaded to `static.igem.wiki` and linked here. This pair is the Measurement
> deliverable. Owner: measurement.

## Limitations

- **Mango signal is not proof of an intact molecule.** A folded aptamer reports
  that a quadruplex is present, not that the construct survived around it. Only a
  size-resolved read does that, which is why the gel channel exists.
- **No Mango measurement on this wiki can be attributed to the aptamer** rather than
  to intercalation. The tagged/untagged control and the stained ladder both say so.
- **No matrix-matched calibration exists.** Every calibration above is in water;
  the matrix penalty is characterised but not corrected for.
- **RT-qPCR is not yet MIQE-validated**, so the orthogonal reference is a method
  under development rather than an anchor.
- **The in-gel and plate-reader routes have not been cross-compared** on the same
  material on the same day.
- **The melanisation traces cannot yet be attributed to melanin**, because no far-red
  baseline was subtracted.

## What remains feasible by 21 October

| #   | Experiment                                                                                                                     | Feasible?                                |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 1   | **Untagged-dsRNA control under capture** — does streptavidin also capture dsRNA carrying intercalated TO1-Biotin? Never run; the capture assay depends on it | Yes — hours                              |
| 2   | **Streptavidin capture + K⁺ wash** (never Na⁺ — Mango is a G-quadruplex). Turns a failed homogeneous assay into a capture format that removes both failure modes: the matrix is washed away and weak intercalation washes off | Yes — days                               |
| 3   | **Matrix-matched calibration + spike-recovery in crude haemolymph, n ≥ 6** — gives LOD/LOQ and matrix recovery on one plate     | Yes — the highest-value single experiment |
| 4   | **RT-qPCR standard curve to MIQE minimums** (efficiency, slope, R², melt, no-RT)                                               | Yes — ~2 days, and mandatory              |
| 5   | **Mango on both ends + exonuclease + wash**, so only the quadruplex survives and signal-to-background rises                    | Yes — 1–2 gels                            |
| 6   | **Gel 1 lane masses plus a one-lane registration check** — unblocks the SYBR Gold LOD/LOQ, the ±RNase arm and the comparison table | Yes                                    |
| 7   | **A photograph of the Mango-against-untagged gel and the ladder gel** — both are cited above and neither is shown              | Required — unshown figures count as unmet |
| 8   | **6× Mango array** for single-molecule sensitivity                                                                             | At risk — IDT synthesis wall; write up as designed-not-built |

## What this changed in NECTAR

Every µg-per-bee figure in this project is **re-derived from digest-Qubit** rather
than NanoDrop. Mango was reassigned from quantifier to selector, which freed the
mass measurement to move to a generic stain and the quantitative numbers to move
to RT-qPCR. The matrix work turned "crude haemolymph, no purification" from a design
goal into **a measured 6.4× in-gel penalty** with a named route around it — capture
and wash rather than a homogeneous read — and it showed that the obvious mitigation,
dilution, is 233× the wrong side of the point where dilution helps.

## Where this connects

[Results](/results) · [Bee lab](/bee-lab) · [Wet lab](/wet-lab) ·
[Experiments and lab book](/wet-lab-experiments) · [Parts](/parts) ·
[Contribution](/contribution) · [Engineering](/engineering)
