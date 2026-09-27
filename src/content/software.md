```component
nectar-designer
```

## The pipeline, end to end

> **What this page proves:** that choosing the RNA sequence is a designed
> decision with stated criteria, not a guess that happened to work.
> **Where the evidence is:** the walkthrough above, [Results](/results),
> cycle D1 on [Engineering](/engineering), and the NectarDesigner repository.

**Status: Modelled.** NectarDesigner is the part of NECTAR we claim as novel.
Loop-ended dsRNA against _Varroa_ is published, and yeast delivery of dsRNA is
patented by others; a reusable method for deciding **which** sequence to make is
not. The target changes, the method for choosing a sequence against it does not,
and that is what makes NECTAR **a platform rather than a product**.

Seven decisions, in order, each one constrained by the one before it. Step
through them above. Change the pest and the duplex length changes, tighten the
safety threshold and candidate windows die, and if enough of them die there is
nothing left for the construct to carry. Change a control, walk forward, and
watch what moved. That chain is the argument this page makes, and it is the
thing a static diagram cannot show.

Step 4 is worth waiting on. The structure settles out of a straight line under
a spring simulation running in your browser, so you can watch stems pull their
partners together and see which stretches are left open.

> **Every number in the figure above is generated, not measured.** It runs a
> seeded generator in your browser so the pipeline's shape can be driven and
> checked. The sequences are synthetic, the base pairing comes from a grammar
> rather than from free-energy minimisation, and the off-target matches are
> drawn rather than aligned. **Nothing in it is a biological prediction and
> nothing in it is an experimental result.** Every file it offers you repeats
> that inside itself. What is faithful is the structure: which decision each
> stage makes, what it needs, and what it hands on.

> **TODO —** Replace the generated dataset with a real run: our own _Varroa_
> transcript set, the real ranked gene list, real ViennaRNA output and the real
> off-target screen. The component reads everything through one module
> (`src/utils/rnaDesign.ts`), so this is a data swap and not a rebuild. Owner:
> dry lab, gated on the IP position below. Until then the warning under the
> figure and the marker inside it both stay exactly as they are.

## Why rational RNA design matters

Most RNAi work picks a target gene by intuition or precedent, then picks a
sequence against it by convention. Previous studies had already demonstrated
_Varroa_-specific RNAi against several individual genes, but there was **no
standardised framework** for comparing candidate genes, and none for choosing the
region within a gene. That leaves the two things that most affect whether a
construct works, accessibility and off-target risk, to chance.

We therefore split the problem in two: **which gene**, then **which window
inside it**.

## Inputs

A _Varroa destructor_ transcript set, and an ecological context: **the species that
must not be affected**. The second input is what makes the output defensible rather
than merely optimised.

> **TODO —** The specific target gene is not named on this wiki pending the IP
> and patent-filing position. Every page refers to "the selected _Varroa_ target".
> Owner: whoever holds the IP question; the gate has to close before the freeze
> either way, because a target we cannot name is a target we cannot defend in
> person.

## Stage 1: ranking the target genes

The ideal target has two properties. It encodes a protein **the mite cannot do
without**, and it is highly transcribed, which is itself a signal of importance. We
built a ranking that combines the two.

|                          | High protein network connectivity           | Low protein network centrality                                 |
| ------------------------ | ------------------------------------------- | ---------------------------------------------------------------- |
| **High transcript abundance** | Most likely to be important to mite survival | Likely unimportant, unless very sensitive to partial knockdown |
| **Low transcript abundance**  | Could be a vulnerability, or could be unimportant; needs further data | Most likely unimportant                    |

**Connectivity.** We uploaded the _Varroa destructor_ proteome to STRING, which
predicts functional associations between proteins by integrating experimental
data, curated databases, co-expression, evolutionary relationships and the
literature. STRING's combined confidence score folds the number of connections
together with the confidence in each, and we converted that score to a percentile
across all proteins.

**Abundance.** Transcriptomics came from the GEO **GSE153472** RNA-seq dataset
for _Varroa_: gene-level read counts for **10,260 genes across 12 samples**. Raw
counts were normalised to library size and likewise converted to an expression
percentile.

**Joining the two.** Proteins were mapped to genes using **blastp** against the
**Vdes_3.0** GFF annotation of the _Varroa_ genome. Only transcripts with a
corresponding protein entered the ranking. The two percentiles were then summed
with equal weight, giving a ranked list of targets that are both well connected
and well expressed: the ones most likely to disable the mite quickly.

**The caveat, in the authors' own terms.** This choice was made without data on
the effect of _partial_ knockdown on any of these targets. A highly transcribed
gene may also be robust to partial knockdown, which would make it a worse RNAi
target rather than a better one; equally, a highly central but lowly transcribed
gene could be a real vulnerability. Absent knockdown-response data, high
centrality plus high abundance was the combination we were most confident in, and
we present the ranking as **a prior rather than a prediction** `[FLAG]`.

