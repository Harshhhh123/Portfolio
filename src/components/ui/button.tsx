import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-button)] text-sm font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none";

function variantStyle(variant: Variant): React.CSSProperties {
  if (variant === "primary") {
    return { background: "var(--accent)", color: "var(--accent-contrast)" };
  }
  if (variant === "secondary") {
    return {
      background: "var(--bg-elevated)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)",
    };
  }
  return { color: "var(--accent)" };
}

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  children,
  className,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${base} px-4 py-2 ${className ?? ""}`}
      style={variantStyle(variant)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  children,
  className,
  href,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const style = variantStyle(variant);
  const isInternal = href.startsWith("/");
  const content = (
    <span className={`${base} px-4 py-2 ${className ?? ""}`} style={style}>
      {children}
    </span>
  );
  if (isInternal) {
    return (
      <Link href={href} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {content}
    </a>
  );
}
