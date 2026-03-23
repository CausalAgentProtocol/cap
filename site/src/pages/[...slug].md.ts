import type { APIRoute } from "astro";
import { getRawMarkdownByRoute, getSiteMap, routeToSlug } from "../lib/site";

export async function getStaticPaths() {
  const siteMap = await getSiteMap();

  return siteMap.routes.map((entry) => ({
    params: { slug: routeToSlug(entry.route) },
    props: { route: entry.route }
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const route = typeof props?.route === "string" ? props.route : undefined;

  if (!route) {
    return new Response("Not found", { status: 404 });
  }

  const { markdown } = await getRawMarkdownByRoute(route);

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "X-Robots-Tag": "noindex"
    }
  });
};
