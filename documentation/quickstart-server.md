# Quickstart for Servers

This is the shortest practical path to a CAP server that a new implementer can actually understand.

If you want the fastest route, start from [`cap-example`](https://github.com/CausalAgentProtocol/cap-example). It is the official teaching server for CAP: small, synthetic, and intentionally honest about what is protocol behavior versus toy runtime behavior.

If you want conceptual background first, read [What Is Causality?](concepts/what-is-causality.md). This page assumes you mainly want to get a server running and then understand the moving parts.

## The Mental Model

A CAP server only needs four things:

- a capability card at `GET /.well-known/cap.json`
- one `POST /cap` endpoint
- a registry that maps verbs to handlers
- handlers that call your causal runtime and return semantically honest results

That is the core. Everything else is implementation detail.

Two CAP ideas are worth taking seriously from the first day:

- the capability card tells clients what your server really supports before they call it
- semantic honesty tells clients how strongly they should interpret the answers after they call it

If you get those two parts right, the rest of the server shape is much easier to reason about.

## 1. Run The Example First

Before designing your own server, run the example once.

Prerequisites:

- Python 3.11+
- `uv`

Inside the `cap-example` repository, start the server:

```bash
uv sync --extra dev
uv run uvicorn example_cap_server.main:app --reload --host 0.0.0.0 --port 8000
```

Then inspect:

- `http://127.0.0.1:8000/.well-known/cap.json`
- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/health`

Finally, send one CAP request:

```bash
curl -s -X POST http://127.0.0.1:8000/cap \
  -H 'Content-Type: application/json' \
  -d '{
    "cap_version": "0.2.2",
    "request_id": "req-capabilities-1",
    "verb": "meta.capabilities"
  }' | jq
```

If that flow makes sense, you already understand the public surface you need to reproduce.

## 2. Learn The Four Moving Parts

In `cap-example`, the important pieces are easy to find:

- `example_cap_server/main.py`: FastAPI app, capability card, verb registry, and handlers
- `example_cap_server/toy_graph.py`: synthetic causal runtime
- `/.well-known/cap.json`: discovery document generated from the capability card
- `POST /cap`: single protocol entrypoint

For a first implementation, copy this shape before you try to optimize it.

## 3. Start With A Small Honest Surface

Do not begin by implementing every CAP verb.

Start with the smallest surface you can support honestly. A very good first version is:

- `meta.capabilities`
- `meta.methods`
- `observe.predict`
- `graph.neighbors`
- `graph.markov_blanket`

That first surface is usually enough for a truthful Level 1 server.

Add `intervene.do` and `graph.paths` only when your underlying system can support those semantics truthfully and you are ready to claim the stronger surface that comes with Level 2.

If you are unsure what conformance level to claim, choose the lower one. CAP rewards honest disclosure more than ambitious labeling.

## 4. Build The Capability Card From The Real Mounted Surface

Do not treat the capability card as documentation you will fill in later.

In `cap-example`, the capability card uses the same registry the server actually mounts. That is the pattern to keep.

```python
supported_verbs = CapabilitySupportedVerbs(
    core=registry.verbs_for_surface("core"),
    convenience=registry.verbs_for_surface("convenience"),
)
```

That matters because:

- `meta.capabilities` stays aligned with the verbs you really expose
- `meta.methods` can describe the same mounted surface
- you do not end up maintaining one handwritten list for docs and another for code

Use the typed `CapabilityCard` models directly, and make sure the `endpoint` field points at your real `POST /cap` URL.

## 5. Register Verbs Explicitly

For a quickstart, keep registration simple and obvious:

```python
registry = CAPVerbRegistry()


@registry.core(META_CAPABILITIES_CONTRACT)
def meta_capabilities(payload: MetaCapabilitiesRequest, request: Request) -> dict:
    ...


@registry.core(META_METHODS_CONTRACT)
def meta_methods(payload: MetaMethodsRequest, request: Request) -> dict:
    ...


@registry.core(OBSERVE_PREDICT_CONTRACT)
def observe_predict(payload: ObservePredictRequest, request: Request) -> CAPHandlerSuccessSpec:
    ...
```

This is friendlier than hiding everything behind abstraction on day one. You should be able to answer three questions immediately:

- which verbs exist
- which handler owns each verb
- which parts are CAP protocol code versus your own causal logic

## 6. Keep Handlers Thin

Handlers should mostly do protocol work:

- validate and receive the typed request
- call your runtime
- map the result into a CAP response shape
- attach provenance or semantic hints when needed

In `cap-example`, the runtime lives in `toy_graph.py` and the handlers mostly translate between CAP models and that runtime.

That is the right split for a first server. Your causal logic should stay in ordinary functions or services, not inside your HTTP routing layer.

## 7. Mount One HTTP Entrypoint

The public HTTP surface should stay small:

- `GET /`
- `GET /health`
- `GET /.well-known/cap.json`
- `POST /cap`

`cap-example` mounts a single CAP dispatcher:

```python
dispatch = build_fastapi_cap_dispatcher(
    registry=registry,
    provenance_context_provider=provenance_context_provider,
)


@app.post("/cap")
async def cap_endpoint(payload: dict, request: Request) -> dict:
    return await dispatch(payload, request)
```

That is usually enough. CAP does not need one HTTP route per verb.

## 8. Replace The Toy Runtime With Your Real One

Once the example shape is running, replace the synthetic parts in this order:

1. Swap the toy graph or toy service for your real causal runtime.
2. Update the capability card so it describes your real engine, assumptions, and disclosure policy.
3. Remove example-only extensions and add your own only if they are genuinely non-core.
4. Re-check that your advertised verbs still match what the server actually supports.

This is the point where `cap-reference` becomes useful. `cap-example` teaches the protocol boundary. `cap-reference` shows a fuller server structure with app state, adapters, provenance helpers, and a more production-like layout.

## 9. Return Semantically Honest Results

Semantic honesty is not polish. It is part of the protocol contract.

The easiest CAP mistake is returning answers that sound stronger than your system can justify.

If you expose stronger causal claims, disclose the semantics clearly. Interventional or graph-structural responses should include the fields needed for conservative interpretation, such as:

- `reasoning_mode`
- `identification_status`
- `assumptions`

If your runtime cannot support the requested semantics, return a protocol error or expose a narrower verb surface. Do not make the response look more authoritative than it is.

## When To Reach For `cap-reference`

Use `cap-example` when you are:

- learning the protocol boundary
- building your first server
- teaching the CAP request and response shape to teammates

Use `cap-reference` when you are:

- adding app configuration and settings
- separating protocol handlers from backend adapters
- hardening discovery, provenance, and service wiring
- moving toward a production deployment pattern

Start simple. You can always grow from the example into the reference shape later.

## Read Next

- [Quickstart for Clients](quickstart-client.md)
- [Expose CAP Over HTTP](guides/expose-cap-over-http.md)
- [Write an Honest Capability Card](guides/write-an-honest-capability-card.md)
- [Conformance Specification](../specification/conformance.md)
