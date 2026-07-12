"use client";

/* Rotating circular-text seal. Sits at the seam of the duel.
   Speeds up via CSS var when either side is hovered. */
export function SpinSeal({ fast }: { fast?: boolean }) {
  const text = "HARSH GOILKAR ✦ CLOUD NATIVE ✦ FULL STACK ✦ FREE TIER FOREVER ✦ ";
  return (
    <div
      className="pointer-events-none relative flex h-28 w-28 items-center justify-center"
      aria-hidden
    >
      <svg
        viewBox="0 0 120 120"
        className="animate-spin-slow h-full w-full"
        style={{ animationDuration: fast ? "5s" : "14s" }}
      >
        <defs>
          <path
            id="seal-circle"
            d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
          />
        </defs>
        <text
          fill="rgba(255,255,255,0.55)"
          fontSize="10.2"
          fontFamily="var(--font-jbmono), monospace"
          letterSpacing="2.2"
        >
          <textPath href="#seal-circle">{text}</textPath>
        </text>
      </svg>
      <span
        className="font-display absolute text-lg text-white/80"
        style={{ letterSpacing: "0.02em" }}
      >
        HG
      </span>
    </div>
  );
}
