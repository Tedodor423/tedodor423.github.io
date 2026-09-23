> **What this page proves —** that talking to people changed the technical
> project, and that we did not smooth away the parts where they disagreed with
> us or with each other.
> **Where the evidence is —** the interview record below, the quotes, and the
> technical page each change links to.

The test for this page: would the project look different if we had never had
these conversations? A headcount does not answer that, so the count appears
once here and the rest of the page is spent on what the conversations changed.

**26 conversations, six countries, one pivot.** Four of the 26 are withheld
pending consent or review. They are still counted, because leaving them out
would misstate how much we heard, and nothing from them appears on this page.

We started out building a living engineered gut bacterium that would make
Varroa-killing RNA inside the bee for as long as it lived there. We finished
with a dead yeast in a pollen patty. Every step of that change traces to a
named person below.

## The record

```component
stakeholder-map
```

> **TODO —** Map positions are the institution or region named in each
> write-up, resolved to coordinates. Confirm them. Two of the withheld
> interviewees are still named in the page source, which is a public
> repository; decide whether even that much should wait for consent. Owner: HP.

## HONEY — how we worked

Our human practices run on a loop rather than a checklist:

|                  |                                                                |
| ---------------- | -------------------------------------------------------------- |
| **H — Hear**     | Who has a stake, and what do they actually say?                |
| **O — Observe**  | What is already true — practice, cost, regulation, prior work? |
| **N — Navigate** | What constraints does that place on what we can build?         |
| **E — Evaluate** | What does that mean for the design in front of us?             |
| **Y — Yield**    | What changed — and what new question did the change open?      |

The loop closes. Every Yield hands a new question back to Hear: Q1's answer
took away the persistence that beekeepers liked, which is what made Q4 and Q5
necessary.

```component
honey-loop
```

HONEY is also a method another team could use on an entirely different
project. Publishing it as one is part of [Contribution](/contribution).

## The six questions

Our engagement is organised by question, not by person, because the same
person often matters to three questions for three different reasons. Each
question had to pass the same bar before it earned a place here: at least three
stakeholders, at least one documentable design change, and at least one link to
a lab or dry-lab cycle.

### Q1 — Should we be making a GMO at all?

**Hear.** Anchor: the **Office of the Gene Technology Regulator**
(Geraldine Lester and colleagues, 24 July 2026), the only binary,
jurisdictionally authoritative answer we obtained. Supporting: **Lord John
Krebs** on the UK's three regimes; **Laura Bowden** (SASA) and the **Scottish
Government Honey Bee Health Team** on Scotland; **Austein McLoughlin**
(Convention on Biological Diversity) on the international position; **Tom
Hartley** (Soil Association Certification) on organic status; the **EPA, FDA
and USDA** on the US; **Professor Jeff Barrick**, who has engineered *S. alvi*
himself, on containment; and two conversations we cannot yet publish.
Dissenting: **Professor Jim Dunwell**, Chair of ACRE. Counterpoint: **Mike
Allerton** and **Danny Le Feuvre**, who preferred the living system.

**Observe.** There are two regulatory pathways, not one. The OGTR told us a
non-living yeast product falls outside its remit while both *S. alvi* versions
fall inside it, that an inducible switch changes the risk assessment but not
the route, and that the OGTR does not weigh a GMO's benefits when it assesses
one. McLoughlin confirmed that under the Cartagena Protocol our product is not
a living modified organism. Krebs mapped the UK: contained use through the HSE,
release through ACRE, anything reaching honey through the Food Standards
Agency. The US regulators said the word GMO does not decide the path, the
function in the bee does, and that we would likely be an animal drug rather
than a pesticide. Hartley added the constraint no regulator would: a GMO
anywhere in the production pathway can cost honey its organic status. Bowden
put Scotland in a grey area, which is a weaker claim than the others and is
recorded as such. Our own legal mapping found the clearest line in
Switzerland, where a living delivery organism needs contained-use
authorisation, a release licence and market authorisation, and a purified
non-living RNA product ordinarily sits outside GMO law altogether.

