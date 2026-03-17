# Quickstart for Clients

This is the shortest safe path for calling a CAP server.

## 1. Discover The Server First

Fetch `/.well-known/cap.json`.

Read these fields before you make any causal call:

- `cap_spec_version`
- `conformance_level`
- `supported_verbs`
- `reasoning_modes_supported`
- `causal_engine`
- `detailed_capabilities`
- `assumptions`
- `authentication`

If the server also exposes `meta.capabilities`, treat it as the same information through the CAP envelope.

## 2. Filter Early

Use the capability card to rule servers in or out before you send requests.

Examples:

- if you need interventions, stop when `conformance_level` is only `1`
- if you need `scm_simulation`, do not infer it from marketing language; check `reasoning_modes_supported`
- if you need path queries, verify `graph.paths` in `supported_verbs.core`
- if you care about mechanism-backed simulation, inspect `causal_engine.structural_mechanisms`, not just the level number

## 3. Make A Conservative First Call

Good first requests are:

- `graph.neighbors`
- `effect.query` with `query_type: "observational"`

Minimal observational request shape from the draft:

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

Current public adapter note:

- some current implementations use a narrower request shape such as `target_node`
- check the server's published schema or SDK if it tracks the current adapter rather than the richer draft contract

## 4. Move To Interventions Deliberately

Only send interventional requests when the capability card justifies them.

At minimum, confirm:

- `conformance_level` is `2`
- `effect.query` is supported for interventional use
- the advertised `reasoning_modes_supported` include a mode acceptable for your use case

If a Level 1 server receives interventional `effect.query`, it should return `query_type_not_supported`.

## 5. Read The Whole Answer, Not Just The Estimate

For interventional responses, inspect:

- `reasoning_mode`
- `identification_status`
- `assumptions`
- `provenance`

Do not treat two CAP results as interchangeable just because they used the same verb. Compare:

- engine family
- reasoning mode
- identification status
- effective assumptions
- provenance

## Common First Mistakes

The most common client mistakes are straightforward:

- treating `conformance_level` as the full story instead of reading the richer capability fields
- assuming a causal-looking answer is interventional just because the wording sounds like "what if"
- comparing answers across servers without checking `reasoning_mode`, `assumptions`, and `provenance`
- assuming the richer draft request shape and the current public adapter shape are always identical

If you avoid those four mistakes, your first CAP integration usually goes much more smoothly.

## When To Use The Spec

Read the specification when the stakes matter or when you are building reusable tooling:

- [Capability Card](../specification/capability-card.md)
- [Causal Semantics](../specification/causal-semantics.md)
- [Verbs](../specification/verbs.md)
- [Message Format](../specification/message-format.md)
