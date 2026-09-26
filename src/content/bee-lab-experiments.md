> **What this page proves:** that the bee-lab methods are written down in
> enough detail for another team to repeat them.
> **Where the evidence is:** [the bee lab](/bee-lab) and
> [the bee lab lab book](/bee-lab-labbook).

The protocols the bee lab ended up using. [The bee lab page](/bee-lab) is the
argument, [the lab book](/bee-lab-labbook) is the dated record, and this is
**the method between them**. Practical technique distilled out of the entries,
the advice rather than the steps, is on
[the bee research guide](/working-with-bees).

Protocols here are the versions we settled on. Where an earlier version failed,
the failure stays in [the lab book](/bee-lab-labbook) rather than being quietly
deleted.

> **TODO —** The specific _Varroa_ gene target is withheld pending confirmation
> of the patent priority filing date against the 21 October freeze. Restore it
> once the disclosure moratorium lifts. Owner: team lead.

> **TODO —** Protocols still owed as written documents: PER assay, adult feeding
> experiment, box assay to PCR-tube adaptation, mite rearing, mite RNA
> extraction. Owner: bee lab.

> **PDF —** Complete bee-lab protocol set, uploaded to `static.igem.wiki` and
> linked here. Owner: bee lab.

## Protocols

### Centrifugal haemolymph extraction, adult bees

Established 3–4 July 2026; used for every adult sample afterwards. Typical yield
**8–15 µl per bee**.

1. Label sample vials.
2. Pre-cool the empty centrifuge: 4 °C, 10–20 min, 6,000 rpm.
3. Load open collection vials and open extraction tubes.
4. Chill the bee cage in a freezer until the bees slow down.
5. Per bee: cut off the abdomen at the petiole, cut off the antennae (no need to
   pull them out), leave the wings attached, place the bee head-first into the
   extraction tube, close the lid.
6. When the tubes are full, spin 1 min at speed 6.
7. Remove and clean each extraction tube: debris to waste, rinse in ethanol, dry.
8. Repeat until the sample is fully pooled.
9. Spin the sample vials again, 4 °C, 10 min, max rpm, to pellet debris.
10. Remove a known volume of supernatant onto ice, into a chilled vial.
11. Add solvent at the required % v/v.
12. Store at −80 °C.

Notes. Yield varies with how far up the antenna is cut (26–27 August); no firm
cause was established, and pooling was used to absorb the variance. Lab-standard
extraction tubes were unavailable, so the tubes are custom — see
[Hardware](/hardware).

### Adult bee dissection

Logged 8 July 2026.

1. Separate the abdomen from the thorax and head.
2. Vertical ventral incision along the abdomen.
3. Tweezers to remove the stinger and the gut (the gut comes out by pulling the
   stinger).
4. Entomological pins to hold the cavity open.

Fat-body extraction was **judged unnecessary**: dsRNA stability can be read from
adult haemolymph, which the centrifugal method already delivers.

### Larval haemolymph extraction

Established 8 July 2026. Yield around 10 µl per larva.

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
5. Add 200 µl chloroform and shake vigorously for about 15 seconds, until no
   clumps are visible and the contents are murky.
6. Centrifuge 12,000 rpm, 15 min, 4 °C.
7. Transfer roughly 500 µl of supernatant to a fresh tube and add 100 µl less
   isopropanol to precipitate the RNA.
8. Leave 10 min at room temperature, then centrifuge 12,000 rpm, 15 min, 4 °C.
   A pellet or white smear should be visible.
9. Remove the isopropanol, avoiding the pellet.
10. Wash the pellet with 1 ml 70% ethanol.
11. Centrifuge 9,500 rpm, 5 min, 4 °C.
12. Discard the alcohol and air-dry the pellet 5–10 min at room temperature.
13. Resuspend in 30 µl RNase-free water.
14. Nanodrop to check concentration.

Failure modes we hit: the standard blood protocol makes a "goop" of larval
tissue (too much tissue for the method — **switch to a tissue protocol**); one
sample threw a large white pellet on Vezol addition and needed extended
incubation and pre-homogenisation before the column; and persistently low
260/230 ratios traced to too small an ethanol wash, fixed by going to a full 1×
volume and drying with the lid open.

### Adult haemolymph RNA processing

RNA extracted from pooled haemolymph with Vazyme Vezol under the manufacturer's
**blood** protocol (fluid, not tissue), spin-column purified, quantified by
Nanodrop. Purified RNA is then heated to 95 °C and crash-cooled on ice to
denature the duplex so primers can anneal, reverse transcribed with random
hexamers, and the cDNA amplified with construct-specific primers. Amplicons run
on a 1.5% agarose gel against a no-dsRNA water negative and a known-GFP
positive.

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

### Mite collection by sugar shake

Dust brood frames on both sides with sieved powdered sugar, frame by frame, then
shake the mites off. Works in dry conditions and **fails in the wet**, where the
sugar clumps and sticks to bees and frames (2 September, Hive 26). Fine
paintbrushes are useful for picking mites up.

### Mite soaking and housing

As run on 3 September: wash mites in 0.9% NaCl in a petri dish, transfer to
30 µl of 0.9% NaCl in Eppendorf tubes at 10 mites per tube, soak 6 hours, then
place into the housing being tested. Two standing corrections came out of later
runs — minimise or avoid the pre-soak wash, which appears to raise mortality;
and soak **three to four times as many** mites as the experiment needs.

> **TODO —** Protocols still owed as written documents: PER assay, adult feeding
> experiment, box assay to PCR-tube adaptation, mite rearing, mite RNA
> extraction. Owner: bee lab.

> **PDF —** Full protocol set for download, uploaded to `static.igem.wiki`. The
> page carries the summaries; the PDF carries every step.

## Where this connects

[Bee lab](/bee-lab) · [Bee lab lab book](/bee-lab-labbook) ·
[Bee research guide](/working-with-bees) · [Hardware](/hardware) ·
[Measurement](/measurement) · [Results](/results) · [Contribution](/contribution)
