After nuclease digestion, Qubit finds 4–11% of the dsRNA that NanoDrop reports for
the same preparation, so every dose on this wiki is set by digest-Qubit. Fed to
larvae in the hive, our dsRNA is still detectable intact 24 h later, but most of a
1 µg dose is gone by then. Soaking mites in target dsRNA raised mortality with
dose; delivering it through a fed larval host did not, because larval compromise
drove mite death in every group. No construct is sequence-verified and no yeast or
_E. coli_ titre exists yet. The decisions behind each result are on
[Engineering](/engineering).

Every headline result below, failed ones included, is set out in the same eight
fields and carries one of four status labels: **Demonstrated**, **Investigated**,
**Modelled** or **Proposed**. `[LIT]` marks a source we read, `[CALC]` our own
arithmetic with the assumptions stated, and `[FLAG]` a claim we could not verify,
never stated as fact.

```component
project-outputs
```

## Two caveats that apply to every mass figure below

> **TODO —** Re-quantify all four annealed stocks by digest-Qubit before any
> µg-per-bee figure is published anywhere on this wiki. Doses on this page are
> the nominal mass fed; the digest-Qubit mass is lower, by a factor that varies
> from one preparation to the next (see the Qubit result below). Owner: wet lab.

> **TODO —** Re-analyse gel SYBE 01 from a 16-bit TIFF. The band intensities
> currently in hand were read off an 8-bit JPEG, which clips and quantises the
> exact range a densitometry number comes from. Owner: measurement.

## Making the molecule

We make dsRNA by _in vitro_ transcription with Vazyme's IVT kit. For
dual-promoter dsRNA, a T7 promoter is added to each strand in two separate PCRs,
which avoids a non-functional T7 flap, and the two transcripts are annealed after
IVT. Loop-ended constructs were designed with T7 built in, so their IVT template
is a colony-lysis PCR, or a PCR of miniprep product, across the Gibson homology
arms. The whole pipeline (colony lysis and DNA purification, PCR, purification,
IVT, RNA extraction, annealing) has been run many times, for 300, 500 and 700 bp
constructs with and without the Mango loop.

> **TODO —** Figure: agarose gels of annealed dsRNA at 300, 500 and 700 bp, with and
> without Mango, each band annotated with its expected size. Owner: wet lab (Ariana,
> Anna).

### Overnight transcription roughly doubles IVT yield

**Status: Demonstrated.**

**Question.** Is a 2 h _in vitro_ transcription long enough to supply a feeding
assay?

**Experiment.** T7 transcription of the GFP length series, 2 h against overnight
incubation, yield read on the same instrument.

**Evidence.**

> **TODO —** Figure: Yield per reaction, 2 h against overnight, one point per
> preparation, constructs distinguished by marker. Axis in ng/µL post-digest, not
> raw NanoDrop.

**Controls + n.** Not run as a controlled side-by-side series. The comparison is
across routine production runs on the same constructs and kit.

**Result.** 2 h is insufficient; overnight incubation **approximately doubles yield**.

**Interpretation.** IVT time, not template mass, was the binding constraint on how
many bees we could dose in a session.

**Limitation.** No paired n, no replicate statistics. This is a production
observation we act on, **not a measured rate**.

