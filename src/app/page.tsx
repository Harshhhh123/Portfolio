"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TransitionSequence } from "@/components/landing/transition-sequence";
import { TimeoutJoke } from "@/components/landing/timeout-joke";
import { Preloader } from "@/components/landing/preloader";
import { CustomCursor, type CursorMode } from "@/components/landing/custom-cursor";
import { DustField } from "@/components/landing/dust-field";
import { SpinSeal } from "@/components/landing/spin-seal";
import { useTheme } from "@/lib/theme-context";
import { themes } from "@/lib/themes";
import type { ProviderId } from "@/lib/themes/types";

type Phase = "preload" | "select" | "timeout" | "win" | "sequence";

const IDLE_MS = 26000;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Side {
  id: ProviderId;
  word: string;
  accent: string;
  tint: string;
  roast: string;
  cursorLabel: string;
  index: string;
}

const SIDES: Side[] = [
  {
    id: "aws",
    word: "AWS",
    accent: "#ff9900",
    tint: "rgba(255,153,0,0.07)",
    roast: "200+ services. You'll use 12.",
    cursorLabel: "SHIP IT →",
    index: "01",
  },
  {
    id: "gcp",
    word: "GCP",
    accent: "#4285f4",
    tint: "rgba(66,133,244,0.08)",
    roast: "Gorgeous console. Enjoy it before it's discontinued.",
    cursorLabel: "BRAVE →",
    index: "02",
  },
];

const TICKER = [
  "free tier: a trap with documentation",
  "it's not a bug, it's eventual consistency",
  "us-east-1 has feelings too",
  "IAM: I Ain't Mad",
  "deprecated, like your current stack",
  "NAT gateway ₹3/hr, trust issues free",
  "kubectl get hired -n your-company",
  "99.99% uptime, 0.01% humility",
];

