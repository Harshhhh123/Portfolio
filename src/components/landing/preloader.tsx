"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const WORDS = [
  "PROVISIONING",
  "AUTHENTICATING",
  "CONTAINERIZING",
  "CAFFEINATING",
  "DEPLOYING",
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const start = Date.now();
    const duration = 2400;
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      // ease the counter so it sprints then settles, like a real loader
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 2.4);
      setPct(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        setTimeout(onDone, 350);
      }
    };
    raf = requestAnimationFrame(tick);

    const wordTimer = setInterval(() => {
      setWordIdx((i) => (i + 1) % WORDS.length);
    }, 480);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(wordTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: EASE }}
      className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-[#0a0a0b] px-6 py-6 sm:px-10 sm:py-8"
    >
      {/* top row */}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
        >
          Portfolio
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
          key={wordIdx}
          className="text-white/60"
        >
          {WORDS[wordIdx]}
        </motion.span>
      </div>

      {/* center: masked name reveal */}
      <div className="flex flex-col items-start">
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.15, duration: 1, ease: EASE }}
            className="font-display text-[16vw] leading-[0.9] text-white sm:text-[11vw]"
          >
            HARSH
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.28, duration: 1, ease: EASE }}
            className="font-display text-[16vw] leading-[0.9] text-transparent sm:text-[11vw]"
            style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.55)" }}
          >
            GOILKAR
          </motion.h1>
        </div>
      </div>

      {/* bottom row: progress + giant counter */}
      <div className="flex items-end justify-between gap-6">
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
  );
}
