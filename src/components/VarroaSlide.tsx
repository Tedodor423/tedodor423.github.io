import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { headingId } from "../utils/headingId";
import { clamp01, easeOut, useClock } from "../utils/useClock";
import { REDUCED_MOTION } from "../utils/glide";
import { useMedia } from "../utils/useMedia";
import { DECK_MEDIA, useDeckRests } from "../utils/deck";
import { Marked } from "./Marked";
import { VarroaMap } from "./VarroaMap";
import "./VarroaSlide.css";

/* Slide three of the home page: the mite, then the map.
 *
 * Two screens in one. First the mite's footage, coated in ink, with two
 * numbers over it that count up from zero the moment the stage is on
 * screen, as slide two's do. Then, on the next wheel tick, the footage rides
 * off to the left and the colony-loss map rides in from the right, while the
 * numbers shrink into a bar across the top. The map is VarroaMap in its
 * "slide" form: the map alone, filling the window under the bar, only the
 * five countries this wiki argues from pressable, and the detail panel a
 * column beside it. The full figure, with its caption and table, stays on
 * the case-studies page, which the panel points at. The
 * ride is the scroll: the stage pins for one window of travel and --p is
 * how far through it the reader is. Both ends of the ride are rests in the
 * deck (src/utils/deck.ts), like the hero's and slide two's, so a wheel
 * tick rides the whole way and anything that stops part way settles to the
 * nearer end.
 *
 * TEMPORARY HOSTING, as for the hero. The footage is served from
 * public/local/, which is gitignored, because video never ships from this
 * repo. Before the freeze it must switch to the iGEM Video Universe embed of
 * the same clip. Anywhere the file is absent the panel stays ink and says so.
 *
 * The numbers, and where they stand:
 *
 *   1.6 million     Colonies lost by US beekeepers between June 2024 and
 *                   March 2025, commercial operations losing 62% on
 *                   average: Project Apis m.'s colony loss survey, as
 *                   updated in its release of 3 April 2025 ("1.6 million
 *                   colonies lost"; the February release had said over 1.1
 *                   million). USDA
 *                   Agricultural Research Service (June 2025) found deformed
 *                   wing virus A and B and acute bee paralysis virus, all
 *                   carried by varroa, at high levels in every colony it
 *                   sampled, and every mite it collected carried the marker
 *                   for amitraz resistance. [LIT]
 *   over $2 billion The figure the team's jamboree deck opens with. Not yet
 *                   traced to a published source, so it is displayed with
 *                   [FLAG] rather than asserted, per the house rule.
 *
 * Under prefers-reduced-motion the numbers stand at their final values, the
 * footage holds its first frame, and nothing pins or rides: the map simply
 * follows underneath.
 */

const TITLE = "Varroa destructor";

/** The two numbers, at the size the count climbs to. */
const COLONIES_MILLION = 1.6;
const LOSS_BILLION = 2;

/** The ride's two rests, in document coordinates: the track's top, and one window on. */
function restsOf(track: HTMLElement): { a: number; b: number } {
  const rect = track.getBoundingClientRect();
  const a = rect.top + window.scrollY;
  return { a, b: a + rect.height - window.innerHeight };
}

/**
 * How far through the ride the window is, 0 at the first rest to 1 at the
 * second. The rests themselves go to the deck, which does the snapping.
 * Unpinned it is simply 0 and nothing is registered.
 */
