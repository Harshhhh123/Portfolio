"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { projects } from "@/lib/content";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { ConsoleAlert } from "@/components/ui/console-alert";
import { Database, Github, Video } from "lucide-react";

export default function StoragePage() {
  const { theme } = useTheme();
  const isAws = theme.id === "aws";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        eyebrow={isAws ? "S3 / Buckets" : "Cloud Storage / Buckets"}
        title={isAws ? "Buckets" : "Buckets"}
        description="Each bucket below is a real, independently shipped project. Public read access is intentional -- these are meant to be viewed."
      />

      <ConsoleAlert tone="info">
        Versioning is enabled on every bucket. Every commit is kept, including the
        ones written at 2 a.m. that shouldn&apos;t be trusted.
      </ConsoleAlert>

      <Panel className="overflow-hidden p-0!">
        <div
          className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b px-5 py-2.5 text-[11px] uppercase tracking-wide"
          style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
        >
          <span>Bucket name</span>
          <span className="hidden sm:block">Category</span>
          <span className="hidden sm:block">Evidence</span>
          <span>Access</span>
        </div>
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/console/storage/${p.id}`}
            className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b px-5 py-4 text-sm transition-colors last:border-b-0 hover:bg-[var(--bg-hover)]"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <Database className="h-4 w-4 shrink-0" style={{ color: "var(--accent)" }} />
              <span className="min-w-0">
                <span className="block truncate font-mono" style={{ color: "var(--text-primary)" }}>
                  {p.name}
                  {p.flagship && (
                    <span className="ml-2 align-middle">
                      <Badge tone="accent">flagship</Badge>
                    </span>
                  )}
                </span>
                <span className="block truncate text-xs" style={{ color: "var(--text-muted)" }}>
                  {p.tagline}
                </span>
              </span>
            </span>
            <span className="hidden sm:block">
              <Badge tone={p.category === "cloud" ? "info" : "neutral"}>
                {p.category === "cloud" ? "Cloud / DevOps" : "AI / Web"}
              </Badge>
            </span>
            <span className="hidden items-center gap-2 sm:flex">
              {p.github && <Github className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />}
              {p.video && <Video className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />}
            </span>
            <Badge tone="success">Public-Read</Badge>
          </Link>
        ))}
      </Panel>
    </div>
  );
}
