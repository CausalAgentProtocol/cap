# CAP `v0.3.0`

This directory is the draft source of truth for CAP `v0.3.0`.

Status: draft.

Active normative version: CAP `v0.2.2` remains the active normative protocol version.

This specification defines the proposed CAP `v0.3.0` public surface for capability disclosure, invocation, conformance, and semantic honesty. It is published as a coherent versioned document set so reviewers can read the next protocol contract as one specification rather than reconstructing it from `v0.2.2` plus scattered draft notes.

It defines the protocol contract for:

- L0 and L0.5 conformance tiers
- capability-card disclosure for weaker or hybrid systems
- canonical vocabulary families for semantic and provenance disclosure
- provenance interpretation across capability, response, and workflow layers
- the `narrate` verb for causal-form narrative claims
- a clearer boundary between CAP core semantics and extension-scoped workflow behavior
- message envelopes and verb contracts for the draft surface

For a concise version delta, see [Changes From `v0.2.2`](./changes-from-v0.2.2.md).

The key words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", and "MAY" in this specification are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they appear in all capitals.
