This page answers "what would happen after iGEM?", with numbers where we have
them and marked clearly where we do not.

## The chain

**What a beekeeper can afford → allowable cost per dose → allowable
manufacturing cost → required mass of intact active dsRNA per gram of dry yeast.**

An affordability constraint taken from stakeholder evidence becomes a
specification for the wet lab. The derivation is on
[economic modelling](/economic-modelling), including the caveat that the titre it
is calibrated against has never been measured, so every cost figure downstream is
a `[CALC]` resting on an assumption.

## The product

A pollen patty containing heat-inactivated engineered yeast carrying dsRNA
against the selected *Varroa* target, fed to the colony through a 3D-printable
hive insert. The beekeeper receives a supplement they **already know how to use**.
Nothing in the box is alive.

> **TODO —** Fix the product specification: patty mass, dose per colony,
> applications per season, shelf life and storage conditions. Chris Hiatt asked
> for three to four months of protection; we do not yet know what we can offer.
> Owner: entrepreneurship with wet lab.

## The user

Two customers, not one, and they buy differently.

- **Commercial operations.** Thousands of colonies, roughly 700 colonies per
  worker, often on migratory pollination contracts. Labour per hive visit
  dominates, so anything requiring an extra trip to every hive is expensive
  before it is effective.
- **Small-scale and hobby beekeepers.** Fewer colonies, no economies of scale,
  far more price-sensitive per unit. The accessibility argument under
  [sustainable development](/sustainability) is about this group.

A third party matters in the US specifically: bee brokers, who contract colonies
from beekeepers to growers (Josette Lewis).

## User journey

**Order → store → apply → replace → dispose.** Each step can fail commercially
whether or not the biology works.

| Step    | What has to be true                                                               | Status                                                   |
| ------- | --------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Order   | Available through the channels beekeepers already buy feed from                   | **Proposed**                                             |
| Store   | Shelf-stable without cold chain, across a season                                  | **Proposed**, untested                                   |
| Apply   | Fits an existing feeding visit, with no extra trip                                | **Proposed**, and the reason the patty format was chosen |
| Replace | Replacement interval known and compatible with the pollination calendar           | Unknown, depends on efficacy duration                    |
| Dispose | Unused patty disposed of safely and legally; see [safety](/project-safety)        | **Proposed**, degradation experiments not yet run        |

## Current alternatives

- **Synthetic acaricides** (amitraz, historically coumaphos): effective until they
  are not. Chris Hiatt lost 55% of his colonies in the third year of CheckMite+
  use as resistance took hold.
- **Organic acids** (oxalic, formic): widely used and cheap — Wade Ford quotes
  formic acid at about A$7 per hive — but formic has a temperature ceiling and
  off-label use is common.
- **Thyme oil**: leaves a bitter taste in honey.
- **Existing RNAi approaches**: Norroa is not available at commercial scale
  (Hiatt). **Scalability, not efficacy**, is the reported failure.
- **Breeding for Varroa resistance**: a real route, with some evidence that
  selection for resistant traits reduces honey production.

The counterfactual for our economics is **the best of these**, not no treatment. See
[economic modelling](/economic-modelling).

## Unmet needs

Each traceable to the conversation it came from, on
[human practices](/human-practices).

| Need                                           | Who said it                |
| ---------------------------------------------- | -------------------------- |
| Cost first, ahead of efficacy                  | Wade Ford; Melanie Teece   |
| Works across thousands of colonies             | Chris Hiatt; Josette Lewis |
| No additional visit to every hive              | Chris Hiatt; Wade Ford     |
| Three to four months of protection             | Chris Hiatt                |
| Transparency about the biotechnology used      | Wade Ford                  |
| No residue problem in honey                    | Wade Ford; Melanie Teece   |

## Value proposition

What we can say now: the treatment is delivered inside a feeding visit that
already happens, so the labour component of Varroa management — roughly 40% of
its cost, per Wade Ford — is not increased. That is a claim about the delivery
format, and it **holds independently of the biology**.

What we cannot say yet: a price against a named alternative, because the
manufacturing cost depends on **a titre nobody has measured**.

> **TODO —** "Cheaper and more sustainable" is not a value proposition. Write one
> sentence with a number in it, once the titre sensitivity sweep on
> [economic modelling](/economic-modelling) lands. Owner: entrepreneurship.

## Manufacturing

Fermentation of the engineered yeast, heat inactivation, drying, and formulation
into patty. The route's attraction is that **none of it is novel**: industrial yeast
fermentation is mature, widespread infrastructure, which is why the cost argument
is an operating-cost argument rather than a capital one.

**Status: Modelled**, and thinly. The scale-up pathway our notes reference — a
100 m³ fermentation route — has not been worked through with inputs, yields and
costs.

> **TODO —** Either document the fermentation techno-economics properly, with
> sourced inputs, yields and a sensitivity analysis, or downgrade them explicitly
> to an illustrative calculation. Both are acceptable; an unsupported number
> presented as an estimate is not. Same open item as on
> [the modelling index](/model). Owner: entrepreneurship.

## Techno-economic analysis

The demand-side grounding is on [economic modelling](/economic-modelling):
Brittney Goodrich's modelled commercial operation — 8,500 colonies, 27% of costs
in capital recovery and equipment, 21% labour, 9% in Varroa treatment products
alone, about $195 per colony from almond pollination — and Wade Ford's Australian
60/40 split between treatment cost and the labour of applying it.

Everything on the supply side of that comparison is a `[CALC]` resting on an
assumed titre, including the figure of about £2 per gram that appears in our
sustainability draft.

## Regulatory path

