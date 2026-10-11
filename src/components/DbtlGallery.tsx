import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { useLocation } from "react-router-dom";
import {
  CYCLES,
  FAMILIES,
  LAB_NAME,
  LAB_ORDER,
  splitName,
  type Lab,
} from "../utils/dbtlCycles";
import { layOutComb, slantOf } from "../utils/combLayout";
import { cycleIcon } from "../data/cycleIcons";
import { DbtlFamilyPanel } from "./DbtlFamilyPanel";
import "./DbtlGallery.css";

/* The engineering comb.
 *
 * One hexagon per overarching cycle, which here means one per workstream: all of
 * 1.1 to 1.4 are turns of the same question and live in the same cell. Six cells,
 * on a real staggered lattice rather than a grid of cards. Clicking one opens it
 * across the full width of the comb, wider than it is tall, and the rest flow
 * below it; what is inside is DbtlFamilyPanel.
 *
 * Nothing here is authored. Every word comes from the files in
 * src/content/cycles/, grouped by the `##` sections of
 * src/content/cycle-families.md. A cycle with a beat still unwritten says so
 * rather than having one invented for it.
 *
 * Where the cells go is combLayout.ts, which is pure geometry and has no opinion
 * about cycles.
 *
 * ONE NODE PER CELL, open or closed. The outer div carries the box, the clip-path
 * and the transitions, and the button or the panel goes inside it. It has to be
 * that way round: if the open state rendered a different element, React would
 * replace the DOM node and the browser would have nothing to animate between, so
 * the cell would snap to its new size while its neighbours glided.
 */

/** Where a hexagon's drawing was on screen just before its cell opened or
 * closed: the centre and size of the drawing itself, which is not always the
 * img's box (the opened one is contained in a box of its own). */
interface Flight {
  x: number;
  y: number;
  w: number;
  /** False when the cell was being hovered, which folds the icon away. */
  shown: boolean;
  at: number;
}

function measure(img: HTMLImageElement): Flight {
  const box = img.getBoundingClientRect();
  const fit =
    img.naturalWidth && img.naturalHeight
      ? Math.min(box.width / img.naturalWidth, box.height / img.naturalHeight)
      : 0;
  return {
    x: box.left + box.width / 2,
    y: box.top + box.height / 2,
    w: fit ? img.naturalWidth * fit : box.width,
    shown: box.height > 2,
    at: performance.now(),
  };
}

/** The src that worked for each family, so a remounted icon (the cell opening
 * or closing) does not try static.igem.wiki again and flicker while it fails,
 * and the drawing's proportions, which size its box in the opened cell. */
const WORKING = new Map<string, { src: string; aspect: number }>();

/** A hexagon's drawn icon. Decorative: the name under it says the same thing,
 * so it carries no alt text. Falls back once to the local copy while the
 * upload is pending (see cycleIcons.ts), then hides rather than show a broken
 * image.
 *
 * The same drawing sits in the middle of a closed cell and in the top-left
 * corner of an opened one, and it travels between the two with the cell. The
 * two are different elements, so the travel is a FLIP: the gallery measures
 * the old one just before the state changes, and the new one starts out drawn
 * there and eases to where it belongs, on the same curve and in the same time
 * as the cell's own box. Skipped under prefers-reduced-motion. */
