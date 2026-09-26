> **What this page proves:** that choosing the RNA sequence is a designed
> decision with stated criteria, not a guess that happened to work.
> **Where the evidence is:** [Results](/results), cycle D1 on
> [Engineering](/engineering), and the NectarDesigner repository.

**Status: Modelled.** NectarDesigner is the part of NECTAR we claim as novel.
Loop-ended dsRNA against _Varroa_ is published, and yeast delivery of dsRNA is
patented by others; a reusable method for deciding **which** sequence to make is
not. The target changes, the method for choosing a sequence against it does not,
and that is what makes NECTAR **a platform rather than a product**.

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

## Stage 2: the eight steps of NectarDesigner

Given a ranked target, the pipeline scores candidate windows inside it. Five
metrics are scored, and the deck states them publicly: mRNA accessibility, siRNA
length, end nucleotide identity, thermodynamic asymmetry, and off-target sequence
homology.

### Step 1: Accessibility

Which regions of the transcript are actually available to the silencing
machinery, rather than buried in secondary structure. A perfectly complementary
window inside a stable stem is **not a usable window**.

### Step 2: Learning from _Varroa_'s own RNAi machinery

Rather than importing size and composition rules from _Drosophila_ or
_C. elegans_, we score 24 nt windows for enrichment in **the mite's native viral
siRNA populations**. The organism's own small RNAs are the best available evidence
of what its Dicer and Argonaute actually process.

### Step 3: Thermodynamic asymmetry

Which strand gets loaded into RISC is set by the relative stability of the duplex
ends. That is **a design lever, not an accident**, and it is scored as one.

### Step 4: Off-target screening

Candidate sequences are screened against non-target organisms: the host bee,
related arthropods, pollinators sharing the environment, and humans. The design
of this step is a documented external contribution. **Prof. Paul Lam advised
against scanning everything and in favour of a justified set of representative
species**, which is what makes the screen both defensible and runnable. See
[attributions](/attributions), and [safety and security](/project-safety), where
this step is why safety is part of design rather than an assessment bolted on
afterwards.

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
the U1/U2 universal adaptors already in place, so the output of the software is
something [wet lab](/wet-lab) can order and assemble rather than a bare sequence.
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

Metric names, the biology behind each one, the ranking method in Stage 1 and the
data sources are public, and are on this page in full. Weights, coefficients,
thresholds, feature engineering and the training corpus are **held back pending the
IP position**, as is the target gene name.

Anything held back is marked as held back on the page where it would otherwise
appear. Silent omission reads as an oversight.

> **TODO —** Agree the final disclosure line and apply it identically here, in the
> repository README and on [parts](/parts). Owner: dry lab with the IP holder.

## Reproducibility

A tool nobody else can run is not a contribution. What another team needs: a
proteome, a transcript set, an RNA-seq expression table, a GFF annotation, and a
list of species to screen against. Everything in Stage 1 above can be **rebuilt
from public data** with the sources named on this page.

> **TODO —** Record the public repository link, the commit history dates, the
> dependency list and a worked example on a non-_Varroa_ target, so the platform
> claim is demonstrable rather than asserted. Owner: dry lab.

## Still missing

- The repository link and run instructions.
- The BLAST-versus-Bowtie discrepancy, resolved.
- The disclosure decision, and the IP gate on the target name.
- Experimental validation of the algorithm's gene choice, and with it Step 8.

## Where this connects

[Dry lab and modelling](/model) · [Description](/project-description) ·
[Safety and security](/project-safety) · [Parts](/parts) ·
[Wet lab](/wet-lab) · [Attributions](/attributions) ·
[Contribution](/contribution) · [Engineering](/engineering) · [Results](/results)
