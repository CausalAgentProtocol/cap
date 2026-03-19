# Site

The public site source must live inside this repository.

Rules for `site/`:

- the site is a presentation layer, not a second documentation source
- copy should be sourced from [`documentation/`](../documentation/getting-started.md) and [`specification/`](../specification/index.md)
- root-level positioning and navigation copy should stay aligned with [`../README.md`](../README.md)
- CAP core and example implementations must remain clearly separated

Current site-content contract:

- [`content/site-map.json`](content/site-map.json) is the route-to-source manifest
- [`content/pages/`](content/pages/) holds site-only landing pages
- [`content/docs/`](content/docs/) holds the docs landing page and ingestion notes
- [`content/specification/`](content/specification/) holds the specification landing page and ingestion notes

The site app should consume repository markdown from the mapped source files rather than duplicating that content inside [`site/`](./).

Shared external URLs for the CAP repo are configured in [`../config/external-links.json`](../config/external-links.json). Regenerate site-adjacent external-link artifacts with `node ../scripts/sync-site-links.mjs` or `npm run sync:links`.

## Local Development

From [`cap/site/`](./):

- `npm install`
- `npm run dev`

The Astro app reads route definitions from [`content/site-map.json`](content/site-map.json) and renders mapped markdown from the repository.
