```component
nectar-pipeline
```

## What the pipeline did, and what it has not yet shown

**Status: Modelled.** Previous studies had already silenced individual _Varroa_
genes by RNAi, but there was **no standardised framework** for comparing
candidate genes, and none for choosing the region within a gene. That leaves the
two things that most affect whether a construct works, accessibility and
off-target risk, to precedent and chance. NECTAR is our answer: a reusable method
for deciding **which sequence to make**. The target changes, the method does not,
and that is what makes NECTAR a platform rather than a product.

On **7 October 2026** we froze a panel of 100 _Varroa destructor_ genes and ran
the pipeline over all of them. It scored **494,116 candidate guides**, ranked
**239,808 regions of 96 nt**, and screened **6,261,939 exact sequence matches**
against the _Varroa_ and _Apis mellifera_ reference transcriptomes `[CALC]`. The
figure above reads that run: all 100 genes, and five of them end to end.

Three results came out of it. The three layers of evidence **disagree with each
other**, at Spearman ρ between 0.10 and 0.41 across the five genes shown, which
is why the pipeline keeps them apart instead of collapsing them into one score
early. Between **0.5% and 3.5%** of windows in a gene sit on the first Pareto
front, so the set worth arguing about is small and the ranking is doing real
work. And across all five genes, **no exact match to any _Apis mellifera_
transcript exceeds 20 nt**, while matches inside _Varroa_ run to the full length
of the transcript.

What the run does not show is whether any of it is right. **No bench result has
yet tested a sequence this pipeline chose.** The efficacy screen sits at cycle V1
on [Engineering](/engineering) and has not run, so everything on this page is a
computational prediction and is labelled as one.

### What the run was

|                             |                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| Panel                       | 100 _Varroa destructor_ genes, frozen as `wiki_panel_100.tsv`, SHA-256 `1dd6cf4b…`                     |
| Pipeline                    | `nectar-clean`, commit `fc9e2dafd404`, working tree clean                                              |
| Run date                    | 7 October 2026, 13:07 UTC                                                                              |
| Folding                     | ViennaRNA 2.7.2 (RNAfold, RNAplfold), Turner 2004, 37 °C, partition function                           |
| Exact-match screen          | Bowtie 1.3.1                                                                                           |
| Homology refinement         | edlib 1.3.9                                                                                            |
| References screened         | _Varroa destructor_ `Vdes_3.0` (`GCF_002443255.2`), _Apis mellifera_ `Amel_HAv3.1` (`GCF_003254395.2`) |
| Design completed            | 100 of 100 genes                                                                                       |
| Specificity chain completed | 92 of 100 genes                                                                                        |

The eight genes whose specificity chain stopped each carry **100,000 or more
exact-match events**, up to 1,267,694 for one of them. That cap is operational,
chosen to keep the precompute tractable, and it says nothing about how specific
those genes are. Their exact-match summaries were kept; the projection and
homology steps were not run.

Every value the figure prints was produced by that run and is reproduced here
without recomputation, rescoring or normalisation. The two series drawn as
curves are rounded to three decimals, because they are plotted at about a point
per pixel; everything printed as a number is at stored precision.

## Inputs

A _Varroa destructor_ transcript set, and an ecological context: **the species
that must not be affected**. The second input is what makes the output
defensible rather than merely optimised.

The page names the genes in the demonstration panel, including the five with
published RNAi evidence, because those studies are public and each is cited on
the figure with its DOI. It does not name our own selected target.

> **TODO —** The specific target gene is not named on this wiki pending the IP
> and patent-filing position. Every page refers to "the selected _Varroa_
> target". Owner: whoever holds the IP question; the gate has to close before
> the freeze either way, because a target we cannot name is a target we cannot
> defend in person.

## Stage 1: choosing which genes to design against

The ideal target encodes a protein **the mite cannot do without**, and is highly
transcribed, which is itself a signal of importance.

|                               | High protein network connectivity                                     | Low protein network centrality                                 |
| ----------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------- |
| **High transcript abundance** | Most likely to be important to mite survival                          | Likely unimportant, unless very sensitive to partial knockdown |
| **Low transcript abundance**  | Could be a vulnerability, or could be unimportant; needs further data | Most likely unimportant                                        |

**Connectivity.** We uploaded the _Varroa destructor_ proteome to STRING, which
predicts functional associations between proteins by integrating experimental
data, curated databases, co-expression, evolutionary relationships and the
literature. STRING's combined confidence score folds the number of connections
together with the confidence in each, and we converted that score to a
percentile across all proteins.

**Abundance.** Transcriptomics came from the GEO **GSE153472** RNA-seq dataset
for _Varroa_: gene-level read counts for **10,260 genes across 12 samples**
`[LIT]`. Raw counts were normalised to library size and likewise converted to an
expression percentile.

