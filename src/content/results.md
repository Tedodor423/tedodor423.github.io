[Engineering](/engineering) explains how we made decisions. This page sets out
what is solid, what is provisional, and what did not work.

## How to read a result on this page

Every headline result, including every failed one, uses the same eight fields in
the same order: **Question · Experiment · Evidence · Controls + n · Result ·
Interpretation · Limitation · What it changed.**

Each result carries one of the wiki's four status labels — **Demonstrated**,
**Investigated**, **Modelled**, **Proposed** — and the wiki's citation tags:
`[LIT]` from a source we read, `[CALC]` our own arithmetic with the assumptions
stated, `[FLAG]` unverified and never stated as fact.

## Two caveats that apply to every mass figure below

> **TODO —** Re-quantify all four annealed stocks by digest-Qubit before any
> µg-per-bee figure is published anywhere on this wiki. Doses on this page are
> the nominal mass fed; the digest-corrected mass is lower, by roughly the factor
> in the NanoDrop result below. Owner: wet lab.

> **TODO —** Re-analyse gel SYBE 01 from a 16-bit TIFF. The band intensities
> currently in hand were read off an 8-bit JPEG, which clips and quantises the
> exact range a densitometry number comes from. Owner: measurement.

## Making the molecule

### Overnight transcription roughly doubles IVT yield

**Status: Demonstrated.**

**Question.** Is a 2 h _in vitro_ transcription long enough to supply a feeding
assay?

**Experiment.** T7 transcription of the GFP length series, 2 h against overnight
incubation, yield read on the same instrument.

**Evidence.**

> **TODO —** Figure: Yield per reaction, 2 h against overnight, one point per
> preparation, constructs distinguished by marker. Axis in ng/µL post-digest, not
> raw NanoDrop.

**Controls + n.** Not run as a controlled side-by-side series. The comparison is
across routine production runs on the same constructs and kit.

**Result.** 2 h is insufficient; overnight incubation **approximately doubles yield**.

**Interpretation.** IVT time, not template mass, was the binding constraint on how
many bees we could dose in a session.

**Limitation.** No paired n, no replicate statistics. This is a production
observation we act on, **not a measured rate**.

