import { STAKEHOLDERS, type Stakeholder } from "../data/stakeholders";
import {
  COL_W,
  HEXES,
  ORIGIN_X,
  ORIGIN_Y,
  ROW_H,
  latToY,
  lonToX,
} from "./worldHexes";

/* Which lattice cell each conversation sits on, at rest.
 *
 * Shared by the stakeholder map and the small map beside the interviews at
 * the foot of the page (StakeholderRecord), so a person is on the same cell
 * in both.
 */

export interface XY {
  x: number;
  y: number;
}

export interface MapNode {
  s: Stakeholder;
  /** Assigned cell centre, in viewBox units. */
  x: number;
  y: number;
}

/**
 * A cell in open water costs this much extra distance, so land is preferred
 * unless the honest position is genuinely offshore of every land hexagon.
 */
const SEA_PENALTY = 30;

const cellKey = (col: number, row: number) => `${col}:${row}`;
const LAND = new Set(HEXES.map((h) => cellKey(h.col, h.row)));

function centreOf(col: number, row: number): XY {
  return { x: ORIGIN_X + COL_W * col, y: ORIGIN_Y + ROW_H * row };
}

/**
 * One cell per stakeholder. Overrides claim their cell first; everyone else
 * takes the nearest unclaimed lattice position to their coordinates, land
 * preferred. Deterministic: array order, ties broken by row then column.
 */
export function assignCells(): MapNode[] {
  const claimed = new Set<string>();
  const byId = new Map<string, MapNode>();

  for (const s of STAKEHOLDERS) {
    if (!s.hex) continue;
    const [col, row] = s.hex;
    claimed.add(cellKey(col, row));
    byId.set(s.id, { s, ...centreOf(col, row) });
  }

  for (const s of STAKEHOLDERS) {
    if (s.hex) continue;
    const tx = lonToX(s.lon);
    const ty = latToY(s.lat);
    const c0 = Math.round((tx - ORIGIN_X) / COL_W);
    const r0 = Math.round((ty - ORIGIN_Y) / ROW_H);
    let best: { col: number; row: number; score: number } | null = null;
    for (let row = r0 - 8; row <= r0 + 8; row++) {
      if (row < 0 || row > 34) continue;
      for (let col = c0 - 8; col <= c0 + 8; col++) {
        // Only every other (col, row) pair is a lattice position: see PACKED.
        if (col < 0 || col > 151 || (col + row) % 2 === 0) continue;
        if (claimed.has(cellKey(col, row))) continue;
        const c = centreOf(col, row);
        const score =
          Math.hypot(c.x - tx, c.y - ty) +
          (LAND.has(cellKey(col, row)) ? 0 : SEA_PENALTY);
        if (
          !best ||
          score < best.score ||
          (score === best.score &&
            (row < best.row || (row === best.row && col < best.col)))
        ) {
          best = { col, row, score };
        }
      }
    }
    // The window holds hundreds of cells and there are 26 people, so a free
    // cell always exists; the fallback is only for the type system.
    const cell = best ?? { col: c0, row: r0 + ((c0 + r0) % 2 === 0 ? 1 : 0) };
    claimed.add(cellKey(cell.col, cell.row));
    byId.set(s.id, { s, ...centreOf(cell.col, cell.row) });
  }

  return STAKEHOLDERS.map((s) => byId.get(s.id)!);
}
