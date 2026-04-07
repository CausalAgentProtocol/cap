# Verbs

## Verb Tiers

CAP divides verbs into three categories:

- `core`: minimum interoperable surface used for conformance
- `convenience`: useful but non-conformance-defining verbs
- `extensions`: implementation-specific behavior outside CAP core

## Core Verbs

The `v0.3.0` CAP core vocabulary is:

- `meta.capabilities`
- `meta.methods`
- `narrate`
- `observe.predict`
- `intervene.do`
- `graph.neighbors`
- `graph.markov_blanket`
- `graph.paths`

### `meta.capabilities`

This verb returns the same capability information served at `/.well-known/cap.json`, but through the CAP envelope.

The returned disclosure MUST be semantically equivalent to the well-known document.

### `meta.methods`

This verb returns machine-readable, LLM-oriented method metadata for the CAP verbs supported by the current endpoint.

The success response shape is `result.methods`, where each entry describes one currently mounted CAP verb.

The response MUST be derived from the server's active public dispatch surface rather than from a stale hand-maintained list.

A server MUST NOT advertise hidden, unmounted, or future verbs through `meta.methods`.

The request MAY include:

- `params.verbs`
- `params.detail = "compact" | "full"`
- `params.include_examples`

If `params.verbs` is omitted or empty, the server MAY return every supported method.

Clients and LLM-oriented integrations that have already read `meta.capabilities.supported_verbs` SHOULD prefer targeted `params.verbs` queries over full-surface discovery requests.

Each returned method descriptor SHOULD disclose:

- `verb`
- `surface`
- `description` when the server can provide one honestly
- `arguments`
- `result_fields`

If `surface` is disclosed, it MUST use one of these values:

- `core`
- `convenience`
- `extension`

`arguments` SHOULD summarize the public request payload under `params`.

`result_fields` SHOULD summarize the success payload under `result`.

`params.detail = "compact"` SHOULD be the default response profile and SHOULD favor invocation-critical metadata over exhaustive schema reproduction.

Envelope-level fields such as `cap_version`, `request_id`, `status`, `error`, and `provenance` do not belong in `result_fields`.

Verbs with no public request parameters SHOULD return `arguments: []`.

This discovery surface supplements `meta.capabilities`. It does not replace the capability card.

### `narrate`

This verb returns causal-form narrative claims without asserting that they are statistically validated.

It exists so narrative systems can participate honestly in CAP.

The request MAY include:

- `params.query`
- optional `params.source_text`
- optional `params.scope`

The success result SHOULD disclose:

- the returned narrative claim or claims
- the narrative or heuristic basis of the claim
- any disclosed limitations or caveats that materially affect interpretation

`narrate` MUST NOT be presented as an identified observational or interventional effect.

### `observe.predict`

This verb returns an observational prediction for one target node.

The CAP core request shape is intent-only:

- `params.target_node`
- optional `context.graph_ref`

Servers MUST NOT require execution-profile hints such as model family selection on the CAP core request when those choices are fixed server defaults or implementation details.

The `observe.predict` success result includes:

- `result.target_node`
- `result.prediction`
- `result.drivers`

Level 1 servers MAY add observational semantic disclosure when it materially improves honesty.

Level 0.5 servers MAY expose `observe.predict` only when they can also disclose that the result is weaker than a Level 1 observational claim where applicable.

### `intervene.do`

This verb returns one interventional claim for one treatment and one selected outcome.

The CAP core request shape is intervention intent only:

- `params.treatment_node`
- `params.treatment_value`
- `params.outcome_node`
- optional `context.graph_ref`

If a server exposes rollout horizon, mechanism override, or richer intervention summaries, those controls belong in richer draft contracts or extension verbs unless they are standardized as CAP core.

The `intervene.do` success result includes one disclosed interventional claim with:

- `result.outcome_node`
- `result.effect`
- `result.reasoning_mode`
- `result.identification_status`
- `result.assumptions`

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

It is part of the CAP core boundary.

Requests SHOULD keep graph selection in shared request context rather than introducing verb-specific graph selectors.

## Convenience Surface

Common convenience verbs include:

- `traverse.parents`
- `traverse.children`

These verbs are useful thin wrappers over the graph-inspection surface, but they are not conformance-defining core verbs.

Convenience verbs improve ergonomics for common workflows. Supporting them does not change a server's declared conformance level.

## Deferred And Extension Surface

Additional helper verbs, counterfactual verbs outside the current CAP core, and implementation-specific workflow verbs belong in convenience or extension surfaces unless and until CAP standardizes them explicitly.

Product-specific discovery surfaces, vendor workflow operations, and implementation-specific topology should not be presented as CAP core.

Workflow-oriented surfaces such as:

- candidate review flows
- reusable analysis handles
- session resumption
- provider-specific execution orchestration

remain extension-scoped unless CAP later standardizes them explicitly.

Legacy `effect.query` schemas remain for compatibility review, and the active CAP `v0.2.2` core surface is split into `observe.predict` and `intervene.do`.
