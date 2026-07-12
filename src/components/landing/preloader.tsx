"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ContainerCube } from "@/components/landing/container-cube";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SLATS = 5;

const WORDS = [
  "PROVISIONING",
  "AUTHENTICATING",
  "CONTAINERIZING",
  "CAFFEINATING",
  "DEPLOYING",
];

const slatVariants: Variants = {
  visible: { y: 0 },
  exit: (i: number) => ({
    y: "-100%",
    transition: { duration: 0.75, ease: EASE, delay: i * 0.07 },
  }),
};

const contentVariants: Variants = {
  visible: { opacity: 1 },
  exit: { opacity: 0, y: -24, transition: { duration: 0.35, ease: "easeIn" } },
};

function hexLine() {
  const addr = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");
  const checks = ["MEM", "NET", "GPU", "EGO", "DNS", "SSL"];
  const c = checks[Math.floor(Math.random() * checks.length)];
  return `0x${addr}  ${c} ......... OK`;
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [hexLines, setHexLines] = useState<string[]>([]);
  const doneRef = useRef(false);

  useEffect(() => {
    const start = Date.now();
    const duration = 2500;
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 2.4);
      setPct(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        setTimeout(onDone, 250);
      }
    };
    raf = requestAnimationFrame(tick);

    const wordTimer = setInterval(() => {
      setWordIdx((i) => (i + 1) % WORDS.length);
    }, 480);
    const hexTimer = setInterval(() => {
      setHexLines((l) => [...l.slice(-4), hexLine()]);
    }, 130);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(wordTimer);
      clearInterval(hexTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const name = ["HARSH", "GOILKAR"];

  return (
    <motion.div
      initial="visible"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* slat curtain background */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: SLATS }).map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={slatVariants}
            className="h-[102%] flex-1 bg-[#0a0a0b]"
            style={{ boxShadow: "1px 0 0 rgba(255,255,255,0.04)" }}
          />
        ))}
      </div>

      {/* content */}
      <motion.div
        variants={contentVariants}
        className="grain absolute inset-0 flex flex-col justify-between px-6 py-6 sm:px-10 sm:py-8"
      >
        {/* container cluster assembling itself, right of center */}
        <div className="pointer-events-none absolute right-[-14vmin] top-1/2 h-[86vmin] w-[86vmin] -translate-y-1/2 sm:right-[2vmin]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="h-full w-full"
          >
            <ContainerCube className="h-full w-full" />
          </motion.div>
        </div>

        {/* top row */}
        <div className="relative z-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          <span>Portfolio &middot; v2027</span>
          <span key={wordIdx} className="text-white/60">
            {WORDS[wordIdx]}
          </span>
        </div>

        {/* center: chromatic per-letter name */}
        <div className="relative z-10 flex flex-col items-start">
          {name.map((word, w) => (
            <div key={word} className="overflow-hidden">
              <h1
                className={`font-display text-[16vw] leading-[0.9] sm:text-[11vw] ${
                  w === 1 ? "text-transparent" : "text-white"
                }`}
                style={
                  w === 1
                    ? { WebkitTextStroke: "1.5px rgba(255,255,255,0.55)" }
                    : undefined
                }
              >
                {word.split("").map((ch, i) => (
                  <span
                    key={i}
                    className="chroma-rise"
                    style={{ animationDelay: `${0.15 + w * 0.12 + i * 0.045}s` }}
                  >
                    {ch}
                  </span>
                ))}
              </h1>
            </div>
          ))}
        </div>

        {/* bottom: hex ticker, hairline, giant counter */}
        <div className="relative z-10 flex items-end justify-between gap-6">
          <div className="mb-1 hidden flex-col gap-0.5 font-mono text-[10px] text-white/25 sm:flex">
            {hexLines.map((l, i) => (
              <span key={`${l}-${i}`}>{l}</span>
            ))}
          </div>
          <div className="mb-3 flex-1">
            <div className="h-px w-full bg-white/10">
              <motion.div
                className="h-full bg-white"
                style={{ width: `${pct}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
          <span className="font-display text-6xl tabular-nums leading-none text-white sm:text-8xl">
            {pct}
            <span className="text-white/40">%</span>
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
