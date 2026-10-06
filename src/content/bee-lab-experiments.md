The protocols the bee lab ended up using. [The bee lab page](/bee-lab) is the
argument, [the lab book](/bee-lab-labbook) is the dated record, and this is
**the method between them**. Practical technique distilled out of the entries,
the advice rather than the steps, is on
[the bee research guide](/working-with-bees).

Protocols here are the versions we settled on. Where an earlier version failed,
the failure is recorded in [the lab book](/bee-lab-labbook). **Every protocol
carries its own experimental limitations.**

> **TODO —** The specific _Varroa_ gene target is withheld pending confirmation
> of the patent priority filing date against the 21 October freeze. Restore it
> once the disclosure moratorium lifts. Owner: team lead.

> **TODO —** PDF: Complete bee-lab protocol set, uploaded to `static.igem.wiki` and
> linked here. Owner: bee lab.

## Working with adult bees

### Protocol: adult honeybee cage-feeding sucrose assay

**Purpose and rationale.** This assay measures how much feed caged adult honeybees
consume, and how many die, when given 1 M sucrose alone or sucrose containing 50, 100
or 150 mM NaCl. It tests whether the saline carrier used for dsRNA delivery is
palatable and tolerated by adult bees.

The design follows the cage-feeding setup of Muita et al. (2026): ventilated plastic
cages, sucrose-based diet, incubator conditions mimicking the hive, and three cages
per treatment. Consumption is measured gravimetrically by weighing feeder tubes
before and after each interval.

**Materials and equipment.**

- Ventilated plastic cages with four feeder ports each, plus blank plugs for every
  port (12 cages for 4 treatments × 3 replicates, plus 1 evaporation-control cage per
  treatment)
- 2 ml Eppendorf tubes with small perforations in the lid or tip, so bees can feed
  when the tube is inverted in the port. Alternative feeder tubes need 3D-printed
  adaptors that fit the cage feeder — see [hardware](/hardware)
- Triangular bee collector fitted to the hive flight port
- Analytical balance reading to 0.001 g, with draft shield
- Incubator set to 34 °C and 60–80% relative humidity, in the dark
- Sucrose, NaCl, distilled water, volumetric flasks, labels and marker
- Gloves, bee suit and veil for collection
- −20 °C freezer and biohazard bin for disposal

**Solution preparation.** Prepare all four solutions fresh on the day the assay
starts. Each NaCl solution is made up in 1 M sucrose, so every treatment has the same
sugar content and only the salt differs.

| Solution              | Sucrose per 100 ml | NaCl per 100 ml |
| --------------------- | ------------------ | --------------- |
| 1 M sucrose (control) | 34.23 g            | 0 g             |
| 50 mM NaCl            | 34.23 g            | 0.292 g         |
| 100 mM NaCl           | 34.23 g            | 0.584 g         |
| 150 mM NaCl           | 34.23 g            | 0.877 g         |

1. Dissolve the sucrose in about 70 ml distilled water, stirring until clear.
2. Add the NaCl and stir until dissolved.
3. Make up to 100 ml in a volumetric flask and mix by inversion.
4. Label each flask with solution, date and initials. Store at 4 °C and bring to
   incubator temperature before use.

Our own 175 ml batches used 0.5145 g for 50 mM, 1.0215 g for 100 mM and 1.5311 g for
150 mM. Make the solutions the same day where possible; fridge storage causes
evaporation.

**Bee collection.** Collect all bees from one colony in one session, so cages differ
only in treatment.

1. Fit the triangular collector over the hive flight port, with its narrow end
   opening into an empty cage.
2. Let returning bees walk into the collector and through to the cage until it holds
   the intended number. Count them in, then plug the cage.
3. Repeat for every cage. **Alternate cages between treatments as you fill them**, so
   no treatment receives only early or only late arrivals.
4. Label each cage with treatment, replicate number, colony and date.
5. Carry the cages to the lab in a shaded box and transfer them to the incubator
   within 30 minutes.

Bees caught at the flight port are mostly foragers. Muita et al. (2026) used newly
emerged bees, so note this difference in the write-up.

**Cage and feeder setup.** Each cage receives four feeder tubes, all filled with that
cage's treatment solution. The four tubes are always weighed together as one
cumulative set.

1. Prepare the balance: check the level bubble is centred, close the draft shield,
   let it warm up, and tare it. **Use the same balance for every weighing in the
   assay.**
2. Label four empty 2 ml tubes per cage and weigh them together. Record this as the
   empty weight.
3. Fill each tube to the same level with the cage's solution, close the lids, and
   wipe off any solution on the outside. If a bubble forms, empty the tube and refill
   from scratch — correcting a bubble in place makes it worse.
4. Weigh the four filled tubes together. Record this as the starting weight (time 0).
5. Insert the tubes into the cage's four ports, inverted so bees can feed through the
   perforations.
6. **Set up one evaporation-control cage per treatment**: identical feeders in a cage
   with no bees, weighed the same way. Without it the weight differences are
   unreadable.
7. Place all cages in the incubator at 34 °C and 60–80% relative humidity, in the
   dark. Record the start time.

**Incubation and time-point weighing.** Leave the cages for the interval set by the
design. At every interim time point, record a BEFORE and an AFTER weight for each
cage's feeder set.

1. Remove the cage from the incubator. Take out one feeder at a time and immediately
   plug its port with a blank, so no bees escape.
2. Wipe the outside of the tubes and weigh all four together. Record as the BEFORE
   weight.
