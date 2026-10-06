The question this page answers is narrow and useful: _what did Oxford 2026 save
the next team from having to rediscover?_

Every entry is written the same way, in three lines: **what it is**, **why
another team would want it**, **where to get it**.

## What is ready and what is still owed

We mark each entry **Available** or **Owed**.

| Contribution                                    | State     |
| ----------------------------------------------- | --------- |
| dsRNA design workflow, and the off-target screen | Available |
| Modular loop-ended construct architecture        | Available |
| Mango measurement tag as a part                  | Available |
| Digest-Qubit quantification of dsRNA             | Available |
| The NanoDrop/Qubit correction note               | Available |
| The extraction-method null                       | Available |
| MS2 array folding finding                        | Available |
| qPCR contamination diagnostic protocol           | Owed      |
| Working with honeybees: the handbook             | Owed      |
| The standing bench rules for Mango               | Owed      |
| Commercial fermentation framework                | Owed      |
| Regulatory and stakeholder framework             | Owed      |
| HONEY as a reusable human-practices method       | Owed      |
| The Muita Table S1 erratum                       | Owed      |

## Methods and workflows

### The dsRNA design workflow

**What it is.** A two-stage procedure for going from a pest genome to a ranked
list of dsRNA sequences: select candidate target genes, then score windows inside
each gene on accessibility, thermodynamic asymmetry and enrichment in the pest's
own native siRNA population, then screen the survivors for off-target homology.

**Why another team would want it.** The published _Varroa_ RNAi literature
demonstrates silencing of individual genes, but offers no standardised framework
for comparing candidate genes or for choosing the region within one. A team
starting a dietary-RNAi project currently picks a target **because someone else
picked it**.

