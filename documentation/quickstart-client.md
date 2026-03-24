# Quickstart for Clients

This is the shortest safe path for calling a CAP server.

If you want a conceptual on-ramp before the protocol details, read [What Is Causality?](concepts/what-is-causality.md) first. This page assumes you are ready to inspect a server conservatively rather than start from first principles.

The examples below follow the current Python SDK shape from `python-sdk` and the official minimal server behavior in [`cap-example`](https://github.com/CausalAgentProtocol/cap-example). TypeScript examples can be added later when that SDK lands.

## 1. Discover The Server

Fetch `/.well-known/cap.json`.

If the server also exposes `meta.capabilities`, treat it as the same capability disclosure through the CAP envelope.

If the server exposes `meta.methods`, use it when you need machine-readable verb schemas before invocation.

In the current Python SDK, `meta_methods()` returns one entry per mounted verb, including its `surface`, request `arguments`, and success `result_fields`.

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
- `observe.predict`

With the current Python client:

```python
import asyncio

from cap.client import AsyncCAPClient


async def main() -> None:
    client = AsyncCAPClient("http://127.0.0.1:8000")
    try:
        capabilities = await client.meta_capabilities()
        methods = await client.meta_methods()
        neighbors = await client.graph_neighbors(
            node_id="revenue",
            scope="parents",
            max_neighbors=5,
        )
        prediction = await client.observe_predict(
            target_node="revenue",
        )
        print(capabilities.model_dump(mode="json", exclude_none=True))
        print([item.verb for item in methods.result.methods])
        print(neighbors.model_dump(mode="json", exclude_none=True))
        intervention = await client.intervene_do(
            treatment_node="marketing_spend",
            treatment_value=2.0,
            outcome_node="revenue",
        )
        print(prediction.model_dump(mode="json", exclude_none=True))
        print(intervention.model_dump(mode="json", exclude_none=True))
    finally:
        await client.aclose()


asyncio.run(main())
```

Under the hood, the SDK posts a CAP envelope to the single HTTP entrypoint and sets `verb` for you. Route-style aliases can also be accepted by the SDK, but they are normalized client-side before the request is sent.

Discovery verbs such as `meta.capabilities` and `meta.methods` do not require public `params`.

Some servers may require shared request context such as `context.graph_ref`. Treat those selectors as server-specific invocation requirements disclosed through capability metadata and method documentation rather than as mandatory CAP core inputs for every deployment.

Treat fixed server-side execution choices such as mechanism family or rollout horizon as server disclosure, not as mandatory client-supplied CAP core input.

## 4. Interpret Semantic Disclosure

When a response carries stronger causal meaning, read more than the estimate.

Inspect:

- `reasoning_mode`
- `identification_status`
- `assumptions`
- `provenance`

Those fields tell you what kind of claim the server is making and how comparable it is to answers from other systems. In causal systems, that context is part of the answer.

In the current `cap-example` contract:

- `observe.predict` returns a lightweight observational result with `target_node`, `prediction`, and `drivers`
- clients should not assume observational responses include `intercept`, `reasoning_mode`, `identification_status`, or response-level `assumptions`
- `graph.markov_blanket` is treated as structural semantics, not an identified causal effect
- core `intervene.do` exposes one treatment-to-outcome claim as `outcome_node` plus `effect`, and discloses fixed mechanism usage through provenance rather than request params
- richer rollout summaries such as `outcome_summary`, `node_summaries`, or `total_events` are not part of the active CAP core response contract

## 5. Keep The Draft Gap Explicit

Current public adapters are narrower than parts of the long-form draft. That should make clients cautious, not collapse CAP into a generic RPC wrapper.

Practical rule:

- treat the minimum card fields and core verb contract as the stable base
- treat richer draft fields as protocol direction when the server exposes them
- treat example-server narrowing as a compatibility detail, not as a semantic rewrite
- treat older `effect.query` examples as archival draft material rather than the current public CAP core surface

## Read Next

- [Write an Honest Capability Card](guides/write-an-honest-capability-card.md)
- [Capability Card Specification](../specification/capability-card.md)
- [Causal Semantics Specification](../specification/causal-semantics.md)
- [Official Example Server (`cap-example`)](https://github.com/CausalAgentProtocol/cap-example)
