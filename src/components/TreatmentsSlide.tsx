import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { useLocation } from "react-router-dom";
import { headingId } from "../utils/headingId";
import {
  DECK_ANCHORS,
  TREATMENTS,
  treatmentsTitle,
  type Charge,
} from "../data/homeDeck";
import { Marked, Runs } from "./Marked";
import { useClock } from "../utils/useClock";
import { REDUCED_MOTION } from "../utils/glide";
import { useMedia } from "../utils/useMedia";
import { DECK_MEDIA, useRide, within, type Span } from "../utils/deck";
import { RnaiChallenges, type ChallengeSteps } from "./RnaiChallenges";
import { AlphaClip } from "./AlphaClip";
import "./TreatmentsSlide.css";

/* Slide four of the home page: the treatments, and the answer.
 *
 * One screen on wax paper. The claim sits upper left in Cubao, two lines,
 * the charges together on the second, and a small bee with a mite on its
 * back crawls just above it, clear of the letters, the clip run at a third
 * of its speed. The two
 * charges, "ineffective" and "toxic", each carry an arrow pointing down;
 * hovering one, tapping it or pressing a key on it brings its evidence in
 * under the claim in a box, and the arrow turns up. Clicking the word again
 * puts the evidence away; hovering only ever opens. Scroll on and, with
 * everything above holding still, "The
 * solution is" comes in at the bottom right; a pause, then "RNA interference".
 *
 * The scroll is the clock, as on slide three: the stage pins, and its first
 * two windows of travel are this slide, with rests at the claim alone, at
 * "The solution is" and at the answer (src/utils/deck.ts). The four windows
 * after them are slide five (RnaiChallenges.tsx), played on this same
 * stage so that "RNA interference" can stay on screen while everything
 * else here leaves. Any evidence the reader has not opened by the
 * time "The solution is" arrives comes in with it, so nobody reaches the
 * answer past an unsupported charge.
 *
 * TEMPORARY HOSTING, as for slide three. The clip is served from
 * public/local/, which is gitignored: bee_with_mite_stacked.mp4, made from
 * bee_with_mite_trans.webm (VP9 with an alpha channel, 1920x1080, 22 s at
 * 60 fps, 17 MB) as a stacked-alpha H.264, 3840x1080, 16 MB, because Safari
 * draws no VP9 alpha (AlphaClip.tsx). It needs its alpha to sit on the
 * page, and the Video Universe player is an iframe that cannot give it one:
 * home.md's TODO carries where it goes instead. Anywhere the file is absent
 * the stage says so.
 *
 * The numbers, and where they stand:
 *
 *   100%   Lamas et al. (bioRxiv, 2025, posted 1 June): 39 mites from 18
 *          colonies in five US commercial operations hit by the early 2025
 *          losses, screened for the Y215H mutation in the octopamine
 *          receptor that marks amitraz resistance. "Of these, 100% had
 *          resistance genotypes." USDA ARS's release of 2 June 2025 reports
 *          the same. A preprint, not yet peer reviewed, and 39 mites. [LIT]
 *   64%    Tang et al., Nature Geoscience 14, 206 to 210 (2021): 64% of
 *          global agricultural land at risk of pesticide pollution from more
 *          than one active ingredient, mapped for 92 active ingredients in
 *          168 countries. [LIT]
 *
 * Mobile first. Stacked, nothing pins: the bee crawls over the claim, the
 * evidence opens in place below it, and the solution follows, running in on
 * a clock once it is on screen. Under prefers-reduced-motion the clip holds
 * its first frame and everything stands at its end.
 */

/* The words, the numbers and their sources are TREATMENTS in
 * src/data/homeDeck.ts, where the search index reads them too. */
const VIDEO = `${import.meta.env.BASE_URL}local/bee_with_mite_stacked.mp4`;
/** The clip's own pace is a scurry; a third of it is a crawl. */
const PACE = 1 / 3;

/* Where each step of the ride sits, counted in windows of scroll from the
 * top of the track. The ride is TRAVEL windows long: two for this slide,
 * four for slide five. */
const TRAVEL = 6;
const at = (windows: number) => windows / TRAVEL;
const span = (from: number, to: number): Span => [at(from), at(to)];

const SOLUTION = span(0.16, 0.64);
const ANSWER = span(1.2, 1.72);
/* Slide five: the rest of this slide leaves while the answer rises. */
const LEAVE = span(2.1, 2.45);
const RISE = span(2.1, 2.9);
const CLAIM = span(2.7, 3.0);
const DRAW = span(2.8, 3.9);
const DEMANDS = span(4.1, 4.4);
const MODEL = span(4.65, 4.9);
const DESIGN = span(5.1, 5.35);
const VIVO = span(5.55, 5.85);
/** The deck's rests inside the ride: "The solution is" in, the answer,
 *  the barriers drawn, "Requiring us to do", and each demand with its
 *  proof (the last is the
 *  ride's end). */
