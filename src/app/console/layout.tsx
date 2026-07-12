"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Topbar } from "@/components/console/topbar";
import { Sidebar } from "@/components/console/sidebar";
import { BreadcrumbBar } from "@/components/console/breadcrumb-bar";
import { ToastStack } from "@/components/console/toast-stack";
import { useTheme } from "@/lib/theme-context";
import { emitToast } from "@/lib/toast-bus";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, ready } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const welcome = setTimeout(() => {
      emitToast(theme.toastBank[0], "success");
    }, 1400);

    let ambientTimer: ReturnType<typeof setTimeout>;
    function scheduleAmbient() {
      const delay = 120000 + Math.random() * 180000; // 2-5 minutes
      ambientTimer = setTimeout(() => {
        const line = theme.toastBank[Math.floor(Math.random() * theme.toastBank.length)];
        emitToast(line, "info");
        scheduleAmbient();
      }, delay);
    }
    scheduleAmbient();

    return () => {
      clearTimeout(welcome);
      clearTimeout(ambientTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, theme.id]);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-canvas)", color: "var(--text-primary)" }}
    >
      <Topbar theme={theme} onMenuToggle={() => setMobileOpen((o) => !o)} />
      <div className="flex">
        <Sidebar
          theme={theme}
          mobileOpen={mobileOpen}
          onNavigate={() => setMobileOpen(false)}
        />
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col pt-14">
          {theme.id === "aws" && <BreadcrumbBar theme={theme} />}
          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8"
          >
            {children}
          </motion.main>
          <footer
            className="border-t px-4 py-4 text-center font-mono text-[11px] sm:px-6"
            style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
          >
            {theme.footerNote}
          </footer>
        </div>
      </div>
      <ToastStack />
    </div>
  );
}
