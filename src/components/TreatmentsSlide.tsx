import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { headingId } from "../utils/headingId";
import {
  DECK_ANCHORS,
  TREATMENTS,
  treatmentsTitle,
  type Charge,
} from "../data/homeDeck";
import { Marked, Runs } from "./Marked";
import { clamp01, useClock } from "../utils/useClock";
import { REDUCED_MOTION } from "../utils/glide";
import { useMedia } from "../utils/useMedia";
import { useScrolledIn } from "../utils/useScrolledIn";
import { DECK_MEDIA, useRide, within, type Span } from "../utils/deck";
import { RnaiChallenges, type ChallengeSteps } from "./RnaiChallenges";
import { AlphaClip } from "./AlphaClip";
import "./TreatmentsSlide.css";

/* Slide four of the home page: the treatments, and the answer.
 *
 * One screen on wax paper. The claim sits upper left in Cubao, two lines,
 * the charges together on the second, and a small bee with a mite on its
 * back crawls over the end of the claim, the clip run at a third of its
 * speed. The two charges, "ineffective" and "toxic", each carry their
 * evidence in a box under the claim, always shown: the 100% under a clip of
 * the mites, the 64% under a photograph of a field being sprayed. Each word
 * is underlined, and the underline runs on, turns and comes down into the
 * top of its box, so the word and what backs it read as one drawn line. The
 * lines draw from the word to the box as the slide scrolls in. Scroll on
 * and, with everything above holding still, "The solution is" comes in at
 * the bottom right; a pause, then "NECTAR".
 *
 * The scroll is the clock, as on slide three: the stage pins, and its first
 * two windows of travel are this slide, with rests at the claim and its
 * evidence, at "The solution is" and at the answer (src/utils/deck.ts). The
 * three windows after them are slide five (RnaiChallenges.tsx), played on
 * this same stage so that "NECTAR" can stay on screen while everything else
 * here leaves.
 *
 * TEMPORARY HOSTING, as for slide three. Both clips are served from
 * public/local/, which is gitignored. The bee is bee_with_mite_stacked.mp4,
 * made from bee_with_mite_trans.webm (VP9 with an alpha channel, 1920x1080,
 * 22 s at 60 fps, 17 MB) as a stacked-alpha H.264, 3840x1080, 16 MB,
 * because Safari draws no VP9 alpha (AlphaClip.tsx). It needs its alpha to
 * sit on the page, and the Video Universe player is an iframe that cannot
 * give it one: home.md's TODO carries where it goes instead. The clip over
 * the 100% is mites-resistance.mp4, Varroa mites crawling through a white
 * powder, cut from images_dev/mites-resistance.mp4 (1920x1080, 3.8 s, with
 * sound, 2.3 MB) to 960x540 H.264 with no sound, 670 KB:
 *
 *   ffmpeg -i mites-resistance.mp4 -an -vf scale=960:540:flags=lanczos
 *     -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p
 *     -movflags +faststart mites-resistance.mp4
 *
 * Anywhere a file is absent its place says so.
 *
 * The photograph over the 64% is not in the repo either. In development it
 * comes from wiki-assets-source/images_dev/web/pesticides.jpg (pesticides.jpg
 * scaled to 1600 px wide, 170 KB) through the images-dev server in
 * vite.config.ts; the published page asks static.igem.wiki for it under
 * assets/home/, where the uploads tool keeps the basename and converts to
 * .avif. Its source and licence are still to be found and credited
 * (home.md).
 *
 * TEMPORARY FALLBACK, as for the SDG images. A published build that cannot
 * load the static.igem.wiki photograph tries public/local/pesticides.jpg,
 * which the GitHub Pages preview fills from images_dev/web/ and the wiki's
 * own CI never has. Once the upload answers, drop `fallback`.
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
 * two boxes stand one under the other below it, the second word's line
 * running down the right margin past the first box, and the solution
 * follows, running in on a clock once it is on screen. Under
 * prefers-reduced-motion the clips hold their first frame and everything
 * stands at its end.
 */

/* The words, the numbers and their sources are TREATMENTS in
 * src/data/homeDeck.ts, where the search index reads them too. */
const LOCAL = `${import.meta.env.BASE_URL}local/`;
const VIDEO = `${LOCAL}bee_with_mite_stacked.mp4`;
/** The bee's own pace is a scurry; a third of it is a crawl. */
const PACE = 1 / 3;

