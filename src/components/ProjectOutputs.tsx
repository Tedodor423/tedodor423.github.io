import { Link } from "react-router-dom";
import { headingId } from "../utils/headingId";
import "./ProjectOutputs.css";

/* What the project produced, by area, at the top of Results.
 *
 * Three strata down the page — bee lab, wet and dry lab, human practices —
 * each a horizontal run of what that area made. Titles only: this is the way
 * in to the things themselves, and every tile goes to the page that holds the
 * thing rather than describing it here. Nothing is folded behind a hover, so
 * the house rule that nothing may exist only behind a pointer is satisfied by
 * construction.
 *
 * COLOUR MEANS THE AREA. The band label keeps the page's own h2 treatment, the
 * honey rule underneath it, drawn in the area's colour instead: the lab tokens
 * in brand.css that the engineering comb and the timeline already use, so two
 * figures on this wiki never disagree about which colour the bee lab is.
 * Human practices has no lab token and takes its timeline lane. Every band
 * prints its name, so colour is never the only key.
 *
 * NOT CARDS IN A ROW. Checked against the thirty tells in the
 * anti-vibecoded-design skill, because a grid of titled boxes is one wrong
 * turn from the template default: no gradients, no drop shadows, no glass, no
 * icons and no emoji; flat wax fill, one hairline border, the house --radius;
 * five, four and four to a row rather than three; and the rows sit in
 * full-width strata with the band's own rule, not as a bento of equal cards.
 * The hover state changes the fill and the border and moves nothing.
 *
 * WHAT A TITLE MAY CLAIM. A tile is a claim like any other line on the wiki.
 * The design pipeline's code is not published yet and the hive insert's print
 * files are not uploaded, both of which are open TODOs on their own pages
 * (software.md, hardware.md), so neither tile says "published code" or
 * "printable". When those land, the titles can say so.
 */

interface Output {
  title: string;
  /** Where the thing itself is. An in-page hash is fine; ScrollToHash lands it. */
  to: string;
}

interface Area {
  /** The band label, and the id other pages can link the band by. */
  name: string;
  /** Which colour the band's rule takes; see the tokens in ProjectOutputs.css. */
  area: "bee" | "lab" | "hp";
  outputs: Output[];
}

const AREAS: Area[] = [
  {
    name: "Bee lab",
    area: "bee",
    outputs: [
      { title: "Experiments and protocols", to: "/bee-lab-experiments" },
      {
        title: "Measurement in bee material",
        to: "/results#measuring-it-in-bee-material",
      },
      { title: "Guide for iGEM teams", to: "/working-with-bees" },
      { title: "Guide for beekeepers", to: "/user-manual" },
      { title: "3D-printed hive insert", to: "/hardware" },
    ],
  },
  {
    name: "Wet lab and dry lab",
    area: "lab",
    outputs: [
      { title: "dsRNA design pipeline", to: "/software" },
      { title: "Designed parts", to: "/results#parts" },
      { title: "Experiments and protocols", to: "/wet-lab-experiments" },
      { title: "Measurement procedures", to: "/measurement" },
    ],
  },
  {
    name: "Human practices",
    area: "hp",
    outputs: [
      { title: "HIVE model", to: "/human-practices" },
      { title: "Economic model", to: "/economic-modelling" },
      { title: "Case studies", to: "/case-studies" },
      { title: "Sustainable development", to: "/sustainability" },
    ],
  },
];

export function ProjectOutputs() {
  return (
    <div className="project-outputs">
      {AREAS.map((area) => (
        <section
          key={area.name}
          className="project-outputs__band"
          data-area={area.area}
        >
          <h2 id={headingId(area.name)}>{area.name}</h2>
          <ul className="project-outputs__row">
            {area.outputs.map((output) => (
              <li key={output.to + output.title}>
                <Link to={output.to}>{output.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
