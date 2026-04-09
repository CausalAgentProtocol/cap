# Provenance

## Purpose

This page defines how CAP `v0.3.0` uses provenance and disclosure.

The goal is to help clients answer three different questions cleanly:

1. what kind of server is this
2. what kind of claim did this response return
3. which runtime details are provider-specific rather than CAP-core meaning

CAP uses the word "provenance" in a broad sense, but not every kind of metadata belongs in the same place.

## Three Provenance Layers

CAP distinguishes three layers:

- capability disclosure
- response provenance
- workflow or runtime metadata

These layers must not be collapsed into one undifferentiated blob.

## Layer 1: Capability Disclosure

Capability disclosure is server-level metadata published through the capability card.

It answers questions such as:

- what conformance tier the server claims
- which verbs it supports
- which assumptions or reasoning modes may appear
- what kind of graph or model scope it exposes
- how the server should be interpreted in general

Capability disclosure belongs in [Capability Card](./capability-card.md).

Capability disclosure is relatively stable across requests.

Examples:

- `conformance_level`
- `conformance_name`
- `supported_verbs`
- `reasoning_modes_supported`
- server-level assumptions
- structure origin summary
- parameter origin summary

## Layer 2: Response Provenance

Response provenance is per-response metadata that helps a client interpret one concrete result.

It answers questions such as:

- what semantic strength this claim has
- whether the claim is formally identified
- which assumptions apply to this result
- which graph or model view this result used
- what caveats or limitations matter for this result

Response provenance is request-scoped and result-scoped.

## Layer 3: Workflow Or Runtime Metadata

Workflow or runtime metadata is provider-specific state used to support interaction patterns, cached graph views, or resumable workflows.

Examples:

- `session_handle`
- `execution_ref`
- `display_subgraph_ref`
- TTL or expiry fields
- rebuild context
- provider-specific snapshot selection handles

These may be useful and legitimate.

They are not automatically CAP-core provenance.

By default, they belong in provider extensions unless a later CAP version standardizes them explicitly.

## Response Provenance Categories

For readability, CAP groups response provenance into four conceptual categories.

These are logical categories, not necessarily one fixed JSON nesting scheme.

### 1. Semantic Provenance

Semantic provenance tells the client what kind of claim this is.

Typical fields:

- `reasoning_mode`
- `identification_status`
- `assumptions`

This is the most important provenance category.

If a response returns a causal-form claim, the server SHOULD expose enough semantic provenance for the client to interpret that claim honestly.

### 2. Model Provenance

Model provenance tells the client where the structure or parameterization behind the result came from.

Typical fields or categories:

- `structure_origin`
- `parameter_origin`
- `methodology_class`
- `reproducibility_status`

This category is especially important for L0 and L0.5 systems.

### 3. Graph Or Context Provenance

Graph or context provenance tells the client which graph, graph view, or model context the server actually used.

Typical fields or categories:

- `graph_ref`
- graph version
- graph freshness
- graph coverage note

This category is useful when the result depends materially on which graph view was used.

### 4. Caveat Provenance

Caveat provenance tells the client what to be careful about when interpreting the result.

Typical fields or categories:

- `limitation_summary`
- `caveat_summary`
- coverage or freshness caveats
- weaker-tier warnings

This category becomes especially important when the result uses weaker semantics than a client might otherwise assume from the verb name alone.

## Physical Representation Rule

These provenance categories are conceptual.

CAP does not require every response to place them under one mandatory JSON object layout.

Depending on the verb contract, provenance information may appear:

- as top-level response fields inside `result`
- as a dedicated `provenance` object
- as a mix of required result fields plus optional provenance detail

What matters is semantic clarity, not one universal nesting pattern.

Richer additive result fields do not reduce the disclosure burden.

If a server returns a richer payload than the canonical minimum, the semantic honesty and provenance requirements still apply to the claim being returned.

## Minimum Rule For Causal-Form Claims

If a response returns a causal-form claim, the server SHOULD disclose semantic provenance sufficient for the client to interpret the claim.

For stronger verbs such as `intervene.*`, the relevant verb and semantics pages may impose stricter field requirements.

For weaker tiers such as L0 and L0.5, the server SHOULD also disclose model provenance or caveat provenance whenever omission would make the response materially misleading.

Additive provider-specific result detail is allowed, but it MUST NOT substitute for semantic provenance when the claim would otherwise be ambiguous or overstated.

## Capability Card Versus Response Provenance

Capability disclosure and response provenance do different jobs.

Capability disclosure says what the server may do in general.

Response provenance says what happened in this particular result.

Response provenance does not need to repeat the entire capability card.

But response provenance SHOULD add detail whenever the one concrete result would otherwise be ambiguous.

## Workflow Metadata Boundary

Workflow metadata MUST NOT be mistaken for CAP-core provenance merely because it appears in responses.

If a provider exposes:

- sessions
- reusable handles
- provider-owned graph views
- resumable workflows

those are valid extension-level behaviors.

They do not become CAP-core objects unless CAP later standardizes them.

## Interpretation Guidance

A client reading a response should apply the layers in this order:

1. read the capability card to understand the server's claimed tier and general disclosure
2. read the response's semantic provenance to understand the claim that was actually returned
3. read model, graph, and caveat provenance as needed to calibrate trust
4. treat workflow metadata as provider-specific unless the specification says otherwise

## Canonical Naming Guidance

When a server uses canonical provenance categories or values, it SHOULD follow [Canonical Names](./canonical-names.md).

In particular:

- semantic provenance values should use canonical `reasoning_mode` and `identification_status`
- capability-card naming should use canonical conformance and Pearl-alignment terms where applicable
- assumption names should use canonical names when they fit
