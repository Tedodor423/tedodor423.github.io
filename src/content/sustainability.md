> **What this page proves:** that we decomposed each goal into concrete
> problems, mapped our work onto them one by one, and accounted honestly for
> where NECTAR pulls against other goals.
> **Where the evidence is:** [human practices](/human-practices), the
> [modelling pages](/model), and [safety and security](/project-safety).

The UN defines sustainable development as "meeting the needs of the present
without compromising the ability of future generations to meet their own needs",
balancing economic, social and environmental action across seventeen goals and
their subtargets.

Asserting relevance to a goal is easy and worth nothing. This page does the
harder thing: it breaks each goal into specific problems, says what our work does
about each, and says **where our work makes something else worse**. That last part is
the substance, not a caveat at the end.

This page only works because the stakeholder engagement behind it is real. It is
continuous with [human practices](/human-practices), not a standalone exercise.

## How each goal is treated

Five blocks, the same five every time:

1. **The goal and its targets** — the UN target text, by number.
2. **Problem identification** — two or three discrete, concrete problems. Not a
   general claim about importance.
3. **Positive long-term impacts** — mapped one-to-one onto those problems.
4. **Negative long-term impacts and interactions with other goals** — cited by
   target number.
5. **Stakeholder feedback** — a named person who works on this, and what they
   said.

Three goals carry the main argument. Others appear in the interactions analysis
rather than being claimed outright.

> **TODO —** The specific *Varroa* gene our construct targets is named in the
> team's sustainability draft. It is **not** published here, pending the
> unresolved IP and patent-filing question. Until that gate is resolved, every
> page says "the selected *Varroa* target". Owner: PI and team lead. Blocked on
> the filing decision.

## Goal 15 — Life on land

### The targets

- **15.1** Ensure conservation and sustainable use of terrestrial ecosystems.
- **15.5** Take urgent action to reduce degradation of natural habitats and halt
  biodiversity loss.
- **15.8** Prevent the introduction and significantly reduce the impact of
  invasive alien species.
- **15.9** Integrate ecosystem and biodiversity values into planning.

### The problems

1. ***Varroa destructor* is an invasive alien species in most of the world it now
   occupies**, and it is a primary driver of honeybee colony loss. Target 15.8
   names exactly this category of problem.
2. **The control currently used against it is chemical.** Acaricides harm bees
   themselves, expose non-target organisms, and can contaminate honey — pressure
   on habitats and species that target 15.5 asks to reduce.
3. **That chemical control is failing to resistance**, so losses continue while
   the environmental cost of treatment stays. `[FLAG]` The scale of the loss
   trend is asserted in our draft without a source.

> **TODO —** Source problem 3 properly: national or international colony-loss
> statistics, and the resistance literature. The claim is almost certainly
> supportable and currently is not supported. Owner: HP.

### Positive long-term impacts

Mapped to the problems above, in order.

1. A sequence-specific RNAi biopesticide against the selected *Varroa* target
   attacks the invasive species directly rather than treating the colony.
   **Proposed.**
2. Replacing an acaricide with a sequence-specific agent removes a broad-spectrum
   chemical from the hive. Off-target homology screening, research into
   environmental fate, and a heat-killed yeast carrier are the three design
   choices that make that claim **defensible rather than rhetorical**.
   **Investigated** for the screening, **Proposed** for the environmental fate
   work.
3. A modular construct means a resistance mutation is answered by swapping a
   sequence rather than restarting a discovery programme, so the tool's useful
   life is not one resistance cycle long. **Proposed.**

Varroa control also lays groundwork for managing other pests with the same
method. That is a platform claim and belongs on
[entrepreneurship](/entrepreneurship), marked as a prospect rather than an
outcome.

### Negative long-term impacts and interactions

- **Protecting a managed pollinator is not the same as protecting biodiversity.**
  Managed honeybees can compete with wild pollinators for forage in some
  ecological contexts. A successful NECTAR increases managed colony survival, and
  that pushes against **15.5** in exactly the places it helps **2.4**. We do not
  have a resolution to this; we have an acknowledgement and the Global
  Biodiversity Framework target 11 analysis below.
- **RNAi is not consequence-free.** Persistence and environmental fate of dsRNA
  are open questions, which is why unused-product disposal appears in the table
  at the end of this page.
- **Resistance is an ecological outcome too.** A *Varroa* population selected for
  resistance to our target is a worse starting point for whoever comes next.
