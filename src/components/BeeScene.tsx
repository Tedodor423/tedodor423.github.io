import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { findFlowerSpots, type FlowerSpot } from "../utils/flowerSpots";
import "./BeeScene.css";

/* DEV ASSETS — temporary.
 *
 * Served straight out of the gitignored wiki-assets-source/images_dev/ folder
 * by the Vite dev server. They are NOT in the repository, so on the deployed
 * site these URLs 404, the artwork never appears, and the build still succeeds.
 *
 * TO SHIP: upload the files via the iGEM uploads tool and replace the base
 * below with the static.igem.wiki folder it returns. Nothing else changes.
 * Note the uploads tool rewrites raster images to .avif; SVG passes through,
 * but read the URL the tool gives back rather than assuming the extension.
 */
const DEV_ASSETS = `${import.meta.env.BASE_URL}wiki-assets-source/images_dev/`;
const BEE_FRAMES = [`${DEV_ASSETS}bee1.svg`, `${DEV_ASSETS}bee2.svg`];
const FLOWER_SRC = `${DEV_ASSETS}flower.svg`;
const POLLEN_SRC = `${DEV_ASSETS}pollen.svg`;
const HIVE_SRC = `${DEV_ASSETS}hive.svg`;

/* ---------- artwork geometry ----------
 * Fractions of each drawing's own box, measured off the SVGs. Re-measure these
 * if the artwork is redrawn; everything else is expressed in terms of them. */

/** flower.svg is 108.67 x 124.67: stem base at the bottom left, bloom above.
 *  bee1.svg is 194 x 164; that ratio lives in the CSS as an aspect-ratio. */
const FLOWER_ASPECT = 124.67 / 108.67;
/** Where the stem meets the ground, as a fraction of the flower's width. */
const FLOWER_STEM_X = 0.24;
/** Centre of the bloom, and its radius, as fractions of the flower's width. */
const BLOOM = { x: 0.53, y: 0.33, r: 0.33 };
/** hive.svg is a hive box with a dark entrance blob across its middle. This is
 *  the centre of that blob, as a fraction of the drawing's box. */
const HIVE_DOOR = { x: 0.49, y: 0.63 };

/* ---------- sizes, px ---------- */

const BEE_WIDTH = 56;
/** Flowers vary in size. Height, since the stem sets how tall one looks. */
const FLOWER_HEIGHT: [number, number] = [22, 46];
const POLLEN_SIZE = 9;

/* ---------- flight ---------- */

/** Flat out, px/s. Each bee gets its own multiplier on this. */
const MAX_SPEED = 950;
/** Beyond this the bee flies at full speed, px. */
const SLOW_RADIUS = 300;
/** Inside this it has stopped. The gap it keeps from the cursor when parked. */
const STOP_RADIUS = 52;
/** Horizontal leeway before it turns round, px. Wider than STOP_RADIUS so a
 *  parked bee never flips back and forth on small cursor movements. */
const TURN_DEADZONE = 90;
/** How fast velocity swings round to the wanted direction, per second. Lower is
 *  a wider, lazier arc; higher snaps to the cursor. */
const STEER = 5;
/** Wingbeat, ms per frame. */
const FLAP_MS = 80;
/** Idle bob: px and Hz. Drawn only, never fed back into the physics, so a bee
 *  still comes to a real stop. */
const BOB_PX = 4;
const BOB_HZ = 1.1;
/** Clamp on the frame delta so a backgrounded tab cannot teleport the bees. */
const MAX_DT = 1 / 20;

/* ---------- the swarm ---------- */

const MAX_BEES = 12;
/** What the hive starts with, before any flower has been brought in. */
const INITIAL_BEES = 1;
/** Flowers to the bee. The tally persists, so the swarm a visitor comes back
 *  to is the one their collection has paid for. */
const FLOWERS_PER_BEE = 4;
/* Every bee chases the cursor just as hard however many there are. What grows
 * with the swarm is how far apart they hold: each keeps its own station on a
 * slowly turning ring around the cursor, so a crowd reads as a cloud rather
 * than a stack, and all of them still answer the cursor immediately. */

/** Radius of the ring, per extra bee beyond the first, px. It goes up with the
 *  square root of the count, because area is what has to grow, not radius. */
const SPREAD_PER_BEE = 42;
const SPREAD_MAX = 150;
/** The ring is wider than it is tall: screens are, and so is reading. */
const SPREAD_FLATTEN = 0.72;
/** How fast a bee's station drifts round the ring, radians/s. */
const STATION_DRIFT: [number, number] = [-0.45, 0.45];
/** Bees inside this of each other push apart, px, and how hard, px/s². The
 *  stations do most of the spacing; this only catches the overlaps. */
