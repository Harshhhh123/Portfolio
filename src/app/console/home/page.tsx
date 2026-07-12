"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Mail } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { person, experience, projects, achievements } from "@/lib/content";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { NavIcon } from "@/components/icon-map";

const stats = [
  { label: "Years writing production code", value: "2+" },
  { label: "Cloud-native systems shipped", value: "5" },
  { label: "AWS/GCP services used in anger", value: "20+" },
  { label: "Hackathon top-5/10 finishes", value: "2" },
];

export default function HomePage() {
  const { theme } = useTheme();
  const flagshipProject = projects.find((p) => p.flagship)!;
  const flagshipProduct = experience.products.find((p) => p.flagship)!;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Welcome banner */}
      <Panel className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{
            background: theme.id === "aws" ? "var(--logo-accent)" : "var(--accent)",
          }}
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              className="mb-2 font-mono text-[11px] uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Welcome to {theme.consoleName}
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
              {person.name}
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--accent)" }}>
              {person.tagline}
            </p>
            <div className="mt-4 max-w-2xl space-y-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {person.bio.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/console/billing"
                className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold"
                style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
              >
                <Mail className="h-3.5 w-3.5" />
                Request Access (Contact)
              </Link>
              <a
                href={`mailto:${person.email}`}
                className="inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm"
                style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
              >
                {person.email}
              </a>
            </div>
          </div>
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-xl font-bold sm:h-24 sm:w-24"
            style={{
              background: "var(--bg-hover)",
              color: theme.id === "aws" ? "var(--logo-accent)" : "var(--accent)",
              border: "1px solid var(--border-strong)",
            }}
          >
            HG
          </div>
        </div>
      </Panel>

      {/* stat tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
          >
            <Panel>
              <p className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
                {s.value}
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                {s.label}
              </p>
            </Panel>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* service health */}
        <Panel className="lg:col-span-2">
          <PanelHeader
            title="Service Health"
            subtitle="All console sections operational. No incidents reported."
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {theme.navItems
              .filter((n) => n.key !== "home")
              .map((n) => (
                <Link
                  key={n.key}
                  href={n.href}
                  className="flex items-center justify-between rounded-md border px-3 py-2.5 text-sm transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <span className="flex items-center gap-2.5">
                    <NavIcon name={n.icon} className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
                    <span style={{ color: "var(--text-primary)" }}>{n.label}</span>
                  </span>
                  <Badge tone="success">
                    <CheckCircle2 className="h-3 w-3" /> Operational
                  </Badge>
                </Link>
              ))}
          </div>
        </Panel>

        {/* account details */}
        <Panel>
          <PanelHeader title="Account Details" />
          <dl className="space-y-3 text-sm">
            <Row label={theme.accountLabel} value={theme.accountId} mono />
            <Row label="Region" value={`${theme.regionLabel} (${theme.regionCity})`} mono />
            <Row label="Identity" value={theme.userArn} mono small />
            <Row label="Plan" value="Free Tier -- Individual Contributor" />
            <Row label="Member since" value="2023 (DJSCE matriculation)" />
          </dl>
        </Panel>
      </div>

      {/* highlights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            title="Recently Deployed -- Flagship Project"
            subtitle="Most recent significant change in this account"
            right={<Badge tone="accent">kubevigil</Badge>}
          />
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {flagshipProject.name} &mdash; {flagshipProject.tagline}
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {flagshipProject.description.slice(0, 180)}...
          </p>
          <Link
            href={`/console/storage/${flagshipProject.id}`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: "var(--link)" }}
          >
            View bucket details <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Panel>

        <Panel>
          <PanelHeader
            title="Production Workload -- Internship"
            subtitle={`${experience.role} at ${experience.company}`}
            right={<Badge tone="warning">{flagshipProduct.status}</Badge>}
          />
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {flagshipProduct.name}
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {flagshipProduct.detail}
          </p>
          <Link
            href="/console/compute"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: "var(--link)" }}
          >
            View compute instance <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Panel>
      </div>

      <Panel>
        <PanelHeader
          title="Recent Alarms"
          subtitle={`${theme.navItems.find((n) => n.key === "monitoring")?.label}-style summary of achievements`}
        />
        <div className="flex flex-wrap gap-2">
          {achievements.map((a) => (
            <Badge key={a.id} tone={a.severity === "OK" ? "success" : "info"}>
              {a.title}
            </Badge>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  small,
}: {
  label: string;
  value: string;
  mono?: boolean;
  small?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </dt>
      <dd
        className={`${mono ? "font-mono" : ""} ${small ? "text-[11px] break-all" : ""}`}
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </dd>
    </div>
  );
}
