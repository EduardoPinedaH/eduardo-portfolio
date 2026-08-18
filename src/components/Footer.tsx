"use client";

import { motion } from "framer-motion";
import { SPRING } from "@/lib/motion";

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Eduardo Pineda</span>
        <motion.a
          href="#top"
          data-cursor="frame"
          whileHover={{ y: -2 }}
          transition={SPRING}
          className="inline-block w-fit transition-colors hover:text-accent"
        >
          Back to top ↑
        </motion.a>
      </div>
    </footer>
  );
}
