import type { ReactNode } from "react";
import { AlertTriangle, Info } from "lucide-react";

export function ConsoleAlert({
  tone = "info",
  children,
}: {
  tone?: "info" | "warning";
  children: ReactNode;
}) {
  const Icon = tone === "warning" ? AlertTriangle : Info;
  return (
    <div
      className="flex items-start gap-2.5 rounded-[var(--radius-panel)] border px-4 py-3 text-[13px] leading-relaxed"
      style={{
        background: tone === "warning" ? "var(--warning-bg)" : "var(--info-bg)",
        borderColor: tone === "warning" ? "var(--warning)" : "var(--info)",
        color: "var(--text-primary)",
      }}
    >
      <Icon
        className="mt-0.5 h-4 w-4 shrink-0"
        style={{ color: tone === "warning" ? "var(--warning)" : "var(--info)" }}
      />
      <div>{children}</div>
    </div>
  );
}
