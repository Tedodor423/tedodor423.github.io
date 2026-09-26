```component
honey-hex
```

## Who we spoke to

```component
hp-stats
```

```component
stakeholder-map
```

> **TODO —** Map positions are the institution or region named in each
> write-up, resolved to coordinates; each conversation now has its own cell,
> so a dense cluster (the UK) spills onto neighbouring cells. Confirm them.
> Two of the withheld interviewees are still named in the page source, which
> is a public repository; decide whether even that much should wait for
> consent. Owner: HP.

> **TODO —** The stakeholder photographs are not uploaded yet: the dev server
> shows them from the local `wiki-assets-source/stakeholder-photos/` folder,
> but the published site shows drawn silhouettes until they go through the
> uploads tool. Upload that folder (instructions in its README, including the
> four files that must **not** be uploaded while consent is outstanding) and
> the faces appear without a code change. Before uploading, record each
> photo's source and licence in [Attributions](/attributions) and confirm the
> person is happy to have their face shown. Owner: HP.

> **TODO —** The 25 September write-up lists interviews with Professor Nancy
> Moran and Professor Peter Unrau as done but not written up. They are absent
> from the map and the roster until a write-up exists to transcribe. Owner:
> HP.

## HONEY as a method, not a label

The loop is the transferable part of this work, so we are publishing it as a
method rather than as a heading structure. It has three rules:

1. **A question earns a place only if it passes three tests:** at least three
   stakeholders, at least one documentable design change, and at least one link
   to a lab or dry-lab cycle. If nothing changed, it is not a HONEY cycle.
2. **Every interaction is recorded in the same six fields:** who · why we spoke
   to them · what we asked · what we learned · what changed · remaining
   disagreement or uncertainty. The last field is the one that makes the record
   worth reading.
3. **Yield must name the next question.** A cycle that ends in a conclusion has
   stopped; a cycle that ends in a question has turned.

The write-up of HONEY for another team to pick up is part of
[Contribution](/contribution).

> **TODO —** The third layer is not written: for each interview, the real
> question list, the discussion by topic, and a reflection on what we would ask
> differently. The six fields below are the second layer. Owner: HP.

## The six questions

Our engagement is organised by question, not by person, because the same person
often matters to three questions for three different reasons.

**The loop closes.** Every Yield hands a new question back to Hear, and the six
questions below are in the order the loop produced them. Q1 established that
resistance and reinfestation, not mite mortality, were the problem, which asked
whether a chemical could fix it at all — Q2. Deciding on RNA made the delivery
organism the open question — Q3. Answering that by removing the living organism
did not remove the RNA, so the harm question had to be asked separately — Q4.
The chassis we chose no longer persists, so someone has to reapply and pay for
it — Q5. And every answer so far was given to us by people in three countries
who did not agree with each other — Q6.

### Q1 — How and why is Varroa a problem, and what treatments exist?

**Anchor interview — Danny Le Feuvre**, CEO, Australian Honey Bee Industry
Council · 28 May 2026

- **Why we spoke to them.** Preliminary research pointed us at two places
  struggling hardest with Varroa, Australia and California. Le Feuvre speaks for
  the Australian industry.
- **What we asked.** How Varroa developed into a problem in Australia, and what
  our treatment would have to do to be usable by Australian beekeepers.
- **What we learned.** Varroa arrived in Australia in 2022. An eradication
  programme costing A$100 million failed and the mite was declared endemic;
  difficulty moving bees east to west has so far held the spread to New South
  Wales, Victoria and Queensland. Two separate populations resistant to synthetic
  treatments such as amitraz were established in 2025, which pushed beekeepers
  onto organic acids and thymol — and those are not effective in isolation. In
  Queensland, **40% of beekeepers plan to quit** within 12 to 24 months on
  profitability and Varroa control; 14–15% of Australian agriculture is directly
  reliant on feral and managed bee pollination. There are no regulated RNAi
  products in Australia.
- **What changed.** It sent us to regulators rather than straight to the bench,
  and it defined the problem as reinfestation, resistance and repeated labour
  **rather than mite mortality**.
- **Remaining uncertainty.** Our own write-up of this interview is not clean. It
  names the organic acids in use as formic, thymol and "tactilic" acid, which is
  not a treatment; until the interviewer confirms whether that was lactic or
  oxalic acid we are not publishing the third name. The same document gives two
  different figures for how much of Australian agriculture depends on bee
  pollination — 14–15% in the interview narrative and about 50% in the summary.
  We use the narrative figure and flag the conflict rather than picking the
  larger number `[FLAG]`.

Supporting: **Chris Hiatt** on resistance at 18,000-colony scale; **Mike
Allerton** and **Wade Ford** on Australian practice; **Elizabeth Frost** on
resistance and the Australian season; **Professor Giles Budge** on bee health.
Dissenting: **Mark Sandham** and the **Oxfordshire Natural Beekeeping Group**,
who question whether treating is desirable at all.

