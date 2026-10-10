import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { headingId } from "../utils/headingId";
import { REDUCED_MOTION } from "../utils/glide";
import { clamp01, easeOut } from "../utils/useClock";
import "./RnaiChallenges.css";

/* Slide five of the home page: what RNA interference is up against, and
 * what answering it took.
 *
 * It plays on slide four's stage (TreatmentsSlide.tsx), because it starts
 * from slide four's last words: everything else there leaves, "RNA
 * interference" rises to the top of the screen without moving sideways,
 * and from under it an arrow draws down through the six barriers between
 * RNAi and the field. With it the claim comes in on the left. Then
 * "Requiring us to do", and the three things the barriers demanded, one
 * word to a row, one at a time: each word comes in with its proof beside
 * it, the word a little ahead, the proof's number counting up with the
 * scroll.
 *
 * The host hands over how far each step has run, 0 to 1. Stacked, on a
 * phone or under reduced motion, every step stands at 1 and the slide
 * simply flows under slide four.
 *
 * TEMPORARY HOSTING, as for the other slides: the fold clip is served from
 * the gitignored public/local/. It is vdchibin_fold.mkv cropped past the
 * recorder's panel edges to the structure's middle, its white multiplied
 * into the wax (#fbf7ec) so it sits on the page with no box, and scaled to
 * 960x704, H.264, 9 s, no sound, 2.1 MB:
 *
 *   ffmpeg -i vdchibin_fold.mkv -filter_complex "[0:v]crop=1440:1056:270:4,
 *     scale=960:704,format=gbrp[v];color=c=0xfbf7ec:s=960x704:r=60,
 *     format=gbrp[bg];[v][bg]blend=all_mode=multiply:shortest=1,
 *     format=yuv420p" -an -c:v libx264 -crf 24 -movflags +faststart
 *     vdchibin_fold.mp4
 *
 * The bee-lab clip is beehive_work.mkv (HEVC, which Chrome on Windows will
 * not always play) re-encoded to H.264, 960x540, 30 fps, no sound, 4.1 MB.
 * The file keeps the recording's own speed (14 s of clip for 14.3 s of
 * source), which reads as slow on the page, so it plays at RATE times that.
 *
 * Upload both to the Video Universe before the freeze; home.md's TODO
 * carries that, the cursor left in the fold recording, and the captions.
 *
 * The numbers: the six models are the six on the model page. The
 * experiment count and the bee-lab hours are the team's, not yet tallied
 * anywhere in the record, so they carry [FLAG] until they are (home.md).
 */

export type ChallengeSteps = {
  /** The claim on the left. */
  claim: number;
  /** The arrow, drawn from the top down; each barrier comes in as it passes. */
  draw: number;
  /** "Requiring us to do". */
  demands: number;
  /** The proofs, one each. */
  model: number;
  design: number;
  vivo: number;
};

const TITLE = "…This technology faces numerous challenges";
const LOCAL = `${import.meta.env.BASE_URL}local/`;
/** The numbers count up with the scroll, done well before their proof is
 *  fully in: at this multiple of the proof's own step. */
const COUNT_PACE = 1.6;
/** Each demand's word is fully in by this multiple of its proof's step. */
const WORD_PACE = 2;

const BARRIERS = [
  "Rational target selection",
  "Off-target screening",
  "Single-target resistance",
  "Manufacturing cost",
  "Environmental degradation",
  "Inefficient delivery",
];

type Demand = "model" | "design" | "vivo";

