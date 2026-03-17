# Site Source

Application code for the site should live here.

Framework choice is still open, but the app should follow these constraints:

- treat `../content/site-map.json` as the route-to-source manifest
- render repository markdown from `../../documentation/`, `../../specification/`, and approved repo-root files
- keep landing-page-only copy inside `site/content/pages/`, `site/content/docs/`, and `site/content/specification/`
- do not create a second long-form content source inside `site/src/`

Current implementation:

- Astro routes are generated from the site-map manifest
- markdown is read from repository source files at build time
- site-only landing pages remain under `site/content/`
