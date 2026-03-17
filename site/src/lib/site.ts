import fs from "node:fs/promises";
import path from "node:path";
import MarkdownIt from "markdown-it";

export type SiteRoute = {
  route: string;
  section: string;
  title: string;
  source: string;
};

type SiteMap = {
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

const siteRoot = path.resolve(import.meta.dirname, "..", "..");
const capRoot = path.resolve(siteRoot, "..");
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

function normalizePathForLookup(target: string): string {
  return target.replaceAll(path.sep, "/");
}

function createMarkdownRenderer(currentSource: string, siteMap: SiteMap) {
  const sourceToRoute = buildSourceToRoute(siteMap);

  const markdown = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true
  });

  const defaultLinkOpen =
    markdown.renderer.rules.link_open ??
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

  markdown.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const hrefIndex = tokens[idx].attrIndex("href");

    if (hrefIndex >= 0) {
      const href = tokens[idx].attrs?.[hrefIndex]?.[1];

      if (href) {
        tokens[idx].attrs![hrefIndex][1] = rewriteHref(href, currentSource, sourceToRoute);
      }
    }

    return defaultLinkOpen(tokens, idx, options, env, self);
  };

  markdown.core.ruler.push("cap-headings", (state) => {
    const toc = ((state.env.toc ??= []) as TocHeading[]);

    for (let idx = 0; idx < state.tokens.length; idx += 1) {
      const token = state.tokens[idx];

      if (token.type !== "heading_open") {
        continue;
      }

      const inline = state.tokens[idx + 1];

      if (!inline || inline.type !== "inline") {
        continue;
      }

      const depth = Number(token.tag.replace("h", ""));
      const text = inline.content.trim();

      if (!text) {
        continue;
      }

      const id = slugify(text);
      token.attrSet("id", id);

      if (depth >= 2 && depth <= 3) {
        toc.push({ id, text, depth });
      }
    }
  });

  const defaultHeadingOpen =
    markdown.renderer.rules.heading_open ??
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  const defaultHeadingClose =
    markdown.renderer.rules.heading_close ??
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

  markdown.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const id = tokens[idx].attrGet("id");
    const depth = Number(tokens[idx].tag.replace("h", ""));

    if (id && depth >= 2 && depth <= 3) {
      env.currentHeadingId = id;
    }

    return defaultHeadingOpen(tokens, idx, options, env, self);
  };

  markdown.renderer.rules.heading_close = (tokens, idx, options, env, self) => {
    const depth = Number(tokens[idx].tag.replace("h", ""));

    if (env.currentHeadingId && depth >= 2 && depth <= 3) {
      const id = env.currentHeadingId;
      env.currentHeadingId = undefined;
      return `<a class="heading-anchor" href="#${id}" data-copy-link data-copy-id="${id}" aria-label="Copy link to section" title="Copy section link"><span class="heading-anchor-icon" aria-hidden="true"></span></a>${defaultHeadingClose(
        tokens,
        idx,
        options,
        env,
        self
      )}`;
    }

    return defaultHeadingClose(tokens, idx, options, env, self);
  };

  return markdown;
}

function buildSourceToRoute(siteMap: SiteMap): Map<string, string> {
  const map = new Map(siteMap.routes.map((entry) => [entry.source, entry.route]));

  // Allow repository markdown to link to the normative specification index
  // even though the site uses a custom landing page for `/spec`.
  if (map.has("site/content/specification/index.md")) {
    map.set("specification/index.md", "/spec");
  }

  return map;
}

function rewriteHref(href: string, currentSource: string, sourceToRoute: Map<string, string>): string {
  if (
    href.startsWith("#") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }

  if (href.startsWith("/")) {
    return href;
  }

  const [pathname, hash = ""] = href.split("#", 2);

  if (!pathname) {
    return href;
  }

  const currentAbsolute = resolveSourcePath(currentSource);
  const resolvedAbsolute = path.resolve(path.dirname(currentAbsolute), pathname);
  const resolvedRelative = normalizePathForLookup(path.relative(capRoot, resolvedAbsolute));
  const mappedRoute = sourceToRoute.get(resolvedRelative);

  if (!mappedRoute) {
    return href;
  }

  return hash ? `${mappedRoute}#${hash}` : mappedRoute;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getSidebarGroups(currentRoute: string): Promise<SidebarGroup[]> {
  const siteMap = await getSiteMap();
  const byPrefix = (prefix: string) =>
    siteMap.routes.filter((entry) => entry.route === prefix || entry.route.startsWith(`${prefix}/`));

  if (currentRoute.startsWith("/spec")) {
    return [
      {
        title: "Specification",
        links: [
          siteMap.routes.find((entry) => entry.route === "/spec"),
          ...byPrefix("/spec").filter((entry) => entry.route !== "/spec")
        ].filter(Boolean) as SiteRoute[]
      },
      {
        title: "Repository",
        links: siteMap.routes.filter((entry) => ["/changelog"].includes(entry.route))
      }
    ];
  }

  if (currentRoute.startsWith("/docs")) {
    return [
      {
        title: "Start",
        links: siteMap.routes.filter((entry) =>
          [
            "/docs/overview",
            "/docs/getting-started",
            "/docs/quickstart-client",
            "/docs/quickstart-server"
          ].includes(entry.route)
        )
      },
      { title: "Concepts", links: byPrefix("/docs/concepts") },
      { title: "Guides", links: byPrefix("/docs/guides") },
      { title: "Rationale", links: byPrefix("/docs/rationale") },
      {
        title: "Reference",
        links: siteMap.routes.filter((entry) => ["/spec", "/changelog"].includes(entry.route))
      }
    ];
  }

  if (["/changelog"].includes(currentRoute)) {
    return [
      {
        title: "Repository",
        links: siteMap.routes.filter((entry) => ["/changelog"].includes(entry.route))
      },
      {
        title: "Reference",
        links: siteMap.routes.filter((entry) => ["/docs/overview", "/spec"].includes(entry.route))
      }
    ];
  }

  return [];
}

export async function renderRoute(route: string) {
  const siteMap = await getSiteMap();
  const entry = await getRouteByPath(route);

  if (!entry) {
    throw new Error(`Unknown site route: ${route}`);
  }

  const absoluteSourcePath = resolveSourcePath(entry.source);
  const markdownSource = await fs.readFile(absoluteSourcePath, "utf8");
  const markdown = createMarkdownRenderer(entry.source, siteMap);
  const env = { toc: [] as TocHeading[] };

  return {
    entry,
    html: markdown.render(markdownSource, env),
    toc: env.toc,
    sourcePath: path.relative(capRoot, absoluteSourcePath).replaceAll(path.sep, "/")
  };
}
