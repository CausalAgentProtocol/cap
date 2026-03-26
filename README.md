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
- [Official Example Server (`cap-example`)](https://github.com/CausalAgentProtocol/cap-example)
- [Normative Specification](specification/index.md)
- [Schemas](schema/README.md)
- [Contributing](CONTRIBUTING.md)
- [Governance](GOVERNANCE.md)

## Community

CAP is developed as an open protocol and welcomes collaboration across research and engineering communities.

Collaborating institutions and organizations include CMU, UCSD, UVA, and Abel AI.

## Repository Layout

- [`specification/`](specification/index.md) contains the protocol contract
- [`documentation/`](documentation/getting-started.md) contains onboarding, concepts, guides, and rationale
- [`schema/`](schema/README.md) contains machine-readable artifacts and minimal examples
- [`site/`](site/README.md) contains the website source and presentation layer

## Status

- current spec version: `0.2.2-draft`
- Level 3 counterfactual remains reserved in `v0.2.x`
- where draft prose and current adapter behavior differ, the repo records the gap explicitly rather than hiding it

## Examples And Notes

- minimal capability-card examples live in [`schema/examples/`](schema/examples/)
- the official minimal example server lives in [`cap-example`](https://github.com/CausalAgentProtocol/cap-example)
- the draft scaffold that seeded that repository still lives in [`examples/cap-example/`](examples/cap-example/)
- example implementations and adapters are useful references, but they are not the CAP standard itself
- the site should source content from this repo rather than becoming a second content fork
