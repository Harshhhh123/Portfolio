"use client";

import { useTheme } from "@/lib/theme-context";
import { experience } from "@/lib/content";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, PlayCircle } from "lucide-react";

const statusTone: Record<string, "success" | "warning" | "info"> = {
  LIVE: "success",
  "LAUNCH IMMINENT": "warning",
  "IN PRODUCTION": "info",
};

export default function ComputePage() {
  const { theme } = useTheme();
  const isAws = theme.id === "aws";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        eyebrow={isAws ? "EC2 / Instances" : "Compute Engine / VM instances"}
        title="gochanakya-fullstack-intern-01"
        description={`${experience.role} at ${experience.company} (${experience.period}). ${experience.companyBlurb}`}
        right={
          <Badge tone="success">
            <PlayCircle className="h-3 w-3" /> running
          </Badge>
        }
      />

      <Panel>
        <PanelHeader title="Instance Summary" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Row label="Instance type" value="internship.fullstack.large" />
          <Row label="State" value="running" />
          <Row label="Launched" value="Aug 2025" />
          <Row label="Availability zone" value={`${theme.regionLabel}${isAws ? "a" : "-a"}`} />
          <Row label="Uptime" value="~9 months and counting" />
          <Row label="Auto-scaling" value="Scope, not headcount" />
          <Row label="Termination protection" value="Enabled" />
          <Row label="Billing" value="Salaried, thankfully" />
        </div>
      </Panel>

      <div>
        <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Deployed Applications on this Instance
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {experience.products.map((p) => (
            <Panel key={p.id}>
              <div
                style={p.flagship ? { boxShadow: "inset 0 0 0 1px var(--accent)" } : undefined}
                className="-m-5 rounded-lg p-5"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {p.flagship ? "Flagship product" : "Product"}
                    </p>
                    <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                      {p.name}
                    </h3>
                  </div>
                  <Badge tone={statusTone[p.status] ?? "neutral"}>{p.status}</Badge>
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {p.summary}
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {p.detail}
                </p>
                {p.link && (
                  <a
                    href={p.link.startsWith("http") ? p.link : undefined}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
                    style={{ color: "var(--link)" }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {p.link.startsWith("http") ? "View live product" : p.link}
                  </a>
                )}
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p className="mt-0.5 text-sm" style={{ color: "var(--text-primary)" }}>
        {value}
      </p>
    </div>
  );
}