**Joining the two.** Proteins were mapped to genes using **blastp** against the
**Vdes_3.0** GFF annotation of the _Varroa_ genome. Only transcripts with a
corresponding protein entered the ranking. The two percentiles were summed with
equal weight, giving a ranked list of targets that are both well connected and
well expressed.

**Published RNAi evidence** is kept as a separate pool rather than folded into
that ranking, because it is a different kind of claim: somebody has already
silenced the gene and watched what happened.

### How the 100 genes were drawn

The frozen panel is not the top 100 of the ranking. It samples four routes, so
that the run exercises the pipeline on genes that arrived by different kinds of
evidence:

| Route                | Genes | What it means                                                                        |
| -------------------- | ----- | ------------------------------------------------------------------------------------ |
| Protein network      | 35    | Entered on STRING functional-association rank                                        |
| Transcript abundance | 35    | Entered on expression, sampled across abundance strata rather than taken off the top |
| dsRIP transfer       | 20    | Entered on evidence that the mite's own RNAi machinery handles the transcript        |
| Published RNAi       | 10    | Entered because a published study already silenced it in _Varroa_                    |

Transcripts in the panel run from **533 to 8,798 nt**. Three genes
(LOC111250671, LOC111244613, LOC111246641) sit outside the 5,460-gene catalogue
and were designed through the pipeline's sequence route, from their exact
transcript. For every gene, **one exact transcript accession** was chosen and
used for all calculations, because a different transcript of the same gene gives
different candidates and different scores.

**The caveat on the ranking.** This choice was made without data on the effect of
_partial_ knockdown on any of these targets. A highly transcribed gene may also
be robust to partial knockdown, which would make it a worse RNAi target rather
than a better one; equally, a highly central but lowly transcribed gene could be
a real vulnerability. Absent knockdown-response data, high centrality plus high
abundance was the combination we were most confident in, and we present the
ranking as **a prior rather than a prediction** `[FLAG]`.

## Reading the mite's own small RNAs

Rather than importing size and composition rules from _Drosophila_ or
_C. elegans_, we went and looked at what _Varroa_ itself makes. The organism's
own small RNAs are the best available evidence of what its Dicer and Argonaute
actually process, and this analysis is what Layer 1 rests on.

**The dataset is public, so this is reproducible.** NCBI BioProject
**PRJNA986961**: 21 small RNA sequencing runs, SRR25010750 to SRR25010770
`[LIT]`. We audited adapter state with FastQC, found **7 of the 21 runs already
trimmed and 14 not**, trimmed those with CutAdapt, and kept reads of 15 to 35 nt.

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
abundance weighting**, which says its dominance rests on a smaller number of very
abundant species.

This is why the pipeline uses **23 and 24 nt windows** as its basic units rather
than the canonical 21 nt Dicer-2 product. What Dicer cuts and what the mite
accumulates are different questions, and for choosing a window it is the second
that matters. For each transcript, **every possible 23 and 24 nt window is
enumerated** and scored: 494,116 of them across the panel.

### Two features we tested and dropped

Both of these are negative results, and both changed the design by removing
something from it.

**Dicer-2 duplex geometry.** Dicer-2 leaves a characteristic 2 nt 3′ overhang on
each strand. If our populations carried that signature we could score for it. We
rebuilt duplexes with stepRNA and looked at the overhang distribution: the
**(+2, −2) double-overhang pattern was strongly depleted** in every population,
and 23 and 24 nt carried it at similar levels, so it cannot separate
Dicer-processed from non-Dicer-processed species either. **Dropped.**

**Transitivity.** If 24 nt species were secondary products amplified from 23 nt
primary events, they should accumulate in a consistent spatial relationship to
23 nt hotspots. Testing 100, 250 and 500 nt windows either side of hotspots
across 19 units, we found **no significant change in absolute 24 nt abundance at
any distance**, and only a small composition shift downstream, reproducible but
under two percentage points. Real, and far too small to design on. **Dropped.**

> **TODO —** Table: the overhang distribution by population and the transitivity
> test by distance, with the parameters of each explained. The working document
> carries both with a note that the parameters need writing up before
> publication, which is why only the conclusions are stated above. Owner: dry
> lab.

## Stage 2: three layers of evidence on every window

Every enumerated window is scored on three layers, and each layer is reported as
a **percentile within its own transcript**. The layers view of the figure plots
all three along the transcript, with their combination underneath.

### Layer 1, Varroa Accumulation

Does this window look like the small RNAs the mite already makes in quantity? A
window that does is one its own machinery is equipped to process. The score comes
from a regression fitted to the viral small RNA population described above,
which estimates abundance from terminal nucleotide identity and regional base
composition. The model is frozen and is fitted separately for 23 and 24 nt. Its
engineered features and their coefficients are held back; see below.

### Layer 2, Guide Competence