const SEPARATION = 52;
const SEPARATION_FORCE = 700;

/* A still cursor is not an instruction to hover in place. After a moment the
 * bees stop treating it as the centre of the world and go about their own
 * business, and the first twitch of the mouse brings them straight back. */

/** How long the cursor has to sit still before they start to wander, ms. */
const IDLE_AFTER_MS = 2600;
/** And how long the drift takes to come fully on, ms. Eased rather than
 *  switched, so nothing lurches at the moment it fires. */
const IDLE_RAMP_MS = 1400;
/** How long a wandering bee keeps the same waypoint, ms. */
const ROAM_MS: [number, number] = [2600, 6000];
/** Close enough to a waypoint to want a new one, px. */
const ROAM_ARRIVE = 70;

/* ---------- the hive ---------- */

/** Clearance between the bottom of the menu and the hive, px. */
const HIVE_NAV_GAP = 18;
/** Bees come out of the hive one at a time rather than in a clump, ms. */
const HATCH_STAGGER_MS = 170;
/** The hive's reaction to letting a bee out, ms. Matches the CSS. */
const HIVE_PULSE_MS = 420;
/** Time for a retired bee to shrink away before it is thrown out, ms. Matches
 *  the .bee-body transition. */
const BEE_FADE_MS = 280;

/* ---------- flowers ---------- */

/** Clear space between the text and a gutter flower, px. */
const FLOWER_GAP = 7;
/** Flowers are meant to be a small surprise, not weather. A few a minute, and
 *  never more than a handful on the page at once. */
const MAX_FLOWERS = 4;
const FLOWER_SPAWN_MS: [number, number] = [8000, 17000];
/** How long to wait before looking again when there was nowhere to put one. */
const FLOWER_RETRY_MS = 2500;
/** Keep flowers from clustering, px. */
const FLOWER_MIN_APART = 90;
/** How often a flower goes mid-text rather than out in a margin. */
const INLINE_SHARE = 0.45;
/** Bee centre to bloom centre, px, before the bloom's own radius is added. A
 *  bee parks STOP_RADIUS from the cursor, so this is "put the cursor on it". */
const POLLINATE_RADIUS = 58;

/* ---------- pollen ---------- */

const POLLEN_COUNT = 6;
/** Delay between grains leaving the bee, ms. */
const POLLEN_STAGGER = 55;
const POLLEN_FLIGHT_MS: [number, number] = [380, 520];
/** How far a grain bows off the straight line, px. */
const POLLEN_BOW = 22;
/** Pause between the last grain landing and the flower going, ms. */
const FLOWER_HOLD_MS = 420;
/** Must match the CSS wilt and the pollen fade. */
const FLOWER_FADE_MS = 430;

/** Where the running total of pollinated flowers is kept, and whether the
 *  visitor has switched the whole thing off. */
const STORAGE_KEY = "nectar.flowers-pollinated";
const RUNNING_KEY = "nectar.bees-on";
/** Whether the one-time step aside on first navigation has been spent. */
const STOOD_ASIDE_KEY = "nectar.bees-stood-aside";

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const randIn = ([min, max]: [number, number]) => rand(min, max);
const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);
const pick = <T,>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];

/** The tally survives navigation and reloads. Storage can be unavailable or
 *  throw outright (private windows, blocked site data), and a decoration is
 *  never worth an exception, so both ends are wrapped. */
function readCollected(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const value = raw === null ? 0 : Number.parseInt(raw, 10);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  } catch {
    return 0;
  }
}

/** Whether the bees are showing. A preference, so it outlives the page. */
function readRunning(): boolean {
  try {
    return window.localStorage.getItem(RUNNING_KEY) !== "off";
  } catch {
    return true;
  }
}

/** The bees get out of the way once, the first time a visitor goes off to read
 *  something. After that the switch is theirs: if they turn the bees back on,
 *  they stay on. Spent once and remembered, so it is not re-offered on every
 *  visit to someone who has already made their choice. */
function hasStoodAside(): boolean {
  try {
    return window.localStorage.getItem(STOOD_ASIDE_KEY) === "yes";
  } catch {
    // Without storage the courtesy happens once per page load instead, which
    // is the nearest honest thing to once ever.
    return false;
  }
}

function markStoodAside() {
  try {
    window.localStorage.setItem(STOOD_ASIDE_KEY, "yes");
  } catch {
    // Nothing to do: see above.
  }
}

interface Vec {
  x: number;
  y: number;
}

