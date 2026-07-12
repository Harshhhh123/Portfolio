"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { ThemeCopy } from "@/lib/themes/types";
import { WarpField } from "@/components/landing/warp-field";

type Phase = "urlbar" | "boot" | "granted";

const CHAR_MS = 13;
const LINE_MS = 135;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function buildUrl(theme: ThemeCopy) {
  if (theme.id === "aws") {
    return `https://${theme.domain}/console/home?region=${theme.regionLabel}#/dashboard`;
  }
  return `https://${theme.domain}/home/dashboard?project=${theme.accountId}`;
}

/* Lines that get a [WARN] tick instead of [ OK ] — the joke beats. */
function tickFor(line: string): "ok" | "warn" {
  return /you'll use|deprecated|fiscal|anxiety|please hold|shades of blue/i.test(line)
    ? "warn"
    : "ok";
}

export function TransitionSequence({
  theme,
  onDone,
}: {
  theme: ThemeCopy;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("urlbar");
  const [urlChars, setUrlChars] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const url = useMemo(() => buildUrl(theme), [theme]);
  const logRef = useRef<HTMLDivElement>(null);
  const isAws = theme.id === "aws";
  const accent = isAws ? "#ff9900" : "#4285f4";

  useEffect(() => {
    if (phase !== "urlbar") return;
    if (urlChars >= url.length) {
      const t = setTimeout(() => setPhase("boot"), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setUrlChars((c) => c + 1), CHAR_MS);
    return () => clearTimeout(t);
  }, [phase, urlChars, url]);

  useEffect(() => {
    if (phase !== "boot") return;
    if (lineIndex >= theme.bootSequence.length) {
      const t = setTimeout(() => setPhase("granted"), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLineIndex((i) => i + 1);
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
    }, LINE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, lineIndex]);

  useEffect(() => {
    if (phase !== "granted") return;
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grain fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0a0a0b] p-5"
    >
      {/* provider-colored ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(720px circle at 50% 30%, ${accent}18, transparent 60%)`,
        }}
      />

      {/* ghost vertical BOOT text */}
      <span
        className="font-display pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 rotate-90 text-[22vh] leading-none"
        style={{ color: "rgba(255,255,255,0.035)" }}
        aria-hidden
      >
        BOOT
      </span>

      <motion.div
        className="relative w-full max-w-2xl"
        animate={
          phase === "granted"
            ? { scale: 0.9, opacity: 0.12, filter: "blur(3px)" }
            : { scale: 1, opacity: 1, filter: "blur(0px)" }
        }
        transition={{ duration: 0.5, ease: EASE }}
      >
        {/* glass browser chrome — stands up from a lying-flat angle */}
        <motion.div
          initial={{ y: 36, opacity: 0, scale: 0.96, rotateX: 22 }}
          animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="overflow-hidden rounded-xl border backdrop-blur-md"
          style={{
            transformPerspective: 1100,
            borderColor: "rgba(255,255,255,0.12)",
            background: "rgba(20,21,24,0.75)",
            boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03), 0 0 42px ${accent}14`,
          }}
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
              incognito &middot; obviously
            </span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-3">
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
              style={{ background: accent, color: "#0a0a0b" }}
            >
              {isAws ? "a" : "G"}
            </span>
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-black/50 px-3.5 py-2">
              <Lock className="h-3 w-3 shrink-0 text-white/40" />
              <span className="truncate font-mono text-[12.5px] text-white/85">
                {url.slice(0, urlChars)}
                <span className="caret-blink" style={{ color: accent }}>
                  ▌
                </span>
              </span>
            </div>
          </div>

          {/* CRT terminal */}
          <div
            ref={logRef}
            className="crt-scanlines crt-flicker relative h-72 overflow-hidden border-t border-white/10 bg-black/70 px-5 py-4 font-mono text-[12px] leading-[1.7]"
          >
            {/* sweeping glow bar */}
            <span
              className="glow-sweep pointer-events-none absolute inset-x-0 top-0 z-[2] h-10"
              style={{
                background: `linear-gradient(to bottom, transparent, ${accent}10, transparent)`,
              }}
            />
            {theme.bootSequence.slice(0, lineIndex).map((line, i) => {
              const tick = tickFor(line);
              return (
                <div key={i} className="flex items-baseline gap-3">
                  <span className="shrink-0 text-white/25">
                    {String(i * 87 + 113).padStart(4, "0")}ms
                  </span>
                  <span
                    className="min-w-0 flex-1 truncate"
                    style={{
                      color: i === lineIndex - 1 ? "#ffffff" : "rgba(126,231,135,0.75)",
                    }}
                  >
                    {line}
                  </span>
                  <span
                    className="shrink-0 text-[10px] font-bold tracking-widest"
                    style={{ color: tick === "ok" ? "#7ee787" : "#fdd663" }}
                  >
                    [{tick === "ok" ? "  OK  " : " WARN "}]
                  </span>
                </div>
              );
            })}
            {phase === "boot" && lineIndex < theme.bootSequence.length && (
              <span className="caret-blink text-[#7ee787]">▌</span>
            )}
          </div>
        </motion.div>

        {/* progress hairline */}
        <div className="mt-5 h-px w-full overflow-hidden bg-white/10">
          <motion.div
            className="h-full"
            style={{ background: accent }}
            animate={{
              width:
                phase === "urlbar"
                  ? `${(urlChars / url.length) * 30}%`
                  : phase === "boot"
                    ? `${30 + (lineIndex / theme.bootSequence.length) * 60}%`
                    : "100%",
            }}
            transition={{ duration: 0.15 }}
          />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
          <span>{isAws ? "assuming role" : "switching project"}</span>
          <span>{theme.regionLabel}</span>
        </div>
      </motion.div>

      {/* ACCESS GRANTED: hyperspace warp + stamp slam */}
      {phase === "granted" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12 }}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <WarpField
            color={accent}
            className="absolute inset-0 h-full w-full"
          />
          <motion.div
            initial={{ scale: 2.1, rotate: -14, opacity: 0 }}
            animate={{ scale: 1, rotate: -6, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 17 }}
            className="relative border-4 bg-black/45 px-8 py-4 backdrop-blur-[2px] sm:px-12 sm:py-6"
            style={{ borderColor: accent, boxShadow: `0 0 60px ${accent}55, inset 0 0 30px ${accent}22` }}
          >
            <span
              className="font-display block text-[10vw] leading-none sm:text-7xl"
              style={{ color: accent }}
            >
              ACCESS GRANTED
            </span>
            <span className="mt-2 block text-center font-mono text-[10px] uppercase tracking-[0.4em] text-white/80">
              welcome in &middot; wipe your feet
            </span>
          </motion.div>

          {/* terminal white-out just before the console mounts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35, duration: 0.25 }}
            className="absolute inset-0"
            style={{ background: accent }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
