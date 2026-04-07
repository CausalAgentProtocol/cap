import {
  createSearchEngine,
  getSearchContextLabel,
  highlightSearchMatches,
  normalizeSearchText,
  searchDocuments
} from "../search-client.ts";

type SiteSearchOptions = {
  emptyMessage: string;
};

let searchShortcutsBound = false;

export function initSiteSearch({ emptyMessage }: SiteSearchOptions) {
  bindGlobalSearchShortcuts();

  const searchEngine = createSearchEngine(getSearchIndexData());

  document.querySelectorAll("[data-site-search]").forEach((root) => {
    if (!(root instanceof HTMLElement) || root.dataset.searchBound === "true") {
      return;
    }

    const input = root.querySelector("[data-search-input]");

    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    root.dataset.searchBound = "true";

    const updateResults = () => {
      renderSearchResults(root, input.value, searchDocuments(input.value, searchEngine), emptyMessage);
    };

    input.addEventListener("input", updateResults);
    input.addEventListener("focus", updateResults);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setSearchOpen(root, false);
        input.blur();
        return;
      }

      if (event.key === "ArrowDown") {
        const firstResult = root.querySelector("[data-search-result]");

        if (firstResult instanceof HTMLAnchorElement) {
          event.preventDefault();
          firstResult.focus();
        }
      }

      if (event.key === "Enter") {
        const firstResult = root.querySelector("[data-search-result]");

        if (firstResult instanceof HTMLAnchorElement && input.value.trim()) {
          event.preventDefault();
          window.location.assign(firstResult.href);
        }
      }
    });
  });
}

function bindGlobalSearchShortcuts() {
  if (searchShortcutsBound) {
    return;
  }

  searchShortcutsBound = true;

  document.addEventListener("click", (event) => {
    document.querySelectorAll("[data-site-search][data-open='true']").forEach((root) => {
      if (!(root instanceof HTMLElement) || root.contains(event.target)) {
        return;
      }

      setSearchOpen(root, false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "k" || (!event.metaKey && !event.ctrlKey)) {
      return;
    }

    const active = document.activeElement;

    if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
      return;
    }

    const input = document.querySelector("[data-search-input]");

    if (input instanceof HTMLInputElement) {
      event.preventDefault();
      input.focus();
      input.select();
    }
  });
}

function escapeSearchHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getSearchIndexData() {
  const node = document.getElementById("site-search-index");

  if (!(node instanceof HTMLScriptElement)) {
    return [];
  }

  try {
    return JSON.parse(node.textContent ?? "[]");
  } catch {
    return [];
  }
}

function setSearchOpen(root: HTMLElement, isOpen: boolean) {
  root.dataset.open = isOpen ? "true" : "false";

  const panel = root.querySelector("[data-search-panel]");

  if (panel instanceof HTMLElement) {
    panel.hidden = !isOpen;
  }
}

function renderSearchResults(root: HTMLElement, query: string, matches: ReturnType<typeof searchDocuments>, emptyMessage: string) {
  const results = root.querySelector("[data-search-results]");
  const empty = root.querySelector("[data-search-empty]");
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean);

  if (!(results instanceof HTMLElement) || !(empty instanceof HTMLElement)) {
    return;
  }

  if (!query.trim()) {
    results.innerHTML = "";
    empty.textContent = emptyMessage;
    setSearchOpen(root, true);
    return;
  }

  if (!matches.length) {
    results.innerHTML = "";
    empty.textContent = `No pages mention "${query}".`;
    setSearchOpen(root, true);
    return;
  }

  empty.textContent = "";
  results.innerHTML = matches
    .map((entry) => {
      const contextLabel = getSearchContextLabel(entry);
      const sectionLabel =
        entry.sectionTitle !== entry.pageTitle
          ? ` · ${escapeSearchHtml(entry.sectionTitle)}`
          : "";

      return `
        <a class="site-search-result" href="${entry.url}" data-search-result>
          <span class="site-search-meta">${escapeSearchHtml(contextLabel)}${sectionLabel}</span>
          <span class="site-search-title">${highlightSearchMatches(entry.pageTitle, terms)}</span>
          <span class="site-search-snippet">${highlightSearchMatches(entry.snippet, terms)}</span>
        </a>
      `;
    })
    .join("");

  setSearchOpen(root, true);
}
