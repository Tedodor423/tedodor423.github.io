```component
nectar-pipeline
```

## What the pipeline did, and what it has not yet shown

**Status: Modelled.** Previous studies had already silenced individual _Varroa_
genes by RNAi, but there was **no standardised framework** for comparing
candidate genes, and none for choosing the region within a gene. That leaves the
two things that most affect whether a construct works, accessibility and
off-target risk, to precedent and chance. **SEED**, Selective enginEEring of
dsRNA, is our answer: a reusable method for deciding **which sequence to make**,
in three stages. Which genes to design against; which region inside a gene; and
whether that region is safe against the species we are there to protect. The
target changes, the method does not, and that is what makes SEED a platform
rather than a product.

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

Four kinds of evidence go in. Connectivity and abundance are combined into one
quantitative ranking; published RNAi evidence and cross-species transferability
are kept as separate pools, because they are different kinds of claim.

**Published RNAi evidence.** We reviewed **22 primary _Varroa_ RNAi studies** and
recorded **65 gene × study observations**: **26 direct-positive**, **20
context-only**, and **19 negative, non-positive or confounded**. The 26
direct-positive observations are the literature pool. Somebody has already
silenced those genes and watched what happened, which is why they stay beside the
computed ranking rather than being folded into it.

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

**Cross-species transferability.** dsRIP ranks genes by how consistently their
orthologues have produced strong RNAi effects across insect species. The studies
behind it identified effective RNAi targets in _Tribolium castaneum_, then tested
whether the corresponding orthologues stayed effective when dsRNA was delivered
orally in other beetles. We took the number of successful cross-species transfers
as a measure of how robust a target is likely to be in _Varroa_ as well.

### How the 100 genes were drawn

The frozen panel is not the top 100 of the ranking. It samples four routes, so
that the run exercises the pipeline on genes that arrived by different kinds of
evidence:

| Route                | Genes | What it means                                                                        |
| -------------------- | ----- | ------------------------------------------------------------------------------------ |
| Protein network      | 35    | Entered on STRING functional-association rank                                        |
| Transcript abundance | 35    | Entered on expression, sampled across abundance strata rather than taken off the top |
| dsRIP transfer       | 20    | Entered on the number of successful cross-species RNAi transfers recorded in dsRIP    |
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
Host filtering was deliberately left out, because sequences this short are shared
between _Varroa_ and _Apis_ anyway.

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

Both lengths sit overwhelmingly on the antisense strand. The sample-balanced
median antisense fraction is **0.957 for 23 nt and 0.997 for 24 nt** by abundance
weighting, and 0.877 and 0.978 by unique-sequence weighting, with the 24 nt
population the more strongly biased of the two. The antisense strand is the one
that carries target complementarity, so it is the population the rest of the
analysis is built on.

This is why the pipeline uses **23 and 24 nt windows** as its basic units rather
than the canonical 21 nt Dicer-2 product. What Dicer cuts and what the mite
accumulates are different questions, and for choosing a window it is the second
that matters.

### Two features we tested and dropped

Both of these are negative results, and both changed the design by removing
something from it.

**Dicer-2 duplex geometry.** Dicer-2 leaves a characteristic 2 nt 3′ overhang on
each strand. If our populations carried that signature we could score for it. We
rebuilt duplexes with stepRNA, pairing each 23 or 24 nt sequence against every
distinct 15 to 30 nt sequence on the opposite strand of the same unit, and looked
at the overhang distribution. The **(+2, −2) double-overhang pattern was strongly
depleted** in every population, at 0.48% to 1.68% pooled; the blunt (0, 0)
geometry was instead the commonest joint geometry, in 41 of 54 units for the 23 nt
antisense population. 23 and 24 nt carried the Dicer pattern at similar levels, so
it cannot separate Dicer-processed from non-Dicer-processed species either.
**Dropped** — and that is why Layer 2 models a blunt, perfectly paired duplex.
Sampling and sequencing bias could in principle deplete the pattern on their own,
which we cannot rule out from this dataset.

