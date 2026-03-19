# Verbs

## Verb Tiers

CAP divides verbs into three categories:

- `core`: minimum interoperable surface used for conformance
- `convenience`: useful but non-conformance-defining verbs
- `extensions`: implementation-specific behavior outside CAP core

## Core Verbs

The active CAP core surface in `v0.2.x` is:

- `meta.capabilities`
- `observe.predict`
- `intervene.do`
- `graph.neighbors`
- `graph.markov_blanket`
- `graph.paths`

### `meta.capabilities`

This verb returns the same capability information served at `/.well-known/cap.json`, but through the CAP envelope.

The returned disclosure MUST be semantically equivalent to the well-known document.

### `observe.predict`

This verb returns an observational prediction for one target node.

The CAP core request shape is intent-only:

- `params.target_node`
- optional `context.graph_ref`

Servers MUST NOT require execution-profile hints such as model family selection on the CAP core request when those choices are fixed server defaults or implementation details.

### `intervene.do`

This verb returns one interventional claim for one treatment and one selected outcome.

The CAP core request shape is intervention intent only:

- `params.treatment_node`
- `params.treatment_value`
- `params.outcome_node`
- optional `context.graph_ref`

If a server exposes rollout horizon, mechanism override, or richer intervention summaries, those controls belong in richer draft contracts or extension verbs unless they are standardized as CAP core.

### `graph.neighbors`

This verb returns immediate structural neighbors for a requested node.

The public request shape is:

- `params.node_id`
- `params.scope = "parents" | "children"`
- optional `params.max_neighbors`
- optional `context.graph_ref`

Neighbor entries SHOULD use role-based disclosure so a server can express multi-role structural relationships without inventing extra verbs.

### `graph.markov_blanket`

This verb returns the Markov blanket for a requested node.

Markov blanket membership is a structural relation, not an identified causal effect claim.

Servers that expose Markov blanket membership SHOULD disclose:

- `reasoning_mode = "structural_semantics"`
- `identification_status = "not_applicable"`
- `edge_semantics = "markov_blanket_membership"`

### `graph.paths`

This verb returns causal paths between nodes.

It is part of the CAP core boundary even when some lightweight current implementations still trail it publicly.

Requests SHOULD keep graph selection in shared request context rather than introducing verb-specific graph selectors.

## Convenience Surface

Common convenience verbs in current source materials include:

- `traverse.parents`
- `traverse.children`

These verbs are useful thin wrappers over the graph-inspection surface, but they are not conformance-defining core verbs.

## Deferred And Extension Surface

Additional helper verbs, preview counterfactual verbs, and implementation-specific workflow verbs belong in convenience or extension surfaces unless and until CAP standardizes them explicitly.

Product-specific discovery surfaces, vendor workflow operations, and Abel-only topology should not be presented as CAP core.

Older draft material also referenced `effect.query` as a combined observational and interventional surface. The current CAP repository preserves that history in legacy schemas where useful, but the active public core surface is split into `observe.predict` and `intervene.do`.
