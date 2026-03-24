import type { APIRoute } from "astro";
import externalLinks from "../../../config/external-links.json" with { type: "json" };
import { getSiteMap } from "../lib/site";

export const GET: APIRoute = async () => {
  const siteMap = await getSiteMap();
  const baseUrl = externalLinks.docsBaseUrl.replace(/\/+$/, "");
  const urls = siteMap.routes.map((entry) => `${baseUrl}${entry.route}`);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join("\n")}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
