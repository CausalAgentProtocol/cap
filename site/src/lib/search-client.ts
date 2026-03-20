import MiniSearch from "minisearch";

export type SearchEntry = {
  id: string;
  route: string;
  url: string;
  section: string;
  pageTitle: string;
  sectionTitle: string;
  headings: string[];
  text: string;
  keywords: string[];
  priority: number;
};

export type SearchMatch = SearchEntry & {
  score: number;
  snippet: string;
};

const searchFields = ["pageTitle", "sectionTitle", "keywords", "text"] as const;
const storeFields = ["route", "url", "section", "pageTitle", "sectionTitle", "headings", "text", "keywords", "priority"] as const;

export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim();
}

export function createSearchEngine(searchIndex: SearchEntry[]): MiniSearch<SearchEntry> {
  const miniSearch = new MiniSearch<SearchEntry>({
    fields: [...searchFields],
    storeFields: [...storeFields],
    processTerm: (term) => normalizeSearchText(term),
    searchOptions: {
      boost: {
        pageTitle: 5,
        sectionTitle: 4,
        keywords: 3,
        text: 1
      },
      prefix: true,
      fuzzy: 0.15,
      combineWith: "AND"
    }
  });

  miniSearch.addAll(searchIndex);
  return miniSearch;
}

export function searchDocuments(query: string, searchEngine: MiniSearch<SearchEntry>): SearchMatch[] {
  const normalizedQuery = normalizeSearchText(query);
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  if (!terms.length) {
    return [];
  }

  return searchEngine
    .search(normalizedQuery)
    .map((result) => {
      const searchEntry = result as SearchEntry & { score: number };
      const score = rerankSearchResult(searchEntry, normalizedQuery, terms);

      return {
        ...searchEntry,
        score,
        snippet: buildSearchSnippet(searchEntry.text, terms)
      };
    })
    .sort((left, right) => right.score - left.score || left.pageTitle.localeCompare(right.pageTitle))
    .slice(0, 8);
}

export function getSearchContextLabel(entry: Pick<SearchEntry, "route" | "section">): string {
  if (entry.route.startsWith("/docs/quickstart")) return "Quickstart";
  if (entry.route.startsWith("/docs/concepts/")) return "Concept";
  if (entry.route.startsWith("/docs/guides/")) return "Guide";
  if (entry.route.startsWith("/docs/rationale/")) return "Rationale";
  if (entry.route === "/spec") return "Specification";
  if (entry.route.startsWith("/spec/")) return "Spec";
  return entry.section === "specification" ? "Spec" : "Docs";
}

export function highlightSearchMatches(value: string, terms: string[]): string {
  let rendered = escapeSearchHtml(value);

  for (const term of [...new Set(terms)].filter((candidate) => candidate.length > 1)) {
    rendered = rendered.replace(new RegExp(`(${escapeSearchPattern(term)})`, "gi"), '<mark class="site-search-mark">$1</mark>');
  }

  return rendered;
}

function rerankSearchResult(
  entry: SearchEntry & { score: number },
  normalizedQuery: string,
  terms: string[]
): number {
  let score = entry.score + entry.priority;
  const pageTitle = normalizeSearchText(entry.pageTitle);
  const sectionTitle = normalizeSearchText(entry.sectionTitle);
  const headings = normalizeSearchText(entry.headings.join(" "));
  const text = normalizeSearchText(entry.text);
  const keywords = normalizeSearchText(entry.keywords.join(" "));

  if (pageTitle === normalizedQuery) score += 40;
  if (sectionTitle === normalizedQuery) score += 32;
  if (pageTitle.includes(normalizedQuery)) score += 16;
  if (sectionTitle.includes(normalizedQuery)) score += 12;
  if (headings.includes(normalizedQuery)) score += 8;
  if (keywords.includes(normalizedQuery)) score += 6;
  if (text.includes(normalizedQuery)) score += 3;

  for (const term of terms) {
    if (pageTitle.startsWith(term)) score += 6;
    if (sectionTitle.startsWith(term)) score += 5;
    if (keywords.includes(term)) score += 3;
  }

  return score;
}

function buildSearchSnippet(body: string, terms: string[]): string {
  const text = body.replace(/\s+/g, " ").trim();

  if (!text) {
    return "";
  }

  const lower = text.toLowerCase();
  const matchIndex = terms
    .map((term) => lower.indexOf(term))
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0];

  const start = Math.max(0, (matchIndex ?? 0) - 42);
  const end = Math.min(text.length, start + 170);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < text.length ? "..." : "";

  return `${prefix}${text.slice(start, end).trim()}${suffix}`;
}

function escapeSearchHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeSearchPattern(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