**Where to get it.** [RNA design](/software), with the biology and the metric
names. See also [cycle D1](/engineering#cycle-d1).

> **TODO —** The IP gate. The specific _Varroa_ target gene the pipeline selected
> is held back pending a patent-filing decision, and the weights, coefficients,
> thresholds and training corpus are held back with it. What is publishable is the
> method and the metric names. Owner: dry lab, with whoever holds the IP question.

### The ecological off-target screen

**What it is.** A screening approach that checks candidate sequences against a
small set of deliberately chosen representative species rather than against
everything, with one homology match disqualifying a sequence.

**Why another team would want it.** Scanning every available genome is expensive,
slow and produces a result nobody can interpret. Choosing representatives is **the
decision teams get stuck on**, and we document how we chose ours and on whose
advice.

**Where to get it.** [Safety](/project-safety#off-target-strategy) and
[RNA design](/software).

## Parts

### The modular loop-ended construct architecture

**What it is.** A three-level collection so that any future loop cargo drops into
a fixed backbone: **L0**, a plain loop-ended dumbbell with no cargo, which is both
the control and the comparator; **L1**, a Mango reporter loop; **L2**, an MS2
adaptor loop. Loop spacers are constrained to exclude BsaI, BsmBI and BbsI sites,
homopolymer runs longer than three, and yeast poly(A) elements.

**Why another team would want it.** Inverted repeats are the specific thing that
commercial gene synthesis refuses and standard cloning strains recombine out.
**Every iGEM synthesis sponsor we approached declined** these constructs. Rather
than re-solve that per construct, a team can take the backbone and change the
loop.

**Where to get it.** [Parts](/parts), with the two-step Gibson route on
[cycle 1.2](/engineering#cycle-1-2).

> **TODO —** Registry part numbers, once deposited, and Sanger sequence across
> both junctions before deposition. **No construct is sequence-verified today**,
> and nothing is submitted to the Registry until it is. Owner: wet lab.

### Mango as a measurement tag in the loop

**What it is.** The Mango II aptamer carried in a terminal loop of the dumbbell,
one copy, at a defined position, genetically encoded so the same construct serves
IVT now and in-cell expression later, **at no marginal cost**.

**Why another team would want it.** Existing routes to seeing dsRNA in insect
material need a blot or a chemically labelled nucleotide, both of which cost money
per sample and neither of which survives into a production construct.

**Where to get it.** [Parts](/parts). Read it together with the account of
what the tag does and does not report, below.

## Measurement

### Digest-Qubit: how much intact duplex do you actually have?

**What it is.** A short protocol that turns an ambiguous A260 reading into a
duplex-specific number: DNase I to remove template, RNase T1 to remove
single-stranded RNA, re-quantify what survives. RNase T1 rather than RNase A,
because T1 is single-strand-specific at normal ionic strength and RNase A only
becomes so above roughly 300 mM salt.

**Why another team would want it.** Of six published _Varroa_ RNAi papers, three
quantify "spectrophotometrically" and **three state no method at all**. Any dose
figure in a dietary-RNAi paper is downstream of this one number, and NanoDrop
over-reads it by about 1.9× in our hands.

**Where to get it.** [Measurement](/measurement) and
[cycle 2.6](/engineering#cycle-2-6); the eight-preparation result is on
[Results](/results).

### The NanoDrop/Qubit correction note

**What it is.** Two findings, published together. First, **do not use a correction
factor**: our own NanoDrop-to-Qubit ratio runs from 3.3× to 18.2× across
preparations, because it depends on how much unincorporated NTP a reaction left
behind. Second, the power law fitted to our own data is an instrument artefact of
the Qubit RNA BR range, not chemistry, and must not be used as a correction curve.

**Why another team would want it.** Both are mistakes that look like results. The
second one we made ourselves and publish as a retraction.

**Where to get it.** [Cycle 2.6](/engineering#cycle-2-6).

### A measurement published with its own limits

**What it is.** The full account of the Mango quantification attempt, including
the re-analysis that overturned it: an apparently excellent calibration (R² =
0.9999) turned out to be **evidence against the aptamer working** rather than for
it, because pure dye intercalation along a duplex is rigorously linear in mass.

**Why another team would want it.** The general lesson transfers past aptamers: a perfect calibration line is a reason to
ask what else is linear.

**Where to get it.** [Measurement](/measurement) and
[cycle 4.1](/engineering#cycle-4-1).

### A dosing method that delivers a known mass to an individual bee

**What it is.** The proboscis-extension assay repurposed from a behavioural test into
a **dosing instrument**: newly emerged bees, harnessed, fed **2 × 2.5 µL** rather than
one 5 µL drop, giving a known 1 µg per animal — plus the arithmetic showing why it
matters. Cage feeding adds dose variance on top of measurement variance, and
cage-mates are not independent replicates, so for the same statistical power a cage
design needs **8–20× more animals** than individual dosing. The ratio is independent
of effect size, arm count and timepoint count, which is why we publish the ratio
rather than a bee total.

**Why another team would want it.** It is simultaneously the ethics argument and the
validity argument: **reduction, refinement and replacement are served by the same
change that makes the measurement interpretable**, and the dsRNA cost falls by three
orders of magnitude at the same time. Any team feeding anything to insects in cages
and dividing by the number of animals inherits this problem.

**Where to get it.** [Cycle B3](/engineering#cycle-b3) carries the design effect and
the worked comparison; the bench steps are on
[experiments and protocols](/bee-lab-experiments).

### The standing bench rules for working with Mango

**What it is.** Roughly twenty accumulated rules, the kind that never reach a
methods section: dye concentration regimes, potassium and never sodium in the wash
because Mango is a G-quadruplex, locking the plate reader's auto-gain, Tween-20,
what to do about flavin autofluorescence sitting on the detection channel, and
formaldehyde gels to denature the aptamer so the RNA migrates at true size.

**Why another team would want it.** Every one of them is something we learnt by
**losing a run to it**.

> **TODO —** Write up the ~20 standing bench rules as a single list. Owner:
> measurement. The material exists in the lab journal and in
> [cycle 4.1](/engineering#cycle-4-1); the collation does not.

## Working with honeybees: a handbook for future iGEM teams

**What it is.** The practical knowledge currently buried in
[the bee lab notebook](/bee-lab-labbook), written as a manual rather than as
dated entries. Contents, all of which exist as notebook material today:

- **Haemolymph handling and calibration** — the centrifugal extraction protocol
  for adults, typical yields of 5–15 µL per bee, and the yield variation we traced
  tentatively to antenna-cut position and resolved by pooling.
- **Larval staging** — how to find 5th-instar larvae (7–8 mm, curved, near
  already-capped cells because the egg-laying pattern creates an age gradient
  across the frame), and the finding that 5th instars can be extracted without
  breaking while 6th instars are too soft and pupae have lost the osmotic pressure
  that lets haemolymph ooze out.
- **Larval haemolymph extraction** — vertical ventral incision below the head
  segment, entomological pin for haemolymph that is not diluted with lipid.
- **Bee and larval assay protocols** — the PER feeding cycle at 2 × 2.5 µL, and
  in-frame larval spiking with the frame-marking scheme that lets a larva be found
  again 24, 48 or 72 hours later.
- **Feeder assembly and the 3D-printed adaptors** — why large feeders were
  abandoned (dead volume wastes dsRNA), the cut-down Eppendorf with a PCR tube
  through the lid, and the four tube orientations compared on spillage and
  evaporation.
- **RNA extraction methods and how each fared** — the five-method null and the
  column-against-TRIzol variance comparison, so a team can skip the comparison and
  take the answer.
- **Mite husbandry** — what kept mites alive and what did not, including the
  negative that a host is required and the soak is not the cause of death, and the
  standing rule to soak three to four times as many mites as the experiment needs.
- **A mite-death assay that does not exist in the literature** — dosing the larval
  host at the natural pre-capping infestation window rather than soaking the mite,
  written up with its confound (host condition dominates the outcome) so the next
  team starts from the version that failed rather than repeating it.
- **The honeybee biology a synthetic biologist actually needs** — castes, the worker
  life cycle and instars, the nurse-bee jelly pathway our whole delivery route
  depends on, haemolymph against fat body, and where _Varroa_ fits into the cycle.
- **How to find and approach bee researchers**, including what a cold email to an
  author of a recent paper needs to contain to get a reply.
- **What honeybee research costs and how to pay for it** — an itemised
  £35,000–£69,000 budget range, the observation that **over 70% of what we raised
  came through warm contacts of individual team members**, and the grant categories
  that exist specifically for bee health and are not widely advertised.

**Why another team would want it.** A team with no apiary access and no
entomologist on the supervisory staff **loses weeks to exactly this**. Several of
these are things we were shown by apiarists and could not have read anywhere.

**Where to get it.** [Working with bees](/working-with-bees) is the page; the raw
record is [the bee lab notebook](/bee-lab-labbook) and the hardware is on
[hardware](/hardware).

> **TODO —** PDF: _Working with honeybees: a handbook for future iGEM teams._ Not
> written. Upload to `static.igem.wiki` and link here. Include the failed
> approaches; they are half the value. Owner: bee lab.

## Troubleshooting

### The qPCR contamination diagnostic protocol

**What it is.** A decision tree for a negative control that will not come clean,
built around two ideas. When two hypotheses predict the same observation, design
the experiment where they predict different ones: primer-dimer and contaminating
template both give a 100 bp band, but a primer pair flanking 200 bp separates
them. And when several inputs are suspect at once, a factorial plate resolves in
one run what serial substitution takes a fortnight to do.

**Why another team would want it.** Contamination of negative controls is close to
inevitable in high-cycle qPCR, and the instinct — repeat the run — is **the one move
that cannot work**.

**Where to get it.** The full dated sequence is on
[cycle 3.3b](/engineering#cycle-3-3b).

> **TODO —** Write it as a standalone bench decision tree and upload it. Owner:
> wet lab.

### The IVT primer-design checklist

**What it is.** A pre-order checklist that catches the three promoter errors that
**cost us roughly three weeks**: promoter orientation on the correct primer only, the
kit's requirement for GGG rather than a single G after the T7 promoter, and
adaptor parity across a construct series when a replacement oligo is ordered
mid-project.

**Why another team would want it.** All three are invisible on paper and expensive
at the bench, and the third only appears when you re-order part of a series.

**Where to get it.** [Cycle 2.1](/engineering#cycle-2-1).

## Corrections and findings we owe the literature

### Published _Varroa_ dsRNA doses are not reproducible quantities

**What it is.** An analysis of every per-mite dose in the _Varroa_ RNAi literature,
showing that the numbers cannot be used as doses for three independent reasons. Most
are **bath concentrations rather than per-mite doses** — dividing bath mass by mite
count gives an upper bound on exposure, not a delivered dose, and one paper does not
state mites per tube at all, so no per-mite figure can be recovered. Every figure is
**an A260 number read with the ssRNA conversion factor of 40 ng/µL per A260 unit**,
where two orthogonal published measurements of the duplex factor agree within 1.3% at
45.9 and 46.52 µg/mL/A260, so **using 40 under-reads a duplex by 13–14%**. And **no
paper states its purification state**, which matters because the opposite error is
unbounded: in a crude T7 reaction most of the A260 is unincorporated nucleotides,
over-reading duplex by up to 7.7× at realistic yields.

**The two errors point in opposite directions**, so a reader cannot even sign the
error on a published dose. On our own material the gap is measurable: a 500 bp duplex
read 182 ng/µL by NanoDrop, 55 by Qubit, and **29.2 after nuclease digestion**.

**Why another team would want it.** Anyone reproducing a published RNAi dose in any
invertebrate inherits this. The fix is the digest-Qubit protocol above, and it uses
reagents already in a standard IVT kit.

**Where to get it.** [Measurement](/measurement), with the arithmetic and the
sources.

### No detection limit exists for SYBR Gold on dsRNA

**What it is.** A negative literature finding. The widely quoted **25 pg figure for
SYBR Gold is a dsDNA value**, the manufacturer recommends against the stain for
dsRNA, and we could find **no published or vendor dsRNA detection limit at all**
`[FLAG]`. Teams quote the dsDNA number for dsRNA work routinely.

**Why another team would want it.** It stops a number being cited for a molecule it
was never measured on.

**Where to get it.** [Measurement](/measurement) and
[cycle 4.3](/engineering#cycle-4-3).

### MS2 hairpin arrays larger than two do not fold as drawn

**What it is.** Identical copies of a self-complementary hairpin are complementary
to each other, so three identical MS2 C-variant hairpins in one loop pair with one
another instead of folding: P(correct) = 0.06 for the array. Substituting
synonymous lower stems while preserving the invariant core restores P = 0.90–0.93
per hairpin. Spacer composition contributes almost nothing; **hairpin identity
contributes everything**.

**Why another team would want it.** MS2 arrays are a standard tool, and we could
find no published folding model of an array larger than two hairpins — every
published array structure we checked is a hand-drawn cartoon. Anyone building an
array in a structured RNA context inherits this problem.

**Where to get it.** [Cycle 5.1](/engineering#cycle-5-1), with the enumeration
method and the constraint set.

### The MBP-MCP extinction coefficient

**What it is.** Recomputing ε₂₈₀ from sequence gives 83,310 and MW 56,192.5 for
MBP-MCP, against the 60,606 and 53,939 implied by a widely circulated protocol
conversion factor. The discrepancy is in ε, not MW.

**Why another team would want it.** Anyone using that factor over-reports their
protein **by about a third**.

**Where to get it.** [Cycle 5.2](/engineering#cycle-5-2).

> **TODO —** The Muita Table S1 erratum. Confirm the finding and its
> documentation before it is published here; a correction must be at least as
> well evidenced as the claim it corrects. Owner: wet lab.

## Frameworks from outside the lab

### The commercial fermentation framework

**What it is.** The chain that turns a biological question into a manufacturing
target: required treatment efficacy, then allowable cost per hive, then
manufacturing cost, then the quantity that actually matters — **mg of intact
active dsRNA per gram of dry yeast**. Not "high expression".

**Why another team would want it.** It converts a vague production goal into a
single number a wet lab can be held to, and it is the reason our own yeast arm has
a stated target it has not yet met.

**Where to get it.** [Economic modelling](/economic-modelling) and
[entrepreneurship](/entrepreneurship).

> **TODO —** Write the framework up as a transferable method rather than as our
> own numbers. Owner: entrepreneurship and dry lab.

### The regulatory and stakeholder framework

**What it is.** How we mapped a route to market across six jurisdictions, and how
regulatory status was used as a design input rather than as paperwork: it is what
selected the chassis and what selected the plasmid marker.

**Why another team would want it.** Most teams meet regulation at the end, as a
constraint on something already built. Ours **changed the project in July**.

**Where to get it.** [Entrepreneurship](/entrepreneurship#regulatory-path),
[human practices](/human-practices) and
[cycle 2.2](/engineering#cycle-2-2).

> **TODO —** Publish the framework separately from our conclusions, so a team
> working on something else can run it. Owner: human practices.

### HONEY as a reusable human-practices method

**What it is.** The HONEY loop is a process for turning stakeholder conversations
into design constraints, not a narrative device applied afterwards. It is usable by
a team working on something entirely unrelated to bees.

**Why another team would want it.** The part of our human-practices work most
likely to outlive the project is **the method, not the interviews**.

**Where to get it.** [Human practices](/human-practices).

> **TODO —** Write HONEY up as a standalone method, with the template and the
> failure cases, not only as the story of our project. Owner: human practices.

## Standard operating procedures

The protocols written in our own voice during the project, cleaned up for reuse.
See [experiments and lab book](/wet-lab-experiments).

## Where this connects

[Parts](/parts) · [Measurement](/measurement) ·
[Experiments and lab book](/wet-lab-experiments) ·
[Working with bees](/working-with-bees) ·
[Bee lab notebook](/bee-lab-labbook) · [RNA design](/software) ·
[Hardware](/hardware) · [Human practices](/human-practices) ·
[Engineering](/engineering) · [Results](/results)
