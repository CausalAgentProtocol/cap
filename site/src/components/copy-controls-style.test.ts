import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const pageActionsPath = new URL("./PageActions.astro", import.meta.url);
const baseLayoutStylesPath = new URL("../layouts/BaseLayout.css", import.meta.url);
const baseLayoutStylesDirPath = new URL("../layouts/styles/", import.meta.url);

async function readBaseLayoutStylesBundle() {
  const entrySource = await readFile(baseLayoutStylesPath, "utf8");
  const styleFileNames = (await readdir(baseLayoutStylesDirPath)).filter((fileName) => fileName.endsWith(".css")).sort();
  const styleSources = await Promise.all(
    styleFileNames.map((fileName) => readFile(new URL(`../layouts/styles/${fileName}`, import.meta.url), "utf8"))
  );

  return {
    entrySource,
    combinedSource: styleSources.join("\n")
  };
}

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

test("code copy buttons restore the origin/main code block treatment", async () => {
  const { entrySource, combinedSource } = await readBaseLayoutStylesBundle();

  assert.doesNotMatch(
    combinedSource,
    /:global\(/,
    "expected external stylesheet selectors to avoid Astro-only :global wrappers"
  );
  assert.match(
    entrySource,
    /@import "\.\/styles\/prose\.css";/,
    "expected the layout entry stylesheet to import the prose rules"
  );
  assert.match(
    combinedSource,
    /\.prose \.code-block-shell\s*\{\s*position:\s*relative;/,
    "expected code blocks to keep a relative shell for the copy button"
  );
  assert.match(
    combinedSource,
    /\.prose pre\s*\{[\s\S]*border:\s*1px solid rgba\(17,\s*17,\s*17,\s*0\.14\);[\s\S]*border-radius:\s*18px;[\s\S]*background:\s*#ffffff;[\s\S]*box-shadow:\s*0 1px 2px rgba\(17,\s*17,\s*17,\s*0\.04\);/,
    "expected code blocks to restore the origin/main border and shadow treatment"
  );
  assert.match(
    combinedSource,
    /\.prose \.code-copy-button\s*\{[\s\S]*position:\s*absolute;[\s\S]*top:\s*0\.7rem;[\s\S]*right:\s*0\.75rem;[\s\S]*width:\s*2rem;[\s\S]*height:\s*2rem;/,
    "expected code copy buttons to restore the origin/main 2rem size"
  );
  assert.match(
    combinedSource,
    /\.prose \.code-copy-button svg\s*\{[\s\S]*width:\s*0\.95rem;[\s\S]*height:\s*0\.95rem;/,
    "expected code copy icons to restore the larger origin/main dimensions"
  );
  assert.match(
    combinedSource,
    /\.prose \.code-copy-button\[data-state="copied"\]\s*\{\s*background:\s*rgba\(17,\s*17,\s*17,\s*0\.05\);/,
    "expected code copy buttons to restore the origin/main copied-state fill"
  );
});
