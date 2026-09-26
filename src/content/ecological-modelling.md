> **What this page proves:** that we know what a treatment would have to achieve
> at colony scale, and that we built the model so it can tell us which part of
> the delivery chain to work on.
> **Where the evidence is:** the BEEHAVE literature the model is parameterised
> from, the hive profiles from [human practices](/human-practices), and the
> parameter sweeps listed below.

A treatment that kills mites in a dish is not a treatment that saves a colony.
This page is about the gap between those two statements. Everything on it is
**Modelled** — computational only, with **no bench data behind any parameter**.

## The question

What efficacy, applied how often and for how long, changes the trajectory of a
colony under mite pressure — and, once that is known, which link in the delivery
chain is the cheapest place to buy more of it.

## Why BEEHAVE

BEEHAVE couples colony demography, foraging and mite population dynamics in one
agent-based model, so a treatment can be judged **against colony survival** rather
than against mite counts. We extended it with a treatment layer of our own rather
than writing a colony model from scratch.

> **TODO —** Cite BEEHAVE properly: the primary publication and the exact model
> version we ran, with our modifications listed. Owner: dry lab.

## The DBTL cycles

Three cycles are planned and a fourth is contingent. Each keeps the seven beats
used everywhere else on this wiki.

### Cycle 1 — does the model tell us anything about the state we are modelling?

- **Question** — can BEEHAVE, unmodified, reproduce a colony under mite pressure
  well enough for us to build on?
- **Design** — baseline runs establishing use of the model.
- **Build** — stock BEEHAVE, no treatment layer.
- **Test** — baseline colony trajectories.
- **Result · What we learnt · What it changed** — the cycle produced results and
  is mostly written up, but in the team's working document rather than here.

> **TODO —** Bring cycle 1 onto the wiki: the baseline runs, the plots, and the
> results about study state that the write-up records. Until this lands, the
> modelling pages carry no model output at all. Owner: dry lab.

### Cycle 2 — what efficacy do we actually need?

- **Question** — given real hive profiles, what treatment efficiency would change
  the outcome, and what would that be worth?
- **Design** — hive profiles from Wade Ford's beekeepers, forage left
  unconstrained, treatment applied as a single efficiency parameter.
- **Build** — profiles loaded into BEEHAVE, with a treatment term added.
- **Test** — sweep treatment efficiency; read off the economic consequence of
  each level.
- **Result · What we learnt · What it changed** — **Proposed.** Not yet run.

Leaving forage unconstrained is deliberate: it **isolates the treatment effect**
before landscape realism is added in cycle 4.

### Cycle 3 — where in the chain is the dose lost?

- **Question** — a single efficiency parameter hides the mechanism. Which step of
  delivery limits the outcome?
- **Design** — replace the lumped efficiency term with a chain of interactions
  representing dsRNA transfer, described below.
- **Build** — new interactions inside BEEHAVE, each probability independently
  adjustable, with a microeconomic layer alongside to ask whether the resulting
  dosing regime is affordable at all.
- **Test** — the parameter sweeps listed below, plus year-round, winter and
  autumn treatment schedules.
- **Result · What we learnt · What it changed** — **Proposed.** Not yet run.

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
**an efficacy figure we invented**. It is listed as planned work with a stated
precondition, not as work in progress.

## The transfer-probability chain

Cycle 3 is the substantive modelling contribution here, and the reason is
decomposition.

A single treatment-efficacy number tells you whether the product works. It does
not tell you **what to do next**. So the chain is split into three probabilities:

1. a bee eats the pollen patty,
2. that bee transfers dsRNA to a phoretic mite,
3. the mite dies.

Each is adjustable on its own, so sweeping them separately says which one is the
**biggest needle-mover**. The two candidate levers cost very different amounts.
Raising dsRNA concentration in the patty means raising yeast titre, the hardest
unsolved problem on the project (see [yeast](/wet-lab-experiments#yeast-production)). Adding more pollen patties
is cheap, and beekeepers already feed them. If the model says the second lever
dominates, **the wet lab's titre target relaxes**; if the first dominates, it does
not.

That is the decision this model exists to make, and it is why the chain is three
parameters rather than one.

> **TODO —** None of the three probabilities is measured, or bounded by
> literature we have read. Before any cycle 3 output is published, state for each
> probability what range is being swept and why that range. A sweep across an
> arbitrary range is an illustration, not a prediction. Owner: dry lab.

## The test list

The planned runs, as recorded by the modelling team.

| Parameter                     | Baseline | Values swept                         |
| ----------------------------- | -------- | ------------------------------------ |
| dsRNA concentration           | 0.1      | 0.0005 · 0.001 · 0.005 · 0.01 · 0.05 |
| Yeast per bee per day (grams) | 0.01     | 0.001 · 0.01 · 0.05 · 0.1            |
| Pollen patty mass             | —        | varied                               |
| VIL                           | 10%      | rerun at 10%                         |
| Treatment schedule            | —        | year-round · winter · autumn         |

Three honest notes on that table:

- The concentration values are recorded as bare numbers in our modelling notes.
  The unit is **not written down anywhere**. `[FLAG]`
- "VIL" is the abbreviation our notes use, and it is not expanded in any source
  we can point to. `[FLAG]`
- Pollen patty mass and yeast per bee per day overlap. Whether they are two
  independent sweeps or two names for the same one is unsettled.

> **TODO —** Fix all three before publishing any of these runs: the unit on the
> concentration sweep, the expansion of VIL, and whether patty mass is a separate
> parameter. Owner: dry lab.

## Sensitivity and validation

The parameter sweeps above are the sensitivity analysis. Validation is a
different and harder question, and **we have not done it**: the model has not been
tested against an independent dataset of colony outcomes, and we do not claim
otherwise.

## Predictions

None yet, beyond cycle 1's unpublished baseline. Anything this model eventually
produces carries the status label **Modelled** — a prediction, never a result.

## Off-target and ecological considerations

Population effects are not confined to the target species, and this model does
not represent non-target organisms at all. The control against off-target harm
is sequence-level screening, not this model. See
[safety and security](/project-safety) and [RNA design](/software).

> **How did this change NECTAR?**
>
> Cycle 3's design already changed how we talk about efficacy: we stopped
> treating it as one number the product either hits or misses, and started
> treating it as **a chain with a cheapest link**. What the cycles will change once
> they run — the efficacy target handed to the wet lab — is recorded as owed, not
> as done.

## Limitations

- Every parameter is literature-derived or swept. None is measured by us.
- Reinfestation from neighbouring colonies is not represented.
- Beekeeper behaviour — whether patties are actually fed on schedule — is assumed
  compliant.
- The landscape stays unconstrained until cycle 4, which has not run.
- The model says nothing about non-target organisms.

## Still missing

- Cycle 1's results and plots, brought onto the wiki.
- The BEEHAVE citation and version.
- Units, the VIL expansion, and the patty-mass question.
- Justified sweep ranges for the three transfer probabilities.
- Cycles 2 and 3, run.

## Where this connects

[Dry lab and modelling](/model) · [Safety and security](/project-safety) ·
[Bee lab](/bee-lab) · [Case studies](/case-studies) ·
[Economic modelling](/economic-modelling) · [Yeast](/wet-lab-experiments#yeast-production) ·
[Sustainable development](/sustainability)
