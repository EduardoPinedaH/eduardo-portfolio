"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const ICON_SIZE = 18;
const DEFAULT_FRAME = 30;
const CORNER = 12;

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const hoveredEl = useRef<HTMLElement | null>(null);

  const iconX = useMotionValue(-100);
  const iconY = useMotionValue(-100);
  const frameX = useMotionValue(-100);
  const frameY = useMotionValue(-100);
  const frameW = useMotionValue(DEFAULT_FRAME);
  const frameH = useMotionValue(DEFAULT_FRAME);

  const iconSpringOpts = { stiffness: 700, damping: 38, mass: 0.5 };
  const frameSpringOpts = { stiffness: 380, damping: 32, mass: 0.6 };
  const ixs = useSpring(iconX, iconSpringOpts);
  const iys = useSpring(iconY, iconSpringOpts);
  const fxs = useSpring(frameX, frameSpringOpts);
  const fys = useSpring(frameY, frameSpringOpts);
  const fws = useSpring(frameW, frameSpringOpts);
  const fhs = useSpring(frameH, frameSpringOpts);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const setFrameToDefault = (mx: number, my: number) => {
      frameW.set(DEFAULT_FRAME);
      frameH.set(DEFAULT_FRAME);
      frameX.set(mx - DEFAULT_FRAME / 2);
      frameY.set(my - DEFAULT_FRAME / 2);
    };

    const updateFromHovered = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const pad = 8;
      frameX.set(r.left - pad);
      frameY.set(r.top - pad);
      frameW.set(r.width + pad * 2);
      frameH.set(r.height + pad * 2);
    };

    const onMove = (e: MouseEvent) => {
      iconX.set(e.clientX - ICON_SIZE / 2);
      iconY.set(e.clientY - ICON_SIZE / 2);
      if (!hoveredEl.current) setFrameToDefault(e.clientX, e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.<HTMLElement>("[data-cursor]");
      if (!target) return;
      hoveredEl.current = target;
      const kind = target.dataset.cursor ?? "frame";
      setLabel(kind === "frame" ? null : kind.toUpperCase());
      setSpinning(true);
      updateFromHovered(target);
    };

    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.<HTMLElement>("[data-cursor]");
      if (!target || target !== hoveredEl.current) return;
      const related = e.relatedTarget as Node | null;
      if (related && target.contains(related)) return;
      hoveredEl.current = null;
      setLabel(null);
      setSpinning(false);
      setFrameToDefault(iconX.get() + ICON_SIZE / 2, iconY.get() + ICON_SIZE / 2);
    };

    const onScroll = () => {
      if (hoveredEl.current) updateFromHovered(hoveredEl.current);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("scroll", onScroll);
    };
  }, [iconX, iconY, frameX, frameY, frameW, frameH]);

  if (!enabled) return null;

  return (
    <>
      {/* Easy Ease keyframe glyph — After Effects' interpolation icon, standing in for the pointer */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[999]"
        style={{ width: ICON_SIZE, height: ICON_SIZE, x: ixs, y: iys }}
      >
        <motion.svg
          viewBox="0 0 24 24"
          width={ICON_SIZE}
          height={ICON_SIZE}
          animate={{ rotate: spinning ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <path
            d="M4 4.5 L12 12 L4 19.5 Z M20 4.5 L12 12 L20 19.5 Z"
            fill="var(--accent)"
            stroke="var(--accent)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </motion.svg>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[998]"
        style={{ x: fxs, y: fys, width: fws, height: fhs }}
      >
        <span
          className="absolute left-0 top-0 border-l-2 border-t-2 border-accent"
          style={{ width: CORNER, height: CORNER }}
        />
        <span
          className="absolute right-0 top-0 border-r-2 border-t-2 border-accent"
          style={{ width: CORNER, height: CORNER }}
        />
        <span
          className="absolute bottom-0 left-0 border-b-2 border-l-2 border-accent"
          style={{ width: CORNER, height: CORNER }}
        />
        <span
          className="absolute bottom-0 right-0 border-b-2 border-r-2 border-accent"
          style={{ width: CORNER, height: CORNER }}
        />
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.2em] text-accent"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
