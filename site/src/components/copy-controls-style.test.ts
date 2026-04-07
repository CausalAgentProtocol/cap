import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageActionsPath = new URL("./PageActions.astro", import.meta.url);
const baseLayoutStylesPath = new URL("../layouts/BaseLayout.css", import.meta.url);

test("page copy controls stay compact and do not recolor on copied state", async () => {
  const source = await readFile(pageActionsPath, "utf8");

  assert.match(
    source,
    /min-height:\s*2\.2rem;/,
    "expected the page copy controls to use the shorter 2.2rem height"
  );
  assert.doesNotMatch(
    source,
    /\.page-actions\[data-state="copied"\]\s+\.page-actions-primary\s*\{\s*background:/,
    "expected the page copy button to avoid a copied-state background fill"
  );
  assert.doesNotMatch(
    source,
    /\.page-actions\[data-state="copied"\][\s\S]*\.page-actions-primary-label[\s\S]*color:/,
    "expected the page copy button to avoid recoloring its label after copy"
  );
});

test("code copy buttons stay compact and keep a neutral copied state", async () => {
  const source = await readFile(baseLayoutStylesPath, "utf8");

  assert.match(
    source,
    /:global\(\.prose \.code-copy-button\)\s*\{[\s\S]*width:\s*1\.75rem;[\s\S]*height:\s*1\.75rem;/,
    "expected code copy buttons to use the smaller 1.75rem size"
  );
  assert.match(
    source,
    /:global\(\.prose \.code-copy-button\)\s*\{[\s\S]*appearance:\s*none;/,
    "expected code copy buttons to explicitly reset native button appearance"
  );
  assert.doesNotMatch(
    source,
    /:global\(\.prose \.code-copy-button\[data-state="copied"\]\)\s*\{\s*background:/,
    "expected code copy buttons to avoid a copied-state background fill"
  );
});
