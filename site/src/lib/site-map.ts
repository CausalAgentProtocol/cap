import fs from "node:fs/promises";
import path from "node:path";

import type { SiteMap, SiteRoute } from "./site-types.ts";

const siteRoot = path.resolve(import.meta.dirname, "..", "..");
export const capRoot = path.resolve(siteRoot, "..");
const siteMapPath = path.join(siteRoot, "content", "site-map.json");

let cachedSiteMap: SiteMap | null = null;

export async function getSiteMap(): Promise<SiteMap> {
  if (cachedSiteMap) {
    return cachedSiteMap;
  }

  const raw = await fs.readFile(siteMapPath, "utf8");
  cachedSiteMap = JSON.parse(raw) as SiteMap;
  return cachedSiteMap;
}

export async function getRouteByPath(route: string): Promise<SiteRoute | undefined> {
  const siteMap = await getSiteMap();
  return siteMap.routes.find((entry) => entry.route === route);
}

export async function getRoutesByPrefix(prefix: string): Promise<SiteRoute[]> {
  const siteMap = await getSiteMap();
  return siteMap.routes.filter((entry) => entry.route === prefix || entry.route.startsWith(`${prefix}/`));
}

export function routeToSlug(route: string): string {
  if (route === "/") {
    return "";
  }

  return route.replace(/^\//, "");
}

export function resolveSourcePath(source: string): string {
  return path.join(capRoot, source);
}

export async function getRawMarkdownByRoute(route: string) {
  const entry = await getRouteByPath(route);

  if (!entry) {
    throw new Error(`Unknown site route: ${route}`);
  }

  const absoluteSourcePath = resolveSourcePath(entry.source);
  const markdown = await fs.readFile(absoluteSourcePath, "utf8");

  return {
    entry,
    markdown,
    sourcePath: path.relative(capRoot, absoluteSourcePath).replaceAll(path.sep, "/")
  };
}
