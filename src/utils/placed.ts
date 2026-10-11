/* Navigation state for a link that has already put the window where its
 * fragment names.
 *
 * A link that moves the window itself, with an animation of its own (the
 * stakeholder map shrinking into the small map beside an interview, and
 * growing back), still puts its fragment in the address, so the address is
 * a permalink to where the reader now is. It passes PLACED as the
 * navigation's state, and ScrollToHash leaves the window to it.
 */

export const PLACED = { placed: true };

/** Whether a navigation's state says the window is already in place. */
export function isPlaced(state: unknown): boolean {
  return (
    typeof state === "object" &&
    state !== null &&
    (state as { placed?: unknown }).placed === true
  );
}