The answer differs materially by jurisdiction. Detail on [the case studies](/case-studies) and
[safety and security](/project-safety).

- **United Kingdom and EU.** Heat-killed yeast is not a living modified organism
  under the Convention on Biological Diversity (Austein McLoughlin, CBD
  Secretariat), which materially simplifies the position relative to a live
  symbiont. Grey areas remain: Laura Bowden (SASA) set out where the Scottish
  position is unsettled.
- **Australia.** See [the Australia case study](/case-studies/australia).
- **United States.** Jurisdiction is split across EPA, FDA and USDA; see
  [the California case study](/case-studies/california).
- **New Zealand.** A strict GMO regime, which is part of why the inactivated
  yeast route was pursued at all.

### A dated opportunity: the EMA consultation

**EMA/CVMP/NTWP/24800/2026** is a live European Medicines Agency consultation on
RNAi and antisense veterinary medicines, **closing 31 October 2026**. Its scope
excludes GM cells — which means inactivated yeast has a stronger argument for
inclusion than any live-organism delivery route, and gives us something specific
to say rather than a general comment.

> **TODO —** File a response to EMA/CVMP/NTWP/24800/2026 before the wiki freeze on
> 21 October 2026, and link it here. Very few teams put a submission into a real
> regulatory consultation. Owner: HP with entrepreneurship. Hard deadline.

### A precedent worth citing

Inactivated *S. cerevisiae* cell walls are already an approved EU crop-protection
active substance, which would give our carrier existing toxicology and
shelf-stability precedent to point at. `[FLAG]`

> **TODO —** Verify the LAS117 / Romeo approval and cite the EU active-substance
> record directly, or drop the claim. Owner: HP.

## Development roadmap

Five stages, in order. We are **inside the first**.

| Stage                    | What it means                                                                 | What it needs                                                      |
| ------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1. Laboratory proof      | Measured titre; dsRNA intact through inactivation and formulation; mite assay | The unsolved titre problem on [yeast](/wet-lab-experiments#yeast-production)                      |
| 2. Apiary trial          | Colony-scale efficacy against the model's predicted threshold                 | Efficacy target from [ecological modelling](/ecological-modelling) |
| 3. Scale-up              | Fermentation at production volume, with real yields and costs                 | The techno-economics above, documented                             |
| 4. Regulatory submission | Classification and dossier, per jurisdiction                                  | The regulatory work above; residue and environmental-fate data     |
| 5. Commercial deployment | Distribution through existing feed channels                                   | A commercial partner; none identified                              |

> **TODO —** Figure: The roadmap as stages, dependencies and decision points, drawn so
> it is obvious how early in the sequence the project sits: stage 1 is not
> complete.

## Risks

| Category      | Risk                                                                            | Mitigation                                                                            |
| ------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Technical     | Yeast titre never reaches the required mass per gram, so the cost case collapses  | None yet. The project's single largest unresolved risk; see [yeast](/wet-lab-experiments#yeast-production)           |
| Technical     | dsRNA does not survive heat inactivation, drying and storage intact               | Integrity assays planned; **Proposed**                                                |
| Regulatory    | Heat-killed yeast classified as a GMO product in a target jurisdiction            | Early engagement, and the EMA consultation response above                             |
| Adoption      | Beekeepers reject a biotechnology product on principle or on consumer perception  | Transparency about the technology used (Ford's advice); the podcast and outreach       |
| Adoption      | Efficacy duration falls short of the pollination calendar                         | Unknown until stage 1 completes                                                       |
| Manufacturing | Fermentation economics are worse at scale than assumed                            | Owed: the techno-economic documentation above                                         |
| Ecological    | *Varroa* evolves resistance at the target site                                    | Modular construct allows a sequence swap; annual resequencing **Proposed**            |
| Ecological    | Off-target silencing in non-target organisms                                      | Homology screening inside the design pipeline; see [safety](/project-safety)          |

> **TODO —** PDF: SWOT, business model canvas, roadmap and risk register are owed as
> documents, uploaded to `static.igem.wiki` and linked here. The table above is
> the risk register in draft; the other three do not exist yet and have **not**
> been invented for this page. Owner: entrepreneurship.

## Capabilities we would need and do not have

- Fermentation process development at pilot scale, and access to a pilot plant.
- Regulatory affairs expertise for a veterinary or crop-protection dossier.
- An apiary partner able to run a multi-colony field trial across a season.
- Analytical capability for honey residue testing — Wade Ford and Melanie Teece
  both asked for it, Teece specifically against the NMR and LC-HRMS purity tests
  the industry uses.
- Capital. No figure attached; see the techno-economics TODO.

## Beyond the first product

If NECTAR is a platform, *Varroa* is the first market rather than the only one.
Adjacent applications the team has identified: bee colony health more broadly,
salmon and sea lice, shrimp aquaculture, mosquito control, crop fungal disease,
and biopesticides more generally.

All **Proposed**, none underway. And the platform argument is about the RNA
design method, **not the carrier**: engineered inactivated yeast as an oral dsRNA
vehicle is not novel, and we do not claim it is. See
[engineering](/engineering).

## Still missing

- Verified numbers with citation tags throughout, starting with the titre.
- SWOT, business model canvas and a finished risk register.
- The roadmap figure.
- The EMA consultation response, filed.
- Product specification: dose, interval, shelf life.

## Where this connects

[Economic modelling](/economic-modelling) · [Yeast](/wet-lab-experiments#yeast-production) ·
[Human practices](/human-practices) · [Case studies](/case-studies) ·
[Safety and security](/project-safety) · [Hardware](/hardware) ·
[Sustainable development](/sustainability) · [NECTAR for the future](/future)