- **Access is uneven.** Where the product is not legally deployable, the
  biodiversity benefit does not occur — which ties **15.8** to **10.2** and to
  the regulatory work on [the case studies](/case-studies).

### Stakeholder feedback

**Austein McLoughlin**, Secretariat of the Convention on Biological Diversity.
He told us that under the Cartagena Protocol our product is not a living modified
organism; that comparisons to conventional practice are essential; and that the
major barrier to sustainable development is **the gap between claim and reality**,
and the absence of baseline evidence to compare against.

That last point is why this page carries flags on its own numbers and why the
modelling work builds in a counterfactual: see
[economic modelling](/economic-modelling).

> **TODO —** No verbatim quote from this conversation is recorded in our notes,
> only our summary of it. The rubric asks for a named stakeholder **with a
> quote**. Go back to the recording or the notes and lift one, or record that
> none exists. Owner: HP.

## Goal 2 — Zero hunger

### The targets

- **2.3** By 2030, double the agricultural productivity and incomes of
  small-scale food producers.
- **2.4** Ensure sustainable food production systems and implement resilient
  agricultural practices.
- **2.5** Maintain the genetic diversity of seeds, cultivated plants and farmed
  animals.

### The problems

1. **Crop pollination depends on colonies that are being lost.** Pollination is
   central to production of many crops, so colony loss is an agricultural
   resilience problem, not only an ecological one.
2. **Beekeeping is an income, and Varroa attacks it.** Treatment costs and colony
   replacement fall on the beekeeper; Brittney Goodrich's modelled operation puts
   treatment products alone at 9% of total costs before any labour or replacement
   is counted (see [economic modelling](/economic-modelling)).
3. **Existing RNAi biopesticides do not scale to the people who need them.** Our
   stakeholders raised scalability as the specific failure, not price alone.

### Positive long-term impacts

1. Heat-killed engineered yeast as a dsRNA production platform, delivered inside
   a pollen patty — a supplement beekeepers already feed — so treatment does not
   require an extra visit to every hive. **Proposed.**
2. Fermentation is mature, widespread infrastructure, which is the mechanism by
   which the product could be cheap rather than an assertion that it will be.
   **Proposed**, and see the cost flag below.
3. The hive insert is 3D printable, so hardware is not a bottleneck on
   deployment. See [hardware](/hardware).

### Negative long-term impacts and interactions

- **The affordability claim is currently unsupported.** Our draft quotes
  manufacturing cost at about £2 per gram. `[CALC]` The arithmetic is not written
  down, it rests on an unmeasured yeast titre, and it is not stated what the gram
  is a gram of. Until that is fixed, "accessible to small-scale beekeepers"
  (**2.3**) is an intention, not a finding.
- **Regulatory divergence means uneven access.** Heat-killed yeast sits in a grey
  area in some jurisdictions — Laura Bowden (SASA) set this out for Scotland —
  so the benefit accrues first where regulation is permissive. This pulls against
  **10.2**.
- **Supporting managed pollination is not neutral for wild systems.** The
  interaction with **15.5** above cuts the other way here.

### Stakeholder feedback

> **TODO —** This goal has no named stakeholder with a verbatim quote attached,
> which is a direct rubric requirement. Candidates already on our roster and
> cleared for publication: Wade Ford (Hive & Wellness Australia) on cost
> priority and patty delivery, and Professor Brittney Goodrich on operation
> economics. Attach one, with a quote. Owner: HP.

## Goal 17 — Partnerships for the goals

Goals 2 and 15 are about NECTAR's impact. Goal 17 is about how we are working to
achieve it.

### The targets

- **17.6** Enhance international cooperation on science, technology and
  innovation.
- **17.16** Enhance multi-stakeholder partnerships.
- **17.17** Encourage effective public-private and civil society partnerships.

### The problems

1. **Technologies designed without their users fail on practicality, not
   biology.** A treatment that works and cannot be applied across thousands of
   colonies is not a treatment.
2. **Stakeholder views are usually collected in isolation**, so the places where
   experts disagree with each other never surface, and the project never has to
   resolve them.
3. **Biosafety and regulatory expertise sits in different institutions from the
   science**, across different countries, and is rarely consulted early enough to
   change a design.

### Positive long-term impacts

1. Beekeepers, environmental scientists, industry and UN-linked bodies were
   consulted from the start, and the chassis decision came out of that rather
   than out of the lab. See [engineering](/engineering).
