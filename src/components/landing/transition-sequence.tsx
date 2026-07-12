"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { ThemeCopy } from "@/lib/themes/types";

type Phase = "urlbar" | "boot";

const CHAR_MS = 14;
const LINE_MS = 130;

function buildUrl(theme: ThemeCopy) {
  if (theme.id === "aws") {
    return `https://${theme.domain}/console/home?region=${theme.regionLabel}#/dashboard`;
  }
  return `https://${theme.domain}/home/dashboard?project=${theme.accountId}`;
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

  useEffect(() => {
    if (phase !== "urlbar") return;
    if (urlChars >= url.length) {
      const t = setTimeout(() => setPhase("boot"), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setUrlChars((c) => c + 1), CHAR_MS);
    return () => clearTimeout(t);
  }, [phase, urlChars, url]);

  useEffect(() => {
    if (phase !== "boot") return;
    if (lineIndex >= theme.bootSequence.length) {
      const t = setTimeout(onDone, 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLineIndex((i) => i + 1);
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
    }, LINE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, lineIndex]);

  const isAws = theme.id === "aws";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0b] p-6"
    >
      <div className="w-full max-w-2xl">
        {/* fake browser chrome */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden rounded-t-lg border border-white/10 bg-[#15181d]"
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5">
            <div
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[9px] font-bold"
              style={{
                background: isAws ? "#ff9900" : "#1a73e8",
                color: isAws ? "#0b1622" : "#ffffff",
              }}
            >
              {isAws ? "a" : "G"}
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-[#0b0d10] px-3 py-1.5">
              <Lock className="h-3 w-3 shrink-0 text-white/40" />
              <span className="truncate font-mono text-[12px] text-white/70">
                {url.slice(0, urlChars)}
                <span className="caret-blink text-white/70">|</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* boot log terminal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "boot" ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
          ref={logRef}
          className="h-64 overflow-hidden rounded-b-lg border border-t-0 border-white/10 bg-[#05070a] p-4 font-mono text-[12.5px] leading-relaxed text-[#7ee787]"
        >
          {theme.bootSequence.slice(0, lineIndex).map((line, i) => (
            <div key={i} className="flex gap-2">
              <span className="shrink-0 text-white/25">
                [{String(i).padStart(2, "0")}]
              </span>
              <span className={i === lineIndex - 1 ? "text-white" : "text-[#7ee787]/80"}>
                {line}
              </span>
            </div>
          ))}
          {phase === "boot" && lineIndex < theme.bootSequence.length && (
            <span className="caret-blink text-[#7ee787]">▍</span>
          )}
        </motion.div>

        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full"
            style={{ background: isAws ? "#ff9900" : "#1a73e8" }}
            animate={{
              width:
                phase === "urlbar"
                  ? "15%"
                  : `${15 + (lineIndex / theme.bootSequence.length) * 85}%`,
            }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
