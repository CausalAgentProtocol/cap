# Specification Changelog

## v0.2.2

- clarified that CAP `v0.2.2` is the active normative protocol version for the public specification pages
- aligned the documented public verb surface on `meta.capabilities`, `meta.methods`, `observe.predict`, `intervene.do`, `graph.neighbors`, `graph.markov_blanket`, and `graph.paths`
- demoted retained draft-era and schema-layer compatibility artifacts from implied primary contract status unless restated normatively in the specification

### Draft framing retained from the v0.2.2 drafting cycle

This repository presents CAP `v0.2.2` as a split source of truth:

- normative specification files
- reader documentation
- machine-readable schemas

Under this draft:

- protocol contract language lives in [the specification pages](./index.md)
- explanatory and adoption material lives in [the documentation pages](../documentation/getting-started.md)
- machine-readable artifacts live in [the schema layer](../schema/README.md)

## Known Draft Notes

- the long-form draft and current adapter surfaces still differ in a few places, especially capability-card richness and several payload-shape details
- the repository canonical-name catalog is no longer limited to the original draft-only reasoning-mode subset; it now also tracks names that were stabilized in earlier public implementations and preserved in `cap_protocol.core.canonical`
- the March 2026 protocol verb audit split the active public query surface into `observe.predict` and `intervene.do`, promoted `graph.markov_blanket` into the core graph surface, and moved graph selection into shared `context.graph_ref`
- subsequent public adapter updates further narrowed core `intervene.do` to intent-only input plus one disclosed interventional claim, while pushing rollout-specific controls such as time horizon into extensions
- subsequent public adapter updates also simplified `observe.predict` to a lightweight `target_node` / `prediction` / `drivers` result and simplified `intervene.do` output to `outcome_node` plus one disclosed `effect`
- the current adapter now uses role-based graph-neighbor disclosure and treats Markov blanket membership as structural semantics rather than an identified effect claim
- the active public envelope wire value is now standardized on `cap_version = "0.2.2"`; older `0.2` examples should be read as archival draft history
- the schema layer records those draft-versus-adapter differences explicitly rather than silently collapsing them
- Level 3 counterfactual remains reserved in `v0.2.x`

## Repository Relationship

This file tracks specification evolution only.

Repository release notes and editorial repo changes belong in the root [`CHANGELOG.md`](../CHANGELOG.md).
