# Quickstart for Clients

This is the shortest safe path for calling a CAP server.

## 1. Discover The Server

Fetch `/.well-known/cap.json`.

If the server also exposes `meta.capabilities`, treat it as the same capability disclosure through the CAP envelope.

## 2. Read The Minimum Fields First

Start here:

- `conformance_level`
- `supported_verbs`
- `assumptions`
- `reasoning_modes_supported`
- `graph`
- `authentication`

These tell you whether the server fits your task before you send a causal request.

Some servers may expose richer draft-era fields such as `causal_engine`, `detailed_capabilities`, or `bindings`. Treat those as additional disclosure, not as the minimum contract required to recognize CAP.

## 3. Make A Conservative First Call

Good first requests are:

- `graph.neighbors`
- `effect.query` with `query_type: "observational"`

Minimal draft-style example:

```json
{
  "cap_version": "0.2",
  "verb": "effect.query",
  "params": {
    "target": "revenue",
    "query_type": "observational"
  }
}
```

Some current implementations still expose narrower request shapes. Treat that as an implementation detail or draft gap, not as the whole CAP boundary.

## 4. Interpret Semantic Disclosure

When a response carries stronger causal meaning, read more than the estimate.

Inspect:

- `reasoning_mode`
- `identification_status`
- `assumptions`
- `provenance`

Those fields tell you what kind of claim the server is making and how comparable it is to answers from other systems.

## 5. Keep The Draft Gap Explicit

Current public adapters are narrower than parts of the long-form draft. That should make clients cautious, not collapse CAP into a generic RPC wrapper.

Practical rule:

- treat the minimum card fields and core verb contract as the stable base
- treat richer draft fields as protocol direction when the server exposes them
- treat adapter-specific narrowing as a compatibility detail, not as a semantic rewrite

## Read Next

- [Write an Honest Capability Card](guides/write-an-honest-capability-card.md)
- [Capability Card Specification](../specification/capability-card.md)
- [Causal Semantics Specification](../specification/causal-semantics.md)
