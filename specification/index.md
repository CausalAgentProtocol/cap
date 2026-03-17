# Specification Index

The `specification/` directory is the normative prose source of truth for CAP.

This directory contains only protocol contract material. Explanatory onboarding, rationale, and tutorials belong in [`documentation/`](../documentation/). Machine-readable contracts belong in [`schema/`](../schema/).

Current files:

- `protocol.md`: protocol scope, roles, and lifecycle
- `capability-card.md`: capability disclosure contract
- `causal-semantics.md`: reasoning mode, identification status, assumptions
- `verbs.md`: core and convenience verb definitions
- `message-format.md`: request and response envelopes
- `transport-bindings.md`: HTTP, MCP, and A2A bindings
- `security.md`: authentication and disclosure rules
- `conformance.md`: level definitions and declaration rules
- `extensions.md`: extension registration boundary
- `changelog.md`: spec evolution notes

Editorial rule:

- if a statement is required for interoperability, it belongs here
- if a statement only helps a reader learn CAP, it should move to `documentation/`

Implementation-specific examples and adapters may trail the full `v0.2.2` draft contract. When that happens, this directory keeps the normative protocol boundary rather than collapsing the specification down to a narrower implementation surface.