**Navigate.** Biologically, *S. alvi* was compelling: a natural member of the
bee gut, engineered to make dsRNA continuously. The characteristics that made
it attractive — persisting and producing inside the bee — were exactly the
characteristics that complicated releasing it. Barrick warned that *S. alvi*
persists in wild bee species. Frost told us Australian consumers would most
likely oppose anything genetically modified whatever the economic case. Mark
Sandham worried that a living bacterium could pass between colonies. And for
every beekeeper we asked, keeping honey organic was non-negotiable.

**Evaluate.** This is a genuine trade-off, not an obviously better answer. A
living chassis may offer stronger persistence and fewer applications. A
non-living formulation gives some of that up in exchange for containment,
regulatory feasibility and social licence. We widened the criteria we judge
NECTAR by accordingly: efficacy, treatment duration, labour, cost, safety,
regulatory feasibility and social licence, rather than any one of them alone.

**Yield.** We stopped building the inducible *S. alvi* and chose engineered
yeast that is heat-inactivated before it reaches a colony. It shows up in
[Engineering](/engineering), [Yeast](/yeast) and
[Safety](/safety-and-security). It also opened Q4 and Q5 immediately: a
product that no longer persists has to be reapplied, and someone has to pay for
that.

The dissent stands. Dunwell told us that at ACRE *“the delivery method is
secondary to the endpoint”* — what matters is where the dsRNA goes once it is
in the bee. If he is right, the containment argument we gained is smaller than
we claim. We have not resolved this and we say so.

### Q2 — Why RNAi rather than another chemical?

**Hear.** Anchor: **Professor Paul Lam** (Hong Kong Metropolitan University,
6 July 2026), who covers both halves: what is wrong with chemical miticides,
and how you evidence that an alternative is safer. Supporting: **Austein
McLoughlin** on baseline comparison; **Professor Giles Budge** (Newcastle,
9 April and 13 July 2026) on whether the RNA can reach the mite at all; and one
withheld conversation.

**Observe.** Lam set out the standing charges against chemical pesticides:
toxicity to non-target species, bioaccumulation and biomagnification, and
resistance. Q3 below is the field evidence for the third. RNA interference
exploits the silencing pathway every mite already carries, and different
sequences can target different genes. The one RNA product on the market,
Norroa, targets reproduction, so it acts as birth control and takes weeks to
show an effect, and it is fed as syrup to adult workers rather than to the
larvae that Varroa actually feed on. Budge answered the question that could
have sunk the whole route: Ramsey et al. (2019) found Varroa feed on the fat
body rather than haemolymph, but the fat body is bathed in haemolymph, so a
mite feeding on it ingests haemolymph and whatever dsRNA is in it — consistent
with Garbian et al. (2012) measuring mite mortality from dsRNA-fed adult bees.
McLoughlin's point was simpler and harder: a claim without a baseline
comparison to conventional practice is not evidence.

**Navigate.** Two requirements followed. Target survival genes as well as
reproductive ones, so mites die quickly rather than failing to breed slowly,
and find a delivery route that reaches larvae. Both are why Q1 and Q4 exist.

**Evaluate.** Lam corrected our language, and the correction changed the
analysis: when we said cost-benefit he asked for risk-benefit, so that the
risks of an idea count alongside its costs. Off-target effects were his
central risk. He agreed with screening against representative species, and
insisted that the choice of those species be justified rather than convenient.

**Yield.** Off-target BLAST screening with justified representative species
became a step inside [RNA design](/software) rather than a check after it, and
the [safety](/safety-and-security) page is written as a risk-benefit case. His
last point — that communicating is the hardest step — is why the podcast and
public talks in [outreach](/education) exist.

> **TODO — this is our thinnest question, and we are naming it.** We did not
> interview anyone who has taken an RNAi biopesticide to market. GreenLight,
> Norroa and Bayer were on the target list and none was reached. Owner: HP.

### Q3 — What is wrong with today's Varroa treatments?

**Hear.** Anchor: **Danny Le Feuvre** (Australian Honey Bee Industry Council,
28 May 2026), who gave us resistance, reinvasion, the industry-exit numbers,
the cost band and a target product profile in one interview. Supporting:
**Chris Hiatt**, **Elizabeth Frost**, **Mike Allerton**. Dissenting: **Mark
Sandham** and the **Oxfordshire Natural Beekeeping Group**, who question
whether treating is desirable at all.

