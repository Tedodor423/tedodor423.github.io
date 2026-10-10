import "./SdgPage.css";
import { SDG_OVERVIEW, useSdgImage } from "../data/sdgGoals";

/* The overview of all seventeen goals, under the sustainability page's opening
 * paragraph. Third-party artwork, so the credit sits directly beneath it, as
 * iGEM requires. Until the upload is done the published page has nothing to
 * load, and the figure stands down rather than showing a broken image. */
export function SdgOverview() {
  const { src, failed, onError } = useSdgImage(SDG_OVERVIEW);
  if (failed) return null;

  return (
    <figure className="sdg-overview">
      <img
        src={src}
        alt="The seventeen UN Sustainable Development Goals, each a numbered coloured tile with its icon, around the Global Goals wheel."
        width={1534}
        height={889}
        loading="lazy"
        onError={onError}
      />
      <figcaption>Source: United Nations.</figcaption>
    </figure>
  );
}
