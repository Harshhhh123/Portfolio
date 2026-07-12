"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { subscribeToast, type ToastKind } from "@/lib/toast-bus";

interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
}

const ICONS: Record<ToastKind, typeof Info> = {
  info: Bell,
  success: CheckCircle2,
  warning: TriangleAlert,
};

let counter = 0;

export function ToastStack() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    return subscribeToast(({ message, kind = "info" }) => {
      const id = counter++;
      setToasts((t) => [...t, { id, message, kind }]);
      const timer = setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
        timers.current.delete(id);
      }, 6000);
      timers.current.set(id, timer);
    });
  }, []);

  function dismiss(id: number) {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    setToasts((t) => t.filter((x) => x.id !== id));
  }

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-full max-w-sm flex-col gap-2.5">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.kind];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto flex items-start gap-3 rounded-[var(--radius-panel)] border px-4 py-3 shadow-lg"
              style={{
                background: "var(--bg-elevated)",
                borderColor: "var(--border-strong)",
                color: "var(--text-primary)",
                boxShadow: "0 8px 24px var(--shadow-color)",
              }}
            >
              <Icon
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{
                  color:
                    t.kind === "success"
                      ? "var(--success)"
                      : t.kind === "warning"
                        ? "var(--warning)"
                        : "var(--accent)",
                }}
              />
              <p className="flex-1 text-[13px] leading-snug">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 opacity-50 transition-opacity hover:opacity-100"
                aria-label="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
