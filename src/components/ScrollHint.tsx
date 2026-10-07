"use client";

import { useEffect, useState } from "react";

// Matches the handoff spec for the exported animation: it's cropped to the
// upper body on purpose so it sits flush against the bottom edge of the
// viewport (the penguin "peeks up" from behind the window), and it steps
// aside once the visitor has started scrolling.
const HIDE_AFTER_PX = 40;

export default function ScrollHint() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const update = () => setHidden(window.scrollY > HIDE_AFTER_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <img
      src="/images/scroll-hint.webp"
      width={540}
      height={480}
      alt=""
      aria-hidden
      className={`pointer-events-none fixed bottom-0 right-[clamp(40px,calc(3vw+24px),72px)] sm:right-[clamp(58px,calc(3vw+24px),72px)] z-30 h-auto w-[clamp(120px,13vw,200px)] select-none transition-[opacity,transform] duration-400 ease-out motion-reduce:hidden ${
        hidden ? "translate-y-6 opacity-0" : ""
      }`}
    />
  );
}
