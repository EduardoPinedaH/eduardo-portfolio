"use client";

import { useEffect, useRef, useState } from "react";

function formatTime(t: number) {
  if (!Number.isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function ReelPlayer({
  src,
  autoPlay = false,
}: {
  src: string;
  autoPlay?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrent(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    const onEnd = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", onEnd);
    if (v.readyState >= 1) onMeta();
    if (autoPlay) {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Autoplay with sound was blocked — leave it on the play overlay.
        });
    }
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", onEnd);
    };
  }, [autoPlay]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * duration;
    setCurrent(v.currentTime);
  };

  const progressPct = duration ? (current / duration) * 100 : 0;

  return (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        onClick={toggle}
        className="h-full w-full cursor-pointer object-cover"
      />

      {!playing && (
        <button
          type="button"
          onClick={toggle}
          data-cursor="frame"
          aria-label="Play reel"
          className="absolute inset-0 flex items-center justify-center bg-ink/20"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-ink shadow-lg transition-transform hover:scale-105">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent px-4 pb-3 pt-10">
        <button
          type="button"
          onClick={toggle}
          data-cursor="frame"
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-6 w-6 flex-none items-center justify-center text-bg"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <rect x="5" y="4" width="5" height="16" rx="1.5" />
              <rect x="14" y="4" width="5" height="16" rx="1.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          )}
        </button>

        <div
          role="slider"
          aria-label="Seek"
          aria-valuenow={Math.round(progressPct)}
          onClick={seek}
          className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-bg/25"
        >
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${progressPct}%` }}
          />
          <span
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
            style={{ left: `${progressPct}%` }}
          />
        </div>

        <span className="flex-none font-mono text-[0.65rem] tabular-nums text-bg/80">
          {formatTime(current)} / {formatTime(duration)}
        </span>

        <button
          type="button"
          onClick={toggleMute}
          data-cursor="frame"
          aria-label={muted ? "Unmute" : "Mute"}
          className="flex h-6 w-6 flex-none items-center justify-center text-bg"
        >
          {muted ? (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9v6h4l5 4V5L8 9H4Z" />
              <path d="M16 9l5 6M21 9l-5 6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9v6h4l5 4V5L8 9H4Z" />
              <path d="M17 8a5 5 0 0 1 0 8M19.5 5.5a9 9 0 0 1 0 13" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
