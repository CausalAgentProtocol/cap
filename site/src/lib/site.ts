import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import MarkdownIt from "markdown-it";
import { createHighlighter } from "shiki";
import type { SearchEntry } from "./search-client";
import { specVersionOptions, type SiteRouteStatus, type SpecVersion } from "./site-shell";

export type SiteRoute = {
  route: string;
  section: string;
  title: string;
  source: string;
  version?: SpecVersion;
  routeGroup?: string;
  status?: SiteRouteStatus;
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

export type SpecVersionLink = {
  version: SpecVersion;
  label: string;
  href: string;
  active: boolean;
  status: SiteRouteStatus;
};

export type SpecVersionSwitcher = {
  currentVersion: SpecVersion;
  links: SpecVersionLink[];
};

const siteRoot = path.resolve(import.meta.dirname, "..", "..");
const capRoot = path.resolve(siteRoot, "..");
const siteMapPath = path.join(siteRoot, "content", "site-map.json");
const externalLinksPath = path.join(capRoot, "config", "external-links.json");

type ExternalLinksConfig = {
  docsBaseUrl: string;
  githubOrgBaseUrl: string;
  repositories: {
    cap: string;
  };
};

let cachedSiteMap: SiteMap | null = null;
let cachedSearchIndex: SearchEntry[] | null = null;
let cachedCodeHighlighterPromise: Promise<ReturnType<typeof createHighlighter> extends Promise<infer T> ? T : never> | null = null;

const SHIKI_THEME = "github-light";
const SHIKI_LANGS = ["python", "json", "bash", "typescript", "javascript", "yaml", "markdown", "text"] as const;
const externalLinks = JSON.parse(fsSync.readFileSync(externalLinksPath, "utf8")) as ExternalLinksConfig;
const plainTextMarkdown = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: true
});

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

export async function getAlternateVersionRoute(route: string, version: SpecVersion): Promise<SiteRoute | undefined> {
  const siteMap = await getSiteMap();
  const current = siteMap.routes.find((entry) => entry.route === route);

  if (!current?.routeGroup) {
    return undefined;
  }

  const candidates = siteMap.routes.filter((entry) => entry.routeGroup === current.routeGroup && entry.version === version);

  if (candidates.length === 0) {
    return undefined;
  }

  return candidates.sort((left, right) => scoreVersionCandidate(right, version, route) - scoreVersionCandidate(left, version, route))[0];
}

export async function getSpecVersionSwitcher(route: string): Promise<SpecVersionSwitcher | undefined> {
  const entry = await getRouteByPath(route);

  if (!entry || entry.section !== "specification" || !entry.version) {
    return undefined;
  }

  return {
    currentVersion: entry.version,
    links: await Promise.all(
      specVersionOptions.map(async (option) => {
        const alternate = await getAlternateVersionRoute(route, option.version);

        return {
          version: option.version,
          label: option.label,
          href: alternate?.route ?? getSpecVersionLandingRoute(option.version),
          active: entry.version === option.version,
          status: option.status
        };
      })
    )
  };
}