## Reading the mite's own small RNAs

Rather than importing size and composition rules from _Drosophila_ or
_C. elegans_, we went and looked at what _Varroa_ itself makes. The organism's own
small RNAs are the best available evidence of what its Dicer and Argonaute
actually process, and this analysis is what the window scoring in step 2 rests on.

**The dataset is public, so this is reproducible.** NCBI BioProject
**PRJNA986961**: 21 small RNA sequencing runs, SRR25010750 to SRR25010770. We
audited adapter state with FastQC, found **7 of the 21 runs already trimmed and
14 not**, trimmed those with CutAdapt, and kept reads of 15 to 35 nt.

**We kept only virus-derived reads.** Viral infection delivers nucleic acid the
way our own dosing does, so viral small RNAs are the population our construct
most resembles. Because viruses mutate fast, a strict alignment to a reference
genome would silently discard real reads, so each of the 273 sample-by-virus
combinations was aligned with Bowtie2, a sample-specific consensus was called
with bcftools, and the alignment was iterated until fewer than 1% or 10 further
reads were recovered. A final pass of Bowtie1 competitive mapping against the
concatenated consensus set fixed strand assignment and flagged reads that could
map to more than one virus. **20 samples and 54 sample-virus units survived.**

**What came out: 23 and 24 nt dominate, and the antisense strand is favoured.**

| Length | Abundance weighted | Unique-sequence weighted |
| ------ | ------------------ | ------------------------ |
| 24 nt  | 53.6%              | 29.3%                    |
| 23 nt  | 21.2%              | 21.5%                    |
| 22 nt  | 8.0%               | 12.0%                    |
| 25 nt  | 6.8%               | 9.7%                     |
| 21 nt  | 3.2%               | 6.5%                     |

The two weightings answer different questions. Abundance weighting counts every
copy, so a single very abundant sequence can carry a length on its own;
unique-sequence weighting counts each distinct sequence once, so it reports how
broad a length is across the population. **23 nt scores the same under both**,
which makes it a genuinely broad population. **24 nt nearly doubles under
abundance weighting**, which says its dominance rests on a smaller number of
very abundant species.

This is why the pipeline scores **24 nt windows** rather than the canonical
21 nt Dicer-2 product. What Dicer cuts and what the mite accumulates are
different questions, and for choosing a window it is the second that matters.

### Two features we tested and dropped

Both of these are negative results, and both changed the design by removing
something from it.

**Dicer-2 duplex geometry.** Dicer-2 leaves a characteristic 2 nt 3′ overhang
on each strand. If our populations carried that signature we could score for it.
We rebuilt duplexes with stepRNA and looked at the overhang distribution: the
**(+2, −2) double-overhang pattern was strongly depleted** in every population,
and 23 and 24 nt carried it at similar levels, so it cannot separate
Dicer-processed from non-Dicer-processed species either. **Dropped.**

**Transitivity.** If 24 nt species were secondary products amplified from 23 nt
primary events, they should accumulate in a consistent spatial relationship to
23 nt hotspots. Testing 100, 250 and 500 nt windows either side of hotspots
across 19 units, we found **no significant change in absolute 24 nt abundance at
any distance**, and only a small composition shift downstream, reproducible but
under two percentage points. Real, and far too small to design on. **Dropped.**

> **TODO —** The overhang and transitivity tables in the working document carry
> their own note that parameters need explaining before publication. The
> conclusions above are stated without the underlying tables for that reason.
> Bring the full tables over once the parameters are written up, or state that
> the conclusion is all we are publishing. Owner: dry lab.

## Stage 2: the eight steps

Given a ranked target, the pipeline scores candidate windows inside it. Five
metrics are scored, and we state all five publicly: mRNA accessibility, siRNA
length, end nucleotide identity, thermodynamic asymmetry, and off-target
sequence homology.

### Step 1: Accessibility

Which regions of the transcript are actually available to the silencing
machinery, rather than buried in secondary structure. A perfectly complementary
window inside a stable stem is **not a usable window**.

Structures are folded with **ViennaRNA 2.7.2**, Turner 2004 parameters, 37 °C,
partition function, which is the same setup the construct-architecture work in
[Engineering](/engineering) uses. Step 4 of the walkthrough draws the result as
capping: an open cell is a stretch the fold leaves reachable, a cell sealed in
wax is one it does not.

> **Note on the figure.** The structure that settles in step 4 is laid out by a
> real spring simulation, but which bases pair with which is generated rather
> than folded. Shipping a folding engine into the wiki bundle is not possible
> under the 5 MB build limit, so the drawn structure is illustrative and the
> real ViennaRNA output goes in with the rest of the team data.

### Step 2: Learning from _Varroa_'s own RNAi machinery

