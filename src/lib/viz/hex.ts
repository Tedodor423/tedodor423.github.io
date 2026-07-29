// Pure hexagon geometry — flat-topped cells, used by CombStrip, CombProgress
// and HexMatrix. Math lives here so components stay declarative React/SVG.

export interface HexGeometry {
  points: string;
  width: number;
  height: number;
}

/** Flat-top hexagon centered at (cx, cy) with circumradius r. */
export function flatTopHex(cx: number, cy: number, r: number): HexGeometry {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return {
    points: pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' '),
    width: 2 * r,
    height: Math.sqrt(3) * r,
  };
}
