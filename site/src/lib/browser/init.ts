import { bindAnchorCopyLinks } from "./anchor-copy.ts";
import { attachCodeCopyButtons } from "./code-copy.ts";
import { initSiteSearch } from "./site-search.ts";

let lifecycleBound = false;

export function initSiteLayout() {
  bindAnchorCopyLinks();

  if (!lifecycleBound) {
    lifecycleBound = true;
    document.addEventListener("astro:page-load", runSiteLayoutPass);
    document.addEventListener("DOMContentLoaded", runSiteLayoutPass);
  }

  runSiteLayoutPass();
}

function runSiteLayoutPass() {
  initSiteSearch({
    emptyMessage: "Search by concept, verb, field name, or page title."
  });
  attachCodeCopyButtons();
}
