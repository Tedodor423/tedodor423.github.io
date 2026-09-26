> **What this page proves:** that each model asked a distinct question, informed
> a decision, and has a stated boundary.
> **Where the evidence is:** each model's own page, linked below.

This is an index, not a gallery of unrelated graphs. Each model has its own
question and its own page. This page says how they fit together, and which of
them is not yet a model at all.

## An honest statement, up front

No model on this wiki currently uses **a parameter we measured ourselves**. Every
one is parameterised from the literature or from stakeholder evidence. Saying so
here is better than leaving a judge to discover it three pages in, and it names
the most valuable thing the next iteration could do: close the loop between
bench and model.

## How every model here is written

The same eight beats, every time:

**Question → Inputs → Assumptions → Model → Sensitivity and validation →
Prediction → Decision it informed → Limitations**

And every model carries one visible box:

> **How did this change NECTAR?**
>
> If the honest answer is "it didn't", the model does not deserve the space.

Modelled outputs carry the status label **Modelled**. They are predictions, never
results.

## The models

### RNA target and design

**Status: Modelled.** Owner page: [RNA design](/software).

- **Question** — which sequence silences the mite, and how should the dsRNA
  carrying it be designed?
- **Inputs** — candidate target genes; secondary-structure accessibility of each
  24-nt window; thermodynamic asymmetry; enrichment in the mite's own viral
  siRNA population; homology databases for the off-target screen.
- **Assumptions** — that a window scoring well on accessibility, asymmetry and
  viral-siRNA enrichment is more likely to silence. Untested against our own
  bench data.
- **The model** — the three scores combined into a per-window ranking, then a
  homology screen against representative species whose choice is justified
  rather than default (Paul Lam's advice; see
  [safety and security](/project-safety)).
- **Sensitivity and validation** — owed. Which of the three score terms drives
  the ranking is not yet written down.
- **Prediction** — a ranked shortlist of windows for the selected target.
- **Decision it informed** — which construct was built, and the rejection of the
  concatenation design: our own calculations ruled it out, so it is recorded as
  tested-and-set-aside future work rather than an active construct.
- **Limitations** — nothing has yet fed back from the bench into the score
  weights.

> **How did this change NECTAR?**
>
> It chose the construct and it killed one. The concatenated design was rejected
> on **the model's own arithmetic** before anyone ordered oligos.

### dsRNA dosing and transfer

**Status: Modelled.** Implemented as a layer inside the third BEEHAVE cycle;
detail on [ecological modelling](/ecological-modelling).

- **Question** — between a patty in the hive and a dead mite, where is the dose
  actually lost?
- **Inputs** — patty mass fed per bee per day, dsRNA concentration in the patty,
  and three probabilities: that a bee eats the patty, that it transfers dsRNA to
  a phoretic mite, and that the mite then dies.
- **Assumptions** — that the chain is separable into those three steps, and that
  each can be varied independently.
- **The model** — each probability is an adjustable parameter rather than one
  lumped efficacy figure.
- **Sensitivity and validation** — this is the point of the model: sweeping each
  link separately says which one moves the outcome.
- **Prediction** — not yet run.
- **Decision it informed** — pending. The decision it exists to inform is whether
  effort belongs on raising dsRNA concentration, which is hard, or on feeding
  more patty, which is easy.
- **Limitations** — none of the three probabilities is measured. Every value is a
  sweep, not an estimate.

> **How did this change NECTAR?**
>
> Not yet. It is the one model here built for **a decision that is still open**, and
> it is marked pending rather than dressed up as a finding.

### Colony and Varroa dynamics

**Status: Modelled.** Owner page:
[ecological modelling](/ecological-modelling), which carries the DBTL cycles,
the transfer chain and the full parameter sweep list.

- **Question** — what efficacy, applied on what schedule, changes a colony's
  trajectory under mite pressure?
- **Inputs** — BEEHAVE's colony and forage model, hive profiles supplied by Wade
  Ford's beekeepers, and our own treatment layer.
- **Assumptions** — BEEHAVE's own, plus a forage landscape left unconstrained in
  the second cycle.
- **The model** — BEEHAVE with an added treatment and dsRNA-transfer layer.
- **Sensitivity and validation** — planned as parameter sweeps; the test list is
  on the owner page.
- **Prediction** — the first cycle's results exist in the team's working
  document and are owed here.
- **Decision it informed** — it sets the efficacy target the wet lab aims at.
- **Limitations** — reinfestation from neighbouring colonies, beekeeper
  behaviour, and a landscape not yet reconstrained for climate or land-use
  change.

> **How did this change NECTAR?**
>
> Owed, and honestly so. The first cycle is written up elsewhere and has not been
> brought onto the wiki; until it is, **this box cannot be filled**. Owner: dry lab.

### Economic model

**Status: Modelled.** Owner page: [economic modelling](/economic-modelling).

- **Question** — what can a beekeeping operation afford, and what does that
  demand of the fermenter?
- **Inputs** — the cost structure of an average commercial operation, existing
  treatments as the counterfactual, assumed elasticities of supply and demand.
- **Assumptions** — an assumed dsRNA titre, because the real one is unmeasured.
- **The model** — operation level first, then a simple partial-equilibrium view
  of the market.
- **Sensitivity and validation** — titre is the input that breaks it, so the page
  shows a range rather than a point.
- **Prediction** — an allowable manufacturing cost, and from it a required mass
  of intact dsRNA per gram of dry yeast.
- **Decision it informed** — it turned "high expression" into a number for
  [yeast](/wet-lab-experiments#yeast-production).
- **Limitations** — every downstream figure rests on the assumed titre.

> **How did this change NECTAR?**
>
> It converted an affordability constraint into **an engineering specification**.
> This is the one place on the wiki where a model hands the wet lab a target
> number rather than a graph.

### Fermentation techno-economics

**Status: not yet a model.** Today this is a set of assumptions sitting inside
the economic model — a fermentation route, a batch scale, a unit cost — not an
independent model with its own inputs and its own sensitivity.

> **TODO —** Either document the fermentation techno-economics properly, with
> sourced inputs and a sensitivity analysis, or state plainly that it is an
> illustrative calculation inside the economic model. Both are acceptable;
> presenting the second as the first is not. Owner: entrepreneurship.

That answers the question this page used to leave open. The dosing and transfer
work **is** a model, with its own parameters and its own sweep. The fermentation
economics are **not**, yet.

## How the models connect

**The chain is the story**, not the individual models. What a beekeeper can afford
constrains manufacturing cost, which constrains required titre, which becomes a
design requirement for [yeast](/wet-lab-experiments#yeast-production). Running the other way, the ecological
model sets what efficacy has to reach before any of it is worth doing, and the
transfer model says which lever raises that efficacy most cheaply.

> **FIGURE —** The model chain: affordability → allowable cost → manufacturing
> cost → required titre, alongside efficacy → colony outcome. Each arrow marked
> as stakeholder evidence, literature or our own assumption, so a reader can see
> where the chain is load-bearing and where it is hopeful.

## Still missing

- The first BEEHAVE cycle, brought onto the wiki from the working document.
- Sensitivity analysis for the RNA design score weights.
- The model-chain figure.
- A decision on the fermentation techno-economics.

## Where this connects

[RNA design](/software) · [Economic modelling](/economic-modelling) ·
[Ecological modelling](/ecological-modelling) · [Yeast](/wet-lab-experiments#yeast-production) ·
[Entrepreneurship](/entrepreneurship) · [Results](/results) ·
[Safety and security](/project-safety)