const RESTS = [0.8, 2, 4, 4.5, 5, 5.45, 6].map(at);

const CHARGES = TREATMENTS.charges;
const NONE_OPEN: Record<Charge, boolean> = { ineffective: false, toxic: false };
const ALL_OPEN: Record<Charge, boolean> = { ineffective: true, toxic: true };

/** The charge whose evidence a fragment names (DECK_ANCHORS.evidence), if any. */
const chargeOf = (hash: string): Charge | null =>
  CHARGES.find((charge) => hash === `#${DECK_ANCHORS.evidence(charge)}`) ??
  null;

/* Where a search result lands. Stacked, the evidence box itself carries its
 * anchor. Pinned, the box is inside a stage that pins to the top of the
 * track and plays out over six windows of travel, so an anchor on the box
 * would land part way into the ride; instead a zero-sized marker in the
 * track carries it, at the ride's start for the evidence (the claim and its
 * evidence are what the ride opens on) and at the rest where the barriers
 * are drawn for the challenges (RESTS). The box then takes a different id,
 * so the charge's aria-controls still has something to point at. */
const factId = (charge: Charge, pinned: boolean) =>
  pinned ? `ts-fact-${charge}` : DECK_ANCHORS.evidence(charge);
/** Windows of travel from the top of the track to the challenges' landing. */
const CHALLENGES_LANDING = 4;

/** The bee: runs at PACE, only while the slide is on screen and `active`. */
function useCrawl(stage: RefObject<HTMLElement | null>, active: boolean) {
  const video = useRef<HTMLVideoElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) =>
      setSeen(entry.isIntersecting),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [stage]);

  useEffect(() => {
    const clip = video.current;
    if (!clip) return;
    // Loading resets playbackRate to the default, so set both.
    clip.defaultPlaybackRate = PACE;
    clip.playbackRate = PACE;
    if (REDUCED_MOTION) return;
    if (seen && active) {
      clip.play().catch(() => {
        // Autoplay refused or the file is missing: the bee holds still.
      });
    } else {
      clip.pause();
    }
  }, [seen, active]);

  return video;
}

/** A click this soon after a hover opened the evidence is the same gesture
 *  finishing, not a request to close it again. */
const HOVER_GRACE = 400;

/** One of the claim's two charges, with the arrow that says which way its
 *  evidence will go: down while it is shut, up once it is open. */
function ChargeWord({
  charge,
  controls,
  open,
  onSet,
}: {
  charge: Charge;
  /** The id of the evidence box this word opens. */
  controls: string;
  open: boolean;
  onSet: (charge: Charge, open: boolean) => void;
}) {
  const hoveredOpen = useRef(-Infinity);
  return (
    <button
      type="button"
      className="ts-charge"
      aria-expanded={open}
      aria-controls={controls}
      data-open={open}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse" || open) return;
        hoveredOpen.current = e.timeStamp;
        onSet(charge, true);
      }}
      onClick={(e) => {
        if (e.timeStamp - hoveredOpen.current < HOVER_GRACE) return;
        onSet(charge, !open);
      }}
    >
      <Marked text={charge} />
      <svg className="ts-cue" viewBox="0 0 12 8" aria-hidden="true">
        <path d="M1.4 1.4 6 6 10.6 1.4" />
      </svg>
    </button>
  );
}

