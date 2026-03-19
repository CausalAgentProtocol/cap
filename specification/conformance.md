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
- `observe.predict`
- `graph.neighbors`
- `graph.markov_blanket`

A Level 1 server SHOULD implement these convenience verbs:

- `traverse.parents`
- `traverse.children`

Level 1 MUST NOT imply interventional support.

Level 1 does not require `reasoning_mode`, `identification_status`, or response-level `assumptions` for ordinary observational prediction results.

Level 1 servers MAY still include those fields on observational or structural verbs when doing so improves semantic clarity.

When a Level 1 server exposes `graph.markov_blanket`, it MUST NOT describe blanket membership as an identified interventional effect.

## Level 2: Intervene

Level 2 extends Level 1 for engines that can simulate or estimate interventions.

A Level 2 server MUST implement:

- all Level 1 requirements
- `intervene.do`
- `graph.paths`

A Level 2 server SHOULD implement:

- `traverse.parents`
- `traverse.children`

For every `intervene.*` response, the server MUST disclose:

- `reasoning_mode`
- `identification_status`
- `assumptions`

The CAP core `intervene.do` request is intent-only:

- `treatment_node`
- `treatment_value`
- `outcome_node`
- optional `context.graph_ref`

Servers MUST NOT present fixed execution defaults such as one hardcoded mechanism family or one hardcoded rollout horizon as if they were generic user-controlled CAP core parameters.

If a server needs richer intervention controls, it SHOULD expose them through an extension or another explicitly non-core surface until CAP standardizes those controls normatively.

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
