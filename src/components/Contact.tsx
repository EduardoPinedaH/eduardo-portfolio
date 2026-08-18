"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import { SPRING } from "@/lib/motion";

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "Vimeo", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line bg-section-contact/85 px-6 py-24 sm:px-10 sm:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -bottom-56 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full opacity-65 blur-[95px]"
          style={{ background: "radial-gradient(circle, var(--accent), transparent 68%)" }}
        />
        <div
          className="absolute -top-40 right-0 h-[440px] w-[440px] rounded-full opacity-45 blur-[95px]"
          style={{ background: "radial-gradient(circle, var(--teal), transparent 68%)" }}
        />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow>04 — Contact</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
            Let&rsquo;s cut something together.
          </h2>

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <motion.a
              href="mailto:eduardopinedahu@gmail.com"
              data-cursor="write"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={SPRING}
              className="inline-block w-fit font-mono text-lg text-ink transition-colors hover:text-accent sm:text-xl"
            >
              eduardopinedahu@gmail.com
            </motion.a>
            <div className="flex gap-5">
              {SOCIALS.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  data-cursor="frame"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  transition={SPRING}
                  className="inline-block font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft transition-colors hover:text-accent"
                >
                  {s.label}
                </motion.a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