**Observe.** Resistance is present tense. Frost reports dual resistance already
detected in Australia, which puts essentially every legal synthetic miticide on
a short clock. Le Feuvre on what that means in a hive: *“Beekeepers are unable
to use those synthetic treatments largely…we're getting these re-infestation of
mites, so they're pulling out [treatments] and within weeks they're back at
threshold having to treat again.”* Hiatt's operation went from one CheckMite+
strip a year that worked, to **55% losses in the third year** when the mites became
resistant, to rotating amitraz, oxalic acid, formic acid and brood breaks:
*“But it's just throwing everything but the kitchen sink at them. And some of
our worst years over the last 10 years, we've had like 60% loss, 50%.”* What
remains has its own limits: formic acid has a temperature ceiling much of
Australia exceeds, most of the continent has no brood break, thyme oil taints
honey, and Frost, Allerton and Ford all report off-label homemade treatments
filling the gap. The documented failure modes of the whole chemical class, with
sources, are in Q2's Observe below. The cost is people: *“In New South Wales,
we've lost 35% of our commercial beekeepers, [they've] deregistered…in
Queensland, 40% of commercial beekeepers are planning to leave the industry in
the next 12 to 24 months citing profitability and Varroa control as the main
reason.”*

**Navigate.** The problem stopped being mite mortality and became a system:
colony survival, repeated labour, the cost of rebuilding, and the pollination
that depends on all of it. The treatment-free beekeepers narrowed it further.
Sandham and the Oxfordshire group have lower counts than they had on chemicals,
and they told us why it works for them and not for everyone: small apiaries with
varied genetics can adapt; large, genetically uniform commercial operations
cannot. Our target user **became the commercial beekeeper**, and every interview
after May was chosen on that basis.

**Evaluate.** A single mode of action is a countdown. Whatever we built had to
be designed for resistance from the start, and had to hold for **months rather
than weeks**, because a treatment that needs repeating every few weeks is the
labour problem beekeepers were already leaving the industry over.

**Yield.** Multiple RNA targets and resistance management in [RNA
design](/software), and a duration target the [bee lab](/bee-lab) persistence
work is measured against. Feeds [Project Description](/project-description),
[Engineering](/engineering) and both case studies. **Next question:** if
rotating four chemicals still loses half the colonies, is another chemical the
answer at all?

### Q2 — Why RNAi rather than another chemical?

**Anchor interview — Professor Paul Lam**, President and Chair Professor of
Environmental Chemistry, Hong Kong Metropolitan University · 6 July 2026

- **Why we spoke to them.** To compare the environmental burden of chemical
  pesticides against an RNAi biopesticide, and to learn how to evidence that the
  alternative is safer. He has led over 35 government consultancy projects in the
  environmental field.
- **What we asked.** What the real environmental impacts of chemical pesticides
  are, what the risks of our approach would be, and how to mitigate them.
- **What we learned.** The standing charges against chemical pesticides are
  toxicity to non-target species, bioaccumulation and biomagnification, and
  resistance. A sequence-specific, biodegradable RNAi agent avoids most of them.
  Off-target effects remain the key concern, and bioinformatic screening against
  representative species is a legitimate way to address it — provided the choice
  of species is justified rather than convenient. Risk handling is identify,
  assess, manage, communicate, and communication is the hardest step.
- **What changed.** Off-target screening moved inside the sequence-design
  pipeline instead of sitting after it. He also corrected our language: when we
  said cost-benefit analysis, he asked for **risk-benefit analysis**, so that the
  risks of an idea count alongside its costs. [Safety](/project-safety) is
  written as a risk-benefit case because of that. His last point — that public
  engagement is part of risk management, not publicity — is why the podcast and
  talks in [outreach](/education) address risks as well as benefits.
- **Remaining uncertainty.** Which tool, and against which species, our screen
  actually runs. See the flag under Yield below.

**Professor Giles Budge**, Newcastle University · 9 April and 13 July 2026.
We asked him the question that could have sunk the whole route: Ramsey et al.
(2019) found Varroa feed on the fat body rather than the haemolymph, so would
dsRNA in haemolymph ever reach a mite? His answer was that the fat body is
entirely bathed in haemolymph, so a mite feeding on it **does ingest haemolymph**
and whatever dsRNA is in it — consistent with Garbian et al. (2012) measuring
mite mortality in mites taken off dsRNA-fed adult bees. He also backed the
Mango-biotin fluorescence assay for quantifying dsRNA, which we completed, and
the 300/500/700 bp GFP length series. **What changed:** the adult-bee feeding
route stayed alive, and both assays went into the [bee lab](/bee-lab).

**Danny Le Feuvre** added the field version of the same argument: the synthetics
have been phased out by resistance, the naturally-derived acids that replaced
them are not effective in isolation, and no RNAi product is regulated in
Australia at all. **Chris Hiatt** supplied the counterfactual — chemicals worked
in isolation once, then stopped, and rotation still costs him half his colonies
in a bad year, with viruses doing most of the killing. **The EPA, FDA and USDA**
told us what an RNAi product would be judged on: bee safety, environmental
impact, safety to the person handling it, and whether anything enters honey or
another food.

