> **What this page proves:** that what a beekeeper can afford translates, by a
> stated chain of reasoning, into a number the wet lab has to hit.
> **Where the evidence is:** the stakeholder interviews on
> [human practices](/human-practices) — Wally Thurman for the method, Brittney
> Goodrich and Wade Ford for the cost structure — and the engineering target on
> [yeast](/wet-lab-experiments#yeast-production).

**Status: Modelled.** This is the strongest link between the science and the
world it would have to survive in. It runs in one direction and is written that
way.

## The chain

**What a beekeeper can afford → allowable cost per dose → allowable
manufacturing cost → required mass of intact active dsRNA per gram of dry yeast.**

Read left to right it is an affordability question. Read right to left it is an
engineering specification: milligrams — or micrograms — of intact, active dsRNA
per gram of dry yeast. That is the number this page exists to produce, and it is
the reason the model matters. "High expression" is an aspiration. A required mass
per gram is something the wet lab can **pass or fail**.

> **FIGURE —** The chain as four boxes and three arrows, each arrow labelled with
> what holds it up: stakeholder evidence, literature, or our own assumption. The
> last arrow is currently assumption, and the figure should show that rather than
> hide it.

## Method, and where it came from

Professor Wally Thurman (Agricultural and Resource Economics, NC State,
interviewed 29 July 2026) set the structure. Five commitments follow from that
conversation:

1. **Start from an average commercial beekeeping operation**, not from an
   industry aggregate.
2. **Use existing treatments as the counterfactual.** The benefit is the
   difference from what would have happened anyway.
3. **Assess changes in costs and revenues**, not non-monetary metrics like
   survival rates or honey yields. Those are inputs, not the answer.
4. **Use a simple partial-equilibrium approach** with assumed elasticities of
   supply and demand for market-level outcomes, rather than a model whose
   sophistication outruns its data.
5. **Focus on paid pollination markets and crops reliant on managed bees.** Wild
   pollinators and incidental pollination sit outside the market and outside this
   model.

Thurman also noted that demand for pollination is derived from demand for food,
so benefits to growers pass along the supply chain to consumers. The model
therefore does not stop at the beekeeper's margin.

One thing we refuse explicitly: **multiplying a whole industry's value by an
efficacy figure.** It produces a large number and means nothing.

## Operation-level inputs

The cost structure comes from Professor Brittney Goodrich (Agricultural and
Consumer Economics, University of Illinois Urbana-Champaign, interviewed 7 August
2026), who models a commercial operation across a year. `[LIT]`

| Input                             | Value                                                          |
| --------------------------------- | -------------------------------------------------------------- |
| Operation size                    | 8,500 colonies, about 5,000 sent to California for almonds      |
| Capital recovery and equipment    | 27% of total costs                                              |
| Labour                            | 21% of total costs                                              |
| Varroa treatment products         | 9% of total costs                                               |
| Treatment regime modelled         | Two amitraz, one oxalic acid, one formic acid per year          |
| Colonies per worker               | About 700                                                       |
| Almond pollination revenue        | About $195 per colony                                           |
| Honey yield                       | About 70 lb per colony                                          |

The 9% figure is the one most likely to be misread. It is treatment **products
alone**: it excludes the labour of administering them, the cost of replacing lost
hives, and the revenue lost to Varroa. The real cost of Varroa to this operation
is **higher than 9%**, and the model counts those other terms separately.

Wade Ford (Hive & Wellness Australia, 13 August 2026) gives the Australian
counterpart: Varroa management splits roughly **60% treatment cost and 40%
additional labour**, with formic acid at about **A$7 per hive**, which compounds
across operations of a thousand hives and more. `[LIT]`

> **TODO —** Goodrich's operation model is presumably published. Find the
> citation and cite the paper rather than the interview, so a judge can check the
> numbers. Owner: modelling.

## The link that is not yet evidence

Every figure downstream of manufacturing cost rests on **an assumed dsRNA titre**,
because the real titre has never been measured. See
[yeast](/wet-lab-experiments#yeast-production), where this is the headline unsolved problem.

That makes the following true, and it should be read before any cost number on
this wiki:

- The required mass of dsRNA per gram of dry yeast is a **`[CALC]`**, not a
  measurement.
- The manufacturing cost per dose is a **`[CALC]` on top of that `[CALC]`**.
- **The figure of about £2 per gram** that appears in our sustainability draft is
  in this category. `[CALC]` The arithmetic behind it is not written down, and it
  is not stated what the gram is a gram of — product, dry yeast, or dsRNA.

> **TODO —** Reproduce the £2 per gram calculation with its inputs and its
> assumed titre stated inline, or withdraw the figure from every page that
> carries it, including [sustainable development](/sustainability) and
> [entrepreneurship](/entrepreneurship). An unsupported unit cost is worse than
> no unit cost. Owner: modelling with entrepreneurship.

## Sensitivity

Titre is the input that **decides whether the conclusion holds**. The honest
presentation is a range across the plausible titre span, not a point estimate at
a convenient value, and the page should show which conclusions survive at the
bottom of that range.

> **TODO —** Run and publish the titre sensitivity sweep, and state explicitly
> which conclusions fail at the low end. Owner: modelling. Blocked on agreeing
> the plausible titre range with the wet lab.

## Market-level view

The partial-equilibrium layer: how a change in per-colony treatment cost and in
colony losses moves paid pollination markets, with assumed elasticities. Wider
than one operation, and correspondingly more assumption-laden — every elasticity
used must be stated with its source next to it.

> **TODO —** No elasticity values are chosen yet. Until they are, there is no
> market-level result to publish. Owner: modelling.

## Manufacturing and scale-up

The fermentation route, batch scale, dry biomass and unit cost feed the
required-titre calculation and the product case on
[entrepreneurship](/entrepreneurship). As
[the modelling index](/model) records, this is currently an assumption set rather
than a model of its own.

> **How did this change NECTAR?**
>
> It turned "high expression" from a vague goal into a numerical design
> requirement for [yeast](/wet-lab-experiments#yeast-production): a target mass of intact dsRNA per gram of dry
> yeast, derived from what a beekeeper can pay rather than from what a fermenter
> can be persuaded to do. The target number itself is still provisional, because
> the titre it is calibrated against is unmeasured — but the *direction* of the
> reasoning changed, and that is what put **a quantitative target** in front of the
> wet lab at all.

## Limitations

- Literature- and interview-parameterised throughout; no parameter measured by us.
- The key biological input, titre, is unmeasured, and the model's headline output
  is a function of it.
- US cost structure and Australian cost structure are **not interchangeable**; the
  model is run per country and should not be averaged across them.
- Wild pollinators, incidental pollination and non-market beekeeping are outside
  the model by design, following Thurman. That is a scoping choice, not a claim
  that they do not matter.

## Still missing

- The verified numbers with their citation tags, and Goodrich's published source.
- The titre sensitivity sweep.
- Chosen elasticities for the market-level layer.
- The chain figure.
- A stated position on which conclusions survive if the titre assumption fails.

## Where this connects

[Dry lab and modelling](/model) · [Yeast](/wet-lab-experiments#yeast-production) ·
[Entrepreneurship](/entrepreneurship) · [Human practices](/human-practices) ·
[Case studies](/case-studies) · [Ecological modelling](/ecological-modelling) ·
[Sustainable development](/sustainability)
