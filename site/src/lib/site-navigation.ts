import type { SiteRouteStatus, SpecVersion } from "./site-shell.ts";
import { getSiteMap } from "./site-map.ts";
import type { SidebarGroup, SiteMap, SiteRoute, SpecVersionSwitcher } from "./site-types.ts";

type SpecVersionDescriptor = {
  version: SpecVersion;
  label: string;
  status: SiteRouteStatus;
};

export async function getAlternateVersionRoute(route: string, version: SpecVersion): Promise<SiteRoute | undefined> {
  const siteMap = await getSiteMap();
  return findAlternateVersionRoute(siteMap, route, version);
}

export async function getSpecVersionSwitcher(route: string): Promise<SpecVersionSwitcher | undefined> {
  const siteMap = await getSiteMap();
  const entry = siteMap.routes.find((candidate) => candidate.route === route);

  if (!entry || entry.section !== "specification" || !entry.version) {
    return undefined;
  }

  return {
    currentVersion: entry.version,
    currentLabel: formatSpecVersionLabel(entry.version),
    links: getSpecificationVersions(siteMap).map((option) => {
      const alternate = findAlternateVersionRoute(siteMap, route, option.version);

      return {
        version: option.version,
        label: option.label,
        href: alternate?.route ?? getSpecVersionLandingRoute(siteMap, option.version)?.route ?? route,
        active: entry.version === option.version,
        status: option.status
      };
    })
  };
}

export async function getSidebarGroups(currentRoute: string): Promise<SidebarGroup[]> {
  const siteMap = await getSiteMap();
  const byPrefix = (prefix: string) =>
    siteMap.routes.filter((entry) => entry.route === prefix || entry.route.startsWith(`${prefix}/`));

  if (currentRoute.startsWith("/spec")) {
    return buildSpecificationSidebarGroups(siteMap, currentRoute);
  }

  if (currentRoute.startsWith("/docs")) {
    return [
      {
        title: "Start",
        links: siteMap.routes.filter((entry) =>
          ["/docs/overview", "/docs/getting-started", "/docs/quickstart-client", "/docs/quickstart-server"].includes(
            entry.route
          )
        )
      },
      { title: "Concepts", links: byPrefix("/docs/concepts") },
      { title: "Guides", links: byPrefix("/docs/guides") },
      { title: "Rationale", links: byPrefix("/docs/rationale") },
      {
        title: "Reference",
        links: siteMap.routes.filter((entry) => ["/spec"].includes(entry.route))
      }
    ];
  }

  return [];
}

function isVersionedSpecificationRoute(entry: SiteRoute): entry is SiteRoute & { version: SpecVersion } {
  return entry.section === "specification" && typeof entry.version === "string";
}

function isExplicitVersionRoute(entry: SiteRoute): boolean {
  return (
    isVersionedSpecificationRoute(entry) &&
    (entry.route === `/spec/${entry.version}` || entry.route.startsWith(`/spec/${entry.version}/`))
  );
}

function formatSpecVersionLabel(version: SpecVersion): string {
  return version;
}

function getSpecificationVersions(siteMap: SiteMap): SpecVersionDescriptor[] {
  const versions = new Map<SpecVersion, SpecVersionDescriptor>();

  for (const entry of siteMap.routes.filter(isVersionedSpecificationRoute)) {
    if (!versions.has(entry.version)) {
      versions.set(entry.version, {
        version: entry.version,
        label: formatSpecVersionLabel(entry.version),
        status: entry.status ?? "active"
      });
    }
  }

  return [...versions.values()];
}

function getSpecVersionLandingRoute(siteMap: SiteMap, version: SpecVersion): SiteRoute | undefined {
  const versionRoutes = siteMap.routes.filter((entry) => isVersionedSpecificationRoute(entry) && entry.version === version);

  return (
    versionRoutes.find((entry) => entry.routeGroup === "spec-index" && isExplicitVersionRoute(entry)) ??
    versionRoutes.find((entry) => entry.routeGroup === "spec-index")
  );
}

function findAlternateVersionRoute(siteMap: SiteMap, route: string, version: SpecVersion): SiteRoute | undefined {
  const current = siteMap.routes.find((entry) => entry.route === route);

  if (!current?.routeGroup) {
    return undefined;
  }

  const candidates = siteMap.routes.filter((entry) => entry.routeGroup === current.routeGroup && entry.version === version);

  return candidates.find((entry) => isExplicitVersionRoute(entry)) ?? candidates[0];
}

function buildSpecificationSidebarGroups(siteMap: SiteMap, currentRoute: string): SidebarGroup[] {
  const current = siteMap.routes.find((entry) => entry.route === currentRoute);

  if (!isVersionedSpecificationRoute(current)) {
    return [];
  }

  const currentLanding =
    current.status === "active" && !isExplicitVersionRoute(current)
      ? current.routeGroup === "spec-index"
        ? current
        : siteMap.routes.find((entry) => entry.route === "/spec")
      : getSpecVersionLandingRoute(siteMap, current.version);
  const currentLandingRoute = currentLanding?.route;

  const primaryLinks = [currentLanding]
    .filter(Boolean)
    .concat(
      siteMap.routes.filter(
        (entry) =>
          isVersionedSpecificationRoute(entry) &&
          entry.version === current.version &&
          entry.routeGroup !== "spec-index" &&
          entry.route !== currentLandingRoute
      )
    ) as SiteRoute[];

  if (current.status === "internal-draft") {
    return [
      {
        title: "Specification Draft",
        links: primaryLinks
      }
    ];
  }

  if (isExplicitVersionRoute(current)) {
    return [
      {
        title: "Specification",
        links: primaryLinks
      },
      ...getSpecificationVersions(siteMap)
        .filter((entry) => entry.version !== current.version)
        .map((entry) => ({
          title: entry.status === "internal-draft" ? "Draft" : "Specification",
          links: getSpecVersionLandingRoute(siteMap, entry.version) ? [getSpecVersionLandingRoute(siteMap, entry.version)!] : []
        }))
        .filter((group) => group.links.length > 0)
    ];
  }

  return [
    {
      title: "Specification",
      links: primaryLinks
    }
  ];
}
