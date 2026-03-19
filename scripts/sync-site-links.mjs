import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const capRoot = path.resolve(__dirname, "..");
const configPath = path.join(capRoot, "config", "external-links.json");
const siteMapPath = path.join(capRoot, "site", "content", "site-map.json");

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

function joinUrl(base, pathname = "") {
  const normalizedBase = trimTrailingSlash(base);

  if (!pathname) {
    return normalizedBase;
  }

  return `${normalizedBase}/${pathname.replace(/^\/+/, "")}`;
}

function docsUrl(config, route = "") {
  return joinUrl(config.docsBaseUrl, route);
}

async function loadJson(jsonPath) {
  return JSON.parse(await fs.readFile(jsonPath, "utf8"));
}

function buildLlms(config, siteMap) {
  const titleByRoute = new Map(siteMap.routes.map((entry) => [entry.route, entry.title]));
  const sections = [
    {
      heading: "Overview",
      items: [
        ["/docs/overview", "Plain-language introduction to CAP and its protocol boundary."],
        ["/docs/getting-started", "Recommended entry point for implementers and readers new to CAP."],
        ["/spec", "Normative CAP specification landing page."]
      ]
    },
    {
      heading: "Documentation",
      items: [
        ["/docs/concepts/what-is-causality", "Background on causality concepts used by CAP."],
        ["/docs/quickstart-client", "How CAP clients discover and call CAP servers."],
        ["/docs/quickstart-server", "How to expose a CAP server over HTTP."],
        ["/docs/guides/write-an-honest-capability-card", "Guidance for truthful capability disclosure."],
        ["/docs/guides/expose-cap-over-http", "HTTP binding guidance and request flow."],
        ["/docs/guides/migrate-from-proprietary-causal-api", "Migration guidance for existing causal APIs."],
        ["/docs/guides/extensions", "How to think about CAP extensions."],
        ["/docs/rationale/why-cap", "Protocol rationale and positioning."]
      ]
    },
    {
      heading: "Specification",
      items: [
        ["/spec/protocol", "CAP scope, roles, state model, and binding model."],
        ["/spec/capability-card", "Normative disclosure requirements for `/.well-known/cap.json`."],
        ["/spec/causal-semantics", "`reasoning_mode`, `identification_status`, and `assumptions`."],
        ["/spec/verbs", "CAP verb surface and semantic expectations."],
        ["/spec/message-format", "Request and response envelope structure."],
        ["/spec/conformance", "Level model and current `v0.2.x` conformance rules."],
        ["/spec/extensions", "Extension boundaries and compatibility expectations."],
        ["/spec/changelog", "Changelog for spec-level changes."]
      ]
    }
  ];

  return [
    "# CAP",
    "",
    "The Causal Agent Protocol (CAP) is an open protocol for discovering, invoking, and interpreting causal reasoning services.",
    "",
    ...sections.flatMap((section) => [
      `## ${section.heading}`,
      "",
      ...section.items.map(([route, description]) => {
        const title = titleByRoute.get(route);
        if (!title) {
          throw new Error(`Missing route in site-map.json: ${route}`);
        }
        return `- [${title}](${docsUrl(config, route)}): ${description}`;
      }),
      ""
    ])
  ].join("\n");
}

async function writeFile(relativePath, contents) {
  const absolutePath = path.join(capRoot, relativePath);
  await fs.writeFile(absolutePath, contents);
}

async function main() {
  const config = await loadJson(configPath);
  const siteMap = await loadJson(siteMapPath);
  const llms = buildLlms(config, siteMap);

  await writeFile("site/public/llms.txt", llms);

  try {
    await fs.access(path.join(capRoot, "site", "dist"));
    await writeFile("site/dist/llms.txt", llms);
  } catch {
    // Ignore missing build output.
  }
}

await main();
