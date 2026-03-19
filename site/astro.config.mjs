import { defineConfig } from "astro/config";

export default defineConfig(({ command }) => ({
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