/** What stands at the top of each charge's box. */
const MEDIA: Record<
  Charge,
  { video?: boolean; src: string; fallback?: string; file: string }
> = {
  ineffective: {
    video: true,
    src: `${LOCAL}mites-resistance.mp4`,
    file: "mites-resistance.mp4",
  },
  toxic: {
    src: import.meta.env.DEV
      ? `${import.meta.env.BASE_URL}images-dev/web/pesticides.jpg`
      : "https://static.igem.wiki/teams/6391/wiki/assets/home/pesticides.avif",
    fallback: import.meta.env.DEV ? undefined : `${LOCAL}pesticides.jpg`,
    file: "pesticides.jpg",
  },
};

/* Where each step of the ride sits, counted in windows of scroll from the
 * top of the track. The ride is TRAVEL windows long: two for this slide,
 * three for slide five. */
const TRAVEL = 5;
const at = (windows: number) => windows / TRAVEL;
const span = (from: number, to: number): Span => [at(from), at(to)];

const SOLUTION = span(0.16, 0.64);
const ANSWER = span(1.2, 1.72);
/* Slide five: the rest of this slide leaves while the answer rises. */
const LEAVE = span(2.1, 2.45);
const RISE = span(2.1, 2.9);
const CLAIM = span(2.7, 3.0);
const DEMANDS = span(3.1, 3.4);
const MODEL = span(3.65, 3.9);
const DESIGN = span(4.1, 4.35);
const VIVO = span(4.55, 4.85);
/** The deck's rests inside the ride: "The solution is" in, the answer,
 *  the challenges' claim, "Requiring us to do", and each demand with its
 *  proof (the last is the ride's end). */
const RESTS = [0.8, 2, 3, 3.5, 4, 4.45, 5].map(at);

const CHARGES = TREATMENTS.charges;

/* Where a search result lands. Stacked, the evidence box itself carries its
 * anchor. Pinned, the box is inside a stage that pins to the top of the
 * track and plays out over five windows of travel, so an anchor on the box
 * would land part way into the ride; instead a zero-sized marker in the
 * track carries it, at the ride's start for the evidence (the claim and its
 * evidence are what the ride opens on) and at the rest where the
 * challenges' claim is in (RESTS), and the box carries no id. */
/** Windows of travel from the top of the track to the challenges' landing. */
const CHALLENGES_LANDING = 3;

/** Whether the slide is on screen. */
function useSeen(stage: RefObject<HTMLElement | null>) {
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

  return seen;
}

/** A clip that runs at `pace` while `playing` and holds still otherwise. */
function usePlayback(playing: boolean, pace = 1) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const clip = video.current;
    if (!clip) return;
    // Loading resets playbackRate to the default, so set both.
    clip.defaultPlaybackRate = pace;
    clip.playbackRate = pace;
    if (REDUCED_MOTION) return;
    if (playing) {
      clip.play().catch(() => {
        // Autoplay refused or the file is missing: the clip holds still.
      });
    } else {
      clip.pause();
    }
  }, [playing, pace]);

  return video;
}

/* ---------- the lines from each charge to its evidence ---------- */

interface Box {
  left: number;
  right: number;
  top: number;
}

/** The radius of a line's turns, in px. */
const BEND = 8;
/** How far inside a box's corners a line may come down into it. */
const INSET = 16;
/** How far out from the boxes a line runs down the margin. */
const GUTTER = 8;
/** How far down a box's side a line coming in from the margin meets it. */
const ENTRY = 24;
/** Where the underline sits below the letters' baseline, in ems. */
const UNDER = 0.12;

/**
 * One charge's line, as an SVG path from the far end of its underline to
 * the box. Where an end of the word stands over its box with nothing in
 * between, the underline turns down at that end and comes straight into the
 * box's top edge; the first charge prefers its left end and the last its
 * right, so the two lines open away from each other. Where another box is in
 * the way (stacked, the second box sits under the first), the underline runs
 * on to the right margin, down past whatever is in the way, and comes into
 * the box's side.
 */
