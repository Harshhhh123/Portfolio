"use client";

import { useMemo, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { contact } from "@/lib/content";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { ConsoleAlert } from "@/components/ui/console-alert";
import { PolicyDocument } from "@/components/ui/policy-json";
import { isRealLink } from "@/lib/utils";
import { emitToast } from "@/lib/toast-bus";
import { Github, Linkedin, Mail, ShieldCheck } from "lucide-react";

export default function BillingPage() {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Access request from ${name || "a recruiter"}`);
    const body = encodeURIComponent(message || "I'd like to grant you production access to my team.");
    return `mailto:${contact.email}?subject=${subject}&body=${body}`;
  }, [name, message]);

  const accessPolicy = {
    Version: "2026-07-10",
    Statement: [
      {
        Sid: "AllowContactHarsh",
        Effect: "Allow",
        Principal: "*",
        Action: ["contact:SendEmail", "network:ConnectLinkedIn", "repo:FollowGitHub"],
        Resource: `arn:contact:harsh-goilkar:inbox`,
        Condition: {
          StringEquals: { "request:Intent": "genuine-opportunity" },
        },
      },
    ],
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        eyebrow="Billing & Support / Request Access"
        title="Request Access"
        description="This resource requires elevated permissions. Access is granted automatically -- the policy below just makes it official."
        right={
          <Badge tone="success">
            <ShieldCheck className="h-3 w-3" /> Access: Granted
          </Badge>
        }
      />

      <ConsoleAlert tone="info">
        Estimated response time: within 1 business day. This SLA is not legally
        binding, but it is personally binding.
      </ConsoleAlert>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Available Actions" subtitle={`Resource: arn:contact:harsh-goilkar/inbox`} />
          <div className="space-y-3">
            <ContactRow
              icon={<Mail className="h-4 w-4" />}
              label="EmailContact"
              value={contact.email}
              href={`mailto:${contact.email}`}
            />
            <ContactRow
              icon={<Linkedin className="h-4 w-4" />}
              label="LinkedInConnect"
              value={contact.linkedin}
              href={contact.linkedin}
            />
            <ContactRow
              icon={<Github className="h-4 w-4" />}
              label="GitHubFollow"
              value={contact.github}
              href={contact.github}
            />
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Submit Access Request" subtitle="Drafts an email -- nothing is sent without your review." />
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs" style={{ color: "var(--text-muted)" }}>
                Your name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Recruiter"
                className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                style={{ borderColor: "var(--border-subtle)", background: "var(--bg-canvas)", color: "var(--text-primary)" }}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs" style={{ color: "var(--text-muted)" }}>
                Justification for access request
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="We'd like to offer you a role that involves neither AWS nor GCP, just kidding, it's both."
                className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                style={{ borderColor: "var(--border-subtle)", background: "var(--bg-canvas)", color: "var(--text-primary)" }}
              />
            </div>
            <a
              href={mailtoHref}
              onClick={() => emitToast("Access request drafted. Opening your email client now.", "success")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold"
              style={{ background: theme.id === "aws" ? "var(--accent)" : "var(--accent)", color: "var(--accent-contrast)" }}
            >
              Submit Request &rarr;
            </a>
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHeader title="Resource-Based Policy" subtitle="Attached to arn:contact:harsh-goilkar/inbox" />
        <PolicyDocument document={accessPolicy} />
      </Panel>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  const real = isRealLink(href) || href.startsWith("mailto:");
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-md border px-3 py-2.5"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span style={{ color: "var(--accent)" }}>{icon}</span>
        <div className="min-w-0">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {label}
          </p>
          <p className="truncate text-sm" style={{ color: "var(--text-primary)" }}>
            {value}
          </p>
        </div>
      </div>
      {real ? (
        <a
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noreferrer"
          className="shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
        >
          Grant
        </a>
      ) : (
        <span className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>
          pending
        </span>
      )}
    </div>
  );
}
