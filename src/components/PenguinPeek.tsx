"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

// penguin-peek.webp (204x370) is drawn for the right side of a "wall": the
// head's flat edge is at x≈44 and the two hand blobs reach ~25px PAST that
// edge (to x≈18), so they rest on the wall's surface, gripping it. Here the
// sprite sits IN FRONT of the photo with the head's edge lined up on the
// photo's edge — the head peeks out from behind the picture while the hands
// overlap it, holding it.
//
//   left: mirrored, for the photo's left edge. Needs room in the page
//         margin, so it's for wide screens (xl) and shrinks to fit.
//   top:  rotated -90deg so the head rises over the photo's top edge. Fits
//         anywhere, so it's what phones and tablets get.
//
// The loop itself does the "coming out" (hands appear first, then the head
// pops out, looks around, retreats), so this only handles placement.
const SRC = "/images/penguin-peek.webp";
const W = 204;
const H = 370;
// Where the head's flat edge sits, as a fraction of the sprite's width
// measured from the wall side (44 / 204).
const EDGE = 44 / W;

export type PeekSide = "left" | "top";

export default function PenguinPeek({ side }: { side: PeekSide }) {
  const ref = useRef<HTMLDivElement>(null);
  // Mount the <img> only once it's on screen so the loop starts from its
  // first frame instead of wherever it happened to be.
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  if (side === "left") {
    return (
      <div
        ref={ref}
        aria-hidden
        className="pointer-events-none absolute z-20 hidden select-none motion-reduce:hidden xl:block"
        style={
          {
            // The visible penguin sticks out (1 - EDGE) of its width to the
            // left of the photo's edge; keep that inside the page margin.
            "--w": `min(96px, calc(max(40px, (100vw - 1152px) / 2) / ${1 - EDGE} - 8px))`,
            width: "var(--w)",
            aspectRatio: `${W} / ${H}`,
            // Head edge 1px inside the photo's edge so there's no seam.
            right: `calc(100% - 1px - var(--w) * ${EDGE})`,
            top: "24%",
          } as React.CSSProperties
        }
      >
        {seen && (
          <img
            src={SRC}
            width={W}
            height={H}
            alt=""
            className="block h-full w-full"
            style={{ transform: "scaleX(-1)" }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute z-20 select-none motion-reduce:hidden xl:hidden"
      style={
        {
          // Long side of the sprite (it's lying down once rotated).
          "--L": "clamp(104px, 12vw, 150px)",
          // Once rotated, the sprite's height is its original width.
          "--Hh": `calc(var(--L) * ${W} / ${H})`,
          width: "var(--L)",
          height: "var(--Hh)",
          // Head edge 1px inside the photo's top edge so there's no seam.
          bottom: `calc(100% - 1px - var(--Hh) * ${EDGE})`,
          left: "12%",
        } as React.CSSProperties
      }
    >
      {seen && (
        <img
          src={SRC}
          width={W}
          height={H}
          alt=""
          className="absolute left-1/2 top-1/2 block"
          style={{
            width: "var(--Hh)",
            height: "var(--L)",
            transform: "translate(-50%, -50%) rotate(-90deg)",
          }}
        />
      )}
    </div>
  );
}
