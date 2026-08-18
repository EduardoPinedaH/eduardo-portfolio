"use client";

import { motion } from "framer-motion";

// Matches the loading screen's minimum display time so the sequence
// finishes building right as the screen fades out.
const LOOP_S = 3;

const TRACKS = [
  { color: "var(--swatch-green)", start: 4, width: 40, keyframe: 30 },
  { color: "var(--accent)", start: 30, width: 34, keyframe: 54 },
  { color: "var(--teal)", start: 10, width: 30, keyframe: 24 },
  { color: "var(--swatch-tan)", start: 46, width: 40, keyframe: 74 },
];

function frac(pct: number) {
  return Math.min(1, Math.max(0, pct / 100));
}

export default function LoadingTimeline({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-ink px-4 py-3.5 ${className}`}>
      <div className="relative">
        <div
          className="h-2 w-full opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.6) 0, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 10px)",
          }}
        />

        <div className="mt-3 flex flex-col gap-2">
          {TRACKS.map((t, i) => {
            const s = frac(t.start);
            const e = frac(t.start + t.width);
            const k = frac(t.keyframe);
            return (
              <div key={i} className="relative h-2.5 w-full rounded-full bg-white/10">
                <motion.div
                  className="absolute top-0 h-full rounded-full"
                  style={{ left: `${t.start}%`, background: t.color }}
                  animate={{ width: ["0%", "0%", `${t.width}%`, `${t.width}%`] }}
                  transition={{
                    duration: LOOP_S,
                    times: [0, s, e, 1],
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <motion.svg
                  viewBox="0 0 24 24"
                  width="10"
                  height="10"
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${t.keyframe}%` }}
                  animate={{ opacity: [0, 0, 1, 1], scale: [0.4, 0.4, 1, 1] }}
                  transition={{
                    duration: LOOP_S,
                    times: [0, k, Math.min(1, k + 0.03), 1],
                    repeat: Infinity,
                  }}
                >
                  <path
                    d="M4 4.5 L12 12 L4 19.5 Z M20 4.5 L12 12 L20 19.5 Z"
                    fill="var(--bg)"
                    stroke="var(--bg)"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </div>
            );
          })}
        </div>

        <motion.div
          className="absolute inset-y-0 w-[2px] bg-accent"
          animate={{ left: ["0%", "100%"] }}
          transition={{ duration: LOOP_S, ease: "linear", repeat: Infinity }}
        >
          <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-full rounded-full bg-accent" />
        </motion.div>
      </div>
    </div>
  );
}
