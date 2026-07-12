"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import type { ThemeCopy } from "@/lib/themes/types";

const gotchaLine: Record<string, string> = {
  aws: "Psyched!! Nothing's on fire.",
  gcp: "Psyched!! Nothing's sunset.",
};

export function NotificationBell({ theme }: { theme: ThemeCopy }) {
  const [syncing, setSyncing] = useState(false);
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function scheduleNext() {
      const delay = 45000 + Math.random() * 45000;
      timerRef.current = setTimeout(() => {
        setSyncing(true);
      }, delay);
    }
    scheduleNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleOpen() {
    setOpen((o) => !o);
    if (syncing) {
      setTimeout(() => setRevealed(true), 550);
    }
  }

  function handleClose() {
    setOpen(false);
    setSyncing(false);
    setRevealed(false);
    const delay = 60000 + Math.random() * 60000;
    timerRef.current = setTimeout(() => setSyncing(true), delay);
  }

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative rounded-[var(--radius-button)] p-2"
        style={{ color: "var(--topbar-text)" }}
        aria-label="Notifications"
      >
        {syncing && (
          <span
            className="absolute inset-0 m-auto h-5 w-5 rounded-full"
            style={{ boxShadow: "0 0 0 2px #34a853" }}
          >
            <span className="animate-ping-ring absolute inset-0 rounded-full" style={{ boxShadow: "0 0 0 2px #34a853" }} />
          </span>
        )}
        <Bell className="h-[18px] w-[18px]" />
        {syncing && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full" style={{ background: "#34a853" }} />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={handleClose} />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-[var(--radius-panel)] border shadow-xl"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border-strong)" }}
            >
              <div
                className="border-b px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
              >
                Notifications
              </div>
              <div className="p-4 text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {syncing && !revealed && (
                  <p style={{ color: "var(--text-secondary)" }}>Syncing status...</p>
                )}
                {syncing && revealed && (
                  <motion.p
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="text-base font-bold"
                  >
                    {gotchaLine[theme.id]}
                  </motion.p>
                )}
                {!syncing && (
                  <p style={{ color: "var(--text-secondary)" }}>
                    Zero notifications. Suspiciously calm.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
