import type { CSSProperties } from "react";
import {
  LayoutDashboard,
  ShieldCheck,
  Server,
  Database,
  Store,
  Activity,
  Receipt,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  home: LayoutDashboard,
  iam: ShieldCheck,
  compute: Server,
  storage: Database,
  catalog: Store,
  monitoring: Activity,
  billing: Receipt,
};

export function NavIcon({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
}) {
  const Icon = iconMap[name] ?? LayoutDashboard;
  return <Icon className={className} style={style} />;
}
