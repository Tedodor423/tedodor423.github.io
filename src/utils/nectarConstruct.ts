/* Wrapping a real NECTAR region into something the wet lab could order.
 *
 * WHAT IS REAL IN WHAT COMES OUT OF HERE. The insert. It is the sequence of a
 * 96 nt region that NECTAR ranked, sliced out of the exact transcript the run
 * used, and it arrives here unmodified. The Golden Gate search is real too: it
 * is a literal search of the assembled sequence for the recognition motifs of
 * BsaI, BsmBI and SapI, and a hit in the insert is a real property of that
 * stretch of Varroa transcript.
 *
 * WHAT IS NOT. Everything around the insert. The loop closures of a dumbbell,
 * and the promoter, terminator, marker and homology-arm sequences of the two
 * cassette architectures, are produced by the seeded generator below at
 * plausible lengths and GC content. They stand in for parts the team has not
 * fixed on the wiki, they are reproducible rather than random so that the same
 * choices give the same construct, and every file written here says so inside
 * itself. Do not order any of it.
 *
 * This file is the construct half of what was src/utils/rnaDesign.ts. The other
 * half generated transcripts, folds, candidate windows and off-target hits for
 * a walkthrough that has been replaced by the real NECTAR outputs; it was
 * deleted rather than kept, because a page that shows real data should not also
 * carry the machinery for inventing it.
 */

import {
  HOMOLOGY_ARM_CHASSIS,
  MARKERS_BY_CHASSIS,
  PROMOTERS_BY_CHASSIS,
  type CassetteTopology,
  type DeliveryChassis,
} from "../data/constructCatalog";

/* ---------- the seeded generator ---------- */

/* Small, fast, and good enough for filler: the same key always gives the same
 * bases, so switching chassis and switching back does not silently hand you a
 * different construct. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

interface Rng {
  next: () => number;
  int: (low: number, high: number) => number;
  pick: <T>(items: T[]) => T;
}

function rngFor(key: string): Rng {
  const next = mulberry32(hashString(key));
  return {
    next,
    int: (low, high) => low + Math.floor(next() * (high - low + 1)),
    pick: (items) => items[Math.floor(next() * items.length)],
  };
}

/* ---------- sequence helpers ---------- */

const COMPLEMENT: Record<string, string> = {
  A: "T",
  T: "A",
  U: "A",
  G: "C",
  C: "G",
  N: "N",
};

export function reverseComplement(seq: string): string {
  return seq
    .toUpperCase()
    .split("")
    .reverse()
    .map((base) => COMPLEMENT[base] ?? "N")
    .join("");
}

function generateSequence(rng: Rng, length: number, gcTarget: number): string {
  const out: string[] = [];
  for (let i = 0; i < length; i += 1) {
    out.push(
      rng.next() < gcTarget
        ? rng.next() < 0.5
          ? "G"
          : "C"
        : rng.next() < 0.5
          ? "A"
          : "T",
    );
  }
  return out.join("");
}

/* ---------- what the construct carries ---------- */

/** One NECTAR region, ready to be wrapped. The caller slices `sequence` out of
 * the transcript itself, so nothing in this module can alter it. */
export interface Insert {
  id: string;
  /** Gene label, for the feature name and the primer notes. */
  geneLabel: string;
  /** 1-based start and end on that gene's transcript. */
  start: number;
  end: number;
  /** The region sequence, DNA sense, exactly as the transcript carries it. */
  sequence: string;
  /** Combined Evidence of the region, as NECTAR stored it. */
  score: number;
}

export interface CassetteFeature {
  id: string;
  name: string;
  type:
    | "promoter"
    | "insert"
    | "terminator"
    | "marker"
    | "homology-arm"
    | "loop";
  start: number;
  end: number;
  strand: 1 | -1;
  /** Where the bases came from: a NECTAR region as stored, the reverse
   * complement of one, or the generator standing in for a part. */
  origin: "region" | "reverse-complement" | "placeholder";
}

export interface GoldenGateSite {
  enzyme: "BsaI" | "BsmBI" | "SapI";
  position: number;
  sequence: string;
  removed: boolean;
  /** True where the site falls inside a NECTAR region rather than in filler. */
  inInsert: boolean;
}

export interface CassetteDesign {
  id: string;
  topology: CassetteTopology;
  chassis: DeliveryChassis;
  lengthBp: number;
  /** Distinct NECTAR-ranked bases carried, counting a region once however many
   * times the architecture copies it. */
  regionBp: number;
  sequence: string;
  features: CassetteFeature[];
  goldenGateSites: GoldenGateSite[];
  inserts: Insert[];
}

const HAIRPIN_LOOP = "TTCAAGAGA"; // the canonical short-hairpin loop spacer

