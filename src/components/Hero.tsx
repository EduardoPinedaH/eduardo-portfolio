"use client";

import { useEffect, useRef } from "react";
import Bracket from "./Bracket";
import Reveal from "./Reveal";
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
        // The name reveal is baked into the video itself (not HTML text),
        // at a wide 1920x1080 native frame. On a tall, narrow mobile
        // viewport, object-cover has to scale to the HEIGHT to fill the
        // section edge-to-edge, which crops the width down to a sliver —
        // the name ends up zoomed in past the point of fitting on
        // screen. Scaling the rendered video down on narrow viewports
        // pulls it back to a legible size, but that leaves its own
        // rectangular edge visible against the section's gradient
        // background — a soft radial fade dissolves that edge instead
        // of leaving a hard-edged box. Neither is needed once the video
        // is back to full-bleed at sm+.
        className="pointer-events-none absolute inset-0 h-full w-full scale-[0.55] object-cover [mask-image:radial-gradient(ellipse,black_70%,transparent_98%)] sm:scale-100 sm:[mask-image:none]"
      >
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
    </section>
  );
}