**What it changed.** Overnight became the standard IVT. See
[cycle 2.1](/engineering#cycle-2-1).

### NanoDrop over-reads dsRNA by about 1.9×

**Status: Demonstrated.**

**Question.** NanoDrop and Qubit disagree about our dsRNA concentration. What
should we report as a dose?

**Experiment.** Digest each preparation with DNase I and RNase T1, so that only
duplex survives, and re-read A260.

**Evidence.**

> **TODO —** Figure: Post-digest over pre-digest A260 for each of the eight
> preparations, plotted against pre-digest value, with the 52.1% mean drawn as a
> line. The point of the figure is the flatness, not the mean.

**Controls + n.** Eight independent preparations, three constructs, five dates.
Water-plus-nuclease blank, and a DNase + RNase A low-salt arm expected to go to
near zero.

**Result.** Digestion removes 48% of the A260 signal every time: N₁/N₀ = 52.1% ±
4.2% `[CALC]`. An uncorrected NanoDrop reading therefore over-states intact duplex
by about **1.9×** `[CALC]`.

**Interpretation.** A260 counts leftover NTPs and single-stranded RNA as if they
were product. The digest, **not a fixed correction factor**, is what transfers: the
raw NanoDrop-to-Qubit ratio runs from 3.3× to 18.2× across our preparations.

**Limitation.** RNase T1 leaves mononucleotides that still absorb at 260 nm but
are invisible to Qubit, so an N₁ read without post-digest cleanup partly counts
the debris of what was just destroyed.

**What it changed.** Every µg-per-bee figure is re-derived from digest-Qubit. See
[cycle 2.6](/engineering#cycle-2-6).

## Measuring it in bee material

### Five extraction methods, no winner

**Status: Demonstrated, as a null.**

**Question.** Which RNA extraction method recovers most from dosed larvae?

**Experiment.** Five methods on 5th-instar larvae fed 1 µg dsRNA: liquid nitrogen
grinding, the standard protocol, DTT addition, a 40 min extended Vezol
incubation, and a spin-down after Vezol addition.

**Evidence.**

> **TODO —** Figure: Yield and A260/230 for all five methods, same larvae, same day
> (29 Jul), points not bars, so the overlap is visible.

**Controls + n.** All five arms from the same pooled larval material on one day.

**Result.** All five gave comparable yields. **No method was better**. All five also
gave very low A260/230, traced to residual ethanol and fixed by using 1× volume
ethanol instead of 0.5×, a dry spin after the ethanol has passed the column, and
leaving the lid open until the ethanol has evaporated.

**Interpretation.** Effort spent choosing between homogenisation variants is
wasted effort. The purity problem was a wash-step problem, **not a method problem**.

**Limitation.** Total RNA by NanoDrop, not dsRNA-specific recovery. A method could
give identical total RNA and different duplex recovery; spike-recovery is the
missing control.

**What it changed.** We stopped optimising homogenisation and chose on variance
instead. Published as a null because it saves a future team a week. See
[cycle 3.1](/engineering#cycle-3-1).

### Silica column beats phenol-chloroform on variance, not on yield

**Status: Demonstrated.**

**Question.** Which purification gives the most reliable input for qPCR?

**Experiment.** Larvae flash-frozen in liquid nitrogen and homogenised, five
larvae pooled to ~100 µL each, split into eight aliquots of ~60 µL, then processed
by TRIzol/phenol-chloroform or by a silica-bead column kit. Concentration and
ratios by NanoDrop.

**Evidence.**

| Method                | Mean concentration (ng/µL) | SD (ng/µL) | CV (%) |
| --------------------- | -------------------------- | ---------- | ------ |
| Phenol-chloroform     | 1255.15                    | 344.04     | 27.41  |
| Silica beads (column) | 261.33                     | 48.24      | 18.46  |

**Controls + n.** Aliquots of one pooled homogenate, so biological variation is
removed and what is left is method variation. Phenol-chloroform n = 8, column
n = 7.

**Result.** Phenol-chloroform yields **roughly 4.8× more total RNA** and is
half again as variable. TRIzol A260/230 ran 0.51–0.88, which is guanidine and
phenol carryover and a qPCR inhibition risk.

**Interpretation.** For qPCR, **reproducibility is worth more than yield**. The
TRIzol variance is structural: five operator-dependent steps stack, and the manual
specifies the aqueous-phase transfer only as "angling the tube at 45°".

**Limitation.** One pooled sample, one day, one operator pair. Total RNA, not
duplex recovery.

**What it changed.** Column extraction became standard for everything feeding
qPCR. See [cycle 3.1](/engineering#cycle-3-1).

### Mango calibrates in water, and the second run shows how easily it does not

**Status: Investigated.**

**Question.** Can a Mango-tagged construct report its own concentration on a plate
reader?

**Experiment.** Dilution series of Mango-tagged dsRNA in water and in spiked adult
haemolymph, incubated with folding buffer and TO1-biotin, read on a plate reader.

**Evidence.**

> **TODO —** Figure: Both runs on one axis: run 1 linear fit with its residuals, run 2
> plotted as measured to show the non-monotonicity. Blanks shown, not subtracted
> silently.

**Controls + n.** Triplicates throughout, water blanks, unspiked haemolymph
control.

**Result.** Run 1 in water: slope 4,952 RFU per ng/µL, R² = 0.9999, CVs 0.8–7.4%,
LOD 0.23 ng/µL, LOQ 0.69 ng/µL `[CALC]`. Run 2, at 125 nM dye with the plate
reader's auto-gain left unlocked and no Tween-20, was non-monotonic and degraded
LOD to ≈ 1.3 and LOQ to ≈ 4.1 ng/µL. In spiked crude haemolymph there was no
significant difference between spiked samples and the unspiked control.

**Interpretation.** The calibration is real arithmetic on real fluorescence, but
run 1 was almost certainly measuring TO1 intercalated along the duplex rather than
the aptamer — a perfect line is **what pure intercalation produces**.

**Limitation.** The untagged-dsRNA control that would separate aptamer signal from
intercalation **has never been run**, and the whole assay depends on it.

**What it changed.** Mango was demoted from quantifier to selector. See
[cycle 4.1](/engineering#cycle-4-1).

**The untagged-dsRNA control has since been run, and it is decisive.** Tagged and
untagged constructs stain indistinguishably, and a commercial ladder carrying no
aptamer stains as well. No number on this page can be attributed to aptamer signal
rather than intercalation; the LOD and LOQ stand as **an intercalation calibration**,
which is still usable, and not as a measurement of the tag. Full working on
[measurement](/measurement).

> **TODO —** The one control still outstanding is the capture-format version: does
> streptavidin also capture dsRNA carrying intercalated TO1-Biotin? Every claim made
> for the capture assay at [cycle 4.2](/engineering#cycle-4-2) depends on it.
> Owner: wet lab.

### In-gel detection loses 6.4× to the haemolymph matrix, and the signal is not the aptamer

**Status: Investigated.**

**Question.** Does resolving the tagged construct on a gel escape the background
that defeats the plate reader?

**Experiment.** A 592 bp Mango construct loaded as an eight-point two-fold series
from 408 ng to 3.19 ng, in parallel in nuclease-free water and in crude haemolymph,
on one gel, post-stained with TO1-Biotin. Densitometry by fixed-width lane
integration.

**Evidence.**

> **TODO —** Figure: The two series side by side, water and haemolymph, with the
> faintest visible band on each marked and the ladder lane included, since the
> ladder staining is itself part of the result.

**Controls + n.** Twenty lanes: ladder, unspiked haemolymph, eight water, two
controls, eight haemolymph. Blank σ taken from two lanes only.

**Result.** Over the usable 3.19–51 ng window the water series gives **LOD 0.42 ng
and LOQ 1.27 ng per band (slope 7,273, R² = 0.9983)**. In haemolymph the slope falls
to 971 against 6,247, a **6.4× matrix penalty**, giving **LOD 3.1 ng and LOQ 9.5 ng**
`[CALC]`. Above 51 ng the response saturates and bands can be called present but not
quantified. **The dsDNA ladder stained too**, and it carries no aptamer at any
position.

**Interpretation.** Two things at once. The matrix costs 6.4×, so any assay that does
not remove the haemolymph before reading pays that penalty. And the detection limit
of 0.42 ng is **1.10 fmol of this construct, 57× below the published 62.5 fmol in-gel
limit for Mango-II itself** — a signal cannot be seen fifty-seven-fold below the
detection limit of the mechanism supposedly producing it. What is being detected is
intercalation, not the tag.

**Limitation.** σ from two blank lanes gives roughly ±70% relative standard error on
the limits, so these are factor-of-two estimates. Haemolymph signal as a fraction of
water rises at low mass, indicating an additive pedestal of host nucleic acid; the
high-mass reading, a 5–8× penalty, is the more conservative one. Read from an 8-bit
JPEG; see the TIFF caveat at the top of this page.

⚠ These figures **supersede the ~3–6 ng / ~50–100 ng per band and 10–30× matrix
penalty** this page previously carried, and the ~75 ng/band figure in two of our own
project documents.

**What it changed.** Method development moved to washing the matrix away before
reading, rather than reading through it. See
[cycle 4.2](/engineering#cycle-4-2).

> **TODO —** SYBR Gold LOD and LOQ in haemolymph. Two protocols are written and
> neither has been run, so this wiki carries no SYBR dsRNA detection limit. The
> widely quoted 25 pg figure is dsDNA and is not ours to cite. Owner: wet lab.
> See [cycle 4.3](/engineering#cycle-4-3).

> **TODO —** Haemolymph matrix characterisation: absorption spectrum across the
> Mango excitation and emission range, and rate of melanisation with time after
> extraction. Measured, not yet written up. Owner: measurement.

> **TODO —** RNA measurements in larvae, as a number rather than a band. This is
> now a stated goal of the measurement workstream alongside adult haemolymph, and
> nothing on this wiki quantifies dsRNA in larval material — the larval result
> below is detection only. Owner: wet lab with measurement.

## Delivering it to bees

### Intact dsRNA recovered from larvae and larval haemolymph 24 h after a 1 µg dose

**Status: Demonstrated, qualitatively.**

**Question.** After a larva eats our dsRNA, can we get it back intact?

**Experiment.** 5th-instar larvae spiked in-frame with 1 µg dsRNA and returned to
the hive. Whole larvae and larval haemolymph collected at 24 h, column-extracted,
flash-denatured, reverse-transcribed and amplified with construct-specific primers
across the 300/500/700 bp series.

**Evidence.**

> **TODO —** Figure: The 4–5 Aug gel, uncropped, with lane labels: dosed larvae, undosed
> larvae from the same frame, water-plus-primer no-template control, ladder. All
> three expected band sizes visible in the dosed lanes.

**Controls + n.** Undosed larvae from the same frame and water-plus-primer
no-template controls, on the same gel. Whole larvae 4 Aug: two samples, both
positive. Larval haemolymph 5 Aug: controls on the same gel; per-sample n not
recorded in the journal.

**Result.** Whole larvae gave bands at all three expected sizes, in good quantity,
**24 h after dosing** (4 Aug). Larval haemolymph gave intact bands at 24 h, with
undosed and water controls clean on the same gel (5 Aug).

**Interpretation.** Ingested dsRNA crosses the larval gut, reaches the haemolymph,
and survives at least 24 h at all three lengths. This is the result the whole
delivery argument rests on.

**Limitation.** An endpoint RT-PCR gel is presence or absence. Band intensity is
not concentration, and **no length-dependence claim follows from it**.

**What it changed.** Detection worked, so every later measurement cycle is an
attempt to put a number on it. See [cycle 3.2](/engineering#cycle-3-2).

### A ~700 bp band from adult haemolymph at 3 h

**Status: Investigated. Caveated.**

**Question.** Does the same recovery work in adult bees?

**Experiment.** Adults PER-fed a known dose, haemolymph extracted by the
centrifugal method at 3 h, RT-PCR and gel.

**Evidence.**

> **TODO —** Figure: The 12 Aug gel, with the contemporaneous water control lane shown
> rather than omitted, because the caveat below is visible in it.

**Controls + n.** Water no-template control on the same gel; n not recorded.

**Result.** A ~700 bp band was recovered from adult haemolymph at 3 h (12 Aug).

**Interpretation.** Consistent with the larval result, and no more than that.

**Limitation.** This gel predates the contamination fix of 11 Aug only by a day,
and the reagent-borne template contamination diagnosed in
[cycle 3.3b](/engineering#cycle-3-3b) had been producing bands in water controls
through that period. **We do not treat this band as clean evidence** and it is
reported with the DNA-contamination caveat attached.

**What it changed.** All pre-fix qPCR and RT-PCR data carries the caveat, and the
adult assay is queued for a repeat. See
[cycle 3.3b](/engineering#cycle-3-3b).

### Newly emerged bees take less, but they survive the day

**Status: Demonstrated, as a method decision.**

**Question.** Which bees should a proboscis-extension feeding assay use?

**Experiment.** PER feeding of harnessed foragers, then of newly emerged bees,
scoring uptake volume and survival to the end of the day.

**Evidence.**

> **TODO —** Figure: A harnessed bee taking a droplet from the syringe, and the two
> uptake ranges plotted against survival, so the trade-off is one image.

**Controls + n.** Foragers n = 50. Newly emerged bees: uptake range recorded
across the pilot sessions; per-session n not separately logged.

**Result.** Foragers took up to ~30 µL but only **22 of 50 survived the day**.
Newly emerged bees are calm, harness easily and take a controlled 5–10 µL.

**Interpretation.** A larger dose delivered to an animal that dies before the
timepoint is not a larger dose. Volume was **the wrong thing to maximise**.

**Limitation.** Survival was scored to end of day, not to each timepoint, and the
forager cohort was caught rather than age-matched.

**What it changed.** Newly emerged bees became standard for every dosing
experiment on this project, and the dose was delivered as 2 × 2.5 µL to hold the
volume accurate. See [cycle B1](/engineering#cycle-b1).

### Background mortality over a weekend is low

**Status: Demonstrated.**

**Question.** How many caged bees die anyway, with no treatment?

**Experiment.** Three cage boxes of bees held over a weekend on the 1 M sucrose
and NaCl tolerance setup, dead bees counted at the solution change.

**Evidence.**

> **TODO —** Table: Deaths per box against box size and salt concentration, once the
> per-box assignment is confirmed from the journal.

**Controls + n.** Three boxes, 46 bees total (20 Jul).

**Result.** 0/15, 1/16 and 2/15 deaths — three deaths in 46 bees over a weekend.

**Interpretation.** Caging and the sucrose diet are not, by themselves, killing
bees. Any treatment mortality has to be read against **roughly 6% background** over
that window.

**Limitation.** One weekend, three boxes, and the journal does not record which
box carried which NaCl concentration, so this is a background-mortality figure and
not a salt-tolerance comparison.

**What it changed.** Gave the survival assays a baseline to be read against. See
[cycle B1](/engineering#cycle-b1).

## Reaching the mite

### Mites do not survive in the lab without a host, and the soak is not what kills them

**Status: Investigated. A negative.**

**Question.** Can _Varroa_ be kept alive long enough to dose and score?

**Experiment.** Mites collected by sugar shake, soaked 6 h in 0.9% NaCl or left
unsoaked, then housed four ways: in capped cells in-frame, on white-eyed pupae in
cellulose capsules, on 5th-instar larvae in capsules, or alone in a capsule.
Survival scored at the 3-day checkpoint (7–8 Sep).

**Evidence.**

> **TODO —** Figure: Survival by housing method as a bar of counts, not percentages,
> with the denominators printed on each bar. Small n is the point, not something
> to hide.

**Controls + n.** Soaked-alone (n = 9) and unsoaked-alone (n = 9) are the two
control arms. With a host: in-frame n = 10, white-eyed pupae n = 5, larvae n = 5.

**Result.** With a host, 9 of 20 mites survived (45%): 4/10 in-frame, 3/5 on
white-eyed pupae, 2/5 on larvae. Alone, 0 of 18 survived (0%). Fisher exact test,
host against no host: **p = 0.0013** `[CALC]`. Comparing the two alone arms
isolates the soak: soaked 0/9 against unsoaked 0/9, **p = 1.0** `[CALC]` — the
soak is exonerated. An earlier pilot (3–4 Sep) gave 35.7% survival for soaked
mites on pupae across 10 replicates, with the no-pupa and unsoaked arms near zero.

**Interpretation.** A host is required; the 6 h soak is **not the cause of death**.
That matters, because the dosing route we need is a soak.

**Limitation.** Small n in every arm, mites fell off pupae in the earlier pilot,
and survival was scored by movement, not by feeding.

**What it changed.** Husbandry was redesigned around larvae in-frame rather than
capsules, and the efficacy screen's primary endpoint moved from mortality to
molecular knockdown, which can be measured on the mites we can keep alive. See
[cycle V1](/engineering#cycle-v1).

### Soaking mites in dsRNA gives a dose-response in mortality

**Status: Investigated. Our first efficacy signal, on a method we then abandoned.**

**Question.** Does our vdCHIB target increase mite mortality relative to a saline
control?

**Experiment.** Mites soaked in 0.9% NaCl containing a low or a high concentration of
our 700 bp vdCHIB dsRNA, or in saline alone, then inserted individually into capped
larval cells and incubated for 24 h.

**Controls + n.** Saline-only control n = 40; low concentration n = 70; high n = 65.
Sample sizes were not equalised, because mite survival through each soak varied.

**Result.** Mortality rose with dose: **42.5% control (17/40), 55.7% low (39/70),
72.3% high (47/65)**. Cochran–Armitage trend test, **Z = 3.08, p = 0.002** `[CALC]`.
In pairwise Fisher's exact tests with a corrected threshold of 0.0167, **only the
high-against-control comparison held up**.

**Interpretation.** There is statistically significant evidence of a dose-response,
and high concentration is confidently distinguishable from control. The difference
between high and low is consistent with the trend but **not independently confirmed**.

**Limitation.** Only about 20% of mites survived the 6 h soak, and soaked mites
sometimes reproduced in the cell, leaving unexposed offspring scored alongside the
treated mother. **The dsRNA concentrations are not recorded as numbers anywhere in
our own record**, so the dose-response cannot yet be reproduced.

**What it changed.** It justified abandoning the soak and delivering dsRNA through
the host instead. See [cycle V2](/engineering#cycle-v2).

### Feeding the larval host did not kill mites, and showed why

**Status: Investigated. A clear negative, with the confound identified.**

**Question.** Does dsRNA delivered through a dosed larva kill the mite that feeds on
it, and does our pipeline's top-ranked target outperform its lowest-ranked one?

**Experiment.** Forty 5th-instar larvae per group, 240 in total, each fed 20 µL.
Groups: BEST and WORST targets at 50 ng/µL and 5 ng/µL, plus 50 ng/µL dsGFP and 1 M
sucrose as negative controls. After 24 h, once cells were capped, one mite was
introduced per cell and left to feed for 96 h, then every cell was uncapped and its
mites scored.

**Controls + n.** dsGFP at 50 ng/µL and sucrose-only, 40 larvae each. Only **14–27
mites were scored per group**.

**Result.** **No dsRNA group killed more mites than the controls.** The six groups
differed overall (chi-square, **p = 0.002**), driven almost entirely by BEST
50 ng/µL showing _lower_ mortality than dsGFP (**29% against 91%, p = 0.0002**).
BEST against WORST with doses pooled also differed (p = 0.03), in the opposite
direction to our hypothesis `[CALC]`.

**Interpretation.** The dominant predictor of mite death was **larval compromise**:
in compromised larvae, 45 of 47 recovered mites were dead (96%) regardless of
treatment, and more than half of all larvae were compromised in every group.
Restricting to healthy larvae did not change the conclusion. **We do not interpret
the BEST 50 ng/µL result as evidence that dsRNA protects mites**; it is most likely
noise.

**Limitation.** Roughly **30–50% of cells contained no recoverable mite**, and we
cannot tell whether those mites died, escaped or were never present. Some cells held
two or three mites, so counting per mite treats related individuals as independent.

**What it changed.** Future iterations must reduce larval handling and feeding stress
and score mite mortality only in healthy larvae, before target efficacy or pipeline
ranking can be meaningfully assessed. **Our computational pipeline's ranking is
untested by this experiment, not contradicted by it.** See
[cycle V3](/engineering#cycle-v3).

> **TODO —** Mite knockdown by RT-qPCR, the molecular endpoint the husbandry work
> redirected us towards. No knockdown number exists. Owner: bee lab.

## What the models predict

Modelled outputs are results, and they carry the **Modelled** label wherever they
appear — never **Demonstrated**. Detail on
[dry lab and modelling](/model) and [ecological modelling](/ecological-modelling).

Three BEEHAVE cycles have now run, and their headline outputs are:

- **Colony outcome is insensitive to starting conditions.** Across initial
  infestation levels of 0–100% and 0–100% deformed wing virus, the colony collapses
  in an average of **4 years** and honey production is affected similarly. One
  therapy can therefore address a range of starting infestations.
  [Cycle M1](/engineering#cycle-m1).
- **The efficacy target is a treatment efficiency of about 0.05**, which prevents
  collapse and holds losses to 10% of honey and 20% of bee population across the
  North Dakota, California and Australian hive profiles. Untreated, all profiles
  collapsed within 3 years with cumulative honey production falling to a third.
  **Winter treatment matches year-round treatment and beats autumn**, which is a
  regimen only a cold-tolerant in-hive product can use.
  [Cycle M2](/engineering#cycle-m2).
- **The titre the wet lab has to hit.** Replacing the single efficiency parameter
  with a mechanistic delivery chain, and crossing six dsRNA concentrations with five
  yeast amounts, gives the trade-off: above **0.01 mg dsRNA per g yeast**, the same
  collapse is prevented with a hundred times less yeast. Set against the modelled
  private benefit, **0.005 mg/g makes the therapy economically viable in the US and
  0.05 mg/g in both the US and Australia** `[CALC]`.
  [Cycle M3](/engineering#cycle-m3).

> **TODO —** Write these three into the eight-field shape with **Modelled** on each,
> and bring the plots and heat maps onto the wiki — they exist in the modelling
> write-up and not here. Owner: dry lab.

> **Every model on this wiki is literature-parameterised or provisionally
> parameterised; none yet uses a transfer probability we measured.** The five
> intermediate parameters in the M3 delivery chain were assigned plausible orders of
> magnitude precisely so they can be replaced when bench data arrive.

## What we could not establish

- **No construct is sequence-verified.** All QC to date is gel band size plus
  spectrophotometry. No sequence-level claim is made anywhere on this wiki.
- **No yeast has been transformed and no yeast titre exists.** µg intact dsRNA per
  mg dry yeast is the single measurement the project most needs. The production
  goal is now written as loop-ended dsRNA in **yeast or _E. coli_**, where it
  previously named yeast alone, and neither host has a measured titre.
- **No demonstrated mite mortality from our delivery route.** The soak assay gives a
  dose-response without recorded doses; the larval-feeding assay returned a clear
  negative confounded by host condition. **No knockdown figure exists at all.**
- **No validation of the target-ranking pipeline.** The best-against-worst comparison
  ran and was uninterpretable, so the pipeline's ranking is untested.
- **No MIQE-valid RT-qPCR standard curve**, and **spike-recovery has never been
  run** — the largest remaining hole in the measurement workstream.
- **No SYBR Gold detection limit of our own**, and no capture-format control for the
  streptavidin assay.
- **No melanin attribution.** The haemolymph absorbance traces cannot be assigned to
  melanin rather than scatter without a far-red baseline.

> **TODO —** Say which chassis produces the loop-ended dsRNA and which is only a
> cloning host. The Gibson assembly and colony lysis work runs through *E. coli*;
> whether *E. coli* is also a production host is a scope question the results
> outline leaves open, and no titre may be written up under either heading until it
> is settled. Owner: wet lab.

## Where this connects

[Engineering](/engineering) · [Measurement](/measurement) ·
[Experiments and protocols](/wet-lab-experiments) · [Bee lab](/bee-lab) ·
[Yeast](/wet-lab-experiments#yeast-production) ·
[Dry lab and modelling](/model) · [Parts](/parts) ·
[Contribution](/contribution) · [Timeline](/timeline)
