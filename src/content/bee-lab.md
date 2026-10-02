> **What this page proves:** that we can put a known dose of dsRNA into a bee
> and find out what happened to it afterwards.
> **Where the evidence is:** [the bee lab notebook](/bee-lab-labbook),
> [Hardware](/hardware) and [Results](/results).

Delivery is where **most field RNAi work comes apart**. This page is the biological
chain that has to hold — from a dose in a cell to a mite feeding on a bee — and
the assays we built because they did not already exist.

## Why bees — the delivery chain

Formulation → nurse bee → larva → haemolymph → mite. Each arrow is a place the
intervention can fail, and each is a thing we had to be able to measure.

Two design decisions closed the chain early, agreed with the apiary (30 June
2026):

- **In-house larval rearing was ruled out.** It needs two to three months of
  training and is "a paper in itself". Instead we apply dsRNA directly to frame
  cells during the natural nurse-bee feeding window — days 4–7 of larval life,
  avoiding the sensitive first four days — and check survival at day 10.
- **Whole-hive feeding was ruled out** as too risky to colony and queen health.
  Localised single-frame dosing with three colony replicates was adopted instead.

Timing matters because mites enter a cell roughly two days before pupation. The
dose has to still be there when the mite arrives, which is why **persistence, not
just uptake**, is what we measured.

> **FIGURE —** Delivery chain schematic: formulation → nurse bee → larva →
> haemolymph → mite, with the links we measured (adult haemolymph, larval
> haemolymph) marked differently from the links we did not (nurse-bee transfer
> in a live colony, mite ingestion). The second category is the honest half of
> the figure.

## Adult bee assays

The adult programme asks one question: **how long does an active dose of dsRNA
stay in nurse-bee haemolymph over 24 h?** Three assays got us to the point of
being able to ask it. The first two validated the feeding method — how much
sucrose solution a bee takes, how much salt it tolerates, what baseline mortality
to expect — and the third is the one that delivered the dose. All of it ran on
newly-emerged _Apis mellifera_, across several lengths of a control construct, so
that any length-dependent effect on uptake and persistence would show.

### Assay 1: salt concentration — **Demonstrated**

**Why we ran it.** The procedure that produces our dsGFP stock for the
adult-haemolymph assay leaves salt in the final solution (roughly 33 nM). Bees
have to drink that solution voluntarily, so we had to know whether the salt
dsRNA stability needs would put them off it or harm them. dsRNA stability is
reportedly best around 100–150 mM `[LIT]`, and bees are reported to prefer
0.1–0.3% salt `[LIT]` — two constraints that had to be checked against each other.

> **TODO —** The write-up gives the residual salt in the dsGFP stock as "roughly
> 33 nM", three orders of magnitude below the 50–150 mM actually tested. Confirm
> the unit before this figure is used anywhere. Owner: bee lab.

**Design.** 1 M sucrose at three NaCl concentrations, weighed to reach each
target molarity in 175 ml — 0.5145 g (50 mM), 1.0215 g (100 mM), 1.5311 g
(150 mM) — plus 475 ml of plain 1 M sucrose. Four 2 ml Eppendorf feeding tubes
per cage, and fifteen nutrition assay boxes split as:

| Cages | Solution |
| --- | --- |
| 5 | 1 M sucrose |
| 1, **with no bees** | 1 M sucrose — evaporation control |
| 3 | 1 M sucrose + 50 mM NaCl |
| 3 | 1 M sucrose + 100 mM NaCl |
| 3 | 1 M sucrose + 150 mM NaCl |

The no-bees cage is what makes the rest interpretable: it gives the rate of
evaporation independent of bee feeding.

**Approach.** Tubes filled to the brim, boxes monitored daily, solutions weighed
and replaced every 24 h with a clear before and after weight at each timepoint.
Dead bees were noted and removed at every check so that daily sucrose usage could
be corrected for mortality rather than confounded by it. Full method:
[the cage-feeding protocol](/bee-lab-experiments).

> **FIGURE —** The NaCl/sucrose-filled feeding tubes used for the initial feeding
> assay, with the four tubes of one cage visible.

**Result.** **No significant dose response** between sucrose intake and NaCl
concentration, and **no association** between NaCl concentration and 24 h
mortality. The salt buffer carried into the dsRNA feeding solution therefore has
no effect on measured dsRNA uptake or on bee survival, which is what we needed to
know before spiking it.

