## Block 1: Deliver known desirable dose to Adult bees for feeding assays

### Aim

To test NECTAR’s RNA design pipeline we needed to use a fast and reliable method for dsRNA production. To do this we used Vazyme’s In vitro transcription kit. For dual promoter dsRNA T7 promoters were added to the sense and antisense strand, and to avoid a non-functional T7 flap two separate PCR reactions were run, providing two separate IVT templates that are annealed after the IVT reaction. For loop-ended dsRNA constructs, we designed parts to include T7, so preparation for IVT required only a colony lysis PCR/PCR of the miniprep product that amplified between the gibson homology arms on the plasmid. To determine the concentration of dsRNA post-annealing we used a qubit assay to measure the concentration of dsRNA after a DNAse I and RNase T1 cleanup.

### Experiments

#### dsRNA synthesis and annealing

> **TODO —** Figure: Gels showing agarose gels w dsRNA (300, 500, 700) + annotation.
> Owner: wet lab.

##### Colony lysis and colony PCR

Adapted from a CASPR protocol. General rules: add reagents to a chilled 200 µL
PCR tube, **largest volume first**, so smaller volumes can be pipetted under the
meniscus; mix by gentle vortexing or pipetting; add the sample last, then tap and
spin down.

1. Pick a single colony with a toothpick or pipette tip and swirl it in a small
   volume of sterile water. **Keep the colony water**, it is needed later.
2. Boil the sample at 95 °C or above for 5 min in a heating block.
3. Centrifuge at 13,200 rpm for 2 min.
4. Label four PCR tubes, two per forward strand and two per reverse. To each add
   2 µL forward primer, 2 µL reverse primer, 20 µL MQ water, 25 µL Phanta master
   mix and 1 µL of the colony-lysis supernatant. If DNA yield is low, use 2 µL of
   supernatant and 19 µL of water.
5. Tap to mix and spin down.
6. Run the PCR, roughly 40 min to 1 h 30, with temperatures set from the primers.
   Set the annealing temperature 6 °C above the lowest oligo annealing
   temperature.
7. Run 5 µL of each reaction on a 1% agarose gel to check the PCR worked.
8. Combine the forward tubes (F1 + F2) and the reverse tubes (R1 + R2).

