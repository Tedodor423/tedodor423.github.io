> **What this page proves:** that we left behind a set of parts another team
> can actually build with, documented well enough to be worth using.
> **Where the evidence is:** [Results](/results), cycles 1.2 and 4.1 on
> [Engineering](/engineering), and each part's Registry page.

## The problem these parts solve

Loop-ended, repeat-heavy constructs are difficult to obtain: every synthesis
provider we approached declined ours, and the inverted repeats that make the
molecule work are exactly what makes it hard to assemble and what recombines out
in standard cloning strains. The response was to stop treating the construct as
one thing to be ordered and start treating it as **a set of modules to be combined**.

That modularity is what makes the platform argument on
[the description page](/project-description) true: **swap the targeting sequence**,
keep everything else.

> **FIGURE: part hierarchy.** The collection and how the levels combine, drawn
> on the same construct diagram as [wet lab](/wet-lab): the U1–U2 backbone with
> the loop slot highlighted, and L0, L1 and L2 shown as three cartridges that drop
> into it.

## What we are registering

| Part                            | Level     | What it is                                                                 |
| ------------------------------- | --------- | -------------------------------------------------------------------------- |
| **L0** — plain ledRNA loop      | Basic     | The standard 149 nt loop-ended dsRNA loop, no cargo. The control, and the comparator that makes L1 an improvement |
| **L1** — Mango reporter loop    | Improved  | L0 with the Mango aptamer as the loop, so the construct reports on itself   |
| **L2** — Mango + MS2 adaptor loop | Composite | Reporter and protein-docking functions in one loop                        |
| **MS2 C-variant hairpin**       | Basic     | The single 19 nt high-affinity coat-protein hairpin                         |
| **MS2 array**                   | Composite | The synonymised-stem array, registered separately from the single hairpin   |
| **U1–U2 dumbbell construct**    | Composite | A modular expression construct for loop-ended dumbbell dsRNA, with universal adaptors that let any cargo loop drop in |

**L1 is submitted as an Improved Part with L0 as its control.** An improvement
claimed without a side-by-side comparison is not an improvement, so the two are
deposited together and characterised on the same gels and the same plates. What
that comparison showed, including the correction that demoted Mango from
quantifier to selector, is on [measurement](/measurement).

**The single hairpin and the array are separate deposits** because they carry
different information. The hairpin is a sequence; the array is a folding result.

> **TODO —** Registry numbers, and the deposit date itself. Part deposit timing is
> gated on the IP position: the parts above are safe to deposit, the target-bearing
> construct is not until the filing question closes. Owner: parts, with whoever
> holds the IP question.

## A design finding free to publish

**Three identical MS2 C-variant hairpins in one loop do not fold. P = 0.000**
with fully optimised spacers in a 75 nt loop, and P = 0.060 for the original
three-hairpin design `[CALC]`. Two identical copies of a self-complementary
hairpin are also complementary to _each other_, and the ~19 bp inter-hairpin
duplex beats two separate 7 bp hairpins. Hairpin identity contributes
essentially all of the effect; spacer composition contributes almost nothing.

The fix is **synonymous stem redesign**: keep the invariant core, vary all five
lower-stem base pairs, and select from the 1,024 possible 5-mers on fold quality,
mutual Hamming distance and GC content. That gives hairpins at P = 0.90–0.93
each.

`[FLAG: absence of evidence]` We could find **no published folding model** of an MS2
array larger than two hairpins: zero hits for mfold, RNAfold, ViennaRNA, NUPACK
or "kcal" across the principal methods papers and their supplements, and every
published array structure we found is a hand-drawn cartoon. The field solved a
different problem, repeat recombination in _E. coli_, and the standard fix for
that incidentally removed the sequence identity that causes the cross-pairing.
The folding consequence appears to have gone unnoticed. This finding is not
encumbered and we publish it here, at cycle 5.1 and as a
[Contribution](/contribution).

## Documentation on the Registry

Each part page carries the same five sections, so a visitor arriving from the
Registry rather than from this wiki still gets the full picture:

| Section              | What goes in it                                                 |
| -------------------- | ---------------------------------------------------------------- |
| **Design**           | How the part was conceived, the rationale, any modelling behind it |
| **Experiment**       | Protocols, test conditions, results, troubleshooting            |
| **Characterisation** | Quantitative or qualitative data on how it behaves, and in what conditions |
| **Application**      | How it was used in a system, including proof-of-concept work    |
| **Discussion**       | Limitations, comparisons, future directions                     |

Write the design-build-test-learn story **onto the part page itself**, not only here.
A judge may never see this wiki page.

## Characterisation

| Part                     | Characterised?                                                                       |
| ------------------------ | -------------------------------------------------------------------------------------- |
| L0                       | Built and transcribed; no side-by-side characterisation against L1 yet                 |
| L1 (Mango loop)          | Fluorescence calibration run in water; the signal is not yet attributable to the aptamer, pending the untagged control on [measurement](/measurement) |
| L2                       | Designed, not built                                                                    |
| MS2 hairpin and array    | Computational only. No published precedent exists for a functional cargo inside a ledRNA loop `[FLAG]` |
| U1–U2 dumbbell construct | Assembled by two-step Gibson and amplified across the junctions; transcribes and anneals |

> **TODO —** **No construct has been sequence-verified.** All QC to date is gel
> band size plus NanoDrop ratios. Size and concentration checks are not sequence
> confirmation, and no part goes to the Registry without Sanger reads across both
> Gibson junctions. Owner: wet lab.

## Housekeeping before deposit

- Add the required prefix and suffix conventions in SnapGene.
- Remove or check for illegal restriction sites; loop spacers already exclude
  BsaI, BsmBI and BbsI sites, homopolymer runs longer than 3, and yeast poly(A)
  elements.
- Confirm deposited sequences match the sequencing reads, once those exist.
- Check licensing constraints on upstream sequence sources, including the Mango
  aptamer and the MS2 C-variant.

## Still missing

- Registry numbers and the deposit itself.
- Characterisation data for L0 against L1, on the same gel.
- Sequence verification.
- The IP decision that releases the target-bearing construct, or a statement that
  it stays held.

## Where this connects

[Wet lab](/wet-lab) · [Yeast](/wet-lab-experiments#yeast-production) · [RNA design](/software) ·
[Measurement](/measurement) · [Results](/results) ·
[Contribution](/contribution) · [Engineering](/engineering)