2. Our podcast, **Buzz In**, puts stakeholders' views into contact with each
   other rather than collecting them separately: episode 1 put a bee researcher
   and a commercial beekeeper on opposite sides of whether treatment-free
   beekeeping is realistic. **Demonstrated** for the conversations held;
   publication is tracked on [public outreach](/education).
3. The HONEY engagement loop is intended to be published as a reusable method so
   another team can run it. **Proposed.**

### Negative long-term impacts and interactions

**The honest version** of a partnerships claim includes the partners who disagreed
with us.

- **We pivoted against two beekeepers' stated preference.** Mike Allerton and
  Danny Le Feuvre both preferred the live *S. alvi* system on labour and
  persistence grounds. We chose inactivated yeast on regulatory grounds. Engaging
  stakeholders and then overruling them is a real tension under **17.16**, and
  the justification is on [engineering](/engineering).
- **One expert cuts against the premise.** Professor Jim Dunwell, Chair of ACRE,
  holds that "the delivery method is secondary to the endpoint" — which, if
  right, weakens the regulatory argument the pivot was made on.
- **Our roster has a hole.** We interviewed no RNAi-biopesticide practitioner,
  which is the stakeholder group best placed to contradict us on manufacturing
  and field performance.

> **TODO —** Close the practitioner gap, or state on this page that it stayed
> open and what that means for the conclusions. Owner: HP.

### Stakeholder feedback

> **TODO —** Named stakeholder and verbatim quote owed for this goal, as for
> goal 2. Owner: HP.

## The Kunming–Montreal Global Biodiversity Framework

Goal 15 is the most directly relevant goal to NECTAR, so we went further on it.
Through the Secretariat of the Convention on Biological Diversity we came to the
Kunming–Montreal Global Biodiversity Framework, which sets 23 targets rooted in
Goals 14 and 15 and is where the UN balances biotechnology tools against
conservation goals. Four of those targets bear on NECTAR directly.

### Target 7 — reduce pollution, including pesticide risk

Target 7 aims to reduce pollution to levels not harmful to biodiversity, and to
reduce the overall risk from pesticides and hazardous chemicals by at least half
by 2030.

This is NECTAR's **strongest connection to the framework**. Varroa control depends
largely on acaricides, which damage bees and other organisms and can contaminate
honey. A sequence-specific dsRNA therapeutic against the selected *Varroa* target
is designed to narrow that exposure.

An RNAi biopesticide introduces its own environmental questions — persistence and
ecological effect. Two pieces of work address them: **off-target homology
screening** against other organisms including humans and *Apis mellifera*
(**Investigated**; see [RNA design](/software)), and **waste management protocols
for both production and post-use disposal** (**Proposed**; see
[safety and security](/project-safety)).

### Target 10 — sustainable management of agriculture

Target 10 asks for biodiversity-friendly agricultural practice that raises
resilience and productivity.

Honeybees are key pollinators, and Varroa undermines both their health and the
resilience of the agriculture that depends on them. `[FLAG]` Our draft states
that honeybees are directly implicated in over a third of food production; that
figure **needs its primary source** before it is published.

NECTAR is a biological tool supporting existing agricultural systems rather than
replacing them. The CBD has prior experience with synthetic-biology work aimed at
species resilience, including modification of honeybee microbiome symbionts
(Nairobi convention, 2024) `[FLAG]`, which places our approach inside a direction
the Convention has already considered.

Target 10 builds on target 7: 7 says why current pest control has to change, 10
says why synthetic biology can be the replacement.

> **TODO —** Verify both flagged items against primary sources: the pollination
> share of food production, and the Nairobi convention 2024 reference for CBD
> work on honeybee microbiome symbionts. Owner: HP.

### Target 11 — restore and enhance nature's contributions to people

Target 11 covers maintaining and improving ecosystem services, pollination among
them.

The honest complication is the one already stated under goal 15: honeybee health
is **not automatically biodiversity**, because managed honeybees can interact with
and compete with wild pollinators. Target 11 is where that tension is explicit
rather than parenthetical.

Our position is that synthetic biology should support ecosystem functions rather
than substitute for them. NECTAR does not attempt to change pollination; it
addresses one stressor acting on one pollinator. And it links back to target 7:
reducing reliance on chemical control benefits ecological communities well beyond
the colony.

### Target 17 — biosafety and equitable distribution of biotechnology's benefits

Target 17 asks countries to implement biosafety measures and to share the
benefits of biotechnology equitably (Convention articles 8(g) and 19). `[FLAG]`
Article numbers to be checked against the Convention text.

