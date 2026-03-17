# Quickstart for Servers

This is the minimal path to expose a causal engine through CAP without overstating what the server can do.

## 1. Choose The Lowest Honest Level

- choose Level 1 if you support capability disclosure, graph traversal, and observational querying
- choose Level 2 only if you can honestly support interventional querying and the required semantic disclosure

Do not choose a level based on roadmap intent, internal experiments, or a partially wired demo. Choose the level your public interface actually satisfies today.

## 2. Build The Smallest Honest Surface

A Level 1 server needs:

- `GET /.well-known/cap.json`
- `meta.capabilities`
- `graph.neighbors`
- `effect.query` for observational queries

That is the minimum viable CAP server.

A Level 2 server additionally needs:

- `effect.query` for interventional queries
- `graph.paths`

`intervene.do` is strongly recommended for Level 2, but it is still a convenience verb rather than a conformance-defining core verb.

## 3. Publish The Capability Card Before You Tune Ergonomics

Your capability card should be complete enough for a client to decide whether to call you at all.

Be precise about:

- `conformance_level`
- `supported_verbs`
- `causal_engine`
- `detailed_capabilities`
- `assumptions`
- `reasoning_modes_supported`
- `graph`
- `authentication`

If you claim `scm_simulation`, your card must also disclose `causal_engine.structural_mechanisms` with honest mechanism coverage information.

## 4. Return Honest Semantics

If you return interventional results, you must include:

- `reasoning_mode`
- `identification_status`
- `assumptions`

If you cannot support the requested semantics, return a protocol error instead of a stronger-looking answer.

Examples:

- Level 1 receiving interventional `effect.query` should return `query_type_not_supported`
- a server without full mechanism coverage should not label a target effect `scm_simulation`

## 5. The Smallest Level 1 Implementation Shape

For many teams, the easiest way to start is:

1. publish a truthful capability card
2. implement `meta.capabilities` by returning that same card through the CAP envelope
3. implement `graph.neighbors` over your existing graph store
4. implement `effect.query` only for `query_type: "observational"`

That gives clients something real to integrate against without pretending you already support intervention semantics.

## 6. Keep The Draft-Adapter Gap Explicit

Current CAP source materials still record a few visible gaps between the long-form `v0.2.2` draft and the current public adapter.

Do not erase those gaps in prose.

Instead:

- align new implementations to the richer protocol direction where possible
- document intentional narrowing when you must match a narrower adapter
- keep implementation-specific behavior in convenience surfaces or extensions, not CAP core

## 7. Validate Against The Source Of Truth

Use these files as primary references:

- [Conformance](../specification/conformance.md)
- [Capability Card](../specification/capability-card.md)
- [Causal Semantics](../specification/causal-semantics.md)
- [Verbs](../specification/verbs.md)
- [Message Format](../specification/message-format.md)

Machine-readable contracts live in:

- `schema/capability-card/v0.2.2.json`
- `schema/envelopes/v0.2.2.json`
- `schema/verbs/`
