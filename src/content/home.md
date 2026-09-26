NECTAR is an **end-to-end platform** for designing, validating, producing and
deploying RNAi interventions. _Varroa destructor_ is the first real-world case
study through which we demonstrate and stress-test the platform.

> **FIGURE: hero.** The pipeline in one image, readable in ten seconds:
> pest → target RNA → NECTAR designs it → yeast produces it → formulation
> delivers it → RNAi silences the pest. Two ways in underneath, one into
> [the project](/project-description), one straight to [the evidence](/results).

[Explore NECTAR](/project-description) · [See our results](/results)

## Why this matters

Pests cost us an enormous amount, the chemistry we use against them is **running
out of road**, and the damage that chemistry does is not confined to the field it
was sprayed on.

```component
headline-stats
```

> **TODO —** Three claims maximum here; the component shows four, and every
> tile is `[FLAG]` because our own jamboree slide is not a source. Cite each in
> `src/components/HeadlineStats.tsx` and swap the tag to `[LIT]`, or drop the
> tile. The global pesticide-spend figure the team wants alongside these is
> still to be pulled from the human-practices work. Owner: HP.

## Why RNAi is not already everywhere

Six barriers sit between RNAi and the field:

- **Rational target selection** — which gene to silence is the first hard problem.
- **Off-target screening** — a sequence that hits the pest may hit something else.
- **Single-target resistance** — one target is one mutation away from failing.
- **Manufacturing cost** — the RNA has to be cheap enough to use at field scale.
- **Environmental degradation** — RNA does not last long outside a cell.
- **Inefficient delivery** — the RNA still has to get inside the pest.

They are the spine of [the project description](/project-description) and the
reason the platform is shaped the way it is.

## Our solution

NECTAR treats those six barriers as one pipeline rather than six unrelated
problems. The novel core is the **RNA design method**: yeast-delivered dsRNA
against _Varroa_ is anticipated by prior patents, and we say so on
[the project description](/project-description) rather than claiming it.

1. **dsRNA design** — [RNA design](/software)
2. **Engineering yeast** — [yeast](/wet-lab-experiments#yeast-production)
3. **Optimised delivery: the hive insert** — [bee lab](/bee-lab)
4. **Measurement and validation** — [measurement](/measurement)

> **FIGURE: system diagram.** The four-part stack as one image, each stage
> labelled with the barrier it answers.

## Our first use case

Varroa → bee → pollen patty → nurse bee and larva → mite. A mite feeding on a
bee inside a sealed hive is an awkward place to deliver an RNA, and therefore a
good place to find out **whether the platform works**.

```component
varroa-map
```

Reported colony losses by country and year. [Case studies](/case-studies) reads
the map and explains what it does and does not show.

## What we actually achieved

| What we did                                     | Status  | Evidence            |
| ----------------------------------------------- | ------- | ------------------- |
| Designed candidate RNAs                          | TODO    | [RNA design](/software)       |
| Built modular dsRNA constructs                   | TODO    | [Parts](/parts)               |
| Measured dsRNA uptake and stability              | TODO    | [Measurement](/measurement)   |
| Developed NectarDesigner                         | TODO    | [RNA design](/software)       |
| Engineered and tested the yeast production system| TODO    | [Yeast](/wet-lab-experiments#yeast-production)               |
| Modelled industrial production and colony impact | TODO    | [Modelling](/model)           |
| Integrated stakeholder feedback into deployment  | TODO    | [Human practices](/human-practices) |

> **TODO —** Every status above is unset on purpose. [Results](/results) carries
> no result blocks yet, so no card here may yet be called **Demonstrated**,
> **Investigated**, **Modelled** or **Proposed**. Fill each status from the
> matching result block, add the count to "designed candidate RNAs", and delete
> this note. No card may claim more than [Results](/results) supports.
> Owner: team lead.

## Where to go next

[Project description](/project-description) · [Results](/results) ·
[Engineering](/engineering) · [NECTAR in the real world](/human-practices)
