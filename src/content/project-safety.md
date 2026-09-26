> **What this page proves:** that we identified the plausible ways this system
> could cause harm and changed the design in response, rather than writing a risk
> assessment after the fact.
> **Where the evidence is:** [RNA design](/software) for the off-target screen,
> [engineering](/engineering) for the chassis decision,
> [human practices](/human-practices) for the expert input.

**Safety drove the chassis decision** on this project and put off-target screening
inside the design pipeline rather than after it. That makes this page a record of
engineering choices, not a compliance document.

## How we frame risk

Professor Paul Lam (Environmental Chemistry, Hong Kong Metropolitan University)
changed the vocabulary we use. When we said cost-benefit analysis, he told us to
say **risk-benefit analysis** instead, so that the risks of an idea count
alongside its costs. A cheap intervention with an unbounded ecological risk is
not a good deal; framing it as cost-benefit lets that conclusion slip past.

He also gave us the process this page follows: **identify, assess, manage,
communicate** — and singled out the last step, communication with beekeepers and
the public, as **the hardest and most important**. That is why the outreach work on
[public outreach](/education) is treated here as part of risk management rather
than as a separate activity.

Lam's primary concern for our project was off-target effects, and his advice on
screening against representative species, with the choice of species justified
rather than default, is built into the design pipeline.

## Risks specific to this system

Generic biosafety text scores nothing. This is about *our* system: an engineered
organism producing a double-stranded RNA, heat-inactivated, formulated into feed,
and given to a managed pollinator that forages in the open.

### Risk to the bees

The host is the delivery vehicle and must not be harmed by it. Off-target
homology screening explicitly includes *Apis mellifera*, and the feeding assays
on [bee lab](/bee-lab) carry their own mortality controls.

### Risk to non-target organisms

Related mites, other arthropods, and anything exposed through the colony or the
environment. Sequence-level screening is the first line here, and it is the only
line: the colony model **does not represent non-target species** at all. See
[RNA design](/software) and [ecological modelling](/ecological-modelling).

### Risk to people

Handling during production and application, and anything entering the human food
chain through the hive. Wade Ford and Melanie Teece both asked us to test for
dsRNA residues in honey, Teece specifically against the NMR and LC-HRMS tests the
honey industry uses for purity.

> **TODO —** Honey residue testing is requested by two industry stakeholders and
> has not been done. Either run it or state on this page that the question is
> open. Owner: wet lab.

### Environmental fate

What happens to the material that is not consumed. Treated at length below,
because it is the part of the argument that the inactivation story does not
cover.

### Laboratory safety

Containment, waste handling and the local rules the work was done under.

> **PDF —** Risk assessments and approvals as filed, uploaded to
> `static.igem.wiki` and linked here.

## Why inactivated, and what that argument does not cover

Heat-killed yeast is **biocontainment by design**. A non-replicating,
heat-inactivated organism cannot establish, cannot spread and cannot transfer its
construct, which removes an entire class of risk before the product leaves the
factory. Austein McLoughlin of the CBD Secretariat confirmed that under the
Cartagena Protocol it is not a living modified organism. It is a genuine safety
property and a genuine design decision, and it is **the reason the chassis is yeast**
rather than a live gut symbiont — see [engineering](/engineering).

**It is not a complete answer, and this is the part most easily glossed over.**

Removing the living organism does not remove the biological activity of what it
made. An unused pollen patty contains functional, sequence-specific
double-stranded RNA. It cannot replicate, but **it can still silence**, and the
question of what happens to that RNA — how long it persists in the patty, in the
hive, in soil or in water — is separate from the question of what happens to the
yeast. The inactivation argument answers the second and is silent on the first.

Three things follow:

- **We do not know the degradation rate of dsRNA in our patty.** The OECD
  anticipates low environmental exposure to this class of material because
  environmental RNA degrades rapidly. `[FLAG]` We have not retrieved and read
  that document, and we are not resting the case on it.
- **The disposal route for unused product is unresolved.** It is drafted, not
  established; see waste management below.
- **At least one expert holds that the distinction we are relying on does not
  matter.** Professor Jim Dunwell, Chair of ACRE, told us that "the delivery
  method is secondary to the endpoint." If he is right, the regulatory advantage
  of inactivated yeast is **narrower than we have argued**, and the burden falls back
  on the off-target screen.

