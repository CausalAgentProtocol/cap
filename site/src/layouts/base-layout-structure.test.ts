import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const layoutPath = new URL("./BaseLayout.astro", import.meta.url);
const stylesheetPath = new URL("./BaseLayout.css", import.meta.url);

test("BaseLayout imports its external stylesheet", async () => {
  const source = await readFile(layoutPath, "utf8");

  assert.match(source, /import "\.\/BaseLayout\.css";/, "expected BaseLayout to import a colocated stylesheet");
  assert.doesNotMatch(source, /<style>/, "expected BaseLayout styles to be externalized");
});

test("BaseLayout stylesheet exists", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.ok(source.includes(":root"), "expected stylesheet to contain the layout theme variables");
  assert.ok(source.includes(".masthead"), "expected stylesheet to contain layout chrome rules");
  assert.ok(source.includes(".prose"), "expected stylesheet to contain prose rules");
});
