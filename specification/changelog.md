# Specification Changelog

## v0.3.0

- promoted `v0.3.0` to the active normative protocol version
- introduced L0 Narrative and L0.5 Hybrid as active conformance tiers
- introduced `narrate` as an active CAP core verb
- added canonical-name and provenance pages to separate stable server disclosure from response-scoped detail
- clarified that workflow sessions, reusable handles, and provider orchestration remain extension-scoped unless later standardized
- clarified that CAP core result schemas define canonical minimum fields rather than exhaustive payloads
- clarified that richer additive core result fields are allowed while core request schemas remain canonical
- clarified that extension namespaces may distinguish stateless helper surfaces from stateful workflow surfaces
- standardized `options.response_detail = "summary" | "full" | "raw"` as a response-shaping hint
- allowed restricted L0.5 `intervene.do` with explicit weaker semantic disclosure

## v0.2.2

- remains published as a historical versioned specification
- aligned the documented public verb surface on `meta.capabilities`, `meta.methods`, `observe.predict`, `intervene.do`, `graph.neighbors`, `graph.markov_blanket`, and `graph.paths`
- established the `observe.predict` / `intervene.do` split and the `v0.2.2` wire version
- remains available for compatibility review under `/spec/v0.2.2`

## Repository Relationship

This file tracks specification evolution only.

Repository release notes and editorial repo changes belong in the root [`CHANGELOG.md`](../CHANGELOG.md).
