# Specification

CAP is an open protocol for discovering, invoking, and interpreting causal reasoning capabilities across compliant causal systems.

Active normative version: CAP `v0.2.2` is the active normative protocol version.

This section defines the authoritative protocol requirements for CAP `v0.2.2`, including capability disclosure, causal semantics, message envelopes, verb contracts, conformance, and extension boundaries.

This specification defines the current public CAP surface used for capability disclosure, invocation, and semantic honesty. Draft-era artifacts and future version work may still appear in the repository, but they are not part of the active normative contract unless this section says so explicitly.

Machine-readable CAP schemas live in [the schema layer](../../../schema/), including capability-card, envelope, verb, and shared enum schemas. These artifacts support implementation and validation, but the normative source of truth for protocol requirements remains in these specification pages.

The active CAP core surface in `v0.2.2` is `meta.capabilities`, `meta.methods`, `observe.predict`, `intervene.do`, `graph.neighbors`, `graph.markov_blanket`, and `graph.paths`.

Compatibility artifacts retained in the schema layer are non-normative unless this specification restates them explicitly.

For onboarding, implementation guidance, and examples, use [the documentation pages](/docs/getting-started).

The key words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", and "MAY" in this section are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they appear in all capitals.
