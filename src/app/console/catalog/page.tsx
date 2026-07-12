"use client";

import { useMemo, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { skills } from "@/lib/content";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Search, Star } from "lucide-react";

type Row = { name: string; level: number; category: string; note: string };

function allRows(): Row[] {
  return skills.flatMap((g) =>
    g.skills.map((s) => ({ ...s, category: g.category, note: g.note }))
  );
}

const CATEGORIES = ["All", ...skills.map((g) => g.category)];

function useFilteredRows(filter: string, category: string) {
  return useMemo(() => {
    const q = filter.trim().toLowerCase();
    let r = allRows();
    if (category !== "All") r = r.filter((x) => x.category === category);
    if (q) {
      r = r.filter(
        (x) => x.name.toLowerCase().includes(q) || x.category.toLowerCase().includes(q)
      );
    }
    return r;
  }, [filter, category]);
}

function CategoryChips({
  active,
  onPick,
  pill,
}: {
  active: string;
  onPick: (c: string) => void;
  pill?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => {
        const isActive = c === active;
        return (
          <button
            key={c}
            onClick={() => onPick(c)}
            className={`px-3 py-1.5 text-[12px] font-medium transition-colors ${
              pill ? "rounded-full" : "rounded-[3px]"
            }`}
            style={{
              background: isActive ? "var(--bg-selected)" : "transparent",
              color: isActive ? "var(--accent)" : "var(--text-secondary)",
              border: `1px solid ${isActive ? "var(--accent)" : "var(--border-strong)"}`,
            }}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}

export default function CatalogPage() {
  const { theme } = useTheme();
  const isAws = theme.id === "aws";
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("All");
  const rows = useFilteredRows(filter, category);

  const total = allRows().length;
  const atCapacity = allRows().filter((r) => r.level >= 90).length;

  if (isAws) {
    /* AWS: summary cards + filter chips + dense Cloudscape data table. */
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <PageHeader
          eyebrow="Service Catalog / Products"
          title={`Products (${rows.length})`}
          description="Skills provisioned in this account. Usage reflects real mileage, not marketing."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Products in catalog", value: String(total) },
            { label: "Running at capacity", value: String(atCapacity) },
            { label: "Categories", value: String(skills.length) },
            { label: "Quota requests denied", value: "0 (worrying)" },
          ].map((s) => (
            <Panel key={s.label}>
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                {s.value}
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                {s.label}
              </p>
            </Panel>
          ))}
        </div>

        <Panel className="overflow-hidden p-0!">
          <div
            className="flex flex-col gap-3 border-b px-5 py-4"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            <CategoryChips active={category} onPick={setCategory} />
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
                {rows.map((r, i) => (
                  <tr
                    key={`${r.category}-${r.name}`}
                    className="border-b transition-colors last:border-b-0 hover:bg-[var(--bg-selected)]"
                    style={{
                      borderColor: "var(--border-subtle)",
                      background: i % 2 === 1 ? "var(--bg-canvas)" : "transparent",
                    }}
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
                        <span
                          className="w-9 shrink-0 text-right font-mono text-[11.5px]"
                          style={{ color: "var(--text-muted)" }}
                        >
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
            {rows.length === 0 && (
              <p className="px-5 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                No products match. Even AWS doesn&apos;t have everything.
              </p>
            )}
          </div>
        </Panel>
      </div>
    );
  }

  /* GCP: featured hero + chips + Marketplace card grid with ratings. */
  const featured = allRows().reduce((a, b) => (b.level > a.level ? b : a));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        eyebrow="Marketplace"
        title="Marketplace"
        description="Skills available for immediate deployment. No procurement cycle required."
      />

      {/* featured hero */}
      <div
        className="relative overflow-hidden rounded-2xl border p-6 sm:p-8"
        style={{
          borderColor: "var(--border-subtle)",
          background:
            "radial-gradient(600px circle at 15% 0%, rgba(138,180,248,0.18), transparent 55%), var(--bg-elevated)",
        }}
      >
        <p
          className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "var(--accent)" }}
        >
          Editor&apos;s pick
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold"
              style={{ background: "var(--bg-selected)", color: "var(--accent)" }}
            >
              {featured.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-medium" style={{ color: "var(--text-primary)" }}>
                {featured.name}
              </h2>
              <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                Containerize your problems. Ship them somewhere else.
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-[12px]" style={{ color: "var(--text-muted)" }}>
                <Star className="h-3.5 w-3.5 fill-current" style={{ color: "#fdd663" }} />
                {(featured.level / 20).toFixed(1)} &middot; 10K+ deploys &middot; Free forever*
              </div>
            </div>
          </div>
          <button
            className="rounded-full px-6 py-2.5 text-sm font-medium"
            style={{ background: "var(--cta-bg)", color: "var(--cta-text)" }}
          >
            Deploy
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
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
        <CategoryChips active={category} onPick={setCategory} pill />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <div
            key={`${r.category}-${r.name}`}
            className="group relative rounded-xl border p-4 transition-shadow hover:shadow-lg"
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
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium" style={{ color: "var(--text-primary)" }}>
                  {r.name}
                </p>
                <p className="truncate text-[11.5px]" style={{ color: "var(--text-muted)" }}>
                  {r.category} &middot; by Harsh Goilkar
                </p>
              </div>
              <button
                className="shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium opacity-0 transition-opacity group-hover:opacity-100"
                style={{ background: "var(--cta-bg)", color: "var(--cta-text)" }}
              >
                Deploy
              </button>
            </div>
            <div className="mb-2 flex items-center gap-1.5 text-[11.5px]" style={{ color: "var(--text-muted)" }}>
              <Star className="h-3 w-3 fill-current" style={{ color: "#fdd663" }} />
              {(r.level / 20).toFixed(1)} &middot; {Math.round(r.level * 47)}+ deploys
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
      {rows.length === 0 && (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          Nothing here. It was probably deprecated.
        </p>
      )}
      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
        *Free forever, where &quot;forever&quot; is a Google product lifespan.
      </p>
    </div>
  );
}