Consumption, by one-way ANOVA with **the cage as the unit of analysis** — bees in
a cage share one feeding tube and are therefore not independent, so net
consumption (g/bee/day) was averaged across each cage's three days to give one
value per cage:

| NaCl | n (cages) | Mean (g/bee/day) | Variance |
| --- | --- | --- | --- |
| 0 mM | 5 | 0.02064 | 6.43×10⁻⁵ |
| 50 mM | 3 | 0.01865 | 8.15×10⁻⁵ |
| 100 mM | 3 | 0.01921 | 1.80×10⁻⁶ |
| 150 mM | 3 | 0.03415 | 6.55×10⁻⁴ |

**F(3,10) = 0.96, p = 0.45** — we failed to reject the null hypothesis that all
four group means are equal `[CALC]`.

Mortality, by chi-square test of independence across 210 bees. Deaths were
**0/75 at 0 mM, 2/45 at 50 mM, 0/45 at 100 mM and 1/45 at 150 mM**; against
expected counts of 1.071 at 0 mM and 0.643 at each of the other three,
**chi-square = 4.85 on 3 df, p = 0.18** `[CALC]`.

**Our own caveat.** Three of the four expected cell counts are below 5, the usual
threshold for the chi-square approximation to be reliable, so **the mortality
result should be treated as approximate.**

> **FIGURE —** The write-up marks an unlabelled image at this point. What it has
> to show: net sucrose consumption per bee per day for each of the four NaCl
> concentrations, one point per cage, so that the spread of the 150 mM group the
> ANOVA reports as non-significant is visible rather than hidden in a mean.
> Owner: bee lab.

#### Statistical working

Grand mean 0.02280 g/bee/day across all 14 cages. Between-groups sum of squares
0.000500 on 3 degrees of freedom, mean square 0.000167; within-groups sum of
squares 0.001735 on 10 degrees of freedom, mean square 0.000173; total sum of
squares 0.002235. F = 0.000167 / 0.000173 = 0.96.

For mortality, expected deaths were derived from the overall mortality rate
across all four groups — 1.071 at 0 mM and 0.643 at each of 50, 100 and 150 mM —
and observed against expected gives chi-square = 4.85 on (2−1)(4−1) = 3 degrees
of freedom, p = 0.18.

### Assay 2: feeding-vessel optimisation — **Investigated**, then abandoned

**Why we ran it.** Filling a 2 ml Eppendorf to the brim at working concentration
needs more dsRNA than our IVT pipeline could produce for every mini-cage we
intended to run — a cost and time constraint, not a design preference. We
down-scaled to a PCR tube held in a **custom 3D-printed adaptor** (see
[Hardware](/hardware)), and then had to find out which tube form loses the least
solution to spillage and evaporation, so that what we measured was uptake rather
than passive loss.

**Design.** Five PCR-feeder-tube forms, split across two pilots to minimise the
number of bees used. The first was an evaporation test alone — a 12-feeder cage
experiment with **no bees in any cage** — asking which form loses the least mass
of sucrose over 24 h:

| Form | Hole position (20 gauge) |
| --- | --- |
| Horizontal PCR feeder tube | Top |
| Horizontal PCR feeder tube | Bottom |
| Tilted PCR feeder tube | Top |
| Tilted PCR feeder tube | Bottom |
| Vertical PCR feeder tube | Top |

**Approach.** The same weigh–fill–incubate–reweigh method as Assay 1, in
mini-cages of 15 bees, across five adaptor combinations with two repeats of four
tubes each. Each PCR tube held 250 µl of 1 M sucrose in deionised water. Results
were recorded separately from the salt trial.

> **FIGURE —** A cage with an angled PCR tube seated in its 3D-printed adaptor,
> shot so the hole position and the bee's access to the solution are both visible.

**Result.** **The first pilot produced no usable feeding data.** Two of the four
candidate designs — the horizontal form, and the bottom-hole tilted variant —
suffered physical handling failures during setup, before any 24 h measurement
could be taken. We repeated the comparison with the two that survived handling
intact, tilted and vertical. In that second pilot, **systematic failures in the
control experiments** meant we could not reliably compare the evaporation
controls against the tilted and vertical groups at all.

> **TODO —** Per-tube consumption figures for the vessel comparison were recorded
> separately and are not in the write-up. Three counts also need reconciling: the
> evaporation-test design lists five tube forms, the feeding pilot reports "four
> candidate designs" (the four being horizontal, tilted, vertical and the cut-up
> 2 ml Eppendorf), and the 14 July journal entry records six adapter combinations
> against the write-up's five. Owner: bee lab.

