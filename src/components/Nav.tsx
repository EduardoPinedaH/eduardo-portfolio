"use client";

import { motion } from "framer-motion";
import Logomark from "./Logomark";
import { SPRING } from "@/lib/motion";

const LINKS = [
  { href: "#reel", label: "Reel" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4">
        <a href="#top" data-cursor="frame" className="flex items-center justify-self-start">
          <motion.div whileHover={{ scale: 1.08, rotate: -2 }} transition={SPRING}>
            <Logomark className="h-10 w-10" />
          </motion.div>
        </a>
        <nav className="flex items-center gap-5 sm:gap-7">
          {LINKS.map((l) => (
            <motion.a
              key={l.href}
              href={l.href}
              data-cursor="frame"
              whileHover={{ y: -2 }}
              transition={SPRING}
              className="inline-block font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-accent"
            >
              {l.label}
            </motion.a>
          ))}
        </nav>
        <div aria-hidden />
      </div>
    </header>
  );
}
