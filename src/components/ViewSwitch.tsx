import { Link } from "react-router-dom";
import type { SwitchInfo } from "../utils/getPathMapping";
import "./ViewSwitch.css";

/* The switch at the top of a switcher page (Page.switcher in pages.ts): one
 * large tile per view, the open one in honey. Each tile is a link to that
 * view's own URL, so the switch is ordinary navigation: it works without
 * script, the back button steps between views, and a view can be linked.
 *
 * The hexagon in each tile is the switch's position marker, filled for the
 * open view and empty for the other, in the comb shape the rest of the site
 * is built from. */
export function ViewSwitch({ info }: { info: SwitchInfo }) {
  return (
    <nav className="view-switch" aria-label={info.title}>
      <ul>
        {info.views.map((view, i) => {
          const on = i === info.active;
          return (
            <li key={view.path}>
              <Link
                to={view.path}
                className={on ? "is-on" : undefined}
                aria-current={on ? "page" : undefined}
              >
                <span className="vs-name">
                  <svg className="vs-hex" viewBox="-10 -10 20 20" aria-hidden>
                    <polygon points="0,-8 6.93,-4 6.93,4 0,8 -6.93,4 -6.93,-4" />
                  </svg>
                  {view.name}
                </span>
                {view.lead && <span className="vs-lead">{view.lead}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
