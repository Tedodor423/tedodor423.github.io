/* What the bee minigame shares with the rest of the wiki. The scene itself
 * (components/BeeScene.tsx) is mounted outside the routes, so anything on a
 * page that wants to reach it goes through here rather than importing the
 * component: a window event for the reset, and the one question of whether
 * this browser shows bees at all.
 */

/** The bee's two wingbeat frames, from static.igem.wiki via the uploads tool;
 *  sources in the gitignored wiki-assets-source/images_dev/. bee1.svg is
 *  194 x 164, bee2.svg 194 x 171.33: same width, so they stack top-left. */
export const BEE_FRAMES = [
  "https://static.igem.wiki/teams/6391/wiki/assets/bee1.svg",
  "https://static.igem.wiki/teams/6391/wiki/assets/bee2.svg",
];

/** Sent by the reset button on the bee lab page (components/BeeReset.tsx). */
export const RESET_EVENT = "nectar:bees-reset";

/** Zero the tally and send the swarm back down to what an empty tally has
 *  paid for. */
export function resetBees() {
  window.dispatchEvent(new Event(RESET_EVENT));
}

/** Whether this browser shows the bees at all: they need a cursor to follow,
 *  and they stay away for anyone who has asked for reduced motion. */
export function beesAvailable(): boolean {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
