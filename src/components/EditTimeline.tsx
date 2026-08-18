const TRACKS = [
  { color: "var(--swatch-green)", start: 4, width: 56, keyframes: [18, 44] },
  { color: "var(--accent)", start: 26, width: 48, keyframes: [36, 62] },
  { color: "var(--teal)", start: 10, width: 38, keyframes: [16, 32] },
  { color: "var(--swatch-tan)", start: 42, width: 44, keyframes: [54, 78] },
];

const PLAYHEAD_PERCENT = 40;

function KeyframeGlyph({ left }: { left: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="11"
      height="11"
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${left}%` }}
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

export default function EditTimeline({ className = "" }: { className?: string }) {
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
          {TRACKS.map((t, i) => (
            <div key={i} className="relative h-3 w-full rounded-full bg-white/10">
              <div
                className="absolute top-0 h-full rounded-full"
                style={{ left: `${t.start}%`, width: `${t.width}%`, background: t.color }}
              />
              {t.keyframes.map((kf) => (
                <KeyframeGlyph key={kf} left={kf} />
              ))}
            </div>
          ))}
        </div>

        <div
          className="absolute inset-y-0 w-[2px] bg-accent"
          style={{ left: `${PLAYHEAD_PERCENT}%` }}
        >
          <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-full rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
