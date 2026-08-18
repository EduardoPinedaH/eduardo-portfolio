"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Bracket from "./Bracket";
import ReelPlayer from "./ReelPlayer";
import type { Project } from "@/lib/projects";

const ASPECT: Record<Project["ratio"], string> = {
  "16:9": "16 / 9",
  "9:16": "9 / 16",
  "1:1": "1 / 1",
  "4:5": "4 / 5",
  "21:9": "21 / 9",
};

// width / height as a plain number, used to resolve the frame's height
// directly via calc() below — needed because Bracket's only children are
// position:absolute (the player + close button), so it has no in-flow
// content for aspect-ratio to size itself against as a flex item.
const RATIO_NUM: Record<Project["ratio"], number> = {
  "16:9": 16 / 9,
  "9:16": 9 / 16,
  "1:1": 1,
  "4:5": 4 / 5,
  "21:9": 21 / 9,
};

export default function WorkLightbox({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && project.video && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.button
            type="button"
            aria-label="Close preview"
            onClick={onClose}
            className="absolute inset-0 bg-ink/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative z-10 flex max-w-[92vw] flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <div className="text-center font-mono text-[0.68rem] uppercase tracking-[0.12em] text-bg">
              {project.title} — {project.category} · {project.year}
            </div>

            <Bracket
              className="relative overflow-hidden bg-ink"
              style={{
                aspectRatio: ASPECT[project.ratio],
                height: `min(70vh, calc(92vw / ${RATIO_NUM[project.ratio]}))`,
                width: "auto",
                maxWidth: "92vw",
              }}
            >
              <ReelPlayer src={project.fullVideo ?? project.video} autoPlay />

              <button
                type="button"
                onClick={onClose}
                data-cursor="frame"
                aria-label="Close"
                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center border border-bg/40 bg-ink/70 text-bg backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </Bracket>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
