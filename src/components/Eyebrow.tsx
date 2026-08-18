export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-faint">
      <span
        aria-hidden
        className="inline-block h-[7px] w-[7px] rotate-45 border border-accent"
      />
      {children}
    </span>
  );
}
