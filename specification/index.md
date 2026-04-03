# Specification

This directory is the normative source of truth for CAP.

Active normative version: CAP `v0.2.2` is the active normative protocol version.

This specification defines the current public CAP surface used for capability disclosure, invocation, and semantic honesty. Draft-era artifacts and future version work may still appear in the repository, but they are not part of the active normative contract unless this section says so explicitly.

It defines the protocol contract for:

- capability disclosure
- causal semantics
- message envelopes
- verb contracts
- conformance
- extension boundaries

Explanatory onboarding and implementation guidance belong in [the documentation pages](../documentation/getting-started.md).
Machine-readable schemas belong in [the schema layer](../schema/README.md).

The active CAP core surface in `v0.2.2` is `meta.capabilities`, `meta.methods`, `observe.predict`, `intervene.do`, `graph.neighbors`, `graph.markov_blanket`, and `graph.paths`.

Compatibility artifacts retained in the schema layer are non-normative unless this specification restates them explicitly.

The key words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", and "MAY" in this specification are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they appear in all capitals.