interface Bee {
  el: HTMLDivElement;
  /** The layer carrying scaleX. Facing is written straight to it. */
  flip: HTMLDivElement;
  pos: Vec;
  vel: Vec;
  facingRight: boolean;
  /** Where this bee is headed while the cursor is still. */
  roam: Vec;
  roamAt: number;
  /** Where on the ring round the cursor this bee holds, and how fast that
   *  station drifts. */
  angle: number;
  drift: number;
  /** This bee's share of the ring's radius, so the cloud is not a circle. */
  reach: number;
  /** Per-bee variation, so a swarm does not move as one object. */
  speed: number;
  bobPhase: number;
  flapMs: number;
  flapAt: number;
  frame: number;
}

/** One grain, in flight or landed. Document coordinates throughout, so that
 *  scrolling mid-flight keeps it glued to the page rather than the screen. */
interface Grain {
  el: HTMLImageElement;
  from: Vec;
  to: Vec;
  /** Signed perpendicular offset at the midpoint of the flight, px. */
  bow: number;
  start: number;
  dur: number;
}

interface Flower {
  el: HTMLDivElement;
  /** Document coordinates of the artwork's top left corner. */
  x: number;
  y: number;
  width: number;
  /** Document coordinates of the point the stem grows from. */
  stem: Vec;
  /** Document coordinates of the centre of the bloom. */
  bloom: Vec;
  grains: Grain[];
  /** 0 until a bee reaches it. */
  hitAt: number;
  /** When the last grain lands. */
  coveredAt: number;
  fading: boolean;
}

/**
 * The wiki's bees.
 *
 * Bees stream out of the hive when the page opens and fly to the cursor,
 * slowing to a hover as they get close. Leave the mouse alone for a few
 * seconds and they drift off about their own business until it moves again.
 * The hive itself is the switch: click it to put the bees away, click it again
 * to bring them back. Flowers grow out of lines of text, and steering a bee onto one
 * pollinates it: pollen crosses to the bloom, covers it, the flower closes up,
 * and the hive in the top right counts it. Bees never go into the hive; they
 * only ever come out of it.
 *
 * Every fourth flower brought in hatches another bee, up to a ceiling, so the
 * swarm is the record of what has been collected. The more bees there are the wider they
 * hold around the cursor, but each one answers it exactly as fast as a lone bee
 * would.
 *
 * The hive goes faint while they are away, and the choice is remembered. It
 * also puts itself away the first time a visitor navigates off the page they
 * arrived on, once ever, so that nothing buzzes over the wiki while they read.
 *
 * Only the two buttons are interactive. Everything else is `aria-hidden`, never
 * takes a pointer event, and is not rendered at all for a coarse pointer (no
 * cursor to follow) or when the visitor has asked for reduced motion.
 *
 * The whole scene runs off one requestAnimationFrame loop writing transforms
 * straight to the DOM, and every moving part is created imperatively. There is
 * deliberately no React state per frame: that would re-render the page sixty
 * times a second to move a bee four pixels. The two things React does own, the
 * bee count and the tally, change only when a person clicks or a flower is
 * pollinated.
 */
