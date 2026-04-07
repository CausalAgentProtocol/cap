import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const layoutPath = new URL("./BaseLayout.astro", import.meta.url);
const stylesheetPath = new URL("./BaseLayout.css", import.meta.url);
const stylesDirPath = new URL("./styles/", import.meta.url);

async function readStylesheetBundle() {
  const entrySource = await readFile(stylesheetPath, "utf8");
  const styleFileNames = (await readdir(stylesDirPath)).filter((fileName) => fileName.endsWith(".css")).sort();
  const styleSources = await Promise.all(
    styleFileNames.map((fileName) => readFile(new URL(`./styles/${fileName}`, import.meta.url), "utf8"))
  );

  return {
    entrySource,
    styleFileNames,
    combinedSource: styleSources.join("\n")
  };
}

test("BaseLayout imports its external stylesheet", async () => {
  const source = await readFile(layoutPath, "utf8");

  assert.match(source, /import "\.\/BaseLayout\.css";/, "expected BaseLayout to import a colocated stylesheet");
  assert.doesNotMatch(source, /<style>/, "expected BaseLayout styles to be externalized");
});

test("BaseLayout stylesheet exists", async () => {
  const { entrySource, styleFileNames, combinedSource } = await readStylesheetBundle();

  assert.deepEqual(
    styleFileNames,
    ["core.css", "layout.css", "masthead.css", "prose.css", "responsive.css", "search.css"],
    "expected the layout stylesheet bundle to be split into stable responsibility-based files"
  );
  assert.match(entrySource, /@import "\.\/styles\/core\.css";/, "expected BaseLayout.css to import the shared core rules");
  assert.match(entrySource, /@import "\.\/styles\/prose\.css";/, "expected BaseLayout.css to import the prose rules");
  assert.ok(combinedSource.includes(":root"), "expected stylesheet bundle to contain the layout theme variables");
  assert.ok(combinedSource.includes(".masthead"), "expected stylesheet bundle to contain layout chrome rules");
  assert.ok(combinedSource.includes(".prose"), "expected stylesheet bundle to contain prose rules");
  assert.doesNotMatch(
    combinedSource,
    /:global\(/,
    "expected external stylesheet selectors to be browser-valid and not use Astro-only :global wrappers"
  );
  assert.match(
    combinedSource,
    /\.prose h1,\s*\n\.prose h2,\s*\n\.prose h3\s*\{[\s\S]*font-weight:\s*var\(--font-weight-medium\);/,
    "expected prose headings to match the origin/main medium-weight typography"
  );
  assert.match(
    combinedSource,
    /\.page-header\s*\{[\s\S]*gap:\s*0\.35rem;/,
    "expected the page header spacing to match origin/main"
  );
  assert.match(
    combinedSource,
    /\.page-header-meta\s*\{[\s\S]*?font-weight:\s*var\(--font-weight-medium\);[\s\S]*?\}/,
    "expected the small page header label to use the lighter medium weight"
  );
  assert.match(
    combinedSource,
    /\.sidebar-group h2\s*\{[\s\S]*?font-weight:\s*var\(--font-weight-medium\);[\s\S]*?\}/,
    "expected sidebar section headings to use the lighter medium weight"
  );
  assert.match(
    combinedSource,
    /\.toc h2\s*\{[\s\S]*?font-weight:\s*var\(--font-weight-medium\);[\s\S]*?\}/,
    "expected the toc heading to use the lighter medium weight"
  );
  assert.match(
    combinedSource,
    /\.prose p,\s*\n\.prose li\s*\{[\s\S]*font-size:\s*var\(--font-size-body-strong\);[\s\S]*font-weight:\s*var\(--font-weight-regular\);/,
    "expected prose body copy to keep the stronger origin/main text rhythm"
  );
  assert.match(combinedSource, /\.doc-inline-button/, "expected prose stylesheet to include the inline doc button styles");
});

test("BaseLayout renders the spec version switcher in the masthead utility", async () => {
  const source = await readFile(layoutPath, "utf8");

  assert.match(
    source,
    /<div class="masthead-utility">[\s\S]*data-spec-version-dropdown/s,
    "expected the spec version switcher to render inside the masthead utility area"
  );
  assert.doesNotMatch(
    source,
    /<nav class="spec-version-switcher"/,
    "expected the old page-header switcher markup to be removed"
  );
  assert.match(
    source,
    /\? "Active" : "Draft"/,
    "expected draft versions to use the shorter Draft status label"
  );
  assert.match(
    source,
    /specVersionSwitcher\.currentLabel/,
    "expected the trigger to render the normalized display label instead of the raw version key"
  );
});
