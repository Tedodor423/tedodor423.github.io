NECTAR is an **end-to-end platform** for designing, validating, producing and
deploying RNAi interventions. _Varroa destructor_ is the first real-world case
study through which we demonstrate and stress-test the platform.

## 1. The problem

Of the 115 leading global food crops, 87 depend at least partly on animal
pollination, and those crops account for about 35% of global crop production by
[volume](https://royalsocietypublishing.org/rspb/article/274/1608/303/76437/Importance-of-pollinators-in-changing-landscapes).
The most valuable of those pollinators is the western honey bee, _Apis
mellifera_, and the greatest threat to its health is a parasitic mite,
[_Varroa destructor_](https://pubmed.ncbi.nlm.nih.gov/32456963/).

Pests weigh on the whole food system: up to 40% of global crop production is
lost to them each year, invasive insects cost the global economy at least
US$70 billion a year, and plant diseases over US$220
[billion](https://doi.org/10.4060/cb4769en). Demand is not falling either. The
[FAO](https://www.fao.org/agrifood-economics/publications/detail/en/c/1475516/)
projects that agricultural demand will rise by 50% by 2050 against a 2013
baseline, and honeybees are central to meeting it.

## 2. Why RNAi

Chemical pesticides are reaching their limits. An estimated 64% of the world's
agricultural land is at risk of pesticide pollution from more than one active
ingredient and 31.4% falls in the high-risk class, while pesticide use is
expected to keep
[rising](https://www.nature.com/articles/s41561-021-00712-5).

They also meet **resistance**, which is not a one-off failure of a particular
compound but the predictable arc of every chemical class. _Varroa_ control shows
it most clearly: the same pattern has run through every class of acaricide
beekeepers have been given. Pyrethroid resistance appeared in Italian _Varroa_
populations in the early 1990s, where Apistan® efficacy fell to a mean of 44.5% across
[Lombardy](https://doi.org/10.1051/apido:19950109); it reached south-west
England by August [2001](https://doi.org/10.1051/apido:2002027). Coumaphos
resistance followed in [Italy](https://doi.org/10.1051/apido:2001110), amitraz
resistance in the United States from
[1999](https://doi.org/10.1051/apido:2000134). The amitraz mechanism is now
mapped to point mutations in a β-adrenergic-like octopamine
[receptor](https://doi.org/10.1007/s10340-021-01471-3), and in a recent US
screen every one of the 39 mites tested carried a resistance
[genotype](https://doi.org/10.1371/journal.ppat.1013939). A new compound of the
same kind would inherit the mechanism that is failing, so we did not look for
one.

**Specificity and programmability** are the case for RNAi instead. A chemical is
a fixed molecule: when resistance arrives, the compound fails and has to be
replaced. An **RNA biopesticide** is a _sequence_. When resistance mutations
arise the sequence can be rewritten while the production and delivery system
stays as it is, which turns resistance into an editing problem rather than a
discovery problem.

Because the active ingredient is a nucleic acid rather than a persistent small
molecule, bioaccumulation, toxicity and residue carry-over largely stop being
concerns: the best-characterised agricultural double-stranded RNA has a soil
half-life of 15–28 hours and is undetectable after
[48](https://doi.org/10.1371/journal.pone.0093155).

None of this is far off. The US EPA registered the first sprayable
double-stranded RNA pesticide in December
[2023](https://www.epa.gov/pesticides/epa-registers-novel-pesticide-technology-potato-crops),
and in May 2025 proposed registering one against _Varroa_
[itself](https://www.epa.gov/pesticides/epa-proposes-register-new-pesticide-varroa-mite-control).

> **TODO —** The team's draft dates the _Varroa_ dsRNA registration to September
> 2025, but the EPA page linked above records only the May 2025 proposal and its
> comment period. Find the final registration decision and link it with its
> date, or leave this as the proposal it is. Owner: HP.

### What is RNA interference?

Cells use double-stranded RNA as a signal to switch genes off. An enzyme called
**Dicer** cuts long double-stranded RNA into fragments of roughly 21 to 22
nucleotides. One strand of each fragment is loaded into a protein complex, which
then finds the messenger RNAs matching that sequence and cuts them, so the
protein they encode is never made. What gets silenced is decided by sequence,
not by chemistry, which is the whole attraction and also the reason a sequence
has to be screened against the species we do not want to affect. The machinery
differs from insect to insect too, so a design is species-specific
([Koo and Palli, 2024, on insect RNAi](https://pmc.ncbi.nlm.nih.gov/articles/PMC11695441/)).

For pest control, the consequence is the useful part: feed a pest
double-stranded RNA matching one of its own essential genes, and the animal
silences that gene itself. Feeding was first shown to control beetle pests at
field-relevant potency in [2007](https://doi.org/10.1038/nbt1359).

> **TODO —** The draft also says a few molecules per cell are enough for a
> measurable fall in the transcript and its protein. The review cited above does
> not state that. Cite the source that does, or drop the sentence. Owner: dry lab.

> **TODO —** Figure: mechanism. dsRNA → uptake → silencing, readable without a caption.

## 3. Why RNAi is not already everywhere

Six barriers stand between the mechanism and a deployable product, and NECTAR's
pipeline is organised around them:

1. **Rational target selection** — which gene to silence is the first hard problem.
2. **Off-target screening** — a sequence that hits the pest may hit something else.
3. **Single-target resistance** — one target is one mutation away from failing.
4. **Manufacturing cost** — the RNA has to be cheap enough to use at field scale.
5. **Environmental degradation** — RNA does not last long outside a cell.
6. **Inefficient delivery** — the RNA still has to get inside the pest.

Some are scientific problems and some are economic or regulatory; **they need
different answers**. The first three, and part of the fifth, are answered by how
the sequence is designed (section 5); the last three by how the molecule is
manufactured and delivered (sections 6 and 7).

## 4. Introducing NECTAR

NECTAR is the pipeline end to end, as **a platform rather than a product**:
design ([RNA design](/software)), production
([yeast](/wet-lab-experiments#yeast-production)), delivery
([bee lab](/bee-lab)) and validation ([measurement](/measurement)). The target
changes from pest to pest; the method does not.

Measurement runs alongside the other three rather than after them: a design is
only validated if a known dose goes in and the intact dsRNA left in the bee can
be quantified. The published doses we started from turned out not to be
reproducible quantities at all ([Measurement](/measurement)).

The platform was built on live colonies. With access to honeybee hives at the
University of Oxford's John Krebs Field Station through the summer, the wet lab
and the [bee lab](/bee-lab) ran as two intertwined streams: constructs went from
the bench into bees and mites, and what the bee lab found went back into the
next round of design and measurement ([Engineering](/engineering)). The assays
we had to build to work with bees at all are written up for the teams that come
after us in [Working with bees](/working-with-bees) and
[Contribution](/contribution). Beekeepers, regulators, industry and honeybee
researchers shaped each layer ([Human practices](/human-practices)).

### Prior work, and what is genuinely ours

Yeast-delivered dsRNA against _Varroa_ is **not** novel. It is anticipated by
Beeologics/USDA US 9,540,642 and by Duman-Scheel US 11,252,965, and loop-ended
dsRNA against _Varroa_ is published work.

What is new is the **RNA design method**: how a target sequence is chosen,
screened and iterated, and the instrumented loop around it. That is the claim
this project defends. See [Engineering](/engineering), [RNA design](/software)
and [Contribution](/contribution).

> **TODO —** Verify that both patent numbers resolve and that each actually
> anticipates what we say it anticipates, and cite the loop-ended dsRNA
> publication. Agree the final novelty wording as a team before the freeze.
> Owner: team lead.

> **TODO —** The specific _Varroa_ gene target is withheld pending confirmation
> of the patent priority filing date against the 21 October freeze. No page on
> this wiki names it until that is resolved. Owner: team lead.

## 5. RNA design

RNA design is **the novel core of the platform**. Published work has silenced
individual _Varroa_ genes, but it offers no standard way to compare candidate
genes, and none for choosing which region of a gene to use. A team starting a
dietary-RNAi project today picks a target because someone else picked it.

**SEED** (Selective enginEEring of dsRNA) is our answer: a three-stage pipeline
that ranks target genes on functional connectivity, abundance and published RNAi
evidence; scores the regions inside a gene on the features of the mite's own
small RNAs, on Dicer processing and on how accessible the target transcript is;
and then screens the surviving regions against the _Apis mellifera_
transcriptome. The stages and every metric name are on
[RNA design](/software), and the pipeline runs as one interface from gene
selection to the off-target screen.

Design also fixes the shape of the molecule, which is where stability and
resistance are answered. Loop-ended dsRNA has no exposed single-stranded ends
for nucleases to attack, and SEED regions from four genes are joined into one
construct so that a single molecule addresses several genes rather than one.
Both decisions, and what happened when we tried to build them, are in
[Engineering](/engineering).

**Status: Modelled.** No bench result has yet confirmed a sequence SEED chose:
the mite screen was inconclusive, and the reason was the health of the larval
host rather than the design ([Results](/results)).

## 6. Production

Current _Varroa_ RNAi treatments are made in cell-free reactions, which are
expensive, hard to scale and leave the RNA to be purified before it can be used.
We used cell-free transcription ourselves, to make test material quickly, but a
hive-scale product needs a living factory. We compared three candidates on three
criteria: production at agricultural scale, stable accumulation of intact dsRNA,
and regulatory feasibility.

**_Snodgrassella alvi_, and why we left it.** A honeybee gut symbiont, already
engineered by others to deliver dsRNA against _Varroa_, and the route we started
on. Conversations with Professors Jeffrey Barrick and Nancy Moran and with Sean
Leonard, who pioneered it, turned us away: an engineered gut symbiont is a live
GMO, is not approved for use in the honeybee industry, and is a point of real
concern for beekeepers. How _S. alvi_ moves between honeybees and wild bee
populations is also poorly understood, which makes off-target effects hard to
predict and is itself a regulatory problem. It needs non-standard culture
conditions on top of that.

**_S. cerevisiae_, and why it won.** Three arguments, and they are separate
ones. **The molecule survives**: yeast has no native RNAi machinery, so nothing
in the cell recognises and cuts the loop the construct is built around, and
full-length hairpin RNA accumulates intact in yeast where it is degraded in
_E. coli_ HT115 (Zhong et al. 2019, _Genes_ 10:458) `[LIT]`. **Industrial
fermentation is a solved problem**, mature and cheap, which is not true of the
alternatives. **The cell is the formulation**: heat-inactivated yeast is not
classed as a GMO and retains RNAi activity, so the whole cell goes into a
honeybee feed supplement with no RNA purification step at all. Yeast is already
a normal ingredient of those supplements.

**_E. coli_, kept as the comparison.** Higher yield, but the RNA has to be
purified out of it, and an RNase III knockout does not stop a loop-ended
molecule being processed, which is what the design exists to prevent.

The number that decides whether the cost case holds is the mass of intact dsRNA
per gram of yeast. It is still unmeasured, and the chassis argument, the
construct and that gap are on [yeast](/wet-lab-experiments#yeast-production).

## 7. Delivery

Delivery is **where most field RNAi fails**. Current _Varroa_ dsRNA treatments
go into the hive in sucrose solution, in which the RNA lasts a few hours.

Our formulation is the production chassis itself: heat-inactivated engineered
yeast mixed into a **pollen patty**, the protein supplement beekeepers already
feed their colonies. Whole cells rather than purified RNA buys four things at
once. The patty is a feed bees take readily; the yeast fraction can be raised a
long way without making it unpalatable, which raises the dose; heat-inactivated
yeast is not a GMO; and a patty reaches the brood. dsRNA in brood food is passed
on by nurse bees to the larvae that _Varroa_ feeds on, which is the stage where
the mite does its damage. Professor Geraldine Wright, who has engineered yeast
to supply sterols to honeybees, made that last point and recommended the
formulation.

Delivery is also where the project has a physical product: a 3D-printed **hive
insert** that mounts inside a standard frame and presents the formulation to the
colony. It is on [hardware](/hardware) with the rest of the kit we built, and
the delivery chain it feeds — formulation, nurse bee, larva, haemolymph, mite —
is measured link by link on [the bee lab](/bee-lab).

## 8. Varroa as the case study

Why this pest, on this host, in this setting is **a hard proving ground** rather
than a convenient one: a mite feeding on a bee inside a sealed hive, reached
through a pollen patty by way of a nurse bee or a larva. If the platform works
here, the awkward cases elsewhere look more tractable.

Whether it would be worth using is a separate question from whether it works,
and it is the one the modelling answers: what an effective treatment has to
achieve, how the _Varroa_ problem changes over time, and when in the year to
treat ([the models](/model), [colony dynamics](/ecological-modelling),
[cost](/economic-modelling)). [The case studies](/case-studies) show what
changes when the setting changes, from Australia to California.

## 9. What Oxford iGEM 2026 actually did

**The ledger**, split four ways:

| Status           | Means                                        |
| ---------------- | -------------------------------------------- |
| **Demonstrated** | We did it and we have the data               |
| **Investigated** | We ran it; the result is partial or negative |
| **Modelled**     | Computational only, no bench data            |
| **Proposed**     | Designed, not built                          |

The same four labels are used everywhere on this wiki. A reader who learns them
here can read any other page.

> **TODO —** Write the ledger itself: every workstream's work sorted into those
> four columns, each row linking to its block on [Results](/results). Nothing
> may sit in a higher column than the results page supports, and the same set
> of claims must match the achievement cards on [the home page](/).
> Owner: team lead.

## Where this connects

[Engineering](/engineering) · [RNA design](/software) · [Yeast](/wet-lab-experiments#yeast-production) ·
[Results](/results) · [Human practices](/human-practices) ·
[Safety and security](/project-safety) · [Timeline](/timeline)
