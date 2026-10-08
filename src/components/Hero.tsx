"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Bracket from "./Bracket";
import Reveal from "./Reveal";
import ScrollHint from "./ScrollHint";
import { VIDEO_BASE } from "@/lib/media";

const MOBILE_QUERY = "(max-width: 639px)";
const SRC_MOBILE = `${VIDEO_BASE}/page-background-mobile.mp4`;
const SRC_DESKTOP = `${VIDEO_BASE}/page-background.mp4`;

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Set when the browser refuses to autoplay the name-reveal video — iOS Low
  // Power Mode does this for every video, muted or not. The name only exists
  // inside that video, so without a fallback the hero would be empty.
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  // Which cut of the video to load. Chosen in JS rather than with
  // <source media="…">: iOS Safari doesn't honor `media` on video sources and
  // played the 16:9 desktop file on phones, which object-cover then zoomed
  // until only a few letters of the name were visible. Left undefined until
  // we know, so a phone never even starts downloading the desktop file.
  const [src, setSrc] = useState<string | undefined>(undefined);
  const siteLoaded = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const choose = () => setSrc(mq.matches ? SRC_MOBILE : SRC_DESKTOP);
    choose();
    // Rotating a phone can cross the breakpoint.
    mq.addEventListener("change", choose);
    return () => mq.removeEventListener("change", choose);
  }, []);

  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.getAttribute("src")) return;
    v.play().catch((err: unknown) => {
      // A new source interrupting the old play() isn't a blocked autoplay.
      if ((err as { name?: string })?.name !== "AbortError") {
        setAutoplayBlocked(true);
      }
    });
  }, []);

  useEffect(() => {
    const onLoaded = () => {
      siteLoaded.current = true;
      play();
    };
    window.addEventListener("site:loaded", onLoaded);
    return () => window.removeEventListener("site:loaded", onLoaded);
  }, [play]);

  // If the source changes after the loader has already cleared (rotation),
  // pick playback back up on the new file.
  useEffect(() => {
    if (src && siteLoaded.current) play();
  }, [src, play]);

  return (
    <section className="relative overflow-hidden bg-section-hero/85">
      <video
        ref={videoRef}
        src={src}
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
      />

      {/* Still of the finished name (the frame the video holds on for most of
          its loop), laid out with the same object-cover as the video so it
          lands in exactly the same place. Only rendered when autoplay is
          blocked, so everyone else gets the animated reveal untouched. */}
      {autoplayBlocked && (
        <picture>
          <source
            media="(max-width: 639px)"
            srcSet="/images/hero-name-mobile.webp"
          />
          <img
            src="/images/hero-name.webp"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      )}

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

      {/* svh, not vh: on iOS `vh` is the screen height with Safari's toolbars
          retracted, so a 92vh hero is taller than what's actually visible on
          load — the "Scroll down" label ends up below the fold. svh is the
          visible height (and equals vh wherever there's no dynamic toolbar). */}
      <Bracket className="relative z-10 m-4 flex min-h-[92svh] flex-col items-center px-6 py-16 text-center sm:m-8 sm:px-10 sm:py-20">
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
