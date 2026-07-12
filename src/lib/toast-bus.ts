"use client";

export type ToastKind = "info" | "success" | "warning";

export interface ToastPayload {
  message: string;
  kind?: ToastKind;
}

const EVENT_NAME = "hg:toast";

export function emitToast(message: string, kind: ToastKind = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToastPayload>(EVENT_NAME, { detail: { message, kind } })
  );
}

export function subscribeToast(cb: (payload: ToastPayload) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => cb((e as CustomEvent<ToastPayload>).detail);
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