export function BeeScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const hiveRef = useRef<HTMLButtonElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  // Settings, not state: decided once, on mount.
  const [enabled] = useState(
    () =>
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [collected, setCollected] = useState(readCollected);
  const [running, setRunning] = useState(readRunning);

  // Flower anchors are coordinates measured against the page that is on
  // screen, so a route change invalidates every one of them. The scene itself
  // stays mounted and the bees carry on between pages.
  const { pathname } = useLocation();
  const dropFlowers = useRef<(() => void) | null>(null);
  useEffect(() => {
    dropFlowers.current?.();
  }, [pathname]);

  /** The page the scene came up on. Moving off it is the signal that someone
   *  has come to read rather than to play. */
  const openedOn = useRef(pathname);
  const [stoodAside, setStoodAside] = useState(hasStoodAside);
  useEffect(() => {
    if (pathname === openedOn.current || stoodAside) return;
    openedOn.current = pathname;
    setStoodAside(true);
    markStoodAside();
    setRunning(false);
  }, [pathname, stoodAside]);

  // The loop reads both of these rather than depending on them, so that
  // switching off or bringing in a flower never tears the scene down and
  // rebuilds it.
  const runningRef = useRef(running);
  const collectedRef = useRef(collected);
  runningRef.current = running;
  collectedRef.current = collected;

  useEffect(() => {
    try {
      window.localStorage.setItem(RUNNING_KEY, running ? "on" : "off");
    } catch {
      // No storage: the switch still works for this page.
    }
  }, [running]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(collected));
    } catch {
      // No storage: the tally still works, it just will not outlive the page.
    }
  }, [collected]);

  // Nudge the number when it changes, but not for the value restored on load.
  // Comparing against the last value rather than tracking a first run keeps
  // this right under StrictMode, which runs every effect twice on mount.
  const shownCount = useRef(collected);
  useEffect(() => {
    const el = countRef.current;
    if (shownCount.current === collected) return;
    shownCount.current = collected;
    if (!el) return;
    el.classList.remove("is-counting");
    void el.offsetWidth; // restart the animation rather than queue it
    el.classList.add("is-counting");
  }, [collected]);

  useEffect(() => {
    const scene = sceneRef.current;
    const layer = layerRef.current;
    const cluster = clusterRef.current;
    const hive = hiveRef.current;
    if (!enabled || !scene || !layer || !cluster || !hive) return;

    /** The menu is sticky and slides away on the way down the page. The hive
     *  rides with it, so its live bottom edge is read every frame. Unlike the
     *  page body it is outside the routes, so this one element lasts. */
    const nav = document.querySelector<HTMLElement>(".site-nav");

    /* ---------- state ---------- */

    /** Null until the cursor first moves. Until then we have no idea where it
     *  is, so a lone bee hovers where it woke up. */
    let cursor: Vec | null = null;
    /** The entrance, in viewport coordinates. Recomputed every frame, because
     *  the hive moves with the menu. */
    let door: Vec = { x: 0, y: 0 };
    let pulseTimer = 0;

    const bees: Bee[] = [];
    /** What the simulation currently reflects, against runningRef, which is
     *  what the switch says. They differ for exactly one frame. */
    let live = runningRef.current;
    /** Bees on their way out, each with the moment it gets thrown away. They
     *  are off the books for the simulation but still drawn, so they coast to
     *  a stop instead of freezing mid-air. */
    const fading: Array<{ bee: Bee; removeAt: number }> = [];
    /** Bees still queued to come out of the hive, and when the next one is
     *  due. They emerge one at a time rather than in a clump. */
    let pendingHatch = 0;
    let nextHatchAt = 0;
    /** When the cursor last moved, for deciding the swarm has been left to its
     *  own devices. */
    let lastMoveAt = performance.now();

    const flowers: Flower[] = [];
    let nextFlowerAt = performance.now() + rand(900, 2200);

    let last = performance.now();
    let raf = 0;

    const randomPoint = (): Vec => ({
      x: rand(80, Math.max(120, window.innerWidth - 80)),
      y: rand(120, Math.max(200, window.innerHeight - 80)),
    });

    /* ---------- bees ---------- */

    const makeBee = (at: Vec, vel: Vec): Bee => {
      const el = document.createElement("div");
      el.className = "bee";
      el.dataset.frame = "0";
      el.style.setProperty("--bee-width", `${BEE_WIDTH}px`);

      const flip = document.createElement("div");
      flip.className = "bee-flip";
      const body = document.createElement("div");
      body.className = "bee-body";

      // Both frames stay in the DOM and load up front. The wingbeat only
      // switches which one is showing, so it never waits on a request.
      BEE_FRAMES.forEach((src, i) => {
        const img = document.createElement("img");
        img.className = `bee-frame bee-frame-${i}`;
        img.src = src;
        img.alt = "";
        body.appendChild(img);
      });

      flip.appendChild(body);
      el.appendChild(flip);
      layer.appendChild(el);

      const now = performance.now();
      return {
        el,
        flip,
        pos: { ...at },
        vel: { ...vel },
        facingRight: false,
        roam: randomPoint(),
        roamAt: now + randIn(ROAM_MS),
        angle: Math.random() * Math.PI * 2,
        drift: randIn(STATION_DRIFT),
        reach: rand(0.55, 1.15),
        speed: MAX_SPEED * rand(0.85, 1.15),
        bobPhase: Math.random() * Math.PI * 2,
        flapMs: FLAP_MS * rand(0.85, 1.2),
        flapAt: now + Math.random() * FLAP_MS,
        frame: 0,
      };
    };

    const drawBee = (bee: Bee, now: number, dt: number) => {
      bee.pos.x += bee.vel.x * dt;
      bee.pos.y += bee.vel.y * dt;

      if (now - bee.flapAt >= bee.flapMs) {
        bee.flapAt = now;
        bee.frame ^= 1;
        bee.el.dataset.frame = String(bee.frame);
      }

      const bob =
        Math.sin((now / 1000) * BOB_HZ * 2 * Math.PI + bee.bobPhase) * BOB_PX;
      bee.el.style.transform =
        `translate3d(${bee.pos.x.toFixed(2)}px, ${(bee.pos.y + bob).toFixed(2)}px, 0)` +
        " translate(-50%, -50%)";
    };

    /** The hive sits below the menu, which is sticky and slides away on the
     *  way down the page. Called once before the loop as well as every frame:
     *  the first tick reads the hive's box, and without this that read would
     *  come back from before the cluster had been put anywhere, hatching the
     *  first bee a hive's height above the door. */
    const placeCluster = (navBottom: number) => {
      cluster.style.transform = `translate3d(0, ${(navBottom + HIVE_NAV_GAP).toFixed(1)}px, 0)`;
    };

    const pulseHive = () => {
      hive.classList.add("is-busy");
      window.clearTimeout(pulseTimer);
      pulseTimer = window.setTimeout(
        () => hive.classList.remove("is-busy"),
        HIVE_PULSE_MS,
      );
    };

    /** Everything the scene owns, put back the way it starts. The swarm is as
     *  big as the flower bank has earned, so a visitor who comes back to a
     *  full tally comes back to a full hive. */
    const restock = () => {
      const earned = Math.min(
        MAX_BEES,
        INITIAL_BEES + Math.floor(collectedRef.current / FLOWERS_PER_BEE),
      );

      // Queued, not placed: every bee arrives by flying out of the hive, so a
      // fresh page opens with the swarm streaming out of the door rather than
      // already scattered across the screen.
      pendingHatch = earned;
      nextHatchAt = 0;
      nextFlowerAt = performance.now() + randIn(FLOWER_SPAWN_MS);
    };

    /** One bee, out of the door, heading down and to the left, which is also
     *  the way the artwork faces. */
    const hatch = () => {
      bees.push(makeBee(door, { x: rand(-240, -110), y: rand(60, 210) }));
      pulseHive();
    };

    /** Off the books and shrinking away. Used both by the switch and by a bee
     *  that has been sent into the hive. */
    const retire = (bee: Bee, now: number) => {
      bee.el.classList.add("is-gone");
      fading.push({ bee, removeAt: now + BEE_FADE_MS });
    };

    /** Switched off. Bees shrink away where they are and the flowers close up,
     *  both using the animations they already have, and the DOM is emptied a
     *  beat later. */
    const teardown = () => {
      const now = performance.now();
      bees.splice(0, bees.length).forEach((bee) => retire(bee, now));
      pendingHatch = 0;
      clearFlowers();
    };

    /* ---------- flowers ---------- */

    const spawnFlower = (now: number, navBottom: number) => {
      // Measuring the page is not free, so a failed attempt waits rather than
      // retrying on the next frame.
      nextFlowerAt = now + FLOWER_RETRY_MS;
      if (flowers.length >= MAX_FLOWERS) return;

      // Looked up per spawn, not once: routing swaps the page body out from
      // under us, and a node held from a previous page measures as nothing.
      // A page without prose, such as the 404, simply grows no flowers.
      const article = document.querySelector(".markdown-page");
      if (!article) return;

      const height = randIn(FLOWER_HEIGHT);
      const width = height / FLOWER_ASPECT;
      const scrollY = window.scrollY;

      const usable = findFlowerSpots(article, {
        width,
        stemFrac: FLOWER_STEM_X,
        gap: FLOWER_GAP,
      }).filter((spot) => {
        // On screen, below the menu, and not on top of another flower.
        const top = spot.stemY - height - scrollY;
        if (top < navBottom + 4) return false;
        if (spot.stemY - scrollY > window.innerHeight - 8) return false;
        return !flowers.some(
          (other) =>
            Math.hypot(other.stem.x - spot.stemX, other.stem.y - spot.stemY) <
            FLOWER_MIN_APART,
        );
      });

      if (usable.length === 0) return;

      // Both kinds are worth having, so the choice is made between the two
      // pools rather than across one list that the margins would dominate.
      const margins = usable.filter((spot) => spot.side !== "inline");
      const inline = usable.filter((spot) => spot.side === "inline");
      const pool =
        inline.length > 0 &&
        (margins.length === 0 || Math.random() < INLINE_SHARE)
          ? inline
          : margins;
      if (pool.length === 0) return;

      const spot: FlowerSpot = pick(pool);
      // At the end of a line the flower is mirrored, so that the stem leans
      // away from the text instead of back across it. Mid-text it can go
      // either way.
      const mirrored =
        spot.side === "end" || (spot.side === "inline" && Math.random() < 0.5);

      const stemFrac = mirrored ? 1 - FLOWER_STEM_X : FLOWER_STEM_X;
      const bloomFrac = mirrored ? 1 - BLOOM.x : BLOOM.x;
      const x = spot.stemX - stemFrac * width;
      const y = spot.stemY - height;

      const el = document.createElement("div");
      el.className = mirrored ? "flower is-mirrored" : "flower";
      el.style.setProperty("--flower-width", `${width.toFixed(2)}px`);
      el.style.setProperty("--flower-height", `${height.toFixed(2)}px`);
      el.style.setProperty("--stem-x", `${(stemFrac * 100).toFixed(1)}%`);

      const grow = document.createElement("div");
      grow.className = "flower-grow";
      const img = document.createElement("img");
      img.src = FLOWER_SRC;
      img.alt = "";
      grow.appendChild(img);
      el.appendChild(grow);
      layer.appendChild(el);

      flowers.push({
        el,
        x,
        y,
        width,
        stem: { x: spot.stemX, y: spot.stemY },
        bloom: { x: x + bloomFrac * width, y: y + BLOOM.y * height },
        grains: [],
        hitAt: 0,
        coveredAt: 0,
        fading: false,
      });

      nextFlowerAt = now + randIn(FLOWER_SPAWN_MS);
    };

    const pollinate = (flower: Flower, bee: Bee, now: number) => {
      flower.hitAt = now;

      // Counted here rather than inside the state updater, because whether
      // this one pays for a bee depends on the new total and a React updater
      // must stay free of side effects.
      const total = collectedRef.current + 1;
      collectedRef.current = total;
      setCollected(total);

      // Every fourth flower is another bee out of the hive. This is the only
      // way the swarm grows, which is what makes a flower worth chasing.
      if (total % FLOWERS_PER_BEE === 0 && bees.length < MAX_BEES) {
        bees.push(makeBee(door, { x: rand(-240, -110), y: rand(60, 210) }));
        pulseHive();
      }

      // Bees are tracked in viewport coordinates, flowers in document ones.
      // Pollen belongs to the page, so it launches from the bee's position
      // on the page.
      const origin: Vec = {
        x: bee.pos.x + window.scrollX,
        y: bee.pos.y + window.scrollY,
      };

      for (let i = 0; i < POLLEN_COUNT; i++) {
        const el = document.createElement("img");
        el.className = "pollen";
        el.src = POLLEN_SRC;
        el.alt = "";
        el.style.width = `${POLLEN_SIZE}px`;
        layer.appendChild(el);

        // Scattered over the face of the bloom rather than all on its centre,
        // so that together they cover it.
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.sqrt(Math.random()) * BLOOM.r * flower.width * 0.85;
        const start = now + i * POLLEN_STAGGER;
        const dur = randIn(POLLEN_FLIGHT_MS);

        flower.grains.push({
          el,
          from: { x: origin.x + rand(-8, 8), y: origin.y + rand(-8, 8) },
          to: {
            x: flower.bloom.x + Math.cos(angle) * spread,
            y: flower.bloom.y + Math.sin(angle) * spread,
          },
          bow: rand(-POLLEN_BOW, POLLEN_BOW),
          start,
          dur,
        });

        flower.coveredAt = Math.max(flower.coveredAt, start + dur);
      }
    };

    const removeFlower = (index: number) => {
      const flower = flowers[index];
      flower.grains.forEach((grain) => grain.el.remove());
      flower.el.remove();
      flowers.splice(index, 1);
    };

    /** Anchors are measured against the current layout, so a reflow invalidates
     *  every one of them. Cheaper and more honest to clear and regrow. */
    const clearFlowers = () => {
      for (let i = flowers.length - 1; i >= 0; i--) removeFlower(i);
    };
    dropFlowers.current = clearFlowers;

    /* ---------- the loop ---------- */

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, MAX_DT);
      last = now;

      /* --- every layout read the frame needs, taken together --- */

      const navBottom = nav
        ? Math.max(nav.getBoundingClientRect().bottom, 0)
        : 0;
      const hiveRect = hive.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      door = {
        x: hiveRect.left + hiveRect.width * HIVE_DOOR.x,
        y: hiveRect.top + hiveRect.height * HIVE_DOOR.y,
      };

      /* --- the hive rides with the menu --- */

      placeCluster(navBottom);

      /* --- the switch --- */

      if (runningRef.current !== live) {
        live = runningRef.current;
        if (live) restock();
        else teardown();
      }

      /* --- one bee out of the door at a time --- */

      if (pendingHatch > 0 && now >= nextHatchAt) {
        pendingHatch -= 1;
        nextHatchAt = now + HATCH_STAGGER_MS;
        hatch();
      }

      /* --- steering --- */

      // Nothing has touched the mouse for a while, so stop treating it as the
      // centre of the world. Ramped rather than switched, and reset by the
      // first movement.
      const idleness = clamp(
        (now - lastMoveAt - IDLE_AFTER_MS) / IDLE_RAMP_MS,
        0,
        1,
      );

      // How wide the swarm holds around the cursor. Square root, because it is
      // the area the bees need, not the radius. One bee sits on the cursor
      // exactly; none of them chases it any less hard than that.
      const spread = Math.min(
        SPREAD_MAX,
        SPREAD_PER_BEE * Math.sqrt(Math.max(0, bees.length - 1)),
      );

      for (let i = bees.length - 1; i >= 0; i--) {
        const bee = bees[i];

        // The station turns slowly, so the cloud circulates instead of holding
        // a fixed formation.
        bee.angle += bee.drift * dt;

        // A new waypoint when this one is stale or reached, whether or not the
        // bee is currently using it, so a drift that starts has somewhere to
        // go from the first frame.
        if (
          now >= bee.roamAt ||
          Math.hypot(bee.roam.x - bee.pos.x, bee.roam.y - bee.pos.y) <
            ROAM_ARRIVE
        ) {
          bee.roam = randomPoint();
          bee.roamAt = now + randIn(ROAM_MS);
        }

        let target: Vec | null;
        if (cursor) {
          // Its own place in the cloud, not the cursor itself. The offset is a
          // fixed vector, so the bee tracks the cursor exactly as fast as a
          // lone one would; it simply arrives beside it. As the cursor goes
          // stale that place slides across to the bee's own waypoint.
          const radius = spread * bee.reach;
          const station = {
            x: cursor.x + Math.cos(bee.angle) * radius,
            y: cursor.y + Math.sin(bee.angle) * radius * SPREAD_FLATTEN,
          };
          target =
            idleness === 0
              ? station
              : {
                  x: station.x + (bee.roam.x - station.x) * idleness,
                  y: station.y + (bee.roam.y - station.y) * idleness,
                };
        } else {
          // The cursor has not moved at all yet, so there is nowhere to be
          // except wherever this bee is headed anyway.
          target = bee.roam;
        }

        if (!target) continue;

        const dx = target.x - bee.pos.x;
        const dy = target.y - bee.pos.y;
        const dist = Math.hypot(dx, dy) || 1;

        // Full speed far out, nothing at all inside the stop radius, squared
        // in between so the last stretch of the approach is gentle.
        const ramp = clamp(
          (dist - STOP_RADIUS) / (SLOW_RADIUS - STOP_RADIUS),
          0,
          1,
        );
        const speed = bee.speed * ramp * ramp;

        // Ease the velocity towards the wanted one rather than setting it, so
        // a bee banks into a new heading instead of snapping to it.
        const k = 1 - Math.exp(-STEER * dt);
        bee.vel.x += ((dx / dist) * speed - bee.vel.x) * k;
        bee.vel.y += ((dy / dist) * speed - bee.vel.y) * k;

        // Only turn when the target is clearly to one side. Inside the
        // deadzone a bee keeps whatever way it was facing, which is what stops
        // it flickering left and right while it hovers.
        if (Math.abs(dx) > TURN_DEADZONE) {
          const wantsRight = dx > 0;
          if (wantsRight !== bee.facingRight) {
            bee.facingRight = wantsRight;
            bee.flip.style.transform = wantsRight ? "scaleX(-1)" : "scaleX(1)";
          }
        }
      }

      /* --- keep the swarm from piling into one bee-shaped heap --- */

      for (let i = 0; i < bees.length; i++) {
        const a = bees[i];
        for (let j = i + 1; j < bees.length; j++) {
          const b = bees[j];

          let dx = a.pos.x - b.pos.x;
          let dy = a.pos.y - b.pos.y;
          let d2 = dx * dx + dy * dy;

          // Exactly coincident, which happens when two come out of the hive
          // together: pick a direction rather than dividing by zero.
          if (d2 < 0.01) {
            const angle = Math.random() * Math.PI * 2;
            dx = Math.cos(angle);
            dy = Math.sin(angle);
            d2 = 1;
          }
          if (d2 >= SEPARATION * SEPARATION) continue;

          const d = Math.sqrt(d2);
          const push = ((SEPARATION - d) / SEPARATION) * SEPARATION_FORCE * dt;
          a.vel.x += (dx / d) * push;
          a.vel.y += (dy / d) * push;
          b.vel.x -= (dx / d) * push;
          b.vel.y -= (dy / d) * push;
        }
      }

      /* --- move and draw, including anything on its way out --- */

      for (const bee of bees) drawBee(bee, now, dt);
      for (let i = fading.length - 1; i >= 0; i--) {
        const leaving = fading[i];
        if (now >= leaving.removeAt) {
          leaving.bee.el.remove();
          fading.splice(i, 1);
        } else {
          drawBee(leaving.bee, now, dt);
        }
      }

      if (!live) {
        raf = requestAnimationFrame(tick);
        return;
      }

      /* --- flowers and pollen --- */

      if (now >= nextFlowerAt) spawnFlower(now, navBottom);

      for (let i = flowers.length - 1; i >= 0; i--) {
        const flower = flowers[i];

        flower.el.style.transform = `translate3d(${(flower.x - scrollX).toFixed(
          2,
        )}px, ${(flower.y - scrollY).toFixed(2)}px, 0)`;

        if (flower.hitAt === 0) {
          const reach = POLLINATE_RADIUS + BLOOM.r * flower.width;
          const bx = flower.bloom.x - scrollX;
          const by = flower.bloom.y - scrollY;
          for (const bee of bees) {
            if (Math.hypot(bx - bee.pos.x, by - bee.pos.y) < reach) {
              pollinate(flower, bee, now);
              break;
            }
          }
        }

        for (const grain of flower.grains) {
          const raw = (now - grain.start) / grain.dur;
          const t = clamp(raw, 0, 1);
          const eased = 1 - Math.pow(1 - t, 3);

          const dx = grain.to.x - grain.from.x;
          const dy = grain.to.y - grain.from.y;
          const len = Math.hypot(dx, dy) || 1;
          // Bow the flight perpendicular to its own line, so a grain drifts
          // across rather than tracking a ruler.
          const arc = Math.sin(Math.PI * eased) * grain.bow;

          const x = grain.from.x + dx * eased + (-dy / len) * arc;
          const y = grain.from.y + dy * eased + (dx / len) * arc;
          const scale = 0.7 + 0.3 * eased;

          grain.el.style.transform =
            `translate3d(${(x - scrollX - POLLEN_SIZE / 2).toFixed(2)}px, ` +
            `${(y - scrollY - POLLEN_SIZE / 2).toFixed(2)}px, 0) ` +
            `scale(${scale.toFixed(3)})`;
          if (raw >= 0 && !flower.fading) grain.el.style.opacity = "1";
        }

        if (flower.hitAt !== 0 && !flower.fading) {
          if (now >= flower.coveredAt + FLOWER_HOLD_MS) {
            flower.fading = true;
            flower.el.classList.add("is-done");
            flower.grains.forEach((grain) => (grain.el.style.opacity = "0"));
          }
        } else if (
          flower.fading &&
          now >= flower.coveredAt + FLOWER_HOLD_MS + FLOWER_FADE_MS
        ) {
          removeFlower(i);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    /* ---------- wiring ---------- */

    const onPointerMove = (event: PointerEvent) => {
      cursor = { x: event.clientX, y: event.clientY };
      lastMoveAt = performance.now();
    };

    const onResize = () => {
      clearFlowers();
      for (const bee of bees) {
        bee.pos.x = clamp(bee.pos.x, 20, window.innerWidth - 20);
        bee.pos.y = clamp(bee.pos.y, 20, window.innerHeight - 20);
      }
    };

    placeCluster(nav ? Math.max(nav.getBoundingClientRect().bottom, 0) : 0);

    // The loop only restocks on a change of switch, so the opening hive has to
    // be filled here.
    if (live) restock();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(pulseTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      clearFlowers();
      dropFlowers.current = null;
      bees.forEach((bee) => bee.el.remove());
      fading.forEach((leaving) => leaving.bee.el.remove());
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="bee-scene" ref={sceneRef}>
      {/* Bees, flowers and pollen are created by the loop and live here. */}
      <div className="bee-layer" ref={layerRef} aria-hidden="true" />

      <div
        className={running ? "hive-cluster" : "hive-cluster is-off"}
        ref={clusterRef}
      >
        <button
          type="button"
          role="switch"
          className="hive"
          ref={hiveRef}
          aria-checked={running}
          aria-label="Bees"
          onClick={() => setRunning((on) => !on)}
        >
          <img className="hive-art" src={HIVE_SRC} alt="" aria-hidden="true" />
          <span className="hive-count" ref={countRef}>
            {/* Says what the number counts without a word of explanation. */}
            <img className="hive-count-icon" src={FLOWER_SRC} alt="" />
            <span className="visually-hidden">Flowers pollinated: </span>
            {collected}
          </span>
        </button>

        {/* Shown on hover and on focus. The hive already carries its name and
            state for assistive tech, so this is decoration of it. */}
        <span className="hive-tip" aria-hidden="true">
          {running ? "Put bees away" : "Bring bees back"}
        </span>
      </div>
    </div>
  );
}
