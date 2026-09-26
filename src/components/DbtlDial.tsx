import { STAGE_NAME, STAGE_ORDER, type StageKey } from "../utils/dbtlCycles";

/* The DBTL dial: a thick flat-top hexagonal ring cut into four.
 *
 * Two hexagons, one inside the other, leaving a band wide enough to set a word in.
 * The band is quartered, one quarter per stage, with a chevron on each boundary so
 * the ring reads as a cycle and not as a pie chart.
 *
 * IT TURNS, a quarter turn per stage, so the stage you are reading sits at the top.
 * Each label is pre-rotated by exactly the amount the dial's own turn cancels when
 * its quarter reaches the top, so the current stage is always the horizontal,
 * readable one and the others lie on their sides. That is the point of a dial:
 * position tells you where you are before you have read anything.
 *
 * WHERE THE QUARTERS SIT, and why it matters. They are centred on the top, right,
 * bottom and left, with their boundaries on the diagonals. That makes the turn a
 * multiple of ninety degrees and leaves Design, the first stage, at zero: the dial
 * then reads as the same flat-top hexagon as the comb around it. Cut the other way
 * round, with the quarters centred on the diagonals, every position would sit at
 * fifteen or forty-five degrees and the dial would look permanently crooked inside
 * its own slot. Four stages will not divide a six-sided shape evenly, so the two
 * side positions still come out pointy-top; that is a dial turning, not a mistake.
 *
 * WHAT ROTATES. The <svg> element itself, about the centre of its own box, which is
 * the one rotation CSS does without any argument about reference boxes: an SVG laid
 * out by HTML takes `transform-origin: center` exactly as a div would. Doing it on
 * an inner <g> instead means relying on `transform-box: view-box`, where the origin
 * resolves against the viewBox in some browsers and against the group's bounding
 * box in others, and the dial swings on an arc rather than turning on the spot.
 * The box is square for the same kind of reason: a flat-top hexagon is taller than
 * it is wide once turned ninety degrees, so a box shaped to fit it upright would
 * clip it halfway round.
 *
 * The number in the middle is an HTML span over the top, not part of the drawing,
 * so it stays upright while everything behind it turns.
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

/**
 * One quarter of the band. The top and bottom quarters each span two vertices of
 * the hexagon and the left and right ones span a single vertex, because four
 * quarters cannot divide six corners evenly.
 */
function quarter(stage: number): string {
  const k = HOLE;
  const c = CROSS;
  const h = HALF;

  const path = (points: [number, number][]) =>
    points.map(([x, y]) => `${n(x)},${n(y)}`).join(" ");

  switch (stage) {
    case 0: // the top
      return path([
        [-c, -c],
        [-R / 2, -h],
        [R / 2, -h],
        [c, -c],
        [k * c, -k * c],
        [(k * R) / 2, -k * h],
        [(-k * R) / 2, -k * h],
        [-k * c, -k * c],
      ]);
    case 1: // the right
      return path([
        [c, -c],
        [R, 0],
        [c, c],
        [k * c, k * c],
        [k * R, 0],
        [k * c, -k * c],
      ]);
    case 2: // the bottom
      return path([
        [c, c],
        [R / 2, h],
        [-R / 2, h],
        [-c, c],
        [-k * c, k * c],
        [(-k * R) / 2, k * h],
        [(k * R) / 2, k * h],
        [k * c, k * c],
      ]);
    default: // the left
      return path([
        [-c, c],
        [-R, 0],
        [-c, -c],
        [-k * c, -k * c],
        [-k * R, 0],
        [-k * c, k * c],
      ]);
  }
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

/* The four boundaries, on the diagonals, at the middle of the band there. */
const CORNER = (CROSS * Math.SQRT2 * (1 + HOLE)) / 2;

interface DialProps {
  /** Which stage is current. The dial turns to put this one at the top. */
  current: StageKey;
  /** Which stage is under the cursor, here or in the text beside it. */
  lit: StageKey | null;
  onLight: (stage: StageKey | null) => void;
  onPick: (stage: StageKey) => void;
  /** Shown in the middle, which does not turn. */
  label: string;
}

export function DbtlDial({ current, lit, onLight, onPick, label }: DialProps) {
  const index = STAGE_ORDER.indexOf(current);
  // A quarter turn per stage, and none at all for the first one.
  const turn = -90 * index;

  return (
    <div className="dbtl-dial">
      {/* Pointer-driven and hidden from assistive technology on purpose: every
          move it offers is also on the two stage buttons beside it, and a
          half-labelled SVG dial is worse than one that stands aside. */}
      <svg
        className="dbtl-dial-ring"
        viewBox="-104 -104 208 208"
        aria-hidden="true"
        style={{ transform: `rotate(${turn}deg)` }}
      >
        {STAGE_ORDER.map((stage, i) => {
          const seat = SEAT[i];
          /* Whichever quarter is two steps round from the current one has swung
           * to the bottom, where its pre-rotation leaves it upside down. Turn that
           * one word the rest of the way so it reads. It snaps rather than
           * animating, because it is set as an attribute on the text and nothing
           * transitions it: mid-turn is exactly when a word spinning on its own
           * axis would look wrong. */
          const upsideDown = (i - index + 4) % 4 === 2;
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
              <polygon className="dbtl-dial-band" points={quarter(i)} />
              <text
                className="dbtl-dial-word"
                textAnchor="middle"
                dominantBaseline="central"
                /* Pre-rotated so the dial's own turn cancels it exactly when this
                   quarter reaches the top, plus a half turn when it is at the
                   bottom and would otherwise be upside down. */
                transform={`translate(${n(seat.x)} ${n(seat.y)}) rotate(${
                  90 * i + (upsideDown ? 180 : 0)
                })`}
              >
                {STAGE_NAME[stage].toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* A chevron on each boundary, pointing the way the cycle runs. */}
        {[45, 135, 225, 315].map((angle) => {
          const a = (Math.PI / 180) * angle;
          return (
            <path
              key={angle}
              className="dbtl-dial-step"
              d="M-4,-5 L4,0 L-4,5"
              transform={`translate(${n(CORNER * Math.cos(a))} ${n(
                CORNER * Math.sin(a),
              )}) rotate(${angle + 90})`}
            />
          );
        })}
      </svg>

      <span className="dbtl-dial-label">{label}</span>
    </div>
  );
}
