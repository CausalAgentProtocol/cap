import fsSync from "node:fs";
import path from "node:path";

import MarkdownIt from "markdown-it";
import { createHighlighter } from "shiki";

import { capRoot, getRawMarkdownByRoute, getSiteMap, resolveSourcePath } from "./site-map.ts";
import { buildPageDescription, collapseWhitespace, slugify } from "./site-text.ts";
import type { SiteMap, TocHeading } from "./site-types.ts";

type ExternalLinksConfig = {
  docsBaseUrl: string;
  githubOrgBaseUrl: string;
  repositories: {
    cap: string;
  };
};

const SHIKI_THEME = "github-light";
const SHIKI_LANGS = ["python", "json", "bash", "typescript", "javascript", "yaml", "markdown", "text"] as const;
const externalLinksPath = path.join(capRoot, "config", "external-links.json");
const externalLinks = JSON.parse(fsSync.readFileSync(externalLinksPath, "utf8")) as ExternalLinksConfig;

let cachedCodeHighlighterPromise: Promise<ReturnType<typeof createHighlighter> extends Promise<infer T> ? T : never> | null =
  null;

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