**What it changed — we abandoned the assay.** Two iterations of vessel design
(horizontal, tilted, vertical and the cut-up Eppendorf, narrowed to tilted and
vertical) gave us qualitative and structural differences between the forms, but
unresolved leaking — **particularly in the vertical design's own
evaporation-only controls** — meant genuine bee consumption could not be
separated from passive solution loss. Beyond that technical limit, cage feeding
of this kind could only ever give **an average dose across a whole cage**, never
a known dose per individual bee, and the haemolymph-persistence work downstream
needed exact per-bee dosing to be interpretable at all. We judged further
refinement of the cage apparatus not the most productive use of the remaining
time and moved to the proboscis-extension response assay as the primary feeding
method.

### Assay 3: proboscis-extension (PER) dosing — **Demonstrated**

On the advice of our bee lab PI, Professor Geraldine Wright, we used the
**proboscis-extension response assay** — well established in the beekeeping
industry. Live bees are non-harmfully strapped into tubes with head and thorax
protruding, fed specific volumes presented on the tip of a 19-gauge syringe, and
held in position for a set length of time. Its usual purpose is to resolve the
effect of a fed substance on bee mortality; we used it to guarantee that a
standardised volume carrying a **known mass of dsRNA** went into each bee.

- **Dose:** an aliquot of the
  [IVT product](/wet-lab-experiments) was read on a Nanodrop, then diluted to
  200 ng/µl dsGFP in 1 M sucrose with the appropriate salt buffers. 5 µl per bee
  = **1 µg per bee**.
- **Why that dose.** Garbian et al., 2012 fed a 2.5 µg dose in 5 µl of sucrose
  `[LIT]`. Because of the inefficiencies in our own IVT process we kept their
  volume and **lowered the concentration**, to reach a yield we could reliably
  produce while staying within the paper's order of magnitude.
- **Delivered in 2.5 µl increments**, twice, because a single 5 µl drop forms a
  large droplet that rolls off or soaks into the bee and the dose stops being
  known.
- **Timepoints:** 1 h, 3 h, 6 h and 24 h to culling and haemolymph extraction.
- **n:** 5 bees per fragment length per timepoint, plus **3 shared controls**
  per timepoint fed 5 µl of plain 1 M sucrose — 18 bees per timepoint. The
  control group is smaller (n = 3 against n = 5) because one control set is the
  shared baseline against all three lengths, and to minimise unnecessary culling
  in line with responsible use of live animals.
- **Staggering:** a full 18-bee timepoint takes about 15 minutes to set up, so
  each length group was started **20 minutes apart**. Without that offset the
  1 h and 3 h points would not have been 1 h and 3 h.
- **Incubation:** a sealed plastic container with a warm, wet towel at the base
  of the PER tubes, to approximate in-hive conditions and so keep handling stress
  and baseline mortality down.

> **TODO —** Our own write-up gives in-hive conditions two different ways: 32 °C
> and **80%** humidity, citing Becchimanzi et al., 2024, in the assay method, and
> roughly 32 °C and **50–60%** humidity in the welfare section below. Both are
> carried here rather than one being picked. Settle which figure the incubation
> was actually set to, and give Becchimanzi et al., 2024 and Garbian et al., 2012
> full resolvable references. Owner: bee lab.

> **FIGURE —** Two bees strapped into the proboscis-extension feeding assay, with
> the syringe tip presenting a droplet, so the restraint and the feeding position
> are both legible.

> **FIGURE —** The layout of one timepoint: 18 bees — 3 controls plus 5 repeats
> for each of the three dsGFP lengths.

The first attempt (14 July) **failed on restraint** — bees slipped out of gorilla
tape repeatedly and several escaped. An earlier free-tray attempt with 20
foragers failed outright: droplets were dropped or absorbed onto the bees'
surface. Both are why the assay ended up as strapped, newly-emerged bees fed in
increments.

### Fragments tested, and the no-Mango control

| Fragment | Mango aptamer | Role |
| --- | --- | --- |
| 300 bp GFP | Yes | Length series |
| 500 bp GFP | Yes | Length series |
| 700 bp GFP | Yes | Length series |
| 500 bp GFP | **No** | Does the aptamer itself change uptake or persistence? |

