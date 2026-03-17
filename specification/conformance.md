# Conformance

## Level Model

CAP uses a progressive conformance model:

- Level 1: Observe
- Level 2: Intervene
- Level 3: Counterfact, reserved in `v0.2.x`

The capability card declares `conformance_level`, but clients SHOULD treat that level as a coarse signal and still inspect detailed capability metadata.

## Level 1: Observe

Level 1 is the minimum viable CAP server.

A Level 1 server MUST implement these core verbs:

- `meta.capabilities`
- `graph.neighbors`
- `effect.query` for observational queries

A Level 1 server SHOULD implement these convenience verbs:

- `observe.predict`
- `traverse.parents`
- `meta.health`

Level 1 MUST NOT imply interventional support.

When a Level 1 server receives `effect.query` with `query_type = "interventional"`, it MUST return `query_type_not_supported`.

Level 1 does not require `reasoning_mode`, `identification_status`, or response-level `assumptions` for ordinary observational results.

## Level 2: Intervene

Level 2 extends Level 1 for engines that can simulate or estimate interventions.

A Level 2 server MUST implement:

- all Level 1 requirements
- `effect.query` for interventional queries
- `graph.paths`

A Level 2 server SHOULD implement:

- `intervene.do`
- `traverse.children`

For every `intervene.*` response and every `effect.query` response with `query_type = "interventional"`, the server MUST disclose:

- `reasoning_mode`
- `identification_status`
- `assumptions`

The long-form draft additionally requires `intervene.do` to carry `reasoning_mode` per target effect rather than only once at result level.

## Level 3: Counterfact

Level 3 remains reserved in `v0.2.x`.

Under the current contract:

- servers MUST NOT declare `conformance_level: 3`
- counterfactual technical readiness MAY be disclosed through richer capability metadata
- counterfactual conformance is not yet active because normative schemas and conformance tests are not finalized

## Declaration Rules

A server's declared level MUST align with:

- its supported core verbs
- its actual runtime behavior
- its semantic disclosure behavior

A server MUST NOT declare a higher level merely because it has a related internal algorithm.

## Capability Metadata Versus Levels

`conformance_level` is intentionally coarse.

Two Level 2 servers may differ materially in:

- whether they model latent confounding
- whether they have executable structural mechanisms
- whether they expose uncertainty methods
- whether they support only graph propagation versus richer intervention semantics

That finer interpretation belongs in:

- `detailed_capabilities`
- `causal_engine`
- `reasoning_modes_supported`
- `assumptions`
