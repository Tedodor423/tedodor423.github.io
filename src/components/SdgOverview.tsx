import "./SdgPage.css";
import { useState } from "react";
import { SDG_OVERVIEW, sdgImage } from "../data/sdgGoals";

/* The overview of all seventeen goals, under the sustainability page's opening
 * paragraph. Third-party artwork, so the credit sits directly beneath it, as
 * iGEM requires. Until the upload is done the published page has nothing to
 * load, and the figure stands down rather than showing a broken image. */
export function SdgOverview() {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <figure className="sdg-overview">
      <img
        src={sdgImage(SDG_OVERVIEW)}
        alt="The seventeen UN Sustainable Development Goals, each a numbered coloured tile with its icon, around the Global Goals wheel."
        width={1534}
        height={889}
        loading="lazy"
        onError={() => setFailed(true)}
      />
      <figcaption>Source: United Nations.</figcaption>
    </figure>
  );
}