**Transitivity.** If 24 nt species were secondary products amplified from 23 nt
primary events, they should accumulate in a consistent spatial relationship to
23 nt hotspots. We took the 19 positive-sense-virus units, defined 23 nt hotspots
two ways — one requiring both strands to be strong, one on total 23 nt signal —
and looked 100, 250 and 500 nt either side of each. There was **no significant
change in absolute 24 nt abundance at any distance**, and nothing at all at
100 nt. What we did find was a composition shift downstream, **+0.2 to +1.6
percentage points more 24 nt-rich** at 250 and 500 nt, reproducible across all
four weighting and hotspot combinations. Real, and far too small to design on.
**Dropped.**

> **TODO —** Table: the overhang distribution by population, and the transitivity
> test by distance, with the hotspot and window parameters of each stated. Only
> the conclusions and the headline numbers are published above because the
> parameters have not been written up. Owner: dry lab.

## Stage 2: three layers of evidence on every window

Every possible 23 and 24 nt window on the sense strand is enumerated by sliding
one nucleotide at a time: **494,116 of them across the panel**. Each window is a
candidate guide, and each is scored on three layers. Five raw metrics underlie
the three, on five different scales, so every one of them is converted to a
**percentile within its own transcript** before anything is combined. The layers
view of the figure plots all three along the transcript, with their combination
underneath.

### Layer 1, Varroa Accumulation

Does this window look like the small RNAs the mite already makes in quantity? A
window that does is one its own machinery is equipped to process. The score is an
**sRNA accumulation propensity**, from a model fitted to the viral small RNA
population described above.

The sequence features it uses were found by comparing two populations within the
same infection: the 23 or 24 nt antisense reads actually recovered, and every
window of that length the sample's own viral consensus could have produced. The
ratio of observed to expected is an enrichment, so a nucleotide preference cannot
simply be the base composition of that virus showing through. The features that
survived describe terminal nucleotide identity and regional base composition.

The model is a linear fit on those features, with log abundance as the response
and a per-sample-virus baseline that absorbs differences in sequencing depth while
the coefficients are fitted and is dropped when a candidate is scored. It is
fitted separately for 23 and 24 nt, because those are different populations, and
it is frozen. Its engineered feature set and fitted coefficients are held back;
see below.

### Layer 2, Guide Competence

Which strand RISC loads is set by the relative stability of the two duplex ends,
and that is **a design lever rather than an accident**. Each candidate is built
into a perfectly complementary duplex with **no 3′ overhang imposed**, because our
own duplex-geometry result gives no Dicer-2 signature to justify one. Terminal ΔG
is computed over the first **4 base pairs of each 5′ end** with the
nearest-neighbour parameters of Zuber et al. 2022, and the asymmetry is the guide
end minus the passenger end: a positive value means the antisense 5′ end is the
less stable one, which is the strand we want loaded. The 5 bp difference is stored
alongside it. Guide self-folding is the RNAfold minimum free energy of the guide
on its own, where a weaker fold is better, because a guide that pairs with itself
is not available to pair with anything else. Both come from ViennaRNA 2.7.2, and
the figure prints every stored value for the windows it ranks.

### Layer 3, Target Accessibility

Which parts of the transcript the silencing machinery can actually reach, rather
than parts buried in secondary structure. A perfectly complementary window inside
a stable stem is **not a usable window**. Accessibility is estimated with
**RNAplfold** as the probability that the site is unpaired, in local windows of
150 nt with base pairs spanning at most 100 nt, and estimated twice: once for the
complete target site, once for the **guide seed region g2 to g8** within it. The
maximum unpaired interval is 24 nt, which covers the 23 nt population in the same
pass. These are sense-strand coordinates, because the target mRNA runs in the same
orientation as the gene's sense strand. This is the same folding setup the
construct-architecture work on [Engineering](/engineering) uses.

### Combined Evidence, and why the layers stay apart

Layer 1 is the accumulation percentile directly. Layers 2 and 3 each carry two
metrics: the two percentiles are averaged so that neither dominates, and the
average is ranked again across the transcript to give the layer. Combined Evidence
is then the **equal-thirds mean** of the three layers, with no weighting applied.
The weights are neutral by choice rather than by fitting: no _Varroa_ RNAi
efficacy data were available to fit them to, and a coefficient fitted to nothing
would be worse than an honest third.

