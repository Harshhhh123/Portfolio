"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { TriangleAlert } from "lucide-react";

export default function RootNotFound() {
  const { theme } = useTheme();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0a0a0b] px-6 text-center">
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
        style={{ background: "rgba(255,105,97,0.12)", color: "#ff6961" }}
      >
        <TriangleAlert className="h-3 w-3" /> {theme.notFoundCode}
      </span>
      <h1 className="text-3xl font-semibold text-white">{theme.notFoundTitle}</h1>
      <p className="max-w-md text-sm leading-relaxed text-white/55">{theme.notFoundBody}</p>
      <Link
        href="/"
        className="rounded-md px-4 py-2 text-sm font-semibold"
        style={{ background: "var(--accent, #ff9900)", color: "#0b1622" }}
      >
        Back to vendor selection
      </Link>
    </main>
  );
}