**What it changed.** Overnight became the standard IVT. See
[cycle 2.1](/engineering#cycle-2-1).

### After digestion, Qubit finds 4–11% of what NanoDrop reports

**Status: Demonstrated.**

**Question.** NanoDrop and Qubit disagree about our dsRNA concentration. Which
should set a dose, and can a NanoDrop reading be converted into one?

**Experiment.** Each IVT product was read on NanoDrop (RNA-40 setting) and on Qubit
RNA Broad Range. A representative 5–10 µL was then digested with RNase T1 and
DNase I and read again on both. RNase T1 cuts single-stranded RNA only, because a
duplex blocks the cut sterically, and the free nucleotides it leaves give no Qubit
signal, because the dye needs structure to bind. DNA should not affect the Qubit
RNA reading; DNase I was added so that NanoDrop before and after could be compared.
The step-by-step protocol is on [Experiments and protocols](/wet-lab-experiments).

**Evidence.**

| NanoDrop before (ng/µL) | Qubit before (ng/µL) | NanoDrop after digest (ng/µL) | Qubit after digest (ng/µL) | Qubit after / NanoDrop before (%) |
| ----------------------- | -------------------- | ----------------------------- | -------------------------- | --------------------------------- |
| 178.3                   | 49.2                 | 92.1                          | 20                         | 11.22                             |
| 525.2                   | 96                   | 231                           | 40                         | 7.62                              |
| 530.2                   | 100                  | 283                           | 50.6                       | 9.54                              |
| 744.1                   | 212                  | 363.8                         | 64.8                       | 8.71                              |
| 1196.3                  | too high             | 626.4                         | 87.6                       | 7.32                              |
| 1239.6                  | too high             | 677.9                         | 78.6                       | 6.34                              |
| 1307.1                  | too high             | 711                           | 93.8                       | 7.18                              |
| 3323.9                  | too high             | 1922.6                        | 146.6                      | 4.41                              |
| 2410.6                  | not recorded         | 1193.8                        | 86                         | 3.57                              |
| 787.3                   | not recorded         | 357                           | 49                         | 6.22                              |
| 1606.9                  | 110                  | 986.9                         | 67.2                       | 4.18                              |
| 527.4                   | 57.2                 | 257.6                         | 32.32                      | 6.13                              |
| 3662.2                  | too high             | not recorded                  | 140                        | 3.82                              |

> **TODO —** Figure: NanoDrop before digestion (x) against Qubit after digestion (y),
> both in ng/µL, one point per preparation (n = 13), with the least-squares line
> y = 0.0322x + 28.9 and R² = 0.862 marked. What it has to show is the spread of
> Qubit values at a given NanoDrop reading.

> **TODO —** Figure: Qubit reading against fold dilution, 1× to 3.5× in 0.5× steps,
> for the three digested samples in the dilution series, with the reading expected
> from dilution alone drawn beside each, so the gap at 3–3.5× is visible.

**Controls + n.** Thirteen IVT preparations. The first eight rows are the original
cross-check (three constructs, five dates), run with a water-plus-nuclease blank and
a DNase + RNase A low-salt arm expected to go to near zero.

**Result.** Qubit after digestion was **3.6–11.2% of the NanoDrop reading before
it**, falling from about 11% in lower-yield preparations to about 4% in the
highest, those above 2000 ng/µL by NanoDrop. NanoDrop before predicts Qubit after
linearly (**R² = 0.862, p = 4.62 × 10⁻⁶, n = 13**), but with a residual standard
error of 14.80 ng/µL: three preparations at 525–530 ng/µL by NanoDrop held
32.3–50.6 ng/µL of duplex. In the first eight, digestion removed about half the
A260 signal (N₁/N₀ = 52.1% ± 4.2% `[CALC]`), and the digested NanoDrop reading
still sat several-fold above Qubit.

**Interpretation.** Reactions that make more nucleic acid make more duplex, but not
in proportion: very high crude yields did not turn into matching dsRNA. A260 counts
leftover NTPs and single-stranded RNA as if they were product. The regression is
good enough to predict a concentration interval and not good enough to set a dose,
so **every preparation is measured directly by digest-Qubit**.

**Limitation.** Thirteen points, and five Qubit readings before digestion were too
high to read, so Qubit before and after cannot yet be compared. RNase T1 leaves
mononucleotides that still absorb at 260 nm, so a NanoDrop reading after digestion
partly counts the debris of what was just destroyed. Qubit readings also fall less
than dilution predicts: the sample labelled "700 treated" read 1.68 ng/µL undiluted
and about 0.77 ng/µL at 3.5×, against about 0.48 expected. That series was made by
adding working solution to Qubit tubes already prepared, so the free dye and its
background glow stayed constant while the target signal fell, which most likely
inflates the readings at high dilution.

**What it changed.** Digest-Qubit sets every dose, and every µg-per-bee figure is
re-derived from it. Next, the dilution series is to be repeated with the sample
diluted before the dye goes in, and the stocks that read too high diluted so that
Qubit before and after digestion can be modelled the same way. See
[cycle 2.6](/engineering#cycle-2-6).

### dsRNA titre from yeast and _E. coli_

No yeast has been transformed on our written record, so no yeast-produced dsRNA
and no titre exist yet. As of 20 September the yeast plasmid had been linearised
and DpnI-treated. Every dose used for bee-lab validation is therefore
IVT-derived; the detail is on
[wet lab experiments](/wet-lab-experiments#yeast-production).

> **TODO —** Three results, none yet in: the dsRNA expression titre in yeast and in
> _E. coli_, as µg intact dsRNA per mg dry cells, with the culture conditions and
> the quantification method; dsRNA stability in pollen patty against sucrose
> solution, with how the yeast was cultured and the patty made; and the stability
> of the different loop structures. Before any of it is written up, name the yeast
> backbone and strain and the _E. coli_ plasmid and strain, say which chassis
> produces the loop-ended dsRNA and which is only a cloning host, and resolve
> whether a transformation happened at all: the 12 October write-up says the
> insert was cloned into pUC57 and used to transform _S. cerevisiae_, but its own
> test section is empty and no journal entry records it. Owner: wet lab.

## Parts

### The problem these parts solve

Loop-ended, repeat-heavy constructs are difficult to obtain: every synthesis
provider we approached declined ours, and the inverted repeats that make the
molecule work are exactly what makes it hard to assemble and what recombines out
in standard cloning strains. The response was to stop treating the construct as
one thing to be ordered and start treating it as **a set of modules to be combined**.

That modularity is what makes the platform argument on
[the description page](/project-description) true: **swap the targeting sequence**,
keep everything else.

> **TODO —** Figure: construct architecture and part hierarchy, drawn once. The
> dumbbell annotated with the T7 promoter, the U1 and U2 universal adaptors, the
> duplex stem and the two ~150 nt loops with the cargo slot marked; L0, L1 and L2
> shown as three cartridges that drop into that slot; and the ribozyme-flanked
> yeast variant underneath as a second row. The same diagram is reused on
> [yeast](/wet-lab-experiments#yeast-production), so draw it properly.

### What we are registering

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

### A design finding free to publish

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

### Documentation on the Registry

Each part page carries the same five sections, so a visitor arriving from the
Registry rather than from this wiki still gets the full picture:

| Section              | What goes in it                                                 |
| -------------------- | ---------------------------------------------------------------- |
| **Design**           | How the part was conceived, the rationale, any modelling behind it |
| **Experiment**       | Protocols, test conditions, results, troubleshooting            |
| **Characterisation** | Quantitative or qualitative data on how it behaves, and in what conditions |
| **Application**      | How it was used in a system, including proof-of-concept work    |
| **Discussion**       | Limitations, comparisons, future directions                     |

### Characterisation

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

### Housekeeping before deposit

> **TODO —** Before deposit:
>
> - Add the required prefix and suffix conventions in SnapGene.
> - Remove or check for illegal restriction sites; loop spacers already exclude
>   BsaI, BsmBI and BbsI sites, homopolymer runs longer than 3, and yeast poly(A)
>   elements.
> - Confirm deposited sequences match the sequencing reads, once those exist.
> - Check licensing constraints on upstream sequence sources, including the Mango
>   aptamer and the MS2 C-variant.

## Measuring it in bee material

### Five extraction methods, no winner

**Status: Demonstrated, as a null.**

**Question.** Which RNA extraction method recovers most from dosed larvae?

**Experiment.** Five methods on 5th-instar larvae fed 1 µg dsRNA: liquid nitrogen
grinding, the standard protocol, DTT addition, a 40 min extended Vezol
incubation, and a spin-down after Vezol addition.

**Evidence.**

> **TODO —** Figure: Yield and A260/230 for all five methods, same larvae, same day
> (29 Jul), points not bars, so the overlap is visible.

**Controls + n.** All five arms from the same pooled larval material on one day.

**Result.** All five gave comparable yields. **No method was better**. All five also
gave very low A260/230, traced to residual ethanol and fixed by using 1× volume
ethanol instead of 0.5×, a dry spin after the ethanol has passed the column, and
leaving the lid open until the ethanol has evaporated.

**Interpretation.** Effort spent choosing between homogenisation variants is
wasted effort. The purity problem was a wash-step problem, **not a method problem**.

**Limitation.** Total RNA by NanoDrop, not dsRNA-specific recovery. A method could
give identical total RNA and different duplex recovery; spike-recovery is the
missing control.

**What it changed.** We stopped optimising homogenisation and chose on variance
instead. Published as a null because it saves a future team a week. See
[cycle 3.1](/engineering#cycle-3-1).

### Silica column beats phenol-chloroform on variance and purity, not on yield

**Status: Demonstrated.**

**Question.** Which purification gives the most reliable input for qPCR?

**Experiment.** Larvae flash-frozen in liquid nitrogen and homogenised, five
larvae pooled to ~100 µL each, split into eight aliquots of ~60 µL, then processed
by TRIzol/phenol-chloroform or by a silica-bead column kit. Concentration and
ratios by NanoDrop.

**Evidence.**

| Method                | Mean concentration (ng/µL) | Mean A260/A280 | SD (ng/µL) | Coefficient of variation (%) |
| --------------------- | -------------------------- | -------------- | ---------- | ---------------------------- |
| Phenol-chloroform     | 1255.15                    | 1.80           | 344.04     | 27.4                         |
| Silica beads (column) | 261.33                     | 2.04           | 48.25      | 18.5                         |

**Controls + n.** Aliquots of one pooled homogenate, so biological variation is
removed and what is left is method variation. Phenol-chloroform n = 8, column
n = 7.

**Result.** Phenol-chloroform yields **roughly 4.8× more total RNA** and is
half again as variable: a coefficient of variation of 27.4% against 18.5%. The
column gives the cleaner RNA, with A260/A280 of 2.04 against 1.80, and TRIzol
A260/230 ran 0.51–0.88, which is guanidine and phenol carryover and a qPCR
inhibition risk.

**Interpretation.** For qPCR, **reproducibility is worth more than yield**. The
TRIzol variance is structural: five operator-dependent steps stack, and the manual
specifies the aqueous-phase transfer only as "angling the tube at 45°".

**Limitation.** One pooled sample, one day, one operator pair. Total RNA, not
duplex recovery.

**What it changed.** Column extraction became standard for everything feeding
qPCR, chosen for its lower coefficient of variation and better A260/A280. See
[cycle 3.1](/engineering#cycle-3-1).

### Measuring dsRNA by RT-qPCR

**Status: Investigated.** The assay and its standard curves are designed; no dsRNA
concentration in bee material exists yet.

Adults were fed 1 µg of 300, 500 or 700 bp GFP dsRNA, and larvae 1 µg of 700 bp
GFP dsRNA. The RT-qPCR primers amplify a conserved 100 bp region of the GFP
sequence, so one assay reads every length. Each matrix gets its own standard
curve. For adult haemolymph, Qubit-quantified dsRNA is spiked as a 1:10 series
into pooled untreated haemolymph, with phenylthiourea at 0.1 mM final to inhibit
tyrosinase and so melanisation, and each point is run in triplicate. Larval
samples need RNA extraction first, so their curve is a dilution series in water.
Protocol on [Experiments and protocols](/wet-lab-experiments).

> **TODO —** Figure: the adult standard curve (Cq against log dsRNA spiked into
> haemolymph, triplicates shown, with efficiency, slope, R² and the no-template
> control), then dsRNA in adult haemolymph against time after the 1 µg dose, at
> 1, 3, 6 and 24 h for each of the three lengths, five bees per length per
> timepoint against three sucrose-fed controls. Owner: wet lab (Lisa, Michael,
> Ariana).

> **TODO —** Figure: the larval equivalent, the water standard curve and dsRNA per
> larva after a 1 µg dose of 700 bp GFP dsRNA at 24, 48, 72 and 96 h and 7 days.
> Nothing on this wiki yet quantifies dsRNA in larval material; the larval result
> under "Delivering it to bees" is detection only. Owner: wet lab (Lisa, Michael).

### Mango calibrates in water, and the second run shows how easily it does not

**Status: Investigated.**

**Question.** Can a Mango-tagged construct report its own concentration on a plate
reader?

**Experiment.** Mango-II folds into a K⁺-stabilised G-quadruplex that binds
TO1-Biotin; the complex is excited around 510 nm and emits at 535 nm. Dilution series
of Mango-tagged dsRNA in water and in spiked adult haemolymph were incubated with
the K⁺ folding buffer and TO1-Biotin and read on a plate reader. Method on
[measurement](/measurement).

**Evidence.**

> **TODO —** Figure: Both runs on one axis: run 1 linear fit with its residuals, run 2
> plotted as measured to show the non-monotonicity. Blanks shown, not subtracted
> silently.

**Controls + n.** Triplicates throughout, water blanks, unspiked haemolymph
control.

**Result.** Run 1 in water: slope 4,952 RFU per ng/µL, R² = 0.9999, CVs 0.8–7.4%,
LOD 0.23 ng/µL, LOQ 0.69 ng/µL `[CALC]`. Run 2, at 125 nM dye with the plate
reader's auto-gain left unlocked and no Tween-20, was non-monotonic and degraded
LOD to ≈ 1.3 and LOQ to ≈ 4.1 ng/µL. In spiked crude haemolymph there was no
significant difference between spiked samples and the unspiked control.

**Interpretation.** The calibration is real arithmetic on real fluorescence, but
run 1 was almost certainly measuring TO1 intercalated along the duplex rather than
the aptamer — a perfect line is **what pure intercalation produces**.

**Limitation.** The untagged-dsRNA control that would separate aptamer signal from
intercalation **has never been run**, and the whole assay depends on it.

**What it changed.** Mango was demoted from quantifier to selector. See
[cycle 4.1](/engineering#cycle-4-1).

**The untagged-dsRNA control has since been run, and it is decisive.** Tagged and
untagged constructs stain indistinguishably, and a commercial ladder carrying no
aptamer stains as well. No number on this page can be attributed to aptamer signal
rather than intercalation; the LOD and LOQ stand as **an intercalation calibration**,
which is still usable, and not as a measurement of the tag. Full working on
[measurement](/measurement).

> **TODO —** The one control still outstanding is the capture-format version: does
> streptavidin also capture dsRNA carrying intercalated TO1-Biotin? Every claim made
> for the capture assay at [cycle 4.2](/engineering#cycle-4-2) depends on it.
> Owner: wet lab.

### In-gel detection loses 6.4× to the haemolymph matrix, and the signal is not the aptamer

**Status: Investigated.**

**Question.** Does resolving the tagged construct on a gel escape the background
that defeats the plate reader?

**Experiment.** A 592 bp Mango construct loaded as an eight-point two-fold series
from 408 ng to 3.19 ng, in parallel in nuclease-free water and in crude haemolymph,
on one gel, post-stained with TO1-Biotin. Densitometry by fixed-width lane
integration.

**Evidence.**

> **TODO —** Figure: The two series side by side, water and haemolymph, with the
> faintest visible band on each marked and the ladder lane included, since the
> ladder staining is itself part of the result.

**Controls + n.** Twenty lanes: ladder, unspiked haemolymph, eight water, two
controls, eight haemolymph. Blank σ taken from two lanes only.

**Result.** Over the usable 3.19–51 ng window the water series gives **LOD 0.42 ng
and LOQ 1.27 ng per band (slope 7,273, R² = 0.9983)**. In haemolymph the slope falls
to 971 against 6,247, a **6.4× matrix penalty**, giving **LOD 3.1 ng and LOQ 9.5 ng**
`[CALC]`. Above 51 ng the response saturates and bands can be called present but not
quantified. **The dsDNA ladder stained too**, and it carries no aptamer at any
position.

**Interpretation.** Two things at once. The matrix costs 6.4×, so any assay that does
not remove the haemolymph before reading pays that penalty. And the detection limit
of 0.42 ng is **1.10 fmol of this construct, 57× below the published 62.5 fmol in-gel
limit for Mango-II itself** — a signal cannot be seen fifty-seven-fold below the
detection limit of the mechanism supposedly producing it. What is being detected is
intercalation, not the tag.

**Limitation.** σ from two blank lanes gives roughly ±70% relative standard error on
the limits, so these are factor-of-two estimates. Haemolymph signal as a fraction of
water rises at low mass, indicating an additive pedestal of host nucleic acid; the
high-mass reading, a 5–8× penalty, is the more conservative one. Read from an 8-bit
JPEG; see the TIFF caveat at the top of this page.

⚠ These figures **supersede the ~3–6 ng / ~50–100 ng per band and 10–30× matrix
penalty** this page previously carried, and the ~75 ng/band figure in two of our own
project documents.

**What it changed.** Method development moved to washing the matrix away before
reading, rather than reading through it. See
[cycle 4.2](/engineering#cycle-4-2).

> **TODO —** SYBR Gold LOD and LOQ in haemolymph. Two protocols are written and
> neither has been run, so this wiki carries no SYBR dsRNA detection limit. The
> widely quoted 25 pg figure is dsDNA and is not ours to cite. Owner: wet lab.
> See [cycle 4.3](/engineering#cycle-4-3).

### Bee haemolymph barely absorbs at Mango wavelengths

**Status: Investigated.** Neat adult haemolymph absorbs at 507 nm below what a
NanoDrop can resolve, and diluting it changed nothing, so diluting haemolymph to
reduce optical interference costs signal and buys nothing. Left open to the air,
absorbance in two of three samples rose after a lag of 5–10 minutes, but the ratio
between the two wavelengths points to scatter from coagulation and aggregation,
and none of the rise can yet be attributed to melanin. Data and working are on
[measurement](/measurement).

## Delivering it to bees

### Cage feeding cannot give a known dose per bee

**Status: Investigated. A negative that set the dosing method.**

**Question.** Can caged bees be dosed through a shared feeder, and does the salt our
dsRNA needs put them off feeding?

**Experiment.** Fourteen cages of fifteen bees, each with four 2 mL feeding tubes of
1 M sucrose alone or with 50, 100 or 150 mM NaCl, plus one bee-free cage as an
evaporation control. Tubes were weighed and replaced daily from 30 June to 3 July,
and dead bees counted at every change. A second round replaced the 2 mL tubes with
PCR tubes held in 3D-printed inserts ([hardware](/hardware)). The salt-trial data
are on [the bee lab](/bee-lab).

**Evidence.**

> **TODO —** Figure: gross mass lost per cage on each of the three days, split into
> evaporation (from the bee-free cage) and consumption, with consumption per bee
> for each NaCl concentration beside it, one point per cage. Owner: bee lab.

**Controls + n.** One bee-free evaporation cage. 210 bees in 14 cages: five cages at
0 mM NaCl and three at each other concentration. The cage is the unit of analysis,
because cage-mates share a feeder.

**Result.** Salt had no detectable effect on consumption (one-way ANOVA,
F(3,10) = 0.96, p = 0.45) or on 24 h mortality (chi-square = 4.85, p = 0.18,
approximate because three expected counts fall below 5) `[CALC]`. But evaporation
made up **74% of the mass lost from the feeders**, 90% on the first day, and only
**3.1% of the solution loaded** over the three days was drunk `[CALC]`.

**Interpretation.** Bees accept the salt that dsRNA stability needs. The feeder is
the problem: the balance mostly weighs evaporation, almost all the dsRNA loaded is
wasted, and a cage can only ever give an average dose, never the known dose per bee
that a haemolymph time course needs.

**Limitation.** The evaporation and utilisation figures are means across cages,
without a spread. The PCR-tube inserts reduce the volume at risk but cannot recover
a per-bee dose.

**What it changed.** Cage feeding was abandoned for individual dosing by proboscis
extension, below. See [cycle B1](/engineering#cycle-b1).

> **TODO —** The PCR-tube insert result. One account in our record has the tilted
> 23-gauge insert cutting evaporation 11-fold with consumption unchanged at
> 15.7–19.2 µL per bee per day; another has systematic failures in the evaporation
> controls leaving no reliable comparison. Settle which stands before either is
> restated. Owner: bee lab.

### Newly emerged bees take less, but they survive the day

**Status: Demonstrated, as a method decision.**

**Question.** Which bees should a proboscis-extension feeding assay use?

**Experiment.** Bees strapped into PER harnesses and fed a measured volume of 1 M
sucrose from a syringe tip: foragers caught at the hive entrance first, then newly
emerged bees (14–15 Jul), scoring uptake and survival.

**Evidence.**

> **TODO —** Figure: A harnessed bee taking a droplet from the syringe, and the two
> uptake ranges plotted against survival, so the trade-off is one image.

**Controls + n.** Foragers n = 50, scored within the same working day. Newly
emerged bees n = 40, scored overnight.

**Result.** Foragers took up to ~30 µL but only **22 of 50 survived the day**, about
a quarter of them lost within the first hour of restraint. Newly emerged bees are
calm, harness easily and take a controlled 5–10 µL, and **38 of 40 survived
overnight**.

**Interpretation.** A larger dose delivered to an animal that dies before the
timepoint is not a larger dose. Volume was **the wrong thing to maximise**. Losses
concentrated in the first hour point to handling and restraint stress rather than
a slow decline.

**Limitation.** The observation windows are not matched, and the mismatch favours
the foragers: they were scored over a shorter window and still died more. The
forager cohort was caught rather than age-matched.

**What it changed.** Newly emerged bees became standard for every dosing
experiment on this project, and the dose was delivered as 2 × 2.5 µL to hold the
volume accurate: 5 µL at 200 ng/µL, 1 µg per bee as set by NanoDrop. See
[cycle B2](/engineering#cycle-b2).

> **TODO —** Forager uptake: confirm the upper figure (about 30 µL in the cohort
> record, 20 µL in the cycle text) and the provisional 10 µL lower bound against
> the bench record. Owner: bee lab.

### Background mortality over a weekend is low

**Status: Demonstrated.**

**Question.** How many caged bees die anyway, with no treatment?

**Experiment.** Three cage boxes of bees held over a weekend on the 1 M sucrose
and NaCl tolerance setup, dead bees counted at the solution change.

**Evidence.**

> **TODO —** Table: Deaths per box against box size and salt concentration, once the
> per-box assignment is confirmed from the journal.

**Controls + n.** Three boxes, 46 bees total (20 Jul).

**Result.** 0/15, 1/16 and 2/15 deaths — three deaths in 46 bees over a weekend.

**Interpretation.** Caging and the sucrose diet are not, by themselves, killing
bees. Any treatment mortality has to be read against **roughly 6% background** over
that window.

**Limitation.** One weekend, three boxes, and the journal does not record which
box carried which NaCl concentration, so this is a background-mortality figure and
not a salt-tolerance comparison.

**What it changed.** Gave the survival assays a baseline to be read against. See
[cycle B1](/engineering#cycle-b1).

### A ~700 bp band from adult haemolymph at 3 h

**Status: Investigated. Caveated.**

**Question.** Can dsRNA fed to an adult bee be recovered from its haemolymph?

**Experiment.** Adults PER-fed a known dose, haemolymph extracted by the
centrifugal method at 3 h, RT-PCR and gel.

**Evidence.**

> **TODO —** Figure: The 12 Aug gel, with the contemporaneous water control lane shown
> rather than omitted, because the caveat below is visible in it.

**Controls + n.** Water no-template control on the same gel; n not recorded.

**Result.** A ~700 bp band was recovered from adult haemolymph at 3 h (12 Aug).

**Interpretation.** Consistent with the larval result below, and no more than that.

**Limitation.** This gel was run on 12 Aug, the day after the reagent-borne
template contamination diagnosed in [cycle 3.3b](/engineering#cycle-3-3b) was
isolated, and that contamination had been producing bands in water controls
through the period. **We do not treat this band as clean evidence** and it is
reported with the DNA-contamination caveat attached.

**What it changed.** All pre-fix qPCR and RT-PCR data carries the caveat, and the
adult assay is queued for a repeat. See
[cycle 3.3b](/engineering#cycle-3-3b).

### A 20 µL dose covers a larva; a 5 µL drop does not

**Status: Demonstrated, as a method decision.**

**Question.** How do we get a whole dose into a 5th-instar larva without taking it
out of the hive?

**Experiment.** Brood frames lifted from the hive and 5th-instar larvae dosed in
their cells, first with 5 µL of 200 ng/µL dsRNA (1 µg), then with the same 5 µL
diluted in 15 µL of 1 M sucrose to 20 µL. Frames went straight back into the hive
and the larvae were checked 24 h later.

**Evidence.**

> **TODO —** Figure: photographs of a 5th-instar larva in its cell just after a 5 µL
> drop and just after a 20 µL dose, and the same cells once capped. Owner: bee lab.

**Controls + n.** First pilot: 10 dsRNA-fed and 10 sucrose-fed larvae, located by
coloured marks on the frame.

**Result.** The 5 µL drop sat on the larva's surface: it neither covered the larva
nor could be placed reliably near its mouth. The 20 µL dose covered the larva
completely and visibly disappeared.

**Interpretation.** A dose has to cover the larva, as brood food does. On our bee
lab mentor's advice, we take a 20 µL dose that disappears as eaten.

**Limitation.** Ingestion is inferred from the solution disappearing, not measured.

**What it changed.** 20 µL became the dose volume for every later larval
experiment, the mite screen included. See [cycle L1](/engineering#cycle-l1).

### dsRNA is still detectable intact in larvae at 24 h, but most of a 1 µg dose is gone

**Status: Demonstrated, qualitatively, for detection. Investigated for the loss,
which is not yet a number.**

**Question.** After a larva eats our dsRNA, can we get it back intact, and how much
of the dose is left?

**Experiment.** 5th-instar larvae fed in-frame with 1 µg of 700 bp GFP dsRNA and
returned to the hive. GFP has no silencing target in the bee, so the assay isolates
delivery and persistence from knockdown. Whole larvae and larval haemolymph were
collected at 24 h, column-extracted, flash-denatured, reverse-transcribed and
amplified with construct-specific primers.

**Evidence.**

> **TODO —** Figure: The 4–5 Aug gel, uncropped, with lane labels: dosed larvae, undosed
> larvae from the same frame, water-plus-primer no-template control, ladder. State
> what was loaded in each lane: the notebook records bands at all three expected
> sizes (300/500/700 bp) from larvae dosed with the 700 bp construct. Owner: bee lab.

> **TODO —** Table: how much of the 1 µg dose remains at 24 h, with the method and n
> behind "most of the dose is gone". Owner: bee lab with wet lab.

**Controls + n.** Undosed larvae from the same frame and water-plus-primer
no-template controls, on the same gel. Whole larvae 4 Aug: two samples, both
positive. Larval haemolymph 5 Aug: controls on the same gel; per-sample n not
recorded in the journal.

**Result.** Whole larvae gave bands at the expected sizes, in good quantity, **24 h
after dosing** (4 Aug). Larval haemolymph gave intact bands at 24 h, with undosed
and water controls clean on the same gel (5 Aug). **The levels measured were low:
most of the 1 µg dose had gone within 24 h of feeding.**

**Interpretation.** Ingested dsRNA crosses the larval gut, reaches the haemolymph,
and some of it survives at least 24 h, which spans the window when _Varroa_ enters
the cell and begins feeding. Most of it does not survive. We attribute the loss to
poor dsRNA stability in the feeding medium and in the hive. The mass fed is itself
uncertain, because Qubit and NanoDrop gave different concentrations when the doses
were prepared (see the Qubit result above).

**Limitation.** An endpoint RT-PCR gel is presence or absence, and band intensity is
not concentration. One construct length was fed, so nothing here bears on length.

**What it changed.** Detection worked, so every later measurement cycle is an
attempt to put a number on it. The loss moved the design to loop-ended dsRNA,
which has no exposed single-stranded regions for nucleases to attack; whether it
lasts longer in larvae is untested. See [cycle 3.2](/engineering#cycle-3-2) and
[cycle L3](/engineering#cycle-l3).

## Reaching the mite

### Mites do not survive in the lab without a host

**Status: Investigated. A negative.**

**Question.** Can _Varroa_ be kept alive long enough to dose and score?

**Experiment.** Mites collected by sugar shake, soaked 6 h in 0.9% NaCl or left
unsoaked, then housed four ways: in capped cells in-frame, on white-eyed pupae in
cellulose capsules, on 5th-instar larvae in capsules, or alone in a capsule.
Survival scored at the 3-day checkpoint (7–8 Sep).

**Evidence.**

> **TODO —** Figure: Survival by housing method as a bar of counts, not percentages,
> with the denominators printed on each bar. Small n is the point, not something
> to hide.

**Controls + n.** Soaked-alone (n = 9) and unsoaked-alone (n = 9) are the two
control arms. With a host: in-frame n = 10, white-eyed pupae n = 5, larvae n = 5.

**Result.** With a host, 9 of 20 mites survived (45%): 4/10 in-frame, 3/5 on
white-eyed pupae, 2/5 on larvae. Alone, 0 of 18 survived (0%). Fisher exact test,
host against no host: **p = 0.0013** `[CALC]`. The two alone arms cannot separate
the soak from the missing host: soaked 0/9 against unsoaked 0/9, **p = 1.0**
`[CALC]`, but **both arms died completely**, so the comparison is at the floor and
carries no power to detect a soak effect. An earlier 24 h pilot (3–4 Sep) pointed the same way without
proving it: 9 of 14 soaked mites died on white-eyed pupae, against 9 of 10 soaked
mites in empty capsules and 10 of 10 unsoaked mites in tubes. One-sided Fisher
tests gave p = 0.17 and p = 0.047 against a Bonferroni-corrected threshold of
0.025, so neither comparison reached significance `[CALC]`.

**Interpretation.** A host is required. This assay does **not** establish that the
6 h soak is harmless: with no survivors in either hostless arm it cannot measure
the soak's contribution, and our later record puts post-soak mortality as high as
80% in some batches, with only about 20% of mites surviving the soak at all. The
soak was abandoned for that reason.

**Limitation.** Small n in every arm, mites fell off pupae in the earlier pilot,
and survival was scored by movement, not by feeding.

**What it changed.** Husbandry was redesigned around larvae in-frame rather than
capsules, and the efficacy screen's primary endpoint moved from mortality to
molecular knockdown, which can be measured on the mites we can keep alive. See
[cycle V1](/engineering#cycle-v1).

### Soaking mites in dsRNA gives a dose-response in mortality

**Status: Investigated. Our first efficacy signal, on a method we then abandoned.**

**Question.** Does our vdCHIB target increase mite mortality relative to a saline
control?

**Experiment.** Mites soaked in 0.9% NaCl containing a low or a high concentration of
our 700 bp vdCHIB dsRNA, or in saline alone, then inserted individually into capped
larval cells and incubated for 24 h.

**Controls + n.** Saline-only control n = 40; low concentration n = 70; high n = 65.
Sample sizes were not equalised, because mite survival through each soak varied.

**Result.** Mortality rose with dose: **42.5% control (17/40), 55.7% low (39/70),
72.3% high (47/65)**. Cochran–Armitage trend test, **Z = 3.08, p = 0.002** `[CALC]`.
In pairwise Fisher's exact tests with a corrected threshold of 0.0167, **only the
high-against-control comparison held up**.

**Interpretation.** There is statistically significant evidence of a dose-response,
and high concentration is confidently distinguishable from control. The difference
between high and low is consistent with the trend but **not independently confirmed**.

**Limitation.** Only about 20% of mites survived the 6 h soak, and soaked mites
sometimes reproduced in the cell, leaving unexposed offspring scored alongside the
treated mother. With three dose points, the trend test cannot tell a linear
dose-response from a threshold. **The dsRNA concentrations are not recorded as
numbers anywhere in our own record**, so the dose-response cannot yet be
reproduced.

**What it changed.** It justified abandoning the soak and delivering dsRNA through
the host instead. The next step is a repeat in early August, the more favourable
part of the mite season, with larger, equalised groups and a series of dsRNA
concentrations. See [cycle V2](/engineering#cycle-v2).

### Feeding the larval host did not kill mites, and showed why

**Status: Investigated. A clear negative, with the confound identified.**

**Question.** Does dsRNA delivered through a dosed larva kill the mite that feeds on
it, and does SEED's top-ranked target outperform its lowest-ranked one?

**Experiment.** Forty 5th-instar larvae per group, 240 in total, each fed 20 µL:
1 µg of dsRNA at 50 ng/µL, 100 ng at 5 ng/µL. Groups: BEST and WORST targets at
50 ng/µL and 5 ng/µL, plus 50 ng/µL dsGFP and 1 M sucrose as negative controls.
After 24 h, once cells were capped, one mite was introduced per cell and left to
feed for 96 h, then every cell was uncapped and its mites scored.

**Controls + n.** dsGFP at 50 ng/µL and sucrose-only, 40 larvae each. Only **14–27
mites were scored per group**.

**Result.** **No dsRNA group killed more mites than the controls.** The six groups
differed overall (chi-square, **p = 0.002**), driven almost entirely by BEST
50 ng/µL showing _lower_ mortality than dsGFP (**29% against 91%, p = 0.0002**).
BEST against WORST with doses pooled also differed (p = 0.03), in the opposite
direction to our hypothesis `[CALC]`.

**Interpretation.** The dominant predictor of mite death was **larval compromise**:
in compromised larvae, 45 of 47 recovered mites were dead (96%) regardless of
treatment, and half or more of the larvae were compromised in every group (50–70%).
Restricting to healthy larvae did not change the conclusion: BEST 50 ng/µL (0 of
10 mites dead) still differed from dsGFP (7 of 9 dead, p = 0.0007), and no other
group differed from the control. **We do not interpret the BEST 50 ng/µL result as
evidence that dsRNA protects mites**; it is most likely noise.

**Limitation.** Roughly **30–50% of cells contained no recoverable mite**, and we
cannot tell whether those mites died, escaped or were never present. Some cells held
two or three mites, so counting per mite treats related individuals as independent.

**What it changed.** Future iterations must reduce larval handling and feeding stress
and score mite mortality only in healthy larvae, before target efficacy or pipeline
ranking can be meaningfully assessed. **SEED's ranking is untested by this
experiment, not contradicted by it.** See
[cycle V4](/engineering#cycle-v4).

> **TODO —** Mite knockdown by RT-qPCR, the molecular endpoint the husbandry work
> redirected us towards. No knockdown number exists. Owner: bee lab.

## What the models predict

Modelled outputs are results, and they carry the **Modelled** label wherever they
appear — never **Demonstrated**. Detail on
[dry lab and modelling](/model) and [ecological modelling](/ecological-modelling).

Three BEEHAVE cycles have now run, and their headline outputs are:

- **Colony outcome is insensitive to starting conditions.** Across initial
  infestation levels of 0–100% and 0–100% deformed wing virus, the colony collapses
  in an average of **4 years** and honey production is affected similarly. One
  therapy can therefore address a range of starting infestations.
  [Cycle M1](/engineering#cycle-m1).
- **The efficacy target is a treatment efficiency of about 0.05**, which prevents
  collapse and holds losses to 10% of honey and 20% of bee population across the
  North Dakota, California and Australian hive profiles. Untreated, all profiles
  collapsed within 3 years with cumulative honey production falling to a third.
  **Winter treatment matches year-round treatment and beats autumn**, which is a
  regimen only a cold-tolerant in-hive product can use.
  [Cycle M2](/engineering#cycle-m2).
- **The titre the wet lab has to hit.** Replacing the single efficiency parameter
  with a mechanistic delivery chain, and crossing six dsRNA concentrations with five
  yeast amounts, gives the trade-off: above **0.01 mg dsRNA per g yeast**, the same
  collapse is prevented with a hundred times less yeast. Set against the modelled
  private benefit, **0.005 mg/g makes the therapy economically viable in the US and
  0.05 mg/g in both the US and Australia** `[CALC]`.
  [Cycle M3](/engineering#cycle-m3).

> **TODO —** Write these three into the eight-field shape with **Modelled** on each,
> and bring the plots and heat maps onto the wiki — they exist in the modelling
> write-up and not here. Owner: dry lab.

> **Every model on this wiki is literature-parameterised or provisionally
> parameterised; none yet uses a transfer probability we measured.** The five
> intermediate parameters in the M3 delivery chain were assigned plausible orders of
> magnitude precisely so they can be replaced when bench data arrive.

## What we could not establish

- **No construct is sequence-verified.** All QC to date is gel band size plus
  spectrophotometry. No sequence-level claim is made anywhere on this wiki.
- **No yeast or _E. coli_ titre exists.** µg intact dsRNA per mg dry cells is the
  single measurement the project most needs, and neither host has one.
- **No dsRNA concentration in bee material.** Detection in larvae and adults is by
  gel, and most of a larval dose is gone within 24 h by an amount we have not yet
  measured. There is **no MIQE-valid RT-qPCR standard curve** yet, and
  **spike-recovery has never been run** — the largest remaining hole in the
  measurement workstream.
- **No demonstrated mite mortality from our delivery route.** The soak assay gives a
  dose-response without recorded doses; the larval-feeding assay returned a clear
  negative confounded by host condition. **No knockdown figure exists at all.**
- **No validation of SEED's target ranking.** The best-against-worst comparison ran
  and was uninterpretable, so the ranking is untested.
- **No SYBR Gold detection limit of our own**, and no capture-format control for the
  streptavidin assay.
- **No melanin attribution.** The haemolymph absorbance traces cannot be assigned to
  melanin rather than scatter without a far-red baseline.

## Where this connects

[Engineering](/engineering) · [Measurement](/measurement) ·
[Experiments and protocols](/wet-lab-experiments) · [Bee lab](/bee-lab) ·
[Yeast](/wet-lab-experiments#yeast-production) ·
[Dry lab and modelling](/model) · [RNA design](/software) ·
[Contribution](/contribution) · [Timeline](/timeline)
