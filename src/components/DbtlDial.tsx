import { STAGE_NAME, STAGE_ORDER, type StageKey } from "../utils/dbtlCycles";

/* The DBTL dial: a thick flat-top hexagonal ring cut into four.
 *
 * Two hexagons, one inside the other, leaving a band wide enough to set a word in.
 * The band is quartered, one quarter per stage. The current quarter is drawn as an
 * arrow piece, pointed at the end that hands on to the next stage and notched at
 * the end it takes over from, so the ring reads as a cycle and not as a pie chart
 * without any marks of its own on the boundaries.
 *
 * IT STAYS STILL. Design is always at the top, Build on the right, Test at the
 * bottom and Learn on the left, and the current stage is shown by filling its
 * quarter. An earlier version turned the dial to bring the current stage to the
 * top; that moved every target the reader might want to click next, so it went.
 * The top and bottom words are set level and the side words run along the band.
 *
 * WHERE THE QUARTERS SIT, and why it matters. They are centred on the top, right,
 * bottom and left, with their boundaries on the diagonals, which leaves the dial
 * as the same flat-top hexagon as the comb around it. Cut the other way round,
 * with the quarters centred on the diagonals, the dial would look crooked inside
 * its own slot. Four stages will not divide a six-sided shape evenly, so the top
 * and bottom quarters span two corners each and the side ones a single point.
 *
 * The middle is left empty: the cycle's number and title are under the dial.
 */

/* Geometry, in viewBox units. A flat-top hexagon of circumradius R is 2R wide and
 * √3·R tall, with vertices at every sixtieth degree and none at the top. The
 * quarter boundaries are the diagonals, which cross the slanted sides at
 * a = R(3 − √3)/2. */
const R = 100;
const HALF = (R * Math.sqrt(3)) / 2;
const CROSS = (R * (3 - Math.sqrt(3))) / 2;

/** Inner hexagon as a fraction of the outer, which sets the band's thickness. */
const HOLE = 0.58;

const n = (v: number) => v.toFixed(1);

type Point = [number, number];

const path = (points: Point[]) =>
  points.map(([x, y]) => `${n(x)},${n(y)}`).join(" ");

/**
 * One quarter of the band. The top and bottom quarters each span two vertices of
 * the hexagon and the left and right ones span a single vertex, because four
 * quarters cannot divide six corners evenly.
 *
 * Every quarter is listed the same way round: along the outer edge from the
 * boundary with the stage before to the boundary with the stage after, then back
 * along the inner edge. arrowed() relies on that.
 */
function quarter(stage: number): Point[] {
  const k = HOLE;
  const c = CROSS;
  const h = HALF;

  switch (stage) {
    case 0: // the top
      return [
        [-c, -c],
        [-R / 2, -h],
        [R / 2, -h],
        [c, -c],
        [k * c, -k * c],
        [(k * R) / 2, -k * h],
        [(-k * R) / 2, -k * h],
        [-k * c, -k * c],
      ];
    case 1: // the right
      return [
        [c, -c],
        [R, 0],
        [c, c],
        [k * c, k * c],
        [k * R, 0],
        [k * c, -k * c],
      ];
    case 2: // the bottom
      return [
        [c, c],
        [R / 2, h],
        [-R / 2, h],
        [-c, c],
        [-k * c, k * c],
        [(-k * R) / 2, k * h],
        [(k * R) / 2, k * h],
        [k * c, k * c],
      ];
    default: // the left
      return [
        [-c, c],
        [-R, 0],
        [-c, -c],
        [-k * c, -k * c],
        [-k * R, 0],
        [-k * c, k * c],
      ];
  }
}

/** How far the current quarter's point reaches into the next quarter, and its
 * notch into itself, in viewBox units. The band is about 38 across at a
 * boundary, so this makes an arrowhead of about a hundred degrees. */
const ARROW = 15;

