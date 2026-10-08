"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Matches the handoff spec for the exported animation: it's cropped to the
// upper body on purpose so it sits flush against the bottom edge of the
// viewport (the penguin "peeks up" from behind the window), and it steps
// aside once the visitor has started scrolling.
const HIDE_AFTER_PX = 40;

// Entrance: after the loading screen clears (plus a beat, so the hero's name
// reveal gets the first look) the penguin slides up from below the window,
// then does a small squash-and-stretch pop as it lands.
const ENTER_DELAY_S = 0.7;
const SLIDE_S = 0.6;
// Gentle start, quick middle, long soft landing — not a snap.
const SLIDE_EASE = [0.4, 0, 0.15, 1] as const;
// The pop starts as the slide is nearly done.
const POP_AT_S = ENTER_DELAY_S + 0.44;
const POP_S = 0.4;
const POP_TIMES = [0, 0.35, 0.72, 1];

export default function ScrollHint() {
  const [hidden, setHidden] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const update = () => setHidden(window.scrollY > HIDE_AFTER_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // The loader fires "site:loaded" when it fades out. The timeout is only a
  // safety net so the penguin can never get stuck below the fold.
  useEffect(() => {
    const enter = () => setEntered(true);
    window.addEventListener("site:loaded", enter);
    const fallback = setTimeout(enter, 12000);
    return () => {
      window.removeEventListener("site:loaded", enter);
      clearTimeout(fallback);
    };
  }, []);

  return (
    // The wrapper owns position and the hide-on-scroll fade; the image inside
    // owns the entrance, so the two transforms never fight each other.
    <div
      aria-hidden
      className={`pointer-events-none fixed bottom-0 right-[clamp(40px,calc(3vw+24px),72px)] sm:right-[clamp(58px,calc(3vw+24px),72px)] z-30 w-[clamp(120px,13vw,200px)] select-none transition-[opacity,translate] duration-400 ease-out motion-reduce:hidden ${
        hidden ? "translate-y-6 opacity-0" : ""
      }`}
    >
      <motion.img
        src="/images/scroll-hint.webp"
        width={540}
        height={480}
        alt=""
        className="block h-auto w-full"
        // Scaling is anchored to the bottom edge so the sprite's flat cut
        // stays hidden behind the window — a real overshoot upward would
        // lift it and expose that edge.
        style={{ transformOrigin: "50% 100%" }}
        initial={{ y: "100%" }}
        animate={
          entered
            ? {
                y: "0%",
                scaleY: [1, 1.06, 0.99, 1],
                scaleX: [1, 0.985, 1.006, 1],
              }
            : { y: "100%" }
        }
        transition={{
          y: { delay: ENTER_DELAY_S, duration: SLIDE_S, ease: SLIDE_EASE },
          scaleY: {
            delay: POP_AT_S,
            duration: POP_S,
            times: POP_TIMES,
            ease: "easeOut",
          },
          scaleX: {
            delay: POP_AT_S,
            duration: POP_S,
            times: POP_TIMES,
            ease: "easeOut",
          },
        }}
      />
    </div>
  );
}