function route(
  word: Box,
  y: number,
  box: Box,
  between: Box[],
  first: boolean,
): string {
  const clear = (x: number) =>
    x >= box.left + INSET &&
    x <= box.right - INSET &&
    !between.some((other) => x >= other.left && x <= other.right);
  const drop = (first ? [word.left, word.right] : [word.right, word.left]).find(
    clear,
  );
  // Each line ends in the middle of the box's 2px border.
  if (drop !== undefined) {
    const from = drop === word.left ? word.right : word.left;
    const way = Math.sign(drop - from);
    return [
      `M ${from} ${y}`,
      `H ${drop - way * BEND}`,
      `A ${BEND} ${BEND} 0 0 ${way > 0 ? 1 : 0} ${drop} ${y + BEND}`,
      `V ${box.top + 1}`,
    ].join(" ");
  }
  const side = Math.max(box.right, ...between.map((o) => o.right)) + GUTTER;
  const enter = box.top + ENTRY;
  return [
    `M ${word.left} ${y}`,
    `H ${side - BEND}`,
    `A ${BEND} ${BEND} 0 0 1 ${side} ${y + BEND}`,
    `V ${enter - BEND}`,
    `A ${BEND} ${BEND} 0 0 1 ${side - BEND} ${enter}`,
    `H ${box.right - 1}`,
  ].join(" ");
}

type Elements = Partial<Record<Charge, HTMLElement | null>>;

interface Wires {
  width: number;
  height: number;
  paths: { charge: Charge; d: string }[];
}

/** The lines, measured in the coordinates of `host` and measured again
 *  whenever the layout or the fonts change. */