Windows are scored for how closely they resemble the mite's own abundant viral
small RNAs, using the population described above. The scoring uses terminal
nucleotide identity and regional base composition, fitted against observed
abundance.

The features and their coefficients are held back; see below. The reason to
score this at all is not held back, and it is the whole point: a window that
looks like something the mite already makes in quantity is a window its own
machinery is already equipped to process.

### Step 3: Thermodynamic asymmetry

Which strand gets loaded into RISC is set by the relative stability of the duplex
ends. That is **a design lever, not an accident**, and it is scored as one. The
walkthrough shows the two halves of the energy balance for any window you select:
what it costs to melt the site open, and what the duplex returns when it forms.

### Step 4: Off-target screening

Candidate sequences are screened against non-target organisms: the host bee,
related arthropods, pollinators sharing the environment, and humans. The design
of this step is a documented external contribution. **Prof. Paul Lam advised
against scanning everything and in favour of a justified set of representative
species**, which is what makes the screen both defensible and runnable. See
[attributions](/attributions), and [safety and security](/project-safety), where
this step is why safety is part of design rather than an assessment bolted on
afterwards.

Two species in the walkthrough's panel have no reference transcriptome, and the
matrix hatches their column rather than passing them. **Absence of a hit against
a species we could not screen is absence of data**, and reading it as a clear
result would be the most dangerous mistake available at this step.

> **TODO —** Our own records disagree about which tool performs the homology
> screen: one description says BLAST, another says Bowtie1 with Edlib. These give
> different sensitivity at short seed lengths, so the difference is not cosmetic.
> Resolve against the code and state one answer with its parameters. Owner: dry
> lab. Flagged rather than resolved here, because guessing would be worse than the
> gap.

### Step 5: Combining the scores

How the individual metrics become one ranking, and what the combination assumes.
The weights are the part of the pipeline currently held back; see below.

### Step 6: An expression-ready construct

The winning window is emitted inside the loop-ended dumbbell architecture with
the universal adaptors already in place, so the output is something
[wet lab](/wet-lab) can order and assemble rather than a bare sequence. Step 6 of
the walkthrough builds that construct, offers only the promoters and markers that
actually work in the chosen chassis, and finds the Golden Gate recognition sites
that would cut the construct during assembly.

A sequence-concatenation strategy, joining several target windows into one
multimer, was tested computationally and set aside on our own calculations. We
present it as **tested and rejected**, not as an active construct.

### Step 7: Experimental validation

What the bench said. The mite screen that would test the algorithm's gene choice
is at cycle B3 on [Engineering](/engineering); the husbandry cycle closed
negative, so the efficacy screen **has not yet run**.

### Step 8: Feeding results back in

> _The algorithm made a biological design decision, we tested that decision, and
> the result improves the next design._

That is the sentence this project is trying to earn, and we have not earned it
yet.

> **TODO —** Step 8 is aspirational as written. The loop is closed on paper and
> open at the bench: no experimental result has yet been fed back into the
> ranking. Say so here until B3 returns data. A closed loop claimed but not closed
> is worse than an open one described honestly. Owner: dry lab.

## What we can and cannot publish

Metric names, the biology behind each one, the ranking method in Stage 1, the
small RNA analysis above and every data source are public, and are on this page
in full. **Weights, coefficients, thresholds, the engineered feature set and the
training corpus are held back pending the IP position**, as is the target gene
name.

Anything held back is marked as held back on the page where it would otherwise
appear. Silent omission reads as an oversight.

> **TODO —** Agree the final disclosure line and apply it identically here, in the
> repository README and on [parts](/parts). Owner: dry lab with the IP holder.

## Reproducibility

A tool nobody else can run is not a contribution. What another team needs: a
proteome, a transcript set, an RNA-seq expression table, a GFF annotation, and a
list of species to screen against. Everything in Stage 1 and in the small RNA
analysis can be **rebuilt from public data** with the accessions named on this
page.

> **TODO —** Record the public repository link, the commit history dates, the
> dependency list and a worked example on a non-_Varroa_ target, so the platform
> claim is demonstrable rather than asserted. Owner: dry lab.

## Still missing

- Real data behind the walkthrough, in place of the generated demonstration set.
- The repository link and run instructions.
- The BLAST-versus-Bowtie discrepancy, resolved.
- The overhang and transitivity tables, with their parameters explained.
- The disclosure decision, and the IP gate on the target name.
- Experimental validation of the algorithm's gene choice, and with it Step 8.

## Where this connects

[Dry lab and modelling](/model) · [Description](/project-description) ·
[Safety and security](/project-safety) · [Parts](/parts) ·
[Wet lab](/wet-lab) · [Attributions](/attributions) ·
[Contribution](/contribution) · [Engineering](/engineering) · [Results](/results)
