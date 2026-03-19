# Quickstart for Servers

This is the smallest honest path for exposing a causal engine through CAP.

If you want the conceptual background first, read [What Is Causality?](concepts/what-is-causality.md). This page assumes you already know the kind of causal claims your server can and cannot support.

Start by choosing the lowest conformance level your public interface actually satisfies. CAP rewards honest disclosure more than ambitious labeling. A narrower but truthful Level 1 or Level 2 surface is better than a richer surface that overstates semantics or capabilities.

The examples below follow the current Python server shape from `cap-reference`: a FastAPI app factory, shared app state for the CAP service, one `POST /api/v1/cap` route, a protocol dispatch registry, and functional handlers that hand off to adapters.

## 1. Choose The Lowest Honest Level

Choose Level 1 when your public interface can support:

- capability disclosure
- `meta.capabilities`
- `graph.neighbors`
- observational `effect.query`

Choose Level 2 only when your public interface can also support:

- interventional `effect.query`
- `graph.paths`
- structured semantic disclosure for interventional responses

If the answer is uncertain, choose the lower level.

That single choice will shape the rest of the implementation more than any routing or SDK detail.

## 2. Build The Capability Card From The Mounted Surface

In `cap-reference`, the capability card is built from the same dispatch registry that the server mounts. That keeps `supported_verbs`, convenience verbs, and extension namespaces aligned with the real public surface.

The pattern looks like this:

```python
from abel_cap_server.cap.catalog import (
    DISPATCH_REGISTRY,
    build_extension_namespaces,
    build_supported_verbs,
)
from abel_cap_server.cap.disclosure import DEFAULT_ASSUMPTIONS, FORBIDDEN_FIELDS
from abel_cap_server.core.config import Settings
from cap_protocol.core import (
    CAPABILITY_CARD_SCHEMA_URL,
    CapabilityAccessTier,
    CapabilityAuthentication,
    CapabilityCard,
    CapabilityDisclosurePolicy,
    CapabilityGraphMetadata,
    CapabilityProvider,
    REASONING_MODE_GRAPH_PROPAGATION,
    REASONING_MODE_OBSERVATIONAL_PREDICTION,
    REASONING_MODE_STRUCTURAL_SEMANTICS,
)


def build_capability_card(settings: Settings, *, public_base_url: str) -> CapabilityCard:
    supported_verbs = build_supported_verbs(DISPATCH_REGISTRY)

    return CapabilityCard(
        schema_url=CAPABILITY_CARD_SCHEMA_URL,
        name="Example CAP Server",
        description="CAP server over an existing causal engine.",
        version=settings.app_version,
        provider=CapabilityProvider(
            name="Example Provider",
            url="https://example.com",
        ),
        endpoint=f"{public_base_url.rstrip('/')}{settings.api_v1_prefix}",
        conformance_level=2,
        supported_verbs=supported_verbs,
        assumptions=DEFAULT_ASSUMPTIONS,
        reasoning_modes_supported=[
            REASONING_MODE_OBSERVATIONAL_PREDICTION,
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
            CapabilityAccessTier(
                tier="public",
                verbs=supported_verbs.core + supported_verbs.convenience,
                response_detail="summary",
                hidden_fields=list(FORBIDDEN_FIELDS),
            )
        ],
        disclosure_policy=CapabilityDisclosurePolicy(
            hidden_fields=list(FORBIDDEN_FIELDS),
            default_response_detail="summary",
            notes=["Describe any redaction or disclosure limits here."],
        ),
        extensions=build_extension_namespaces(DISPATCH_REGISTRY),
    )
```

Use the typed `CapabilityCard` models directly. The important part is that your card should derive its public verbs from the same mounted registry, not from a second handwritten list.

## 3. Register A Small Public Surface

For a quickstart, keep registration explicit and register handler functions directly. In the current Python server helpers, the registry mounts functions that accept a typed payload plus the FastAPI request.

```python
from abel_cap_server.cap import handlers
from cap_protocol.server import (
    CAPVerbRegistry,
    EFFECT_QUERY_CONTRACT,
    GRAPH_NEIGHBORS_CONTRACT,
    GRAPH_PATHS_CONTRACT,
    META_CAPABILITIES_CONTRACT,
    TRAVERSE_PARENTS_CONTRACT,
)

DISPATCH_REGISTRY = CAPVerbRegistry()
DISPATCH_REGISTRY.core(META_CAPABILITIES_CONTRACT)(handlers.meta_capabilities)
DISPATCH_REGISTRY.core(EFFECT_QUERY_CONTRACT)(handlers.effect_query)
DISPATCH_REGISTRY.core(GRAPH_NEIGHBORS_CONTRACT)(handlers.graph_neighbors)
DISPATCH_REGISTRY.core(GRAPH_PATHS_CONTRACT)(handlers.graph_paths)
DISPATCH_REGISTRY.core(TRAVERSE_PARENTS_CONTRACT, surface="convenience")(
    handlers.traverse_parents
)
DISPATCH_REGISTRY.extension(
    namespace="example",
    name="validate_connectivity",
    request_model=ExampleValidateConnectivityRequest,
    response_model=ExampleValidateConnectivityResponse,
)(handlers.validate_connectivity)
```

