> **What this page proves:** what we found, how strongly the evidence supports
> it, and what each finding changed.
> **Where the evidence is:** on this page, beside every claim.

[Engineering](/engineering) explains how we made decisions. This page is the
fastest route to the evidence. A judge who reads only this page should come away
knowing what is solid, what is provisional, and what did not work.

## How to read a result on this page

Every headline result, including every failed one, uses the same eight fields in
the same order: **Question · Experiment · Evidence · Controls + n · Result ·
Interpretation · Limitation · What it changed.**

Each result carries one of the wiki's four status labels — **Demonstrated**,
**Investigated**, **Modelled**, **Proposed** — and the wiki's citation tags:
`[LIT]` from a source we read, `[CALC]` our own arithmetic with the assumptions
stated, `[FLAG]` unverified and never stated as fact.

## Two caveats that apply to every mass figure below

They belong before the results, not in a footnote after them.

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

> **FIGURE —** Yield per reaction, 2 h against overnight, one point per
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

**Status: Demonstrated. This is the measurement headline.**

**Question.** NanoDrop and Qubit disagree about our dsRNA concentration. What
should we report as a dose?

**Experiment.** Digest each preparation with DNase I and RNase T1, so that only
duplex survives, and re-read A260.

**Evidence.**

> **FIGURE —** Post-digest over pre-digest A260 for each of the eight
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

> **FIGURE —** Yield and A260/230 for all five methods, same larvae, same day
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

> **FIGURE —** Both runs on one axis: run 1 linear fit with its residuals, run 2
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
the aptamer — a perfect line is **what pure intercalation produces**. Run 2 is
published as a failed run with a diagnosis, because the diagnosis is the useful
part.

**Limitation.** The untagged-dsRNA control that would separate aptamer signal from
intercalation **has never been run**, and the whole assay depends on it.

**What it changed.** Mango was demoted from quantifier to selector. See
[cycle 4.1](/engineering#cycle-4-1).

> **TODO —** Mango validation, which the team flags as **the urgent one**. The
> blocking experiment is the untagged-dsRNA control: until it is run, no number on
> this page can distinguish aptamer signal from intercalation, and the LOD and LOQ
> above stand only as arithmetic on an unvalidated signal. Owner: wet lab.

### In-gel detection loses 10–30× to the haemolymph matrix

**Status: Investigated.**

**Question.** Does resolving the tagged construct on a gel escape the background
that defeats the plate reader?

**Experiment.** Dilution series in water and in spiked haemolymph, run on an
unstained native agarose gel, then post-stained and imaged.

**Evidence.**

> **FIGURE —** The two ladders side by side, water and haemolymph, with the
> faintest visible band on each marked and the ladder lane included, since the
> ladder staining is itself part of the result.

**Controls + n.** Unspiked haemolymph lane, water lane, dsDNA ladder on the same
gel.

**Result.** The water series was visible to ~3–6 ng per band; in haemolymph the
limit rose to ~50–100 ng, a **10–30× matrix penalty**. The dsDNA ladder stained
too, which is non-specific intercalation and not an aptamer signal.

**Interpretation.** The matrix, not the detector, sets the sensitivity. Any assay
that does not remove the haemolymph before reading pays this penalty.

**Limitation.** Read from an 8-bit JPEG; see the TIFF caveat at the top of this
page.

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

**Status: Demonstrated, qualitatively. The strongest single wet-lab result we
have.**

**Question.** After a larva eats our dsRNA, can we get it back intact?

**Experiment.** 5th-instar larvae spiked in-frame with 1 µg dsRNA and returned to
the hive. Whole larvae and larval haemolymph collected at 24 h, column-extracted,
flash-denatured, reverse-transcribed and amplified with construct-specific primers
across the 300/500/700 bp series.

**Evidence.**

> **FIGURE —** The 4–5 Aug gel, uncropped, with lane labels: dosed larvae, undosed
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

> **FIGURE —** The 12 Aug gel, with the contemporaneous water control lane shown
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

> **FIGURE —** A harnessed bee taking a droplet from the syringe, and the two
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

> **TABLE —** Deaths per box against box size and salt concentration, once the
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

**Status: Investigated. A negative, reported as one.**

**Question.** Can _Varroa_ be kept alive long enough to dose and score?

**Experiment.** Mites collected by sugar shake, soaked 6 h in 0.9% NaCl or left
unsoaked, then housed four ways: in capped cells in-frame, on white-eyed pupae in
cellulose capsules, on 5th-instar larvae in capsules, or alone in a capsule.
Survival scored at the 3-day checkpoint (7–8 Sep).

**Evidence.**

> **FIGURE —** Survival by housing method as a bar of counts, not percentages,
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

> **TODO —** The mite mortality and knockdown screen itself. No efficacy number
> exists and nothing on this wiki claims one. Owner: bee lab. Blocked on husbandry
> and on dsRNA supply.

## What the models predict

Modelled outputs are results, and they carry the **Modelled** label wherever they
appear — never **Demonstrated**. Detail on
[dry lab and modelling](/model) and [ecological modelling](/ecological-modelling).

> **TODO —** Write the modelled outputs into the eight-field shape, with
> **Modelled** on each: the efficacy threshold a colony actually needs, the
> required yeast titre that falls out of the cost model, and the transfer-chain
> sensitivity. Owner: dry lab. Every model on this wiki is currently
> literature-parameterised; none uses a parameter we measured, and that stays
> stated.

## What we could not establish

Short and explicit, because every project has this section and most wikis hide it.

- **No construct is sequence-verified.** All QC to date is gel band size plus
  spectrophotometry. No sequence-level claim is made anywhere on this wiki.
- **No yeast has been transformed and no yeast titre exists.** µg intact dsRNA per
  mg dry yeast is the single measurement the project most needs. The production
  goal is now written as loop-ended dsRNA in **yeast or _E. coli_**, where it
  previously named yeast alone, and neither host has a measured titre.
- **No mite mortality or knockdown figure.** See above.
- **No MIQE-valid RT-qPCR standard curve**, and **spike-recovery has never been
  run** — the largest remaining hole in the measurement workstream.
- **No untagged-dsRNA control for Mango**, without which the aptamer signal cannot
  be separated from intercalation.
- **No SYBR Gold detection limit of our own.**

> **TODO —** Say which chassis produces the loop-ended dsRNA and which is only a
> cloning host. The Gibson assembly and colony lysis work runs through *E. coli*;
> whether *E. coli* is also a production host is a scope question the results
> outline leaves open, and no titre may be written up under either heading until it
> is settled. Owner: wet lab.

## Where this connects

[Engineering](/engineering) · [Measurement](/measurement) ·
[Wet lab](/wet-lab) · [Bee lab](/bee-lab) · [Yeast](/wet-lab-experiments#yeast-production) ·
[Dry lab and modelling](/model) · [Parts](/parts) ·
[Contribution](/contribution) · [Timeline](/timeline)