Four design decisions map onto it:

- **Heat-killed yeast** — biocontainment by design, removing the biosafety
  questions attached to releasing a living modified organism.
- **Off-target screening** — sequence homology screening in non-target organisms
  is a biosafety measure in the sense this target uses.
- **Environmental fate** — persistence, degradation, waste management and
  exposure after production. **Proposed.**
- **Accessibility through existing fermentation infrastructure** — the mechanism
  by which benefits could be distributed rather than concentrated, subject to the
  cost flag above.

> **TODO —** The team's draft closes this target with a sentence that is garbled
> and does not resolve: it begins "these design decisions allow us to construct a
> Target 17 framework centred around both of its parts" and then breaks. The
> intended argument — presumably that biosafety and equitable benefit are the two
> halves of this target and NECTAR addresses both — has not been written out, and
> we have not invented an ending for it. Owner: HP.

## Negative interactions, and what we would do about them

The section that **earns this page its marks**. Each row is a question we could not
answer comfortably.

| Question                                                                          | Relevant subtargets                                              | What we would do about it                                                                                                                                                                                                                                                                                                                                                                                                                             | Status                                                                                    |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Can NECTAR be accessible regardless of economic status or country of residence?   | 10.2 · 9.5 · 16.6 · 17.16                                        | **Affordability:** a yeast carrier avoids the manufacturing cost that makes existing RNAi pesticides expensive. Our draft puts this at about £2 per gram `[CALC]`, which is not yet supported. **Scalability:** fermentation infrastructure exists worldwide and the hive insert is 3D printable. **Regulation:** heat-killed yeast is not a living modified organism under the Convention on Biological Diversity, but grey areas remain — Scotland, per Laura Bowden (SASA). | Affordability **Proposed** and flagged · scalability **Proposed** · regulation **Investigated** |
| How do we minimise pollution and deal with waste?                                 | 6.3 · 12.4 · 12.5                                                | **Waste management:** GMO-contaminated waste must be inactivated before disposal; our yeast is heat-killed already, and we aim to minimise the volume of biomass generated in line with Environment Agency guidance. **dsRNA disposal:** unused patties cannot replicate, but they still contain biologically active dsRNA. The OECD anticipates low environmental exposure given rapid degradation of environmental RNA `[FLAG]`.                        | Waste route **Proposed** · degradation evidence **Proposed**                              |
| Could NECTAR present an ecological threat while trying to prevent one?            | 15.5 · 15.8                                                      | **Off-target homology screening** across representative species, with the species choice justified. **Resistance:** *Varroa* could mutate at the target site. The plan is annual resequencing of *Varroa*, and of bees and other non-target organisms, with the modular construct allowing a sequence swap rather than a restart: the plasmid is built so that individual sequences can be exchanged while the rest of the toolkit stays intact.                                                                                                                       | Screening **Investigated** · resequencing programme **Proposed**                          |
| Does protecting a managed pollinator have costs for wild ones?                     | 15.5 · 11 (GBF)                                                  | No mitigation designed. Stated as an open tension under goal 15 and GBF target 11, and not claimed as resolved.                                                                                                                                                                                                                                                                                                                                        | **Unresolved**                                                                            |

Two of those rows contain commitments we have not yet met:

> **TODO —** We state that we will conduct experiments to determine the rate of
> dsRNA degradation in the patty, in order to establish the fate of unused
> supplement. That work is **Proposed** and has not been run. It is written as an
> intention on this page and must not be described anywhere as a result. Owner:
> wet lab.

> **TODO —** Find the OECD document behind the low-environmental-exposure claim
> and cite it, or remove the claim. Owner: HP.

## Still missing

- A named stakeholder with a verbatim quote for goals 2 and 17, and a quote for
  goal 15.
- Primary sources for the colony-loss trend, the pollination share of food
  production, the Nairobi convention reference, the Convention article numbers
  and the OECD exposure claim.
- The supported version of the £2 per gram figure, or its withdrawal.
- The intended argument closing GBF target 17.
- Resolution of the IP gate on naming the target gene.

## Where this connects

[Human practices](/human-practices) ·
[Ecological modelling](/ecological-modelling) ·
[Economic modelling](/economic-modelling) ·
[Safety and security](/project-safety) ·
[Entrepreneurship](/entrepreneurship) · [Case studies](/case-studies) ·
[NECTAR for the future](/future)
