import fsSync from "node:fs";
import path from "node:path";

import MarkdownIt from "markdown-it";
import { bundledLanguages, createHighlighter } from "shiki";

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

const externalLinksPath = path.join(capRoot, "config", "external-links.json");
const externalLinks = JSON.parse(fsSync.readFileSync(externalLinksPath, "utf8")) as ExternalLinksConfig;
const codeCopyIconMarkup =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M6 15V6a2 2 0 0 1 2-2h9"></path></svg>';
const shikiTheme = "github-light";
const shikiHighlighterPromise = createHighlighter({
  themes: [shikiTheme],
  langs: ["plaintext"]
});
const loadedShikiLanguages = new Set<string>(["plaintext"]);

type MarkdownToken = ReturnType<MarkdownIt["parse"]>[number];

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

  await highlightCodeBlockTokens(tokens, markdown);

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
    html: true,
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

  markdown.renderer.rules.fence = (tokens, idx) => renderPlainCodeBlockShell(markdown, tokens[idx].content, tokens[idx].info);
  markdown.renderer.rules.code_block = (tokens, idx) => renderPlainCodeBlockShell(markdown, tokens[idx].content);

  return markdown;
}

async function highlightCodeBlockTokens(tokens: MarkdownToken[], renderer: MarkdownIt): Promise<void> {
  for (const token of tokens) {
    if (token.type !== "fence" && token.type !== "code_block") {
      continue;
    }

    token.type = "html_block";
    token.tag = "";
    token.nesting = 0;
    token.markup = "";
    token.block = true;
    token.children = null;
    token.content = await renderCodeBlockShell(renderer, token.content, token.info ?? "");
    token.info = "";
  }
}

async function renderCodeBlockShell(renderer: MarkdownIt, content: string, info = ""): Promise<string> {
  const renderedCodeBlock = await renderHighlightedCodeBlock(renderer, content, info);

  return `<div class="code-block-shell"><button type="button" class="code-copy-button" aria-label="Copy code" title="Copy code">${codeCopyIconMarkup}</button>${renderedCodeBlock}</div>`;
}

function renderPlainCodeBlockShell(renderer: MarkdownIt, content: string, info = ""): string {
  const language = normalizeCodeLanguage(info);
  const languageClass = language ? ` class="language-${renderer.utils.escapeHtml(language)}"` : "";
  const escapedContent = renderer.utils.escapeHtml(content);

  return `<div class="code-block-shell"><button type="button" class="code-copy-button" aria-label="Copy code" title="Copy code">${codeCopyIconMarkup}</button><pre><code${languageClass}>${escapedContent}</code></pre></div>`;
}

async function renderHighlightedCodeBlock(renderer: MarkdownIt, content: string, info = ""): Promise<string> {
  const language = normalizeCodeLanguage(info);
  const highlightedLanguage = await resolveShikiLanguage(language);

  if (!highlightedLanguage) {
    const languageClass = language ? ` class="language-${renderer.utils.escapeHtml(language)}"` : "";
    const escapedContent = renderer.utils.escapeHtml(content);

    return `<pre><code${languageClass}>${escapedContent}</code></pre>`;
  }

  const highlighter = await shikiHighlighterPromise;
  return highlighter.codeToHtml(content, { lang: highlightedLanguage, theme: shikiTheme });
}

function normalizeCodeLanguage(info = ""): string {
  return collapseWhitespace(info).split(/\s+/, 1)[0]?.toLowerCase() ?? "";
}

async function resolveShikiLanguage(language: string): Promise<string | null> {
  const targetLanguage = language || "plaintext";

  if (!(targetLanguage in bundledLanguages)) {
    return language ? null : "plaintext";
  }

  if (!loadedShikiLanguages.has(targetLanguage)) {
    const highlighter = await shikiHighlighterPromise;
    await highlighter.loadLanguage(targetLanguage);
    loadedShikiLanguages.add(targetLanguage);
  }

  return targetLanguage;
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