export async function getSearchIndex(): Promise<SearchEntry[]> {
  if (cachedSearchIndex) {
    return cachedSearchIndex;
  }

  const siteMap = await getSiteMap();

  const searchEntries = await Promise.all(
    siteMap.routes.map(async (entry) => {
      const markdownSource = await fs.readFile(resolveSourcePath(entry.source), "utf8");
      return buildSearchEntries(entry, markdownSource);
    })
  );

  cachedSearchIndex = searchEntries.flat();

  return cachedSearchIndex;
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

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncateDescription(value: string, maxLength = 160): string {
  if (value.length <= maxLength) {
    return value;
  }

  const slice = value.slice(0, maxLength + 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cutoff = lastSpace > Math.floor(maxLength * 0.6) ? lastSpace : maxLength;
  return `${slice.slice(0, cutoff).trimEnd()}...`;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function markdownToPlainText(markdownSource: string): string {
  const html = plainTextMarkdown.render(markdownSource);

  return collapseWhitespace(
    decodeHtmlEntities(
      html
        .replace(/<pre[\s\S]*?<\/pre>/g, " ")
        .replace(/<code[^>]*>/g, " ")
        .replace(/<\/code>/g, " ")
        .replace(/<[^>]+>/g, " ")
    )
  );
}

function buildPageDescription(markdownSource: string, fallbackTitle: string): string {
  const plainText = markdownToPlainText(markdownSource);
  const withoutTitle = plainText.startsWith(fallbackTitle)
    ? plainText.slice(fallbackTitle.length).trim()
    : plainText;
  const candidate = withoutTitle || plainText || fallbackTitle;
  return truncateDescription(candidate);
}

type SearchSection = {
  hash?: string;
  sectionTitle: string;
  headings: string[];
  textParts: string[];
};

function buildSearchEntries(entry: SiteRoute, markdownSource: string): SearchEntry[] {
  const sections = extractSearchSections(entry, markdownSource);
  const searchEntries = sections
    .map((section) => {
      const text = collapseWhitespace(section.textParts.join(" "));

      if (!text) {
        return null;
      }

      return {
        id: `${entry.route}#${section.hash ?? "__page__"}`,
        route: entry.route,
        url: section.hash ? `${entry.route}#${section.hash}` : entry.route,
        section: entry.section,
        pageTitle: entry.title,
        sectionTitle: section.sectionTitle,
        headings: section.headings,
        text,
        keywords: buildSearchKeywords(entry, section),
        priority: getSearchPriority(entry, section)
      } satisfies SearchEntry;
    })
    .filter(Boolean);

  if (searchEntries.length > 0) {
    return searchEntries;
  }

  return [
    {
      id: `${entry.route}#__page__`,
      route: entry.route,
      url: entry.route,
      section: entry.section,
      pageTitle: entry.title,
      sectionTitle: entry.title,
      headings: [],
      text: markdownToPlainText(markdownSource),
      keywords: buildSearchKeywords(entry, {
        sectionTitle: entry.title,
        headings: [],
        textParts: []
      }),
      priority: getSearchPriority(entry)
    }
  ];
}

function extractSearchSections(entry: SiteRoute, markdownSource: string): SearchSection[] {
  const tokens = plainTextMarkdown.parse(markdownSource, {});
  const sections: SearchSection[] = [];
  let currentSection: SearchSection = {
    sectionTitle: entry.title,
    headings: [],
    textParts: []
  };
  let currentH2: string | null = null;

  const commitSection = () => {
    sections.push(currentSection);
  };

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (token.type === "heading_open") {
      const depth = Number(token.tag.replace("h", ""));
      const inline = tokens[index + 1];
      const headingText = collapseWhitespace(inline?.content ?? "");

      if ((depth === 2 || depth === 3) && headingText) {
        commitSection();

        if (depth === 2) {
          currentH2 = headingText;
        }

        currentSection = {
          hash: slugify(headingText),
          sectionTitle: headingText,
          headings: depth === 3 && currentH2 ? [currentH2, headingText] : [headingText],
          textParts: []
        };
      }
    }

    if (token.content && shouldIncludeTokenInSearchText(token.type)) {
      currentSection.textParts.push(token.content);
    }
  }

  commitSection();

  return sections.filter((section) => collapseWhitespace(section.textParts.join(" ")) || section.hash);
}

function shouldIncludeTokenInSearchText(tokenType: string): boolean {
  return ["inline", "fence", "code_block", "html_block"].includes(tokenType);
}

function buildSearchKeywords(entry: SiteRoute, section: Pick<SearchSection, "sectionTitle" | "headings">): string[] {
  const keywords = new Set<string>();
  const routeTerms = entry.route
    .split("/")
    .flatMap((segment) => segment.split("-"))
    .map((value) => collapseWhitespace(value))
    .filter(Boolean);

  const addKeyword = (value: string) => {
    const normalized = collapseWhitespace(value);

    if (normalized) {
      keywords.add(normalized);
    }
  };

  addKeyword(entry.title);
  addKeyword(section.sectionTitle);

  for (const heading of section.headings) {
    addKeyword(heading);
  }

  for (const routeTerm of routeTerms) {
    addKeyword(routeTerm);
  }

  for (const alias of getSearchAliases(entry, section.sectionTitle)) {
    addKeyword(alias);
  }

  return [...keywords];
}

function getSearchAliases(entry: SiteRoute, sectionTitle: string): string[] {
  const aliases = new Set<string>(["cap", "causal agent protocol"]);
  const haystack = `${entry.title} ${sectionTitle} ${entry.route}`.toLowerCase();

  if (haystack.includes("capability card")) {
    aliases.add("capability-card");
    aliases.add("capability cards");
  }

  if (haystack.includes("causal semantics")) {
    aliases.add("causal model");
  }

  if (haystack.includes("quickstart")) {
    aliases.add("getting started");
  }

  if (haystack.includes("extensions")) {
    aliases.add("extension");
  }

  return [...aliases];
}

function getSearchPriority(entry: SiteRoute, section?: Pick<SearchSection, "hash">): number {
  let priority = entry.section === "documentation" ? 1 : 0;

  if (entry.route === "/docs/overview" || entry.route === "/spec") {
    priority += 2;
  }

  if (!section?.hash) {
    priority += 1;
  }

  return priority;
}

function normalizePathForLookup(target: string): string {
  return target.replaceAll(path.sep, "/");
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function joinUrl(base: string, pathname = ""): string {
  const normalizedBase = trimTrailingSlash(base);

  if (!pathname) {
    return normalizedBase;
  }

  return `${normalizedBase}/${pathname.replace(/^\/+/, "")}`;
}

function githubCapUrl(pathname = ""): string {
  return joinUrl(
    externalLinks.githubOrgBaseUrl,
    `${externalLinks.repositories.cap}${pathname ? `/${pathname.replace(/^\/+/, "")}` : ""}`
  );
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
  const map = new Map<string, string>();

  for (const entry of siteMap.routes) {
    if (!map.has(entry.source)) {
      map.set(entry.source, entry.route);
    }
  }

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
    if (!fsSync.existsSync(resolvedAbsolute)) {
      return href;
    }

    const stats = fsSync.statSync(resolvedAbsolute);
    const githubPath = stats.isDirectory()
      ? `tree/main/${resolvedRelative}`
      : `blob/main/${resolvedRelative}`;

    return hash ? `${githubCapUrl(githubPath)}#${hash}` : githubCapUrl(githubPath);
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

function scoreVersionCandidate(entry: SiteRoute, version: SpecVersion, currentRoute: string): number {
  let score = 0;

  if (entry.route === currentRoute) {
    score += 4;
  }

  if (entry.route === getSpecVersionLandingRoute(version)) {
    score += 3;
  }

  if (entry.route.includes(`/${version}`)) {
    score += 2;
  }

  return score;
}

function getSpecVersionLandingRoute(version: SpecVersion): string {
  return version === "v0.2.2" ? "/spec/v0.2.2" : "/spec/v0.3.0-draft";
}

export async function getSidebarGroups(currentRoute: string): Promise<SidebarGroup[]> {
  const siteMap = await getSiteMap();
  const byPrefix = (prefix: string) =>
    siteMap.routes.filter((entry) => entry.route === prefix || entry.route.startsWith(`${prefix}/`));
  const activeSpecificationLinks = [
    siteMap.routes.find((entry) => entry.route === "/spec"),
    ...siteMap.routes.filter(
      (entry) =>
        entry.section === "specification" &&
        entry.route.startsWith("/spec/") &&
        !entry.route.startsWith("/spec/v0.2.2") &&
        !entry.route.startsWith("/spec/v0.3.0-draft")
    )
  ].filter(Boolean) as SiteRoute[];
  const draftSpecificationLinks = byPrefix("/spec/v0.3.0-draft");

  if (currentRoute.startsWith("/spec/v0.3.0-draft")) {
    return [
      {
        title: "Specification Draft",
        links: draftSpecificationLinks
      }
    ];
  }

  if (currentRoute === "/spec/v0.2.2") {
    return [
      {
        title: "Specification",
        links: [siteMap.routes.find((entry) => entry.route === "/spec/v0.2.2"), ...activeSpecificationLinks.slice(1)].filter(
          Boolean
        ) as SiteRoute[]
      },
      ...(draftSpecificationLinks.length > 0
        ? [
            {
              title: "Draft",
              links: draftSpecificationLinks
            }
          ]
        : [])
    ];
  }

  if (currentRoute.startsWith("/spec")) {
    return [
      {
        title: "Specification",
        links: activeSpecificationLinks
      }
    ];
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

export async function renderRoute(route: string) {
  const siteMap = await getSiteMap();
  const { entry, markdown: markdownSource, sourcePath } = await getRawMarkdownByRoute(route);
  const markdown = createMarkdownRenderer(entry.source, siteMap);
  const env = { toc: [] as TocHeading[] };
  const tokens = markdown.parse(markdownSource, env);
  let pageTitle = entry.title;

  for (let index = 0; index < tokens.length - 2; index += 1) {
    const open = tokens[index];
    const inline = tokens[index + 1];
    const close = tokens[index + 2];

    if (
      open?.type === "heading_open" &&
      open.tag === "h1" &&
      inline?.type === "inline" &&
      close?.type === "heading_close" &&
      close.tag === "h1"
    ) {
      pageTitle = collapseWhitespace(inline.content) || entry.title;
      tokens.splice(index, 3);
      break;
    }
  }

  await highlightFenceTokens(tokens);

  return {
    entry,
    pageTitle,
    description: buildPageDescription(markdownSource, pageTitle),
    html: markdown.renderer.render(tokens, markdown.options, env),
    toc: env.toc,
    sourcePath
  };
}