> **TODO —** We state on [sustainable development](/sustainability) that we will
> run experiments to determine the rate of dsRNA degradation in the patty. That
> work is **Proposed** and has not been run. It must not be described anywhere as
> a result. Owner: wet lab.

> **TODO —** Retrieve and cite the OECD assessment of environmental RNA exposure,
> or remove the claim from this page and from
> [sustainable development](/sustainability). Owner: HP.

## Off-target strategy

Screening sits **inside** the design pipeline, not after it: a candidate window
that fails homology screening never becomes a construct. The screen runs against
representative species including humans and *Apis mellifera*, with the species
selection justified on Lam's advice rather than taken as a default set. Method on
[RNA design](/software).

What the screen cannot rule out, stated plainly: a screen against the species we
thought to check is **not a screen against everything**. Sequence databases are
incomplete for most arthropods, and homology at the sequence level is a proxy for
silencing, not a measurement of it.

## Waste management

Two streams, both currently **Proposed**.

- **Production waste.** GMO-contaminated waste must be inactivated before
  disposal. Our biomass is heat-killed as part of the process, so the inactivation
  step required for disposal has already happened. The aim is to minimise the
  volume of yeast biomass generated in the first place, in line with current
  Environment Agency guidance.
- **Post-use product.** Unused patty, which contains active dsRNA. See the
  environmental fate section above; this route is drafted rather than validated.

> **TODO —** Write the waste management protocols out properly — both production
> and post-use — and cite the Environment Agency guidance being followed. At
> present this is a stated intention. Owner: safety lead.

## Resistance and stewardship

A single target invites resistance: *Varroa* could mutate at the target site and
render the therapeutic ineffective. The plan is annual resequencing of *Varroa*
to detect mutation, alongside resequencing of bees and other non-target organisms
so the homology screen stays current. Because the construct is modular, a
resistance mutation is answered by **swapping a sequence** rather than restarting the
design.

All **Proposed**. None of this monitoring exists; it is what real deployment
would require.

## Regulatory position

How the product would be classified, by jurisdiction, and where the answer is
genuinely unresolved — including Laura Bowden's account of the Scottish grey area
for heat-killed yeast. Detail on [the case studies](/case-studies) and
[entrepreneurship](/entrepreneurship), which also carries the live EMA
consultation on RNAi veterinary medicines.

## Animal welfare

The assay work used live honeybees, and haemolymph extraction is an inherently
terminal procedure, so bees were culled in the course of it. That was treated as
**a necessary and humane endpoint** rather than an incidental harm, and the method is
recorded in the [bee lab](/bee-lab) protocols rather than described here.

Welfare measures were applied before the endpoint as well as at it. During the
incubation stage of the proboscis-extension feeding assay, bees were held in a
sealed container over a warm, damp towel, reproducing in-hive conditions of
roughly 32 °C and 50–60% humidity. That served two purposes: it reduced
handling-induced stress, and it lowered baseline mortality unrelated to
treatment, so that any mortality observed could be attributed to the treatment
rather than to poor husbandry.

Permission for live-animal work was granted under our institution's ethical
standards.

> **TODO —** The approving body and the approval reference are blank in the
> team's write-up. Fill them in, or state that the work proceeded under a
> departmental arrangement with no formal reference. An unnamed approving body is
> not an approval. Owner: PI.

## What we would want before any field use

- A measured degradation rate for dsRNA in the patty, and a validated disposal
  route.
- Honey residue data.
- Off-target screening extended beyond the representative set, with its limits
  documented.
- The resistance monitoring programme, designed and costed.
- A named approving body for any work involving colonies outside the lab.

## Still missing

- The risk assessment documents, uploaded.
- The off-target screen's scope and limits, written out in full.
- The waste management protocols, with their guidance cited.
- The OECD environmental-RNA citation, or the removal of the claim.
- The welfare approval reference.

## Where this connects

[RNA design](/software) · [Ecological modelling](/ecological-modelling) ·
[Engineering](/engineering) · [Yeast](/wet-lab-experiments#yeast-production) · [Bee lab](/bee-lab) ·
[Human practices](/human-practices) · [Case studies](/case-studies) ·
[Entrepreneurship](/entrepreneurship) ·
[Sustainable development](/sustainability)
