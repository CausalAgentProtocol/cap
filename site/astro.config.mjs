import { defineConfig } from "astro/config";
import externalLinks from "../config/external-links.json" with { type: "json" };

export default defineConfig(({ command }) => ({
  site: externalLinks.docsBaseUrl,
  redirects: {
    "/": "/docs/overview",
    "/docs": "/docs/overview"
  },
  build: {
    redirects: command !== "build"
  },
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "github-light"
    }
  },
  output: "static"
}));
