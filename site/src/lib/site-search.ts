import fs from "node:fs/promises";

import type { SearchEntry } from "./search-client.ts";
import { getSiteMap, resolveSourcePath } from "./site-map.ts";
import { collapseWhitespace, markdownToPlainText, plainTextMarkdown, slugify } from "./site-text.ts";
import type { SiteRoute } from "./site-types.ts";

type SearchSection = {
  hash?: string;
  sectionTitle: string;
  headings: string[];
  textParts: string[];
};

let cachedSearchIndex: SearchEntry[] | null = null;

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
