# Quickstart for Servers

This is the shortest practical path to a CAP server that a new implementer can actually understand.

If you want the fastest route, start from [`cap-example`](https://github.com/CausalAgentProtocol/cap-example). It is the official teaching server for CAP: small, synthetic, and intentionally honest about what is protocol behavior versus toy runtime behavior.

If you want conceptual background first, read [What Is Causality?](concepts/what-is-causality.md). This page assumes you mainly want to get a server running and then understand the moving parts.

The examples below follow the current public Python SDK shape from `python-sdk`: a `CAPVerbRegistry`, a single `POST /cap` route, typed request and response models, and thin FastAPI handlers over your own runtime.

If you want to use the FastAPI server helpers shown here, install the optional server extra:

```bash
pip install "cap-protocol[server]"
```

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
    "cap_version": "0.3.0",
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

Build the capability card from the same registry you actually dispatch. That keeps `supported_verbs`, convenience verbs, and extension namespaces aligned with the public surface.

Use the capability card for the compact server summary. Put field-level request and result detail in `meta.methods`.

If your first public surface does not expose extensions, do not include extension machinery in the first capability-card implementation.

The generic pattern looks like this:

```python
from cap.core import (
    CAPABILITY_CARD_SCHEMA_URL,
    CapabilityAuthentication,
    CapabilityCard,
    CapabilityCausalEngine,
    CapabilityDetailedCapabilities,
    CapabilityGraphMetadata,
    CapabilityProvider,
    CapabilityStructuralMechanisms,
    CapabilitySupportedVerbs,
    REASONING_MODE_GRAPH_PROPAGATION,
    REASONING_MODE_IDENTIFIED_CAUSAL_EFFECT,
    REASONING_MODE_OBSERVATIONAL_PREDICTION,
    REASONING_MODE_STRUCTURAL_SEMANTICS,
    build_capability_access_tier,
    build_capability_disclosure_policy,
)
from cap.server import CAPVerbRegistry


def build_capability_card(
    registry: CAPVerbRegistry,
    *,
    public_base_url: str,
) -> CapabilityCard:
    supported_verbs = CapabilitySupportedVerbs(
        core=registry.verbs_for_surface("core"),
        convenience=registry.verbs_for_surface("convenience"),
    )

    return CapabilityCard(
        schema_url=CAPABILITY_CARD_SCHEMA_URL,
        name="Example CAP Server",
        description="CAP server over an existing causal runtime.",
        version="0.1.0",
        cap_spec_version="0.3.0",
        provider=CapabilityProvider(
            name="Example Provider",
            url="https://example.com",
        ),
        endpoint=f"{public_base_url.rstrip('/')}/cap",
        conformance_level=2,
        supported_verbs=supported_verbs,
        causal_engine=CapabilityCausalEngine(
            family="scm",
            algorithm="example_runtime",
            supports_time_lag=True,
            supports_instantaneous=False,
            structural_mechanisms=CapabilityStructuralMechanisms(
                available=True,
                families=["linear_scm"],
                mechanism_override_supported=False,
                counterfactual_ready=False,
            ),
        ),
        detailed_capabilities=CapabilityDetailedCapabilities(
            graph_discovery=False,
            graph_traversal=True,
            temporal_multi_lag=True,
            effect_estimation=True,
            intervention_simulation=True,
            counterfactual_scm=False,
            latent_confounding_modeled=False,
            partial_identification=False,
            uncertainty_quantified=False,
        ),
        assumptions=["Describe the assumptions your public surface depends on."],
        reasoning_modes_supported=[
            REASONING_MODE_OBSERVATIONAL_PREDICTION,
            REASONING_MODE_IDENTIFIED_CAUSAL_EFFECT,
            REASONING_MODE_STRUCTURAL_SEMANTICS,
            REASONING_MODE_GRAPH_PROPAGATION,
        ],
        graph=CapabilityGraphMetadata(
            domains=["<domain>"],
            node_count=1234,
            edge_count=5678,
            node_types=["<node-type>"],
            edge_types_supported=["<edge-type>"],
            graph_representation="<graph-representation>",
            update_frequency="<update-frequency>",
            temporal_resolution="<temporal-resolution>",
            coverage_description="Describe the graph or causal surface exposed by this server.",
        ),
        authentication=CapabilityAuthentication(type="api_key"),
        access_tiers=[
            build_capability_access_tier(
                tier="public",
                verbs=supported_verbs.core + supported_verbs.convenience,
                hidden_fields=["weight", "conditioning_set"],
                response_detail="summary",
            )
        ],
        disclosure_policy=build_capability_disclosure_policy(
            hidden_fields=["weight", "conditioning_set"],
            default_response_detail="summary",
            notes=["Describe any redaction or disclosure limits here."],
        ),
    )
```

If you later mount extensions, derive the namespace summary from the same registry rather than hand-maintaining a separate extension inventory.

That matters because:

- `meta.capabilities` stays aligned with the verbs you really expose
- `meta.methods` can describe the same mounted surface
- you do not end up maintaining one handwritten list for docs and another for code

Use the typed `CapabilityCard` models directly, and make sure the `endpoint` field points at your real `POST /cap` URL.

## 5. Register Verbs Explicitly

For a quickstart, keep registration explicit and mount handler functions directly. In the current Python server helpers, the registry mounts functions that accept a typed payload plus the FastAPI request.

```python
from cap.server import (
    CAPVerbRegistry,
    GRAPH_MARKOV_BLANKET_CONTRACT,
    GRAPH_NEIGHBORS_CONTRACT,
    GRAPH_PATHS_CONTRACT,
    INTERVENE_DO_CONTRACT,
    META_CAPABILITIES_CONTRACT,
    META_METHODS_CONTRACT,
    OBSERVE_PREDICT_CONTRACT,
    TRAVERSE_CHILDREN_CONTRACT,
    TRAVERSE_PARENTS_CONTRACT,
)

registry = CAPVerbRegistry()
registry.core(META_CAPABILITIES_CONTRACT)(meta_capabilities)
registry.core(META_METHODS_CONTRACT)(meta_methods)
registry.core(OBSERVE_PREDICT_CONTRACT)(observe_predict)
registry.core(INTERVENE_DO_CONTRACT)(intervene_do)
registry.core(GRAPH_NEIGHBORS_CONTRACT)(graph_neighbors)
registry.core(GRAPH_MARKOV_BLANKET_CONTRACT)(graph_markov_blanket)
registry.core(GRAPH_PATHS_CONTRACT)(graph_paths)
registry.core(TRAVERSE_PARENTS_CONTRACT, surface="convenience")(traverse_parents)
registry.core(TRAVERSE_CHILDREN_CONTRACT, surface="convenience")(traverse_children)
registry.extension(
    namespace="example",
    name="validate_connectivity",
    request_model=ExampleValidateConnectivityRequest,
    response_model=ExampleValidateConnectivityResponse,
)(validate_connectivity)
```

If you add convenience verbs or extensions, register them in the same place. Keep the mounted surface small, mark convenience verbs explicitly, and let both the capability card and `meta.methods` derive from that registry.

One detail is easy to miss: the Python SDK can derive `meta.methods` descriptors from the mounted registry, because `CAPVerbRegistry.list_methods(...)` introspects the registered request and response models. But it does not auto-publish the `meta.methods` verb for you. You still need to register `META_METHODS_CONTRACT` in your public surface and route that request to a handler that returns the registry-derived method metadata.

## 6. Keep Handlers Thin

Keep the protocol boundary small. A common pattern is for request handlers to resolve an app-owned service from `request.app.state`, then delegate runtime work there.

```python
from typing import cast

from fastapi import Request
from cap.core import GraphPathsRequest, MetaCapabilitiesRequest, MetaMethodsRequest


def get_cap_service_from_request(request: Request) -> "ExampleCAPService":
    return cast("ExampleCAPService", request.app.state.cap_service)


def meta_capabilities(payload: MetaCapabilitiesRequest, request: Request) -> dict:
    service = get_cap_service_from_request(request)
    return service.build_capabilities_envelope(
        request_id=payload.request_id,
        public_base_url=str(request.base_url),
    ).model_dump(exclude_none=True, by_alias=True)


def meta_methods(payload: MetaMethodsRequest, request: Request) -> dict:
    service = get_cap_service_from_request(request)
    return service.build_methods_envelope(
        request_id=payload.request_id,
        params=payload.params,
    ).model_dump(exclude_none=True, by_alias=True)


async def graph_paths(payload: GraphPathsRequest, request: Request) -> dict:
    service = get_cap_service_from_request(request)
    return await service.graph_paths(payload, headers=request.headers)
```

Behind that boundary, keep your causal logic in ordinary async functions or adapters. For example, a generic `graph_paths` adapter can map runtime output into a typed CAP result and return `CAPHandlerSuccessSpec` so the dispatcher handles the final envelope.

```python
from collections.abc import Mapping

from cap.core import (
    ALGORITHM_PCMCI,
    IDENTIFICATION_STATUS_NOT_APPLICABLE,
    REASONING_MODE_STRUCTURAL_SEMANTICS,
    GraphPathsResult,
)
from cap.server import CAPHandlerSuccessSpec, CAPProvenanceHint


async def graph_paths_adapter(
    runtime,
    payload: GraphPathsRequest,
    *,
    headers: Mapping[str, str] | None = None,
) -> CAPHandlerSuccessSpec:
    del headers

    raw = await runtime.fetch_paths(
        source_node_id=payload.params.source_node_id,
        target_node_id=payload.params.target_node_id,
        timeout_ms=payload.options.timeout_ms,
    )

    result = GraphPathsResult(
        source_node_id=payload.params.source_node_id,
        target_node_id=payload.params.target_node_id,
        connected=bool(raw.get("connected", False)),
        path_count=len(raw.get("paths", [])[: payload.params.max_paths]),
        paths=[_map_path(path) for path in raw.get("paths", [])[: payload.params.max_paths]],
        reasoning_mode=REASONING_MODE_STRUCTURAL_SEMANTICS,
        identification_status=IDENTIFICATION_STATUS_NOT_APPLICABLE,
        assumptions=["Describe the structural assumptions behind these paths."],
    )

    return CAPHandlerSuccessSpec(
        result=result,
        provenance_hint=CAPProvenanceHint(
            algorithm=raw.get("method", ALGORITHM_PCMCI),
        ),
    )
```

That is the right split for a first server. Your causal logic should stay in ordinary functions or services, not inside your HTTP routing layer.

## 7. Mount One HTTP Entrypoint

The HTTP route stays minimal:

```python
from typing import Any

from fastapi import APIRouter, Request
from cap.server import CAPProvenanceContext, build_fastapi_cap_dispatcher


async def provenance_context_provider(payload, request: Request) -> CAPProvenanceContext:
    del payload
    settings = request.app.state.settings
    return CAPProvenanceContext(
        graph_version="v1",
        server_name=settings.app_name,
        server_version=settings.app_version,
    )


router = APIRouter(tags=["cap"])
cap_dispatcher = build_fastapi_cap_dispatcher(
    registry=registry,
    provenance_context_provider=provenance_context_provider,
)


@router.post("/cap")
async def dispatch_cap(payload: dict[str, Any], request: Request) -> dict[str, Any]:
    return await cap_dispatcher(payload, request)
```

The capability card should advertise this same invocation URL through `endpoint`.

Discovery verbs such as `meta.capabilities` and `meta.methods` may omit `params`, but they still use the same CAP envelope and endpoint.

## 8. Assemble App State And Discovery Routes

Keep CAP-specific state on the FastAPI app and mount discovery, CAP, and health routes directly:

```python
from fastapi import FastAPI, Request
from pydantic import BaseModel

from cap.core import CapabilityCard
from cap.server import register_cap_exception_handlers


class ServiceMetaResponse(BaseModel):
    name: str
    version: str
    docs: str
    openapi: str


class HealthResponse(BaseModel):
    status: str
    app_name: str
    environment: str
    version: str


def create_app(settings, causal_runtime) -> FastAPI:
    app = FastAPI(title=settings.app_name, version=settings.app_version)

    app.state.settings = settings
    app.state.causal_runtime = causal_runtime
    app.state.cap_service = ExampleCAPService(
        settings=settings,
        runtime=causal_runtime,
        registry=registry,
    )

    register_cap_exception_handlers(app)
    app.include_router(router)

    @app.get("/", response_model=ServiceMetaResponse)
    def metadata() -> ServiceMetaResponse:
        return ServiceMetaResponse(
            name=settings.app_name,
            version=settings.app_version,
            docs="/docs",
            openapi="/openapi.json",
        )

    @app.get("/.well-known/cap.json", response_model=CapabilityCard)
    def capability_card(request: Request) -> CapabilityCard:
        return build_capability_card(registry, public_base_url=str(request.base_url))

    @app.get("/health", response_model=HealthResponse)
    def health_check() -> HealthResponse:
        return HealthResponse(
            status="ok",
            app_name=settings.app_name,
            environment=settings.app_env,
            version=settings.app_version,
        )

    return app
```

That keeps `GET /`, `GET /.well-known/cap.json`, `GET /health`, and `POST /cap` under one app without leaking product-specific routing into CAP semantics.

## 9. Replace The Toy Runtime With Your Real One

Once the example shape is running, replace the synthetic parts in this order:

1. Swap the toy graph or toy service for your real causal runtime.
2. Update the capability card so it describes your real engine, assumptions, and disclosure policy.
3. Remove example-only extensions and add your own only if they are genuinely non-core.
4. Re-check that your advertised verbs still match what the server actually supports.

This is the point where `cap-reference` becomes useful. `cap-example` teaches the protocol boundary. `cap-reference` shows a fuller server structure with app state, adapters, provenance helpers, and a more production-like layout.

## 10. Return Semantically Honest Results

Semantic honesty is not polish. It is part of the protocol contract.

The easiest CAP mistake is returning answers that sound stronger than your system can justify.

If you expose stronger causal claims, disclose the semantics clearly. Interventional or graph-structural responses should include:

- `reasoning_mode`
- `identification_status`
- `assumptions`

At the CAP core boundary, keep request payloads focused on user intent:

- `observe.predict` should stay centered on `target_node`
- `intervene.do` should stay centered on `treatment_node`, `treatment_value`, and `outcome_node`
- fixed runtime defaults such as one mechanism family or one rollout horizon should be disclosed through capability metadata or provenance, not presented as generic CAP-core user controls

If you need richer rollout controls, time-lag summaries, or preview semantics, expose them as explicitly non-core extensions.

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
