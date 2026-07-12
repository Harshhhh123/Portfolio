"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { projects } from "@/lib/content";
import { fakeObjects } from "@/lib/fake-objects";
import { projectBanners } from "@/lib/project-banners";
import { isRealLink, youtubeEmbedUrl } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Badge, Chip } from "@/components/ui/badge";
import { ConsoleAlert } from "@/components/ui/console-alert";
import { ArrowLeft, ExternalLink, Github, PlayCircle } from "lucide-react";

export default function BucketDetailPage() {
  const params = useParams<{ id: string }>();
  const { theme } = useTheme();
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    return (
      <div className="mx-auto max-w-2xl">
        <ConsoleAlert tone="warning">
          NoSuchBucket: the specified bucket does not exist in this account.
        </ConsoleAlert>
        <Link
          href="/console/storage"
          className="mt-4 inline-flex items-center gap-1.5 text-sm"
          style={{ color: "var(--link)" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to buckets
        </Link>
      </div>
    );
  }

  const objects = fakeObjects(project);
  const banner = projectBanners[project.id];
  const embed = project.video && isRealLink(project.video) ? youtubeEmbedUrl(project.video) : null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Link
        href="/console/storage"
        className="inline-flex w-fit items-center gap-1.5 text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All buckets
      </Link>

      <PageHeader
        eyebrow={`${theme.id === "aws" ? "S3" : "Cloud Storage"} / ${project.name}`}
        title={project.name}
        description={project.tagline}
        right={
          <div className="flex gap-2">
            {project.flagship && <Badge tone="accent">Flagship</Badge>}
            <Badge tone={project.category === "cloud" ? "info" : "neutral"}>
              {project.category === "cloud" ? "Cloud / DevOps" : "AI / Web"}
            </Badge>
          </div>
        }
      />

      {banner && <ConsoleAlert tone="info">{banner}</ConsoleAlert>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Description" />
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {project.description}
          </p>

          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Bucket Properties" />
          <dl className="space-y-3 text-sm">
            <Row label="Region" value={`${theme.regionLabel} (${theme.regionCity})`} />
            <Row label="Versioning" value="Enabled" />
            <Row label="Access" value="Public read (by design)" />
            <Row label="Encryption" value="AES-256, and mild secrecy about bugs" />
          </dl>
        </Panel>
      </div>

      {project.metrics && project.metrics.length > 0 && (
        <div
          className={`grid grid-cols-1 gap-4 ${
            project.metrics.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
          }`}
        >
          {project.metrics.map((m) => (
            <Panel key={m.label}>
              <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                {m.value}
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                {m.label}
              </p>
            </Panel>
          ))}
        </div>
      )}

      {/* Evidence */}
      <Panel>
        <PanelHeader
          title="Evidence"
          subtitle={
            project.category === "cloud"
              ? "Cloud/DevOps projects ship with a GitHub repo and a recorded demo."
              : "AI/web projects ship with a link to the repo or a live demo."
          }
        />
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            {project.github && (
              <EvidenceLink href={project.github} icon={<Github className="h-3.5 w-3.5" />} label="GitHub repository" />
            )}
            {project.liveLink && (
              <EvidenceLink href={project.liveLink} icon={<ExternalLink className="h-3.5 w-3.5" />} label="Live demo / repository" />
            )}
          </div>

          {project.video && (
            <div>
              {embed ? (
                <div className="aspect-video w-full overflow-hidden rounded-md border" style={{ borderColor: "var(--border-subtle)" }}>
                  <iframe
                    src={embed}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : isRealLink(project.video) ? (
                <video controls className="w-full rounded-md border" style={{ borderColor: "var(--border-subtle)" }}>
                  <source src={project.video} />
                </video>
              ) : (
                <div
                  className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed text-center"
                  style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)" }}
                >
                  <PlayCircle className="h-8 w-8" />
                  <p className="text-xs">Demo video not wired up yet -- {project.video}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Panel>

      {/* fake object listing for flavor */}
      <Panel className="overflow-hidden p-0!">
        <div className="px-5 pt-4">
          <PanelHeader title="Objects" subtitle={`${objects.length} objects in this bucket`} />
        </div>
        <div
          className="grid grid-cols-[1fr_auto_auto] gap-4 border-y px-5 py-2 text-[11px] uppercase tracking-wide"
          style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
        >
          <span>Name</span>
          <span>Size</span>
          <span className="hidden sm:block">Last modified</span>
        </div>
        {objects.map((o, i) => (
          <div
            key={o.name}
            className="grid grid-cols-[1fr_auto_auto] gap-4 border-b px-5 py-2.5 font-mono text-[12.5px] last:border-b-0"
            style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
          >
            <span className="truncate">{o.name}</span>
            <span>{o.size}</span>
            <span className="hidden sm:block">{2 + i} days ago</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function EvidenceLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const real = isRealLink(href);
  if (!real) {
    return (
      <span
        className="inline-flex items-center gap-2 rounded-md border border-dashed px-4 py-2 text-sm"
        style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)" }}
        title={href}
      >
        {icon} {label} -- link pending
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold"
      style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
    >
      {icon} {label}
    </a>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </dt>
      <dd style={{ color: "var(--text-primary)" }}>{value}</dd>
    </div>
  );
}
