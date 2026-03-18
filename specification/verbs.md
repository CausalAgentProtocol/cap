# Verbs

## Verb Tiers

CAP divides verbs into three categories:

- `core`: minimum interoperable surface used for conformance
- `convenience`: useful but non-conformance-defining verbs
- `extensions`: implementation-specific behavior outside CAP core

## Core Verbs

The CAP core surface in `v0.2.x` is:

- `meta.capabilities`
- `graph.neighbors`
- `graph.paths`
- `effect.query`

### `meta.capabilities`

This verb returns the same capability information served at `/.well-known/cap.json`, but through the CAP envelope.

The returned disclosure MUST be semantically equivalent to the well-known document.

### `graph.neighbors`

This verb returns immediate graph neighbors for a requested node.

It is part of the minimum CAP core because clients need a small graph-inspection surface that does not depend on vendor-specific traversal helpers.

### `graph.paths`

This verb returns causal paths between nodes.

It is part of the CAP core boundary even when some lightweight current implementations still trail it publicly.

### `effect.query`

This verb is the core query surface for observational and, at Level 2, interventional queries.

If `query_type = "interventional"`, the response MUST include:

- `reasoning_mode`
- `identification_status`
- `assumptions`

Level 1 servers MUST reject interventional `effect.query` with `query_type_not_supported`.

## Practical Current Public Verbs

Common practical verbs in current source materials include:

- `observe.predict`
- `intervene.do`

These are important and often useful, but they do not by themselves redefine the conformance core.

## Deferred And Extension Surface

Additional helper verbs, preview counterfactual verbs, and implementation-specific workflow verbs belong in convenience or extension surfaces unless and until CAP standardizes them explicitly.

Product-specific discovery surfaces, vendor workflow operations, and Abel-only topology should not be presented as CAP core.
