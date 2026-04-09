# Specification

CAP is an open protocol for discovering, invoking, and interpreting causal reasoning capabilities across compliant causal systems.

This directory is the normative source of truth for CAP `v0.3.0`.

Status: active.

This specification defines the active CAP `v0.3.0` public surface for capability disclosure, invocation, conformance, and semantic honesty.

It defines the protocol contract for:

- L0 and L0.5 conformance tiers
- capability-card disclosure for weaker or hybrid systems
- canonical vocabulary families for semantic and provenance disclosure
- provenance interpretation across capability, response, and workflow layers
- the `narrate` verb for causal-form narrative claims
- a clearer boundary between CAP core semantics and extension-scoped workflow behavior
- message envelopes and verb contracts for the active surface

For a concise version delta, see [Changes From `v0.2.2`](./changes-from-v0.2.2.md).

The key words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", and "MAY" in this specification are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they appear in all capitals.
