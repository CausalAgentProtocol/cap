# Verbs

## Verb Tiers

CAP divides verbs into three categories:

- `core`: minimum interoperable surface used for conformance
- `convenience`: common ergonomic verbs that are useful but not conformance-defining
- `extensions`: implementation-specific verbs outside CAP core

CAP core MUST NOT be expanded by smuggling implementation-specific verbs into a capability card.

## Core Surface

The v0.2.2 core surface is:

- `meta.capabilities`
- `graph.neighbors`
- `graph.paths`
- `effect.query`

`counterfact.query` is reserved directionally in the draft but is not active CAP core in `v0.2.x`.

## Convenience Surface

Common v0.2.2 convenience verbs include:

- `observe.predict`
- `intervene.do`
- `traverse.parents`
- `traverse.children`

The long-form draft lists additional observation, traversal, metadata, and future counterfactual helpers, but these do not redefine the conformance core.

## `meta.capabilities`

Purpose:

- return the same capability card served at `/.well-known/cap.json`, but through the CAP envelope

Requirement:

- the envelope-returned card MUST be semantically equivalent to the well-known document

## `graph.neighbors`

Purpose:

- return immediate parents, children, or both for a node

Draft request shape:

- `node_id`
- `direction`
- optional `top_k`
- optional `sort_by`
- optional `include_values`

Draft response shape:

- `node_id`
- `direction`
- `neighbors`
- optional `intercept`
- optional `undetermined_neighbor_count`

Special rule for partially oriented graphs:

- if `graph.graph_representation` is `cpdag` or `pag`, the server MUST return only neighbors whose orientation is determined with respect to the requested direction
- omitted ambiguous neighbors SHOULD be counted in `undetermined_neighbor_count`

## `graph.paths`

Purpose:

- return causal paths between a source node and a target node

This verb is part of CAP Level 2 core even though some current lightweight implementations trail it.

## `effect.query`

Purpose:

- provide one core verb that covers observational queries and, at Level 2, interventional effect queries

Draft request shape:

- `target`
- `query_type`
- optional `intervention`
- optional `top_k_causes`
- optional `include_provenance`
- optional `include_paths`

Draft response shape:

- `target`
- `query_type`
- `estimate`
- optional `causal_features`

Conditional semantic rule:

- if `query_type = "interventional"`, the response MUST include `reasoning_mode`, `identification_status`, and `assumptions`

Level rule:

- Level 1 servers MUST reject `query_type = "interventional"` with `query_type_not_supported`

Current adapter note:

- the current public adapter uses a narrower request shape based on `target_node`, `treatment_node`, `treatment_value`, and `outcome_node`
- the schema layer records both shapes explicitly

## `intervene.do`

Purpose:

- expose Pearl-style intervention simulation as a convenience verb

Draft request shape:

- `interventions`
- `targets`
- optional `horizon`
- optional `include_paths`

Draft response shape:

- echoed `interventions`
- per-target `effects`
- result-level `identification_status`
- result-level `assumptions`

Critical semantic rule:

- `reasoning_mode` is per-effect in the draft response
- `scm_simulation` MUST NOT be returned for a target unless the required causal path has full executable mechanism coverage

Current adapter note:

- the current public adapter still exposes `reasoning_mode` at result level and returns `node_summaries` rather than per-target draft `effects`
- this is preserved in the schema layer as an explicit adapter branch

## Editorial Boundary

The following are not CAP core:

- product-specific discovery surfaces
- implementation-specific regime or reflexivity operations
- implementation-specific experimental verbs

Those belong under extension namespaces, not in the CAP core taxonomy.
