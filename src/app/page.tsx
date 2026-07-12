"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TransitionSequence } from "@/components/landing/transition-sequence";
import { TimeoutJoke } from "@/components/landing/timeout-joke";
import { Preloader } from "@/components/landing/preloader";
import { useTheme } from "@/lib/theme-context";
import { themes } from "@/lib/themes";
import type { ProviderId } from "@/lib/themes/types";

type Phase = "preload" | "select" | "timeout" | "win" | "sequence";

const IDLE_MS = 26000;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SIDES: {
  id: ProviderId;
  word: string;
  accent: string;
  tint: string;
  roast: string;
  index: string;
}[] = [
  {
    id: "aws",
    word: "AWS",
    accent: "#ff9900",
    tint: "rgba(255,153,0,0.07)",
    roast: "200+ services. You'll use 12.",
    index: "01",
  },
  {
    id: "gcp",
    word: "GCP",
    accent: "#4285f4",
    tint: "rgba(66,133,244,0.08)",
    roast: "Gorgeous console. Enjoy it before it's discontinued.",
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

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden bg-[#0a0a0b]">
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
        className="px-5 pt-6 sm:px-8"
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
      </motion.div>

      {/* split duel */}
      <div className="mt-6 flex min-h-0 flex-1 flex-col sm:flex-row">
        {SIDES.map((side, i) => {
          const isHovered = hovered === side.id;
          const otherHovered = hovered !== null && !isHovered;
          return (
            <motion.button
              key={side.id}
              type="button"
              disabled={phase !== "select"}
              onClick={() => handleSelect(side.id)}
              onMouseEnter={() => setHovered(side.id)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0 }}
              animate={{
                opacity: phase === "preload" ? 0 : 1,
                flexGrow: isHovered ? 1.7 : otherHovered ? 0.75 : 1,
              }}
              transition={{
                opacity: { delay: 0.5 + i * 0.12, duration: 0.7 },
                flexGrow: { duration: 0.7, ease: EASE },
              }}
              className="group relative flex min-h-0 flex-1 flex-col items-start justify-end overflow-hidden border-t px-5 pb-6 text-left sm:border-l sm:border-t-0 sm:px-8 sm:pb-8"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                background: isHovered ? side.tint : "transparent",
                transition: "background 0.5s",
              }}
            >
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

              {/* giant wordmark */}
              <span
                className="font-display block text-[26vw] leading-[0.85] transition-colors duration-500 sm:text-[16vw]"
                style={{
                  color: isHovered ? side.accent : "#ffffff",
                  letterSpacing: "-0.01em",
                }}
              >
                {side.word}
              </span>

              {/* roast line — one sentence, reveals on hover (always on mobile) */}
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
        })}
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