Which strand RISC loads is set by the relative stability of the two duplex ends,
and that is **a design lever rather than an accident**. Terminal ΔG is computed
at both the 4 bp and 5 bp ends for guide and passenger, and the difference is the
asymmetry. Guide self-folding is computed alongside it, because a guide that
pairs with itself is not available to pair with anything else. Both come from
ViennaRNA 2.7.2, and the figure prints every stored value for the windows it
ranks.

### Layer 3, Target Accessibility

Which parts of the transcript the silencing machinery can actually reach, rather
than parts buried in secondary structure. A perfectly complementary window inside
a stable stem is **not a usable window**. Accessibility is estimated with
**RNAplfold** as the probability that the site is unpaired, and estimated twice:
once for the complete target site, once for the **guide seed region g2 to g8**
within it. This is the same folding setup the construct-architecture work on
[Engineering](/engineering) uses.

### Combined Evidence, and why the layers stay apart

The three are combined as a **neutral equal-thirds mean**, with no weighting
applied. The reason for keeping them separate as long as possible is in the
stored rank correlations: across the five genes on the figure, at both guide
lengths, Layer 1 against Layer 2 runs ρ = 0.14 to 0.24, Layer 1 against Layer 3
ρ = 0.10 to 0.23, and Layer 2 against Layer 3 ρ = 0.30 to 0.41. **A window that
looks like a mite small RNA is close to uninformative about whether its target
site is open.**
Folding those three into one number early would hide exactly the disagreement
that makes a window worth arguing about.

The same disagreement shows in the Pareto fronts. In each gene, only **0.5% to
3.5%** of windows are on the first front, where no other window beats them on all
three layers at once.

Each layer on its own is a percentile, so its distribution across a transcript is
flat by construction and there is nothing to read in it. Combined Evidence is the
only one of the four with a shape, and the figure plots it.

## From windows to regions

A construct carries a region, not a single 23 nt guide, so the pipeline rolls the
window scores up into **fixed 96 nt regions**: a region's score is the mean of
the stored score of every guide of that length contained entirely within it. The
region length is not a free parameter, because the specificity screen is bound
to it.

Across the panel, the best region of a gene scores between **0.591 and 0.812** on
Combined Evidence, with a median of 0.701 `[CALC]`. The regions view of the
figure also compares what each metric would pick on its own, which is often not
the same stretch.

## Stage 3: the off-target screen

This stage can veto a region that scored well on every other axis. A region that
looks ideal inside _Varroa_ may be identical or near-identical to a transcript in
a non-target species, and **_Apis mellifera_ is the one that matters most**,
because it is the animal we are dosing.

Two reference transcriptomes are screened, and they are read for different
reasons. A match inside _Varroa destructor_ asks whether the design would hit the
mite somewhere we did not intend. A match inside _Apis mellifera_ is the safety
question.

| Level                   | How                                                                         | What it tells us                                                        |
| ----------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Exact match**         | Strict mapping of every exact match of 16 nt or more, with **Bowtie 1.3.1** | Which local stretches of the region could produce off-target small RNAs |
| **Homology refinement** | Relaxed alignment with **edlib 1.3.9**, seeded by the exact matches         | Broader homology between the whole region and a non-target transcript   |

Matches are reported in three tiers by length, 16 to 20 nt, 21 to 22 nt, and 23
nt and over, and each event is labelled by **what it hit**: a different _Varroa_
gene, another transcript of the same gene, the intended transcript itself, or a
non-target species. Those labels matter. The longest exact match for every one of
the five featured genes is the **whole transcript**, and in each case it is the
gene's own other annotated transcript rather than an off-target at all.

**The result that matters.** Across all five featured genes, the longest exact
match to any _Apis mellifera_ transcript is **17 to 20 nt**, which sits in the
lowest of the three tiers for every one of them. Each carries between 36 and 535
matches at 16 nt, as any sequence must against a transcriptome of that size, and
nothing longer.

Candidate sequences are also screened against a wider set of non-target
organisms: related arthropods, pollinators sharing the environment, and humans.
The design of this step is a documented external contribution. **Prof. Paul Lam
advised against scanning everything and in favour of a justified set of
representative species**, which is what makes the screen both defensible and
runnable. See [attributions](/attributions), and
[safety and security](/project-safety), where this step is why safety is part of
design rather than an assessment bolted on afterwards.

**What the screen can miss, in its own words.** The homology step is seeded by
exact-match evidence of 16 nt or more, so distributed approximate similarity
without such a seed may be missed. The run records that limitation itself, and
the figure prints it. A species with no reference transcriptome cannot be
screened at all, and **absence of a hit against a species we could not screen is
absence of data**, not a clear result.

