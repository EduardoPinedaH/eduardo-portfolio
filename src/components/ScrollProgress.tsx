"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const top = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden h-[50vh] w-px -translate-y-1/2 bg-line-strong sm:block"
    >
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ top }}
      >
        <svg
          viewBox="0 0 24 24"
          width={16}
          height={16}
          className="animate-spin-slow"
          style={{ animationDuration: "6s" }}
        >
          <path
            d="M4 4.5 L12 12 L4 19.5 Z M20 4.5 L12 12 L20 19.5 Z"
            fill="var(--accent)"
          />
        </svg>
      </motion.div>
    </div>
  );
}