/**
 * A quarter as an arrow piece. Its leading boundary (outer point m-1 to inner
 * point m) comes to a point at the middle of the band, pushed clockwise, the way
 * the cycle runs; its trailing boundary (last point back to the first) is notched
 * by the same shape.
 *
 * The current quarter gets both. The one before it gets the point alone, which
 * fills the current one's notch, so the notch shows that quarter's grey and not
 * the paper behind the dial.
 */
function arrowed(points: Point[], notched = true): Point[] {
  const m = points.length / 2;
  const tip = (outer: Point, inner: Point): Point => {
    const x = (outer[0] + inner[0]) / 2;
    const y = (outer[1] + inner[1]) / 2;
    const r = Math.hypot(x, y);
    // Clockwise along the ring: the radius turned a quarter.
    return [x - (y / r) * ARROW, y + (x / r) * ARROW];
  };
  return [
    ...points.slice(0, m),
    tip(points[m - 1], points[m]),
    ...points.slice(m),
    ...(notched ? [tip(points[0], points[points.length - 1])] : []),
  ];
}

/* Where each word sits: the middle of the band along its quarter's own centre
 * line. The band is thinner over the flat top than out at the side vertex, so the
 * two are not the same radius.
 *
 * The side words also come in by half a line, because the two that point at a
 * vertex sit in a band that widens towards the tip, and the geometric middle of it
 * reads as too far out. */
const OVER_FLAT = (HALF + HOLE * HALF) / 2;
const OVER_POINT = (R + HOLE * R) / 2 - 8;

const SEAT: Array<{ x: number; y: number }> = [
  { x: 0, y: -OVER_FLAT },
  { x: OVER_POINT, y: 0 },
  { x: 0, y: OVER_FLAT },
  { x: -OVER_POINT, y: 0 },
];

interface DialProps {
  /** Which stage is current. Its quarter is filled. */
  current: StageKey;
  /** Which stage is under the cursor, here or in the text beside it. */
  lit: StageKey | null;
  onLight: (stage: StageKey | null) => void;
  onPick: (stage: StageKey) => void;
}

/* The current quarter is drawn last, so its point lies over the next quarter
 * rather than under it. The order changes only when a click has already
 * finished (see the StakeholderMap note on reordering under the pointer). */
export function DbtlDial({ current, lit, onLight, onPick }: DialProps) {
  const now = STAGE_ORDER.indexOf(current);
  const before = (now + STAGE_ORDER.length - 1) % STAGE_ORDER.length;
  const outline = (i: number) =>
    i === now
      ? arrowed(quarter(i))
      : i === before
        ? arrowed(quarter(i), false)
        : quarter(i);
  const order = [...STAGE_ORDER.keys()].sort(
    (a, b) => Number(a === now) - Number(b === now),
  );
  return (
    <div className="dbtl-dial">
      {/* Pointer-driven and hidden from assistive technology on purpose: every
          move it offers is also on the two stage buttons beside it, and a
          half-labelled SVG dial is worse than one that stands aside. */}
      <svg
        className="dbtl-dial-ring"
        viewBox="-104 -104 208 208"
        aria-hidden="true"
      >
        {order.map((i) => {
          const stage = STAGE_ORDER[i];
          const seat = SEAT[i];
          return (
            <g
              key={stage}
              className={`dbtl-dial-seg${lit === stage ? " is-lit" : ""}${
                current === stage ? " is-now" : ""
              }`}
              onPointerEnter={() => onLight(stage)}
              onPointerLeave={() => onLight(null)}
              onClick={() => onPick(stage)}
            >
              <polygon className="dbtl-dial-band" points={path(outline(i))} />
              <text
                className="dbtl-dial-word"
                textAnchor="middle"
                dominantBaseline="central"
                /* Level at the top and bottom; along the band at the sides,
                   reading downwards on the right and upwards on the left. */
                transform={`translate(${n(seat.x)} ${n(seat.y)}) rotate(${
                  [0, 90, 0, -90][i]
                })`}
              >
                {STAGE_NAME[stage].toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
