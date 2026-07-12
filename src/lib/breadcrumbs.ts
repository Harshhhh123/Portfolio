import { projects } from "@/lib/content";
import type { ThemeCopy } from "@/lib/themes/types";

export interface Crumb {
  label: string;
  href: string;
}

export function getBreadcrumbs(pathname: string, theme: ThemeCopy): Crumb[] {
  const segments = pathname.split("/").filter(Boolean); // ["console", "storage", "kubevigil"]
  if (segments[0] !== "console") return [];

  const navKey = segments[1];
  const navItem = theme.navItems.find((n) => n.href === `/console/${navKey}`);
  const crumbs: Crumb[] = [{ label: theme.consoleName, href: "/console/home" }];

  if (!navItem) return crumbs;
  if (navItem.href !== "/console/home") {
    crumbs.push({ label: navItem.label, href: navItem.href });
  }

  if (segments[2]) {
    const project = projects.find((p) => p.id === segments[2]);
    crumbs.push({
      label: project ? project.name : segments[2],
      href: `${navItem.href}/${segments[2]}`,
    });
  }

  return crumbs;
}
