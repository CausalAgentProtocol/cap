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
- `observe.predict`

With the current Python client:

```python
import asyncio

from cap_protocol.client import AsyncCAPClient
from cap_protocol.core import CAPGraphRef


async def main() -> None:
    client = AsyncCAPClient("http://127.0.0.1:8000")
    try:
        graph_ref = CAPGraphRef(graph_id="abel-main", graph_version="CausalNodeV2")
        capabilities = await client.meta_capabilities()
        neighbors = await client.graph_neighbors(
            node_id="<node-id>",
            scope="parents",
            max_neighbors=5,
            graph_ref=graph_ref,
        )
        prediction = await client.observe_predict(
            target_node="<target-node-id>",
            graph_ref=graph_ref,
        )
        print(capabilities.model_dump(mode="json", exclude_none=True))
        print(neighbors.model_dump(mode="json", exclude_none=True))
        print(prediction.model_dump(mode="json", exclude_none=True))
    finally:
        await client.aclose()


asyncio.run(main())
```

Under the hood, the SDK posts a CAP envelope to the single HTTP entrypoint and sets `verb` for you. Route-style aliases can also be accepted by the SDK, but they are normalized client-side before the request is sent.

The current Python client passes graph selection as shared request context rather than duplicating graph selectors per verb:

```python
response = await client.intervene_do(
    treatment_node="<treatment-node-id>",
    treatment_value=1.0,
    outcome_node="<outcome-node-id>",
    graph_ref=CAPGraphRef(graph_id="abel-main", graph_version="CausalNodeV2"),
)
```

Treat fixed server-side execution choices such as mechanism family or rollout horizon as server disclosure, not as mandatory client-supplied CAP core input.

## 4. Interpret Semantic Disclosure

When a response carries stronger causal meaning, read more than the estimate.

Inspect:

- `reasoning_mode`
- `identification_status`
- `assumptions`
- `provenance`

Those fields tell you what kind of claim the server is making and how comparable it is to answers from other systems. In causal systems, that context is part of the answer.

In the current `cap-reference` contract:

- `observe.predict` exposes observational intent and may disclose `observational_prediction`
- `graph.markov_blanket` is treated as structural semantics, not an identified causal effect
- core `intervene.do` exposes one treatment-to-outcome claim and discloses fixed mechanism usage through provenance rather than request params

## 5. Keep The Draft Gap Explicit

Current public adapters are narrower than parts of the long-form draft. That should make clients cautious, not collapse CAP into a generic RPC wrapper.

Practical rule:

- treat the minimum card fields and core verb contract as the stable base
- treat richer draft fields as protocol direction when the server exposes them
- treat adapter-specific narrowing as a compatibility detail, not as a semantic rewrite
- treat older `effect.query` examples as archival draft material rather than the current public CAP core surface

## Read Next

- [Write an Honest Capability Card](guides/write-an-honest-capability-card.md)
- [Capability Card Specification](../specification/capability-card.md)
- [Causal Semantics Specification](../specification/causal-semantics.md)
