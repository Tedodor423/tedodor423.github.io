import "./HpStats.css";

/* The interview record's headline numbers, in one row.
 *
 * The figures were given by the team (26 Sep 2026) and replace the old
 * intro paragraph's "26 conversations, six countries, one pivot". The
 * timeline's summary table says "About 30" conversations, consistent with
 * the 30 here. If the record changes, change these with it.
 */

const STATS = [
  { value: "30", label: "in-depth interviews" },
  { value: "4", label: "continents" },
  { value: "3", label: "pivots" },
];

export function HpStats() {
  return (
    <ul className="hp-stats">
      {STATS.map((stat) => (
        <li key={stat.label}>
          <span className="hp-stat-value">{stat.value}</span>
          <span className="hp-stat-label">{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}
