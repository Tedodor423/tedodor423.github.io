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

### Pilot: the caged feeding assay — **Demonstrated** (method)

Before the dosing assay we needed two answers: how much salt the sucrose
solution could carry, and which feeding vessel measures **consumption rather than
evaporation**.

**Salt.** dsRNA stability is reportedly best around 100–150 mM `[LIT]`, and
bees are reported to prefer 0.1–0.3% salt `[LIT]`, so the two constraints had
to be checked against each other. We made 1 M sucrose at three NaCl
concentrations — 0.5145 g → 50 mM, 1.0215 g → 100 mM, 1.5311 g → 150 mM per
175 ml — plus roughly 475 ml of plain 1 M sucrose. Fifteen boxes of 30 bees,
four feeding tubes each: six plain, three per salt concentration. Solutions
were replaced about every 24 h, made fresh where possible (fridge storage
causes evaporation), and dead bees were counted and removed at every change so
per-bee consumption could be corrected for mortality.

> **TODO —** Consumption-per-bee figures for the salt trial and the vessel
> comparison were recorded in the lab spreadsheet, not in the write-up. Owner:
> bee lab. Until they are here, no salt concentration is claimed as preferred.

**Vessel.** The first design was a perforated 2 ml Eppendorf, weighed before
and after 24 h in a 30-bee cage on a lab-grade balance. Filling one to the brim
at working concentration would have needed more dsRNA than our in-vitro
transcription pipeline could produce for every cage, so we down-scaled to a PCR
tube held in a **custom 3D-printed adaptor** (see [Hardware](/hardware)). Four
forms were then compared on the same weigh–fill–incubate–reweigh method, across
six adaptor combinations with two repeats of four tubes:

| Form | Why it was in the comparison |
| --- | --- |
| Vertical PCR tube | Baseline orientation |
| Flat-lying PCR tube | Least headspace, suspected lowest evaporation |
| Angled-down PCR tube | Compromise between access and spillage |
| Perforated 2 ml Eppendorf | The original design, as the control |

### Proboscis-extension (PER) dosing — **Demonstrated**

On the advice of our bee lab PI we used the **proboscis-extension response
assay**: bees are non-harmfully strapped into tubes with head and thorax
protruding and fed from the tip of a 19-gauge syringe. Its usual purpose is
mortality testing; we used it to guarantee that a known mass of dsRNA went into
each bee.

- **Dose:** 5 µl of 200 ng/µl dsGFP in 1 M sucrose = **1 µg per bee**.
- **Delivered in 2.5 µl increments**, twice, because a single 5 µl drop forms a
  large droplet that rolls off or soaks into the bee.
- **Timepoints:** 1 h, 3 h, 6 h and 24 h to culling and haemolymph extraction.
- **n:** 5 bees per fragment length per timepoint, plus **3 shared controls**
  per timepoint fed 5 µl of plain 1 M sucrose — 18 bees per timepoint. The
  control group is smaller because one control set is the shared baseline for
  all three lengths, and because we did not want to cull bees we did not need.
- **Staggering:** a full 18-bee timepoint takes about 15 minutes to set up, so
  each length group was started **20 minutes apart**. Without that offset the
  1 h and 3 h points would not have been 1 h and 3 h.
- **Incubation:** a sealed container with a warm, wet towel at the base of the
  tubes, approximating the in-hive 32 °C and 50–60% humidity.

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

All three lengths carry our modular flanking sequence and the Mango aptamer
used to quantify haemolymph dsRNA (see [Measurement](/measurement)). The
500 bp no-Mango arm exists so that any length effect we see is **not actually an
aptamer effect**. It had to be run on a separate date: the first 24 h attempt on
18 August was lost when the wrong tape let the bees escape and individuals
became untraceable, and time pressure meant it was never brought back
concurrently with the other three.

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

### Dosing

**1 µg of 700 bp Mango-GFP dsRNA** in 20 µl per larva, all 5th instar, applied to
the cell by micropipette as a dabbed droplet without the tip touching the larva.
Larvae were returned to the hive immediately after dosing and re-identified from
coloured lines marked on the frame. Timepoints: 24 h, 48 h, 72 h and 168 h.

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

> **TODO —** Results for the full 24/48/72/168 h larval timecourse started
> 18 August. Owner: bee lab.

### What the larval DBTL tables still owe

> **TODO —** The larval-assay design–build–test–learn tables are blank in the
> team write-up: dosage pilot (5 µl vs. larger volume at constant mass), frame
> marking method (ruled columns vs. digital drawing), and time-to-dose. Owner:
> bee lab.

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

Mites were soaked in plain water and at two concentrations of the target dsRNA
(~120 in water, ~70 in each treatment; 6 h incubation, 11 September), and a
larger in-frame assay was set up on 24–25 September with 30–35 larvae per
treatment batch and 20 for the sucrose control.

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

**Haemolymph extraction is terminal**; there is no version of this work that does
not cull bees. What we controlled was everything either side of that.

- Culling was by swift thorax–abdomen separation, treated as a humane endpoint
  rather than an incidental harm.
- During PER incubation bees were held at approximately hive conditions —
  32 °C, 50–60% humidity — to reduce handling stress and keep baseline mortality
  low, so that any effect observed could be attributed to the treatment rather
  than to husbandry.
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
  controls; the mite housing comparison had 5–10 per arm.
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

## Protocol library

Protocols are on [the bee lab notebook](/bee-lab-labbook): centrifugal adult
haemolymph extraction, larval haemolymph extraction, larval RNA extraction and
the RT-qPCR programme. The handbook written for other teams is
[How to work with bees](/working-with-bees).

> **TODO —** Still owed as written protocols: PER assay, adult feeding
> experiment, box assay → PCR tube adaptation, sugar dusting, and mite rearing.
> Owner: bee lab.

## Where this connects

[Bee lab notebook](/bee-lab-labbook) · [How to work with bees](/working-with-bees) ·
[Hardware](/hardware) · [Measurement](/measurement) · [Results](/results) ·
[Engineering](/engineering) · [Safety and security](/project-safety) ·
[Contribution](/contribution)