**Observe.** Resistance is present tense. Frost reports dual resistance already
detected in Australia, which puts essentially every legal synthetic miticide on
a short clock; by early 2026 every state with Varroa except the ACT had it. Le
Feuvre on what that means in a hive: *“Beekeepers are unable to use those
synthetic treatments largely…we're getting these re-infestation of mites, so
they're pulling out [treatments] and within weeks they're back at threshold
having to treat again.”* Hiatt's operation went from one CheckMite+ strip a
year that worked, to 55% losses in the third year when the mites became
resistant, to rotating amitraz, oxalic and formic acid and brood breaks: *“But
it's just throwing everything but the kitchen sink at them. And some of our
worst years over the last 10 years, we've had like 60% loss, 50%.”* What
remains has its own limits: formic acid has a temperature ceiling much of
Australia exceeds, most of the continent has no brood break, thyme oil taints
honey, and Frost, Allerton and Ford all report off-label homemade treatments
filling the gap. The cost is people: *“In New South Wales, we've lost 35% of
our commercial beekeepers, [they've] deregistered…in Queensland, 40% of
commercial beekeepers are planning to leave the industry in the next 12 to 24
months citing profitability and Varroa control as the main reason.”*

**Navigate.** The problem stopped being mite mortality and became a system:
colony survival, repeated labour, the cost of rebuilding, and the pollination
that depends on all of it. The treatment-free beekeepers narrowed it further.
Sandham and OxNatBees have lower counts than they had on chemicals, but they
told us why it works for them and not for everyone: small apiaries with varied
genetics can adapt, and large, uniform commercial operations cannot. Our target
user became the commercial beekeeper, and every interview after May was chosen
on that basis.

**Evaluate.** A single mode of action is a countdown. Whatever we built had to
be designed for resistance from the start, and had to hold for months rather
than weeks, because a treatment that needs repeating every few weeks is the
labour problem beekeepers were already leaving the industry over.

**Yield.** Multiplexed targets and resistance management in [RNA
design](/software), and a duration target that the [bee lab](/bee-lab)
persistence work is measured against. Feeds [Project
Description](/description) and [Engineering](/engineering).

### Q4 — What would a beekeeper actually use?

**Hear.** Anchor: **Wade Ford** (Hive & Wellness Australia, 13 August 2026).
Supporting: **Mike Allerton** on labour and two distinct markets; **Chris
Hiatt** on duration; **Josette Lewis** on scale; **Elizabeth Frost** on the
Australian season.

**Observe.** Ford put the cost of Varroa management at roughly 60% treatment
and 40% labour, and his beekeepers already feed pollen patties. Hiatt manages
18,000 colonies; an extra trip to each is the cost he cannot carry, and he
wants three to four months of protection. Lewis described the scale that sets
the bar: about 80% of US colonies converge on California for the almond bloom,
in what she called a *“codependency between the tree and the bee and between
the almond grower and the beekeeper.”* Allerton, from the amateur side, was
drawn to the living system precisely because it cut labour, and said the yeast
patty would be the most widely accepted version if it works. Frost added a
detail that only an Australian would: Norroa's syrup needs a window with no
nectar flow, which the Australian season rarely gives, while pollen is
limiting, so a patty could be a colony's main protein source.

**Navigate.** Yeast is produced cheaply everywhere, and inactivated yeast is
already fed to bees as a protein supplement; many commercial patties contain
it. So the delivery question answered itself: put the yeast in the patty the
beekeeper is already putting in the hive. Instead of asking beekeepers to adapt
their practices to our technology, we made the technology fit around the
beekeepers.

**Evaluate.** Ford, Hiatt and Lewis independently endorsed the patty. The
tension that remains is Frost's: commercial beekeepers used to synthetics
driving counts to undetectable may distrust a product that leaves a detectable
alcohol-wash count, however good the colony outcome. That is a communication
problem we have not solved.

**Yield.** Pollen-patty delivery, chosen by stakeholders rather than by the
lab, with duration, labour and scale as hard requirements. It is the nurse-bee
to larva route the [bee lab](/bee-lab) tests, and the product in
[Entrepreneurship](/entrepreneurship).

### Q5 — What must it cost?

**Hear.** Anchor: **Professor Wally Thurman** (North Carolina State,
29 July 2026). Supporting: **Professor Brittney Goodrich** (Illinois,
7 August 2026); **Melanie Teece** and **Wade Ford** on what a buyer will pay
for; and two withheld conversations.

**Observe.** Goodrich's representative operation runs 8,500 colonies and sends
5,000 to almonds. Varroa treatment products are 9% of its costs, before the
labour to apply them, before replacing dead hives, and before the revenue those
hives would have earned: about $195 per colony in almonds and 70 lb of honey.
One worker covers about 700 colonies, so anything needing an extra visit scales
badly. Teece and Ford both put cost ahead of efficacy, because honey is a
low-margin product and beekeepers take the cheapest option that works. In our
own dataset, NSW beekeepers report about A$22.18 per hive of direct Varroa
control plus 0.37 hours of labour per hive, and US Varroa control runs to about
US$9.22 per colony a year `[CALC]`.

**Navigate.** Thurman set the structure. The counterfactual is the best
existing treatment, not doing nothing. Start at the operation level and
measure the change in costs and revenues, not survival rates or honey yields.
Then a simple partial-equilibrium model with assumed elasticities for market
effects, counting only paid pollination and the crops that depend on managed
bees. Benefits to growers pass down the supply chain to consumers. And never
multiply an industry's value by a treatment's efficacy: the A$4.6 billion
pollination figure shows the scale of the stakes, not the value of NECTAR.

**Evaluate.** Under our current assumptions, NECTAR gives a net private benefit
of about US$47.9 per treated colony per year in the US and A$18.9 per treated
hive in Australia, after its own assumed cost; at market level, roughly 8.8
million lb more honey and 123,000 more pollination-capable colonies in the US,
and 4.5 million kg and 29,000 colonies in Australia, each about 4.6 million a
year in modelled surplus in its own currency `[CALC]`. Those benefits come
from fewer colony replacements, less treatment spend and less labour.

**Yield.** The economic model was turned inside out. It no longer asks what our
product costs; it starts from what a beekeeper can afford — provisional
affordability constraints of US$12 per colony and A$20 per hive — and works
back through allowable cost per dose to manufacturing cost to the yeast titre
the fermentation has to reach. That chain is in [economic
modelling](/economic-modelling), sets the target in [Yeast](/yeast), and is
the spine of [Entrepreneurship](/entrepreneurship).

> **TODO —** Every `[CALC]` number above is from the team's dataset and has
> not been independently checked. Verify each against the spreadsheet before
> the freeze, and state the assumptions inline where the model is described.
> The required yeast titre itself is still to be written into the chain.
> Owner: economic modelling.

### Q6 — What if it ends up in the honey?

**Hear.** Anchor: **Melanie Teece** (Hilltop Honey, 20 August 2026).
Supporting: **Wade Ford** on processing; **Lord Krebs** on the Food Standards
Agency; the **Scottish Government** team on contamination; **Tom Hartley** on
organic status; and one withheld conversation.

**Observe.** Teece has worked with food for thirty years and said honey is
unlike the rest of it: consumers expect it to be natural and healthy, and the
industry tests purity by NMR and LC-HRMS. Ford's honey is heated to 65 °C for
eight hours to be allowed into Western Australia, so whatever we put in a hive
has to be followed through processing, and efficacy has to be checked against
regional temperature. Krebs was categorical that anything detectable in honey,
beeswax or pollen brings the FSA in and needs evidence of harmlessness to
consumers, allergy included. The OGTR said an engineered bacterium found in
honey would trigger additional assessment; the US regulators listed *“is
anything getting into the food”* as one of their four tests, and said honey
would not need a bioengineered label. The Scottish Government team raised
pesticide contamination of honey unprompted, and Hartley made it a market
question: organic honey has no room for a GMO anywhere upstream.

**Navigate.** Contamination is a design requirement, not a test to run
afterwards. The questions are concrete: does dsRNA survive in honey, does it
survive processing, and does it show up in the purity tests a packer already
runs?

**Evaluate.** Teece's suggestion was the most precise ask we received from any
stakeholder, and one of the cheapest to act on. Every honey-industry concern we
heard outside our two case studies turned out to be the same three: cost,
consumer perception, contamination.

**Yield.** Honey-residue testing and NMR / LC-HRMS checks were added to the
[wet lab](/wet-lab) plan, and the environmental-fate question in
[Safety](/safety-and-security) now runs through honey as well as the bee.

> **TODO —** Result of the dsRNA-in-honey test: not yet on the wiki. Report it
> here with the eight-field result block, including if it is negative or
> inconclusive. Owner: wet lab.

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

We began with a continuously-producing living engineered organism in the bee
gut. The OGTR made the comparison concrete on 24 July: the yeast route sits
outside its remit, the living route requires environmental-release assessment,
and making the bacterium inducible changes the risk assessment but not the
route. Regulators in three more jurisdictions, an organic certifier and the
scientist who has engineered *S. alvi* himself each added a reason. We moved to
an engineered yeast that is inactivated before it ever reaches a colony.

Two things make this worth reading rather than just reporting.

**It went against what beekeepers told us they wanted.** Mike Allerton was
drawn to the *S. alvi* route because it would cut labour, the biggest problem
with any treatment. Danny Le Feuvre's ideal treatment was one where a single
feeding is sufficient, and he called persistence in the hive attractive before
he listed the reasons it would be hard to license. We chose the harder product
on regulatory grounds, and the people whose problem we are trying to solve
preferred the other one. Allerton's own hedge is why we can live with that: if
the yeast patty proves effective it will probably be the most widely accepted
version, and he suggested developing both.

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
| Resistance in the field (Le Feuvre, Frost, Hiatt)               | Multiplexed targets in [RNA design](/software)                      |
| Regulation (OGTR, Krebs, Dunwell, Bowden, McLoughlin, EPA/FDA/USDA) | Chassis and formulation                                          |
| Patties already in the hive (Ford, Hiatt)                       | The nurse-bee to larva route in the [bee lab](/bee-lab)             |
| Manufacturing economics (Thurman, Goodrich)                     | A required yeast titre in [economic modelling](/economic-modelling) |
| Ecological concern (Lam, Krebs, Dunwell)                        | Off-target screening inside the design pipeline                     |
| Residues in honey (Teece, Ford, Krebs)                          | dsRNA-in-honey tests in the [wet lab](/wet-lab)                     |
| Does haemolymph reach the mite? (Budge)                         | The adult-bee feeding assay kept, the length series added           |
| A split-YFP sensor that is not specific (Barrick)               | The aptamer-based dsRNA measurement in [Measurement](/measurement)  |
| Treatment-free works for us, not for you (Sandham, OxNatBees)   | The target user narrowed to commercial beekeepers                   |

If a row cannot be linked to the page where the change shows up, the change
probably did not happen.

## What we got wrong

- **We assumed regulators would care how the RNA got in.** Dunwell corrected
  us: they care where it goes afterwards. We had been distinguishing our two
  designs by delivery system for two months by then.
- **Q2 is thin and we left it thin.** We identified the gap — no one who has
  taken an RNAi biopesticide to market — early enough to fix it, and did not.
- **We asked beekeepers what they wanted, then chose otherwise.** Defensible on
  regulatory grounds, and still a cost, recorded above rather than smoothed
  over.
- **Four conversations cannot be published.** Consent was not secured at the
  point of interview in one case, and review conditions are outstanding in
  three. That is our process failing, not the interviewees'.

## Still missing

- Consent or review resolved for the four withheld conversations.
- The `[CALC]` numbers in Q5 checked against the spreadsheet, and the yeast
  titre written into the chain.
- The dsRNA-in-honey result for Q6.
- Dates for the Scottish Government, SASA, CBD and Amateur Beekeepers Australia
  conversations.
- The Barrick write-up checked by whoever ran the interview against the latest
  R&D position.
- The beekeeper survey: distribution, response count and findings are
  unrecorded.
- The podcast episodes and the public glossary that Q2 and Q1 point to.
- The HONEY method written up as something another team could pick up.

## Where this connects

[Case studies](/case-studies) · [Safety and security](/safety-and-security) ·
[Yeast](/yeast) · [Economic modelling](/economic-modelling) ·
[Entrepreneurship](/entrepreneurship) ·
[Sustainable development](/sustainability) · [Public outreach](/education) ·
[Engineering](/engineering) · [Contribution](/contribution)