const ENZYMES = [
  { name: "BsaI" as const, fwd: "GGTCTC", rev: "GAGACC" },
  { name: "BsmBI" as const, fwd: "CGTCTC", rev: "GAGACG" },
  { name: "SapI" as const, fwd: "GCTCTTC", rev: "GAAGAGC" },
];

function findGoldenGateSites(
  sequence: string,
  insertSpans: Array<[number, number]>,
): GoldenGateSite[] {
  const sites: GoldenGateSite[] = [];
  for (const enzyme of ENZYMES) {
    for (const motif of [enzyme.fwd, enzyme.rev]) {
      let from = 0;
      let index: number;
      while ((index = sequence.indexOf(motif, from)) !== -1) {
        sites.push({
          enzyme: enzyme.name,
          position: index,
          sequence: motif,
          removed: false,
          inInsert: insertSpans.some(
            ([start, end]) => index >= start && index + motif.length <= end,
          ),
        });
        from = index + 1;
      }
    }
  }
  return sites.sort((a, b) => a.position - b.position);
}

export function buildCassette(
  inserts: Insert[],
  chassis: DeliveryChassis,
  topology: CassetteTopology,
  promoterId: string,
  markerId: string,
): CassetteDesign {
  const rng = rngFor(
    `cassette:${chassis}:${topology}:${promoterId}:${markerId}:${inserts
      .map((one) => one.id)
      .join(",")}`,
  );

  const payload = inserts.map((one) => one.sequence).join("");
  const antisense = reverseComplement(payload);

  const features: CassetteFeature[] = [];
  const parts: string[] = [];
  const insertSpans: Array<[number, number]> = [];
  let cursor = 0;

  const push = (
    name: string,
    type: CassetteFeature["type"],
    seq: string,
    strand: 1 | -1,
    origin: CassetteFeature["origin"],
  ) => {
    const start = cursor;
    parts.push(seq);
    cursor += seq.length;
    features.push({
      id: `feat-${features.length}`,
      name,
      type,
      start,
      end: cursor,
      strand,
      origin,
    });
    return start;
  };

  /** The regions, in order, each its own feature so the map shows the joins. */
  const pushRegions = (strand: 1 | -1) => {
    for (const one of inserts) {
      const start = push(
        `${one.geneLabel} ${one.start}–${one.end}`,
        "insert",
        strand === 1 ? one.sequence : reverseComplement(one.sequence),
        strand,
        strand === 1 ? "region" : "reverse-complement",
      );
      insertSpans.push([start, start + one.sequence.length]);
    }
  };

  if (topology === "dumbbell") {
    // Covalently closed at both ends and promoter-free, because nothing
    // transcribes it in vivo. This is the architecture NECTAR actually makes,
    // and the only generated bases in it are the two loop closures.
    const loopCap = () => generateSequence(rng, rng.int(8, 14), 0.5);
    push("5′ loop closure", "loop", loopCap(), 1, "placeholder");
    pushRegions(1);
    push("duplex spacer", "loop", HAIRPIN_LOOP, 1, "placeholder");
    push("antisense strand", "insert", antisense, -1, "reverse-complement");
    insertSpans.push([cursor - antisense.length, cursor]);
    push("3′ loop closure", "loop", loopCap(), -1, "placeholder");
  } else {
    const promoter =
      PROMOTERS_BY_CHASSIS[chassis].find((one) => one.id === promoterId) ??
      PROMOTERS_BY_CHASSIS[chassis][0];
    const marker =
      MARKERS_BY_CHASSIS[chassis].find((one) => one.id === markerId) ??
      MARKERS_BY_CHASSIS[chassis][0];
    const integrates = HOMOLOGY_ARM_CHASSIS.has(chassis);

    const promoterSeq = () => generateSequence(rng, rng.int(60, 120), 0.55);
    const terminatorSeq = () => generateSequence(rng, rng.int(40, 70), 0.5);
    const armSeq = () => generateSequence(rng, rng.int(300, 480), 0.4);

    if (integrates)
      push("5′ homology arm", "homology-arm", armSeq(), 1, "placeholder");
    push(
      marker.label,
      "marker",
      generateSequence(rng, rng.int(600, 850), 0.5),
      1,
      "placeholder",
    );
    push(promoter.label, "promoter", promoterSeq(), 1, "placeholder");

    if (topology === "hairpin") {
      pushRegions(1);
      push("duplex spacer", "loop", HAIRPIN_LOOP, 1, "placeholder");
      push("antisense strand", "insert", antisense, -1, "reverse-complement");
      insertSpans.push([cursor - antisense.length, cursor]);
      push(
        promoter.terminatorLabel,
        "terminator",
        terminatorSeq(),
        1,
        "placeholder",
      );
    } else {
      pushRegions(1);
      push(
        promoter.terminatorLabel,
        "terminator",
        terminatorSeq(),
        1,
        "placeholder",
      );
      push(
        `${promoter.label} (opposing)`,
        "promoter",
        promoterSeq(),
        -1,
        "placeholder",
      );
      push(
        `${promoter.terminatorLabel} (opposing)`,
        "terminator",
        terminatorSeq(),
        -1,
        "placeholder",
      );
    }

    if (integrates)
      push("3′ homology arm", "homology-arm", armSeq(), 1, "placeholder");
  }

  const sequence = parts.join("");
  return {
    id: `cassette:${chassis}:${topology}:${promoterId}:${markerId}:${inserts.map((one) => one.id).join(",")}`,
    topology,
    chassis,
    lengthBp: sequence.length,
    regionBp: inserts.reduce((sum, one) => sum + one.sequence.length, 0),
    sequence,
    features,
    goldenGateSites: findGoldenGateSites(sequence, insertSpans),
    inserts,
  };
}

