"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingTimeline from "./LoadingTimeline";
import { VIDEO_BASE } from "@/lib/media";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Roughly one full loop of the mascot clip (~2.8s) so it reads as an
    // intentional beat rather than a flash, plus a little breathing room.
    const minDelay = reduce ? 150 : 3000;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      setTimeout(() => {
        setLoading(false);
        // Lets the Hero background video (which holds off playing until
        // now) start right as the loader clears, so the name reveal is
        // actually seen instead of having already looped behind it.
        window.dispatchEvent(new Event("site:loaded"));
      }, minDelay);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
    }
    const fallback = setTimeout(finish, 7000);

    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6"
          // Sampled directly from the mascot video's own background (flat
          // and uniform across the whole frame, confirmed at all four
          // corners) so the video's edges disappear into the page instead
          // of showing as a slightly-mismatched square.
          style={{ backgroundColor: "#ecede1" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-48 w-48 object-contain sm:h-56 sm:w-56"
            // Browsers decode video color slightly differently than a raw
            // frame-extraction tool reports (color-space handling in the
            // decode pipeline), so even a pixel-matched background color
            // can't fully guarantee zero seam. A soft radial fade on the
            // video itself sidesteps that: its flat background dissolves
            // into the page well before the edge, so any remaining
            // mismatch is imperceptible instead of a hard square line.
            style={{
              maskImage: "radial-gradient(circle, black 55%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(circle, black 55%, transparent 85%)",
            }}
          >
            <source src={`${VIDEO_BASE}/mascot-walk.mp4`} type="video/mp4" />
          </video>
          <LoadingTimeline className="w-64 sm:w-72" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