function useWires(
  host: RefObject<HTMLElement | null>,
  words: RefObject<Elements>,
  baselines: RefObject<Elements>,
  facts: RefObject<Elements>,
  layout: boolean,
): Wires | null {
  const [wires, setWires] = useState<Wires | null>(null);

  useLayoutEffect(() => {
    const frame = host.current;
    if (!frame) return;
    let live = true;
    const measure = () => {
      if (!live) return;
      const origin = frame.getBoundingClientRect();
      const local = (element: HTMLElement): Box => {
        const r = element.getBoundingClientRect();
        return {
          left: r.left - origin.left,
          right: r.right - origin.left,
          top: r.top - origin.top,
        };
      };
      const paths: Wires["paths"] = [];
      CHARGES.forEach((charge, i) => {
        const word = words.current[charge];
        const base = baselines.current[charge];
        const fact = facts.current[charge];
        if (!word || !base || !fact) return;
        const size = parseFloat(getComputedStyle(word).fontSize);
        const y = local(base).top + UNDER * size;
        const box = local(fact);
        const between = CHARGES.filter((other) => other !== charge)
          .map((other) => facts.current[other])
          .filter((other): other is HTMLElement => !!other)
          .map(local)
          .filter((other) => other.top > y && other.top < box.top);
        paths.push({ charge, d: route(local(word), y, box, between, i === 0) });
      });
      setWires({ width: origin.width, height: origin.height, paths });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    for (const charge of CHARGES) {
      const fact = facts.current[charge];
      if (fact) observer.observe(fact);
    }
    // A face arriving moves the words without resizing anything observed.
    document.fonts.ready.then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      live = false;
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [host, words, baselines, facts, layout]);

  return wires;
}

/** The clip or photograph at the top of a charge's box, or, where its file
 *  is absent, a frame of the same size saying which file goes there. */
function FactMedia({ charge, playing }: { charge: Charge; playing: boolean }) {
  const { video, src: first, fallback, file } = MEDIA[charge];
  const clip = usePlayback(playing);
  const sources = fallback ? [first, fallback] : [first];
  const [tried, setTried] = useState(0);
  const lose = () => setTried((n) => n + 1);
  const src = sources[tried];

  if (src === undefined) {
    return (
      <p className="ts-media ts-media--missing">
        <span>
          <strong>{video ? "VIDEO:" : "PHOTO:"}</strong> {file}
        </span>
      </p>
    );
  }
  return video ? (
    <video
      ref={clip}
      className="ts-media"
      src={src}
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
      onError={lose}
    />
  ) : (
    <img
      className="ts-media"
      src={src}
      alt={TREATMENTS.evidence[charge].alt ?? ""}
      loading="lazy"
      decoding="async"
      onError={lose}
    />
  );
}

export function TreatmentsSlide() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const upper = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const solution = useRef<HTMLParagraphElement>(null);
  const words = useRef<Elements>({});
  const baselines = useRef<Elements>({});
  const facts = useRef<Elements>({});
  const pinned = useMedia(DECK_MEDIA);
  const p = useRide(track, pinned, RESTS);
  // Stacked, the solution runs in once on a clock instead.
  const arrived = useClock(solution, 1600, 200);
  const [missing, setMissing] = useState(false);
  const lose = useCallback(() => setMissing(true), []);
  const wires = useWires(upper, words, baselines, facts, pinned);
  // The lines draw from word to box as the slide comes in, the second a
  // beat behind the first.
  const drawn = useScrolledIn(track, title);
  const drawnFor = (i: number) => clamp01((drawn - i * 0.25) / 0.75);

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
    demands: ride(DEMANDS),
    model: ride(MODEL),
    design: ride(DESIGN),
    vivo: ride(VIVO),
  };
  const gone = steps.leave >= 1;
  const seen = useSeen(stage);
  const playing = seen && !gone;
  const bee = usePlayback(playing, PACE);
  const style = {
    "--solution": steps.solution,
    "--answer": steps.answer,
    "--leave": steps.leave,
    "--rise": steps.rise,
  } as CSSProperties;

  const id = headingId(treatmentsTitle());

  // A mouse on a charge or on its box, or the keyboard inside the box, picks
  // the pair out: word, line and border go violet and the box grows a
  // little. Touch has no hover, so a tap leaves it alone.
  const [hot, setHot] = useState<Charge | null>(null);
  const pointer = (charge: Charge) => ({
    onPointerEnter: (e: ReactPointerEvent) => {
      if (e.pointerType === "mouse") setHot(charge);
    },
    onPointerLeave: (e: ReactPointerEvent) => {
      if (e.pointerType === "mouse")
        setHot((current) => (current === charge ? null : current));
    },
  });
  const isHot = (charge: Charge) => hot === charge || undefined;

  /** A charge in the claim: the word, and a mark of no size on its
   *  baseline, which is where its underline is measured from. */
  const chargeWord = (charge: Charge) => (
    <span
      className="ts-charge"
      data-hot={isHot(charge)}
      {...pointer(charge)}
      ref={(element) => {
        words.current[charge] = element;
      }}
    >
      <Marked text={charge} />
      <span
        className="ts-base"
        ref={(element) => {
          baselines.current[charge] = element;
        }}
      />
    </span>
  );

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
        {/* The landing markers: see CHALLENGES_LANDING. */}
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
          <div className="ts-upper" ref={upper}>
            <h2 className="ts-title" id={id} ref={title}>
              <span className="ts-line">
                <Marked text={TREATMENTS.lead} />
              </span>{" "}
              <span className="ts-line ts-line--charges">
                <span className="ts-joint">
                  <Marked text={TREATMENTS.are} />
                </span>{" "}
                {chargeWord("ineffective")}{" "}
                <span className="ts-joint">
                  <Marked text={TREATMENTS.and} />
                </span>{" "}
                {chargeWord("toxic")}
              </span>
            </h2>

            <div className="ts-evidence">
              {CHARGES.map((charge) => {
                const { figure, claim, detail, source } =
                  TREATMENTS.evidence[charge];
                return (
                  <div
                    key={charge}
                    id={pinned ? undefined : DECK_ANCHORS.evidence(charge)}
                    ref={(element) => {
                      facts.current[charge] = element;
                    }}
                    className={`ts-fact ts-fact--${charge}`}
                    data-hot={isHot(charge)}
                    {...pointer(charge)}
                    onFocus={() => setHot(charge)}
                    onBlur={() =>
                      setHot((current) => (current === charge ? null : current))
                    }
                  >
                    <FactMedia charge={charge} playing={playing} />
                    <div className="ts-words">
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
                  </div>
                );
              })}
            </div>

            {wires && (
              <svg
                className="ts-wires"
                width={wires.width}
                height={wires.height}
                viewBox={`0 0 ${wires.width} ${wires.height}`}
                aria-hidden="true"
              >
                {wires.paths.map(({ charge, d }, i) => (
                  <path
                    key={charge}
                    d={d}
                    data-hot={isHot(charge)}
                    pathLength={1}
                    style={{
                      strokeDashoffset: 1 - drawnFor(i),
                      visibility: drawnFor(i) > 0 ? undefined : "hidden",
                    }}
                  />
                ))}
              </svg>
            )}
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
              video={bee}
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