3. Refill each tube to the same level as at time 0, using the same solution.
4. Weigh all four together again. Record as the AFTER weight.
5. Replace the tubes one at a time, removing each blank just before inserting its
   feeder. Never force a fresh tube into a crowded cage — it spills; move the bees to
   a fresh cage instead. Return the cage to the incubator.
6. Do the same for the evaporation-control cages.

Refilling at every time point is essential: if levels drop too low, bees cannot reach
the solution through the perforations. Every interim time point has both a BEFORE and
an AFTER weight. The first measurement (time 0) has only a starting weight, and the
final time point has only a BEFORE weight, as there is no refill.

**Mortality monitoring.** Count dead bees in every cage at each time point, at the
same moment as the weighing.

- Count through the cage walls without opening the cage. A bee is dead if it does not
  move when the cage is gently tapped.
- Leave dead bees in the cage, so the bee count is never disturbed.
- Record the cumulative number of dead bees per cage at each time point.
- Note anything unusual: bees trapped in feeder ports, spilled solution, or
  condensation in the cage.

**Calculating consumption.** Consumption over each full test is the culmination of
each daily feeding cycle, corrected for evaporation.

- Daily consumption is BEFORE weight minus AFTER weight.
- Consumption over the whole period is the sum of each daily consumption.
- For a 24 h assay with no refill, the BEFORE weight is simply the initial tube
  weight and the AFTER weight is the final weight at 24 h.
- For the first interval, use the starting weight in place of AFTER.
- Divide each interval's consumption by the number of bees alive at the start of that
  interval, and report as mg per bee per 24 h.

**Analysis.** Take the cage, not the bee, as the unit of analysis: bees in a cage
share one feeding tube and are not independent. Average net consumption (g/bee/day)
across each cage's days to give one value per cage. Compare consumption and
cumulative mortality between treatments at each time point, using the replicate cages
per treatment.

**End of assay and disposal.**

1. At the final time point, record the BEFORE weight and the dead-bee count as above.
   Do not refill.
2. Keep all ports plugged and place the sealed cages in a −20 °C freezer for at least
   24 h to euthanise the bees.
3. Dispose of the bees and single-use feeder tubes in a biohazard bin. Hand-wash
   reusable cages and feeding tubes outside the lab before the next assay.
4. Discard leftover solutions and clean the balance.

**Experimental limitations.**

- Sucrose tubes can spill, adding noise to the BEFORE–AFTER weight data. Handle them
  with care and note any spillage against that specific test.
- Some bees die in each test, which reduces average intake relative to the day
  before. Record the test group and the number dead so the per-bee denominator can be
  corrected.

