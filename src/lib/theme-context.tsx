"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { themes } from "@/lib/themes";
import type { ProviderId, ThemeCopy } from "@/lib/themes/types";

const STORAGE_KEY = "hg-console-provider";
const listeners = new Set<() => void>();

function readStored(): ProviderId | null {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "aws" || stored === "gcp" ? stored : null;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getServerSnapshot(): ProviderId | null {
  return null;
}

interface ThemeContextValue {
  providerId: ProviderId | null;
  theme: ThemeCopy;
  ready: boolean;
  setProviderId: (id: ProviderId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const providerId = useSyncExternalStore(subscribe, readStored, getServerSnapshot);

  useEffect(() => {
    document.documentElement.setAttribute("data-provider", providerId ?? "aws");
  }, [providerId]);

  const setProviderId = useCallback((id: ProviderId) => {
    window.localStorage.setItem(STORAGE_KEY, id);
    listeners.forEach((l) => l());
  }, []);

  const theme = themes[providerId ?? "aws"];

  return (
    <ThemeContext.Provider value={{ providerId, theme, ready: true, setProviderId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
