import fs from "node:fs/promises";
import path from "node:path";
import MarkdownIt from "markdown-it";
import { createHighlighter } from "shiki";

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
let cachedCodeHighlighterPromise: Promise<ReturnType<typeof createHighlighter> extends Promise<infer T> ? T : never> | null = null;

const SHIKI_THEME = "github-light";
const SHIKI_LANGS = ["python", "json", "bash", "typescript", "javascript", "yaml", "markdown", "text"] as const;

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

async function getCodeHighlighter() {
  if (!cachedCodeHighlighterPromise) {
    cachedCodeHighlighterPromise = createHighlighter({
      themes: [SHIKI_THEME],
      langs: [...SHIKI_LANGS]
    });
  }

  return cachedCodeHighlighterPromise;
}

function normalizeCodeLanguage(raw: string): (typeof SHIKI_LANGS)[number] {
  const language = raw.trim().toLowerCase();

  switch (language) {
    case "py":
      return "python";
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "yml":
      return "yaml";
    case "md":
      return "markdown";
    case "sh":
    case "shell":
      return "bash";
    case "plaintext":
    case "txt":
      return "text";
    default:
      return SHIKI_LANGS.includes(language as (typeof SHIKI_LANGS)[number])
        ? (language as (typeof SHIKI_LANGS)[number])
        : "text";
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function highlightFenceTokens(tokens: ReturnType<MarkdownIt["parse"]>): Promise<void> {
  const highlighter = await getCodeHighlighter();

  await Promise.all(
    tokens.map(async (token) => {
      if (token.type !== "fence") {
        return;
      }

      const language = normalizeCodeLanguage(token.info.split(/\s+/, 1)[0] ?? "");

      try {
        token.type = "html_block";
        token.tag = "";
        token.nesting = 0;
        token.content = highlighter.codeToHtml(token.content, {
          lang: language,
          theme: SHIKI_THEME
        });
      } catch {
        token.type = "html_block";
        token.tag = "";
        token.nesting = 0;
        token.content = `<pre><code class="language-${language}">${escapeHtml(token.content)}</code></pre>`;
      }
    })
  );
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
            "/docs/concepts/what-is-causality",
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
        links: siteMap.routes.filter((entry) => ["/spec"].includes(entry.route))
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
  const tokens = markdown.parse(markdownSource, env);
  await highlightFenceTokens(tokens);

  return {
    entry,
    html: markdown.renderer.render(tokens, markdown.options, env),
    toc: env.toc,
    sourcePath: path.relative(capRoot, absoluteSourcePath).replaceAll(path.sep, "/")
  };
}
