```component
bee-importance
```

```component
varroa-slide
```

```component
treatments-slide
```

> **TODO —** Slide three shows the jamboree deck's "2.0 billion dollars" as
> `[FLAG]`: no published source has been traced for it. Find one, or replace
> it with the sourced "over $600 million" estimate for the June 2024 to March
> 2025 US losses (Project Apis m., 3 April 2025), and swap the tag in
> `src/components/VarroaSlide.tsx`. The slide says "every year", but the 1.6
> million colonies are one ten-month season (June 2024 to March 2025), and it
> credits all of them to varroa, where USDA ARS found varroa-borne viruses in
> every colony it sampled: reword, or find an annual, varroa-attributed figure.
> Add a link for the Project Apis m. survey. Owner: dry lab.
>
> **TODO —** Figure: slide three's chart, global temperature and varroa mites,
> 1950 to 2026, on one plot: temperature on the left scale, mites on the
> right. Both series are estimates set
> down for the layout and the chart says so. Temperature: replace with NASA
> GISTEMP v4 annual global anomaly against 1951 to 1980 and cite it. Mites:
> decide what is counted (spread by country, mites per colony, infested share
> of colonies) and find a published series, or cut the series. Edit the two
> arrays at the top of `src/components/VarroaSlide.tsx` and drop the `[FLAG]`
> under the chart. Owner: dry lab.
>
> **TODO —** Slide four's bee clip, `bee_with_mite_stacked.mp4`, is served from
> the gitignored `public/local/` and needs a home before the freeze that keeps
> its transparency: a Video Universe embed is an iframe with its own
> background, so it cannot sit over the claim. It is a plain H.264 `.mp4`
> with its alpha stacked under the picture, which the page recombines, so it
> plays transparent in Safari as well (`src/components/AlphaClip.tsx`). Ask
> iGEM whether it may go through Uploads, and check it on a Mac and an iPhone.
> The "100%" is from the Lamas et al. 2025 bioRxiv
> preprint (39 mites, five operations): before the freeze, check whether a
> peer-reviewed version is out and cite that instead. Owner: wiki.
>
> **TODO —** Slide five's experiment count ("hundreds of experiments") and
> bee-lab hours ("1200+ hours") are not yet recorded anywhere in the team's
> sources, so both carry `[FLAG]`. Tally them from the wet-lab and bee-lab
> journals, record where the numbers came from, and drop the tags in
> `src/components/RnaiChallenges.tsx`. The fold clip
> (`public/local/vdchibin_fold.mp4`, local only) needs a caption saying what
> structure it shows and what made it, a re-recording without the mouse
> cursor, and a Video Universe upload before the freeze. Owner: wiki.
>
> **TODO —** The deck's "100% of agricultural land at risk of pesticide pollution by
> 2050" is still uncited and off the page; it returns as a slide once sourced.
> Slide two's food line is `[CALC]` from `references/food/Food_Data.csv`, which
> records no source: name the population and kcal-per-head series it was taken
> from, and the source of the 3,050 kcal a head assumed for 2050 (the 9.7
> billion is UN World Population Prospects 2024). Cite both under the chart in
> `src/components/BeeImportance.tsx`. Owner: dry lab.
> The sections below are the old skeleton, kept until they become slides or
> move to [the project description](/project-description). Owner: HP.

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

> **TODO —** Figure: system diagram. The four-part stack as one image, each stage
> labelled with the barrier it answers.

## What we actually achieved

| What we did                                     | Status  | Evidence            |
| ----------------------------------------------- | ------- | ------------------- |
| Designed candidate RNAs                          | TODO    | [RNA design](/software)       |
| Built modular dsRNA constructs                   | TODO    | [Parts](/results#parts)               |
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
