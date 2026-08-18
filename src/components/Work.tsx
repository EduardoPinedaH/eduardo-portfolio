"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Bracket from "./Bracket";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import WorkLightbox from "./WorkLightbox";
import { SPRING, SPRING_SOFT } from "@/lib/motion";
import {
  CATEGORIES,
  PROJECTS,
  type Category,
  type Project,
} from "@/lib/projects";

const RATIO_CLASS: Record<string, string> = {
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
  "21:9": "aspect-[21/9]",
};

const RATIO_NUM: Record<Project["ratio"], number> = {
  "16:9": 16 / 9,
  "9:16": 9 / 16,
  "1:1": 1,
  "4:5": 4 / 5,
  "21:9": 21 / 9,
};

type Pos = { x: number; y: number; w: number; h: number };

// Justified rows — the technique Google Photos/Flickr use for mixed-aspect
// grids. Fixed-column masonry (both versions tried before this) hits a
// hard wall: it needs two columns to land at the exact same running height
// before a wide tile can span them without either stranding a gap in the
// shorter one or forcing a crop to make up the difference. With this
// project's specific aspect ratios, columns essentially never re-sync
// once they drift apart — not a tuning problem, a numerical one.
//
// Justified rows sidestep it by not fixing column widths at all. Instead,
// row HEIGHT is the free variable: keep adding items to a row (each own
// natural width = height * aspectRatio) until, at native size, they'd
// just fill the container width — then solve for the exact height that
// makes them fill it precisely. That height always exists for any set of
// aspect ratios, so every row is a perfect full-width rectangle with zero
// gap, and every item renders at its own true ratio with zero crop —
// both guaranteed by construction, not by hoping the numbers line up.
function layoutJustified(
  items: Project[],
  containerWidth: number,
  targetRowHeight: number,
): { positions: Record<string, Pos>; height: number } {
  const rowSum = (r: Project[]) =>
    r.reduce((s, it) => s + RATIO_NUM[it.ratio], 0);

  const rows: Project[][] = [];
  let row: Project[] = [];
  let aspectSum = 0;
  for (const item of items) {
    row.push(item);
    aspectSum += RATIO_NUM[item.ratio];
    if (containerWidth / aspectSum <= targetRowHeight) {
      rows.push(row);
      row = [];
      aspectSum = 0;
    }
  }
  if (row.length) rows.push(row);

  // A too-sparse trailing row (e.g. a single wide tile left over) would
  // need to stretch far taller than every other row to reach full width
  // alone — capping that height leaves it short of the edge (a gap) and
  // letting it stretch makes one tile absurdly oversized. Instead, fold
  // it into the previous row and resolve their combined height together,
  // same fix justified-gallery layouts use for an under-filled last row.
  while (rows.length > 1) {
    const last = rows[rows.length - 1];
    const lastH = containerWidth / rowSum(last);
    if (lastH <= targetRowHeight * 1.6) break;
    const prev = rows[rows.length - 2];
    rows[rows.length - 2] = [...prev, ...last];
    rows.pop();
  }

  const positions: Record<string, Pos> = {};
  let y = 0;
  for (const r of rows) {
    const h = containerWidth / rowSum(r);
    let x = 0;
    r.forEach((item, i) => {
      const w =
        i === r.length - 1 ? containerWidth - x : h * RATIO_NUM[item.ratio];
      positions[item.id] = { x, y, w, h };
      x += w;
    });
    y += h;
  }

  return { positions, height: y };
}

type Breakpoint = "mobile" | "tablet" | "desktop";

// Mobile's target is set comfortably above any single item's natural
// height at that width (even 9:16, the tallest ratio here) so every row
// closes after just one tile — a plain single-column feed, still by the
// same construction rather than a special-cased fallback.
const TARGET_ROW_HEIGHT: Record<Breakpoint, number> = {
  mobile: 900,
  tablet: 320,
  desktop: 380,
};

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("desktop");
  useLayoutEffect(() => {
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqSm = window.matchMedia("(min-width: 640px)");
    const update = () =>
      setBp(mqLg.matches ? "desktop" : mqSm.matches ? "tablet" : "mobile");
    update();
    mqLg.addEventListener("change", update);
    mqSm.addEventListener("change", update);
    return () => {
      mqLg.removeEventListener("change", update);
      mqSm.removeEventListener("change", update);
    };
  }, []);
  return bp;
}

type Filter = "All" | Category;

// PROJECTS is already hand-ranked most eye-catching first (animation pieces
// up top, strongest "normal" work next). Justified rows place items
// strictly in that order — no reaching ahead or reordering to fill a
// slot — since row height is solved after the fact, not fit into a
// pre-existing gap.
const PAGE_SIZE = 12;