/** Break one recognition site by flipping a single interior base.
 *
 * A site inside a NECTAR region cannot be broken here, and the component does
 * not offer it: changing one base of the region would change the sequence the
 * design is about, and the handoff is explicit that the wiki does not alter
 * supplied values. A real build resolves that upstream, by taking the next
 * region down the ranking or by moving the assembly junction. */
export function removeGoldenGateSite(
  design: CassetteDesign,
  siteIndex: number,
): CassetteDesign {
  const site = design.goldenGateSites[siteIndex];
  if (!site || site.removed || site.inInsert) return design;

  const rng = rngFor(`ggremove:${design.id}:${siteIndex}`);
  const at = site.position + Math.floor(site.sequence.length / 2);
  const replacement = rng.pick(
    ["A", "C", "G", "T"].filter((base) => base !== design.sequence[at]),
  );

  return {
    ...design,
    sequence:
      design.sequence.slice(0, at) +
      replacement +
      design.sequence.slice(at + 1),
    goldenGateSites: design.goldenGateSites.map((one, i) =>
      i === siteIndex ? { ...one, removed: true } : one,
    ),
  };
}

/* ---------- what comes out ---------- */

/* GenBank and FASTA are read by tools that expect plain ASCII, and the feature
 * names here carry a prime and an en dash from the wiki's own typography. A
 * label that round-trips through SnapGene or Benchling is worth more than a
 * typographically correct one inside a file nobody reads by eye. */
function ascii(text: string): string {
  return text
    .replace(/[′’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^\x20-\x7e]/g, "");
}

const ORIGIN_NOTE: Record<CassetteFeature["origin"], string> = {
  region: "NECTAR-ranked region, sequence as stored",
  "reverse-complement": "reverse complement of the NECTAR-ranked region",
  placeholder: "placeholder sequence, not a real part",
};

const GENBANK_KEY: Record<CassetteFeature["type"], string> = {
  promoter: "promoter",
  insert: "misc_feature",
  terminator: "terminator",
  marker: "gene",
  "homology-arm": "misc_feature",
  loop: "misc_structure",
};

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function gbDate(): string {
  const now = new Date();
  return `${String(now.getDate()).padStart(2, "0")}-${MONTHS[now.getMonth()]}-${now.getFullYear()}`;
}

/** The line every exported file carries, so a sequence that leaves this page
 * cannot be mistaken for a finished construct once it is in someone's folder. */
function provenanceLines(design: CassetteDesign): string[] {
  return [
    "Written by the construct builder on the Oxford iGEM 2026 wiki.",
    `The ${design.regionBp} bp of region sequence are real: ${design.inserts
      .map((one) => ascii(`${one.geneLabel} ${one.start}-${one.end}`))
      .join(", ")}, as ranked by NECTAR on the frozen panel.`,
    "Everything around the insert (loops, promoter, terminator, marker,",
    "homology arms) is placeholder sequence from a seeded generator and is",
    "NOT a real part. Do not order this as it stands.",
  ];
}

