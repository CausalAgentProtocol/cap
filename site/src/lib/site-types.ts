import type { SiteRouteStatus, SpecVersion } from "./site-shell.ts";

export type SiteRoute = {
  route: string;
  section: string;
  title: string;
  source: string;
  version?: SpecVersion;
  routeGroup?: string;
  status?: SiteRouteStatus;
};

export type SiteMap = {
  version: string;
  policy: string;
  routes: SiteRoute[];
};

export type SidebarGroup = {
  title: string;
  links: SiteRoute[];
};

export type TocHeading = {
  id: string;
  text: string;
  depth: number;
};

export type SpecVersionLink = {
  version: SpecVersion;
  label: string;
  href: string;
  active: boolean;
  status: SiteRouteStatus;
};

export type SpecVersionSwitcher = {
  currentVersion: SpecVersion;
  currentLabel: string;
  links: SpecVersionLink[];
};
