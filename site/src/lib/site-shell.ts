import externalLinks from "../../../config/external-links.json" with { type: "json" };

export type SpecVersion = "v0.2.2" | "v0.3.0";

export type SiteRouteStatus = "active" | "internal-draft";

export type SiteShellNavItem = {
  href: string;
  label: string;
  active: boolean;
};

export const siteShell = {
  titleSuffix: "CAP",
  siteUrl: externalLinks.docsBaseUrl,
  brandHref: "/docs/overview",
  brandIconPath: "/icons/cap-logo-c-sharp.svg",
  brandWordmark: "Causal Agent Protocol",
  defaultDescription: "Capability disclosure, invocation, and provenance for causal reasoning systems.",
  searchLabel: "Search docs and spec",
  searchPlaceholder: "Search docs and spec",
  githubHref: externalLinks.githubOrgBaseUrl
} as const;

export function getTopNav(currentRoute: string, currentSection?: string): SiteShellNavItem[] {
  return [
    {
      href: "/docs/overview",
      label: "Docs",
      active: currentSection === "documentation" || currentRoute === "/docs" || currentRoute.startsWith("/docs/")
    },
    {
      href: "/spec",
      label: "Spec",
      active: currentSection === "specification" || currentRoute === "/spec" || currentRoute.startsWith("/spec/")
    }
  ];
}

export function buildMarkdownRoute(route: string): string {
  const normalizedRoute = route === "/" ? "/index" : route.replace(/\/+$/, "");
  return `${normalizedRoute}.md`;
}
