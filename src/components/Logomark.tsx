export default function Logomark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`animate-spin-slow ${className}`}
      style={{ animationDuration: "8s" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4.5 L12 12 L4 19.5 Z M20 4.5 L12 12 L20 19.5 Z"
        fill="var(--accent)"
        stroke="var(--accent)"
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
