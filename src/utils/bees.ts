/* What the bee minigame shares with the rest of the wiki. The scene itself
 * (components/BeeScene.tsx) is mounted outside the routes, so anything on a
 * page that wants to reach it goes through here rather than importing the
 * component: a window event for the reset, and the one question of whether
 * this browser shows bees at all.
 */

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
