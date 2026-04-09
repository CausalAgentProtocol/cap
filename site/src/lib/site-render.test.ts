import assert from "node:assert/strict";
import test from "node:test";

import { renderRoute } from "./site-render.ts";

test("renderRoute wraps highlighted code blocks in a fixed copy-button shell", async () => {
  const { html } = await renderRoute("/docs/quickstart-server");

  assert.match(
    html,
    /<div class="code-block-shell">[\s\S]*?<button[^>]*class="code-copy-button"[\s\S]*?<svg[\s\S]*?<\/svg>[\s\S]*?<\/button>[\s\S]*?<pre[\s\S]*?<\/pre>\s*<\/div>/,
    "expected highlighted code blocks to render inside a fixed shell with a copy button icon"
  );
});

test("renderRoute syntax-highlights fenced code with shiki token markup", async () => {
  const { html } = await renderRoute("/docs/quickstart-server");

  assert.match(
    html,
    /<pre class="shiki github-light"[\s\S]*?<code>[\s\S]*?<span class="line">[\s\S]*?<span style="color:/,
    "expected fenced code blocks to include Shiki-rendered token spans"
  );
});