**GFP is the point of the control.** It is an irrelevant sequence with no
silencing target in a bee or a mite, so any signal we recover isolates the
**delivery-and-persistence** question from biological knockdown. Each fragment is
flanked by our modular adapters (see
[the random-up/down adaptor system](/wet-lab)) and the first three carry the
Mango aptamer used to quantify haemolymph dsRNA (see
[Measurement](/measurement)). The 500 bp no-Mango arm exists to resolve whether
the aptamer itself changes uptake — so that any length effect we see is **not
actually an aptamer effect**. It had to be run on a separate date: the first 24 h
attempt on 18 August was lost when the wrong tape let the bees escape and
individuals became untraceable, and the delays that followed meant it was never
brought back concurrently with the other three.

> **FIGURE —** The dsGFP fragments fed to the bees: 300, 500 and 700 bp with the
> Mango aptamer and 500 bp without, drawn to scale with the flanking adapters
> marked.

### Which bees, and what that cost — **Investigated**

Newly-emerged bees are calm and yield 5–10 µl; foragers yield around 30 µl but
only 22 of 50 survived the day. **We used newly-emerged bees**, accepting the
smaller volume, because they are also the nurse-bee stage the delivery pathway
actually depends on.

> **TODO —** The source note gives "5–10 µl" and "~30 µl" without stating
> whether these are haemolymph yields or ingested volumes; the notebook's
> 26–27 August entry supports haemolymph yield. Confirm and state once.
> Owner: bee lab.

Haemolymph yield also varied with how far up the antenna was cut (26–27 August).
**No firm cause was established**; pooling during calibration was agreed as the way
to absorb the variance rather than a fix.

### Adult haemolymph persistence — **Investigated**

Haemolymph was pooled, RNA extracted with Vazyme Vezol under the manufacturer's
blood protocol, reverse transcribed after a 95 °C denaturation, amplified with
construct-specific primers and run on a 1.5% agarose gel against a water
negative and a known-GFP positive. Full steps are in
[the notebook](/bee-lab-labbook).

> **TODO —** Adult persistence results (which timepoints carried signal, for
> which lengths) are not written up. The gel exists in the team's records.
> Owner: bee lab. Blocked on the figures being uploaded to `static.igem.wiki`.

## Larval assays

The question here is narrower than for adults: no length series, just how long
a single dose fed at the 5th instar **persists in larval haemolymph**. If dsRNA is
still there 24 h after feeding, a mite infesting that cell has enough exposure
to matter.

### Why the 5th instar — **Demonstrated**

**Found by doing it wrong first** (31 July). 5th-instar larvae can be extracted
without bursting. **6th-instar larvae are too soft** and rupture. Later pupal
stages are firmer again but have lost the osmotic pressure that makes
haemolymph ooze out at all, so they would need an adult-style extraction.
5th instar is the only stage where the simple method works.

### Design and dosing

**One construct only: 700 bp GFP dsRNA**, no biological silencing target, made by
IVT and checked by Qubit and gel before dosing. As in the adult assay, GFP is
deliberately an irrelevant-sequence process control, so that detection is evidence
of **stability and delivery** rather than of knockdown.

Each larva received 5 µl of 200 ng/µl GFP dsRNA — **1 µg total dose** — diluted 4×
with 15 µl of sucrose solution to a total volume of 20 µl. All larvae were staged
at 5th instar at the moment of dosing. Controls received 20 µl of sucrose alone,
from the same batch as the treatment group. Dosing was by micropipette as a dabbed
droplet, without the tip touching the larva; larvae were returned to the hive
immediately afterwards.

**Five timepoints:** 24 h, 48 h, 72 h, 96 h and 7 days, with larvae harvested and
processed at each interval. Each timepoint comprised **10 dosed larvae and 5
sucrose-only controls**, 75 larvae across the full time course.

> **TODO —** The write-up says "75 larvae were dosed in total across the full time
> course", but 5 timepoints × (10 dosed + 5 controls) is 75 larvae including the
> controls — which would make 50 dosed. Confirm which. Owner: bee lab.

**Layout.** Dosed and control cells were **interleaved across the frame and
randomised by location**, with frame zones allocated to timepoints in advance and
a full cell map recorded before dosing, so that treatment group and physical
position on the frame could not be confounded.

**Whole animals, not haemolymph.** Dosing at 5th instar means every timepoint
falls at or beyond capping, so each sample was harvested as a capped cell,
uncapped at collection, and **processed as a whole animal** rather than by in-cell
haemolymph extraction alone.

Getting to that dose took three pilots (22, 28 and 30 July), including a
double-dose correction on two larvae whose first dose missed the cell.

### Pilot result — **Demonstrated**

