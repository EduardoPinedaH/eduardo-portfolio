import Bracket from "./Bracket";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import EditTimeline from "./EditTimeline";
import ReelPlayer from "./ReelPlayer";
import { VIDEO_BASE } from "@/lib/media";

export default function Reel() {
  return (
    <section id="reel" className="relative overflow-hidden border-t border-line bg-section-reel/85 px-6 py-24 sm:px-10 sm:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-24 -top-24 h-[460px] w-[460px] rounded-full opacity-60 blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--teal), transparent 68%)" }}
        />
        <div
          className="absolute -bottom-32 -left-24 h-[380px] w-[380px] rounded-full opacity-40 blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--accent), transparent 68%)" }}
        />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 sm:mb-16">
          <Eyebrow>01 — Reel</Eyebrow>
        </div>

        <Reveal>
          <Bracket className="relative aspect-video overflow-hidden bg-bg-panel">
            <ReelPlayer src={`${VIDEO_BASE}/reel.mp4`} />
          </Bracket>
          <EditTimeline className="mt-4" />
        </Reveal>
      </div>
    </section>
  );
}