function useRide(track: RefObject<HTMLElement | null>, pinned: boolean): number {
  const [progress, setProgress] = useState(0);

  const rests = useCallback(() => {
    const element = track.current;
    if (!pinned || !element) return [];
    const { a, b } = restsOf(element);
    return [a, b];
  }, [track, pinned]);
  useDeckRests(rests);

  useEffect(() => {
    if (!pinned) {
      setProgress(0);
      return;
    }
    const element = track.current;
    if (!element) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const { a, b } = restsOf(element);
      setProgress(b > a ? clamp01((window.scrollY - a) / (b - a)) : 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [track, pinned]);

  return progress;
}

export function VarroaSlide() {
  const track = useRef<HTMLDivElement>(null);
  const stats = useRef<HTMLDivElement>(null);
  const pinned = useMedia(DECK_MEDIA);
  const progress = useRide(track, pinned);
  // The clock watches the numbers themselves, not the stage: stacked, the
  // stage is several windows tall and never a third visible at once.
  const t = useClock(stats);
  const [missing, setMissing] = useState(false);

  // How tall the numbers are once they are a bar, measured at the end of the
  // ride so the map panel keeps exactly that much clear at its top.
  const [bar, setBar] = useState<number | null>(null);
  useEffect(() => {
    const element = stats.current;
    if (!pinned || !element) {
      setBar(null);
      return;
    }
    const measure = () => {
      if (progress >= 0.999) setBar(element.offsetHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [pinned, progress]);

  const colonies = COLONIES_MILLION * easeOut(t);
  const loss = LOSS_BILLION * easeOut(t);
  const id = headingId(TITLE);
  const style = {
    "--p": progress,
    ...(bar ? { "--vs-bar": `${bar}px` } : {}),
  } as CSSProperties;

  return (
    <section className="varroa-slide" aria-labelledby={id}>
      <div className="vs-track" ref={track}>
        <div
          className={`vs-stage${pinned && progress > 0.5 ? " is-map" : ""}`}
          style={style}
        >
          <div className="vs-strip">
            {/* Whichever panel has ridden off screen is inert, so the tab
                order cannot wander into it. */}
            <div className="vs-video" inert={pinned && progress > 0.5}>
              {!missing && (
                <video
                  src={`${import.meta.env.BASE_URL}local/mite_back.mp4`}
                  autoPlay={!REDUCED_MOTION}
                  loop
                  muted
                  playsInline
                  aria-hidden="true"
                  onError={() => setMissing(true)}
                />
              )}
              <div className="vs-scrim" />
            </div>

            <div className="vs-map" inert={pinned && progress < 0.5}>
              <VarroaMap variant="slide" />
            </div>
          </div>

          <div className="vs-stats" ref={stats}>
            <h2 className="vs-title" id={id}>
              {TITLE}
            </h2>

            <div className="vs-pair">
              <div className="vs-stat">
                <h3 className="vs-claim">
                  <span className="vs-when">
                    <span>in ten months</span>
                  </span>
                  <span className="vs-figure">{colonies.toFixed(1)} million</span>
                  <span className="vs-words">
                    <Marked text="honey-bee colonies lost to the viruses varroa carries" />
                  </span>
                </h3>
                <p className="vs-note">
                  <Marked text="US beekeepers, June 2024 to March 2025; commercial operations lost 62% of their colonies. USDA found the viruses varroa spreads at high levels in every colony it sampled, and every mite carrying resistance to the usual treatment." />
                </p>
              </div>

              <div className="vs-stat">
                <h3 className="vs-claim">
                  <span className="vs-when">
                    <span>over</span>
                  </span>
                  <span className="vs-figure">${loss.toFixed(1)} billion</span>
                  <span className="vs-words">
                    <Marked text="in losses every year" />
                  </span>
                </h3>
                <p className="vs-note">
                  <Marked text="The figure our jamboree deck opens with. A published source is still to be traced, so it is shown, not asserted." />
                </p>
              </div>
            </div>

            <p className="vs-refs">
              Project Apis m., US colony loss survey, updated April 2025; USDA
              Agricultural Research Service, June 2025, on the causes{" "}
              <code>[LIT]</code>. Annual loss figure: team jamboree deck, 2026{" "}
              <code>[FLAG]</code>.
            </p>

            {missing && (
              <p className="vs-missing">
                <strong>VIDEO —</strong> the mite, mite_back.mp4. Hosted locally
                during development; to appear here it must be uploaded to the
                iGEM Video Universe and this component pointed at the embed.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