A whole larva extracted 24 h after a 1 µg dose of 700 bp dsRNA gave **intact
RT-PCR signal** in good quantity at 24 h.

> **FIGURE —** RT-PCR of whole larvae dosed in-hive with 1 µg and processed at
> 24 h, with the water negative and GFP positive lanes, showing bands at the
> expected sizes. Needs uploading to `static.igem.wiki`.

> **TODO —** The notebook records intact signal "at all three expected band
> sizes (300/500/700 bp)" for a larva dosed with the 700 bp fragment. Confirm
> what was loaded in each lane before this is restated anywhere. Owner: bee lab.

> **TODO —** Results for the full five-timepoint larval timecourse (24, 48, 72,
> 96 h and 7 days), started 18 August. The write-up carries "details to be
> inserted here". Owner: bee lab.

### What the larval DBTL tables still owe

> **TODO —** The larval-assay design–build–test–learn tables are blank in the
> team write-up: dosage pilot (5 µl vs. larger volume at constant mass), frame
> marking method (ruled columns vs. digital drawing), and time-to-dose. The frame
> layout that was adopted is described above; which of the two marking methods it
> came from is still not recorded. Owner: bee lab.

## Varroa work

### Getting mites

Sugar shake: brood frames are dusted on both sides with sieved powdered sugar,
frame by frame, and the mites shaken off. It works in dry conditions (Hive 14,
3 September, plentiful mites) and **fails outright in the wet** — on 2 September the
sugar clumped and stuck to bees and frames rather than shaking off. Mite loads
were low across most of our own hives; tray counts over 1–3 September found only
a handful worth shaking (Hive 40, 100+; Hive 20 and Hive 14, 75+; Hive 43, 50+).

### Mite husbandry — the negative that shaped the assay — **Investigated**

We could not **keep mites alive off a host**. Three-day checkpoint, 8 September:

| Housing | Survived |
| --- | --- |
| Soaked, in capped cells in-frame | 4/10 |
| Soaked, on white-eyed pupae in capsules | 3/5 |
| Soaked, on 5th-instar larvae in capsules | 2/5 |
| Soaked, alone in a capsule | 0/9 |
| Unsoaked, alone in a capsule | 0/9 |

Pooled, that is **9/20 (45%) with a host against 0/18 (0%) without one, Fisher
p = 0.0013**; and soaked against unsoaked with no host is **0% vs 0%,
p = 1.0** `[CALC]`. The soak is therefore exonerated as the cause of death at
this stage; the absence of a host explains it. A baseline of 40% mite survival
inside cells at 24 h was recorded the same week.

> **TODO —** Wilson confidence intervals for these proportions. Owner: bee lab.

An earlier pilot (3–4 September) pointed the same way: soaked mites on pupae
averaged 35.7% survival across 10 replicates, capsule-without-pupa gave 0/3,
0/3 and 1/3, and unsoaked mites alone in Eppendorf tubes all died.

**Soaking is separately lossy.** On 11 September, 140 control mites were soaked
and 40 were alive afterwards. The standing rule that came out of this is to soak
three to four times as many mites as the experiment needs. Mites also took over
five hours to wake after soaking, which is what makes a large single-day screen
impractical.

### Mite mortality titre — **Investigated**

A **concentration titre**: the effect of varying concentrations of our target
dsRNA construct on mite mortality. The design is a titre rather than a single dose
because the literature and the concentration-dependent effect we are trying to
resolve both demand a curve. Mites were soaked in plain water and at two
concentrations of the target dsRNA (~120 in water, ~70 in each treatment; 6 h
incubation, 11 September), and a larger in-frame assay was set up on
24–25 September with 30–35 larvae per treatment batch and 20 for the sucrose
control.

The route into the assay is four steps: mite extraction from hives by sugar shake,
soaking in 0.9% NaCl solution, drying, and a baseline survival estimate for the
post-soak animals. The soak is where the losses are, which is why the husbandry
result above governs this assay rather than the other way round.

> **TODO —** Mite mortality titre results. Owner: bee lab. Two known problems
> to state alongside them: the Qubit-validated dsRNA concentration came back
> far below the intended 1000 ng/µl soak dose, and only 35 of 40 larval hosts
> were prepared on 24 September because GFP ran short.

A revised design (11 September, from a suggestion by the apiary) **drops the soak
entirely**: dose larvae as in the 5th-instar pilot, confirm signal on a gel, leave
them in-hive for a day to reach capping, then uncap, introduce a freshly
shaken mite and reseal. It removes the soak bottleneck and would give a
dose–response between larval dsRNA dose and mite mortality. **Proposed** — it
needs more target dsRNA than we have, and nurse bees remove visibly damaged
cells if the frame is out too long.

