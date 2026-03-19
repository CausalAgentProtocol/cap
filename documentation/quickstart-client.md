# Quickstart for Clients

This is the shortest safe path for calling a CAP server.

If you want a conceptual on-ramp before the protocol details, read [What Is Causality?](concepts/what-is-causality.md) first. This page assumes you are ready to inspect a server conservatively rather than start from first principles.

The examples below follow the current Python client shape from `cap-reference`. They use the Python SDK today; TypeScript examples can be added later when that SDK lands.

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

These tell you whether the server fits your task before you send a causal request. The goal is not to understand everything the server can do. The goal is to avoid asking it for a kind of claim it cannot support honestly.

Some servers may expose richer draft-era fields such as `causal_engine`, `detailed_capabilities`, or `bindings`. Treat those as additional disclosure, not as the minimum contract required to recognize CAP.

## 3. Make A Conservative First Call

Good first requests are:

- `graph.neighbors`
- `effect.query` with `query_type: "observational"`

With the current Python client:

```python
import asyncio

from cap_protocol.client import AsyncCAPClient


async def main() -> None:
    client = AsyncCAPClient("http://127.0.0.1:8000")
    try:
        capabilities = await client.meta_capabilities()
        neighbors = await client.graph_neighbors(
            node_id="<node-id>",
            direction="both",
            top_k=5,
        )
        print(capabilities.model_dump(mode="json", exclude_none=True))
        print(neighbors.model_dump(mode="json", exclude_none=True))
    finally:
        await client.aclose()


asyncio.run(main())
```

Under the hood, the SDK posts a CAP envelope to the single HTTP entrypoint and sets `verb` for you. Route-style aliases can also be accepted by the SDK, but they are normalized client-side before the request is sent.

For observational `effect.query`, the current Python client follows the narrower public adapter shape:

```python
response = await client.effect_query(
    query_type="observational",
    target_node="<target-node-id>",
    model="linear",
    feature_type="parents",
)
```

Treat that narrower request shape as a current implementation detail or draft gap, not as the whole CAP boundary.

## 4. Interpret Semantic Disclosure

When a response carries stronger causal meaning, read more than the estimate.

Inspect:

- `reasoning_mode`
- `identification_status`
- `assumptions`
- `provenance`

Those fields tell you what kind of claim the server is making and how comparable it is to answers from other systems. In causal systems, that context is part of the answer.

In the current `cap-reference` contract, both `effect.query` and `intervene.do` expose a singular `reasoning_mode`. `intervene.do` is narrowed to a selected `outcome_node` plus its `outcome_summary`, rather than a multi-claim result set.

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
