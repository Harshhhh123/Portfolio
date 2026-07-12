export type ProviderId = "aws" | "gcp";

export type NavKey =
  | "home"
  | "iam"
  | "compute"
  | "storage"
  | "catalog"
  | "monitoring"
  | "billing";

export interface NavItem {
  key: NavKey;
  label: string;
  href: string;
  icon: string;
}

export interface ThemeCopy {
  id: ProviderId;
  providerName: string;
  providerShort: string;
  consoleName: string;
  domain: string;
  regionLabel: string;
  regionCity: string;
  accountLabel: string;
  accountId: string;
  userArn: string;
  searchPlaceholder: string;
  bootSequence: string[];
  toastBank: string[];
  vendorCardTitle: string;
  vendorCardSubtitle: string;
  vendorCardJokes: string[];
  vendorCardCta: string;
  roastVerdict: string;
  roastStats: { label: string; value: number; display: string }[];
  notFoundTitle: string;
  notFoundCode: string;
  notFoundBody: string;
  notFoundCta: string;
  navItems: NavItem[];
  billingNote: string;
  footerNote: string;
  logoLetter: string;
}
