"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, Search } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { emitToast } from "@/lib/toast-bus";
import { projects } from "@/lib/content";
import type { ThemeCopy, ProviderId } from "@/lib/themes/types";
import { themes } from "@/lib/themes";
import { ProviderLogo } from "@/components/console/provider-logo";
import { NotificationBell } from "@/components/console/notification-bell";

function useConsoleSearch(theme: ThemeCopy) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    const projectMatch = projects.find(
      (p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)
    );
    if (projectMatch) {
      router.push(`/console/storage/${projectMatch.id}`);
      setQuery("");
      return;
    }
    const navMatch = theme.navItems.find((n) => n.label.toLowerCase().includes(q));
    if (navMatch) {
      router.push(navMatch.href);
      setQuery("");
      return;
    }
    emitToast("0 results. Blame IAM.", "warning");
  }

  return { query, setQuery, handleSearch };
}

function SwitcherDropdown({
  theme,
  open,
  onClose,
  onSwitch,
  children,
}: {
  theme: ThemeCopy;
  open: boolean;
  onClose: () => void;
  onSwitch: (id: ProviderId) => void;
  children?: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-11 z-50 w-72 overflow-hidden rounded-[var(--radius-panel)] border shadow-xl"
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border-strong)" }}
          >
            {children}
            {(["aws", "gcp"] as ProviderId[]).map((id) => {
              const t = themes[id];
              const active = id === theme.id;
              return (
                <button
                  key={id}
                  onClick={() => onSwitch(id)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] transition-colors hover:bg-[var(--bg-hover)]"
                  style={{
                    background: active ? "var(--bg-selected)" : "transparent",
                    color: "var(--text-primary)",
                  }}
                >
                  <span>
                    {t.providerShort} &middot; {t.regionLabel}
                  </span>
                  {active && (
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px]"
                      style={{ background: "var(--success-bg)", color: "var(--success)" }}
                    >
                      active
                    </span>
                  )}
                </button>
              );
            })}
            <div
              className="border-t px-3 py-2 text-[10.5px] leading-snug"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
            >
              Same résumé, different regrets.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function Topbar({
  theme,
  onMenuToggle,
}: {
  theme: ThemeCopy;
  onMenuToggle: () => void;
}) {
  const { setProviderId } = useTheme();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const { query, setQuery, handleSearch } = useConsoleSearch(theme);
  const isAws = theme.id === "aws";

  function handleSwitch(id: ProviderId) {
    setSwitcherOpen(false);
    if (id === theme.id) return;
    setProviderId(id);
    emitToast(
      id === "aws" ? "Migrated to AWS. Bill pending." : "Migrated to GCP. Deprecation pending.",
      "info"
    );
  }

  if (isAws) {
    /* AWS: slim dark navy bar. Logo, wide services search, then
       bell / region / account on the right. */
    return (
      <motion.header
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-2 border-b px-2.5 sm:gap-3 sm:px-4"
        style={{ background: "var(--topbar-bg)", borderColor: "var(--topbar-border)" }}
      >
        <button
          onClick={onMenuToggle}
          className="rounded-[2px] p-1.5 lg:hidden"
          style={{ color: "var(--topbar-text)" }}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/console/home" className="flex shrink-0 items-center px-1">
          <ProviderLogo id="aws" />
        </Link>

        <div className="mx-1 hidden h-6 w-px bg-white/15 sm:block" />

        <form onSubmit={handleSearch} className="hidden max-w-lg flex-1 md:block">
          <div
            className="flex items-center gap-2 rounded-[3px] border px-3 py-[7px]"
            style={{
              background: "rgba(255,255,255,0.08)",
              borderColor: "rgba(255,255,255,0.25)",
            }}
          >
            <Search className="h-3.5 w-3.5 shrink-0 text-white/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={theme.searchPlaceholder}
              className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/45"
            />
            <kbd className="hidden rounded-[2px] border border-white/25 px-1.5 text-[10px] text-white/45 lg:block">
              Alt+S
            </kbd>
          </div>
        </form>

        <div className="relative ml-auto flex items-center gap-0.5 sm:gap-1.5">
          <NotificationBell theme={theme} />

          <div className="relative">
            <button
              onClick={() => setSwitcherOpen((o) => !o)}
              className="flex items-center gap-1 px-2 py-1.5 text-[13px] font-bold hover:bg-white/10"
              style={{ color: "var(--topbar-text)" }}
            >
              {theme.regionLabel.split("-").slice(0, 2).join("-")}-1
              <ChevronDown className="h-3 w-3" />
            </button>
            <SwitcherDropdown
              theme={theme}
              open={switcherOpen}
              onClose={() => setSwitcherOpen(false)}
              onSwitch={handleSwitch}
            >
              <div
                className="border-b px-3 py-2 text-[11px] uppercase tracking-wide"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
              >
                Region / Provider
              </div>
            </SwitcherDropdown>
          </div>

          <button
            className="hidden items-center gap-1 px-2 py-1.5 text-[13px] hover:bg-white/10 sm:flex"
            style={{ color: "var(--topbar-text)" }}
            title={theme.userArn}
          >
            harsh-goilkar @ {theme.accountId}
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </motion.header>
    );
  }

  /* GCP: hamburger, Google Cloud logo, project picker pill,
     big centered pill search, bell + avatar on the right. */
  return (
    <motion.header
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-2 border-b px-2.5 sm:gap-3 sm:px-4"
      style={{ background: "var(--topbar-bg)", borderColor: "var(--topbar-border)" }}
    >
      <button
        onClick={onMenuToggle}
        className="rounded-full p-2 hover:bg-white/10"
        style={{ color: "var(--topbar-text)" }}
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link href="/console/home" className="flex shrink-0 items-center gap-2">
        <ProviderLogo id="gcp" />
        {/* <span className="hidden text-[17px] sm:inline" style={{ color: "var(--topbar-text)" }}>
          Google <span className="font-medium">Cloud</span>
        </span> */}
      </Link>

      <div className="relative">
        <button
          onClick={() => setSwitcherOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[13px] hover:bg-white/5"
          style={{ borderColor: "var(--border-strong)", color: "var(--topbar-text)" }}
        >
          <span className="max-w-[130px] truncate sm:max-w-[220px]">{theme.accountId}</span>
          <ChevronDown className="h-3 w-3 shrink-0" />
        </button>
        <SwitcherDropdown
          theme={theme}
          open={switcherOpen}
          onClose={() => setSwitcherOpen(false)}
          onSwitch={handleSwitch}
        >
          <div
            className="border-b px-3 py-2 text-[11px] uppercase tracking-wide"
            style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
          >
            Project / Provider
          </div>
        </SwitcherDropdown>
      </div>

      <form onSubmit={handleSearch} className="mx-auto hidden max-w-xl flex-1 md:block">
        <div
          className="flex items-center gap-2.5 rounded-full px-4 py-2"
          style={{ background: "var(--bg-hover)" }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={theme.searchPlaceholder}
            className="w-full bg-transparent text-[13.5px] outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <kbd
            className="hidden rounded border px-1.5 text-[10px] lg:block"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)" }}
          >
            /
          </kbd>
        </div>
      </form>

      <div className="ml-auto flex items-center gap-0.5 md:ml-0">
        <NotificationBell theme={theme} />
        <button
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-medium"
          style={{ background: "#8ab4f8", color: "#062e6f" }}
          title={theme.userArn}
        >
          H
        </button>
      </div>
    </motion.header>
  );
}
