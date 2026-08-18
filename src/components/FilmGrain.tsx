const NOISE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;

const NOISE_URI = `data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}`;

export default function FilmGrain() {
  return (
    <div
      aria-hidden
      className="grain-overlay pointer-events-none fixed inset-0 z-[60]"
      style={{ backgroundImage: `url("${NOISE_URI}")` }}
    />
  );
}
