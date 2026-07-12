"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getBreadcrumbs } from "@/lib/breadcrumbs";
import type { ThemeCopy } from "@/lib/themes/types";

export function BreadcrumbBar({ theme }: { theme: ThemeCopy }) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname, theme);
  if (crumbs.length === 0) return null;

  return (
    <div
      className="flex items-center gap-1.5 border-b px-4 py-2 font-mono text-[12px] sm:px-6"
      style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
    >
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={`${c.href}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            {last ? (
              <span style={{ color: "var(--text-secondary)" }}>{c.label}</span>
            ) : (
              <Link href={c.href} className="hover:underline">
                {c.label}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