**References.** Muita et al. (2026), _Frontiers in Insect Science_ 6,
[doi:10.3389/finsc.2026.1868457](https://doi.org/10.3389/finsc.2026.1868457) ·
Garbian et al. (2012), _PLoS Pathogens_ 8(12): e1003035.

### Protocol: adult honeybee cage-feeding adapter pilot

The down-scaled version: a PCR tube in a 3D-printed adaptor in place of the 2 ml
Eppendorf, to cut the volume of dsRNA needed per cage. Five tube forms were
compared — horizontal, tilted and vertical, with the 20-gauge hole in the top or
in the bottom.

1. Run the evaporation pilot first, with **no bees in any cage**, so passive loss
   is measured on its own: 12 feeders across the five tube forms.
2. Fill each PCR tube with 250 µl of 1 M sucrose in deionised water.
3. Then repeat with bees, in mini-cages of 15, across five adaptor combinations
   with two repeats of four tubes each.
4. Weigh–fill–incubate–reweigh exactly as in the assay above.

Two feeding ports per tube, made with sterile hypodermic needles, **one near the base
and one at the neck** — the upper port breaks the airlock that otherwise stops flow
as the reservoir drains. Port diameter is set by needle gauge; **23G was adopted**,
and the capacity rule is three tubes per cage at 23G, or sub-24 h replacement. See
[cycle B2](/engineering#cycle-b2).

**Limitation.** A number of the printed adaptors showed minor print defects. They
were judged sufficient for testing, but this was noted as a factor that **may have
introduced variability** into the evaporation and spillage measurements between
nominally identical tube replicates.

### Protocol: proboscis extension response (PER) feeding assay

**Purpose and rationale.** This assay delivers a precise oral dose (5 µl) of a test
solution to individual adult honeybees, by exploiting the proboscis extension
response. Unlike cage feeding, **every bee receives a known volume**, so dose per bee
is controlled rather than estimated from group consumption. Individual proboscis
feeding of harnessed bees follows the approach of Garbian et al. (2012), who fed
dsRNA in sucrose directly to the proboscis to avoid contaminating the body surface.

**Materials and equipment.**

- Capped brood frame with bees close to emergence, and an incubator brood box
- Incubator set to 34 °C
- Soft bee brush and a clean bucket or container
- Glass vials with lids or cotton plugs
- Ice bucket with crushed ice
- PER harnesses, PER holder rack, thin strips of tape, fine tweezers
- Microsyringe (e.g. Hamilton, 10 µl) or P10 pipette with fine tips
- Test solutions in sucrose (e.g. dsRNA, dsGFP control, sucrose-only control),
  labelled
- Humid chamber: sealed box with a damp towel, kept in the incubator
- Gloves; −20 °C freezer and biohazard bin for disposal

**Obtaining newly emerged bees.**

1. Remove a capped brood frame from the hive, shaking or brushing off all adult bees,
   and place it in the incubator brood box.
2. Incubate overnight at 34 °C so bees emerge from their cells.
3. The next day, gently brush the newly emerged bees from the frame into a clean
   bucket or container. **Using bees under 24 h old means all bees are the same age
   and none have fed in the hive.**
4. Transfer the bees into glass vials, one or a few bees per vial, and close them.

**Chilling and harnessing.**

1. Place the vials on ice for **up to 3 minutes**, until the bees stop moving. Do not
   exceed 3 minutes, as longer chilling increases mortality.
2. Remove one bee from its vial and place it on a clean surface.
3. Using tweezers or fingers, place the bee in a PER harness with its ventral side
   against the harness and its front pair of legs free.
4. Secure the bee with thin strips of tape across the thorax. Check that the
   proboscis, head and front legs can move freely. Gorilla tape alone does not hold a
   bee; add a strap over the abdomen.
5. Place the harnessed bee in the PER holder and label its position with bee ID and
   treatment.
6. Repeat for every bee, working in small batches so bees do not warm up and become
   active mid-harnessing.
7. Let harnessed bees recover at room temperature for about **15 minutes** before
   feeding, until they are moving their antennae again.

**Feeding.** Each bee receives 5 µl of its assigned solution, given in two portions.

1. Dilute the IVT product to 200 ng/µl in 1 M sucrose with the appropriate salt
   buffers, after reading an aliquot on a Nanodrop. At 5 µl that is a **1 µg dose**.
2. Draw the solution into the microsyringe and form a 2–3 µl droplet at the tip.
3. Touch the droplet lightly to the bee's antennae to trigger proboscis extension,
   then present it to the extended proboscis.
4. If the bee does not respond, gently touch the proboscis or antennae with the tip
   to stimulate extension. Use a blunt tip and light pressure, to avoid injury.
5. Once the first droplet is fully consumed, offer the remaining 2–3 µl. **Giving all
   5 µl at once usually makes the droplet spill.**
6. Record for each bee whether the full 5 µl was consumed, and note any spillage or
   refusal.
7. Change syringe or tip between treatments, and feed controls first to avoid
   carry-over.
8. **Stagger the start of each length or treatment group by 20 minutes.** A full
   18-bee timepoint takes about 15 minutes to set up, so without the offset a 1 h
   timepoint is not 1 h.

**Post-feeding incubation and endpoints.**

1. Once all bees are fed, place the PER holders in the humid chamber inside the
   incubator at 34 °C, with a warm damp towel at the base of the tubes.
2. Leave them for the period set by the design (e.g. 3 h, 24 h, 48 h).
3. For periods over 24 h, give every bee 5 µl of plain sucrose each evening so bees
   do not starve. Garbian et al. (2012) used this step.
4. At each time point, record survival: a bee is dead if it shows no leg, antenna or
   proboscis movement when touched.
5. At the end of the period, process bees for the planned endpoint — haemolymph or
   whole-body sampling — or euthanise at −20 °C and dispose of in a biohazard bin.

**Experimental limitations.**

- **Harnessing stress.** Restraint, chilling and handling all raise mortality
  independent of treatment. Include a sucrose-only control and compare treatments
  against it, not against zero.
- **Weak responses in newly emerged bees.** Bees under 24 h old often show weak or no
  proboscis extension, so some may refuse the full dose. Record refusals and exclude
  or analyse them separately.
- **Dose uncertainty.** Spillage, partial uptake or regurgitation mean the true dose
  can be below 5 µl. Recording uptake per bee limits but does not remove this.
- **Starvation.** Harnessed bees cannot feed themselves. Without top-up feeding,
  deaths over 24–48 h may reflect starvation rather than the treatment.
- **Probing injury.** Touching the proboscis with a needle can injure it and reduce
  feeding. A blunt tip, or a sucrose touch to the antennae, is safer.
- **Unnatural setting.** Isolated, restrained bees do not behave as caged or hive bees
  do, so results may not transfer directly to colony-level delivery.

**References.** Garbian et al. (2012), _PLoS Pathogens_ 8(12): e1003035.

### Protocol: adult honeybee haemolymph extraction

**Purpose and rationale.** This protocol collects haemolymph from adult honeybees
after feeding, to test whether ingested dsRNA reaches the haemolymph. Haemolymph is
what _Varroa_ mites feed on, so dsRNA present there is available to the mite.

Haemolymph is extracted by centrifugation from the head and thorax, with the abdomen
removed so crop and gut contents cannot contaminate the sample. Garbian et al. (2012)
also sampled bee haemolymph to show dsRNA transfer from bee to mite, though they
collected it by pricking the intersegmental membrane rather than by centrifugation.
Established 3–4 July 2026; used for every adult sample afterwards. Typical yield
**8–15 µl per bee**.

**Materials and equipment.**

- Refrigerated microcentrifuge set to 4 °C
- 0.5 ml extraction tubes, each with a small hole pierced in the bottom (e.g. with a
  hot 25 G needle)
- 1.5 ml collection tubes, RNase-free
- Glass vials and an ice bucket with crushed ice
- Fine dissecting scissors and tweezers, cleaned with ethanol and an RNase
  decontaminant between bees
- Clean dissection surface, gloves
- Dry ice in an insulated box, and a −80 °C freezer
- Freezer-proof labels or marker

**Preparation.**

1. Pre-cool the empty centrifuge by running it at 4 °C for 10–20 minutes at
   6,000 rpm (setting 6).
2. Pre-label the 1.5 ml collection tubes and keep them on ice.
3. Pierce the bottom of each 0.5 ml extraction tube and seat it inside a labelled
   1.5 ml collection tube.
4. Fill the insulated box with dry ice before starting dissections.

**Chilling and dissection.**

1. Once the planned post-feeding period has elapsed, collect the harnessed bees into
   glass vials.
2. Place the vials on ice for up to 3 minutes, until the bees stop moving. (For caged
   bees, chill the cage in a freezer until the bees slow down.)
3. Remove one bee and free it from the PER harness without damaging it.
4. With dissecting scissors, **cut at the petiole** — the narrow joint between thorax
   and abdomen, between segments A1 and A2 — and discard the abdomen. This prevents
   contamination from the crop and gut, which may still hold undigested dsRNA.
5. **Cut off the tips of both antennae** to give haemolymph a second exit point. Leave
   the wings attached.
6. Place the bee head-down into its 0.5 ml extraction tube and close the cap.
7. Clean scissors and tweezers before the next bee, and repeat.

**Centrifugal extraction.**

1. Load the 1.5 ml collection tubes, each holding its extraction tube, into the
   pre-cooled centrifuge with the lids pointing towards the centre. Balance the rotor.
2. Spin for 1 minute at 4 °C, setting 6. **Record the speed in × g as well as the
   setting**, so the step can be reproduced on another centrifuge.
3. Remove the 0.5 ml extraction tubes, with the bee bodies, and discard them. To
   reuse: debris to waste, rinse in ethanol, dry.
4. Close the 1.5 ml collection tubes and note any sample with no visible haemolymph or
   with obvious contamination, such as yellow gut contents.
5. Spin the pooled sample vials again, 4 °C, 10 min, max rpm, to pellet debris, then
   take a known volume of supernatant onto ice into a chilled vial.

**Labelling and storage.**

1. Label every collection tube with the date, dosage type, dosage concentration and
   sample number, using freezer-proof labels.
2. Immediately after centrifugation, flash-freeze the tubes on dry ice, in the dark.
3. Transfer to a −80 °C freezer within 2 hours, before the dry ice evaporates.
4. Store at −80 °C until processing. Avoid repeated freeze–thaw cycles, which degrade
   RNA.

Our samples were held in a −80 °C freezer in the Oxford University physics
department, in the Kavli Institute's DCHB building, so that the dsGFP carried in the
haemolymph was not degraded by RNase enzymes. Lab-standard extraction tubes were
unavailable, so our tubes are custom — see [hardware](/hardware).

**Experimental limitations.**

- **Low yield.** Each bee gives only a few microlitres, and yield varies between bees;
  we linked it tentatively to how far up the antenna was cut (26–27 August) and did
  not resolve it. Record which samples came back empty, and consider pooling bees per
  treatment if single-bee volumes are too small.
- **Contamination.** A cut too far back can leave crop or gut tissue attached,
  carrying unabsorbed dsRNA into the sample and giving a false positive. Discard
  samples with visible gut contents.
- **Melanisation and degradation.** Haemolymph darkens quickly once exposed to air,
  and RNases degrade dsRNA. Keep everything cold, work quickly, and flash-freeze
  straight after the spin. See [measurement](/measurement) for the melanisation
  time-course and the PTU and proteinase K options.
- **Chilling and handling.** Bees are processed at slightly different times after
  feeding. **Process treatments in an alternating order** so no group is consistently
  sampled later.
- **Centrifuge settings.** "Setting 6" is specific to our machine. Without the × g
  value, others cannot reproduce the extraction.

> **TODO —** Figure: Labelled diagram of adult honeybee body segments, with the petiole
> between A1 and A2 marked as the cut point, so a reader can find it without
> having been shown.

**References.** Garbian et al. (2012), _PLoS Pathogens_ 8(12): e1003035.

### Adult bee dissection

Logged 8 July 2026.

1. Separate the abdomen from the thorax and head.
2. Vertical ventral incision along the abdomen.
3. Tweezers to remove the stinger and the gut (the gut comes out by pulling the
   stinger).
4. Entomological pins to hold the cavity open.

Fat-body extraction was **judged unnecessary**: dsRNA stability can be read from
adult haemolymph, which the centrifugal method already delivers.

## Working with larvae

### Protocol: honeybee larval feeding

**Purpose and rationale.** This protocol doses individual 5th instar honeybee larvae
with 20 µl of a test solution, delivered directly into the cell. It is used to test
whether dsRNA fed to larvae reaches the larval haemolymph, and to expose _Varroa_
mites to dsRNA through their host.

**The 5th instar is targeted because it is the last uncapped stage, when _Varroa_
foundresses enter the cell to reproduce.** Mites then feed on this larva's haemolymph
throughout the capped period.

**Materials and equipment.**

- Bee suit, veil, gloves, hive tool and smoker
- Frame stand to hold the frame horizontally
- P20 or P200 pipette with sterile tips
- Test solutions (e.g. dsRNA target, dsGFP control, sucrose-only control), labelled
- Transparent acetate sheet and coloured markers, or a camera, for mapping fed cells
- Incubator brood box and an incubator set to 34 °C

**Selecting 5th instar larvae.**

1. Open the hive and select a brood frame with many uncapped larvae next to capped
   brood.
2. Identify 5th instar larvae: **about 7–8 mm long, curved in a C-shape that fills
   the base of the cell**, and found in the uncapped cells nearest the capped brood.
3. Use the capped brood as your guide. The queen lays from the centre of the brood
   nest outwards, so larval age decreases away from the capped area, and the oldest
   uncapped larvae are 5th instar.
4. Gently brush the adult bees off the frame and lay it horizontally on the stand.

**Feeding and mapping larvae.**

1. Lay the acetate sheet over the frame and mark its corners against the frame edges,
   so it can be realigned later.
2. **Pipette 20 µl of the solution gently onto the top of the larva**, letting it pool
   in the larval food. Do not touch the larva with the tip.
3. Mark the cell on the acetate in the treatment's colour, or photograph the frame
   after each group is fed and build a coloured digital overlay.
4. Repeat for every larva. Change tips between treatments, and **spread treatments
   across the frame rather than clustering each in one area.**
5. Record the total number of larvae fed per treatment.
6. Work quickly: keep the frame out of the hive for **no more than about 15–20
   minutes**, so larvae do not chill or dry out.

**Capping and incubation.**

1. Return the frame to the same position in the hive. Nurse bees will cap the fed
   cells overnight.
2. The next day, remove the frame and check each mapped cell against the acetate.
   Record which fed cells are capped, uncapped or empty (larva removed).
3. Brush off the adult bees and place the frame in the incubator brood box.
4. Incubate at 34 °C until the planned time point for haemolymph extraction or mite
   assessment.

**Experimental limitations.**

- **Larval compromise.** Adding 20 µl of liquid and removing the frame from the hive
  can drown, chill or stress larvae. **In the main mite assay, over half of fed larvae
  were compromised in every group.** Always include a sucrose-only control and record
  larval condition at the end.
- **Nurse bee interference.** Nurse bees may remove fed larvae, or eat or redistribute
  the solution before capping. The true dose each larva receives is therefore unknown.
- **Staging error.** Instar is judged by eye, so some larvae may be 4th instar or just
  pre-capping. This changes how long they feed on the solution before capping.
- **Mapping errors.** Cells can be misidentified if the acetate shifts. Photographs
  taken at feeding are a useful cross-check.
- **Position effects.** Cells at the edge of the brood nest are cooler than those in
  the centre. Spreading treatments across the frame reduces, but does not remove,
  this bias.

### Protocol: larval and pupal extraction from brood frames

**Purpose and rationale.** These steps remove fed larvae, and the pupae that develop
from them, from their cells intact, for later dsRNA detection. **Larvae are
flash-frozen in the cell before removal, because their soft cuticle bursts easily and
contaminates the haemolymph.** Pupae have a firmer cuticle and can be removed
directly.

**Materials and equipment.**

- Brood frame with mapped, fed cells, and the cell map (acetate or photos)
- Grafting tool, fine tweezers and a scalpel blade
- Dry ice, broken into small pieces, in an insulated box
- 1.5 ml RNase-free tubes, pre-labelled
- Gloves and insulated tweezers for handling dry ice
- −80 °C freezer

**Larval extraction.**

1. Identify the fed cells using the cell map.
2. With a grafting tool, tweezers or blade, remove the wax cap from a fed cell without
   touching the larva.
3. **Place a small piece of dry ice into the open cell, against the larva, until it is
   frozen solid.**
4. Once frozen, lift the larva out with tweezers or a grafting tool. A frozen larva is
   far less likely to burst during handling.
5. If the larva does not come out cleanly, break down the cell walls around it to make
   more room.
6. Place the larva immediately in its labelled 1.5 ml tube and put the tube on dry
   ice.
7. **Record whether the larva came out intact or burst.** Burst larvae have
   contaminated haemolymph and should be marked as such.

**Pupal extraction.**

1. Identify the cells of pupae that developed from fed larvae, using the cell map.
2. Remove the wax cap without touching the pupa.
3. **Record the pupal stage from eye colour**: white-eyed (early) or pink to red-eyed
   (later). Sampling all pupae at the same stage keeps time since feeding consistent.
4. With tweezers, gently lift the pupa out by the sides of the thorax. If needed,
   break the cell walls around it to make more room.
5. Place the pupa in its labelled tube and put the tube on dry ice.

**Labelling and storage.**

1. Label every tube with the date, dosage type, dosage concentration, sample number
   and life stage (larva, or pupa with eye colour).
2. Keep tubes on dry ice throughout extraction.
3. Transfer all samples to a −80 °C freezer within 2 hours.
4. Store at −80 °C and avoid repeated freeze–thaw cycles.

**Experimental limitations.**

- **Larval bursting.** Even with flash-freezing, **30–80% of larvae burst during
  extraction**, depending on the handler's skill. Burst samples are contaminated and
  reduce the usable sample size, so feed more larvae than you need.
- **Gut contamination.** Larvae and pupae are frozen and stored whole, so any analysis
  includes gut contents. **dsRNA detected in whole-body samples may still be in the
  gut rather than the haemolymph.**
- **Staging differences.** Pupae at different eye-colour stages are at different times
  since feeding. Sample consistently by stage, or record it and account for it.
- **Thaw risk.** Larvae can partially thaw while being lifted out or transferred. Keep
  tubes on dry ice and work cell by cell.
- **Mapping errors.** Wrongly identified cells mean a sample is assigned to the wrong
  treatment. Cross-check against photos taken at feeding.

### Larval haemolymph extraction

Established 8 July 2026. Yield around 10 µl per larva. **Superseded as the primary
sampling route by whole-larva processing** — see [cycle L2](/engineering#cycle-l2) —
but recorded here because it is what a team wanting haemolymph specifically would
need.

1. Remove the larva from the frame with tweezers. Blunt tweezers are safer;
   pointed ones puncture and the haemolymph is lost instantly.
2. Vertical ventral incision just below the head segment.
3. Press gently to express haemolymph — either pinch between two fingers or
   press flat on the dissection board with bent tweezers.
4. Draw up with a P20 pipette; an entomological pin gives the purest, least
   lipid-diluted sample.
5. Transfer to an Eppendorf on ice, then flash-freeze on dry ice.

Stage matters: 5th instar works, 6th instar is too soft and bursts, and pupal
stages have lost the osmotic pressure that makes haemolymph ooze out at all.

### Larval RNA extraction

1. Place Eppendorf tubes containing larvae on dry ice.
2. Dip the tube and a metal rod in liquid nitrogen.
3. Crush the larvae until liquid; flash-freeze and crush repeatedly.
4. Split 60 µl into a 1.5 ml Eppendorf and add 1 ml TriZol reagent.
5. Add 200 µl ice-cold chloroform and shake vigorously by hand for about 15 seconds,
   until no clumps are visible and the contents are murky.
6. Let it sit 2–3 minutes at room temperature; separation should be visible, clear on
   top and pink below.
7. Centrifuge 12,000 rpm, 15 min, 4 °C. A white interface of denatured proteins
   should appear between the clear and pink layers.
8. Carefully remove about 500 µl of the clear supernatant, avoiding the white
   interface, into a fresh 1.5 ml Eppendorf.
9. Add 100 µl less ice-cold isopropanol than the volume of supernatant collected, to
   precipitate the RNA.
10. Leave 10 min at room temperature, then centrifuge 12,000 rpm, 10–15 min, 4 °C.
    A clear gel-like pellet or white smear should be visible.
11. Remove and discard the supernatant, avoiding the pellet.
12. Wash the pellet with 1 ml of 70–75% ethanol.
13. Centrifuge 9,500 rpm, 5 min, 4 °C.
14. Remove as much ethanol as possible without disrupting the pellet, and air-dry
    5–10 min at room temperature with the cap open. **Do not dry fully**, or the
    pellet becomes difficult to resuspend.
15. Resuspend in 30 µl RNase-free water.
16. Nanodrop, then store at −80 °C for downstream applications.

**Sample pooling, as we ran it.** Remove the tubes from −80 °C onto dry ice; working
one sample at a time, dip the Eppendorf in liquid nitrogen to flash-freeze, then
homogenise with a metal rod dipped in dry ice until smooth. Pool the contents into a
2 ml Eppendorf, mix thoroughly, and split into 8 × 1.5 ml tubes of approximately 60 µl
each. That pooling is what makes the method-variance comparison in
[cycle 3.1](/engineering#cycle-3-1) a method comparison rather than a biological one.

Failure modes we hit: the standard blood protocol makes a "goop" of larval
tissue (too much tissue for the method — **switch to a tissue protocol**); one
sample threw a large white pellet on Vezol addition and needed extended
incubation and pre-homogenisation before the column; and persistently low
260/230 ratios traced to too small an ethanol wash, fixed by going to a full 1×
volume and drying with the lid open.

> **TODO —** The Vazyme silica-column (Vezol) protocol is the one we adopted on
> variance, and our own write-up of it breaks off after the chloroform step. Write it
> out in full beside the phenol-chloroform version above. Owner: wet lab.

## Downstream processing

### Adult haemolymph RNA processing

RNA extracted from pooled haemolymph with Vazyme Vezol under the manufacturer's
**blood** protocol (fluid, not tissue), spin-column purified, quantified by
Nanodrop. Purified RNA is then heated to 95 °C and crash-cooled on ice to
denature the duplex so primers can anneal, reverse transcribed with random
hexamers, and the cDNA amplified with construct-specific primers. Amplicons run
on a 1.5% agarose gel against a no-dsRNA water negative and a known-GFP
positive. The gel is the readout: a band at the anticipated size is **qualitative
evidence of dsRNA persistence** in the adult haemolymph at that timepoint, and
nothing more than qualitative.

### Reverse transcription

1. Put 5 µl Vazyme 4× All-in-One Ultra qRT Supermix into a PCR tube.
2. Add template RNA and make up to 20 µl with RNase-free ddH₂O.
3. Mix gently with a pipette.
4. Run: 50 °C for 10 min, then 85 °C for 5 s, then hold at 4–16 °C.

### qPCR

Vazyme 2× Taq Pro Universal SYBR qPCR master mix, stored away from light at
2–8 °C. Per 20 µl well, in technical triplicate:

| Component | Volume |
| --- | --- |
| Master mix | 10 µl |
| Each primer (10 µM) | 0.4 µl |
| cDNA (relative qPCR) | 2 µl |
| ddH₂O | to 20 µl |

Run a housekeeping-gene primer pair in parallel for relative qPCR. For absolute
qPCR on haemolymph, build a standard curve by spiking haemolymph with a known
RNA concentration, 1:10 serial dilution, reverse transcribe as above, triplicate
each point.

Cycle: 95 °C 30 s (1×); then 40× [95 °C 10 s, annealing ~60 °C 30 s]; then a
melt step at the machine's default settings.

Practical notes: pipetting error in qPCR setup was high enough to need a
technique fix (shallow tip immersion) plus extra replicate wells; suspected
primer dimers around 100 bp needed a dedicated investigation; some runs failed
with "no amplification" and were redone.

## Working with mites

### Protocol: Varroa sugar shake

Dusting brood frames with icing sugar makes _Varroa_ mites lose their grip on bees
and drop onto a tray below the hive, where they can be counted or collected.

**Materials.** Icing sugar (about one cup per hive) · sugar duster, or a cup and
sieve · spoon · collection tray to fit under the hive floor · hive tool, smoker, bee
suit and gloves.

**Steps.**

1. Slide the collection tray under the hive floor.
2. Measure out one cup of icing sugar.
3. Open the hive down to the queen excluder, leaving it in place. Smoke the brood
   frames through it and let the bees settle.
4. Remove the queen excluder and lift out one brood frame.
5. Dust both sides of the frame and its bees with icing sugar, using the duster or the
   cup and sieve. Return the frame to the brood box.
6. Repeat for every brood frame.
7. Replace the queen excluder and supers, and close the hive.
8. After **20–30 minutes**, remove the tray and count or collect the mites. Fine
   paintbrushes are useful for picking mites up.

**Limitations.**

- Only phoretic mites on adult bees are dislodged. **Mites inside capped brood cells
  are missed**, so counts underestimate total infestation.
- Mites collected this way are coated in sugar and have been stressed, which may raise
  baseline mortality in later assays.
- Counts depend on how evenly sugar is applied, so keep the method the same between
  hives and dates.
- It **fails outright in the wet**: on 2 September the sugar clumped and stuck to bees
  and frames rather than shaking off.

### Protocol: mite soaking, reacclimatisation and pupal rearing

**Purpose and rationale.** This assay exposes _Varroa_ mites directly to dsRNA by
soaking them in solution, then measures their survival after 24 h on a host pupa.
Soaking delivers dsRNA without injection, following Campbell et al. (2010) and
Becchimanzi et al. (2020). **Only mites that recover from soaking go on to the 24 h
test**, so mortality reflects the treatment rather than soaking damage. Our pilots
found baseline mortality was lowest when soaked mites were reared on white-eyed pupae
in gelatin capsules.

**Materials and equipment.**

- Adult female _Varroa_ mites, freshly collected by sugar shake
- Soaking solutions in 0.9% NaCl: dsRNA target(s), dsGFP control, and saline-only
  control
- 2 ml Eppendorf tubes, one per group of 10 mites
- Fine paintbrush
- Petri dishes lined with damp filter paper, for reacclimatisation
- White-eyed worker pupae, freshly removed from capped brood
- Gelatin capsules (size 00), with small ventilation holes
- Incubator set to 32 °C and 80% RH, in the dark
- Stereo microscope and a record sheet with one row per capsule

**Soaking.**

1. Pipette 20 µl of soaking solution into the bottom of a labelled 2 ml Eppendorf
   tube. Ensure every tube is labelled.
2. With a fine paintbrush, transfer **10 active adult female mites** into the
   solution.
3. Check under the microscope that every mite is fully submerged. Push any floating
   mites under with the brush.
4. Close the tube and soak for **6 hours**. Record the soaking temperature (Campbell
   et al. 2010 soaked at 4 °C).
5. **Soak enough tubes per treatment to allow for losses: in our assays only about
   20% of mites survived a 6 h soak.** The standing rule is to soak three to four
   times as many mites as the experiment needs.

**Reacclimatisation and selection.**

1. After soaking, tip the mites onto damp filter paper in a labelled Petri dish, one
   dish per treatment.
2. Leave them to recover, typically for 1 hour, in the incubator at 32 °C and 80% RH.
   Mites can take **five or more hours to wake**, which is what makes a large
   single-day screen impractical.
3. Select only mites that have recovered: walking normally, or moving their legs when
   touched with the brush.
4. **Record the number soaked and the number recovered for every tube.** Differences
   in recovery between treatments are data too, and belong in the results.

**Pupal rearing and 24 h incubation.**

1. Place one white-eyed pupa in each labelled gelatin capsule.
2. With the paintbrush, place one recovered mite on each pupa, legs down against the
   cuticle, so it can start feeding.
3. Close the capsule.
4. Incubate all capsules at **32 ± 1 °C and 80 ± 2% RH, in the dark, for 24 hours**,
   following Becchimanzi et al. (2020).

**Scoring mite mortality.**

1. After 24 hours, open each capsule and check the mite under the stereo microscope.
2. Touch it gently with the paintbrush. Score it **alive if any leg moves, and dead if
   there is no movement after repeated touches.**
3. Record the pupa's condition (healthy, darkened or dead) alongside the mite's
   status.
4. Compare the proportion of dead mites between treatments with Fisher's exact test,
   using the saline and dsGFP groups as controls.

**Experimental limitations.**

- **Soaking mortality.** Our 6 h soak killed far more mites than the 75–80% survival
  Campbell et al. (2010) reported after an overnight soak at 4 °C. Soak temperature
  and handling are likely causes.
- **Baseline mortality.** Even on pupae, a high proportion of control mites can die
  within 24 h. Always compare treatments against the saline and dsGFP controls, not
  against zero.
- Minimise or avoid the pre-soak wash in a petri dish; it appears to raise mortality.

**References.** Becchimanzi A, et al. (2020), _PLoS Pathogens_ 16(12): e1009075,
[doi:10.1371/journal.ppat.1009075](https://doi.org/10.1371/journal.ppat.1009075) ·
Campbell EM, Budge GE, Bowman AS (2010), _Parasites & Vectors_ 3: 73.

### Protocol: brood-frame rearing mite death assay

**Purpose and rationale.** This assay tests whether dsRNA fed to honeybee larvae kills
_Varroa_ mites that then feed on those larvae. Each 5th instar larva is dosed with
20 µl of test solution, capped by nurse bees, given a single mite, and mite survival
is scored after incubation.

Larvae are dosed at the 5th instar because this is when _Varroa_ naturally enters the
cell. **Dosing the host, rather than soaking the mite, means mites acquire dsRNA by
feeding on haemolymph, as they would in the field.** Dosing age can be varied to test
dsRNA stability at earlier developmental stages, depending on experimental design.

**Materials and equipment.**

- Brood frame with many 5th instar larvae, assessed with the help of an experienced
  apiarist
- Sterilised brood box for transport, and an incubator brood box
- Frame stand
- P20 or P200 pipette with sterile tips
- Test solutions, e.g. dsRNA targets at two concentrations, dsGFP control and
  sucrose-only control, labelled
- Acetate sheet and coloured markers, or a camera, for mapping cells
- _Varroa_ mites freshly collected by sugar shake
- Fine paintbrush or cotton bud, grafting tool, scalpel blade
- Hand lens for scoring mites
- Incubator set to 34 °C, and a record sheet with one row per cell

**Dosing 5th instar larvae.**

1. Open the hive and select a brood frame with many 5th instar larvae: about 7–8 mm
   long, C-shaped, in the uncapped cells closest to capped brood.
2. Brush off adult bees and carry the frame to the lab in the sterilised brood box.
   Place it on the frame stand.
3. Pipette 20 µl of the assigned solution gently onto the top of each larva, without
   touching it.
4. Mark every fed cell on the acetate, or photograph it and draw it in the treatment's
   colour on a digital overlay. **Spread treatments across the frame rather than
   clustering them together** — this is a crucial point of advice that must be
   followed, even if additional frames containing 5th instar larvae must be used.
5. **Dose at least 40 larvae per treatment**, as more than half may be lost to larval
   compromise or missing mites.
6. Return the frame to the hive within about 45 minutes. Nurse bees will cap the fed
   cells overnight.

**Introducing mites.**

1. After 24 h, collect the frame from the hive in an incubator brood box. Record which
   fed cells are capped.
2. Collect mites by sugar shake on the same day, and keep them in incubator
   conditions.
3. Choose only **active, mobile adult female mites**.
4. With a grafting tool or blade, **make a small slit in the wax cap** of each capped
   fed cell. Do not remove the cap completely, as this exposes the larva to pathogens
   and increases the chance of it becoming compromised.
5. Using a fine paintbrush or cotton bud, place one mite through the slit into each
   cell.
6. Press the wax back over the slit to reseal the cell.
7. Record the cell ID, treatment and time of introduction.

**Incubation.** Place the frame in the incubator brood box at 34 °C and 60–80%
relative humidity, in the dark, for the planned assay period. **The main assay used
96 hours**; shorter periods (24–72 h) can be used to track mortality over time.

**Scoring mite mortality.**

1. At the end of the assay period, uncap each treated cell fully with a grafting tool
   or blade.
2. Remove the larva or pupa and record whether it is **healthy or compromised**
   (discoloured, collapsed, or dead).
3. Find the mite and touch it gently with the paintbrush. Score it alive if any legs
   or chelicerae move, and dead if there is no movement after repeated touches. Use a
   stereo microscope or magnifying glass if unsure.
4. Record for each cell: the number of dead and live mites; whether the original adult
   female (foundress) was found and whether offspring were present; whether the larva
   or pupa was compromised, meaning it had started to decompose, visible by
   increasingly melanised haemolymph; and cells where no mite was found.
5. Analyse mortality per foundress, with one mite per cell as the unit, and **report
   larval compromise and missing mites for every treatment.**

**Experimental limitations.**

- **Larval compromise.** In the main assay, over half of larvae were compromised in
  every group, and **96% of mites in compromised larvae died**. Mite death may reflect
  host failure rather than dsRNA, so always compare against sucrose and dsGFP
  controls.
- **Missing mites.** 30–50% of cells yielded no mite. Whether these mites died,
  escaped or were removed is unknown, which can bias mortality estimates.
- **Mite reproduction.** Foundresses can lay eggs, so a cell may hold several mites
  with different exposure. Score the foundress separately from offspring.
- **Uncertain dose.** Nurse bees may consume or redistribute the solution before
  capping, so the dose each larva retains is unknown.
- **Handling stress.** Sugar shaking and transfer stress mites, raising baseline
  mortality. Use mites on the day of collection and select only active ones.
- **Novel method.** Dosing the larval host at the pre-capping window is not, to our
  knowledge, an established protocol, so **there are no published baseline mortality
  figures to compare against.**

> **TODO —** Protocols still owed as written documents: the mite drying step and the
> baseline post-soak survival estimate; mite RNA extraction; and larval dsRNA storage.
> Owner: bee lab.

## Where this connects

[Bee lab](/bee-lab) · [Bee lab lab book](/bee-lab-labbook) ·
[Bee research guide](/working-with-bees) · [Hardware](/hardware) ·
[Measurement](/measurement) · [Results](/results) · [Contribution](/contribution)
