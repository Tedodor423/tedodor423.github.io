import {
  useEffect,
  useId,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  APIS,
  FEATURED_IDS,
  GUIDE_LENGTHS,
  METRIC_LABELS,
  METRIC_QUESTIONS,
  PANEL,
  PROVENANCE,
  REGION_METRICS,
  REGION_METRIC_OF,
  RELATIONSHIP_LABELS,
  ROUTE_LABELS,
  ROUTE_NOTES,
  ROUTE_ORDER,
  SPECIES_ORDER,
  TIER_LABELS,
  TIER_ORDER,
  VARROA,
  cachedGene,
  count,
  featureLabel,
  fromMilli,
  humanise,
  loadGene,
  probability,
  score,
  type GeneData,
  type GuideLength,
  type MetricKey,
  type PanelGene,
  type RegionMetric,
  type SelectionRoute,
  type TopGuide,
  type TopRegion,
} from "../utils/nectarData";
import "./NectarPipeline.css";

/* NECTAR, as the five views the dry lab's own reference demo is built in.
 *
 * WHAT THIS IS. The dry lab ran its pipeline over a frozen panel of 100 Varroa
 * genes on 7 October 2026 and handed the results over as a package with its
 * commit hash, its panel checksum and its tool versions recorded before the run.
 * This component is a reader for that package. Every number it prints was
 * produced by NECTAR; none is produced here. The wiki is the presentation layer
 * and the handoff says so in capitals, so the one rule this file keeps above all
 * others is that it does not compute science. It selects, it formats, and where
 * it tallies stored rows for a chart it says so on the face of the chart.
 *
 * THE FIVE VIEWS, and the question each one answers:
 *
 *   Panel         Which genes was the pipeline run on, and how did they get in?
 *   Transcript    Which exact transcript, and what is the evidence for this gene?
 *   Layers        Along that transcript, what do the three layers say, and where?
 *   Regions       Which 96 nt stretch comes out on top, and under which metric?
 *   Specificity   What else does that stretch hit, in Varroa and in Apis?
 *
 * All 100 genes are in the first view. Five are in the other four: the
 * literature arm, the panel members with published direct RNAi evidence against
 * Varroa. Their names are public because the studies are, and each one's
 * citation is on the transcript view with its DOI. The team's own selected
 * target is not among them and is not named on this wiki.
 *
 * WHY SMALL MULTIPLES RATHER THAN ONE CHART. The layers view draws four stacked
 * panels on a shared x axis instead of four lines in one box. Four series over
 * four thousand positions in one frame is a thicket, and the question a reader
 * has is where each layer peaks rather than which line is higher at a point. The
 * crosshair runs through all four panels and one readout line under them gives
 * all four values at the position under the pointer, so the comparison a single
 * frame would have given is still available.
 *
 * COLOUR. Three brand hues for the three layers and ink for their combination,
 * which is also the hierarchy: the inputs are coloured, the result is black. The
 * four were checked for pairwise separation under simulated colour-vision
 * deficiency (worst pair 16.4, well over the floor of 8); they fail the
 * lightness and chroma bands a general-purpose palette would want, because navy,
 * violet and ink are the team's own brand and this wiki is drawn in them. Nothing
 * leans on colour alone: every panel prints its name, and every series in a
 * shared frame carries a dash pattern as well as a hue.
 *
 * ROUNDING. The two series drawn as curves arrive as integers 0-1000, because at
 * a point per pixel the stored float costs five times the bytes and shows
 * nothing more. Everything printed as a number is at stored precision. The
 * distinction is stated under every chart that is drawn from the rounded form.
 */

/* ---------- the views ---------- */