const DEMANDS: {
  key: Demand;
  joint?: string;
  word: string;
  /** The proof, with its number (if any) between `lead` and `tail`. */
  lead?: string;
  count?: number;
  tail: string;
  /** A clip beside the proof, from public/local/ for now. */
  clip?: string;
  /** How much faster than the file the clip plays. */
  rate?: number;
  to: string;
  page: string;
  flag?: boolean;
}[] = [
  {
    key: "model",
    word: "Modelling,",
    count: 6,
    tail: " different models and a novel dsRNA-design pipeline",
    clip: "vdchibin_fold.mp4",
    to: "/model",
    page: "The models",
  },
  {
    key: "design",
    word: "Design",
    tail: "Hundreds of experiments, an infinite amount of time in the wet lab",
    to: "/wet-lab-experiments",
    page: "The wet lab",
    flag: true,
  },
  {
    key: "vivo",
    joint: "and",
    word: "In-vivo measurement",
    lead: "Unprecedented scale of honeybee testing: ",
    count: 1200,
    tail: "+ hours in our bee lab",
    clip: "beehive_work.mp4",
    rate: 2,
    to: "/bee-lab",
    page: "The bee lab",
    flag: true,
  },
];

/** A proof's clip, running only while its proof is on screen. */
function Clip({
  src,
  rate = 1,
  playing,
}: {
  src: string;
  rate?: number;
  playing: boolean;
}) {
  const clip = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = clip.current;
    if (!video) return;
    // Loading resets playbackRate to the default, so set both.
    video.defaultPlaybackRate = rate;
    video.playbackRate = rate;
    if (REDUCED_MOTION) return;
    if (playing) {
      video.play().catch(() => {
        // Autoplay refused or the file is missing: the clip holds still.
      });
    } else {
      video.pause();
    }
  }, [rate, playing]);

  return (
    <video
      ref={clip}
      className="rc-clip"
      src={LOCAL + src}
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}

export function RnaiChallenges({
  steps,
  pinned,
}: {
  steps: ChallengeSteps;
  pinned: boolean;
}) {
  const id = headingId(TITLE);
  const style = {
    "--claim": steps.claim,
    "--draw": steps.draw,
    "--demands": steps.demands,
  } as CSSProperties;

  return (
    <section className="rc" aria-labelledby={id} style={style}>
      <h2 className="rc-claim" id={id} data-shown={steps.claim > 0}>
        {TITLE}
      </h2>

      <div className="rc-arrow" data-shown={steps.draw > 0}>
        <span className="rc-shaft" aria-hidden="true" />
        <ol className="rc-barriers">
          {BARRIERS.map((barrier, i) => (
            <li
              key={barrier}
              style={{ "--at": (i + 0.5) / BARRIERS.length } as CSSProperties}
            >
              {barrier}
            </li>
          ))}
        </ol>
      </div>

      <div className="rc-demands" data-shown={steps.demands > 0}>
        <p className="rc-requiring">Requiring us to do</p>
        <dl className="rc-rows">
          {DEMANDS.map(({ key, joint, word, lead, count, tail, clip, rate, to, page, flag }) => (
            <div key={key} className="rc-row" data-clip={clip ? true : undefined}>
              <dt
                className="rc-word"
                data-shown={steps[key] > 0}
                style={{ "--in": clamp01(steps[key] * WORD_PACE) } as CSSProperties}
              >
                {joint && <span className="rc-joint">{joint} </span>}
                {word}
              </dt>
              <dd
                className="rc-proof"
                data-shown={steps[key] > 0}
                style={{ "--in": steps[key] } as CSSProperties}
              >
                <p className="rc-says">
                  {lead}
                  {count !== undefined && (
                    <>
                      <span className="rc-count" aria-hidden="true">
                        {Math.round(count * easeOut(clamp01(steps[key] * COUNT_PACE)))}
                      </span>
                      <span className="visually-hidden">{count}</span>
                    </>
                  )}
                  {tail}
                </p>
                {clip && (
                  <Clip src={clip} rate={rate} playing={pinned ? steps[key] > 0 : true} />
                )}
                <p className="rc-more">
                  <Link to={to}>{page}</Link>
                  {flag && (
                    <>
                      {" "}
                      <code>[FLAG]</code>
                    </>
                  )}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