The reason for keeping the layers separate as long as possible is in the stored
rank correlations: across the five genes on the figure, at both guide lengths,
Layer 1 against Layer 2 runs ρ = 0.14 to 0.24, Layer 1 against Layer 3
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
window scores up: a region's score is the mean of the stored score of every guide
of that length contained entirely within it, with the 23 and 24 nt populations
kept apart. **Region length is a parameter**, and the off-target screen scales
with it, so the two are set together. The frozen run ranks **96 nt** regions; the
multigene constructs use **175 bp** per gene.

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

Exact matches are sorted into three tiers by length, and the tier is what decides
the region's fate: **16 to 20 nt** is caution and is recorded rather than acted
on, since matches that short are unavoidable against a whole transcriptome; **21
to 22 nt** and **23 nt and over** are high and very high risk, and our opt-out
cutoff is set at **21 nt**. Each event is also labelled by **what it hit**: a
different _Varroa_ gene, another transcript of the same gene, the intended
transcript itself, or a non-target species. Those labels matter. The longest exact
match for every one of the five featured genes is the **whole transcript**, and in
each case it is the gene's own other annotated transcript rather than an
off-target at all.

> **TODO —** The literature behind the three risk tiers and behind the 21 nt
> opt-out cutoff is not recorded in our own write-up. Cite it, or state the cutoff
> as our own judgement. Owner: dry lab.

The homology level asks the other question: whether a region with no alarming
short match is nonetheless broadly similar to a non-target transcript. edlib is
run in query-global, subject-local mode with a maximum edit-distance fraction of
**0.15**, so a region of length N tolerates at most 0.15N mismatches, insertions
and deletions combined. It reports alignment identity, query coverage,
whole-region identity, the mismatch, insertion and deletion counts, and the
longest exact stretch inside the alignment, and those are reviewed by hand.

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

## What comes out

```component
nectar-construct
```

SEED stops at a ranked region. The step after it wraps that region in an
architecture the wet lab can order and assemble: the loop-ended dumbbell is the
form we build, and the two cassette forms are there because a reader comparing
them should be able to.

**Multigene concatenation is part of the output.** Targeting several genes at once
is how we raise the chance of killing the mite, and single-target resistance is one
of the bottlenecks SEED was built against, so the pipeline picks one favourable
region per target gene and several regions are concatenated into one molecule. Two
four-gene constructs were designed, one from each of two candidate pools, at
**175 bp per region and 700 bp in total**. The architecture and the bulge geometry
are at [cycle 1.2](/engineering#cycle-1-2).

The two pools are a comparison: literature-proven targets against targets our own
analysis chose. The **literature pool** narrowed 65 gene × study observations to
the 26 direct-positive ones, then to the 6 that resolve confidently to current
_Varroa_ gene identities, and kept 5 on strength of RNAi evidence and functional
diversity. The **exploratory pool** narrowed the **5,408 genes** of the combined
ranking to the **299** in the top 5% of the network percentile, grouped those by
cellular system — energy metabolism, proteostasis, DNA replication and cell cycle,
transcription and chromatin, signalling, membrane and ion homeostasis, translation,
trafficking — to 26 representatives, and reviewed them against the literature to
reach 5. Four genes from each pool went into a construct; they are not named here,
for the same reason the single target is not.

Both constructs have been designed and produced. Neither has been screened against
a single-gene construct, so the gain from concatenating is **Proposed** and not
demonstrated.

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
fitted coefficients of the accumulation-propensity model, and the training corpus
behind it, are held back pending the IP position**, as is the target gene name.

Anything held back is marked as held back on the page where it would otherwise
appear.

> **TODO —** Agree the final disclosure line and apply it identically here, in
> the repository README and on [parts](/results#parts). Owner: dry lab with the IP
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
tool versions so that it can be repeated rather than taken on trust. The analysis
scripts sit behind an interactive interface, so the three stages run as one
pipeline from gene selection through region design to the off-target screen.

> **TODO —** Record the public repository link, the commit history dates, the
> dependency list and a worked example on a non-_Varroa_ target, so the platform
> claim is demonstrable rather than asserted. The frozen panel and the per-gene
> outputs are ready to publish alongside it. Owner: dry lab.

## Where this connects

[Dry lab and modelling](/model) · [Description](/project-description) ·
[Safety and security](/project-safety) · [Parts](/results#parts) ·
[Experiments and protocols](/wet-lab-experiments) · [Attributions](/attributions) ·
[Contribution](/contribution) · [Engineering](/engineering) · [Results](/results)
