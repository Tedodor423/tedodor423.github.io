> **What this page proves:** that the physical parts of NECTAR were designed,
> printed and used in a working bee lab, and that each design choice traces to a
> measurement problem it solved.
> **Where the evidence is:** [the bee lab](/bee-lab) and
> [the bee lab notebook](/bee-lab-labbook).

Everything on this page was **built rather than pipetted**. Three of the four items
exist because a measurement was otherwise impossible: we could not afford the
dsRNA a standard feeder consumes, we could not tell consumption from
evaporation, and the lab had no extraction tubes.

Two different objects are called an "insert" in our own notebook. The **feeding
adaptor** holds a PCR tube in a cage wall. The **hive insert** is a separate,
larger part that goes into a hive. They are described separately below.

## The PCR-tube feeding adaptor — **Demonstrated**

**The problem.** Our first feeder was a perforated 2 ml Eppendorf tube. Filling
one to the brim at working concentration would need more dsRNA than our
in-vitro transcription pipeline could produce for each of the cages we wanted to
run.

**The design.** Down-scale the vessel to a standard PCR tube and print an
adaptor that holds it in the cage wall in place of the Eppendorf. The tube is
off-the-shelf and disposable; only the adaptor is custom.

**The build.** Printed at roughly 0.05 mm printer precision. A batch of 66
adaptors took about 1.5–2 hours to print (21 July 2026). Before the adaptors
arrived, hand-made equivalents were used: an Eppendorf cut just below the 1.5 ml
mark, a hole in the top for a PCR tube to pass through, and two small side holes
in the PCR tube matching the standard feeding-tube hole size (10 July).

**The comparison it made possible.** Four feeding-vessel forms were run on the
same weigh–fill–incubate–reweigh method, 30 bees per cage over 24 h, across six
adaptor combinations with two repeats of four tubes:

| Form | Why it was tested |
| --- | --- |
| Vertical PCR tube | Baseline orientation |
| Flat-lying PCR tube | Least headspace, suspected lowest evaporation |
| Angled-down PCR tube | Compromise between bee access and spillage |
| Perforated 2 ml Eppendorf | The original design, as control |

**Limitation.** A number of the printed adaptors had minor print defects. They
were usable, but they **may have added variance** between nominally identical tube
replicates, which matters in an assay whose whole point is measuring small mass
differences.

**Not built.** A translucent, autoclave-safe resin for reusable feeding tubes
was costed at about £150 (11 July) and held off pending the first sucrose trial
results. It was never ordered. **Proposed.**

> **FIGURE —** The batch of 3D-printed PCR-tube feeding adaptors, laid out so
> the count and the print quality are both visible.

> **FIGURE —** An adaptor holding a PCR tube in the wall of a 30-bee cage, with
> the tube angled down, showing how a bee reaches the solution.

> **TODO —** Print file, material and printer model for the adaptor, so another
> team can reproduce it. Owner: bee lab. The STL should be uploaded to
> `static.igem.wiki` and linked here.

## The 30-bee feeding cages — **Demonstrated**

Fifteen nutrition assay boxes, four feeding tubes each, 30 bees per box, used
for the salt-concentration trial and the vessel comparison. Commercial boxes,
modified: only three of the four tube holes were factory-drilled, so the fourth
was taped over.

**Two failure modes** worth passing on. Air bubbles form while filling a tube and
are almost impossible to correct once formed — empty and refill instead.
Forcing a fresh tube into an already-crowded cage causes major spillage, and the
fix is to discard that cage and move the bees to a new one rather than persist
with a compromised seal.

## The hive insert — **Investigated**

A **triagonal yeast-feeding insert**, designed in-house, printed, and used in our
bee lab hives. It is the delivery end of the platform: the part that would
present a yeast-produced formulation to a colony rather than to a caged group.

> **FIGURE —** CAD render of the triagonal hive insert, with its dimensions and
> the frame position it occupies.

> **FIGURE —** The printed insert in place in a bee lab hive, photographed so
> the fit to a standard frame is visible.

> **TODO —** The design brief, dimensions, material, iteration dates and what
> the colony actually did with the insert are not written up, and no performance
> data was recorded. Until they are, this is a built object without a test
> result. Owner: bee lab and the insert's designer.

## The custom centrifuge tube — **Demonstrated**

Built because lab-standard extraction tubes were not available in our workspace
and could not be found when needed (16 July). A **PCR tube nested in an Eppendorf**:
the adult bee's head and thorax go head-first into the PCR tube, the assembly is
spun, and haemolymph collects in the outer tube.

It works. The centrifugal extraction protocol built on it returns **8–15 µl of
haemolymph** per adult bee, and every adult sample in the project came through it.
Full protocol on [the bee lab notebook](/bee-lab-labbook).

> **FIGURE —** Labelled diagram of the custom centrifuge tube: PCR tube inside
> Eppendorf, with the bee's orientation and where the haemolymph collects.

## Where this connects

[Bee lab](/bee-lab) · [Bee lab notebook](/bee-lab-labbook) ·
[How to work with bees](/working-with-bees) ·
[NECTAR user manual](/user-manual) · [Yeast engineering](/wet-lab-experiments#yeast-production) ·
[Human practices](/human-practices) · [Entrepreneurship](/entrepreneurship)
