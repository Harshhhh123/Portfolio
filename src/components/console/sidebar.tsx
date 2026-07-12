"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { NavIcon } from "@/components/icon-map";
import type { ThemeCopy } from "@/lib/themes/types";

export function Sidebar({
  theme,
  mobileOpen,
  onNavigate,
}: {
  theme: ThemeCopy;
  mobileOpen: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isAws = theme.id === "aws";

  if (isAws) {
    return (
      <AwsSidebar
        theme={theme}
        pathname={pathname}
        mobileOpen={mobileOpen}
        onNavigate={onNavigate}
      />
    );
  }
  return (
    <GcpRail
      theme={theme}
      pathname={pathname}
      mobileOpen={mobileOpen}
      onNavigate={onNavigate}
    />
  );
}

/* AWS: persistent white side navigation panel, Cloudscape-style.
   Section label, thin divider, blue active link with left bar. */
function AwsSidebar({
  theme,
  pathname,
  mobileOpen,
  onNavigate,
}: {
  theme: ThemeCopy;
  pathname: string;
  mobileOpen: boolean;
  onNavigate?: () => void;
}) {
  return (
    <motion.aside
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
      className={`fixed inset-y-0 left-0 z-40 w-60 shrink-0 border-r pt-14 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        background: "var(--bg-sidebar)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <nav className="flex h-full flex-col overflow-y-auto py-4">
        <div className="flex items-baseline justify-between px-4 pb-2">
          <p className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>
            Console
          </p>
          <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
            v2.7.1
          </span>
        </div>
        <div className="mx-4 mb-2 border-t" style={{ borderColor: "var(--border-subtle)" }} />
        {theme.navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              className="relative flex items-center gap-2.5 py-[7px] pl-4 pr-3 text-[13.5px] transition-colors hover:bg-[var(--bg-hover)]"
              style={{
                background: active ? "var(--bg-selected)" : undefined,
                color: active ? "var(--accent)" : "var(--text-secondary)",
                fontWeight: active ? 700 : 400,
              }}
            >
              {active && (
                <span
                  className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: "var(--accent)" }}
                />
              )}
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
        <div className="mx-4 mt-3 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {theme.billingNote}
          </p>
        </div>
      </nav>
    </motion.aside>
  );
}

/* GCP: collapsed icon rail that expands on hover, dark Material style. */
function GcpRail({
  theme,
  pathname,
  mobileOpen,
  onNavigate,
}: {
  theme: ThemeCopy;
  pathname: string;
  mobileOpen: boolean;
  onNavigate?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const expanded = hovered || mobileOpen;

  return (
    <motion.aside
      initial={{ x: -72, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`fixed inset-y-0 left-0 z-40 shrink-0 border-r pt-14 transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
      style={{
        background: "var(--bg-sidebar)",
        borderColor: "var(--border-subtle)",
        width: expanded ? 256 : 68,
        boxShadow: expanded ? "0 0 24px var(--shadow-color)" : "none",
      }}
    >
      <nav className="flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden px-3 py-3">
        {theme.navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              title={expanded ? undefined : item.label}
              className="flex h-10 items-center gap-3 rounded-full px-[11px] text-[13.5px] transition-colors hover:bg-[var(--bg-hover)]"
              style={{
                background: active ? "var(--bg-selected)" : undefined,
                color: active ? "var(--accent)" : "var(--text-secondary)",
                fontWeight: active ? 500 : 400,
              }}
            >
              <NavIcon
                name={item.icon}
                className="h-[18px] w-[18px] shrink-0"
                style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
              />
              <span
                className="truncate transition-opacity duration-150"
                style={{ opacity: expanded ? 1 : 0 }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        <div
          className="mt-auto overflow-hidden rounded-xl border p-3 text-[11px] leading-relaxed transition-opacity duration-150"
          style={{
            borderColor: "var(--border-subtle)",
            color: "var(--text-muted)",
            opacity: expanded ? 1 : 0,
          }}
        >
          {theme.billingNote}
        </div>
      </nav>
    </motion.aside>
  );
}
