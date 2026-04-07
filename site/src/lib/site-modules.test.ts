import assert from "node:assert/strict";
import test from "node:test";

import { getSiteMap, getRawMarkdownByRoute, routeToSlug } from "./site-map.ts";
import { getSearchIndex } from "./site-search.ts";
import { getSidebarGroups, getSpecVersionSwitcher } from "./site-navigation.ts";
import { renderRoute } from "./site-render.ts";

test("site-map exposes canonical spec routes", async () => {
  const siteMap = await getSiteMap();
  const entry = siteMap.routes.find((route) => route.route === "/spec");
  const markdown = await getRawMarkdownByRoute("/spec");

  assert.equal(routeToSlug("/spec"), "spec");
  assert.ok(entry, "expected /spec to exist in the site map");
  assert.equal(markdown.sourcePath, "site/content/specification/index.md");
});

test("site-search indexes the specification landing page", async () => {
  const searchEntries = await getSearchIndex();
  const specificationEntry = searchEntries.find((entry) => entry.route === "/spec");

  assert.ok(specificationEntry, "expected /spec to be present in the search index");
  assert.match(specificationEntry.pageTitle, /Specification/);
});

test("site-navigation exposes the active spec switcher and sidebar", async () => {
  const switcher = await getSpecVersionSwitcher("/spec");
  const sidebar = await getSidebarGroups("/spec");

  assert.deepEqual(
    switcher,
    {
      currentVersion: "v0.2.2",
      currentLabel: "v0.2.2",
      links: [
        {
          version: "v0.2.2",
          label: "v0.2.2",
          href: "/spec/v0.2.2",
          active: true,
          status: "active"
        },
        {
          version: "v0.3.0",
          label: "v0.3.0",
          href: "/spec/v0.3.0",
          active: false,
          status: "internal-draft"
        }
      ]
    },
    "expected the spec switcher to resolve the active and draft versions"
  );
  assert.equal(sidebar[0]?.title, "Specification");
  assert.equal(sidebar[0]?.links[0]?.route, "/spec");
});

test("site-navigation treats draft as status rather than part of the version key", async () => {
  const switcher = await getSpecVersionSwitcher("/spec/v0.3.0");

  assert.equal(switcher?.currentVersion, "v0.3.0");
  assert.equal(switcher?.currentLabel, "v0.3.0");
  assert.equal(switcher?.links[0]?.href, "/spec/v0.2.2");
  assert.equal(switcher?.links[1]?.href, "/spec/v0.3.0");
  assert.equal(switcher?.links[1]?.status, "internal-draft");
});

test("version switcher resolves matching specification pages across versions", async () => {
  const switcher = await getSpecVersionSwitcher("/spec/v0.3.0/protocol");
  const markdown = await getRawMarkdownByRoute("/spec/v0.3.0/protocol");

  assert.equal(switcher?.currentVersion, "v0.3.0");
  assert.equal(switcher?.links[0]?.href, "/spec/protocol");
  assert.equal(switcher?.links[1]?.href, "/spec/v0.3.0/protocol");
  assert.equal(markdown.sourcePath, "specification/drafts/v0.3.0/protocol.md");
});

test("draft specification sidebar includes all versioned pages for the current version", async () => {
  const sidebar = await getSidebarGroups("/spec/v0.3.0");

  assert.equal(sidebar[0]?.title, "Specification Draft");
  assert.deepEqual(
    sidebar[0]?.links.map((link) => link.route),
    [
      "/spec/v0.3.0",
      "/spec/v0.3.0/changes-from-v0.2.2",
      "/spec/v0.3.0/protocol",
      "/spec/v0.3.0/capability-card",
      "/spec/v0.3.0/causal-semantics",
      "/spec/v0.3.0/verbs",
      "/spec/v0.3.0/message-format",
      "/spec/v0.3.0/conformance",
      "/spec/v0.3.0/extensions",
      "/spec/v0.3.0/changelog"
    ],
    "expected the draft sidebar to include all versioned specification pages in site-map order"
  );
});

test("site-render returns stable metadata for the spec landing page", async () => {
  const rendered = await renderRoute("/spec");

  assert.equal(rendered.pageTitle, "Specification");
  assert.equal(rendered.sourcePath, "site/content/specification/index.md");
  assert.match(rendered.description, /CAP is an open protocol/i);
});
