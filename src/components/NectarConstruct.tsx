import { useMemo, useState } from "react";
import {
  CHASSIS_LABELS,
  CHASSIS_NOTES,
  CHASSIS_ORDER,
  MARKERS_BY_CHASSIS,
  PROMOTERS_BY_CHASSIS,
  TOPOLOGIES,
  defaultMarkerId,
  defaultPromoterId,
  type CassetteTopology,
  type DeliveryChassis,
} from "../data/constructCatalog";
import {
  buildCassette,
  buildFasta,
  buildGenBank,
  buildInsertFasta,
  buildPrimers,
  downloadText,
  primersToCsv,
  removeGoldenGateSite,
  type CassetteDesign,
  type Insert,
} from "../utils/nectarConstruct";
import {
  BEST_REGIONS,
  FEATURED_IDS,
  PANEL,
  count,
  score,
} from "../utils/nectarData";
import "./NectarConstruct.css";

/* What the pipeline hands the wet lab.
 *
 * WHERE THIS SITS. NECTAR stops at a ranked region. This is the step after:
 * taking that region and wrapping it in an architecture that can be ordered,
 * produced in a chassis and assembled without being cut in half. It is a
 * reader's tool for seeing what the output of the pipeline turns into, not a
 * second design algorithm.
 *
 * WHAT IS REAL. The insert. Each region offered below is the top-ranked 96 nt
 * region of a featured gene under Combined Evidence, and its bases come
 * straight out of the frozen panel, unaltered. The Golden Gate search is a real
 * search of the assembled sequence, and the sites it finds inside a region are
 * a real property of that stretch of Varroa transcript.
 *
 * WHAT IS NOT. Everything around the insert. The loop closures, the promoters,
 * the terminators, the marker and the homology arms are placeholder sequence at
 * plausible lengths, because the team has not fixed those parts on the wiki.
 * They are marked as placeholder in the feature table, in the map, and inside
 * every file this writes. A site in the placeholder flank can be broken here; a
 * site inside a region cannot, because altering a NECTAR region would alter the
 * thing the design is about.
 *
 * This replaces the last two steps of a seven-step walkthrough whose other five
 * steps ran on invented transcripts, invented folds and invented off-target
 * hits. Those five are now the real NECTAR data in NectarPipeline.
 */

/** What the Sequence column of the feature table says about a feature's bases.
 * The same three words the exported GenBank uses in its /note qualifiers. */
const ORIGIN_WORD = {
  region: "as stored",
  "reverse-complement": "reverse complement",
  placeholder: "placeholder",
} as const;

/* ---------- the construct map ---------- */

const MAP_W = 1000;
const MAP_H = 74;

function FeatureMap({ design }: { design: CassetteDesign }) {
  const x = (bp: number) => (bp / design.lengthBp) * MAP_W;
  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      width="100%"
      role="img"
      className="nc-map"
      aria-label={`Linear map of a ${design.lengthBp} base pair construct with ${design.features.length} features. The full list is in the table below.`}
    >
      <line className="nc-map-rule" x1={0} x2={MAP_W} y1={32} y2={32} />
      {design.features.map((feature) => {
        const left = x(feature.start);
        const width = Math.max(2, x(feature.end) - left);
        return (
          <g key={feature.id}>
            <rect
              className={[
                "nc-map-feature",
                `nc-type-${feature.type}`,
                feature.origin === "placeholder" ? "nc-filler" : "nc-real",
              ].join(" ")}
              x={left}
              y={feature.strand === 1 ? 14 : 34}
              width={width}
              height={16}
            >
              <title>
                {feature.name}, {feature.start + 1} to {feature.end}
              </title>
            </rect>
          </g>
        );
      })}
      {design.goldenGateSites
        .filter((site) => !site.removed)
        .map((site) => (
          <line
            key={`${site.enzyme}-${site.position}`}
            className="nc-map-site"
            x1={x(site.position)}
            x2={x(site.position)}
            y1={8}
            y2={56}
          />
        ))}
      <text className="nc-map-scale" x={0} y={70}>
        1
      </text>
      <text className="nc-map-scale" x={MAP_W} y={70} textAnchor="end">
        {count(design.lengthBp)} bp
      </text>
    </svg>
  );
}