**Observe.** Australia and the US both approve a range of Varroa chemicals —
synthetic miticides such as amitraz, coumaphos, flumethrin and fluvalinate, and
naturally-derived acids and essential oils such as formic acid, oxalic acid and
thymol (1)(2) `[LIT]`. Their documented problems are health risks to bees or
humans, residues in honey and hive products, resistance, narrow temperature
windows, incompatibility with honey supers, and off-label use (1) `[LIT]`.
Chemical controls therefore sit at the top of the Integrated Pest Management
pyramid, used only after prevention, cultural, mechanical and biological
controls have failed (3) `[LIT]`. Resistance is the part that compounds: since
Varroa arrived in Australia in 2022, resistance to major synthetics has been
observed in every state with the mite except the Australian Capital Territory
(4) `[LIT]`, and in the US it has been a running battle since 1997 (5)
`[LIT]`, with USDA ARS still reporting a mite mutation conferring amitraz
resistance (6)(7) `[LIT]`.

RNA interference is a different mechanism rather than a better chemical. It
exploits the silencing pathway every mite already carries, so it offers a new
mode of action against populations resistant to conventional treatments; it is
modular, because a different sequence silences a different gene; and it is
biodegradable, with sprayed dsRNA reported undetectable in soil within two days
(8)(9)(10) `[LIT]`. It is also not new: the US EPA has already registered two
RNAi pesticides, Calantha for Colorado potato beetle and Norroa for Varroa
(11)(12) `[LIT]`, and in one survey 93% of beekeepers expressed no concern about
using RNAi against Varroa or said they would adopt it (13) `[LIT]`.

That last finding reframed the question. An RNAi treatment for Varroa exists, so
**ours has to be better than it**, not merely different from a chemical.