const VIEWS = [
  {
    id: "panel",
    label: "Panel",
    title: "The 100 genes the pipeline was run on",
  },
  {
    id: "transcript",
    label: "Transcript",
    title: "One gene, and the exact transcript the run used",
  },
  {
    id: "layers",
    label: "Layers",
    title: "Three layers of evidence along the transcript",
  },
  {
    id: "regions",
    label: "Regions",
    title: "Ranking the 96 nt regions inside the transcript",
  },
  {
    id: "specificity",
    label: "Specificity",
    title: "What else the region hits, in two reference transcriptomes",
  },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

/* ---------- plot geometry ---------- */

/* One internal coordinate system for every chart, scaled by the viewBox. The
 * left margin holds a 0 / 0.5 / 1 axis; the right holds the series names, so a
 * line is labelled where it ends rather than in a legend box alone. */
const PLOT_W = 1000;
const PAD_L = 30;
const PAD_R = 128;
const LANE_H = 58;
const LANE_GAP = 10;
const ANNO_H = 30;

const METRIC_ORDER: MetricKey[] = ["l1", "l2", "l3", "total"];

/* EVERY chart of a transcript shares one x: position on that transcript, 1 to
 * its length. A series of per-guide or per-region values is plotted at the
 * position its window STARTS, so it stops short of the right-hand edge by the
 * width of that window, which is correct: no guide starts in the last 23 nt and
 * no 96 nt region starts in the last 95. Mapping each series over its own
 * number of points instead would stretch it to the full width and quietly
 * misplace it against the annotation bar underneath. */
function axisFor(lengthNt: number) {
  return (position: number) =>
    PAD_L +
    ((position - 1) / Math.max(1, lengthNt - 1)) * (PLOT_W - PAD_L - PAD_R);
}

/** The 5' UTR / CDS / 3' UTR bar under a transcript chart. */
function AnnotationBar({
  gene,
  x,
  y,
}: {
  gene: GeneData;
  x: (position: number) => number;
  y: number;
}) {
  const last = gene.annotations.length - 1;
  return (
    <g>
      {gene.annotations.map((a, index) => {
        const left = x(a.start);
        const width = Math.max(1, x(a.end) - left);
        // The final label would run off the right edge of the viewBox if it
        // started at its feature; it hangs back from the end instead.
        const atEnd = index === last;
        return (
          <g key={a.feature + a.start}>
            <rect
              className={
                a.feature === "CDS" ? "np-anno np-anno-cds" : "np-anno"
              }
              x={left}
              y={y}
              width={width}
              height={10}
            />
            <text
              className="np-anno-label"
              x={atEnd ? left + width : left + 3}
              y={y + 24}
              textAnchor={atEnd ? "end" : "start"}
            >
              {featureLabel(a.feature)} {count(a.start)}
              {"–"}
              {count(a.end)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** A 0 to 1 axis with a rule at 0, 0.5 and 1, drawn once per lane. */
function LaneAxis({ top }: { top: number }) {
  return (
    <g>
      {[0, 0.5, 1].map((at) => {
        const y = top + (1 - at) * LANE_H;
        return (
          <g key={at}>
            <line
              className="np-grid"
              x1={PAD_L}
              x2={PLOT_W - PAD_R}
              y1={y}
              y2={y}
            />
            <text className="np-axis" x={PAD_L - 5} y={y + 3}>
              {at}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** A rounded series into a polyline, at one decimal place: the chart is a
 * thousand units wide, so more digits are bytes with nothing behind them. */
function polyline(
  values: number[],
  firstStart: number,
  x: (position: number) => number,
  top: number,
): string {
  const points: string[] = [];
  for (let i = 0; i < values.length; i += 1) {
    const px = x(firstStart + i).toFixed(1);
    const py = (top + (1 - fromMilli(values[i])) * LANE_H).toFixed(1);
    points.push(`${px},${py}`);
  }
  return points.join(" ");
}

/* ---------- small shared pieces ---------- */

function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ id: T; label: string }>;
  onChange: (next: T) => void;
}) {
  const id = useId();
  return (
    <div className="np-choice">
      <label className="np-choice-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** A label and a value, in a definition list. Every table of stored numbers on
 * this component is one of these, so a reader learns one shape. */
function Facts({ rows }: { rows: Array<[string, ReactNode]> }) {
  return (
    <dl className="np-facts">
      {rows.map(([key, value]) => (
        <div key={key}>
          <dt>{key}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A horizontal bar with its value printed beside it. Used wherever counts span
 * three orders of magnitude, which a vertical bar chart cannot label. */
function BarRow({
  label,
  value,
  of,
  tone,
}: {
  label: string;
  value: number;
  of: number;
  tone?: "varroa" | "apis";
}) {
  const percent = of > 0 ? (value / of) * 100 : 0;
  return (
    <div className="np-bar-row">
      <span className="np-bar-label">{label}</span>
      <span className="np-bar-track">
        <span
          className={tone ? `np-bar np-bar-${tone}` : "np-bar"}
          style={{ width: `${Math.max(percent, value > 0 ? 0.6 : 0)}%` }}
        />
      </span>
      <span className="np-bar-value">{count(value)}</span>
    </div>
  );
}

/* ---------- view 1: the panel ---------- */

type PanelSort = "panelIndex" | "lengthNt" | "topScore" | "events";

function PanelView({
  onPick,
  selected,
}: {
  onPick: (geneId: string) => void;
  selected: string;
}) {
  const [route, setRoute] = useState<SelectionRoute | "all">("all");
  const [sort, setSort] = useState<PanelSort>("panelIndex");
  const [query, setQuery] = useState("");
  const [hover, setHover] = useState<PanelGene | null>(null);

  const byRoute = useMemo(() => {
    const map = new Map<SelectionRoute, PanelGene[]>();
    for (const r of ROUTE_ORDER) map.set(r, []);
    for (const gene of PANEL) map.get(gene.route)?.push(gene);
    return map;
  }, []);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = PANEL.filter(
      (gene) =>
        (route === "all" || gene.route === route) &&
        (needle === "" ||
          gene.geneId.toLowerCase().includes(needle) ||
          gene.geneLabel.toLowerCase().includes(needle) ||
          gene.productLabel.toLowerCase().includes(needle) ||
          gene.accession.toLowerCase().includes(needle)),
    );
    const key = {
      panelIndex: (g: PanelGene) => g.panelIndex,
      lengthNt: (g: PanelGene) => -g.lengthNt,
      topScore: (g: PanelGene) => -g.topRegion24.score,
      events: (g: PanelGene) => -g.exactEventsTotal,
    }[sort];
    return [...filtered].sort((a, b) => key(a) - key(b));
  }, [route, sort, query]);

  /* The best-region scores of the hundred genes span roughly 0.5 to 0.85, so
   * an axis from 0 to 1 would push every gene into the right-hand third. The
   * domain is the range that exists, rounded out to the nearest 0.05 so the
   * ticks are readable, and it is labelled as such under the chart. */
  const [lo, hi] = useMemo(() => {
    const scores = PANEL.map((g) => g.topRegion24.score);
    return [
      Math.floor(Math.min(...scores) * 20) / 20,
      Math.ceil(Math.max(...scores) * 20) / 20,
    ];
  }, []);
  const ticks = useMemo(() => {
    const out: number[] = [];
    for (let at = lo; at <= hi + 1e-9; at += 0.05)
      out.push(Number(at.toFixed(2)));
    return out;
  }, [lo, hi]);

  const height = ROUTE_ORDER.length * 46 + 44;
  const x = (value: number) =>
    PAD_L + ((value - lo) / (hi - lo)) * (PLOT_W - PAD_L - PAD_R);

  return (
    <>
      <p className="np-lede">
        Every gene below was run end to end: all 100 have a complete design, and
        92 have a complete specificity chain. The eight that stopped carry
        <strong> 100,000 or more exact-match events</strong>, which is an
        operational cap on precomputation and says nothing about how specific
        they are. The five marked in honey are the ones this page can open.
      </p>

      <figure className="np-figure">
        <svg
          viewBox={`0 0 ${PLOT_W} ${height}`}
          width="100%"
          role="img"
          aria-label="The 100 panel genes in four rows, one row per selection route, placed left to right by the Combined Evidence score of each gene's best 96 nt region. The full table follows."
        >
          {ROUTE_ORDER.map((r, lane) => {
            const top = lane * 46 + 14;
            return (
              <g key={r}>
                <text className="np-lane-name" x={PAD_L} y={top - 2}>
                  {ROUTE_LABELS[r]} ({byRoute.get(r)?.length ?? 0})
                </text>
                <line
                  className="np-grid"
                  x1={PAD_L}
                  x2={PLOT_W - PAD_R}
                  y1={top + 18}
                  y2={top + 18}
                />
                {(byRoute.get(r) ?? []).map((gene) => {
                  const featured = FEATURED_IDS.includes(gene.geneId);
                  const skipped = gene.specificityStatus !== "complete";
                  return (
                    <circle
                      key={gene.geneId}
                      className={[
                        "np-dot",
                        featured ? "np-dot-featured" : "",
                        skipped ? "np-dot-skipped" : "",
                        gene.geneId === selected ? "np-dot-current" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      cx={x(gene.topRegion24.score)}
                      cy={top + 18}
                      r={featured ? 6 : 4}
                      onPointerEnter={() => setHover(gene)}
                      onPointerLeave={() => setHover(null)}
                      onPointerUp={() =>
                        featured ? onPick(gene.geneId) : undefined
                      }
                    >
                      <title>
                        {gene.geneLabel} {score(gene.topRegion24.score)}
                      </title>
                    </circle>
                  );
                })}
              </g>
            );
          })}
          {ticks.map((at) => (
            <g key={at}>
              <text
                className="np-axis"
                x={x(at)}
                y={height - 14}
                textAnchor="middle"
              >
                {at}
              </text>
            </g>
          ))}
          <text className="np-axis-title" x={PAD_L} y={height - 2}>
            Combined Evidence of the gene{"’"}s best 96 nt region, 24 nt guides
          </text>
        </svg>
        <figcaption className="np-readout">
          {hover ? (
            <>
              <strong>{hover.geneLabel}</strong> {hover.geneId} ·{" "}
              {hover.productLabel} · {ROUTE_LABELS[hover.route]} ·{" "}
              {count(hover.lengthNt)} nt · best region{" "}
              {count(hover.topRegion24.start)}
              {"–"}
              {count(hover.topRegion24.end)} at {score(hover.topRegion24.score)}
            </>
          ) : (
            "Point at a gene for its numbers, or read the table below. The five in honey open in the other four views."
          )}
        </figcaption>
      </figure>

      <div className="np-route-notes">
        {ROUTE_ORDER.map((r) => (
          <p key={r}>
            <strong>{ROUTE_LABELS[r]}.</strong> {ROUTE_NOTES[r]}
          </p>
        ))}
      </div>

      <div className="np-controls">
        <Choice
          label="Route"
          value={route}
          onChange={setRoute}
          options={[
            { id: "all" as const, label: "All four routes" },
            ...ROUTE_ORDER.map((r) => ({ id: r, label: ROUTE_LABELS[r] })),
          ]}
        />
        <Choice
          label="Order by"
          value={sort}
          onChange={setSort}
          options={[
            { id: "panelIndex" as const, label: "Panel index" },
            { id: "topScore" as const, label: "Best region score" },
            { id: "lengthNt" as const, label: "Transcript length" },
            { id: "events" as const, label: "Exact-match events" },
          ]}
        />
        <div className="np-choice">
          <label className="np-choice-label" htmlFor="np-panel-search">
            Find
          </label>
          <input
            id="np-panel-search"
            type="search"
            value={query}
            placeholder="gene, product or accession"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <p className="np-count">{rows.length} of 100 genes</p>
      </div>

      <div className="np-scroll" tabIndex={0} role="region" aria-label="Panel">
        <table className="np-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Gene</th>
              <th scope="col">Product</th>
              <th scope="col">Transcript</th>
              <th scope="col">nt</th>
              <th scope="col">Route</th>
              <th scope="col">Guides</th>
              <th scope="col">Regions</th>
              <th scope="col">Best region</th>
              <th scope="col">Score</th>
              <th scope="col">Exact events</th>
              <th scope="col">Specificity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((gene) => {
              const featured = FEATURED_IDS.includes(gene.geneId);
              return (
                <tr
                  key={gene.geneId}
                  className={featured ? "np-row-featured" : undefined}
                >
                  <td>{gene.panelIndex}</td>
                  <td>
                    {featured ? (
                      <button
                        type="button"
                        className="np-link"
                        onClick={() => onPick(gene.geneId)}
                      >
                        {gene.geneLabel}
                      </button>
                    ) : (
                      gene.geneLabel
                    )}
                  </td>
                  <td className="np-wrap">{gene.productLabel}</td>
                  <td>{gene.accession}</td>
                  <td className="np-num">{count(gene.lengthNt)}</td>
                  <td>{ROUTE_LABELS[gene.route]}</td>
                  <td className="np-num">
                    {count(gene.candidates23 + gene.candidates24)}
                  </td>
                  <td className="np-num">{count(gene.regionCount)}</td>
                  <td className="np-num">
                    {count(gene.topRegion24.start)}
                    {"–"}
                    {count(gene.topRegion24.end)}
                  </td>
                  <td className="np-num">{score(gene.topRegion24.score)}</td>
                  <td className="np-num">{count(gene.exactEventsTotal)}</td>
                  <td>
                    {gene.specificityStatus === "complete"
                      ? "Complete"
                      : "Stopped at the event cap"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---------- view 2: the transcript ---------- */

function TranscriptView({ gene }: { gene: GeneData }) {
  const x = useMemo(() => axisFor(gene.lengthNt), [gene.lengthNt]);

  const coloured = useMemo(
    () =>
      gene.annotations.map((a) => ({
        feature: a.feature,
        text: gene.sequence.slice(a.start - 1, a.end),
        start: a.start,
      })),
    [gene],
  );

  const sel = gene.selection;

  return (
    <>
      <Facts
        rows={[
          [
            "Gene",
            <>
              {gene.geneLabel} <span className="np-mono">{gene.geneId}</span>
            </>,
          ],
          ["Product", gene.productLabel],
          [
            "Transcript used",
            <>
              <span className="np-mono">{gene.accession}</span>,{" "}
              {count(gene.lengthNt)} nt
            </>,
          ],
          ["Why this transcript", sel.transcriptReason],
          ["Other transcripts", sel.alternativeNote],
          [
            "In the 5,460-gene catalogue",
            sel.inCatalogue ? "Yes" : "No, designed through the sequence route",
          ],
          [
            "Candidate guides",
            `${count(gene.counts["23"])} at 23 nt, ${count(gene.counts["24"])} at 24 nt`,
          ],
          [
            "96 nt regions ranked",
            count(
              PANEL.find((p) => p.geneId === gene.geneId)?.regionCount ?? 0,
            ),
          ],
          [
            "Sequence SHA-256",
            <span className="np-mono np-break">{gene.sequenceSha256}</span>,
          ],
        ]}
      />

      <p className="np-note">
        Every result on the next three views is specific to this transcript.
        Positions are 1-based on it, never on the gene or the genome, and a
        different transcript of the same gene would give different candidates
        and different scores.
      </p>

      <h4>Why this gene is in the panel</h4>

      {gene.literature.length > 0 ? (
        <ol className="np-studies">
          {gene.literature.map((record) => (
            <li key={record.literature_record_id}>
              <p className="np-study-head">
                {record.reference_first_author} et al.,{" "}
                {record.reference_publication_year}.{" "}
                <em>{record.reference_title}</em> {record.reference_journal}.{" "}
                <a
                  href={`https://doi.org/${record.reference_doi}`}
                  rel="noreferrer"
                >
                  doi:{record.reference_doi}
                </a>
                {record.reference_pmid ? (
                  <>
                    {" "}
                    ·{" "}
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${record.reference_pmid}/`}
                      rel="noreferrer"
                    >
                      PMID {record.reference_pmid}
                    </a>
                  </>
                ) : null}
              </p>
              <Facts
                rows={[
                  ["Gene as the study names it", record.literature_gene_label],
                  ["Other names", record.literature_legacy_aliases],
                  ["How dsRNA was delivered", record.literature_delivery_route],
                  [
                    "Knockdown",
                    record.literature_knockdown_summary ||
                      `Verified: ${record.literature_knockdown_verified}`,
                  ],
                  [
                    "Phenotype",
                    record.literature_phenotype_summary ||
                      record.literature_phenotype_categories
                        .map(humanise)
                        .join(", "),
                  ],
                  [
                    "Evidence classes",
                    record.literature_evidence_classes.map(humanise).join(", "),
                  ],
                  [
                    "How the study was mapped to this gene",
                    `${humanise(record.literature_mapping_method)}; ${humanise(record.literature_identifier_status)}`,
                  ],
                  ...(record.literature_replication_note
                    ? ([
                        ["Replication", record.literature_replication_note],
                      ] as Array<[string, ReactNode]>)
                    : []),
                  ["Record read on", record.retrieved_on],
                ]}
              />
            </li>
          ))}
        </ol>
      ) : (
        <p className="np-note">
          This gene entered on {ROUTE_LABELS[sel.route].toLowerCase()}, so it
          carries no published RNAi record.
        </p>
      )}

      {gene.expression ? (
        <>
          <h4>Expression</h4>
          <Facts
            rows={Object.entries(gene.expression)
              .filter(([key]) => key !== "status")
              .map(([key, value]) => [
                humanise(key),
                typeof value === "number" ? value.toString() : String(value),
              ])}
          />
        </>
      ) : null}

      <h4>The transcript</h4>
      <figure className="np-figure">
        <svg
          viewBox={`0 0 ${PLOT_W} ${ANNO_H + 20}`}
          width="100%"
          role="img"
          aria-label={`Annotation map of ${gene.accession}: ${gene.annotations.map((a) => `${featureLabel(a.feature)} ${a.start} to ${a.end}`).join(", ")}.`}
        >
          <AnnotationBar gene={gene} x={x} y={6} />
        </svg>
      </figure>

      <div
        className="np-sequence"
        tabIndex={0}
        role="region"
        aria-label={`Sequence of ${gene.accession}`}
      >
        {coloured.map((part) => (
          <span
            key={part.start}
            className={part.feature === "CDS" ? "np-seq-cds" : "np-seq-utr"}
          >
            {part.text}
          </span>
        ))}
      </div>
      <p className="np-note">
        {gene.annotations
          .map(
            (a) =>
              `${featureLabel(a.feature)} ${count(a.start)}–${count(a.end)}`,
          )
          .join(" · ")}
        . The coding sequence is set in ink and the untranslated regions in
        grey.
      </p>
    </>
  );
}

/* ---------- view 3: the layers ---------- */

function LayersView({
  gene,
  guideLength,
  setGuideLength,
  guideStart,
  setGuideStart,
}: {
  gene: GeneData;
  guideLength: GuideLength;
  setGuideLength: (next: GuideLength) => void;
  guideStart: number | null;
  setGuideStart: (next: number | null) => void;
}) {
  const track = gene.tracks[guideLength];
  const [at, setAt] = useState<number | null>(null);

  const span = track.total.length;
  const x = useMemo(() => axisFor(gene.lengthNt), [gene.lengthNt]);

  const lines = useMemo(
    () =>
      METRIC_ORDER.map((metric, lane) => ({
        metric,
        points: polyline(
          track[metric],
          track.firstStart,
          x,
          lane * (LANE_H + LANE_GAP) + 10,
        ),
      })),
    [track, x],
  );

  const height = METRIC_ORDER.length * (LANE_H + LANE_GAP) + ANNO_H + 20;

  const onMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const unit = ((event.clientX - box.left) / box.width) * PLOT_W;
    const fraction = (unit - PAD_L) / (PLOT_W - PAD_L - PAD_R);
    const position = Math.round(fraction * (gene.lengthNt - 1)) + 1;
    const index = position - track.firstStart;
    setAt(index >= 0 && index < span ? index : null);
  };

  const readoutIndex = at;

  const selected = useMemo(
    () =>
      guideStart === null
        ? null
        : (gene.topGuides[guideLength].find(
            (one) => one.start_1based === guideStart,
          ) ?? null),
    [gene, guideLength, guideStart],
  );

  const correlations = gene.summaries.layerCorrelations.filter(
    (row) => row.candidate_length_nt === guideLength,
  );
  const pareto = gene.summaries.pareto.filter(
    (row) => row.candidate_length_nt === guideLength,
  );
  const front1 = pareto.find((row) => row.stage10_pareto_front === "1");

  return (
    <>
      <p className="np-lede">
        Each of the {count(track.total.length)} windows of {guideLength} nt in
        this transcript is scored on three layers, and the three are combined in
        equal thirds with no weighting. The panels share one x axis: the
        position where the guide starts, from the 5{"′"} end to the 3{"′"} end.
      </p>

      <div className="np-controls">
        <Choice
          label="Guide length"
          value={guideLength}
          onChange={setGuideLength}
          options={GUIDE_LENGTHS.map((l) => ({ id: l, label: `${l} nt` }))}
        />
      </div>

      <figure className="np-figure">
        <svg
          viewBox={`0 0 ${PLOT_W} ${height}`}
          width="100%"
          role="img"
          className="np-plot"
          aria-label={`Four stacked panels along ${gene.accession}: ${METRIC_ORDER.map((m) => METRIC_LABELS[m]).join(", ")}, each from 0 to 1 against guide start position. The ranked values are in the table below.`}
          onPointerMove={onMove}
          onPointerLeave={() => setAt(null)}
        >
          {lines.map(({ metric, points }, lane) => {
            const top = lane * (LANE_H + LANE_GAP) + 10;
            return (
              <g key={metric}>
                <LaneAxis top={top} />
                <polyline
                  className={`np-series np-series-${metric}`}
                  points={points}
                />
                <text
                  className={`np-series-name np-name-${metric}`}
                  x={PLOT_W - PAD_R + 8}
                  y={top + LANE_H / 2 - 3}
                >
                  {METRIC_LABELS[metric]}
                </text>
                <text
                  className="np-series-sub"
                  x={PLOT_W - PAD_R + 8}
                  y={top + LANE_H / 2 + 10}
                >
                  {metric === "total" ? "equal thirds" : "percentile"}
                </text>
              </g>
            );
          })}
          <AnnotationBar
            gene={gene}
            x={x}
            y={METRIC_ORDER.length * (LANE_H + LANE_GAP) + 10}
          />
          {readoutIndex !== null ? (
            <line
              className="np-crosshair"
              x1={x(track.firstStart + readoutIndex)}
              x2={x(track.firstStart + readoutIndex)}
              y1={6}
              y2={METRIC_ORDER.length * (LANE_H + LANE_GAP) + 8}
            />
          ) : null}
          {selected ? (
            <rect
              className="np-marked"
              x={x(selected.start_1based)}
              y={6}
              width={Math.max(
                2,
                x(selected.end_1based) - x(selected.start_1based),
              )}
              height={METRIC_ORDER.length * (LANE_H + LANE_GAP) + 2}
            />
          ) : null}
        </svg>
        <figcaption className="np-readout">
          {readoutIndex !== null ? (
            <>
              <strong>
                Guide at {count(track.firstStart + readoutIndex)}
                {"–"}
                {count(
                  track.firstStart + readoutIndex + Number(guideLength) - 1,
                )}
              </strong>
              {METRIC_ORDER.map((metric) => (
                <span key={metric}>
                  {" "}
                  · {METRIC_LABELS[metric]}{" "}
                  {fromMilli(track[metric][readoutIndex]).toFixed(3)}
                </span>
              ))}
            </>
          ) : (
            "Point anywhere along the panels to read all four values at that position. The curves are drawn from values rounded to three decimals; the table below is at stored precision."
          )}
        </figcaption>
      </figure>

      <h4>What the three layers do and do not agree on</h4>
      <p>
        Each layer is a percentile within this transcript, so each one is flat
        by construction across its own windows and there is nothing to plot in
        its distribution. What is worth reading is whether they agree, and they
        largely do not. NECTAR stores the rank correlation between them:
      </p>
      <table className="np-table np-table-tight">
        <thead>
          <tr>
            <th scope="col">Pair</th>
            <th scope="col">Windows</th>
            <th scope="col">Spearman {"ρ"}</th>
          </tr>
        </thead>
        <tbody>
          {correlations.map((row) => (
            <tr key={row.comparison}>
              <td>
                {row.comparison === "L1_vs_L2"
                  ? `${METRIC_LABELS.l1} and ${METRIC_LABELS.l2}`
                  : row.comparison === "L1_vs_L3"
                    ? `${METRIC_LABELS.l1} and ${METRIC_LABELS.l3}`
                    : `${METRIC_LABELS.l2} and ${METRIC_LABELS.l3}`}
              </td>
              <td className="np-num">{count(Number(row.n_candidates))}</td>
              <td className="np-num">{Number(row.spearman_rho).toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="np-note">
        Three weakly correlated layers are the reason the pipeline keeps them
        apart rather than folding them into one number early. Collapsing them
        would hide the disagreement that makes a window worth arguing about.
      </p>

      <h4>Where the combination lands</h4>
      <p>
        Combined Evidence is the only one of the four with a shape, because it
        is an equal-thirds mean of three percentiles that do not move together.
        {front1 ? (
          <>
            {" "}
            Of the {count(track.total.length)} windows,{" "}
            <strong>{count(Number(front1.n_candidates))}</strong> sit on the
            first Pareto front, where no other window beats them on all three
            layers at once.
          </>
        ) : null}
      </p>
      <div className="np-histogram">
        {track.totalHistogram.map((n, bin) => {
          const tallest = Math.max(...track.totalHistogram);
          return (
            <div
              key={bin}
              className="np-hist-col"
              style={{ height: `${(n / tallest) * 100}%` }}
              title={`${(bin / 20).toFixed(2)} to ${((bin + 1) / 20).toFixed(2)}: ${n} windows`}
            />
          );
        })}
      </div>
      <div className="np-hist-axis">
        <span>0</span>
        <span>
          {count(track.total.length)} windows of {guideLength} nt, in twenty
          bins
        </span>
        <span>1</span>
      </div>
      <Facts
        rows={METRIC_ORDER.map((metric) => [
          METRIC_LABELS[metric],
          `lowest ${score(track.stats[metric].min)} · median ${score(track.stats[metric].median)} · highest ${score(track.stats[metric].max)}`,
        ])}
      />

      <h4>The twelve highest-scoring windows</h4>
      <p className="np-note">
        {METRIC_QUESTIONS.total} Ranked out of {count(track.total.length)}{" "}
        windows of {guideLength} nt. Select one for every stored value NECTAR
        holds on it.
      </p>
      <div className="np-scroll" tabIndex={0} role="region" aria-label="Guides">
        <table className="np-table">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Position</th>
              <th scope="col">
                Guide, antisense RNA 5{"′"} to 3{"′"}
              </th>
              <th scope="col">Feature</th>
              <th scope="col">{METRIC_LABELS.l1}</th>
              <th scope="col">{METRIC_LABELS.l2}</th>
              <th scope="col">{METRIC_LABELS.l3}</th>
              <th scope="col">{METRIC_LABELS.total}</th>
              <th scope="col">Front</th>
            </tr>
          </thead>
          <tbody>
            {gene.topGuides[guideLength].map((guide) => (
              <tr
                key={guide.start_1based}
                className={
                  guide.start_1based === guideStart ? "np-row-current" : ""
                }
              >
                <td className="np-num">{guide.stage10_equal_layer_rank}</td>
                <td className="np-num">
                  <button
                    type="button"
                    className="np-link"
                    onClick={() =>
                      setGuideStart(
                        guide.start_1based === guideStart
                          ? null
                          : guide.start_1based,
                      )
                    }
                  >
                    {count(guide.start_1based)}
                    {"–"}
                    {count(guide.end_1based)}
                  </button>
                </td>
                <td className="np-mono">
                  {guide.antisense_guide_sequence_rna}
                </td>
                <td>{featureLabel(guide.overlap_regions)}</td>
                <td className="np-num">
                  {score(guide.stage10_layer1_percentile)}
                </td>
                <td className="np-num">
                  {score(guide.stage10_layer2_percentile)}
                </td>
                <td className="np-num">
                  {score(guide.stage10_layer3_percentile)}
                </td>
                <td className="np-num np-strong">
                  {score(guide.stage10_equal_layer_score)}
                </td>
                <td className="np-num">{guide.stage10_pareto_front}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected ? (
        <GuideDetail
          gene={gene}
          guide={selected}
          guideLength={guideLength}
          onClose={() => setGuideStart(null)}
        />
      ) : null}
    </>
  );
}

/** Every stored value NECTAR holds on one candidate guide, grouped by the layer
 * that uses it. Nothing here is rounded beyond three decimals for display. */
function GuideDetail({
  gene,
  guide,
  guideLength,
  onClose,
}: {
  gene: GeneData;
  guide: TopGuide;
  guideLength: GuideLength;
  onClose: () => void;
}) {
  const spec = gene.guideSpecificity[guideLength]?.[String(guide.start_1based)];
  return (
    <div className="np-detail">
      <div className="np-detail-head">
        <h4>
          Guide {count(guide.start_1based)}
          {"–"}
          {count(guide.end_1based)}, {guideLength} nt
        </h4>
        <button type="button" className="np-link" onClick={onClose}>
          Close
        </button>
      </div>
      <p className="np-mono np-break">
        Target, DNA sense: {guide.target_sequence_dna}
        <br />
        Guide, antisense RNA: {guide.antisense_guide_sequence_rna}
        <br />
        Guide self-fold: {guide.guide_self_fold_structure}
      </p>

      <h5 className="np-layer-head np-name-l1">{METRIC_LABELS.l1}</h5>
      <p className="np-note">{METRIC_QUESTIONS.l1}</p>
      <Facts
        rows={[
          [
            "Linear predictor",
            guide.layer1_accumulation_linear_predictor.toFixed(4),
          ],
          [
            "Percentile in this transcript",
            score(guide.layer1_accumulation_percentile),
          ],
          [
            "Model",
            "Frozen Varroa accumulation model, fitted separately for 23 and 24 nt. Its features and coefficients are held back pending the IP position.",
          ],
        ]}
      />

      <h5 className="np-layer-head np-name-l2">{METRIC_LABELS.l2}</h5>
      <p className="np-note">{METRIC_QUESTIONS.l2}</p>
      <Facts
        rows={[
          [
            "Guide 5′ terminal ΔG, 4 bp",
            `${guide.guide_5p_terminal_dg_4bp.toFixed(2)} kcal/mol`,
          ],
          [
            "Passenger 5′ terminal ΔG, 4 bp",
            `${guide.passenger_5p_terminal_dg_4bp.toFixed(2)} kcal/mol`,
          ],
          [
            "Asymmetry ΔΔG, 4 bp",
            `${guide.asymmetry_ddg_4bp.toFixed(2)} kcal/mol`,
          ],
          [
            "Asymmetry ΔΔG, 5 bp",
            `${guide.asymmetry_ddg_5bp.toFixed(2)} kcal/mol`,
          ],
          [
            "Guide self-fold MFE",
            `${guide.guide_self_fold_mfe_kcal_mol.toFixed(2)} kcal/mol`,
          ],
          ["Asymmetry percentile", score(guide.layer2_asymmetry_percentile)],
          ["Self-fold percentile", score(guide.layer2_self_fold_percentile)],
          ["Layer score", score(guide.layer2_reference_score)],
        ]}
      />

      <h5 className="np-layer-head np-name-l3">{METRIC_LABELS.l3}</h5>
      <p className="np-note">{METRIC_QUESTIONS.l3}</p>
      <Facts
        rows={[
          [
            "Whole site, probability unpaired",
            probability(guide.target_whole_p_unpaired),
          ],
          [
            "Seed g2–8, probability unpaired",
            probability(guide.target_seed_g2_8_p_unpaired),
          ],
          [
            "Whole-site percentile",
            score(guide.layer3_whole_accessibility_percentile),
          ],
          [
            "Seed percentile",
            score(guide.layer3_seed_accessibility_percentile),
          ],
          ["Layer score", score(guide.layer3_reference_score)],
        ]}
      />

      <h5 className="np-layer-head np-name-total">{METRIC_LABELS.total}</h5>
      <Facts
        rows={[
          ["Varroa Accumulation", score(guide.stage10_layer1_percentile)],
          ["Guide Competence", score(guide.stage10_layer2_percentile)],
          ["Target Accessibility", score(guide.stage10_layer3_percentile)],
          ["Equal-thirds score", score(guide.stage10_equal_layer_score)],
          [
            "Rank",
            `${count(guide.stage10_equal_layer_rank)} of ${count(gene.counts[guideLength])}`,
          ],
          ["Pareto front", String(guide.stage10_pareto_front)],
          ["Weakest layer", score(guide.stage10_minimum_layer_score)],
        ]}
      />

      {spec ? (
        <>
          <h5 className="np-layer-head">Exact-match screen for this guide</h5>
          <Facts
            rows={[
              ["Tier", TIER_LABELS[spec.exact_warning_tier] ?? "None"],
              [
                "Exact-match events",
                `${count(spec.offtarget_exact_event_count)} (${count(spec.varroa_offtarget_exact_event_count)} in Varroa, ${count(spec.apis_offtarget_exact_event_count)} in Apis)`,
              ],
              [
                "Longest exact match",
                `${count(spec.offtarget_longest_exact_match_nt)} nt`,
              ],
              [
                "Distinct genes and transcripts hit",
                `${count(spec.offtarget_unique_gene_count)} genes, ${count(spec.offtarget_unique_transcript_count)} transcripts`,
              ],
              [
                "Full-length match to this guide elsewhere",
                spec.full_canonical_guide_exact_match ? "Yes" : "No",
              ],
            ]}
          />
        </>
      ) : null}
    </div>
  );
}

/* ---------- view 4: the regions ---------- */

function RegionsView({
  gene,
  guideLength,
  setGuideLength,
  metric,
  setMetric,
  regionStart,
  setRegionStart,
}: {
  gene: GeneData;
  guideLength: GuideLength;
  setGuideLength: (next: GuideLength) => void;
  metric: RegionMetric;
  setMetric: (next: RegionMetric) => void;
  regionStart: number | null;
  setRegionStart: (next: number | null) => void;
}) {
  const track = gene.regionTracks[guideLength];
  const x = useMemo(() => axisFor(gene.lengthNt), [gene.lengthNt]);

  const points = useMemo(
    () => polyline(track.total, track.firstStart, x, 10),
    [track, x],
  );

  const ranked: TopRegion[] = gene.topRegions[guideLength][metric];
  const selected = ranked.find((r) => r.start === regionStart) ?? null;
  const height = LANE_H + ANNO_H + 28;

  /* Do the four metrics pick the same stretch? Stored ranks, compared. */
  const bests = REGION_METRICS.map((m) => ({
    metric: m,
    best: gene.topRegions[guideLength][m][0],
  }));

  return (
    <>
      <p className="np-lede">
        A region is a fixed <strong>96 nt</strong> window, and its score is the
        mean of the stored score of every guide of this length that fits
        entirely inside it. The region length is not a free parameter: the
        specificity screen is bound to it.
      </p>

      <div className="np-controls">
        <Choice
          label="Guide length"
          value={guideLength}
          onChange={setGuideLength}
          options={GUIDE_LENGTHS.map((l) => ({ id: l, label: `${l} nt` }))}
        />
        <Choice
          label="Rank by"
          value={metric}
          onChange={setMetric}
          options={REGION_METRICS.map((m) => ({
            id: m,
            label: METRIC_LABELS[REGION_METRIC_OF[m]],
          }))}
        />
      </div>

      <figure className="np-figure">
        <svg
          viewBox={`0 0 ${PLOT_W} ${height}`}
          width="100%"
          role="img"
          aria-label={`Combined Evidence of every 96 nt region along ${gene.accession}, by region start position. The ranked regions are in the table below.`}
        >
          <LaneAxis top={10} />
          <polyline className="np-series np-series-total" points={points} />
          <text
            className="np-series-name np-name-total"
            x={PLOT_W - PAD_R + 8}
            y={10 + LANE_H / 2 - 3}
          >
            {METRIC_LABELS.total}
          </text>
          <text
            className="np-series-sub"
            x={PLOT_W - PAD_R + 8}
            y={10 + LANE_H / 2 + 10}
          >
            per 96 nt region
          </text>
          {selected ? (
            <rect
              className="np-marked"
              x={x(selected.start)}
              y={8}
              width={Math.max(2, x(selected.end) - x(selected.start))}
              height={LANE_H + 4}
            />
          ) : null}
          <AnnotationBar gene={gene} x={x} y={LANE_H + 18} />
        </svg>
        <figcaption className="np-readout">
          {selected ? (
            <>
              <strong>
                Region {count(selected.start)}
                {"–"}
                {count(selected.end)}
              </strong>{" "}
              · rank {selected.rank} by{" "}
              {METRIC_LABELS[REGION_METRIC_OF[metric]]} · score{" "}
              {score(selected.score)} · {selected.guides} guides contained ·
              starts in {featureLabel(selected.feature)}
            </>
          ) : (
            "The curve is Combined Evidence whichever metric the table is ranked by, because that is the series the handoff carries at full length. Select a region below to mark it here."
          )}
        </figcaption>
      </figure>

      <h4>Do the four metrics choose the same stretch?</h4>
      <table className="np-table np-table-tight">
        <thead>
          <tr>
            <th scope="col">Ranked by</th>
            <th scope="col">Its best region</th>
            <th scope="col">Score</th>
            <th scope="col">Starts in</th>
          </tr>
        </thead>
        <tbody>
          {bests.map(({ metric: m, best }) => (
            <tr key={m}>
              <td>{METRIC_LABELS[REGION_METRIC_OF[m]]}</td>
              <td className="np-num">
                {count(best.start)}
                {"–"}
                {count(best.end)}
              </td>
              <td className="np-num">{score(best.score)}</td>
              <td>{featureLabel(best.feature)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>
        The twelve highest-ranked regions by{" "}
        {METRIC_LABELS[REGION_METRIC_OF[metric]]}
      </h4>
      <div
        className="np-scroll"
        tabIndex={0}
        role="region"
        aria-label="Regions"
      >
        <table className="np-table">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Region</th>
              <th scope="col">Guides inside</th>
              <th scope="col">Score</th>
              <th scope="col">Starts in</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((region) => (
              <tr
                key={region.start}
                className={
                  region.start === regionStart ? "np-row-current" : undefined
                }
              >
                <td className="np-num">{region.rank}</td>
                <td className="np-num">
                  <button
                    type="button"
                    className="np-link"
                    onClick={() =>
                      setRegionStart(
                        region.start === regionStart ? null : region.start,
                      )
                    }
                  >
                    {count(region.start)}
                    {"–"}
                    {count(region.end)}
                  </button>
                </td>
                <td className="np-num">{region.guides}</td>
                <td className="np-num">{score(region.score)}</td>
                <td>{featureLabel(region.feature)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected ? (
        <>
          <h4>
            Region {count(selected.start)}
            {"–"}
            {count(selected.end)}
          </h4>
          <div className="np-sequence np-sequence-short">
            {gene.sequence.slice(selected.start - 1, selected.end)}
          </div>
          <p className="np-note">
            96 nt of {gene.accession}, 1-based. The specificity view screens
            this stretch against two reference transcriptomes.
          </p>
        </>
      ) : null}
    </>
  );
}

/* ---------- view 5: specificity ---------- */

function SpecificityView({
  gene,
  regionStart,
}: {
  gene: GeneData;
  regionStart: number | null;
}) {
  const lengths = useMemo(() => {
    const all = new Set<number>();
    for (const species of SPECIES_ORDER) {
      for (const [nt] of gene.eventLengthHistogram[species] ?? []) all.add(nt);
    }
    return [...all].sort((a, b) => a - b);
  }, [gene]);

  const byLength = useMemo(() => {
    const map = new Map<string, Map<number, number>>();
    for (const species of SPECIES_ORDER) {
      map.set(species, new Map(gene.eventLengthHistogram[species] ?? []));
    }
    return map;
  }, [gene]);

  const tallest = Math.max(
    1,
    ...SPECIES_ORDER.flatMap((s) =>
      (gene.eventLengthHistogram[s] ?? []).map(([, n]) => n),
    ),
  );

  const region =
    regionStart === null ? null : gene.regionSpecificity[String(regionStart)];

  return (
    <>
      <p className="np-lede">
        Two reference transcriptomes are screened, and they are read for
        different reasons. A match inside <em>Varroa destructor</em> tells us
        whether the design would hit the mite somewhere we did not intend. A
        match inside <em>Apis mellifera</em> is the one that matters for safety,
        because the bee is the animal being dosed.
      </p>

      <h4>Every exact match of 16 nt or more, by how long it is</h4>
      <div className="np-length-chart">
        {lengths.map((nt) => (
          <div key={nt} className="np-length-row">
            <span className="np-bar-label">{count(nt)} nt</span>
            <span className="np-length-bars">
              {SPECIES_ORDER.map((species) => {
                const n = byLength.get(species)?.get(nt) ?? 0;
                return (
                  <span key={species} className="np-length-bar-line">
                    <span className="np-bar-track">
                      <span
                        className={`np-bar np-bar-${species === VARROA ? "varroa" : "apis"}`}
                        style={{
                          width: `${n === 0 ? 0 : Math.max(0.6, (n / tallest) * 100)}%`,
                        }}
                      />
                    </span>
                    <span className="np-bar-value">
                      {n === 0 ? "—" : count(n)}
                    </span>
                  </span>
                );
              })}
            </span>
          </div>
        ))}
      </div>
      <p className="np-legend">
        <span className="np-key np-key-varroa" /> Varroa destructor
        <span className="np-key np-key-apis" /> Apis mellifera. Counts are the
        stored exact-match events of this transcript, tallied by match length.
      </p>
      <p>
        The longest exact match to any <em>Apis mellifera</em> transcript is{" "}
        <strong>
          {count(gene.exactMatchSummary[APIS].longest_exact_match_nt)} nt
        </strong>
        , short enough to stay in the lowest of NECTAR{"’"}s three warning
        tiers. The longest match inside <em>Varroa</em> is{" "}
        <strong>
          {count(gene.exactMatchSummary[VARROA].longest_exact_match_nt)} nt
        </strong>
        , which is the whole transcript: the screen has found this gene{"’"}s
        own other annotated transcript, and the relationship column below says
        so rather than counting it as an off-target.
      </p>

      <div className="np-species-pair">
        {SPECIES_ORDER.map((species) => {
          const summary = gene.exactMatchSummary[species];
          const screen = gene.homologyScreens.find(
            (s) => s.species === species,
          );
          return (
            <section key={species} className="np-species">
              <h4>
                <em>{species}</em>
              </h4>
              <Facts
                rows={[
                  [
                    "Assembly screened",
                    `${screen?.assemblyName} (${screen?.assembly})`,
                  ],
                  ["Exact-match events", count(summary.exact_event_count)],
                  [
                    "Counting as an off-target warning",
                    count(summary.events_counting_as_offtarget_warning),
                  ],
                  [
                    "Longest exact match",
                    `${count(summary.longest_exact_match_nt)} nt`,
                  ],
                  [
                    "Distinct genes hit",
                    count(summary.unique_offtarget_gene_ids),
                  ],
                  [
                    "Distinct transcripts hit",
                    count(summary.unique_offtarget_transcripts),
                  ],
                ]}
              />
              <h5 className="np-layer-head">By warning tier</h5>
              {TIER_ORDER.map((tier) => (
                <BarRow
                  key={tier}
                  label={TIER_LABELS[tier]}
                  value={summary.events_by_exact_warning_tier[tier] ?? 0}
                  of={summary.exact_event_count}
                  tone={species === VARROA ? "varroa" : "apis"}
                />
              ))}
              <h5 className="np-layer-head">By what was hit</h5>
              {Object.entries(
                summary.events_by_relationship_to_intended_target,
              ).map(([relationship, n]) => (
                <BarRow
                  key={relationship}
                  label={
                    RELATIONSHIP_LABELS[relationship] ?? humanise(relationship)
                  }
                  value={n}
                  of={summary.exact_event_count}
                  tone={species === VARROA ? "varroa" : "apis"}
                />
              ))}
              {screen ? (
                <>
                  <h5 className="np-layer-head">Homology refinement</h5>
                  <Facts
                    rows={[
                      [
                        "Alignments attempted",
                        count(screen.alignmentsAttempted ?? 0),
                      ],
                      [
                        "Homology hits returned",
                        count(screen.homologyHits ?? 0),
                      ],
                      ["Status", humanise(screen.homologyStatus)],
                    ]}
                  />
                </>
              ) : null}
            </section>
          );
        })}
      </div>

      <p className="np-note">
        {gene.homologyScreens[0]?.limitation
          ? `Stated limitation of the refinement step, as the run recorded it: ${gene.homologyScreens[0].limitation}.`
          : null}
      </p>

      <h4>The selected region</h4>
      {region ? (
        <>
          <Facts
            rows={[
              ["Region", `${count(region.start)}–${count(region.end)}, 96 nt`],
              ["Tier", TIER_LABELS[region.tier] ?? humanise(region.tier)],
              [
                "Exact-match events overlapping it",
                `${count(region.events)} (${count(region.varroaEvents)} in Varroa, ${count(region.apisEvents)} in Apis)`,
              ],
              ["Longest exact match", `${count(region.longestExactNt)} nt`],
              [
                "Distinct genes and transcripts",
                `${count(region.uniqueGenes)} genes, ${count(region.uniqueTranscripts)} transcripts`,
              ],
            ]}
          />
          <h5 className="np-layer-head">
            Its longest matches, {region.eventRows.length} of{" "}
            {count(region.eventsStored)} stored
          </h5>
          <div
            className="np-scroll"
            tabIndex={0}
            role="region"
            aria-label="Exact matches"
          >
            <table className="np-table">
              <thead>
                <tr>
                  <th scope="col">Match</th>
                  <th scope="col">Species</th>
                  <th scope="col">Gene</th>
                  <th scope="col">Product</th>
                  <th scope="col">Transcript</th>
                  <th scope="col">Relationship</th>
                  <th scope="col">On this transcript</th>
                </tr>
              </thead>
              <tbody>
                {region.eventRows.map((row) => {
                  const event = gene.events[row];
                  const target = gene.offtargets[event.offtarget];
                  return (
                    <tr key={row}>
                      <td className="np-num">
                        {count(event.exact_match_length_nt)} nt
                      </td>
                      <td>
                        <em>{target.reference_species}</em>
                      </td>
                      <td>{target.offtarget_gene_symbol}</td>
                      <td className="np-wrap">{target.offtarget_product}</td>
                      <td className="np-mono">
                        {target.offtarget_transcript_accession}
                      </td>
                      <td className="np-wrap">
                        {RELATIONSHIP_LABELS[
                          event.relationship_to_intended_target
                        ] ?? humanise(event.relationship_to_intended_target)}
                      </td>
                      <td className="np-num">
                        {count(event.target_match_start_1based)}
                        {"–"}
                        {count(event.target_match_end_1based)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="np-note">
            The counts above come from the stored region record. The table is
            the longest matches of that record, capped at forty rows, because a
            conserved region can carry over a thousand and a table of a thousand
            says less than a table of forty.
          </p>
        </>
      ) : (
        <p className="np-note">
          No region selected. Choose one on the regions view and it is screened
          here.
        </p>
      )}
    </>
  );
}

/* ---------- the shell ---------- */

const FALLBACK_GENE = FEATURED_IDS[0];

export function NectarPipeline() {
  const [view, setView] = useState<ViewId>("panel");
  const [geneId, setGeneId] = useState(FALLBACK_GENE);
  const [gene, setGene] = useState<GeneData | null>(
    () => cachedGene(FALLBACK_GENE) ?? null,
  );
  const [failed, setFailed] = useState(false);
  const [guideLength, setGuideLength] = useState<GuideLength>("24");
  const [metric, setMetric] = useState<RegionMetric>("total");
  const [regionStart, setRegionStart] = useState<number | null>(null);
  const [guideStart, setGuideStart] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    const held = cachedGene(geneId);
    if (held) {
      setGene(held);
      return;
    }
    setGene(null);
    setFailed(false);
    loadGene(geneId)
      .then((data) => {
        if (live) setGene(data);
      })
      .catch(() => {
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, [geneId]);

  /* A region and a guide belong to one gene and one guide length. Carrying a
   * selection across either would mark a stretch of a transcript that never
   * had it. */
  useEffect(() => {
    setRegionStart(null);
    setGuideStart(null);
  }, [geneId, guideLength]);

  /* Selecting a region is how a reader gets to the specificity view with
   * something to screen, so default to the top-ranked one as soon as a gene
   * arrives rather than opening that view empty. */
  useEffect(() => {
    if (!gene || regionStart !== null) return;
    const best = gene.topRegions[guideLength]?.total?.[0];
    if (best) setRegionStart(best.start);
  }, [gene, guideLength, regionStart]);

  const pick = (next: string) => {
    setGeneId(next);
    setView("transcript");
  };

  const panelGene = PANEL.find((p) => p.geneId === geneId);

  return (
    <div className="np">
      <nav className="np-rail" aria-label="NECTAR views">
        {VIEWS.map((one) => (
          <button
            key={one.id}
            type="button"
            className={one.id === view ? "np-rail-on" : undefined}
            aria-current={one.id === view ? "true" : undefined}
            onClick={() => setView(one.id)}
          >
            {one.label}
          </button>
        ))}
      </nav>

      <header className="np-head">
        <h3>{VIEWS.find((one) => one.id === view)?.title}</h3>
        {view !== "panel" ? (
          <div className="np-gene-pick">
            <Choice
              label="Gene"
              value={geneId}
              onChange={setGeneId}
              options={FEATURED_IDS.map((id) => ({
                id,
                label: PANEL.find((p) => p.geneId === id)?.geneLabel ?? id,
              }))}
            />
            {panelGene ? (
              <p className="np-gene-sub">
                {panelGene.geneId} · {panelGene.accession} ·{" "}
                {count(panelGene.lengthNt)} nt · {ROUTE_LABELS[panelGene.route]}
              </p>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="np-body">
        {view === "panel" ? (
          <PanelView onPick={pick} selected={geneId} />
        ) : failed ? (
          <p className="np-note">
            The data for this gene did not load. Reload the page, or read the
            panel view, which needs nothing further.
          </p>
        ) : !gene ? (
          <div className="np-waiting" aria-busy="true">
            <p className="np-note">Loading the frozen outputs for {geneId}.</p>
          </div>
        ) : view === "transcript" ? (
          <TranscriptView gene={gene} />
        ) : view === "layers" ? (
          <LayersView
            gene={gene}
            guideLength={guideLength}
            setGuideLength={setGuideLength}
            guideStart={guideStart}
            setGuideStart={setGuideStart}
          />
        ) : view === "regions" ? (
          <RegionsView
            gene={gene}
            guideLength={guideLength}
            setGuideLength={setGuideLength}
            metric={metric}
            setMetric={setMetric}
            regionStart={regionStart}
            setRegionStart={setRegionStart}
          />
        ) : (
          <SpecificityView gene={gene} regionStart={regionStart} />
        )}
      </div>

      <footer className="np-foot">
        Frozen NECTAR outputs, run {PROVENANCE.runDateUtc.slice(0, 10)} from{" "}
        <span className="np-mono">nectar-clean</span> commit{" "}
        <span className="np-mono">
          {PROVENANCE.nectarCleanCommit.slice(0, 12)}
        </span>{" "}
        on a panel with SHA-256{" "}
        <span className="np-mono">{PROVENANCE.panelSha256.slice(0, 12)}</span>.{" "}
        {PROVENANCE.viennaRna}, {PROVENANCE.bowtie}, edlib {PROVENANCE.edlib}.
        Nothing on this page is recomputed, rescored or normalised.
      </footer>
    </div>
  );
}
