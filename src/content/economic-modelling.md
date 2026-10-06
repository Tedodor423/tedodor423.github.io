**Status: Modelled.** The chain below runs in one direction.

## The chain

**What a beekeeper can afford → allowable cost per dose → allowable
manufacturing cost → required mass of intact active dsRNA per gram of dry yeast.**

Read left to right it is an affordability question. Read right to left it is an
engineering specification: milligrams — or micrograms — of intact, active dsRNA
per gram of dry yeast. "High expression" is an aspiration. A required mass
per gram is something the wet lab can **pass or fail**.

> **TODO —** Figure: The chain as four boxes and three arrows, each arrow labelled with
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

That makes the following true:

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

Titre is the input that **decides whether the conclusion holds**.

> **TODO —** Run and publish the titre sensitivity sweep, and state explicitly
> which conclusions fail at the low end. Owner: modelling. Blocked on agreeing
> the plausible titre range with the wet lab.

## The two markets, as they stand

We modelled Australia and the United States separately rather than transferring one
set of assumptions to the other, because they differ in colony numbers, Varroa
exposure, treatment costs, honey production and pollination-market structure. This
follows Thurman's recommendation that economic analysis compare NECTAR with **the
relevant local counterfactual** rather than one global estimate.

**Australia** is adapting relatively recently to permanent Varroa management.

| Input                                            | Value                  |
| ------------------------------------------------ | ---------------------- |
| Commercial managed hives                         | ~530,000               |
| Honey production                                 | ~37 million kg/year    |
| Indicative average honey price                   | ~A$4.80/kg             |
| Colonies available for pollination               | ~630,000               |
| Indicative pollination price                     | ~A$160 per hive        |
| Honeybee pollination contribution to agriculture | ~A$4.6 billion         |
| Direct Varroa-control cost (NSW beekeepers)      | ~A$22.18 per hive      |
| Additional Varroa labour                         | ~0.37 hours per hive   |

As feral colonies decline, producers may become increasingly dependent on managed
colonies for pollination at the same time as beekeepers face higher treatment,
monitoring and replacement costs.

**The United States** is larger and already highly commercialised, under substantial
colony-loss pressure.

| Input                              | Value                       |
| ---------------------------------- | --------------------------- |
| Honey-producing colonies           | ~2.412 million              |
| Average honey yield                | 57.1 lb per colony          |
| Honey revenue                      | ~US$146 per colony per year |
| National honey supply              | ~116 million lb             |
| Average honey price                | ~US$3.05/lb                 |
| Colonies used for almond pollination (2025) | ~1.63 million      |
| Average almond pollination fee (2025)       | ~US$209 per colony |
| Managed-colony loss rate, 2025–26  | 39.9%                       |
| Varroa-control expenditure         | ~US$9.22 per colony/year    |

High colony losses do not translate directly into an equivalent decline in national
colony numbers, because beekeepers replace colonies — **but that distinction is
itself economically important**: maintaining the stock of productive colonies
requires continued expenditure on replacement bees, requeening, labour and treatment.

> **TODO —** Every row in both tables needs its source cited inline. They are
> currently carried from our own economic dataset without the provenance a judge
> could check. Owner: modelling.

## Market-level view

The partial-equilibrium layer: how a change in per-colony treatment cost and in
colony losses moves paid pollination markets, with assumed elasticities. Wider
than one operation, and correspondingly more assumption-laden.

The economic chain:

**NECTAR-treated colonies → fewer colony losses → more surviving productive colonies
→ increased honey supply and pollination capacity → changes in market prices and
economic surplus.**

Rather than modelling the entire agricultural economy, we estimated how an increase
in supply could change quantities and prices within the honey and commercial
pollination markets. For US pollination, almonds are a particularly useful market
because managed colonies are extensively traded for a clearly defined pollination
service: the model uses 1.63 million almond-pollination colonies at about US$209 per
colony, together with assumed supply and demand elasticities.

**Operation-level result.** For the United States, the current workbook estimates
approximately **US$47.9 of net private benefit per treated colony per year** after
accounting for the assumed annual cost of NECTAR, generated principally by fewer
replacement colonies, reduced expenditure on existing Varroa treatments, labour
savings, and smaller savings associated with requeening and potential honey
productivity.

For Australia the model estimates approximately **A$18.9 per treated hive per year**
after an assumed A$20 annual NECTAR cost. The breakdown is:

| Term                                                      | A$/hive/year |
| --------------------------------------------------------- | ------------ |
| Avoided replacement, from an assumed 8-percentage-point reduction in annual colony loss | ~20.00 |
| Displacement of part of existing Varroa expenditure        | ~13.31       |
| Reduced treatment labour                                   | ~5.55        |
| Less the assumed annual NECTAR cost                        | −20.00       |
| **Net private benefit**                                    | **≈ 18.86**  |

**These estimates matter because they show NECTAR's economic value need not depend on
increasing honey yield directly.** A treatment can generate value simply by helping a
beekeeper maintain productive colonies while reducing replacement, treatment and
labour costs.

**Market-level result.** Under the current US scenario, improved colony survival
produces approximately **8.8 million lb of additional honey and 123,000 additional
pollination-capable colonies**, giving an estimated combined change in honey and
pollination market surplus of approximately **US$4.57 million per year**. For
Australia, the corresponding model estimates approximately **4.5 million kg of
additional honey and 29,000 additional pollination-capable colonies**, generating
approximately **A$4.61 million per year** in modelled market surplus `[CALC]`.

**These effects would be distributed across the economy rather than captured entirely
by NECTAR or by beekeepers.** Greater colony survival increases the supply of honey
and pollination services, and an increase in supply places downward pressure on
market prices, so part of the benefit flows to honey purchasers, growers buying
pollination services and, further downstream, consumers of pollination-dependent
crops. Beekeepers benefit through lower operating costs and greater productive
capacity. **This is why we use market surplus rather than additional beekeeper
revenue** when discussing the wider economic effect.

**These values are not predictions and not the total social value of NECTAR.** They
are a quantitative demonstration of how a colony-level intervention could propagate
into wider markets *if* NECTAR achieves the assumed reductions in losses and costs.

> **TODO —** The elasticity values used in the partial-equilibrium layer are not
> stated anywhere, and each needs its source printed next to it. Until they are, the
> market-surplus figures above are not checkable. Owner: modelling.

> **TODO —** Figure: The economic chain as a flow diagram, from treated colonies through
> surviving colonies to honey and pollination supply and market surplus, with the
> US and Australian numbers on the same axes. Our write-up marks the place.

## What this does to the engineering

The analysis returns to the design. If NECTAR is to generate economic value it
cannot simply work biologically: **its annual treatment cost, duration of protection,
labour requirement and effect on colony survival determine whether the
beekeeper-level benefit is positive at all.** Those constraints feed back into
manufacturing cost, yeast titre, dosing frequency and formulation — which is how the
economic loop closes onto [cycle M3](/engineering#cycle-m3), where the modelled
benefit above is set against a fermentation cost of about **2.33 USD (3.35 AUD) per
gram** of genetically modified yeast to give the titre the wet lab has to reach:
**0.005 mg dsRNA per g yeast for US viability, 0.05 mg/g for both markets**.

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
