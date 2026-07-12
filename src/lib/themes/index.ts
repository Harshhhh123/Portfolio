import { awsTheme } from "./aws";
import { gcpTheme } from "./gcp";
import { ProviderId, ThemeCopy } from "./types";

export const themes: Record<ProviderId, ThemeCopy> = {
  aws: awsTheme,
  gcp: gcpTheme,
};

export * from "./types";
