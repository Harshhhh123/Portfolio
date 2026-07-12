import type { ReactNode } from "react";

type Tone = "accent" | "success" | "warning" | "danger" | "info" | "neutral";

const toneVars: Record<Tone, { bg: string; fg: string }> = {
  accent: { bg: "color-mix(in srgb, var(--accent) 15%, transparent)", fg: "var(--accent)" },
  success: { bg: "var(--success-bg)", fg: "var(--success)" },
  warning: { bg: "var(--warning-bg)", fg: "var(--warning)" },
  danger: { bg: "var(--danger-bg)", fg: "var(--danger)" },
  info: { bg: "var(--info-bg)", fg: "var(--info)" },
  neutral: { bg: "var(--bg-hover)", fg: "var(--text-secondary)" },
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  const v = toneVars[tone];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
      style={{ background: v.bg, color: v.fg }}
    >
      {children}
    </span>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded border px-2 py-0.5 font-mono text-[11px]"
      style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
    >
      {children}
    </span>
  );
}