export function buildGenBank(design: CassetteDesign): string {
  const name = `NECTAR_${design.chassis.toUpperCase().replace(/-/g, "_")}`;
  const lines: string[] = [
    `LOCUS       ${name.padEnd(20)} ${String(design.lengthBp).padStart(5)} bp    DNA     linear   SYN ${gbDate()}`,
    `DEFINITION  dsRNA construct (${design.topology}) around NECTAR-ranked regions. Flanking sequence is placeholder.`,
    "ACCESSION   .",
    "VERSION     .",
    "KEYWORDS    .",
    "SOURCE      synthetic construct",
    "  ORGANISM  synthetic construct",
    ...provenanceLines(design).map(
      (line, i) => `${i === 0 ? "COMMENT    " : "           "} ${line}`,
    ),
    "FEATURES             Location/Qualifiers",
    `     source          1..${design.lengthBp}`,
    '                     /organism="synthetic construct"',
    '                     /mol_type="other DNA"',
  ];

  for (const feature of design.features) {
    const location =
      feature.strand === -1
        ? `complement(${feature.start + 1}..${feature.end})`
        : `${feature.start + 1}..${feature.end}`;
    lines.push(`     ${GENBANK_KEY[feature.type].padEnd(16)}${location}`);
    lines.push(`                     /label="${ascii(feature.name)}"`);
    lines.push(`                     /note="${ORIGIN_NOTE[feature.origin]}"`);
  }

  for (const site of design.goldenGateSites) {
    if (site.removed) continue;
    lines.push(
      `     misc_feature    ${site.position + 1}..${site.position + site.sequence.length}`,
    );
    lines.push(`                     /label="${site.enzyme} site"`);
    lines.push(
      `                     /note="unremoved Golden Gate recognition site${site.inInsert ? ", inside a NECTAR region" : ""}"`,
    );
  }

  lines.push("ORIGIN");
  const lower = design.sequence.toLowerCase();
  for (let i = 0; i < lower.length; i += 60) {
    const groups: string[] = [];
    const chunk = lower.slice(i, i + 60);
    for (let g = 0; g < chunk.length; g += 10)
      groups.push(chunk.slice(g, g + 10));
    lines.push(`${String(i + 1).padStart(9, " ")} ${groups.join(" ")}`);
  }
  lines.push("//");

  return lines.join("\n");
}

export function buildFasta(design: CassetteDesign): string {
  const wrapped: string[] = [];
  for (let i = 0; i < design.sequence.length; i += 70) {
    wrapped.push(design.sequence.slice(i, i + 70));
  }
  return [
    `>NECTAR_${design.chassis}_${design.topology}_${design.lengthBp}bp ${design.regionBp} bp NECTAR region sequence, flanks are placeholder`,
    ...wrapped,
    "",
  ].join("\n");
}

/** The regions on their own, which is the part that is real and the part
 * another team could actually use. */
export function buildInsertFasta(design: CassetteDesign): string {
  const out: string[] = [];
  for (const one of design.inserts) {
    out.push(
      `>${ascii(one.geneLabel)
        .replace(/[^A-Za-z0-9]+/g, "_")
        .replace(
          /^_|_$/g,
          "",
        )}_${one.start}-${one.end} ${one.sequence.length}nt NECTAR region, Combined Evidence ${one.score.toFixed(6)}`,
    );
    for (let i = 0; i < one.sequence.length; i += 70) {
      out.push(one.sequence.slice(i, i + 70));
    }
  }
  out.push("");
  return out.join("\n");
}

export interface Primer {
  name: string;
  sequence: string;
  lengthNt: number;
  tmC: number;
  notes: string;
}

/** Wallace rule. Crude, and the right level of crude for a check primer. */
function wallaceTm(seq: string): number {
  let gc = 0;
  let at = 0;
  for (const base of seq.toUpperCase()) {
    if (base === "G" || base === "C") gc++;
    else if (base === "A" || base === "T") at++;
  }
  return 4 * gc + 2 * at;
}

export function buildPrimers(design: CassetteDesign): Primer[] {
  const forward = design.sequence.slice(0, 20);
  const reverse = reverseComplement(design.sequence.slice(-20));

  const primers: Primer[] = [
    {
      name: "cassette-F",
      sequence: forward,
      lengthNt: forward.length,
      tmC: wallaceTm(forward),
      notes:
        "Full-construct forward, anneals at position 1. Placeholder flank.",
    },
    {
      name: "cassette-R",
      sequence: reverse,
      lengthNt: reverse.length,
      tmC: wallaceTm(reverse),
      notes: `Full-construct reverse, anneals at position ${design.lengthBp - 19}. Placeholder flank.`,
    },
  ];

  design.inserts.forEach((one, i) => {
    const seq = one.sequence.slice(0, 20);
    primers.push({
      name: `check-region-${i + 1}`,
      sequence: seq,
      lengthNt: seq.length,
      tmC: wallaceTm(seq),
      notes: ascii(
        `Verifies ${one.geneLabel} ${one.start}-${one.end}, a NECTAR-ranked ${one.sequence.length} nt region`,
      ),
    });
  });

  return primers;
}

export function primersToCsv(primers: Primer[]): string {
  return [
    "name,sequence,length_nt,tm_c,notes",
    ...primers.map(
      (one) =>
        `${one.name},${one.sequence},${one.lengthNt},${one.tmC.toFixed(1)},"${one.notes}"`,
    ),
    "# Oxford iGEM 2026 wiki. Region primers anneal to real NECTAR-ranked sequence;",
    "# cassette primers anneal to placeholder flanking sequence and are not orderable.",
  ].join("\n");
}

/** Hands the browser a file without a server or a library. */
export function downloadText(
  filename: string,
  text: string,
  mime: string,
): void {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}
