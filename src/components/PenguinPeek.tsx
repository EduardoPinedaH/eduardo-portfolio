"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

// penguin-peek.webp (204x370) is drawn for the right side of a "wall": the
// head's flat edge is at x≈44 and the two hand blobs reach ~25px PAST that
// edge (to x≈18), so they rest on the wall's surface, gripping it. Mirrored
// here for the photo's left edge, with the sprite IN FRONT of the photo and
// the head's edge lined up with the photo's edge — the head peeks out from
// behind the picture while the hands overlap it, holding it.
//
// The loop itself does the "coming out" (hands appear first, then the head
// pops out, looks around, retreats), so this only handles placement.
const SRC = "/images/penguin-peek.webp";
const W = 204;
const H = 370;
// Where the head's flat edge sits, as a fraction of the sprite's width
// measured from the wall side (44 / 204).
const EDGE = 44 / W;

export default function PenguinPeek() {
  const ref = useRef<HTMLDivElement>(null);
  // Mount the <img> only once it's on screen so the loop starts from its
  // first frame instead of wherever it happened to be.
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <div
      ref={ref}
      aria-hidden
      // Needs room in the page margin, so it only appears on wide screens
      // and shrinks to fit the space left of the photo.
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
