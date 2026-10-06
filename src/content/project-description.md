NECTAR is an **end-to-end platform** for designing, validating, producing and
deploying RNAi interventions. _Varroa destructor_ is the first real-world case
study through which we demonstrate and stress-test the platform.

This page tells that story once, in full, for a reader who knows nothing. It is
the long version of [the home page](/).

## 1. The problem

> **TODO —** Describe crop and colony losses to pests, and where conventional
> pesticides fall short: resistance, non-target harm, residue, and the treadmill
> of reapplication.

> **TODO —** Two or three numbers, each with a resolvable citation. The global
> pesticide-spend figure and the pesticide-pollution projection both come from
> the human-practices and competition-application work and are not yet sourced
> on this wiki. Owner: HP.

## 2. Why RNAi

**Specificity and programmability** are the whole case. A sequence is a design
parameter in a way a small molecule never is: change the sequence, change the
target, keep the manufacturing route.

> **TODO —** Explain the mechanism plainly enough for a non-biologist to follow,
> with a glossary term on first use.

> **TODO —** Figure: mechanism. dsRNA → uptake → silencing, readable without a caption.

## 3. Why RNAi is not already everywhere

Six barriers, the same as on [the home page](/):

1. **Rational target selection** — which gene to silence is the first hard problem.
2. **Off-target screening** — a sequence that hits the pest may hit something else.
3. **Single-target resistance** — one target is one mutation away from failing.
4. **Manufacturing cost** — the RNA has to be cheap enough to use at field scale.
5. **Environmental degradation** — RNA does not last long outside a cell.
6. **Inefficient delivery** — the RNA still has to get inside the pest.

Some are scientific problems and some are economic or regulatory; **they need
different answers**, and NECTAR answers them on different pages.

## 4. Introducing NECTAR

The pipeline end to end, as **a platform rather than a product**: design
([RNA design](/software)), production ([yeast](/wet-lab-experiments#yeast-production)), delivery
([bee lab](/bee-lab)), validation ([measurement](/measurement)).

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

RNA design is **the novel core of the platform**.

> **TODO —** Write what [NectarDesigner](/software) contributes, and why
> choosing the sequence is a design problem rather than a lookup.

## 6. Production

> **TODO —** Write why _S. cerevisiae_, keeping the three arguments separate: the
> scientific one, the industrial one and the formulation one.

Detail on [yeast](/wet-lab-experiments#yeast-production).

> **TODO —** Use the Zhong 2019 argument here: hairpin RNA accumulates intact in
> _S. cerevisiae_, which lacks a canonical Dicer, but is degraded in _E. coli_
> HT115. The team's own note calls this the best scientific argument for the
> chassis and records that it is currently used nowhere on the wiki. Verify the
> citation, then use it here and on [yeast](/wet-lab-experiments#yeast-production). Owner: wet lab.

## 7. Delivery

Delivery is **where most field RNAi fails**.

> **TODO —** Write why whole, inactivated yeast in an application-specific
> formulation rather than purified RNA.

Delivery is also where the project has a physical product: a 3D-printed **hive
insert** that mounts inside a standard frame and presents the formulation to the
colony.

> **TODO —** The hive insert has no page of its own and is barely mentioned
> across this wiki, despite being the delivery half of the platform and a
> candidate for the Hardware criterion. Decide whether it gets its own page
> before writing this section. Owner: team lead.

## 8. Varroa as the case study

Why this pest, on this host, in this setting is **a hard proving ground** rather
than a convenient one: a mite feeding on a bee inside a sealed hive, reached
through a pollen patty by way of a nurse bee or a larva. If the platform works
here, the awkward cases elsewhere look more tractable.
[The case studies](/case-studies) show what changes when the setting changes.

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

## Still missing

- Section 1's numbers, sourced.
- Mechanism figure and pipeline diagram.
- The chassis argument, with its citation verified.
- The novelty wording, agreed and checked against the IP position.
- The four-level ledger in section 9.

## Where this connects

[Engineering](/engineering) · [RNA design](/software) · [Yeast](/wet-lab-experiments#yeast-production) ·
[Results](/results) · [Human practices](/human-practices) ·
[Safety and security](/project-safety) · [Timeline](/timeline)
