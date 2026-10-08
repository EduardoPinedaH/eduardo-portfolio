"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Bracket from "./Bracket";
import PenguinPeek from "./PenguinPeek";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import { SPRING } from "@/lib/motion";

const FACTS = [
  { label: "Based in", value: "Mexico" },
  { label: "Focus", value: "Editing & motion graphics" },
  { label: "Tools", value: "Premiere Pro · After Effects · DaVinci Resolve" },
];

export default function About() {
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    // Extra top padding on phones: the penguin peeks over the photo's top
    // edge, and when the nav link scrolls here the fixed nav was covering
    // its ears.
    <section id="about" className="relative overflow-hidden border-t border-line bg-section-about/85 px-6 pb-24 pt-36 sm:px-10 sm:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-32 bottom-0 h-[480px] w-[480px] rounded-full opacity-60 blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--accent), transparent 68%)" }}
        />
        <div
          className="absolute -left-24 top-0 h-[360px] w-[360px] rounded-full opacity-35 blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--teal), transparent 68%)" }}
        />
      </div>
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-14 sm:grid-cols-[1fr_1.3fr] sm:gap-20">
        <Reveal>
          <div className="relative">
            {/* Penguin holding the photo, hands resting on the picture: from
                the left edge on wide screens, over the top edge on phones
                and tablets where there's no room in the margin. */}
            <PenguinPeek side="left" />
            <PenguinPeek side="top" />
            <Bracket
              ref={frameRef}
              className="relative z-10 aspect-[4/5] overflow-hidden bg-bg-panel"
            >
              <motion.div className="absolute inset-0" style={{ y }}>
                <Image
                  src="/images/eduardo-greenhouse.jpeg"
                  alt="Eduardo Pineda"
                  fill
                  sizes="(min-width: 640px) 40vw, 90vw"
                  className="scale-110 object-cover grayscale contrast-[1.1]"
                  priority={false}
                />
              </motion.div>
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(165deg, var(--ink) 0%, var(--bg-panel) 55%, var(--accent) 100%)",
                  mixBlendMode: "color",
                  opacity: 0.9,
                }}
              />
            </Bracket>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <Eyebrow>03 — About</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Hi, I&rsquo;m Eduardo.
          </h2>
          <p className="mt-6 max-w-[52ch] text-[1.02rem] leading-relaxed text-ink-soft">
            Video editor and motion graphics designer based in Mexico,
            working with creative agencies and remote U.S. teams. Editing,
            motion graphics, sound design, and color correction in Premiere
            Pro, After Effects, and DaVinci Resolve — plus AI-assisted
            production for long-form and social content.
          </p>

          <div className="mt-10 border-t border-line">
            {FACTS.map((f) => (
              <div
                key={f.label}
                className="flex justify-between gap-4 border-b border-dashed border-line py-3 text-sm"
              >
                <span className="flex-none text-ink-faint">{f.label}</span>
                <span className="text-right text-ink-soft">{f.value}</span>
              </div>
            ))}
          </div>

          <motion.a
            href="/cv/Eduardo-Pineda-CV.pdf"
            download
            data-cursor="frame"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            className="mt-8 inline-flex items-center gap-2 border border-line-strong px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Download CV
            <span aria-hidden>↓</span>
          </motion.a>
        </Reveal>
      </div>
    </section>
  );
}
