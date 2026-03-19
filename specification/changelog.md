# Specification Changelog

## v0.2.2 Draft

This repository presents CAP `v0.2.2` as a split source of truth:

- normative specification files
- reader documentation
- machine-readable schemas

Under this draft:

- protocol contract language lives in `specification/`
- explanatory and adoption material lives in `documentation/`
- machine-readable artifacts live in `schema/`

## Known Draft Notes

- the long-form draft and current adapter surfaces still differ in a few places, including capability-card richness, envelope `cap_version` examples, and several payload-shape details
- the repository canonical-name catalog is no longer limited to the original draft-only reasoning-mode subset; it now also tracks reference-implementation names that have been stabilized in `cap_protocol.core.canonical`
- the current adapter now treats several temporal intervention fields as optional, requires `outcome_node` for `intervene.do`, and returns a selected `outcome_summary` with singular result-level `reasoning_mode`
- the schema layer records those draft-versus-adapter differences explicitly rather than silently collapsing them
- Level 3 counterfactual remains reserved in `v0.2.x`

## Repository Relationship

This file tracks specification evolution only.

Repository release notes and editorial repo changes belong in the root [`CHANGELOG.md`](../CHANGELOG.md).
