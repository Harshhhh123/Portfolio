"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export type CursorMode =
  | { kind: "default" }
  | { kind: "side"; label: string; accent: string };

const TOUCH_QUERY = "(hover: none), (pointer: coarse)";

function subscribeTouch(cb: () => void) {
  const mq = window.matchMedia(TOUCH_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/* Landing-only cursor: a crisp dot that leads, and a lazy ring that
   chases. Over a vendor half the ring inflates into a labeled pill. */
export function CustomCursor({ mode }: { mode: CursorMode }) {
  const [visible, setVisible] = useState(false);
  const isTouch = useSyncExternalStore(
    subscribeTouch,
    () => window.matchMedia(TOUCH_QUERY).matches,
    () => true
  );

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.7 });
  const ringY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.7 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  if (isTouch) return null;

  const onSide = mode.kind === "side";

  return (
    <>
      {/* leading dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference"
        style={{ x, y, background: "#ffffff", opacity: visible ? 1 : 0 }}
      />
      {/* chasing ring / label pill */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[89] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden whitespace-nowrap"
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
        animate={{
          width: onSide ? 108 : 36,
          height: onSide ? 108 : 36,
          borderRadius: 999,
          backgroundColor: onSide
            ? mode.kind === "side"
              ? mode.accent
              : "transparent"
            : "rgba(255,255,255,0)",
          border: onSide ? "0px solid rgba(255,255,255,0)" : "1px solid rgba(255,255,255,0.45)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <motion.span
          animate={{ opacity: onSide ? 1 : 0, scale: onSide ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
          className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: "#0a0a0b" }}
        >
          {mode.kind === "side" ? mode.label : ""}
        </motion.span>
      </motion.div>
    </>
  );
}
