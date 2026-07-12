"use client";

import { useMemo, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { skills } from "@/lib/content";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Search } from "lucide-react";

type Row = { name: string; level: number; category: string; note: string };

function allRows(): Row[] {
  return skills.flatMap((g) =>
    g.skills.map((s) => ({ ...s, category: g.category, note: g.note }))
  );
}

export default function CatalogPage() {
  const { theme } = useTheme();
  const isAws = theme.id === "aws";
  const [filter, setFilter] = useState("");

  const rows = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const r = allRows();
    if (!q) return r;
    return r.filter(
      (x) => x.name.toLowerCase().includes(q) || x.category.toLowerCase().includes(q)
    );
  }, [filter]);

  if (isAws) {
    /* AWS: dense Cloudscape-style data table inside a container. */
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <PageHeader
          eyebrow="Service Catalog / Products"
          title={`Products (${rows.length})`}
          description="Skills provisioned in this account. Usage reflects real mileage, not marketing."
        />

        <Panel className="overflow-hidden p-0!">
          <div
            className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div
              className="flex max-w-sm flex-1 items-center gap-2 rounded-[3px] border px-3 py-1.5"
              style={{ borderColor: "var(--border-strong)", background: "var(--bg-surface)" }}
            >
              <Search className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Find products"
                className="w-full bg-transparent text-[13px] outline-none"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
            <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
              Quota increases: auto-approved, regrettably
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr
                  className="border-b text-[11.5px] uppercase tracking-wide"
                  style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)" }}
                >
                  <th className="px-5 py-2.5 font-bold">Name</th>
                  <th className="px-5 py-2.5 font-bold">Category</th>
                  <th className="w-56 px-5 py-2.5 font-bold">Usage</th>
                  <th className="px-5 py-2.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={`${r.category}-${r.name}`}
                    className="border-b transition-colors last:border-b-0 hover:bg-[var(--bg-hover)]"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <td className="px-5 py-2.5 text-[13.5px] font-medium" style={{ color: "var(--link)" }}>
                      {r.name}
                    </td>
                    <td className="px-5 py-2.5 text-[13px]" style={{ color: "var(--text-secondary)" }}>
                      {r.category}
                    </td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1">
                          <ProgressBar value={r.level} tone={r.level >= 90 ? "warning" : "accent"} />
                        </div>
                        <span className="w-9 shrink-0 text-right font-mono text-[11.5px]" style={{ color: "var(--text-muted)" }}>
                          {r.level}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-2.5">
                      <Badge tone={r.level >= 90 ? "warning" : "success"}>
                        {r.level >= 90 ? "At capacity" : "Available"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    );
  }

  /* GCP: Marketplace-style card grid. */
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        eyebrow="Marketplace"
        title="Marketplace"
        description="Skills available for immediate deployment. No procurement cycle required."
      />

      <div
        className="flex max-w-md items-center gap-2.5 rounded-full px-4 py-2.5"
        style={{ background: "var(--bg-hover)" }}
      >
        <Search className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search Marketplace"
          className="w-full bg-transparent text-[13.5px] outline-none"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <div
            key={`${r.category}-${r.name}`}
            className="group rounded-xl border p-4 transition-shadow hover:shadow-lg"
            style={{
              background: "var(--bg-elevated)",
              borderColor: "var(--border-subtle)",
              boxShadow: "0 1px 2px var(--shadow-color)",
            }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
                style={{ background: "var(--bg-selected)", color: "var(--accent)" }}
              >
                {r.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium" style={{ color: "var(--text-primary)" }}>
                  {r.name}
                </p>
                <p className="truncate text-[11.5px]" style={{ color: "var(--text-muted)" }}>
                  {r.category} &middot; by Harsh Goilkar
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex-1">
                <ProgressBar value={r.level} tone={r.level >= 90 ? "warning" : "accent"} />
              </div>
              <span className="shrink-0 font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                {r.level}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
