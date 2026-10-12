We built four models and scoped a fifth. The colony model sets the efficacy a
treatment needs, the delivery layer inside it turns that efficacy into a dsRNA
titre, and the economic model says which titres a beekeeper can afford. The answer,
**0.005–0.05 mg dsRNA per g yeast**, is the target the wet lab works to. All of them
are **Modelled**, and each has its own question and, where it is large enough, its
own page.

## Where the parameters come from

No model on this wiki currently uses **a parameter we measured ourselves**. Every
one is taken from the literature or from stakeholder evidence, or set to a
provisional value until bench data replace it. This
names the most valuable thing the next iteration could do: close the loop between
bench and model.

## How every model here is written

The same eight beats, every time:

**Question → Inputs → Assumptions → Model → Sensitivity and validation →
Prediction → Decision it informed → Limitations**

And every model carries one visible box: **How did this change NECTAR?**

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

**Status: Modelled.** Built and run as the delivery layer of BEEHAVE
[cycle M3](/engineering#cycle-m3); detail on
[ecological modelling](/ecological-modelling).

- **Question** — between a patty in the hive and a dead mite, where is the dose
  lost, and what titre does the wet lab have to reach?
- **Inputs** — three set by the user: dsRNA concentration in the yeast, yeast
  supplied per day, and the treatment period. Then five steps that reduce the
  dose (consumption by bees, systemic delivery, degradation, transfer to a
  feeding phoretic mite, uptake by the mite), a saturating dose-response, the
  probability of knockdown and the probability that knockdown kills the mite.
- **Assumptions** — that delivery separates into those steps. The five step values
  are provisional, within biologically plausible orders of magnitude.
- **The model** — the probability of mite death follows from the dose supplied,
  where BEEHAVE's own treatment kills a fixed share of mites whatever the dose.
- **Sensitivity and validation** — concentration and yeast supply were swept
  full-factorially, six by five, under three regimens. The five steps were held
  fixed, so which of them moves the outcome most is still open. Not validated.
- **Prediction** — above 0.01 mg dsRNA per g yeast, collapse is prevented with a
  hundred times less yeast than at the lowest concentration; winter treatment
  matches year-round.
- **Decision it informed** — whether effort belongs on raising dsRNA
  concentration, which is hard, or on feeding more, which is easy. Feeding more
  yeast works, but it raises the price, so the titre decides affordability.
- **Limitations** — none of the five steps is measured, and no bee-to-mite
  transfer probability comes from our bench.

> **How did this change NECTAR?**
>
> It made the titre, and not the amount of patty fed, the number the wet lab is
> held to: **0.005–0.05 mg dsRNA per g yeast**, set together with the economic
> model below.

### Colony and Varroa dynamics

**Status: Modelled.** Owner page:
[ecological modelling](/ecological-modelling), which carries the DBTL cycles,
the transfer chain and the full parameter sweep list.

- **Question** — what efficacy, applied on what schedule, changes a colony's
  trajectory under mite pressure?
- **Inputs** — BEEHAVE's colony and forage model, four hive profiles from our
  beekeeper interviews, and our own treatment layer.
- **Assumptions** — BEEHAVE's own, plus a forage landscape left unconstrained in
  the second and third cycles.
- **The model** — BEEHAVE with adult bee deaths from mite feeding added, and a
  treatment and dsRNA-transfer layer.
- **Sensitivity and validation** — the parameter sweeps are the sensitivity
  analysis and have been run; the test list is on the owner page. **Validation
  against an independent dataset has not been done**, and we do not claim it.
- **Prediction** — colony outcome is insensitive to starting infestation, with
  collapse at an average of 4 years; the efficacy target is a treatment efficiency
  of about **0.05**; a **winter-only regimen matches year-round treatment**; and
  the titre the therapy needs to be affordable is **0.005–0.05 mg dsRNA per g
  yeast**.
- **Decision it informed** — it sets the efficacy target the wet lab aims at, and
  converts it into a titre the fermentation has to reach.
- **Limitations** — reinfestation from neighbouring colonies, beekeeper
  behaviour, and a landscape not yet reconstrained for climate or land-use
  change.

> **How did this change NECTAR?**
>
> It produced the two numbers the rest of the project is built around. The
> **0.05 treatment-efficiency target** is what a colony actually needs, and
> decomposing that into a delivery chain turned it into **a titre target of
> 0.005–0.05 mg dsRNA per g yeast** — the specification the
> [yeast work](/wet-lab-experiments#yeast-production) is measured against. It also
> found that **winter-only treatment is as effective as year-round**, which is a
> regimen current acaricides cannot use and a cold-tolerant in-hive patty can, and
> that argument went back into the beekeeper interviews on
> [human practices](/human-practices).

### Economic model

**Status: Modelled.** Owner page: [economic modelling](/economic-modelling).

- **Question** — what can a beekeeping operation afford, and what does that
  demand of the fermenter?
- **Inputs** — the cost structure of an average commercial operation, existing
  treatments as the counterfactual, assumed elasticities of supply and demand.
- **Assumptions** — an assumed annual NECTAR cost and an assumed cut in colony
  losses, because the real titre, and so the real cost, is unmeasured.
- **The model** — operation level first, then a simple partial-equilibrium view
  of the market.
- **Sensitivity and validation** — titre is the input that decides it.
  [Cycle M3](/engineering#cycle-m3) prices the yeast at six titres against the
  benefit. Not validated.
- **Prediction** — a net private benefit of about US$47.9 per treated colony per
  year in the US and A$18.9 per hive in Australia `[CALC]`; set against the cost
  of the yeast, a required titre of 0.005 mg dsRNA per g yeast for the US and
  0.05 mg/g for both.
- **Decision it informed** — it turned "high expression" into a number for
  [yeast](/wet-lab-experiments#yeast-production).
- **Limitations** — every downstream figure rests on the assumed titre.

> **How did this change NECTAR?**
>
> It converted an affordability constraint into **an engineering specification**.
> This is the one place on the wiki where a model hands the wet lab a target
> number rather than a graph.

### The feeding pathway, and the mite-titre curve

**Status: Proposed.** Nothing here has been built. It was scoped to characterise
the feeding pathway **if** we cannot analyse the haemolymph results from the adult
and larval stability assays, and if those assays do not give the results we want.

- **Question** — what dose of ledRNA actually reaches a mite by way of a bee, and
  what knockdown and mortality follow from that dose?
- **Inputs** — dosage and volume fed; expected degradation in the gut; passage
  from gut to haemolymph; expected ledRNA degradation in adult and in larval
  haemolymph; entry into the hypopharyngeal glands and the concentration and
  volume in gland secretions; the volume of larval haemolymph taken by *Varroa*
  between the 5th instar and pupation.
- **Assumptions** — each model takes the previous model's output as its assumed
  input dose, so the three compound: an error at the gut propagates all the way to
  a mortality figure.
- **The model** — three linked models. First, dsRNA uptake into the nurse bee gut
  and assimilation into haemolymph, from which the expected ledRNA dose reaching
  larvae is extrapolated. Second, ledRNA stability in larval haemolymph. Third,
  expected knockdown of the *Varroa* target, and the mortality that results. These
  are deliberately different from the models published by
  [Estonia-TUiT 2023](https://2023.igem.wiki/estonia-tuit/), which were themselves
  extensive.
- **Sensitivity and validation** — not designed.
- **Prediction** — none. Nothing has been run.
- **Decision it informed** — its own scope. The first model was set aside: the
  upstream gap in the physical characterisation of the NECTAR pathway is a crucial
  further step in developing the biopesticide, but **there is very little
  replicable quantitative information** on dsRNA stability in adult haemolymph, or
  on the dose that enters and is fed from the hypopharyngeal glands, so a model of
  it would rest on nothing. The plan instead, whatever the mite titre results show,
  is a **mite-titre curve**: estimate, across a range of ledRNA doses and our best
  and worst candidate targets, the knockdown of the target gene in mites and the
  mortality that follows. The brood-frame mite assay has since returned a negative
  confounded by larval condition ([cycle V4](/engineering#cycle-v4)); the curve
  does not depend on it, and would be literature-derived throughout.
- **Limitations** — setting the upstream models aside is what makes the curve
  buildable, and it is also its limitation: the curve would say what happens to a
  mite at a given exposure and **nothing about what exposure our delivery route
  achieves**. The two must not be conflated.

> **TODO —** The judgement that the upstream pathway is not worth modelling is the
> team's own note, and the note says to "still check and confirm this in the
> literature". Do that check and record the outcome, because the whole modelling
> plan for the next month turns on it. Owner: dry lab.

> **TODO —** Our note for the third model reads "expected mite miRNA knockdown".
> Everywhere else the project silences a *Varroa* mRNA. Confirm which is meant
> before the curve is fitted. Owner: dry lab with RNA design.

> **How did this change NECTAR?**
>
> **TODO —** Unanswerable today: the write-up records a plan, not an outcome, and
> the curve has not been built. Fill this box when it is, or drop the model.
> Owner: dry lab.

### Fermentation techno-economics

**Status: not yet a model.** Today this is a set of assumptions sitting inside
the economic model — a fermentation route, a batch scale, a unit cost — not an
independent model with its own inputs and its own sensitivity.

> **TODO —** Either document the fermentation techno-economics properly, with
> sourced inputs and a sensitivity analysis, or state plainly that it is an
> illustrative calculation inside the economic model. Both are acceptable;
> presenting the second as the first is not. Owner: entrepreneurship.

The dosing and transfer work **is** a model, with its own parameters and its own sweep. The fermentation
economics are **not**, yet.

## How the models connect

**The chain is the story.** What a beekeeper can afford
constrains manufacturing cost, which constrains required titre, which becomes a
design requirement for [yeast](/wet-lab-experiments#yeast-production). Running the other way, the ecological
model sets what efficacy has to reach before any of it is worth doing, and the
transfer model says which lever raises that efficacy most cheaply.

> **TODO —** Figure: The model chain: affordability → allowable cost → manufacturing
> cost → required titre, alongside efficacy → colony outcome. Each arrow marked
> as stakeholder evidence, literature or our own assumption, so a reader can see
> where the chain is load-bearing and where it is hopeful.

## Where this connects

[RNA design](/software) · [Economic modelling](/economic-modelling) ·
[Ecological modelling](/ecological-modelling) · [Yeast](/wet-lab-experiments#yeast-production) ·
[Entrepreneurship](/entrepreneurship) · [Results](/results) ·
[Safety and security](/project-safety)