**Primer checklist before ordering anything.** Confirm promoter orientation, that
the T7 promoter is followed by **GGG and not a single G**, and that adaptor parity
holds across every member of a construct series. Each line of that checklist
exists because of a documented failure; see
[cycle 2.1](/engineering#cycle-2-1).

##### DNA purification

1. Make the PCR reaction up to 100 µL with nuclease-free water.
2. Add 5 volumes (500 µL) of GDP buffer.
3. Transfer to a filtration column and centrifuge at 12,000 rpm for 60 s. Discard
   the filtrate.
4. Add 700 µL GW buffer, washing down the column walls as you pipette.
   Centrifuge at 12,000 rpm for 60 s. Discard the filtrate.
5. Repeat step 4.
6. Dry-spin for 2 min at maximum speed. Leave the lid open until any residual
   ethanol has evaporated: carryover poisons downstream PCR and wrecks A260/230.
7. Transfer the column to a fresh tube, add 30 µL nuclease-free water and let it
   stand for 2 min.
8. Centrifuge for 1 min at 12,000 rpm and keep the eluate.

##### In vitro transcription

1. Prepare one PCR tube per strand. To each add 2 µL 10× reaction buffer and
   8 µL rNTP mix (ATP, GTP, UTP, CTP).
2. Mix gently and incubate at 37 °C. **2 h is insufficient; overnight incubation
   roughly doubles yield.**
3. Add 1 µL DNase and incubate at 37 °C for 15 min to remove the DNA template.
4. Purify the RNA. Magnetic-bead purification gave 2,500–3,500 ng/µL per strand.

> **TODO —** The reaction table above is incomplete as recorded: template mass,
> T7 polymerase volume and final reaction volume are missing, and the protocol
> cannot be repeated without them. Owner: wet lab.

##### dsRNA annealing

1. Mix the complementary strands in equimolar ratios in a PCR tube.
2. Make up to the desired concentration with RNase-free water.
3. **Add salt.** Without counter-ions the phosphate backbones repel and nothing
   anneals. We use an EDTA / NaCl / Tris pH 7.5 mix as a 20× stock, added at
   (predicted concentration ÷ 20 × 1.1).
4. Run the annealing ramp on a thermocycler.

Check on a gel: single-stranded RNA runs streaky, correctly annealed dsRNA runs
as a thick discrete band, and a band at twice the expected size means
dimerisation. Mango-bearing constructs need a **1% formaldehyde gel**, because the
aptamer has to be denatured before the RNA migrates at true size.

> **TODO —** The annealing ramp itself (temperatures, hold times, ramp rate) is
> blank in the record. Owner: wet lab. Without it steps 1 to 3 are not a protocol.

> **TODO —** PDF: Full protocol for dsRNA synthesis and annealing, uploaded to
> `static.igem.wiki` and linked here. Owner: wet lab.

#### Quantifying dsRNA with qubit assay

> **TODO —** Results/qubit assay description, qubit assay results. Owner: wet
> lab.

##### Nuclease digest before quantification

The protocol that turns an A260 reading into a duplex-specific mass, and the
NanoDrop-to-Qubit correction note that goes with it, are described on
[measurement](/measurement); the short version is DNase I to remove template,
RNase T1 (not RNase A, at normal ionic strength) to remove single-stranded RNA,
then re-read on Qubit.

> **TODO —** Write this up as a standalone, downloadable protocol with its
> spreadsheet. It is the Measurement deliverable and currently exists only as
> prose. Owner: measurement.

> **TODO —** PDF: Full protocol for quantifying dsRNA with the qubit assay, uploaded
> to `static.igem.wiki` and linked here. Owner: wet lab.

#### Preparing bee-lab ready doses

> **TODO —** Combine with ‘quantifying dsRNA with qubit assay’ if relevant.
> Owner: wet lab.

> **TODO —** PDF: Full protocol for preparing bee-lab ready doses, uploaded to
> `static.igem.wiki` and linked here. Owner: wet lab.

### Discussion

> **TODO —** Discuss the results, and the next steps. Owner: wet lab.

## Block 2: Loop ended dsRNA production in yeast/E.coli - Cloning

### Aim

Establishing a dsRNA expression titre for yeast and e.coli, making a pollen patty and investigating the stability of loop-ended dsRNA required assembly of the loop-ended dsRNA construct and transformation of e.coli and yeast. We used a plasmid that had both yeast (WHAT STRAINS) and e.coli (WHAT STRAINS) compatible origins of replication (WHAT PLASMID).

### Experiments

#### dsRNA expression titre in yeast and e.coli

> **TODO —** Brief protocol summary for culturing yeast and measuring dsRNA
> titre, then results. Owner: wet lab.

> **TODO —** PDF: Full protocol for the dsRNA expression titre in yeast and e.coli,
> uploaded to `static.igem.wiki` and linked here. Owner: wet lab.

#### dsRNA stability in pollen patty vs sucrose solution

> **TODO —** Brief protocol for culturing yeast, brief protocol for making the
> pollen patty, brief protocol for assaying sucrose stability, then results.
> Owner: wet lab.

> **TODO —** PDF: Full protocol for dsRNA stability in pollen patty vs sucrose
> solution, uploaded to `static.igem.wiki` and linked here. Owner: wet lab.

#### Stability of different loop structures

> **TODO —** Protocol, then assay results. Owner: wet lab.

> **TODO —** PDF: Full protocol for the stability of different loop structures,
> uploaded to `static.igem.wiki` and linked here. Owner: wet lab.

### Discussion

> **TODO —** Wait for results. Owner: wet lab.

## Block 3: RNA measurements in adult hemolymph with qPCR

### Aim

> **TODO —** Discuss adult feeding experiment (brief outline of what we trying
> to understand). Owner: Lisa, Michael, Aria.

### Experiments

#### One step qPCR

> **TODO —** Standard curve protocol, then results. Owner: Lisa, Michael, Aria.

##### Reverse transcription

1. Add 5 µL Vazyme 4× All-in-One Ultra qRT SuperMix to a PCR tube.
2. Add the template RNA and make up to 20 µL with RNase-free water.
3. Mix gently by pipetting.
4. Run: 50 °C for 10 min, then 85 °C for 5 s, then hold at 4–16 °C.

Flash-denature duplex RNA before reverse transcription (95 °C for 3.5 min, then
straight onto ice). Skipping this is **the main cause of false negatives** on dsRNA.

##### qPCR

1. Store the Vazyme 2× Taq Pro Universal SYBR qPCR master mix at 2–8 °C, away
   from light.
2. Per 20 µL reaction, in a tube or plate well, in technical triplicate:
   - 10 µL master mix
   - 0.4 µL of each primer at 10 µM
   - template cDNA: 2 µL for relative qPCR; for absolute qPCR on haemolymph, use
     the standard curve below
   - ddH₂O to 20 µL
3. Run housekeeping-gene primers in parallel on the same samples for relative
   qPCR.
4. Cycle: 95 °C for 30 s once; then 40 cycles of 95 °C for 10 s and ~60 °C for
   30 s; then a melt step at the machine's default settings.

**Standard curve for absolute quantification in haemolymph.** Spike haemolymph
with a known RNA concentration, serially dilute 1:10, reverse-transcribe each
dilution by the protocol above, and run every point in triplicate.

**Two constraints specific to dsRNA work.** Primers must sit **outside** the
dsRNA fragment, because residual input dsRNA carries into the RNA prep and, in a
dose-response, the carryover scales with dose and mimics the opposite of
knockdown. And our dumbbell cannot be denatured by heat-then-dilute, because the
arms are covalently tethered and re-annealing is intramolecular.

> **TODO —** This protocol does not yet meet MIQE reporting minimums: no
> validated efficiency, slope, R², LOD or dynamic range has been recorded. The
> standard curve that fixes it is specified on [measurement](/measurement).
> Owner: wet lab.

##### Contaminated negative controls in qPCR

Reusable independently of what you are building. Our run **took two weeks**
(29 July to 11 August); the route below is what we would do again in two days.

1. **Separate the two hypotheses before repeating anything.** Primer-dimer and
   template contamination both give a band in a water control, so repeating the
   reaction cannot distinguish them.
2. **Design the discriminating reaction.** Pick two primers from different pairs
   that flank a longer amplicon. Dimer predicts the short product; contaminating
   template predicts the long one. Ours gave 200 bp, which ruled out dimer.
3. **Test whether it is one bad pair.** Run several further pairs in water with
   no template. If all amplify, the problem is a shared reagent.
4. **Resolve the shared reagent factorially, not serially.** We ran a 2×2×2
   matrix of polymerase (Phanta / Q5) × water (old / new) × primers (old / new)
   in one plate. Only Phanta with new primers and new water was clean.
5. **Replace and re-baseline.** Primers reordered, water replaced, Tris identified
   as the probable original source, and every earlier result reported with the
   caveat attached.

**Standing acceptance rule.** If the negative-control Ct differs from the sample
by more than 4–5 cycles (5 Ct is about 32-fold in template) the run may stand
with the caveat recorded; below that, the run is discarded.

> **TODO —** PDF: Full protocol for one step qPCR, uploaded to `static.igem.wiki`
> and linked here. Owner: wet lab.

### Discussion

> **TODO —** Discuss the results, and the next steps. Owner: Lisa, Michael,
> Aria.

## Block 4: RNA measurements in larvae

### Aim

> **TODO —** Discuss larval feeding experiments (brief outline of what we trying
> to understand). Owner: wet lab.

### Experiments

#### RNA extractions

> **TODO —** Discuss column vs phenol-chloroform briefly + show results. Owner:
> wet lab.

##### Larval RNA extraction

1. Place Eppendorf tubes containing larvae on dry ice.
2. Dip the tube and a metal rod in liquid nitrogen.
3. Crush the larvae to a liquid, flash-freeze and crush again, repeatedly, until
   the homogenate is smooth. Each larva gives roughly 100 µL.
4. Split 60 µL into a 1.5 mL Eppendorf and add 1 mL TRIzol or Vezol reagent.
5. Add 200 µL ice-cold chloroform and shake vigorously for ~15 s until no clumps
   remain and the mixture turns murky.
6. Centrifuge at 12,000 rpm for 15 min at 4 °C.
7. Transfer ~500 µL of the aqueous phase to a fresh tube and add 100 µL less
   isopropanol than supernatant to precipitate the RNA.
8. Stand at room temperature for 10 min, then centrifuge at 12,000 rpm for 15 min
   at 4 °C. A pellet or white smear should be visible.
9. Remove the isopropanol without disturbing the pellet.
10. Wash the pellet with 1 mL 70% ethanol.
11. Centrifuge at 9,500 rpm for 5 min at 4 °C.
12. Discard the alcohol and air-dry the pellet for 5–10 min.
13. Resuspend in 30 µL RNase-free water.
14. NanoDrop to check concentration and the 260/280 and 260/230 ratios.

**Which method to use.** We compared this phenol-chloroform route against the
silica-bead **Vazyme** kit on pooled larval homogenate. Five larvae were
flash-frozen in liquid nitrogen, crushed with a metal rod to a smooth homogenate at
roughly 100 µL each, pooled, mixed and split into eight Eppendorf tubes at about
60 µL per tube, so biological variation is removed and what is left is method
variation. Concentration, A260/280 and A260/230 were read on the NanoDrop, and the
mean, SD and coefficient of variation compared. Phenol-chloroform gave the higher
yield and the worse reproducibility; **the Vazyme kit had the lower coefficient of
variation, so we chose it despite the lower yield**, because qPCR is the downstream
application and reliability matters more than mass.

| Method            | Mean concentration (ng/µL) | SD (ng/µL) | CV (%)    |
| ----------------- | -------------------------- | ---------- | --------- |
| Phenol-chloroform | 1255.15                    | 344.04     | **27.41** |
| Silica beads      | 261.33                     | 48.24      | **18.46** |

A separate five-method comparison on 29 July found **no yield difference** between
any of them, which is a useful null and is written up at cycle 3.1 on
[Engineering](/engineering).

> **TODO —** "Lisa to writeup." The extraction comparison is owed a full write-up by
> its author: the Test and Learn beats are marked "Lisa can you fill in" in the
> write-up, and the reagent list above stops after the chloroform step. Owner: Lisa,
> wet lab.

> **TODO —** PDF: Full protocol for the RNA extractions, uploaded to
> `static.igem.wiki` and linked here. Owner: wet lab.

#### qPCR

> **TODO —** Standard curve + discuss protocol, then results. Owner: wet lab.

The reverse transcription and qPCR protocols are under
[one step qPCR](#one-step-qpcr) in block 3.

> **TODO —** PDF: Full protocol for qPCR in larvae, uploaded to `static.igem.wiki`
> and linked here. Owner: wet lab.

### Discussion

> **TODO —** Discuss the results, and the next steps. Owner: wet lab.

## Block 5: Mango validation

### Aim

> **TODO —** Outline why mango, difficulties, how we overcome them (also
> include brief description of what mango is). Outline why three iterations.
> Owner: measurement.

### Experiments

#### Iteration 1: Plate reader

> **TODO —** Brief protocol, then results. Owner: measurement.

Written up so far on
[measurement](/measurement#plate-reader-performance-four-runs-all-four-reported).

> **TODO —** PDF: Full protocol for Mango on the plate reader, uploaded to
> `static.igem.wiki` and linked here. Owner: measurement.

#### Iteration 2: Gel electrophoresis

> **TODO —** Brief protocol, then results. Owner: measurement.

Written up so far on [measurement](/measurement#in-gel-performance).

> **TODO —** PDF: Full protocol for Mango in a gel, uploaded to `static.igem.wiki`
> and linked here. Owner: measurement.

#### Iteration 3: Streptavidin fixation

> **TODO —** Brief protocol, then results. Owner: measurement.

Written up so far on
[measurement](/measurement#what-remains-feasible-by-21-october).

> **TODO —** PDF: Full protocol for Mango with streptavidin fixation, uploaded to
> `static.igem.wiki` and linked here. Owner: measurement.

### Discussion

> **TODO —** Discuss the results, and the next steps. Owner: measurement.

## Protocols still owed

> **TODO —** Production and cloning: PCR to add T7 and adaptors, RNA purification,
> making bee-lab-ready solutions, Gibson assembly, _E. coli_ transformation,
> miniprep, and the combined IVT + annealing + QC protocol as a single document.
> Owner: wet lab.

> **TODO —** Microbial production: yeast transformation and titre approximation,
> BL21 transformation with rifampicin incubation and dsRNA titre, and the yeast
> SOP written from scratch. The Renaissance patent compliance note on
> [yeast](/wet-lab-experiments#yeast-production) goes into the strain documentation at the same time. Owner: wet
> lab.

> **TODO —** Measurement: one-step RT-qPCR on raw haemolymph including the
> dilution series, mite RNA extraction, larval haemolymph extraction, haemolymph
> matrix characterisation (absorbance spectra and melanisation, which is why we
> ordered PTU), Mango optimisation (buffer, concentrations, Kd, TO1 and TO3
> biotin), the two SYBR Gold gel protocols, and the MS2 work once it happens.
> Owner: measurement.

> **TODO —** Toehold: no bench protocol is owed, because the approach was modelled
> and rejected. The modelling method belongs on [dry lab and modelling](/model)
> instead. Owner: dry lab.

## Yeast production

> **Status: Proposed.** The cassette is designed; **no yeast has been
> transformed** and no yeast-produced dsRNA exists. Everything in this section
> is a design argument and a plan.

### Why yeast

**1 · The molecule survives.** This is the strongest of the five arguments.
Full-length hairpin RNA accumulates predominantly **intact** in
_S. cerevisiae_ (~2 ng per µg total yeast RNA), is degraded in _E. coli_ HT115,
and is processed in _N. benthamiana_ (Zhong et al. 2019, _Genes_ 10:458)
`[LIT]`. Yeast has no Dicer, so nothing in the cell recognises and cleaves the
loop that the [construct design](/parts) exists to build. **The chassis is chosen for the
absence of a machine, not the presence of one.**

**2 · Fermentation at scale is a solved problem.** Industrial yeast
fermentation, drying and formulation are mature and cheap, which is not true of
any other route we compared.

**3 · The cell is the formulation.** Heat-inactivated engineered yeast retains
full larvicidal RNAi activity (85–88% against 95–97% live, no significant
difference) `[LIT]`, so the whole cell can go into a pollen patty with **no RNA
extraction or purification step**. The most expensive downstream step is removed
rather than optimised.

**4 · Regulation.** A non-living product sits in a materially different
regulatory position from a live engineered organism released into a hive. There
is also an existing precedent to point at: inactivated _S. cerevisiae_ cell walls
(strain **LAS117**, marketed as Romeo®) are already an approved EU
crop-protection active substance `[LIT]`, which means field-scale toxicology,
shelf-stability and sprayability data exist for a carrier of this class.

**5 · Bees already eat it.** Yeast is a normal component of honeybee nutritional
supplements, and Prof. Geraldine Wright, who has engineered yeast to supply
sterols to honeybees, made the point that matters most for efficacy: a brood-food
supplement **reaches the larval stage**, which is where the mite does its damage.

The regulatory argument did not come from us. It came from the stakeholder work
on [human practices](/human-practices), and it **overrode a stated preference** from
two of the beekeepers we spoke to. That is the clearest case of integrated human
practices in this project.

Engineered inactivated yeast as an oral dsRNA delivery vehicle against _Varroa_
is **not novel**. It is anticipated by US 11,252,965 B2 (priority 2016, in force
to 2037) and adjacent to US 9,540,642 B2. NECTAR's novel core is the RNA design
method on [RNA design](/software) and the instrumented loop.

### Design requirements

High biomass; sufficient intact dsRNA
per gram of dry cell mass; genetic stability through an industrial number of
generations; tolerable metabolic burden; induction that scales on existing
fermentation infrastructure; and survival of drying and processing.

The second of those is the one that connects to money.
[Economic modelling](/economic-modelling) turns an affordable price per hive into
a **required µg of intact dsRNA per mg of dry yeast**, which makes it a
specification rather than an aspiration.

> **TODO —** µg intact dsRNA per mg dry yeast is **unmeasured**, and every
> economic and application claim on this wiki depends on it. Protocol, designed as
> spike-recovery: a known mass of IVT dsRNA into yeast lysate, full extraction,
> digest-Qubit ([measurement](/measurement)), giving a loss factor, then the same
> extraction on transformed yeast. Pre-registered rule: if the titre reaches the
> threshold from the scale-up model, the whole-cell formulation stands and we
> report the number; if it falls short we report it as the constraint it is.
> Owner: wet lab. Blocked on transformation.

### Our construct

```
[Pol II promoter] -> HH ribozyme -> ledRNA -> HDV ribozyme -> terminator
```

with GAL1 inducible and TDH3/TEF1 constitutive variants. The MCP adaptor protein
is purified separately from _E. coli_ and added _in vitro_, not co-expressed.

**Pol II, not Pol III, and the reason is mechanical.** Pol III would be the
obvious choice for a short structured non-coding RNA, and it is ruled out by our
own molecule. Yeast Pol III terminates on runs of thymidine, with five the
shortest functional signal and 5–9 dT the normal range `[LIT]`. An inverted
repeat turns every A-run in the sense strand into a T-run in the antisense, so a
Pol III transcript of a dumbbell would **terminate internally, repeatedly, by
construction**. Length is the second problem: the largest well-characterised
natural yeast Pol III transcript is SCR1 at ~519 nt `[LIT]`, against our
~1,300 nt target.

**Ribozymes, to get defined ends.** A Pol II transcript arrives capped and
polyadenylated, which this molecule must not be. A 5′ hammerhead and a 3′ HDV
ribozyme let it self-cleave to defined ends _in vivo_ `[LIT]`.

**A caveat: the ribozymes may be unnecessary.** Two
published yeast RNAi-pesticide papers used bare Pol II and worked (Murphy et al.
2016, TEF1; Hapairai et al. 2017, GAL1 with a CYC1 terminator) `[LIT]`. This is a
testable design question, not a settled one, and the ± ribozyme comparison is the
first experiment to run once transformation works.

### Copy number and selection

**Copy number: test both.** The _leu2-d_ allele on a 2µ backbone forces very high
plasmid copy number under leucine starvation `[LIT]`. Multi-copy integration at δ
(Ty LTR) or rDNA sites gives 3–5 stable copies that persist over 50 generations
without selection `[LIT]`. For a product where every cell in a 100 m³ fermenter
must still carry the cassette after ~25 generations, **stability may beat copy
number**, and the two strategies are worth building in parallel.

**Auxotrophic complementation, never antibiotics.** Antibiotic selection is a
non-starter next to a food chain, and EFSA's position on antibiotic-resistance
markers gives the regulatory reason to design them out `[LIT]`. Auxotrophy is not
free either, since the markers themselves perturb growth `[LIT]`; δ-integration
is the route out of both. We chose a leucine dropout because leu⁻ plates are the
cheapest defined medium available to us.

**No RNA-degradation knockouts.** Do **not** delete or downregulate RRP6,
SKI2/3/7/8, XRN1, LRP1, MAK3/10/31, MPP6, NMD2, TRF5, UPF3, TAF1, CCR4 or THP1 in
any NECTAR production strain. Each of those modifications walks into granted
claims held by Renaissance BioScience (CN 112384610 B, AU 2019264879 B2).
Improving dsRNA accumulation by removing RNA-degradation machinery is the obvious
engineering move, and it is exactly the space that is already taken. Design around
it, or license.

### Engineering

The cassette design, the Pol III rejection, the copy-number decision and the
marker decision are written to the seven-beat cycle shape at cycle 2.4 on
[Engineering](/engineering), with the _E. coli_ comparison at 2.3 and the
four-route chassis comparison at 2.1.

### Results

**No yeast has been transformed. No yeast-produced dsRNA exists. No yeast titre
has been measured.** As of 20 September the yeast plasmid has been linearised and
DpnI-treated; purification is outstanding. Because no yeast material exists, all
dsRNA used for bee-lab validation is IVT-derived, which is what makes the
quantification work on [measurement](/measurement) **load-bearing for the whole
project**.

### From culture to product

Three steps: **harvested, inactivated, formulated**. Inactivation is the step
that carries the regulatory argument: the product that leaves the fermenter is
not alive, does not replicate, and is not released as an organism.

**Formulated as what: the pollen patty.** Sugars, protein supplements such as
yeasts, and binding agents, administered as a slab on top of the hive that worker and
nurse bees feed on. Choosing yeast as the chassis means **the chassis and the
delivery vehicle are the same object**, and the argument for that came from
literature review plus discussion with **Prof. Geraldine Wright**, who has
engineered yeast to deliver vital sterols in a pollen patty. Four advantages, in
her and our terms:

- Engineered yeast can be **heat-inactivated** and put into a supplement bees
  readily feed on.
- Yeast can be **significantly enriched in the patty without affecting
  palatability**, which raises the dose administered.
- **Heat-inactivated yeast is not considered a GMO** `[FLAG]`.
- dsRNA fed to nurse bees, in sucrose, is **transferred to the mite via the
  glandular secretions of nurse bees**, which is what the mite feeds on `[FLAG]`.

The problem this addresses is a delivery problem. A key limitation of current
_Varroa_ dsRNA therapeutics is that they deliver in a sucrose solution, **in which
dsRNA has a very short half-life**. The cycle-by-cycle version is at
[cycle 2.3](/engineering#cycle-2-3).

> **TODO —** "Stability in sucrose vs stability in pollen patty." The comparison the
> whole delivery argument rests on, flagged as owed in our own write-up with no data
> attached. Until it exists the sucrose half-life is cited from the literature and
> the patty side of it is **unmeasured**, so nothing on this wiki shows that the
> patty is the better carrier. Owner: wet lab.

> **TODO —** The patty protocol. Prof. Geraldine Wright recommended a formulation,
> which we adjusted to maximise the dsRNA dose, and **neither the recommended
> formulation nor our adjustment is written down** — our write-up records the
> adjustment as "xxxxx". Without it this is not a protocol and the patty cannot be
> reproduced. Owner: wet lab.

### Scale-up

**Status: Modelled.** Fermentation scale, drying, formulation into a pollen patty
and the cost structure that falls out of it are on
[economic modelling](/economic-modelling) and
[entrepreneurship](/entrepreneurship). The chain that matters runs one way:
required treatment efficacy, allowable cost per hive, manufacturing cost, and
from those a **required mass of intact dsRNA per gram of dry yeast**. That last
term is the design target the wet lab has to hit.

### What remains unsolved

- Titre, as above.
- Whether the ribozymes are needed at all.
- Whether loop-ended dsRNA survives heat inactivation and drying intact. The
  published inactivation result is for a hairpin construct in a different system
  `[FLAG]`.
- Genetic stability of the cassette over an industrial number of generations.
- Whether a whole-cell formulation delivers to the larva at the dose the model
  requires.
- The pollen patty formulation itself, and dsRNA stability in it.

## Where this connects

[Wet lab lab book](/wet-lab-labbook) ·
[RNA design](/software) · [Parts](/parts) · [Measurement](/measurement) ·
[Bee lab experiments and protocols](/bee-lab-experiments) ·
[Results](/results) · [Engineering](/engineering) ·
[Contribution](/contribution) · [Timeline](/timeline)
