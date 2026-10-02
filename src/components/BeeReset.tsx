import { useState } from "react";
import { beesAvailable, resetBees } from "../utils/bees";
import "./BeeReset.css";

/* The reset for the bee minigame's flower tally, placed at the foot of the
 * bee lab page through the `bee-reset` slot. The scene lives outside the
 * routes, so the button only sends word (see resetBees in utils/bees.ts).
 *
 * Not rendered where the bees never appear, since there is no tally there
 * worth resetting.
 */
export function BeeReset() {
  const [available] = useState(beesAvailable);
  const [done, setDone] = useState(false);

  if (!available) return null;

  return (
    <div className="bee-reset">
      <button
        type="button"
        className="bee-reset-button"
        onClick={() => {
          // The tally cannot be brought back, so ask first.
          if (!window.confirm("ARE YOU SURE?")) return;
          resetBees();
          setDone(true);
        }}
      >
        {done ? "Bee counter reset" : "Reset bee counter"}
      </button>
    </div>
  );
}
