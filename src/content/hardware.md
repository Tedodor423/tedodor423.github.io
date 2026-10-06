Everything on this page was **built rather than pipetted**. Most of it exists
because a measurement was otherwise impossible: we could not afford the dsRNA a
standard feeder consumes, we could not tell consumption from evaporation, and the
lab had no extraction tubes.

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

**The comparison it made possible.** Five feeding-vessel forms — three
orientations, with the 20-gauge feeding hole in the top or in the bottom — were run
on the same weigh–fill–incubate–reweigh method, 250 µl of 1 M sucrose per PCR tube,
mini-cages of 15 bees over 24 h, across five adaptor combinations with two repeats
of four tubes:

| Orientation | 20-gauge hole |
| --- | --- |
| Horizontal | Top |
| Horizontal | Bottom |
| Tilted | Top |
| Tilted | Bottom |
| Vertical | Top |

The single question put to all five was **which form loses the least volume of
sucrose to spillage and evaporation**, and so most accurately reflects real bee
uptake. The feeding pilot itself ran four candidate designs — horizontal, tilted,
vertical and the cut-up 2 ml Eppendorf — and **lost two of them to handling
failures** before any 24 h reading. The comparison was ultimately abandoned; see
[the bee lab](/bee-lab) for why.

**Limitation.** A number of the printed adaptors had minor print defects. They
were usable, but they **may have added variance** between nominally identical tube
replicates, which matters in an assay whose whole point is measuring small mass
differences.

**Not built.** A translucent, autoclave-safe resin for reusable feeding tubes
was costed at about £150 (11 July) and held off pending the first sucrose trial
results. It was never ordered. **Proposed.**

> **TODO —** Figure: The batch of 3D-printed PCR-tube feeding adaptors, laid out so
> the count and the print quality are both visible.

> **TODO —** Figure: An adaptor holding a PCR tube in the wall of a feeding cage, with
> the tube angled down, showing how a bee reaches the solution.

> **TODO —** Print file, material and printer model for the adaptor, so another
> team can reproduce it. Owner: bee lab. The STL should be uploaded to
> `static.igem.wiki` and linked here.

## The feeding cages — **Demonstrated**

Fifteen nutrition assay boxes, four feeding tubes each, **15 bees per box**, used
for the salt-concentration trial and the vessel comparison. Commercial boxes,
modified: only three of the four tube holes were factory-drilled, so the fourth
was taped over. One box was run **without bees** in every session, as the
evaporation control.

> **TODO —** Figure: The honeybee cage feeder setup as it ran: a box with its four
> tubes in place, so the hole spacing and the taped fourth hole are visible.

**Two failure modes** worth passing on. Air bubbles form while filling a tube and
are almost impossible to correct once formed — empty and refill instead.
Forcing a fresh tube into an already-crowded cage causes major spillage, and the
fix is to discard that cage and move the bees to a new one rather than persist
with a compromised seal.

## The PER feeding and incubation rig — **Demonstrated**

The apparatus that replaced the cages, and the one that delivered every dose on
this project. Live bees are strapped into tubes with the head and thorax
protruding and fed from the tip of a **19-gauge syringe**. Gorilla tape alone did
not hold them — bees slipped out repeatedly on 14 July — so **a strap over the
abdomen** was added. Incubation is a sealed plastic container with a warm, wet
towel at the base of the tubes, standing in for in-hive temperature and humidity.

> **TODO —** The write-up lists the PER assay as bee-lab hardware but records no
> tube type, restraint material, dimensions or assembly drawing, so it cannot yet
> be rebuilt from this page. Owner: bee lab.

## The hive insert — **Investigated**

A **triagonal yeast-feeding insert**, designed by Theo, printed, and used in our
bee lab hives. It is the delivery end of the platform: the part that would
present a yeast-produced formulation to a colony rather than to a caged group.

> **TODO —** Figure: CAD render of the triagonal hive insert, with its dimensions and
> the frame position it occupies.

> **TODO —** Figure: The printed insert in place in a bee lab hive, photographed so
> the fit to a standard frame is visible.

> **TODO —** The design brief, dimensions, material, iteration dates and what
> the colony actually did with the insert are not written up, and no performance
> data was recorded. Until they are, this is a built object without a test
> result. Owner: Theo, with bee lab.

## The custom centrifuge tube — **Demonstrated**

Built because lab-standard extraction tubes were not available in our workspace
and could not be found when needed (16 July). A **PCR tube nested in an Eppendorf**:
the adult bee's head and thorax go head-first into the PCR tube, the assembly is
spun, and haemolymph collects in the outer tube.

It works. The centrifugal extraction protocol built on it returns **8–15 µl of
haemolymph** per adult bee, and every adult sample in the project came through it.
Full protocol on [the bee lab notebook](/bee-lab-labbook).

> **TODO —** Figure: Labelled diagram of the custom centrifuge tube: PCR tube inside
> Eppendorf, with the bee's orientation and where the haemolymph collects.

## Where this connects

[Bee lab](/bee-lab) · [Bee lab notebook](/bee-lab-labbook) ·
[How to work with bees](/working-with-bees) ·
[NECTAR user manual](/user-manual) · [Yeast engineering](/wet-lab-experiments#yeast-production) ·
[Human practices](/human-practices) · [Entrepreneurship](/entrepreneurship)
