<!-- The overarching cycles the comb on /engineering is made of.

     One `##` per hexagon, in the order they appear on the page. The heading has
     to match the `workstream:` line in the cycle files in src/content/cycles/
     exactly, because that is what groups the iterations under it.

     THE FAMILIES ARE THE TEAM'S OWN, from the 29 Sep write-up: five wet lab
     DBTLs (dsRNA design; production and delivery; optimising rt-qPCR; Mango;
     functionalising), three bee lab groups (adult, larval, mite) and two dry lab
     ones. Numbering follows the write-up too, so a cycle's number is its family
     plus its iteration index — 2.3 is the third iteration of DBTL 2. Where the
     write-up names fewer iterations than we ran, the extra ones keep their place
     in the family and are flagged in the file, so nothing is lost and the shape
     still matches the document.

     `**Question.**` is the line shown large at the top of an opened hexagon.
     Everything after it is the standfirst under that question. Both are the
     team's own words.

     A section with only ONE cycle under it needs no `**Question.**`: that turn's
     own question is the overarching one, and the hexagon uses it. -->

## Wet lab: dsRNA design

**Question.** Which sequence, and in what shape, should the molecule be?

The bottlenecks facing RNAi adoption in the honeybee industry are rational target
selection, off-target screening, interaction with native RNAi machinery, single-target
resistance, manufacturing cost, environmental degradation and inefficient delivery.
Conversations with beekeepers, environmental agencies and regulatory authorities drove
us to build a design pipeline, **SEED** (Selective enginEEring of dsRNA), that accounts
for on- and off-target efficiency, Dicer processing, target-transcript accessibility,
RNA stability and the capacity to target several genes at once. These two turns are
what came out of it: the constructs SEED designed first, and the loop-ended, multigene
redesign that followed from how they behaved in a hive.

## Wet lab: Production and delivery of dsRNA

**Question.** What makes the dsRNA, and what carries it into the hive?

Current _Varroa_ RNAi therapeutics are produced in cell-free systems, which are
costly, hard to scale and need the RNA purified before it can be delivered, and the
dsRNA is then usually fed to hives in sucrose solution, where its half-life is a few
hours. We used in vitro transcription to validate SEED designs independently of
delivery, and assessed two bacterial chassis, _E. coli_ and _Snodgrassella alvi_, and
a yeast, _S. cerevisiae_, for production that could scale. With yeast the factory and
the carrier turn out to be the same object, which is why these turns end in a pollen
patty.

## Wet lab: Optimising rt-qPCR for honeybee samples

**Question.** Can we recover ingested dsRNA from bee material and put a number on
it by the reference method?

RT-qPCR is the gold standard for RNA quantification, and for consistent results it
needs a purification step on samples with high background — which bee material has,
and on top of that bee haemolymph is a matrix that changes when it is heated. There is
no established method for quantifying ingested dsRNA in honeybee haemolymph. Maori et al. 2019 fed 500 ng of DIG-labelled dsRNA per bee and recovered
it from raw haemolymph at 5 h, but published no concentration `[LIT]`. Muita et al.
2026 could see their dsRNA only because it was Cy3-labelled `[LIT]`. Of six
published _Varroa_ RNAi papers, three quantify "spectrophotometrically", three state
no method at all, and none reports a Qubit value, an A260/A280 or mass-ladder
densitometry. We could not cite an expected working range because none exists. That
absence is why this workstream exists; the detail is on
[measurement](/measurement).

## Wet lab: Mango

**Question.** Can the dsRNA report its own concentration, without an extraction
step?

What we wanted was a measurement that is sequence-specific, purification-light and
RT-free: the molecule saying how much of itself is in crude haemolymph, with no
extraction and no amplification step in between.

## Wet lab: Functionalising the dsRNA

**Question.** Can we attach protein to the dsRNA to change where it goes?

Loops are spare capacity. A loop-ended construct can carry extra RNA, such as the
Mango aptamer for stability and readout, and it can equally carry a site that binds
protein. To increase the efficacy of our dsRNA, we explored functionalising it by
conjugating it to a protein that could improve uptake across the bee gut and
transmission between mites. After consulting Professor Nancy Moran, an expert in
insect-microbe symbiosis, and reviewing the literature, **it was evident that the
mechanism of dsRNA uptake across the bee gut and into mite cells is still poorly
understood**, which is why this workstream is modelled and proposed
rather than demonstrated. Vitellogenin was suggested as the ideal cargo because it is
enriched in mite eggs, so attaching it would enrich our dsRNA in mites by leveraging
the natural vertical transmission of vitellogenin. The MS2 coat protein is the
adaptor that would hold the two together: hairpins in the loop, the cargo protein
fused to the coat protein. These cycles take the join apart, the RNA side and the
protein side, and ask the question the whole arm turns on, whether the protein can
cross the bee gut and reach the mite still folded.

## Bee lab: Adult bee assays

The wet lab makes the molecule; the bee lab is where it meets an animal. These
cycles are method development, and we count them as engineering because without them
there is nothing to test NECTAR with. Detail and dated entries on
[bee lab](/bee-lab).

**Question.** How do we get a known dose into an adult bee, and get the haemolymph
back out?

To measure how stable dsRNA is in a bee, and whether its length changes how much
crosses the gut, we needed a dose we know each bee took in full and a fast, reliable
way to get pure haemolymph back out, so that the timepoints of a time-course are
accurate. The first turn settles the feeding solution and shows why a cage cannot
give a dose per bee, the second doses bees one at a time, and the third extracts
their haemolymph.

## Bee lab: Larval assays

**Question.** How do we get a dose into a larva in the hive, and get the larva back
once the cell is capped?

_Varroa_ reproduces in the brood. A foundress mite enters the cell of a 5th instar
larva, the last uncapped stage, and feeds on that larva throughout the capped period,
so the larva is where our dsRNA has to persist. We dose 5th instar larvae in the
hive, because rearing larvae in the lab was not feasible in the time we had. Larvae
are soft and burst easily, so most of the work was in getting a sample back out: the
first turn settles the dose, the second tries larval haemolymph, and the third takes
whole larvae.

## Bee lab: Varroa mite testing

**Question.** Can we keep a mite alive long enough to dose it, and does our dsRNA
kill it?

To test SEED's designs on the animal they are meant to kill, a mite screen needs
background mortality low enough for a dsRNA effect to show over it, and a dose that
reaches the mite the way it would in a colony. Mite counts in our own hives were low
and the brood season was closing by September, so the window was short. The four
turns move the dose from the outside of the mite to its host: the first two soak the
mite, outside the hive and then in brood cells; the third drops the soak and doses
the larva the mite will feed on; the fourth uses that method to test SEED's best-
and worst-ranked targets.

## Dry lab: Designing the RNA to kill mites

Published _Varroa_ RNAi work had silenced individual genes, but choosing the target
and screening it for off-target risk were still done case by case. Conversations
with beekeepers, environmental agencies and regulators pushed us to engineer the
design step itself: **SEED**, Selective enginEEring of dsRNA, which picks the gene,
the region inside it, and the set of regions that travel together in one molecule.
The method and the frozen run over 100 genes are on [RNA design](/software).

## Dry lab: BEEHAVE modelling

**Question.** What efficacy, applied how often and for how long, changes the
trajectory of a colony under mite pressure, and what dsRNA titre makes it
affordable?