The `ExampleValidateConnectivity*` models in that snippet are placeholders for your own extension request and response types.

If you add convenience verbs or extensions, register them in the same place. Keep the mounted surface small, mark convenience verbs explicitly, and let the capability card derive both `supported_verbs` and `extensions` from that registry.

## 4. Write Thin Protocol Handlers

In `cap-reference`, the protocol boundary lives in ordinary functions under `cap/handlers.py`. Those handlers receive the typed CAP request and the FastAPI request, then resolve whatever app-owned runtime they need.

```python
from typing import cast

from fastapi import Request


def get_cap_service_from_request(request: Request) -> CapService:
    return cast("CapService", request.app.state.cap_service)


def meta_capabilities(payload: MetaCapabilitiesRequest, request: Request) -> dict:
    service = get_cap_service_from_request(request)
    return service.build_capabilities_envelope(payload.request_id, str(request.base_url)).model_dump(
        exclude_none=True,
        by_alias=True,
    )


async def graph_paths(payload: GraphPathsRequest, request: Request) -> dict:
    return await get_cap_service_from_request(request).graph_paths(payload)
```

Behind that boundary, keep your causal logic in ordinary async functions or adapters. For example, the current `graph_paths` adapter calls the upstream primitive, maps it into a typed CAP result, and returns a `CAPHandlerSuccessSpec`. The dispatcher then validates the response model and attaches shared provenance context.

```python
from cap_protocol.core import (
    ALGORITHM_PCMCI,
    IDENTIFICATION_STATUS_NOT_APPLICABLE,
    REASONING_MODE_STRUCTURAL_SEMANTICS,
)
from cap_protocol.server import CAPHandlerSuccessSpec, CAPProvenanceHint


async def graph_paths(
    primitive_client: AbelGatewayClient,
    payload: GraphPathsRequest,
) -> CAPHandlerSuccessSpec:
    raw = await primitive_client.fetch_schema_paths(
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
        assumptions=STRUCTURAL_ASSUMPTIONS,
    )

    return CAPHandlerSuccessSpec(
        result=result,
        provenance_hint=CAPProvenanceHint(algorithm=raw.get("method", ALGORITHM_PCMCI)),
    )
```

Keep protocol wiring thin, keep business logic behind ordinary functions, and let those functions construct the CAP-shaped result.

## 5. Mount The Single HTTP Entrypoint

The HTTP route stays minimal:

```python
from typing import Any

from fastapi import APIRouter, Request
from abel_cap_server.cap.provenance import get_abel_provenance_context
from cap_protocol.server import build_fastapi_cap_dispatcher

router = APIRouter(prefix="/cap", tags=["cap"])
CAP_DISPATCHER = build_fastapi_cap_dispatcher(
    registry=DISPATCH_REGISTRY,
    provenance_context_provider=get_abel_provenance_context,
)


@router.post("")
async def dispatch_cap(
    payload: dict[str, Any],
    request: Request,
) -> dict[str, Any]:
    return await CAP_DISPATCHER(payload, request)
```

In `cap-reference`, that router is mounted under `/api/v1`, so clients post to `/api/v1/cap`.

## 6. Assemble App State And Discovery Routes

Keep CAP-specific state on the FastAPI app and mount discovery plus versioned API routers separately:

```python
from fastapi import FastAPI
from abel_cap_server.api.meta import router as meta_router
from abel_cap_server.api.v1.router import api_router
from abel_cap_server.cap.errors import register_cap_exception_handlers
from abel_cap_server.cap.service import CapService
from abel_cap_server.clients.abel_gateway_client import AbelGatewayClient
from abel_cap_server.core.config import Settings, get_settings


def create_app(settings: Settings | None = None) -> FastAPI:
    active_settings = settings or get_settings()
    app = FastAPI(title=active_settings.app_name, version=active_settings.app_version)

    app.state.settings = active_settings
    app.state.abel_primitive_client = AbelGatewayClient(settings=active_settings)
    app.state.cap_service = CapService(
        settings=active_settings,
        primitive_client=app.state.abel_primitive_client,
    )

    register_cap_exception_handlers(app)
    app.include_router(meta_router)
    app.include_router(api_router, prefix=active_settings.api_v1_prefix)
    return app
```

That keeps `GET /.well-known/cap.json`, `GET /`, `GET /api/v1/health`, and `POST /api/v1/cap` under one app without leaking product-specific routing into CAP semantics.

## 7. Return Semantically Honest Responses

If you return stronger causal claims, disclose them clearly.

For interventional responses, include:

- `reasoning_mode`
- `identification_status`
- `assumptions`

If your `intervene.do` result aggregates multiple effect claims, keep reasoning-mode semantics inspectable at the claim level or through a clearly documented shared default. The current `cap-reference` contract is narrower: it requires an `outcome_node`, returns a selected `outcome_summary`, and carries a singular result-level `reasoning_mode`.

If you cannot support the requested semantics, return a protocol error instead of a stronger-looking answer.

## Read Next

- [Expose CAP Over HTTP](guides/expose-cap-over-http.md)
- [Write an Honest Capability Card](guides/write-an-honest-capability-card.md)
- [Conformance Specification](../specification/conformance.md)