function CycleIcon({
  familyId,
  className,
  flights,
}: {
  familyId: string;
  className: string;
  flights: RefObject<Map<string, Flight>>;
}) {
  const icon = cycleIcon(familyId);
  const [src, setSrc] = useState(() => WORKING.get(familyId)?.src ?? icon?.src);
  const [aspect, setAspect] = useState(() => WORKING.get(familyId)?.aspect);
  const img = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const from = flights.current?.get(familyId);
    const node = img.current;
    /* Read but never deleted: StrictMode runs this twice on mount, and the
       second run has to find it too. The timestamp is what retires it. */
    if (!from || !node || performance.now() - from.at > 250) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const to = measure(node);
    if (!to.shown || to.w === 0) return;
    const scale = from.shown && from.w > 0 ? from.w / to.w : 0.4;
    const flight = node.animate(
      [
        {
          transform: `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${scale})`,
          opacity: from.shown ? 1 : 0,
        },
        { transform: "none", opacity: 1 },
      ],
      { duration: 400, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" },
    );
    return () => flight.cancel();
  }, [familyId, flights]);

  if (!icon || !src) return null;
  return (
    <img
      ref={img}
      className={className}
      data-icon={familyId}
      src={src}
      alt=""
      draggable={false}
      style={aspect ? ({ "--aspect": aspect } as CSSProperties) : undefined}
      onLoad={(event) => {
        const { naturalWidth: w, naturalHeight: h } = event.currentTarget;
        const known = h ? w / h : 1;
        WORKING.set(familyId, { src, aspect: known });
        setAspect(known);
      }}
      onError={() => setSrc(src === icon.fallback ? undefined : icon.fallback)}
    />
  );
}

