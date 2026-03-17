# CAP

CAP is an open protocol for capability disclosure, invocation, and provenance in causal reasoning systems.

This repository contains the CAP normative specification, supporting schemas, reader documentation, and the source for `causalagentprotocol.io`.

## What CAP Standardizes

- capability discovery
- causal verb semantics
- conformance levels
- assumptions disclosure
- provenance and transport bindings

## What CAP Does Not Standardize

- how a causal engine discovers graphs
- how data is ingested, stored, or refreshed
- agent orchestration
- implementation-specific discovery surfaces
- which causal engine is scientifically correct

## Start Here

- [Overview](documentation/overview.md)
- [Getting Started](documentation/getting-started.md)
- [Quickstart for Clients](documentation/quickstart-client.md)
- [Quickstart for Servers](documentation/quickstart-server.md)
- [Normative Specification](specification/index.md)
- [Schemas](schema/README.md)
- [Contributing](CONTRIBUTING.md)
- [Governance](GOVERNANCE.md)

## Repository Layout

- `specification/` contains the protocol contract
- `documentation/` contains onboarding, concepts, guides, and rationale
- `schema/` contains machine-readable artifacts and minimal examples
- `site/` contains the website source and presentation layer

## Status

- current spec version: `0.2.2-draft`
- Level 3 counterfactual remains reserved in `v0.2.x`
- where draft prose and current adapter behavior differ, the repo records the gap explicitly rather than hiding it

## Examples And Notes

- minimal capability-card examples live in `schema/examples/`
- example implementations and adapters are useful references, but they are not the CAP standard itself
- the site should source content from this repo rather than becoming a second content fork

## Planning Notes

- see [CAP_REPO_PLAN.md](CAP_REPO_PLAN.md) for repo structure, IA, migration mapping, and boundary decisions
