"use client";

import { useTheme } from "@/lib/theme-context";
import { achievements } from "@/lib/content";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { ConsoleAlert } from "@/components/ui/console-alert";
import { Trophy, Users, BellRing } from "lucide-react";

export default function MonitoringPage() {
  const { theme } = useTheme();
  const isAws = theme.id === "aws";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        eyebrow={isAws ? "CloudWatch / Alarms" : "Cloud Monitoring / Alerting"}
        title="Alarms"
        description="Every alarm below is currently in a triggered state. In this account, that's a good thing."
      />

      <ConsoleAlert tone="warning">
        {`${achievements.length} alarms are actively in ALARM state. Recommended action: hire this person before someone else's dashboard looks this good.`}
      </ConsoleAlert>

      <Panel>
        <PanelHeader
          title="Alarm Overview"
          right={
            <Badge tone="warning">
              <BellRing className="h-3 w-3" /> {achievements.length} in ALARM
            </Badge>
          }
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {achievements.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 rounded-md border px-4 py-3"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <div
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                style={{ background: "var(--warning-bg)", color: "var(--warning)" }}
              >
                {a.kind === "hackathon" ? <Trophy className="h-4 w-4" /> : <Users className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {a.title}
                  </p>
                  <Badge tone="warning">ALARM</Badge>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {a.description}
                </p>
                <p className="mt-1 font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                  metric: excellence &gt; threshold: expected
                </p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
