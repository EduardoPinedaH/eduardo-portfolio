"use client";

import { useEffect, useRef } from "react";
import Bracket from "./Bracket";
import Reveal from "./Reveal";
import ScrollHint from "./ScrollHint";
import { VIDEO_BASE } from "@/lib/media";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const play = () => videoRef.current?.play().catch(() => {});
    window.addEventListener("site:loaded", play);
    return () => window.removeEventListener("site:loaded", play);
  }, []);

  return (
    <section className="relative overflow-hidden bg-section-hero/85">
      <video
        ref={videoRef}
        aria-hidden
        muted
        loop
        playsInline
        preload="auto"
        // The name reveal is baked into the video itself (not HTML text).
        // A single wide 1920x1080 source forced object-cover to zoom way
        // in to fill a tall mobile viewport, cropping the name past
        // legibility — scaling/masking it back down was a workaround.
        // A proper 9:16 export for mobile fixes it at the source: the
        // video's own aspect ratio already matches the viewport, so
        // object-cover can fill edge-to-edge without cropping or needing
        // any CSS tricks, exactly like the desktop cut already does.
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      >
        <source
          media="(max-width: 639px)"
          src={`${VIDEO_BASE}/page-background-mobile.mp4`}
          type="video/mp4"
        />
        <source src={`${VIDEO_BASE}/page-background.mp4`} type="video/mp4" />
      </video>

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full opacity-60 blur-[90px]"
          style={{ background: "radial-gradient(circle, var(--accent), transparent 68%)" }}
        />
        <div
          className="absolute -bottom-48 -left-32 h-[560px] w-[560px] rounded-full opacity-50 blur-[90px]"
          style={{ background: "radial-gradient(circle, var(--teal), transparent 68%)" }}
        />
      </div>

      <Bracket className="relative z-10 m-4 flex min-h-[92vh] flex-col items-center px-6 py-16 text-center sm:m-8 sm:px-10 sm:py-20">
        <div className="flex flex-1 flex-col items-center justify-end pb-12 sm:pb-16">
          <Reveal className="mx-auto max-w-[46ch]">
            <p className="text-[1.05rem] leading-relaxed text-ink-soft">
              Video editing and motion design, working on commercials and
              social content. Watch the{" "}
              <a
                href="#reel"
                data-cursor="frame"
                className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                reel
              </a>{" "}
              or see{" "}
              <a
                href="#work"
                data-cursor="frame"
                className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                selected work
              </a>
              .
            </p>
          </Reveal>
        </div>

        <span className="pb-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-faint">
          Scroll down
        </span>
      </Bracket>

      <ScrollHint />
    </section>
  );
}