1. [Chemicals for treating Varroa — AHBIC](https://honeybee.org.au/wp-content/uploads/2024/07/AGF575-Chemicals-for-treating-Varroa-S1V2-1.pdf)
2. [EPA-registered pesticide products approved for use against Varroa mites in bee hives](https://www.epa.gov/pollinator-protection/epa-registered-pesticide-products-approved-use-against-varroa-mites-bee-hives)
3. [Integrated Pest Management for Varroa — AHBIC](https://honeybee.org.au/wp-content/uploads/2024/05/AGF575-IPM-S1V2-corrected.pdf)
4. [Varroa mite — Australian Government outbreak.gov.au](https://www.outbreak.gov.au/current-outbreaks/varroa-mite)
5. [Miticide resistance in Varroa — International Journal of Pest Management](https://www.tandfonline.com/doi/full/10.1080/09670874.2022.2094489?scroll=top&needAccess=true)
6. [Finding more effective treatments in the fight against Varroa mites — USDA ARS](https://www.ars.usda.gov/news-events/news/research-news/2026/finding-more-effective-treatments-in-the-fight-against-varroa-mites/)
7. [Helping beekeepers fight mites through more effective treatments — UC Davis](https://www.ucdavis.edu/food/news/helping-beekeepers-fight-mites-through-more-effective-treatments)
8. [Considerations for the environmental risk assessment of sprayed or externally applied dsRNA-based pesticides — OECD](https://www.oecd.org/content/dam/oecd/en/publications/reports/2020/09/considerations-for-the-environmental-risk-assessment-of-the-application-of-sprayed-or-externally-applied-ds-rna-based-pesticides_898e0d9f/576d9ebb-en.pdf)
9. [RNAi-based biopesticides — PMC12514095](https://pmc.ncbi.nlm.nih.gov/articles/PMC12514095/#CR28)
10. [RNAi as a crop-protection technology — Trends in Biotechnology](<https://www.cell.com/trends/biotechnology/fulltext/S0167-7799(17)30090-2>)
11. [GreenLight Biosciences launches Norroa, the first RNA-based treatment for Varroa mites](https://greenlightbiosciences.com/articles/greenlight-biosciences-launches-norroa-the-first-rna-based-treatment-for-varroa-mites)
12. [GreenLight Biosciences announces EPA registration of Calantha](https://greenlightbiosciences.com/articles/greenlight-biosciences-announces-epa-registration-of-calantha)
13. [Beekeeper attitudes to RNAi against Varroa — Frontiers in Insect Science](https://www.frontiersin.org/journals/insect-science/articles/10.3389/finsc.2026.1814622/full)

**Navigate.** Two design requirements came out of the comparison with Norroa,
which targets a protein essential for mite reproduction. It acts as birth
control, so it takes weeks to show an effect, and it is fed as a sugar syrup to
adult workers rather than to the larvae Varroa mostly feed on `[FLAG]` — that
account is from beekeepers who have used it and is not yet sourced to a
published document. So: target survival genes as well as reproductive ones, and
find **a route that reaches larvae**. We ranked candidate targets by protein-network
connectivity and transcript abundance, and added specificity as a third
criterion on Lam's advice. The delivery candidates were engineered *S. alvi*,
which lives in the bee gut and would produce dsRNA continuously, and
*S. cerevisiae*, which is easy to engineer, lacks an endogenous RNAi system so
long dsRNA accumulates, and is already fed to bees as a protein supplement. That
choice is Q3.

> **IP gate —** the specific Varroa gene target is not named anywhere on this
> wiki pending a patent-filing decision. Owner: R&D.

**Evaluate.** RNA gave us what no chemical on the list could: a mode of action
**resistant mites have never met**, and a mechanism whose specificity is a design
parameter rather than a property we have to accept. The cost is that specificity
has to be demonstrated, not asserted, which is why Q4 exists as a separate
question.

**Yield.** Off-target screening became a step inside [RNA design](/software)
**rather than a check after it**, and [Safety](/project-safety) is written as a
risk-benefit case.

> **TODO —** Our own write-up says the screen uses BLAST; R&D's note says the
> tools are Bowtie1 for exact matches and Edlib for approximate ones, and that
> the comparison may only be against the honeybee transcriptome rather than a
> justified set of representative species. Those are different claims and the
> second matters to Lam's advice. Resolve with R&D before the freeze, and state
> the species list inline. Owner: HP and R&D.

> **TODO — this is our thinnest question, and we are naming it.** We did not
> interview anyone who has taken an RNAi biopesticide to market. GreenLight,
> Norroa and Bayer were all on the target list and none was reached. It is the
> single biggest gap in our stakeholder roster. Owner: HP.

**Next question:** RNA has to be made by something and delivered by something.
Does that something have to be alive in the hive?

### Q3 — Should we be making a living GMO at all?

Early on, a living engineered organism looked elegant. If the organism
producing the RNA could live inside the bee, production and
delivery become the same process, and *Snodgrassella alvi* — a natural member of
the bee gut microbiome — was the obvious candidate. Then we asked what happens
to it **after it leaves the laboratory**. Persistence stopped being only a benefit,
replication stopped being only a convenience, and colonisation stopped being
only a delivery strategy. The question changed from *what is the most
biologically persistent way to deliver RNA?* to *should NECTAR be deploying a
living GMO at all?*

**Anchor interview — Office of the Gene Technology Regulator**, Geraldine Lester
and colleagues, Australian Government · 24 July 2026

- **Why we spoke to them.** Le Feuvre had told us Australia regulates chemical
  products tightly because it exports so much of what it makes. The OGTR is the
  authority that would decide.
- **What we asked.** How the three versions we were considering — constitutive
  *S. alvi*, inducible *S. alvi*, and a non-living engineered-yeast product —
  would each be regulated.
- **What we learned.** The non-living yeast product would not be regulated by
  the OGTR, because the administered product contains **no living GM organism**.
  Both *S. alvi* versions would be. An inducible switch changes elements of the
  risk assessment but not the authorisation route, so adding control does not buy
  a different category. The evidence a living system would need includes whether
  the bacterium moves between colonies, colonises other insects, or affects
  native bees and non-target mites, and what happens if it or its products enter
  honey. The applicant carries the burden of generating that evidence; there is
  no universal set of experiments. Unlike some regulators, the OGTR does not
  weigh a GMO's potential benefits when assessing it.
- **What changed.** This is the interview the chassis decision turns on. It made
  the inducible design — our planned engineering answer to the containment
  problem — **worthless as a regulatory strategy**.
- **Remaining uncertainty.** They noted that gut bacteria have a lifespan and
  must be reintroduced, which from a regulatory point of view can count as an
  advantage, because the organism is not permanently present if not reapplied.
  That cuts slightly the other way and we have not pursued it.

**Hear.** Beekeepers did not line up behind us. **Mike Allerton** was drawn to
*S. alvi* precisely because it cut labour, the biggest problem with any
treatment, though he expected the yeast patty to be more widely accepted and
suggested developing both for two distinct markets. **Danny Le Feuvre** called
persistence in the hive attractive before listing what it would need — public
acceptance, containment, communication and regulation — and his ideal treatment
works from a single feeding. **Wade Ford** preferred patties, because his
beekeepers already feed them and attitudes to a living GMO would count against
the bacterium; he asked us to be transparent about the biotechnology either way.
**Chris Hiatt** and **Josette Lewis** supported the patty on scale, which
suggested a different answer to the labour problem: not self-replicating
biology, but a product that fits into a job the beekeeper already does.

**Observe.** Four jurisdictions, one boundary.

- **Australia.** As above: the living route is inside the OGTR's remit, the
  non-living one is not.
- **United Kingdom.** **Professor Jim Dunwell**, Chair of ACRE, refused **the easy
  version of our conclusion**. Environmental assessment follows pathways to harm —
  where the therapeutic travels, what encounters it, whether that causes harm —
  and off-target mites are relevant whether the dsRNA came from a bacterium or an
  inactivated yeast. **Lord John Krebs** mapped the three regimes: contained use
  through the HSE, environmental release through ACRE, anything reaching honey,
  beeswax or pollen through the Food Standards Agency.
- **Scotland.** **Laura Bowden** (SASA) placed heat-killed yeast in a grey area
  — it may avoid some GM release requirements, but a grey area is not an
  exemption, and it is **a weaker claim than the OGTR's**, recorded as such.
- **United States.** The **EPA, FDA and USDA** cautioned that living versus
  non-living does not by itself make the path easier or harder. Jurisdiction
  follows what the product does; our treatment might be assessed as an animal
  drug rather than a pesticide, because it treats the bee.

Our own legal mapping across Australia, Europe, Switzerland, Singapore and the
US found the same shape. Switzerland is the clearest case: a living GM delivery
organism could need contained-use authorisation, federal authorisation for
experimental release and later product approval, while a non-living RNA product
would ordinarily sit outside GMO law and be regulated as the therapeutic it is.
Singapore shows a different problem — no single regulator, with GMO research,
import and release split across agencies depending on context. The conclusion we
drew was narrow: environmental persistence **multiplies the number of regulatory
questions** NECTAR has to answer in every market it enters. Yeast is not
universally easier.

Two constraints came from outside the regulators. **Tom Hartley** (Soil
Association Certification) explained that organic standards look at the
production pathway, not only the final product: a GMO anywhere upstream can **cost
a product its organic status**, which made the living route an obvious problem and
heat-killed yeast the more promising of the two. **Melanie Teece** (Hilltop
Honey) and Krebs both put honey itself in scope — consumers expect honey to be
natural and healthy, and anything detectable in it brings food-safety regulation
with it.

**Navigate.** The criteria for choosing an organism widened from efficacy to:
efficacy, treatment duration, dose control, beekeeper labour, manufacturing
cost, environmental containment, regulatory feasibility, food safety,
scalability, social licence and compatibility with existing practice. Against
that list, the decision was to **separate the place where the GMO produces
NECTAR from the place where NECTAR is used**. Engineered yeast makes the dsRNA
in a fermenter; heat inactivation and formulation follow; what reaches the hive
cannot replicate. *S. cerevisiae* is an industrially established chassis with
mature fermentation infrastructure, it is readily engineered, and it lacks the
canonical RNAi machinery that would otherwise chew up the long dsRNA we want to
accumulate. It may also let us formulate whole or inactivated biomass rather
than purifying the RNA out of it, which removes the most expensive downstream
steps.

The cost is real and we are not hiding it: an inactivated product cannot
reproduce, so once its RNA is consumed or degraded, **more has to be administered**.

**Evaluate.**

- **Containment.** Heat inactivation is biocontainment by design: the product
  cannot reproduce in the hive, establish a persistent engineered population, or
  multiply in unused supplement. That matters most against **Professor Jeff
  Barrick**'s warning, from having engineered *S. alvi* himself, that *S. alvi*
  can **persist in wild bee species** — a pathway that runs past the treated colony
  entirely.
- **Biological activity.** Killing the organism **does not kill the RNA**. An unused
  patty still contains functional, sequence-specific RNA, so the environmental
  question moves from the chassis to the molecule: degradation, exposure and
  non-target interaction. That is Q4.
- **Waste.** Heat-killed biomass has already had the inactivation step that
  GMO-contaminated material requires, which helps; producing it at scale still
  generates waste that has to be managed. See [sustainability](/sustainability).

**Yield.** We stopped building the inducible *S. alvi* and moved to engineered
yeast, **heat-inactivated before it reaches a colony**. The change goes deeper than
swapping one organism for another. NECTAR now uses synthetic biology where it
pays most, in the controlled manufacture of programmable dsRNA, and no longer
requires environmental replication of the engineered chassis for the therapy to
work. It shows up in [Engineering](/engineering), [Yeast](/wet-lab-experiments#yeast-production) and
[Safety](/project-safety).

**The dissent stands.** Dunwell told us that *“the delivery method is secondary
to the endpoint”*. If he is right, the containment argument we gained is smaller
than we claim. **We have not resolved this**, and we say so here rather than in a
footnote.

**Next question:** we removed the living organism, but not the RNA. So what can
the RNA still harm?

### Q4 — Could our solution harm anything else?

> **TODO — this question is the least finished on the page.** We have the
> stakeholder input and the design response; we do not yet have results
> demonstrating an absence of off-target effects, a comparison of NECTAR's
> environmental impact against the pesticides it would displace, or any
> interview with a company that has managed off-target risk in a deployed RNAi
> product. Each gap is marked below. Owner: HP.

**Hear.** The striking thing about this question is who raised it. Off-target
harm came up with academics and regulators — **Professor Paul Lam** on
ecotoxicology, **Professor Jim Dunwell** and the **OGTR** on non-target mites,
native bees and spread, **Lord Krebs** on other mites and arachnids and on
allergy if anything reaches honey, the **EPA, FDA and USDA** on bee, user, food
and environmental safety, **Tom Hartley** on the wider production system. It
came up far less with beekeepers, whose first concern was **almost always cost**.

That mismatch is **a finding, not an aside**. It is an argument for consulting
widely, because the people who buy the product were not the people who named its
main environmental risk. It is also a commercial warning: if minimising
ecological impact adds cost, the two groups want different things, and nobody
said so out loud because they were never in the same room.

**Anchor perspectives.** Dunwell's is the operative standard — a regulator
identifies every plausible pathway to harm and asks for evidence on each, and he
specifically expected **experimental evidence in relevant non-target mites**. Lam's
is the method — identify, assess, manage, communicate — and the insistence that
representative species be chosen with a justification.

**Observe.** The regulatory research done for Q3 produced one result that
belongs here: **regulators care about off-target effects whether or not a GMO
produced the dsRNA.** Dropping the living chassis removed a category of
questions about the organism; it removed none of the questions about the
molecule. Whichever route we had taken, we would still have to show where the
dsRNA goes and what it silences when it gets there.

> **TODO —** Two open research questions the team has named and not answered:
> whether the LMO / non-LMO distinction changes how stringently off-target
> effects are assessed, and how existing commercial RNAi products mitigated
> off-target risk in practice. The second is the same gap as Q2's missing
> practitioner interview. Owner: HP.

**Navigate.** Off-target screening was built into target selection rather than
run as a check afterwards — the pipeline is described in [RNA
design](/software) and the population-level consequences in [ecological
modelling](/ecological-modelling). The honey pathway became a wet-lab question
**rather than a talking point**: Teece asked us to test whether dsRNA leaves
residues in honey and whether it perturbs the NMR and LC-HRMS tests the industry
uses for purity, and Ford asked us to test it after processing, since honey is
heated to 65 °C for eight hours to be sent into Western Australia.

**Evaluate.** We can state the design intent and the screening method. We cannot
yet state a result. An honest reading of where we are: no off-target effects
would mean substantially less ecological impact at comparable efficacy and cost,
and that is the claim the work is aimed at — but it is **a target, not a finding**.

> **TODO —** The dsRNA-in-honey result is not on the wiki. Report it here with
> the eight-field result block, including if it is negative or inconclusive.
> Owner: wet lab.

> **TODO —** A comparative environmental assessment of NECTAR against the
> acaricides it would displace, allowing for some off-target effect, has not
> been attempted. Decide whether it is worth doing before the freeze, and say so
> either way. Owner: HP and ecological modelling.

**Yield.** Input from the academic and regulatory side — **not from the market** —
reoriented target design towards ecological safety alongside efficacy. That is
the whole of the change, and the page should not claim more than that until the
results land.

**Next question:** a product safe enough to approve is still no use if nobody
will buy it. What would a beekeeper actually use?

### Q5 — What would a beekeeper actually use, and what can they afford?

**Anchor interview — Wade Ford**, Beekeeper Services Manager, Hive & Wellness
Australia · 13 August 2026

- **Why we spoke to them.** He sits between a large Australian processor and the
  beekeepers who supply it, so he sees what is actually used across many
  operations rather than one.
- **What we asked.** What Varroa management costs, what his beekeepers
  prioritise, and which of our two delivery routes they would take.
- **What we learned.** Varroa management costs split **roughly 60% product and 40%
  additional labour**; formic acid runs to about A$7 per hive, which compounds
  over 1,000-plus hives, before counting synthetics bought and colonies replaced
  only to find the mites resistant. Priorities in order: cost, then
  effectiveness, then time and labour, then ease of use. His beekeepers already
  feed pollen patties.
- **What changed.** The delivery format became a stakeholder choice rather than
  a laboratory one, and **cost moved ahead of efficacy** in how we rank our own
  requirements. He also gave us hive profiles from his beekeepers for the model.
- **Remaining uncertainty.** He asked for regional efficacy data — how the
  treatment behaves at Australian temperatures — which we do not have.

**Anchor interview — Professor Brittney Goodrich**, Agricultural and Consumer
Economics, University of Illinois Urbana-Champaign · 7 August 2026

- **Why we spoke to them.** She models the annual economics of a commercial
  beekeeping operation, which is the unit our product has to be affordable for.
- **What we learned.** Her representative operation runs 8,500 colonies and
  sends about 5,000 to California for almonds. Capital recovery and equipment
  are 27% of total costs, labour 21%, and **Varroa treatment products alone 9%** —
  excluding the labour to administer them and the cost of replacing lost hives,
  so the true figure is higher. The modelled operation runs two amitraz
  treatments, one oxalic and one formic acid a year. One worker covers about 700
  colonies. Almond pollination brings about $195 per colony and honey about 70 lb
  per colony, so a dead colony costs its rebuild and its revenue.
- **What changed.** Treatment price **stopped being our measure** of the cost of
  Varroa. The model now counts labour, repeat administration, colony rebuilding
  and lost pollination and honey revenue.

Supporting: **Chris Hiatt**, who wants three to four months of protection and no
extra trip to 18,000 hives; **Josette Lewis** on scale — about 80% of US
commercial colonies converge on California for the almond bloom, in what she
called a *“codependency between the tree and the bee and between the almond
grower and the beekeeper”*; **Mike Allerton** on two distinct markets and on
hobbyists who cannot afford treatments at all; **Melanie Teece**, who puts cost
ahead of efficacy because honey is a low-margin product and her beekeepers take
the cheapest option that works; **Elizabeth Frost**, who pointed out that
Norroa's sugar syrup needs a window with no nectar flow that the Australian
season rarely gives, while pollen is limiting, so a patty could be a colony's
main protein source; **Mark Sandham** as the counterpoint, for whom the right
cost is zero. One withheld conversation also bears on this question.

**Observe.** In our own dataset, NSW beekeepers report about A$22.18 per hive of
direct Varroa control plus 0.37 hours of labour per hive, and US Varroa control
runs to about US$9.22 per colony a year `[CALC]`.

**Navigate.** Thurman set the method: the counterfactual is **the best existing
treatment, not doing nothing**; start at operation level and measure the change in
costs and revenues rather than survival rates or honey yields; then a simple
partial-equilibrium model with assumed elasticities for market effects, counting
only paid pollination and the crops that depend on managed bees. Benefits to
growers pass down the supply chain to consumers. And never multiply an
industry's value by a treatment's efficacy: the A$4.6 billion pollination figure
shows the scale of the stakes, not the value of NECTAR.

The delivery answer fell out of the same conversations. Inactivated yeast is
already fed to bees as a protein supplement and many commercial patties contain
it, so the treatment goes into the patty the beekeeper is already putting in the
hive. The biological path follows the practice: pollen patty → nurse bee →
larval feeding → larval haemolymph → feeding Varroa. Instead of asking
beekeepers to adapt to our technology, **we adapted the technology to the
beekeepers**.

**Evaluate.** Under our current assumptions, NECTAR gives a net private benefit
of about US$47.9 per treated colony per year in the US and A$18.9 per treated
hive in Australia, after its own assumed cost; at market level, roughly 8.8
million lb more honey and 123,000 more pollination-capable colonies in the US,
and 4.5 million kg and 29,000 colonies in Australia, each about 4.6 million a
year in modelled surplus in its own currency `[CALC]`. Those benefits come from
fewer colony replacements, less treatment spend and less labour.

The tension that remains is Frost's: commercial beekeepers used to synthetics
driving counts to undetectable may distrust a product that leaves a detectable
alcohol-wash count, however good the colony outcome. That is **a communication
problem we have not solved**.

**Yield.** Pollen-patty delivery, chosen by stakeholders rather than by the lab,
with duration, labour and scale as hard requirements — the nurse-bee to larva
route the [bee lab](/bee-lab) tests. And the economic model turned inside out:
it no longer asks what our product costs, it starts from **what a beekeeper can
afford** — provisional constraints of US$12 per colony and A$20 per hive — and
works back through allowable cost per dose to manufacturing cost to the yeast
titre the fermentation has to reach. That chain is in [economic
modelling](/economic-modelling), sets the target in [Yeast](/wet-lab-experiments#yeast-production), and is the
spine of [Entrepreneurship](/entrepreneurship).

> **TODO —** Every `[CALC]` number above is from the team's dataset and has not
> been independently checked. Verify each against the spreadsheet before the
> freeze, and state the assumptions inline where the model is described. The
> required yeast titre itself is still to be written into the chain. Owner:
> economic modelling.

**Next question:** every number above came from Australia or California. Does
any of it hold anywhere else?

### Q6 — Would the same solution work everywhere?

**Anchors.** **Danny Le Feuvre** for Australia — recent establishment,
reinvasion, treatment constraints and beekeeper economics. **Josette Lewis**,
**Chris Hiatt** and **Professor Brittney Goodrich** for California — migratory
commercial beekeeping, almond pollination and operational scale. Supporting:
**Mark Sandham** and the **Oxfordshire Natural Beekeeping Group** for the UK
treatment-free perspective; the **OGTR**, **ACRE**, **Krebs** and **Soil
Association Certification** and the **EPA, FDA and USDA** for the regulatory
divergence; **Wade Ford** and **Mike Allerton** on Australian implementation;
**Melanie Teece**, whose company sources most of its honey from China and South
America, where Varroa has not materially affected supply and the binding costs
are transport and testing.

**Observe.** The same product meets different constraints in each place. Formic
acid has a temperature ceiling much of Australia exceeds, and most of the
continent has a long brood period with often no brood break at all. Norroa's
syrup needs an absence of nectar flow the Australian season rarely provides,
while pollen is limiting, which makes a patty more attractive there than it
would be elsewhere. Honey shipped into Western Australia is heated to 65 °C for
eight hours, so residue and degradation behaviour has to be tested under
processing, not only in the hive. In California the constraint is not climate
but logistics: about 80% of US commercial colonies converge on one bloom, and a
treatment that needs a separate visit to each colony is a different product from
one that does not. And the regulatory answer is **genuinely different in each
jurisdiction** — the OGTR's remit test, the UK's three regimes, the US
function-based split, Switzerland's three-permit route for a living organism.
The **Scottish Government Honey Bee Health Team** put Varroa in Scotland's top
three bee threats, which places the problem **outside our two case studies
entirely**.

**Navigate and Evaluate.** We rejected the assumption that there is **one
deployment context**, and built the regions out as separate studies along five
axes: pest pressure, current practice, economics, regulation and stakeholder
attitudes. They are at [case studies](/case-studies) —
[Australia](/case-studies/australia) and
[California](/case-studies/california).

**Yield.** Region-specific hive profiles and country-specific economic analyses
in [economic modelling](/economic-modelling), regional efficacy and
honey-processing tests in the [wet lab](/wet-lab), and a deployment argument in
[Entrepreneurship](/entrepreneurship) that does not assume one market.

> **TODO —** Decide whether the UK gets its own case study or folds into Q1.
> Either is defensible; leaving it half-written is not. Owner: HP.

**Back to Hear.** The open loop is the one we cannot close from Oxford: none of
the beekeepers who would use NECTAR has seen it work, because **we do not yet have
efficacy data** to show them. The next turn of the loop is taking results back to
Le Feuvre, Ford and Hiatt and asking whether the thing we built is the thing
they described.

## Before and after

The project we ended with is not the one we started. This is the team's own
summary of what moved and why.

| Before                                                                 | What we heard                                                                        | After                                                                        |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| A treatment for Varroa, possibly chemical                              | Mites were growing resistant to chemical pesticides and reinfesting hives            | An RNA-based biopesticide                                                    |
| Engineered *S. alvi* producing dsRNA inside bees and reproducing there | Regulatory concerns around GMOs, environmental concerns, concerns about honey        | Heat-killed engineered yeast fed to bees                                     |
| Feeding bees *S. alvi* directly, a difficult process                   | Beekeepers need a treatment that is scalable, affordable and not labour-intensive    | Heat-killed yeast in the pollen patties beekeepers already feed for nutrition |

## The decision that changed the project

The clearest piece of integrated human practices we have, and it deserves more
than a row in a table.

Stakeholder evidence → constraint identified → alternative considered →
technical change → consequence. We began with a continuously-producing living
engineered organism in the bee gut. The OGTR made the comparison concrete on
24 July: the yeast route **sits outside its remit**, the living route requires
environmental-release assessment, and making the bacterium inducible changes the
risk assessment but not the route. Regulators in three more jurisdictions, an
organic certifier and the scientist who has engineered *S. alvi* himself each
added a reason. We moved to an engineered yeast that is inactivated before it
ever reaches a colony.

Two things make this worth reading rather than just reporting.

**It went against what beekeepers told us they wanted.** Mike Allerton was drawn
to the *S. alvi* route because it would cut labour, the biggest problem with any
treatment. Danny Le Feuvre's ideal treatment works from a single feeding, and he
called persistence in the hive attractive before he listed the reasons it would
be hard to license. We **chose the harder product** on regulatory grounds, and two
of the beekeepers whose problem we are trying to solve preferred the other one.
Allerton's own hedge is why we can live with that: if the yeast patty proves
effective it will probably be the most widely accepted version, and he suggested
developing both.

**One expert rejects the framing entirely.** Jim Dunwell, who chairs the
committee that would assess a UK release, told us *“the delivery method is
secondary to the endpoint.”* If he is right, part of our justification for the
switch does not hold, and the containment argument we gained is smaller than we
claim. We have not resolved this, and we are not going to pretend we have.

## The smaller loops

Not every change was a pivot. Each of these traces to a named conversation and
lands on a page:

| Heard                                                           | Changed                                                             |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| Labour at commercial scale (Ford, Hiatt, Lewis, Goodrich)       | Pollen-patty delivery; application frequency as a requirement       |
| Resistance in the field (Le Feuvre, Frost, Hiatt)               | Multiple targets and resistance management in [RNA design](/software) |
| Regulation (OGTR, Krebs, Dunwell, Bowden, McLoughlin, EPA/FDA/USDA) | Chassis and formulation                                          |
| Patties already in the hive (Ford, Hiatt)                       | The nurse-bee to larva route in the [bee lab](/bee-lab)             |
| Manufacturing economics (Thurman, Goodrich)                     | A required yeast titre in [economic modelling](/economic-modelling) |
| Ecological concern (Lam, Krebs, Dunwell)                        | Off-target screening inside the design pipeline                     |
| Residues in honey (Teece, Ford, Krebs)                          | dsRNA-in-honey tests in the [wet lab](/wet-lab)                     |
| Does haemolymph reach the mite? (Budge)                         | The adult-bee feeding assay kept, the length series added           |
| A split-YFP sensor that is not specific (Barrick)               | The aptamer-based dsRNA measurement in [Measurement](/measurement)  |
| Baseline comparison is the evidence (McLoughlin)                | Conventional practice as the counterfactual in every model          |
| Treatment-free works for us, not for you (Sandham, OxNatBees)   | The target user narrowed to commercial beekeepers                   |

If a row cannot be linked to the page where the change shows up, the change
probably did not happen.

## What we got wrong

- **We assumed regulators would care how the RNA got in.** Dunwell corrected us:
  they care **where it goes afterwards**. We had been distinguishing our two designs
  by delivery system for two months by then.
- **Q2 is thin and we left it thin.** We identified the gap — no one who has
  taken an RNAi biopesticide to market — early enough to fix it, and did not.
- **We asked beekeepers what they wanted, then chose otherwise.** Defensible on
  regulatory grounds, and still a cost, recorded above rather than smoothed over.
- **We never got the two sides of Q4 in the same room.** Regulators and
  academics raised off-target harm; beekeepers raised cost. We noticed the
  mismatch at write-up, not while we could still ask about it.
- **The beekeeper survey is unusable as it stands.** It was distributed and
  answered, and neither the distribution nor the responses were recorded.
- **Four conversations cannot be published.** Consent was not secured at the
  point of interview in one case, and review conditions are outstanding in
  three. That is our process failing, not the interviewees'.

## Still missing

- Consent or review resolved for the four withheld conversations.
- An RNAi-biopesticide practitioner interviewed for Q2.
- The off-target screening tool and species list confirmed with R&D.
- The `[CALC]` numbers in Q5 checked against the spreadsheet, and the yeast
  titre written into the chain.
- The dsRNA-in-honey result for Q4.
- Dates for the Scottish Government, SASA, CBD and Amateur Beekeepers Australia
  conversations.
- The beekeeper survey: distribution, response count and findings.
- The podcast episodes, and the public glossary Q2 and Q4 point to.
- The third-layer interview write-ups and the HONEY method written up as
  something another team could pick up.

## Where this connects

[Case studies](/case-studies) · [Safety and security](/project-safety) ·
[Yeast](/wet-lab-experiments#yeast-production) · [Economic modelling](/economic-modelling) ·
[Entrepreneurship](/entrepreneurship) ·
[Sustainable development](/sustainability) · [Public outreach](/education) ·
[Engineering](/engineering) · [Contribution](/contribution)