export default function Work() {
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<Project | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const containerRef = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint();
  const [containerWidth, setContainerWidth] = useState(0);
  // "View more" only adds rows below what's already on screen (positions
  // for already-revealed items are computed once over the whole filtered
  // list, so they never shift — see `fullLayout` below). Nothing above
  // the fold should move. But the grid container's own `height` style
  // grows a lot in one commit, and something outside React's render
  // (most likely the browser's native CSS scroll anchoring, reacting to
  // that height change even though the visible content itself didn't
  // move) nudges the scroll position afterward anyway. One correction
  // right after the commit isn't always enough — a second one on the
  // next macrotask catches whatever slips in after that.
  const scrollLock = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (scrollLock.current === null) return;
    const y = scrollLock.current;
    scrollLock.current = null;
    window.scrollTo(0, y);
    const id = setTimeout(() => window.scrollTo(0, y), 0);
    return () => clearTimeout(id);
  }, [visibleCount]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Measure synchronously on mount rather than waiting on the observer's
    // first callback — that callback can be deferred by the browser (e.g.
    // a backgrounded/inactive tab), which would otherwise leave the grid
    // stuck in its unmeasured, single-column fallback indefinitely.
    setContainerWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) =>
      setContainerWidth(entry.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const filtered = useMemo(
    () =>
      filter === "All"
        ? PROJECTS
        : PROJECTS.filter((p) => p.category === filter),
    [filter],
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Laid out over the WHOLE filtered list, not just the currently-visible
  // slice — the row packer's "merge a too-sparse trailing row into the
  // previous one" step only looks at whatever item happens to be last in
  // whatever array it's given. If that were the visible slice, every
  // "View more" click would change which item counts as trailing, which
  // un-merges/re-merges rows that are already on screen and reflows them
  // out from under the user. Computing over the full list once means row
  // assignments for already-revealed items never change — "View more"
  // only reveals further rows of an already-fixed layout, never rearranges
  // the ones already showing.
  const fullLayout = useMemo(
    () =>
      containerWidth > 0
        ? layoutJustified(filtered, containerWidth, TARGET_ROW_HEIGHT[breakpoint])
        : null,
    [filtered, containerWidth, breakpoint],
  );

  const layout = useMemo(() => {
    if (!fullLayout) return null;
    const height = visible.reduce((max, p) => {
      const pos = fullLayout.positions[p.id];
      return pos ? Math.max(max, pos.y + pos.h) : max;
    }, 0);
    return { positions: fullLayout.positions, height };
  }, [fullLayout, visible]);

  const handleFilter = (f: Filter) => {
    setFilter(f);
    setVisibleCount(PAGE_SIZE);
  };

  const filters: Filter[] = ["All", ...CATEGORIES];

  return (
    <section
      id="work"
      className="relative overflow-hidden border-t border-line bg-section-work/85 px-6 py-24 sm:px-10 sm:py-40"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full opacity-60 blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, var(--accent), transparent 68%)",
          }}
        />
        <div
          className="absolute -bottom-32 -right-24 h-[400px] w-[400px] rounded-full opacity-40 blur-[100px]"
          style={{
            background: "radial-gradient(circle, var(--teal), transparent 68%)",
          }}
        />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10">
          <Eyebrow>02 — Selected Work</Eyebrow>
        </div>

        <div className="mb-12 flex flex-wrap gap-2 sm:mb-20">
          {filters.map((f) => (
            <motion.button
              key={f}
              type="button"
              data-cursor="frame"
              onClick={() => handleFilter(f)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className={`border px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] transition-colors ${
                filter === f
                  ? "border-ink bg-ink text-bg"
                  : "border-line text-ink-soft hover:border-line-strong hover:text-ink"
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>

        <div
          ref={containerRef}
          className="relative"
          style={layout ? { height: layout.height } : undefined}
        >
          {visible.map((project, i) => {
            const pos = layout?.positions[project.id];
            return (
              <div
                key={project.id}
                className={
                  pos ? "absolute transition-all duration-300" : "mb-8"
                }
                style={
                  pos
                    ? { left: pos.x, top: pos.y, width: pos.w, height: pos.h }
                    : undefined
                }
              >
                <Reveal delay={(i % 3) * 0.06} className="h-full">
                  <motion.div
                    data-cursor={project.video ? "frame" : "view"}
                    whileHover={{ y: -6, scale: 1.015 }}
                    transition={SPRING_SOFT}
                    onClick={() => project.video && setActive(project)}
                    className={`h-full ${project.video ? "cursor-pointer" : ""}`}
                  >
                    <Bracket
                      className={`group relative h-full w-full overflow-hidden border border-line bg-bg-panel-2 ${pos ? "" : RATIO_CLASS[project.ratio]}`}
                      style={
                        project.video
                          ? undefined
                          : {
                              backgroundImage:
                                "repeating-linear-gradient(135deg, var(--border) 0, var(--border) 1px, transparent 1px, transparent 14px)",
                            }
                      }
                    >
                      {project.video && (
                        <>
                          <video
                            src={project.video}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/70 to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-200 group-hover:bg-ink/25 group-hover:opacity-100">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bg/90 text-ink shadow-lg">
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="currentColor"
                              >
                                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                              </svg>
                            </span>
                          </div>
                        </>
                      )}
                      <span className="absolute right-3 top-3 border border-line-strong bg-bg/70 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-soft backdrop-blur-sm">
                        {project.ratio}
                      </span>
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                        <span
                          className={`text-sm font-medium ${project.video ? "text-bg" : "text-ink-soft"}`}
                        >
                          {project.title}
                        </span>
                        <span
                          className={`font-mono text-[0.62rem] uppercase tracking-[0.1em] ${project.video ? "text-bg/80" : "text-ink-faint"}`}
                        >
                          {project.category} · {project.year}
                        </span>
                      </div>
                    </Bracket>
                  </motion.div>
                </Reveal>
              </div>
            );
          })}
        </div>

        {hasMore && (
          <div className="mt-12 flex justify-center sm:mt-16">
            <motion.button
              type="button"
              data-cursor="frame"
              onClick={(e) => {
                scrollLock.current = window.scrollY;
                e.currentTarget.blur();
                setVisibleCount((c) => c + PAGE_SIZE);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className="border border-line-strong px-6 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              View more — {filtered.length - visibleCount} more
            </motion.button>
          </div>
        )}
      </div>

      <WorkLightbox project={active} onClose={() => setActive(null)} />
    </section>
  );
}