> **TODO —** The specific _Varroa_ gene target is withheld pending confirmation
> of the patent priority filing date against the 21 October freeze. The mite
> soak and titre work above used it; the concentrations, counts and dates are
> unaffected. Restore the name here and in
> [the notebook](/bee-lab-labbook) once the disclosure moratorium lifts.
> Owner: team lead.

## Bee welfare and permissions

Considerable effort went into minimising stress and discomfort to the bees, to
uphold the ethical standards expected of live-animal research in our institution.
**Haemolymph extraction is terminal**; there is no version of this work that does
not cull bees. What we controlled was everything either side of that.

- Culling was by swift thorax–abdomen separation, treated as a necessary and
  humane endpoint rather than an incidental harm, and performed in one movement to
  avoid prolonged distress.
- During PER incubation bees were held at approximately hive conditions —
  32 °C, and 50–60% humidity in this section of the write-up against 80% in the
  assay method above — to reduce handling stress and keep baseline mortality
  low, so that any mortality or physiological change observed could be attributed
  to the dsGFP treatment itself rather than to avoidable environmental stress from
  poor husbandry during the assay.
- Whole-hive dosing was rejected on colony and queen welfare grounds; in-house
  larval rearing was rejected as unachievable to a competent standard in the
  time available.
- A dsRNA risk assessment was drafted and submitted for signature on
  17–18 July. Power calculations were prepared for the animal-use form on
  24 August, specifically to avoid using more bees than the question required.

> **TODO —** Name the approving body and the approval reference. The write-up
> carries a placeholder. Owner: bee lab. This must be filled before the freeze.

## Experimental limitations

- **Sample sizes are small.** n = 5 per length per timepoint, n = 3 shared
  controls; the mite housing comparison had 5–10 per arm. The salt trial rests on
  14 cages, and three of the four expected cell counts in its chi-square are
  below 5.
- **The feeding-vessel comparison never produced a usable measurement.** Handling
  failures took out two designs before the first 24 h reading, the surviving pair
  could not be separated from their own leaking evaporation controls, and the
  assay was abandoned rather than reported.
- **The 500 bp no-Mango arm is not concurrent** with the three-length series,
  so an aptamer effect and a batch effect are not fully separable.
- **Mite supply constrained everything.** Our own hives had low loads, the
  sugar shake is weather-dependent, and the soak killed most of what we
  collected.
- **A planned high-dose mite toxicity assay was abandoned** for lack of time and
  material. Nothing should be inferred from its absence.
- **Seasonality.** Bee lab work had to finish inside a narrowing brood season;
  the larval and adult stability assays were both racing it.
- **3D-print defects** in some feeding adaptors may have added variance between
  nominally identical vessel replicates.
- **Quantification lagged the biology.** The soak concentration used on
  11 September was not the intended one, discovered only on Qubit re-check.

## What we would model next — **Proposed**

If the haemolymph results cannot be analysed, or do not come back as we hope, the
fallback is modelling rather than more bench time: three chained models covering
uptake into the nurse-bee gut, stability in larval haemolymph, and mite knockdown
and mortality. Our own read is that the **upstream** half of that chain rests on
almost no replicable quantitative literature and is probably not worth building,
and that the **mite-titre curve** is the one model that is groundable. All of it —
the chain, the reasoning and the one model we would actually build — is written up
on [Model](/model).

## Protocol library

Protocols are on [the bee lab notebook](/bee-lab-labbook): centrifugal adult
haemolymph extraction, larval haemolymph extraction, larval RNA extraction and
the RT-qPCR programme. The handbook written for other teams is
[How to work with bees](/working-with-bees).

> **TODO —** Still owed as written protocols: mite rearing and mite RNA
> extraction. The PER assay, the adult cage-feeding assay and the cage-feeding
> adapter pilot are now on
> [the protocols page](/bee-lab-experiments) from the assay write-ups; they still
> need checking against the bench copies before another team follows them.
> Owner: bee lab.

## Where this connects

[Bee lab notebook](/bee-lab-labbook) · [How to work with bees](/working-with-bees) ·
[Hardware](/hardware) · [Measurement](/measurement) · [Results](/results) ·
[Engineering](/engineering) · [Safety and security](/project-safety) ·
[Contribution](/contribution)

```component
bee-reset
```