/* One expanding half of the duel. Owns its own 3D tilt. */
function DuelSide({
  side,
  phase,
  hovered,
  onHover,
  onLeave,
  onSelect,
  order,
}: {
  side: Side;
  phase: Phase;
  hovered: ProviderId | null;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
  order: number;
}) {
  const isHovered = hovered === side.id;
  const otherHovered = hovered !== null && !isHovered;

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateX = useSpring(useTransform(my, [0, 1], [5, -5]), {
    stiffness: 150,
    damping: 20,
  });
  // magnetic pull: the wordmark leans toward the cursor
  const magnetX = useSpring(useTransform(mx, [0, 1], [-14, 14]), {
    stiffness: 120,
    damping: 18,
  });
  const magnetY = useSpring(useTransform(my, [0, 1], [-8, 8]), {
    stiffness: 120,
    damping: 18,
  });
  const glowBg = useTransform(
    [mx, my],
    ([px, py]) =>
      `radial-gradient(420px circle at ${(px as number) * 100}% ${
        (py as number) * 100
      }%, ${side.tint.replace(/0\.0[78]/, "0.16")}, transparent 65%)`
  );

  return (
    <motion.button
      type="button"
      disabled={phase !== "select"}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={() => {
        onLeave();
        mx.set(0.5);
        my.set(0.5);
      }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: phase === "preload" ? 0 : 1,
        flexGrow: isHovered ? 1.7 : otherHovered ? 0.75 : 1,
      }}
      transition={{
        opacity: { delay: 0.5 + order * 0.12, duration: 0.7 },
        flexGrow: { duration: 0.7, ease: EASE },
      }}
      className="group relative flex min-h-0 flex-1 flex-col items-start justify-end overflow-hidden border-t px-5 pb-6 text-left sm:border-l sm:border-t-0 sm:px-8 sm:pb-8"
      style={{
        borderColor: "rgba(255,255,255,0.1)",
        background: isHovered ? side.tint : "transparent",
        transition: "background 0.5s",
        perspective: 900,
      }}
    >
      {/* hover glow that follows the cursor */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.5s",
          background: glowBg,
        }}
      />

      {/* index + domain */}
      <div className="absolute left-5 top-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35 sm:left-8">
        <span>{side.index}</span>
        <span className="hidden lg:inline">{themes[side.id].domain}</span>
      </div>

      <ArrowUpRight
        className="absolute right-5 top-4 h-5 w-5 transition-all duration-500 sm:right-8"
        style={{
          color: isHovered ? side.accent : "rgba(255,255,255,0.25)",
          transform: isHovered ? "rotate(45deg) scale(1.3)" : undefined,
        }}
      />

      {/* giant wordmark: 3D tilt + magnet + outline→fill morph */}
      <motion.span
        className="font-display relative block leading-[0.85]"
        style={{
          rotateX,
          rotateY,
          x: magnetX,
          y: magnetY,
          transformStyle: "preserve-3d",
        }}
      >
        <span className="block overflow-hidden text-[26vw] sm:text-[16vw]">
          {side.word.split("").map((ch, i) => (
            <span
              key={i}
              className={phase === "preload" ? "inline-block opacity-0" : "letter-rise"}
              style={{
                animationDelay: `${0.55 + order * 0.1 + i * 0.07}s`,
                color: isHovered ? side.accent : "transparent",
                WebkitTextStroke: isHovered
                  ? `2px ${side.accent}`
                  : "2px rgba(255,255,255,0.85)",
                transition:
                  "color 0.45s, -webkit-text-stroke-color 0.45s",
              }}
            >
              {ch}
            </span>
          ))}
        </span>
        {/* glossy sweep on hover */}
        <span
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <span
            className={`absolute inset-x-0 h-16 opacity-0 ${
              isHovered ? "glow-sweep opacity-100" : ""
            }`}
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.14), transparent)",
            }}
          />
        </span>
      </motion.span>

      {/* roast line */}
      <div className="mt-3 h-5 overflow-hidden">
        <motion.p
          animate={{ y: isHovered ? 0 : 24, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 sm:text-xs"
        >
          {side.roast}
        </motion.p>
      </div>
    </motion.button>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { setProviderId } = useTheme();
  const [phase, setPhase] = useState<Phase>("preload");
  const [selected, setSelected] = useState<ProviderId | null>(null);
  const [hovered, setHovered] = useState<ProviderId | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (phase !== "select") return;
    idleTimer.current = setTimeout(() => setPhase("timeout"), IDLE_MS);
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "timeout") return;
    const t = setTimeout(() => setPhase("select"), 3400);
    return () => clearTimeout(t);
  }, [phase]);

  function handleSelect(id: ProviderId) {
    if (phase !== "select") return;
    setSelected(id);
    setPhase("win");
    setTimeout(() => setPhase("sequence"), 720);
  }

  function handleSequenceDone() {
    if (selected) setProviderId(selected);
    router.push("/console/home");
  }

  const selectedSide = SIDES.find((s) => s.id === selected);
  const hoveredSide = SIDES.find((s) => s.id === hovered);
  const cursorMode: CursorMode =
    phase === "select" && hoveredSide
      ? { kind: "side", label: hoveredSide.cursorLabel, accent: hoveredSide.accent }
      : { kind: "default" };

  return (
    <main className="cursor-none-zone grain relative flex h-dvh flex-col overflow-hidden bg-[#0a0a0b]">
      <CustomCursor mode={cursorMode} />

      {/* drifting dust with mouse parallax */}
      <DustField className="pointer-events-none absolute inset-0 h-full w-full" />

      <AnimatePresence>
        {phase === "preload" && <Preloader onDone={() => setPhase("select")} />}
      </AnimatePresence>

      {/* top strip */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "preload" ? 0 : 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex items-center justify-between px-5 pt-5 sm:px-8"
      >
        <span className="font-display text-sm tracking-wide text-white">HG</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">
          two clouds &middot; one r&eacute;sum&eacute;
        </span>
      </motion.header>

      {/* headline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: phase === "preload" ? 0 : 1,
          y: phase === "preload" ? 16 : 0,
        }}
        transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
        className="flex items-end justify-between px-5 pt-6 sm:px-8"
      >
        <h1 className="font-display text-[11vw] leading-[0.95] text-white sm:text-[5.5vw]">
          PICK YOUR CLOUD<span style={{ color: "#ff9900" }}>.</span>
          <br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.5)" }}
          >
            PICK YOUR REGRET
          </span>
          <span style={{ color: "#4285f4" }}>.</span>
        </h1>
        <span className="mb-2 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 md:block">
          (refunds unavailable in all regions)
        </span>
      </motion.div>

      {/* split duel */}
      <div className="relative mt-6 flex min-h-0 flex-1 flex-col sm:flex-row">
        {SIDES.map((side, i) => (
          <DuelSide
            key={side.id}
            side={side}
            phase={phase}
            hovered={hovered}
            order={i}
            onHover={() => setHovered(side.id)}
            onLeave={() => setHovered(null)}
            onSelect={() => handleSelect(side.id)}
          />
        ))}

        {/* rotating seal at the seam */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: phase === "preload" ? 0 : 1,
            scale: phase === "preload" ? 0.6 : 1,
          }}
          transition={{ delay: 1.1, duration: 0.7, ease: EASE }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 mix-blend-difference sm:block"
        >
          <SpinSeal fast={hovered !== null} />
        </motion.div>

        {/* vertical edge labels */}
        <span className="vertical-text pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.5em] text-white/20 lg:block">
          choose
        </span>
        <span className="vertical-text pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.5em] text-white/20 lg:block">
          wisely
        </span>
      </div>

      {/* marquee ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "preload" ? 0 : 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="border-t py-3"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div className="flex w-max animate-marquee gap-0 whitespace-nowrap">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {TICKER.map((quip) => (
                <span
                  key={`${dup}-${quip}`}
                  className="flex items-center gap-6 pr-6 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40"
                >
                  {quip}
                  <span style={{ color: "#ff9900" }}>&#10022;</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* win flash: chosen color floods the screen */}
      <AnimatePresence>
        {phase === "win" && selectedSide && (
          <motion.div
            key="flood"
            initial={{ clipPath: "circle(0% at 50% 60%)" }}
            animate={{ clipPath: "circle(140% at 50% 60%)" }}
            transition={{ duration: 0.65, ease: [0.7, 0, 0.3, 1] }}
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ background: selectedSide.accent }}
          >
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4, ease: EASE }}
              className="font-display text-[18vw] leading-none text-black/85 sm:text-[10vw]"
            >
              {selectedSide.word}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "timeout" && <TimeoutJoke key="timeout" />}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "sequence" && selected && (
          <TransitionSequence
            key="sequence"
            theme={themes[selected]}
            onDone={handleSequenceDone}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
