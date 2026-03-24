import type { APIRoute } from "astro";
import externalLinks from "../../../config/external-links.json" with { type: "json" };

export const GET: APIRoute = async () => {
  const baseUrl = externalLinks.docsBaseUrl.replace(/\/+$/, "");
  const body = [`User-agent: *`, `Allow: /`, `Sitemap: ${baseUrl}/sitemap.xml`].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