> **TODO —** The mismatch, insertion and deletion fractions used in the edlib
> refinement are recorded in the pipeline only as "set fractions" and were not
> exported with the run. State them as numbers. This also closes the older
> disagreement in our records about which tool does the homology screen: the run
> environment records Bowtie 1.3.1 and edlib 1.3.9, so the RNA design outline's
> mention of BLAST is superseded and should be corrected at source. Owner: dry
> lab.

## What comes out

```component
nectar-construct
```

NECTAR stops at a ranked region. The step after it wraps that region in an
architecture the wet lab can order and assemble: the loop-ended dumbbell is our
own, and the two cassette forms are there because a reader comparing them should
be able to.

**Multigene concatenation** is part of the output rather than an abandoned idea.
The pipeline picks one favourable region per target gene, and several are
concatenated into a single construct so that one dsRNA molecule silences several
genes. Which genes, and from which candidate pool, is on [wet lab](/wet-lab).

> **TODO —** Two of our own records conflict on concatenation, and a third set of
> numbers has now joined them. An earlier calculation set the strategy aside and
> it was written up here as tested and rejected; the current wet-lab write-up
> designs two four-gene concatenated constructs at **175 bp per gene and 700 bp
> total**; the frozen pipeline run ranks regions at **96 nt**. Resolve which
> record stands, state one region length, and if concatenation is adopted,
> publish the calculation that was previously read as a rejection. The mite
> screen that decides it is already scoped: "see whether a shortened 100 bp
> fragment is comparable to the 700 bp construct". Owner: dry lab with wet lab.

## Feeding results back in

> _The algorithm made a biological design decision, we tested that decision, and
> the result improves the next design._

> **TODO —** That loop is closed on paper and open at the bench. No experimental
> result has yet been fed back into the ranking, because the test set for the
> first pipeline output was a mite screen on the unlooped construct, the
> husbandry cycle at V1 on [Engineering](/engineering) closed negative, and the
> efficacy screen has not run. This section says so until B3 returns data. A
> closed loop claimed but not closed is worse than an open one described
> honestly. Owner: dry lab.

## What we can and cannot publish

Metric names, the biology behind each one, the ranking method in Stage 1, the
small RNA analysis, the screening tools and their versions, and every data
source are public, and are on this page in full. **The engineered feature set and
fitted coefficients of the accumulation model, and the training corpus behind it,
are held back pending the IP position**, as is the target gene name.

Anything held back is marked as held back on the page where it would otherwise
appear.

> **TODO —** Agree the final disclosure line and apply it identically here, in
> the repository README and on [parts](/parts). Owner: dry lab with the IP
> holder. Three specific calls are open and this page has taken a provisional
> position on each, which the IP holder has to confirm or reverse before the
> freeze:
>
> 1. **The equal-thirds combination.** This page states that Combined Evidence
>    weights the three layers equally. Our own IP note lists weights among the
>    things not to publish. The handoff publishes the equal-thirds combination as
>    a field name, and a neutral combination is arguably not a weighting at all,
>    which is why it is stated here. Confirm or remove.
> 2. **Naming Vd-CHIBIN.** The five genes named on this page come from published
>    _Varroa_ RNAi studies and are cited to their DOIs, so naming them discloses
>    nothing the literature has not. Our own IP note separately flags that an
>    unpublished SDG draft names this target and asks for it to be checked
>    against the gate. Make one decision and apply it wherever the name appears.
> 3. **Publishing the frozen panel.** The 100-gene panel, its checksum and the
>    per-gene outputs are ready to release alongside the repository. Decide
>    whether they go out with it.

## Reproducibility

A tool nobody else can run is not a contribution. What another team needs: a
proteome, a transcript set, an RNA-seq expression table, a GFF annotation, and a
list of species to screen against. Everything in Stage 1 and in the small RNA
analysis can be **rebuilt from public data** with the accessions named on this
page, and the run shown here records its own commit, its panel checksum and its
tool versions so that it can be repeated rather than taken on trust.

> **TODO —** Record the public repository link, the commit history dates, the
> dependency list and a worked example on a non-_Varroa_ target, so the platform
> claim is demonstrable rather than asserted. The frozen panel and the per-gene
> outputs are ready to publish alongside it. Owner: dry lab.

## Still missing

- Experimental validation of a sequence the pipeline chose, and with it the
  feedback loop.
- The repository link and run instructions.
- The edlib mismatch and indel fractions, as numbers, and the BLAST mention
  corrected at source.
- Whether concatenation is adopted, and at what region length, stated once.
- The overhang and transitivity tables, with their parameters explained.
- The disclosure decision, and the IP gate on the target name and on naming
  Vd-CHIBIN.

## Where this connects

[Dry lab and modelling](/model) · [Description](/project-description) ·
[Safety and security](/project-safety) · [Parts](/parts) ·
[Wet lab](/wet-lab) · [Attributions](/attributions) ·
[Contribution](/contribution) · [Engineering](/engineering) · [Results](/results)
