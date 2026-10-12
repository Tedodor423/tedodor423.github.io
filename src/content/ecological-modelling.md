Untreated, every hive profile we modelled collapsed within 3 years, with cumulative
honey production down to a third of an uninfested hive's. A treatment that kills
mites in a dish has still to be shown to save a colony, so we used BEEHAVE, an
existing colony model designed to study _Varroa_ infestation, to ask what a treatment
has to achieve at colony level. Three cycles have run. They set a treatment
efficiency of about **0.05** as the target, find that **winter treatment works as
well as year-round**, and turn that into a titre of **0.005–0.05 mg dsRNA per g
yeast** that makes the therapy affordable. That titre is what the
[yeast work](/wet-lab-experiments#yeast-production) is measured against. Everything
here is **Modelled**: computational only, with **no bench data behind any
parameter**.

## The question

What efficacy, applied how often and for how long, changes the trajectory of a
colony under mite pressure, and what dsRNA titre makes that efficacy affordable?

## Why BEEHAVE

BEEHAVE models the key processes within a hive and their interactions, and was
designed to understand _Varroa_ infestation. It couples colony demography, foraging
and mite population dynamics in one agent-based model, so a treatment can be judged
**against colony survival** rather than against mite counts. It is primarily
deterministic, with some random behaviour. We ran it in NetLogo 5.3.1 and extended
it rather than writing a colony model from scratch.

> **TODO —** Cite BEEHAVE properly: the primary publication and the exact model
> version we ran. Add where the model comes from, how it has already been used to
> study _Varroa_, and its main set-up and assumptions. Owner: dry lab.

### How we set it up, and what we changed

- **Hive profiles from our beekeeper interviews** (cycle 2): the initial number of
  bees, brood capacity and colony collapse threshold, and beekeeper actions such as
  honey harvesting and feeding sugar syrup and pollen. Four profiles: North Dakota
  commercial, California commercial, Australia commercial and Australia amateur.
- **A non-forage-limited landscape** (cycles 2 and 3). With no _Varroa_, the colony
  holds steady around its initial number of bees, so _Varroa_ is the only threat. In
  the real world it is near-impossible to isolate the cause of any one colony's
  collapse; a model can.
- **Adult bees killed by _Varroa_ feeding on their haemolymph** (added in cycle 2),
  alongside the death of larvae in brood cells and of adults from deformed wing
  virus.
- **A mechanistic RNAi delivery chain** (cycle 3), in place of BEEHAVE's built-in
  treatment function, which kills a fixed share of phoretic mites on each day the
  treatment is active.

## The DBTL cycles

Three cycles have run and a fourth is contingent. Each is written out in full at
[cycle M1](/engineering#cycle-m1), [M2](/engineering#cycle-m2),
[M3](/engineering#cycle-m3) and [M4](/engineering#cycle-m4).

### Cycle 1 — does the model tell us anything about the state we are modelling?

- **Question** — how does a small initial number of _Varroa_ grow to one that causes
  colony collapse and significant honey losses, and over what timescale, given
  different initial conditions?
- **Design** — establish use of BEEHAVE at hive level, and find which variables do
  and do not affect mite spread and the time to collapse.
- **Build** — stock BEEHAVE in NetLogo 5.3.1, on the default hive profile, with no
  treatment.
- **Test** — initial infestation (VIL, mites per 100 bees) swept 0–100% in steps of
  20 with deformed wing virus held at 50%, then DWV swept 0–100% with VIL held at
  20%. Time to collapse and the loss in honey production from year 1 to year 5 (or
  the year of collapse) tracked.
- **Result** — both sweeps produced **a roughly straight line**: regardless of
  starting infestation or viral load, **the colony collapses in an average of 4
  years** and honey production is affected similarly.
- **What we learnt** — _Varroa_ spread shows **limited sensitivity to initial
  conditions**, so a single therapy effective at modelled mite levels should apply
  across a range of starting infestations. It does not rule out sensitivity to
  hive-level parameters such as brood-cell number, which requires real hive
  parametrisation.
- **What it changed** — removed initial VIL and DWV from the sweep list for later
  cycles, which is why cycle 2 fixes VIL at 10%, and made hive parametrisation the
  next question.

> **TODO —** Figure: percentage loss in honey from the first to the fifth (or final)
> year, against initial VIL and against initial % DWV. The point of the figure is
> that neither line rises with the starting value. The plot in our write-up covers
> the DWV sweep only, and its points sit at 10% steps where the method says 20%;
> reconcile the two before uploading. Owner: dry lab.

### Cycle 2 — what efficacy do we actually need?

- **Question** — given real hive profiles, what treatment efficiency would change
  the outcome, and what would that be worth?
- **Design** — hive profiles from our beekeeper interviews, forage left
  unconstrained, treatment applied as BEEHAVE's single efficiency parameter.
- **Build** — profiles loaded into BEEHAVE, with adult deaths from mite feeding
  added.
- **Test** — treatment efficiency swept through 0, 0.01, 0.05, 0.1 and 0.5, across
  three regimens: year-round (day 1, 365 days), winter (day 1, 89 days) and fall
  (day 182, 122 days). VIL fixed at 10%, run for 5 simulated years.
- **Result** — treatment prevents collapse at all levels. On the North Dakota
  profile, untreated honey production falls to **43%** of the non-infested value
  with collapse inside 2 years; **0.01 efficiency prevents collapse to 5 years**
  and **0.05 restores honey to over 90%** and bee population to 80%, with an
  asymptote beyond that. **Fall treatment is less effective than winter or
  year-round, and winter matches year-round.** The efficiency each profile needs
  to prevent collapse while holding losses to 10% of honey and 20% of bees:

| Profile                 | Year-round | Winter | Fall |
| ----------------------- | ---------- | ------ | ---- |
| North Dakota commercial | 0.05       | 0.05   | 0.05 |
| California commercial   | 0.01       | 0.05   | 0.05 |
| Australia commercial    | 0.05       | 0.05   | 0.05 |
| Australia amateur       | 0.05       | 0.05   | 0.5  |

```component
beehave-efficiency
```

> **TODO —** Figure: the two Australian profiles in the figure above. Their
> cycle 2 runs (columns BB and BT of `BEEHAVE_DBTL2_results.xlsx`) are
> unlabelled, and the two tables on this page assign them opposite ways: by the
> efficiency table, the block in which fall treatment at 0.05 still collapses
> (BT) is the amateur profile; by the untreated-baseline table (297%) it is the
> commercial one. Say which is which. Owner: dry lab.

**The untreated baseline, per hive profile.** Before treatment is applied at all, the
model gives the direct microeconomic impact of _Varroa_ on an individual hive, which
surveys cannot isolate, because real colony collapse always has several contributing
causes at once:

| Profile                 | Years to collapse | Reduction in total honey harvested over 5 years |
| ----------------------- | ----------------- | ----------------------------------------------- |
| North Dakota commercial | 2                 | 228%                                            |
| California commercial   | 3                 | not applicable (profile does not harvest honey) |
| Australia amateur       | 1                 | 252%                                            |
| Australia commercial    | 1                 | 297%                                            |

> **TODO —** Those honey figures are recorded as percentage *reductions* above 100%,
> which cannot be read literally. The accompanying text says cumulative honey
> production falls **to about a third** of the uninfested level, so these look like
> ratios of uninfested to infested rather than reductions. The sheets bear this
> out: the infested North Dakota hive harvests 264.6 kg over the run against
> 602.8 kg uninfested, and 602.8 / 264.6 = 2.28. Restate them with the
> direction and the denominator explicit, and add the reduction in bee population,
> which our write-up marks as "to be added". Owner: dry lab.

- **What we learnt** — **the therapy needs a treatment efficiency of about 0.05**
  to serve the majority of hives in our focus regions. All untreated hives
  collapsed within 3 years, with cumulative honey production falling to a third of
  the uninfested level. A **winter regimen suits our therapeutic much better than
  the fall regimen used for current commercial pesticides**, because a pollen patty
  is impervious to cold and delivered inside the hive.
- **What it changed** — gave the project an efficacy target, and exposed that the
  target does not translate into anything the wet lab can act on. That gap is
  cycle 3.

### Cycle 3 — where in the chain is the dose lost?

- **Question** — a single efficiency parameter hides the mechanism. Which step of
  delivery limits the outcome, and what titre does the wet lab have to reach?
- **Design** — replace the lumped efficiency term with a chain of interactions
  representing dsRNA transfer, described below.
- **Build** — new interactions inside BEEHAVE, each probability independently
  adjustable, with a microeconomic layer alongside to ask whether the resulting
  dosing regime is affordable at all.
- **Test** — six dsRNA concentrations crossed with five treatment yeast amounts
  (see [the test list](#the-test-list)): 30 combinations, automated with NetLogo's
  BehaviourSpace, across each hive profile and all three regimens.
- **Result** — the heat maps show the expected trade-off. Year-round treatment
  prevents collapse within 5 years at even the lowest dsRNA concentrations **if
  enough yeast is added**, but **above 0.01 mg/g the same collapse is prevented
  with a hundred times less yeast**. Winter and year-round treatment give
  identical results in almost every case, so winter is as effective and cheaper;
  fall needs as much as 1750 g/day or 0.1 mg/g.
- **What we learnt** — set against a fermentation cost of about 2.33 USD
  (3.35 AUD) per gram and the modelled net private benefit of US$47.9 per colony
  and A$18.9 per hive, **0.005 mg/g makes the therapy economically viable in the US
  and 0.05 mg/g in both the US and Australia** `[CALC]`. Both thresholds are read
  from the Australian commercial profile, priced in each currency.
- **What it changed** — converts a colony-level efficacy target into **a titre
  target for the wet lab**.

```component
beehave-heatmaps
```

> **TODO —** Figure: the Australian amateur profile in the heat maps. In
> `AUS_A_3-table.xlsx` its colonies collapse even where the treatment clears
> every mite (3,500 × 0.1 mg/g, winter: no mites at any year end, collapse at the
> end of year 4), so something in the profile, not Varroa, ends them; and its
> honey grid divides by the Australian commercial reference (268.9 kg).
> Re-parametrise or rerun it. Owner: dry lab.

```component
beehave-cost
```

> **TODO —** The cost reading above sets the yeast bill against the *net* private
> benefit, which already deducts an assumed annual NECTAR cost (A$20 per hive in
> Australia; see [economic modelling](/economic-modelling)), so the treatment is
> paid for twice. Compare against the benefit before that deduction, or replace the
> assumed cost with the yeast bill, and restate the thresholds. The same reading is
> also owed for the North Dakota and California profiles, so the US threshold rests
> on a US hive. Owner: dry lab with economic modelling.

Cycle 3 also carries an agricultural strand: the damage current pesticide use
does to agriculture, as the counterfactual this treatment would be measured
against.

> **TODO —** Scope the pesticide-damage work: either a sourced comparison against
> current acaricide practice, or drop it. An unreferenced assertion that chemical
> control harms agriculture is worth nothing here. Owner: dry lab with HP.

### Cycle 4 — does it still work in a degraded landscape?

- **Question** — how does the answer change when forage is constrained the way
  climate change and land-use change constrain it?
- **Design** — reconstrain the landscape, bringing in real forage types and
  regions.
- **Build · Test · Result · What we learnt · What it changed** — **Proposed**, and
  explicitly contingent.

This cycle is only worth running once we know what treatment efficacy is
achievable in the lab. Running it first would mean sweeping a landscape against
**an efficacy figure we invented**. It also needs better landscape data than we
had: by 5 September we had taken the landscape module out of our model, because the
data beekeepers could give us was too imprecise.

## The transfer-probability chain

Cycle 3 replaces the lumped treatment efficiency with its parts. A single efficacy
number tells you whether the product works. It does not tell you **what to do
next**. So the dose entering the pathway is calculated from the concentration of
dsRNA per gram of yeast and the amount of yeast supplied, then reduced
sequentially by:

1. the proportion of treatment consumed by bees,
2. systemic delivery of ingested dsRNA,
3. degradation before reaching the mite,
4. transfer from the bee to a feeding phoretic mite,
5. uptake by the mite.

The estimated dose reaching a mite is then converted into a probability of effective
RNAi through a **saturating dose-response relationship**, combined with the
probability of successful target-gene knockdown and the probability that knockdown
causes mortality. Treatment therefore no longer removes a fixed proportion of mites
independently of dose.

The five intermediate steps were **assigned provisional values within biologically
plausible orders of magnitude** where no measurement existed, so they can be
replaced as laboratory data are generated. None is measured by us. Cycle 3 held
them fixed and swept the two levers the treatment itself controls. Raising dsRNA
concentration means raising yeast titre, the hardest unsolved problem on the
project (see [yeast](/wet-lab-experiments#yeast-production)). Supplying more yeast
can make up for a low titre, but it raises the price of the treatment for
beekeepers. The heat maps show that both levers can prevent collapse; the cost
reading shows that only a high enough titre keeps the yeast bill below what the
treatment is worth. That is why the titre, and not the amount fed, is the number
handed to the wet lab. Sweeping the five steps one at a time, to find which one
moves the outcome most, is not part of cycle 3.

> **TODO —** Equation: P(mite death on a given day), written out term by term, with
> the provisional value and its justification for each of the five intermediate
> steps. Owner: dry lab.

## The test list

The runs as executed, full-factorial, automated with NetLogo's BehaviourSpace.

| Parameter                 | Values                                                    |
| ------------------------- | --------------------------------------------------------- |
| dsRNA concentration       | 0.0005 · 0.001 · 0.005 · 0.01 · 0.05 · 0.1 **mg/g yeast** |
| Treatment yeast supplied  | 35 · 175 · 350 · 1750 · 3500 **mg/day**                   |
| VIL (varroa infestation level, mites per 100 bees) | fixed at 10%                     |
| Treatment schedule        | year-round · winter · fall                                |

Six concentrations crossed with five yeast amounts gives **30 treatment
combinations** per hive profile per regimen. Outputs tracked: colony collapse,
5-year honey production, and bee population.

> **TODO —** The yeast amounts are given as mg/day in the test design and as g/day
> when the results are discussed. A factor of a thousand separates the two, and the
> cost conclusion depends on which is right. The model parameter is
> `TREATMENT_YEAST_G_PER_DAY` and the sheets label the rows "g yeast applied per
> day", but the cost column prices 35 a day over a 90-day winter (3,150) at
> A$10.55, which is 3,150 × A$0.00335: right for milligrams at A$3.35 a gram, or
> for grams at A$3.35 a kilogram. The winter regimen is also 89 days, not 90. The
> figures above print the bare numbers until this is settled. Owner: dry lab.

## Sensitivity and validation

The parameter sweeps above are the sensitivity analysis. Validation is a
different and harder question, and **we have not done it**: the model has not been
tested against an independent dataset of colony outcomes, and we do not claim
otherwise.

## Predictions

Three, each carrying the status label **Modelled** — a prediction, never a result.
**A colony outcome insensitive to starting infestation**, so one therapy can serve a
range of starting conditions. **A treatment efficiency of about 0.05** as the target
for the majority of hives in our focus regions, reachable on a winter regimen as
effectively as year-round. And **a titre target of 0.005 to 0.05 mg dsRNA per g
yeast** for economic viability, which is the number handed to the wet lab.

## Off-target and ecological considerations

Population effects are not confined to the target species, and this model does
not represent non-target organisms at all. The control against off-target harm
is sequence-level screening, not this model. See
[safety and security](/project-safety) and [RNA design](/software).

> **How did this change NECTAR?**
>
> Cycle 3's design changed how we talk about efficacy: we stopped treating it as
> one number the product either hits or misses, and started treating it as **a chain
> with a cheapest link**. The cycles then produced the two numbers the rest of the
> project is now built around — **a 0.05 treatment efficiency target** and the
> **0.005–0.05 mg/g yeast titre** that makes it affordable — and they established
> that **a winter-only regimen is as effective as year-round treatment**, which is a
> regimen only a cold-tolerant in-hive product can use. The titre target is what the
> [yeast work](/wet-lab-experiments#yeast-production) is measured against.

## Limitations

- Every parameter is taken from our interviews or the literature, swept, or
  assigned a provisional plausible value. **None is measured by us**, and in
  particular no transfer probability in the delivery chain comes from our own bench
  data.
- The non-forage-limited landscape is unrealistic by construction. It is used to
  isolate Varroa from every other cause of colony loss, which is uniquely possible
  in a model and impossible in a real apiary.
- Isolating _Varroa_ does not give its full cost in a real apiary: its effects do
  not simply add to other stresses such as climate, and may multiply them.
- Reinfestation from neighbouring colonies is not represented.
- Beekeeper behaviour — whether patties are actually fed on schedule — is assumed
  compliant.
- The landscape stays unconstrained until cycle 4, which has not run.
- The model says nothing about non-target organisms.

## Where this connects

[Dry lab and modelling](/model) · [Safety and security](/project-safety) ·
[Bee lab](/bee-lab) · [Case studies](/case-studies) ·
[Economic modelling](/economic-modelling) · [Yeast](/wet-lab-experiments#yeast-production) ·
[Sustainable development](/sustainability)
