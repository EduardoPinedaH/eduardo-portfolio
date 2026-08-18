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
          style={{ backgroundColor: "#eff0e6" }}
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
          >
            <source src={`${VIDEO_BASE}/mascot-walk.mp4`} type="video/mp4" />
          </video>
          <LoadingTimeline className="w-64 sm:w-72" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
