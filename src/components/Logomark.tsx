export default function Logomark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/images/logo-mark.webp"
      alt="Eduardo Pineda"
      className={`object-contain ${className}`}
    />
  );
}