/** The family a `#cycle-4-1` fragment belongs to, and the cycle it named. */
function findByHash(hash: string): { family: string; cycle: string } | null {
  const wanted = decodeURIComponent(hash.replace(/^#/, ""));
  if (!wanted) return null;

  const family = FAMILIES.find((one) => one.id === wanted);
  if (family) return { family: family.id, cycle: "" };

  if (!CYCLES.some((one) => one.id === wanted)) return null;
  const owner = FAMILIES.find((one) =>
    one.cycles.some((cycle) => cycle.id === wanted),
  );
  return owner ? { family: owner.id, cycle: wanted } : null;
}

export function DbtlGallery() {
  const { hash } = useLocation();
  // Read from the hash during the first render rather than in an effect, so a
  // link into a cycle does not show the closed comb for a frame first.
  const [target, setTarget] = useState(() => findByHash(hash));
  const [openId, setOpenId] = useState<string | null>(
    () => findByHash(hash)?.family ?? null,
  );
  const [lab, setLab] = useState<Lab | null>(null);
  const [width, setWidth] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const buttons = useRef<Partial<Record<Lab, HTMLButtonElement | null>>>({});
  /** Where the pressed filter's bottom edge and the comb sit inside .dbtl. */
  const [anchor, setAnchor] = useState<{
    bx: number;
    by: number;
    fx: number;
    fy: number;
  } | null>(null);
  /** The cell a close came from, so its hexagon gets the focus back. */
  const handBack = useRef<string | null>(null);
  /** Where each icon was just before its cell opened or closed (CycleIcon). */
  const flights = useRef(new Map<string, Flight>());
  const takeOff = (id: string) => {
    const icon = frame.current?.querySelector<HTMLImageElement>(
      `[data-icon="${id}"]`,
    );
    if (icon) flights.current.set(id, measure(icon));
  };

  useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const watch = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    watch.observe(node);
    return () => watch.disconnect();
  }, []);

  /* A link from anywhere else on the wiki, or a search result, names a cycle:
   * /engineering#cycle-4-1. Open the workstream it belongs to and put it on
   * screen; the panel scrolls its own text to the right turn. */
  useEffect(() => {
    const found = findByHash(hash);
    if (!found) return;
    setTarget(found);
    setOpenId(found.family);
    const id = requestAnimationFrame(() => {
      document
        .getElementById(found.family)
        ?.scrollIntoView({ block: "center" });
    });
    return () => cancelAnimationFrame(id);
  }, [hash]);

  useEffect(() => {
    if (openId !== null || handBack.current === null) return;
    const id = handBack.current;
    handBack.current = null;
    frame.current
      ?.querySelector<HTMLButtonElement>(`[data-family="${id}"]`)
      ?.focus();
  }, [openId]);

  const shut = (id: string) => {
    takeOff(id);
    handBack.current = id;
    setTarget(null);
    setOpenId(null);
  };

  /* Clicking away closes: on the comb between the cells, on the page beside it,
   * the lab buttons, anywhere that is not the open panel itself. Clicking another
   * hexagon is not "away": it opens that one instead. */
  useEffect(() => {
    if (!openId) return;
    const away = (event: PointerEvent) => {
      const spot = event.target as Element | null;
      if (spot?.closest('[data-state="open"]') || spot?.closest(".dbtl-shut")) {
        return;
      }
      takeOff(openId);
      handBack.current = openId;
      setTarget(null);
      setOpenId(null);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [openId]);

  /* The comb is clustered by lab, in the order of the filter buttons, and the
   * lab being filtered for moves to the front. The packer fills from the top in
   * a snake (see combLayout.ts), so this is all it takes to bring that lab's
   * cells to the top and keep each lab in one patch; the cells keep their keys,
   * so they glide there rather than jumping. Within a lab the order is the one
   * in cycle-families.md. */
  const order = useMemo(() => {
    const labs = lab
      ? [lab, ...LAB_ORDER.filter((key) => key !== lab)]
      : LAB_ORDER;
    return labs.flatMap((key) =>
      FAMILIES.filter((one) => one.lab === key).map((one) => one.id),
    );
  }, [lab]);

  const { placed, height } = useMemo(() => {
    if (width <= 0) return { placed: [], height: 0 };
    const { seats, height } = layOutComb(order, width, openId);
    const byId = new Map(FAMILIES.map((one) => [one.id, one]));
    const placed = seats.map((seat) => ({
      family: byId.get(seat.id)!,
      box: seat.box,
      open: seat.open,
    }));
    return { placed, height };
  }, [width, openId, order]);

  /* The connector from a pressed filter to its lab's cells. The button is
   * measured, the cells are not: their boxes are the layout's destination, so the
   * line is drawn to where they are going, and it only starts drawing (CSS) once
   * they have got there. */
  useLayoutEffect(() => {
    const button = lab ? buttons.current[lab] : null;
    if (!button || !root.current || !frame.current) {
      setAnchor(null);
      return;
    }
    const base = root.current.getBoundingClientRect();
    const b = button.getBoundingClientRect();
    const f = frame.current.getBoundingClientRect();
    setAnchor({
      bx: b.left + b.width / 2 - base.left,
      by: b.bottom - base.top,
      fx: f.left - base.left,
      fy: f.top - base.top,
    });
  }, [lab, width]);

  /* The lab's cells in the top band of the comb: its first row, which in a
   * flat-top lattice includes the odd columns half a cell lower. Nothing when a
   * cell of another lab is open on top, because the line would cross it. */
  const link = useMemo(() => {
    if (!lab || !anchor) return null;
    const openLab = FAMILIES.find((one) => one.id === openId)?.lab;
    if (openLab && openLab !== lab) return null;
    const mine = placed.filter(({ family }) => family.lab === lab);
    if (mine.length === 0) return null;
    const top = Math.min(...mine.map(({ box }) => box.y));
    const drops = mine
      .filter(({ box, open }) => open || box.y < top + box.h * 0.75)
      .map(({ family, box }) => ({
        id: family.id,
        x: anchor.fx + box.x + box.w / 2,
        y: anchor.fy + box.y,
      }));
    const rail = (anchor.by + anchor.fy) / 2;
    const xs = drops.map((one) => one.x);
    return {
      stem: `M${anchor.bx} ${anchor.by}V${rail}`,
      rails: [
        `M${anchor.bx} ${rail}H${Math.min(...xs)}`,
        `M${anchor.bx} ${rail}H${Math.max(...xs)}`,
      ],
      drops: drops.map((one) => ({
        id: one.id,
        d: `M${one.x} ${rail}V${one.y}`,
      })),
    };
  }, [lab, anchor, placed, openId]);

  const counts = useMemo(() => {
    const tally = { dry: 0, wet: 0, bee: 0 } as Record<Lab, number>;
    for (const one of FAMILIES) tally[one.lab] += one.cycles.length;
    return tally;
  }, []);

  return (
    <div
      className="dbtl"
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape" && openId) {
          event.stopPropagation();
          shut(openId);
        }
      }}
    >
      {link ? (
        /* Keyed by lab so switching labs remounts it and it draws afresh. */
        <svg
          key={lab}
          className="dbtl-link"
          data-lab={lab ?? undefined}
          aria-hidden="true"
        >
          <path className="dbtl-link-stem" d={link.stem} pathLength={1} />
          {link.rails.map((d, i) => (
            <path key={i} className="dbtl-link-rail" d={d} pathLength={1} />
          ))}
          {link.drops.map((one) => (
            <path
              key={one.id}
              className="dbtl-link-drop"
              d={one.d}
              pathLength={1}
            />
          ))}
        </svg>
      ) : null}

      <div
        className="dbtl-filters"
        role="group"
        aria-label="Filter cycles by lab"
      >
        {LAB_ORDER.map((key) => {
          const on = lab === key;
          return (
            <button
              key={key}
              ref={(node) => {
                buttons.current[key] = node;
              }}
              type="button"
              className="dbtl-filter"
              data-lab={key}
              aria-pressed={on}
              onClick={() => setLab(on ? null : key)}
            >
              {LAB_NAME[key].toUpperCase()}
              <span className="dbtl-filter-count">{counts[key]}</span>
            </button>
          );
        })}
      </div>

      <div className="dbtl-frame" ref={frame}>
        {/* data-open is what tells the CSS to stop previewing on hover: with a
            cell open, a neighbour swelling under the cursor is noise. */}
        <div
          className="dbtl-comb"
          data-open={openId ? "yes" : "no"}
          style={{ height: height || undefined }}
        >
          {placed.map(({ family, box, open }) => (
            <div
              key={family.id}
              id={family.id}
              className={`dbtl-cell${
                lab !== null && lab !== family.lab ? " is-dimmed" : ""
              }`}
              data-lab={family.lab}
              data-state={open ? "open" : "shut"}
              style={
                {
                  left: `${box.x}px`,
                  top: `${box.y}px`,
                  width: `${box.w}px`,
                  height: `${box.h}px`,
                  /* Where the flat top starts, in pixels off this cell's
                     height. The stylesheet's clip-path reads it; see the note at
                     the top of DbtlGallery.css for why it cannot be a
                     percentage of the width. */
                  "--slant": `${slantOf(box.h).toFixed(1)}px`,
                } as CSSProperties
              }
            >
              <div className="dbtl-face">
                {open ? (
                  <>
                    <CycleIcon
                      familyId={family.id}
                      className="dbtl-open-icon"
                      flights={flights}
                    />
                    <DbtlFamilyPanel
                      family={family}
                      startAt={
                        target?.family === family.id ? target.cycle : undefined
                      }
                      onClose={() => shut(family.id)}
                    />
                  </>
                ) : (
                  <button
                    type="button"
                    className="dbtl-shut"
                    data-family={family.id}
                    aria-expanded={false}
                    onClick={() => {
                      /* Opening a cell the filter has greyed out drops the
                         filter, so the open panel is never shown dimmed. */
                      if (lab !== null && lab !== family.lab) setLab(null);
                      if (openId) takeOff(openId);
                      takeOff(family.id);
                      setTarget(null);
                      setOpenId(family.id);
                    }}
                  >
                    <span className="dbtl-shut-body">
                      <CycleIcon
                        familyId={family.id}
                        className="dbtl-shut-icon"
                        flights={flights}
                      />
                      {splitName(family.name).lead ? (
                        <span className="dbtl-shut-num">
                          {splitName(family.name).lead}
                        </span>
                      ) : null}
                      <span className="dbtl-shut-q">
                        {splitName(family.name).rest}
                      </span>
                      {/* The preview: hidden until the cursor is on the cell and
                          nothing else is open. Everything in it is on the opened
                          panel too, so nothing exists only on hover. */}
                      <span className="dbtl-shut-more">
                        {family.question ? (
                          <span className="dbtl-shut-ask">
                            {family.question}
                          </span>
                        ) : null}
                        <span className="dbtl-shut-turns">
                          {family.cycles.length}{" "}
                          {family.cycles.length === 1 ? "cycle" : "cycles"}
                        </span>
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
