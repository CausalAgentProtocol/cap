# Specification Changelog

## v0.2.2 Draft

This repository presents CAP `v0.2.2` as a split source of truth:

- normative specification files
- reader documentation
- machine-readable schemas

Under this draft:

- protocol contract language lives in [the specification pages](./index.md)
- explanatory and adoption material lives in [the documentation pages](../documentation/getting-started.md)
- machine-readable artifacts live in [the schema layer](../schema/README.md)

## Known Draft Notes

- the long-form draft and current adapter surfaces still differ in a few places, including capability-card richness, envelope `cap_version` examples, and several payload-shape details
- the repository canonical-name catalog is no longer limited to the original draft-only reasoning-mode subset; it now also tracks reference-implementation names that have been stabilized in `cap_protocol.core.canonical`
- the March 2026 protocol verb audit split the active public query surface into `observe.predict` and `intervene.do`, promoted `graph.markov_blanket` into the core graph surface, and moved graph selection into shared `context.graph_ref`
- subsequent `cap-reference` updates further narrowed core `intervene.do` to intent-only input plus one disclosed interventional claim, while pushing rollout-specific controls such as time horizon into extensions
- the current adapter now uses role-based graph-neighbor disclosure and treats Markov blanket membership as structural semantics rather than an identified effect claim
- the schema layer records those draft-versus-adapter differences explicitly rather than silently collapsing them
- Level 3 counterfactual remains reserved in `v0.2.x`

## Repository Relationship

This file tracks specification evolution only.

Repository release notes and editorial repo changes belong in the root [`CHANGELOG.md`](../CHANGELOG.md).
