"use client";

// Same visual language as LoadingTimeline (growing clip bars, popping
// keyframe glyphs, a sweeping playhead) but instead of animating on a
// fixed timer, every value here is derived straight from the Reel
// video's real currentTime/duration — passed down as `progress` — so it
// starts on click, freezes on pause, and resumes exactly where the
// video left off.
const TRACKS = [
  { color: "var(--swatch-green)", start: 4, width: 56, keyframes: [18, 44] },
  { color: "var(--accent)", start: 26, width: 48, keyframes: [36, 62] },
  { color: "var(--teal)", start: 10, width: 38, keyframes: [16, 32] },
  { color: "var(--swatch-tan)", start: 42, width: 44, keyframes: [54, 78] },
];

function frac(pct: number) {
  return Math.min(1, Math.max(0, pct / 100));
}

function KeyframeGlyph({ left, active }: { left: number; active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="11"
      height="11"
      className="absolute top-1/2 transition-[opacity,transform] duration-200 ease-out"
      style={{
        left: `${left}%`,
        opacity: active ? 1 : 0,
        transform: `translate(-50%, -50%) scale(${active ? 1 : 0.4})`,
      }}
    >
      <path
        d="M4 4.5 L12 12 L4 19.5 Z M20 4.5 L12 12 L20 19.5 Z"
        fill="var(--bg)"
        stroke="var(--bg)"
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function EditTimeline({
  className = "",
  progress = 0,
  playing = false,
}: {
  className?: string;
  // 0–1 fraction of the Reel video's real playback (currentTime / duration).
  progress?: number;
  playing?: boolean;
}) {
  void playing; // reserved for future use; progress alone drives the visuals
  const p = Math.min(1, Math.max(0, progress));

  return (
    <div aria-hidden className={`rounded-2xl bg-ink px-4 py-3.5 ${className}`}>
      <div className="relative">
        <div
          className="h-2.5 w-full opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.6) 0, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 10px)",
          }}
        />
        <div className="mt-3 flex flex-col gap-2.5">
          {TRACKS.map((t, i) => {
            const s = frac(t.start);
            const e = frac(t.start + t.width);
            const revealed = e > s ? Math.min(1, Math.max(0, (p - s) / (e - s))) : 0;
            const liveWidth = revealed * t.width;
            return (
              <div key={i} className="relative h-3 w-full rounded-full bg-white/10">
                <div
                  className="absolute top-0 h-full rounded-full transition-[width] duration-200 ease-linear"
                  style={{ left: `${t.start}%`, width: `${liveWidth}%`, background: t.color }}
                />
                {t.keyframes.map((kf) => (
                  <KeyframeGlyph key={kf} left={kf} active={p >= frac(kf)} />
                ))}
              </div>
            );
          })}
        </div>
        <div
          className="absolute inset-y-0 w-[2px] bg-accent transition-[left] duration-200 ease-linear"
          style={{ left: `${p * 100}%` }}
        >
          <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-full rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
