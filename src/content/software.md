> **Skeleton: structure only. No results, numbers or quotes yet.**

> **What this page proves:** that choosing the RNA sequence is a designed
> decision with stated criteria, not a guess that happened to work.
> **Where the evidence is:** [Results](/results) and
> [Engineering](/engineering).

If NECTAR is a platform rather than a product, this is the part that makes it
one. The target changes; the method for choosing a sequence against it does not.

## Why rational RNA design matters

Most RNAi work picks a target gene and then picks a sequence against it by
convention. That leaves the two things that most affect whether it works
(accessibility and off-target risk) to chance. This section makes the case for
treating sequence selection as a design problem with explicit criteria.

## What goes in

A target transcript, and an ecological context: the species that must not be
affected. The second input is what makes the output defensible rather than
merely optimised.

## What NectarDesigner scores

Five metrics, which the jamboree deck already states publicly:

1. mRNA accessibility
2. siRNA length
3. End nucleotide identity
4. Thermodynamic asymmetry
5. Off-target sequence homology

The names and the biology behind them are safe to publish; it is the weights
and thresholds that are not. See _What we can and cannot publish_ below.

## The pipeline

One subsection per step, each saying what is being scored and why it matters
biologically. A reader should be able to follow the logic without reading any
code.

### Step 1: Accessibility

Which regions of the transcript are actually available to the silencing
machinery.

### Step 2: Learning from the pest's own RNAi machinery

What the organism's native small RNAs suggest about what works in it.

### Step 3: Thermodynamic asymmetry

Which strand is likely to be loaded, and why that is a design lever.

### Step 4: Off-target screening

Screening candidate sequences against non-target organisms, the host bee,
related species, and humans. This step is where [safety](/safety-and-security)
becomes part of design rather than an assessment bolted on afterwards.

### Step 5: Combining the scores

How the individual metrics become a single ranking, and what that combination
assumes.

### Step 6: Producing an expression-ready construct

From a ranked sequence to something that can actually be built. See
[wet lab](/wet-lab) and [parts](/parts).

### Step 7: Experimental validation

What was tested at the bench, and what came back.

### Step 8: Feeding results back in

The sentence worth earning: _the algorithm made a biological design decision, we
tested that decision, and the result improves the next design._ That loop is
what ties software, modelling and wet lab into one project rather than three.

> **TODO:** Step 8 is currently aspirational. State plainly how far round the
> loop we actually got. A closed loop claimed but not closed is worse than an
> open one described honestly.

## What we can and cannot publish

Metric names and the underlying biology are public. Weights, coefficients,
thresholds, feature engineering and training data are not, pending the IP
position.

> **TODO:** Agree and write the disclosure line, then apply it consistently on
> this page and in the repository. Anything held back is marked as held back:
> silent omission reads as an oversight.

## Reproducibility

Where the code lives, how to run it, what it depends on, and what a user needs
to supply. A tool nobody else can run is not a contribution. See
[Contribution](/contribution).

> **TODO:** Record the public repository link and its commit history dates.

## Still missing

- The disclosure decision.
- The repository link and instructions.
- Honest reporting of how far the design-test-redesign loop was closed.
- Off-target screening methodology, written so it can be reused against another
  pest entirely.

## Where this connects

[Dry lab and modelling](/model) · [Description](/description) ·
[Safety and security](/safety-and-security) · [Parts](/parts) ·
[Wet lab](/wet-lab) · [Contribution](/contribution) · [Results](/results)
