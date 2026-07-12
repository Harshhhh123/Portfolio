"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { Panel } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { TriangleAlert } from "lucide-react";

export default function ConsoleNotFound() {
  const { theme } = useTheme();
  const [requestId] = useState(
    () => `${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`
  );

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 py-16 text-center">
      <Badge tone="danger">
        <TriangleAlert className="h-3 w-3" /> {theme.notFoundCode}
      </Badge>
      <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
        {theme.notFoundTitle}
      </h1>
      <p className="max-w-md text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {theme.notFoundBody}
      </p>
      <Panel className="w-full text-left">
        <p className="mb-2 font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
          Request ID: {requestId}
        </p>
        <p className="font-mono text-[12px]" style={{ color: "var(--text-secondary)" }}>
          {theme.id === "aws"
            ? "HTTP/1.1 404 Not Found -- x-amzn-ErrorType: ResourceNotFoundException"
            : "HTTP/1.1 404 Not Found -- error.status: NOT_FOUND"}
        </p>
      </Panel>
      <Link
        href="/console/home"
        className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold"
        style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
      >
        {theme.notFoundCta}
      </Link>
    </div>
  );
}