export function TreatmentsSlide() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const solution = useRef<HTMLParagraphElement>(null);
  const pinned = useMedia(DECK_MEDIA);
  const p = useRide(track, pinned, RESTS);
  // Stacked, the solution runs in once on a clock instead.
  const arrived = useClock(solution, 1600, 200);
  const [missing, setMissing] = useState(false);
  const lose = useCallback(() => setMissing(true), []);
  // A search result for a charge's evidence carries its anchor in the
  // fragment, and the evidence opens with the page, so the reader lands on
  // it open rather than on a word to hover. Read during the first render,
  // so it is never shut for a frame first.
  const { hash } = useLocation();
  const named = chargeOf(hash);
  const [open, setOpen] = useState(() =>
    named ? { ...NONE_OPEN, [named]: true } : NONE_OPEN,
  );
  useEffect(() => {
    if (named) setOpen((current) => ({ ...current, [named]: true }));
  }, [named]);

  // Stacked, slide five simply follows: nothing leaves, nothing rises, and
  // all of it stands at its end.
  const ride = (s: Span) => (pinned ? within(p, s) : 1);
  const steps = {
    solution: pinned ? within(p, SOLUTION) : Math.min(1, arrived * 2),
    answer: pinned ? within(p, ANSWER) : Math.max(0, arrived * 2 - 1),
    leave: pinned ? within(p, LEAVE) : 0,
    rise: pinned ? within(p, RISE) : 0,
  };
  const challenges: ChallengeSteps = {
    claim: ride(CLAIM),
    draw: ride(DRAW),
    demands: ride(DEMANDS),
    model: ride(MODEL),
    design: ride(DESIGN),
    vivo: ride(VIVO),
  };
  const gone = steps.leave >= 1;
  const video = useCrawl(stage, !gone);
  const style = {
    "--solution": steps.solution,
    "--answer": steps.answer,
    "--leave": steps.leave,
    "--rise": steps.rise,
  } as CSSProperties;

  // The solution never arrives past a charge left unsupported.
  const due = steps.solution > 0;
  useEffect(() => {
    if (due) setOpen(ALL_OPEN);
  }, [due]);

  const setCharge = (charge: Charge, shown: boolean) =>
    setOpen((current) => ({ ...current, [charge]: shown }));

  const id = headingId(treatmentsTitle());

  // <Marked> and <Runs> put a honey background on the words a reader
  // searched for; the section's id is where a result for the claim lands.
  return (
    <section
      className="treatments-slide"
      id={DECK_ANCHORS.treatments}
      aria-labelledby={id}
    >
      <div
        className="ts-track"
        ref={track}
        // Pinned, the ride fills the screen: the menu steps aside (Navbar.tsx).
        data-fullscreen={pinned || undefined}
      >
        {/* The landing markers: see factId. */}
        {pinned && (
          <>
            {CHARGES.map((charge) => (
              <span
                key={charge}
                id={DECK_ANCHORS.evidence(charge)}
                className="ride-landing"
              />
            ))}
            <span
              id={DECK_ANCHORS.challenges}
              className="ride-landing"
              style={{ top: `${CHALLENGES_LANDING * 100}dvh` }}
            />
          </>
        )}
        <div
          className="ts-stage"
          ref={stage}
          style={style}
          data-gone={gone || undefined}
        >
          <div className="ts-upper">
            <h2 className="ts-title" id={id}>
              <span className="ts-line">
                <Marked text={TREATMENTS.lead} />
              </span>{" "}
              <span className="ts-line ts-line--charges">
                <span className="ts-joint">
                  <Marked text={TREATMENTS.are} />
                </span>{" "}
                <ChargeWord
                  charge="ineffective"
                  controls={factId("ineffective", pinned)}
                  open={open.ineffective}
                  onSet={setCharge}
                />{" "}
                <span className="ts-joint">
                  <Marked text={TREATMENTS.and} />
                </span>{" "}
                <ChargeWord
                  charge="toxic"
                  controls={factId("toxic", pinned)}
                  open={open.toxic}
                  onSet={setCharge}
                />
              </span>
            </h2>

            <div className="ts-evidence" aria-live="polite">
              {CHARGES.map((charge) => {
                const { figure, claim, detail, source } =
                  TREATMENTS.evidence[charge];
                return (
                  <div
                    key={charge}
                    id={factId(charge, pinned)}
                    className={`ts-fact ts-fact--${charge}`}
                    data-open={open[charge]}
                  >
                    <p className="ts-claim">
                      <span className="ts-figure">{figure}</span>{" "}
                      <Marked text={claim} />
                    </p>
                    {detail && (
                      <p className="ts-detail">
                        <Marked text={detail} />
                      </p>
                    )}
                    <p className="ts-refs">
                      <span>
                        <Runs runs={source} />
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <p
            className="ts-solution"
            ref={solution}
            data-shown={steps.solution > 0}
          >
            <span className="ts-so">
              <Marked text={TREATMENTS.solution} />
            </span>{" "}
            <span className="ts-answer" data-shown={steps.answer > 0}>
              <Marked text={TREATMENTS.answer} />
            </span>
          </p>

          <RnaiChallenges steps={challenges} pinned={pinned} />

          {!missing && (
            <AlphaClip
              video={video}
              className="ts-bee"
              src={VIDEO}
              onError={lose}
            />
          )}

          {missing && (
            <p className="ts-missing">
              <strong>VIDEO:</strong> a bee carrying a mite,
              bee_with_mite_stacked.mp4. Hosted locally during development; it
              needs a home that keeps its transparency before the freeze.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