/* ---------- the builder ---------- */

export function NectarConstruct() {
  const [chosen, setChosen] = useState<string[]>([FEATURED_IDS[0]]);
  const [chassis, setChassis] = useState<DeliveryChassis>("s-cerevisiae");
  const [topology, setTopology] = useState<CassetteTopology>("dumbbell");
  const [promoterId, setPromoterId] = useState(
    defaultPromoterId("s-cerevisiae"),
  );
  const [markerId, setMarkerId] = useState(defaultMarkerId("s-cerevisiae"));
  const [broken, setBroken] = useState<{ id: string; sites: number[] }>({
    id: "",
    sites: [],
  });

  const inserts: Insert[] = useMemo(
    () =>
      FEATURED_IDS.filter((id) => chosen.includes(id)).map((id) => {
        const region = BEST_REGIONS[id];
        const gene = PANEL.find((one) => one.geneId === id);
        return {
          id,
          geneLabel: gene?.geneLabel ?? id,
          start: region.start,
          end: region.end,
          sequence: region.sequence,
          score: region.score,
        };
      }),
    [chosen],
  );

  const base = useMemo(
    () =>
      inserts.length === 0
        ? null
        : buildCassette(inserts, chassis, topology, promoterId, markerId),
    [inserts, chassis, topology, promoterId, markerId],
  );

  /* Breaking a site rewrites the sequence, so the list of broken sites belongs
   * to one construct. Changing any control starts the list again rather than
   * carrying edits onto a construct that never had them. */
  const design = useMemo(() => {
    if (!base) return null;
    if (broken.id !== base.id) return base;
    return broken.sites.reduce(
      (current, index) => removeGoldenGateSite(current, index),
      base,
    );
  }, [base, broken]);

  const chooseChassis = (next: DeliveryChassis) => {
    setChassis(next);
    setPromoterId(defaultPromoterId(next));
    setMarkerId(defaultMarkerId(next));
  };

  const toggle = (id: string) =>
    setChosen((now) =>
      now.includes(id) ? now.filter((one) => one !== id) : [...now, id],
    );

  const open = design
    ? design.goldenGateSites.filter((site) => !site.removed).length
    : 0;
  const insideRegion = design
    ? design.goldenGateSites.filter((site) => site.inInsert && !site.removed)
        .length
    : 0;

  return (
    <div className="nc">
      <div className="nc-body">
        <h3>Wrapping a ranked region into something orderable</h3>

        <fieldset className="nc-field">
          <legend>Regions to carry</legend>
          <p className="nc-hint">
            Each is the top-ranked 96 nt region of that gene under Combined
            Evidence, with 24 nt guides. Choosing more than one concatenates
            them into a single duplex, which is how one molecule silences
            several genes at once.
          </p>
          <ul className="nc-regions">
            {FEATURED_IDS.map((id) => {
              const region = BEST_REGIONS[id];
              const gene = PANEL.find((one) => one.geneId === id);
              return (
                <li key={id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={chosen.includes(id)}
                      onChange={() => toggle(id)}
                    />
                    <span className="nc-region-name">{gene?.geneLabel}</span>
                    <span className="nc-region-detail">
                      {gene?.accession} {count(region.start)}
                      {"–"}
                      {count(region.end)} · Combined Evidence{" "}
                      {score(region.score)} ·{" "}
                      {region.feature === "CDS"
                        ? "CDS"
                        : region.feature.replace("_prime_", "′ ")}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <fieldset className="nc-field">
          <legend>Production chassis</legend>
          <div className="nc-chips">
            {CHASSIS_ORDER.map((one) => (
              <button
                key={one}
                type="button"
                className="nc-chip"
                aria-pressed={chassis === one}
                onClick={() => chooseChassis(one)}
              >
                {CHASSIS_LABELS[one]}
              </button>
            ))}
          </div>
          <p className="nc-hint">{CHASSIS_NOTES[chassis]}</p>
        </fieldset>

        <fieldset className="nc-field">
          <legend>Architecture</legend>
          <div className="nc-chips">
            {TOPOLOGIES.map((one) => (
              <button
                key={one.id}
                type="button"
                className="nc-chip"
                aria-pressed={topology === one.id}
                onClick={() => setTopology(one.id)}
              >
                {one.label}
              </button>
            ))}
          </div>
          <p className="nc-hint">
            {TOPOLOGIES.find((one) => one.id === topology)?.note}
          </p>
        </fieldset>

        {topology === "dumbbell" ? (
          <p className="nc-fact">
            The dumbbell needs no promoter, terminator or marker, because
            nothing transcribes it inside a cell. That is why those controls are
            absent rather than disabled, and it is why this architecture is the
            one with almost no placeholder sequence in it.
          </p>
        ) : (
          <div className="nc-pair">
            <fieldset className="nc-field">
              <legend>Promoter</legend>
              <div className="nc-chips">
                {PROMOTERS_BY_CHASSIS[chassis].map((one) => (
                  <button
                    key={one.id}
                    type="button"
                    className="nc-chip"
                    aria-pressed={promoterId === one.id}
                    onClick={() => setPromoterId(one.id)}
                  >
                    {one.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="nc-field">
              <legend>Selectable marker</legend>
              <div className="nc-chips">
                {MARKERS_BY_CHASSIS[chassis].map((one) => (
                  <button
                    key={one.id}
                    type="button"
                    className="nc-chip"
                    aria-pressed={markerId === one.id}
                    onClick={() => setMarkerId(one.id)}
                  >
                    {one.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {design ? (
          <>
            <p className="nc-fact">
              {count(design.lengthBp)} bp in total, carrying{" "}
              <strong>{count(design.regionBp)} bp</strong> of NECTAR-ranked
              sequence across {design.inserts.length}{" "}
              {design.inserts.length === 1 ? "region" : "regions"}, plus its
              reverse complement as the other strand of the duplex. Only
              promoters and markers valid in {CHASSIS_LABELS[chassis]} are
              offered.
            </p>

            <FeatureMap design={design} />
            <p className="nc-legend">
              <span className="nc-key nc-key-real" /> NECTAR region, as stored
              or reverse-complemented
              <span className="nc-key nc-key-filler" /> placeholder flank
              <span className="nc-key nc-key-site" /> unbroken Golden Gate site.
              Forward features sit above the line, reverse below.
            </p>

            <div
              className="nc-scroll"
              tabIndex={0}
              role="region"
              aria-label="Features"
            >
              <table className="nc-table">
                <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    <th scope="col">Type</th>
                    <th scope="col">From</th>
                    <th scope="col">To</th>
                    <th scope="col">Length</th>
                    <th scope="col">Strand</th>
                    <th scope="col">Sequence</th>
                  </tr>
                </thead>
                <tbody>
                  {design.features.map((one) => (
                    <tr key={one.id}>
                      <th scope="row">{one.name}</th>
                      <td>{one.type.replace("-", " ")}</td>
                      <td className="nc-num">{one.start + 1}</td>
                      <td className="nc-num">{one.end}</td>
                      <td className="nc-num">{one.end - one.start} bp</td>
                      <td>{one.strand === 1 ? "forward" : "reverse"}</td>
                      <td>{ORIGIN_WORD[one.origin]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4>Assembly sites</h4>
            {design.goldenGateSites.length === 0 ? (
              <p className="nc-fact">
                No BsaI, BsmBI or SapI recognition site anywhere in the
                construct, so it is clean for Golden Gate assembly as it stands.
              </p>
            ) : (
              <>
                <p className="nc-fact">
                  {open === 0
                    ? "Every recognition site has been broken. The construct is clean for Golden Gate assembly."
                    : `${open} recognition ${open === 1 ? "site" : "sites"} would cut this construct during assembly.`}
                  {insideRegion > 0 ? (
                    <>
                      {" "}
                      {insideRegion} of them{" "}
                      {insideRegion === 1 ? "sits" : "sit"} inside a NECTAR
                      region and cannot be broken here: changing a base would
                      change the sequence the design is about. A real build
                      takes the next region down the ranking instead, or moves
                      the assembly junction.
                    </>
                  ) : null}
                </p>
                <ul className="nc-sites">
                  {design.goldenGateSites.map((site, index) => (
                    <li key={`${site.enzyme}-${site.position}`}>
                      <span className="nc-seq">{site.sequence}</span>{" "}
                      {site.enzyme} at {count(site.position + 1)}
                      {site.inInsert ? (
                        <span className="nc-site-locked">
                          inside a NECTAR region
                        </span>
                      ) : site.removed ? (
                        <span className="nc-site-done">broken</span>
                      ) : (
                        <button
                          type="button"
                          className="nc-pick"
                          onClick={() =>
                            setBroken((now) => ({
                              id: base?.id ?? "",
                              sites:
                                now.id === base?.id
                                  ? [...now.sites, index]
                                  : [index],
                            }))
                          }
                        >
                          break it
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h4>What comes out</h4>
            <p className="nc-fact">
              Written in the browser. Each file says inside itself which part of
              it is a NECTAR region and which part is placeholder.
            </p>
            <div className="nc-downloads">
              <button
                type="button"
                className="nc-button"
                onClick={() =>
                  downloadText(
                    "nectar-regions.fasta",
                    buildInsertFasta(design),
                    "text/plain",
                  )
                }
              >
                The regions alone, FASTA
              </button>
              <button
                type="button"
                className="nc-button"
                onClick={() =>
                  downloadText(
                    "nectar-construct.gb",
                    buildGenBank(design),
                    "text/plain",
                  )
                }
              >
                Whole construct, GenBank
              </button>
              <button
                type="button"
                className="nc-button"
                onClick={() =>
                  downloadText(
                    "nectar-construct.fasta",
                    buildFasta(design),
                    "text/plain",
                  )
                }
              >
                Whole construct, FASTA
              </button>
              <button
                type="button"
                className="nc-button"
                onClick={() =>
                  downloadText(
                    "nectar-check-primers.csv",
                    primersToCsv(buildPrimers(design)),
                    "text/csv",
                  )
                }
              >
                Check primers, CSV
              </button>
            </div>

            <h4>The duplex, as assembled</h4>
            <div
              className="nc-sequence"
              tabIndex={0}
              role="region"
              aria-label="Construct sequence"
            >
              {design.features.map((one) => (
                <span
                  key={one.id}
                  className={
                    one.origin === "placeholder"
                      ? "nc-seq-filler"
                      : "nc-seq-real"
                  }
                  title={one.name}
                >
                  {design.sequence.slice(one.start, one.end)}
                </span>
              ))}
            </div>
            <p className="nc-hint">
              NECTAR region sequence in ink, placeholder flanks in grey.
            </p>
          </>
        ) : (
          <p className="nc-fact">
            No region selected, so there is nothing to wrap. Tick at least one
            above.
          </p>
        )}
      </div>

      <p className="nc-warning">
        <strong>Half of this is placeholder, and it is marked.</strong> The
        insert is real: 96 nt regions ranked by NECTAR on the frozen panel,
        copied out of the transcript unaltered. Everything around it is
        generated sequence standing in for parts the team has not yet fixed, so
        this construct is not orderable as it stands and every file it writes
        says so. The architectures themselves, and which promoters and markers
        work in which chassis, are real reference data.
      </p>
    </div>
  );
}
