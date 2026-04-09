# Capability Card

## Requirement

Every CAP server MUST publish a machine-readable capability card at `/.well-known/cap.json`.

If a server also exposes `meta.capabilities`, that verb MUST return capability information that is semantically equivalent to the well-known document.

The capability card is a truthful machine-readable disclosure surface for the server's mounted public CAP behavior.

The normative source of truth for CAP requirements remains the specification pages in this directory.

Server-level disclosure should be interpreted together with [Provenance](./provenance.md), which distinguishes capability disclosure from response-level provenance and provider workflow metadata.

## Purpose

The capability card exists so a client can determine, before invocation:

- claimed conformance level
- supported verbs
- assumptions
- reasoning modes that may appear in responses
- graph scope or availability
- authentication requirements

Method-level invocation metadata MAY be discovered separately through `meta.methods`.

The capability card is the high-signal, stable disclosure surface.

It SHOULD summarize server-level truths that remain useful across requests.

Its job is to summarize the mounted surface coherently, not to repeat request-scoped runtime detail that already lives more naturally in method metadata or per-response provenance.

In `v0.3.0`, the capability card also carries more of the burden for telling clients whether a server is:

- narrative
- hybrid
- observational
- interventional

and what that actually means for trust and interpretation.

## Discovery Layering

CAP discovery is easiest to reason about when each layer has a distinct role:

- capability card: server summary
- extension namespace block: extension grouping
- `meta.methods`: per-verb invocation detail

In a coherent implementation:

- `supported_verbs` is the top-level summary of core and convenience surface
- `extensions` groups extension verbs by namespace
- `meta.methods` carries argument and result-field detail for the mounted verbs

This keeps the capability card compact while still letting a client discover the full mounted surface.

## Minimum Required Disclosure

A CAP server MUST disclose enough information for a client to determine:

- claimed conformance level
- supported verbs
- assumptions
- reasoning modes that may appear in responses
- graph scope or availability
- authentication requirements

At minimum, this includes these field groups:

- `endpoint`
- `conformance_level`
- `conformance_name`
- `supported_verbs`
- `assumptions`
- `reasoning_modes_supported`
- `graph`
- `authentication`

For lower-confidence tiers, the card SHOULD also disclose the provenance of:

- structure
- parameters, weights, or priors
- reproducibility characteristics
- key limitations or caveats

## Additional Disclosure For L0 And L0.5 Cards

For L0 and L0.5 systems, the card SHOULD also disclose:

- a stable `conformance_level`
- a human-readable `conformance_name`
- a machine-readable indicator of Pearl alignment or non-alignment
- enough provenance to understand where structure and parameterization came from
- enough caveat disclosure to prevent narrative or hybrid outputs from being mistaken for stronger causal claims

## Endpoint Disclosure

The capability card MUST disclose the invocation endpoint for the current public binding.

For the current HTTP binding, `endpoint` SHOULD be the exact URL clients post CAP envelopes to, not just a higher-level API prefix or site root.

In the current HTTP binding, the single-entry invocation path convention ends in `/cap`.

The current reference binding mounts that entrypoint at `POST /cap`, but deployments MAY expose an equivalent entrypoint under a service prefix such as `POST /api/v1/cap`.

Clients SHOULD treat the capability card `endpoint` field as the canonical invocation URL for that server.

## Canonical Naming Guidance

Capability-card fields that expose semantic or provenance-oriented names SHOULD use the shared CAP naming catalog where applicable.

In practice:

- `conformance_name` values and `pearl_alignment` values SHOULD follow [Canonical Names](./canonical-names.md)
- `reasoning_modes_supported` SHOULD use the canonical `reasoning_mode` strings from [`schema/shared/enums.json`](../schema/shared/enums.json)
- `assumptions` SHOULD use canonical `assumption_name` values where they fit, and namespaced custom strings where they do not
- `causal_engine.algorithm` MAY stay open-world, but servers SHOULD prefer the repository's recommended spellings for common algorithms such as `PCMCI`, `PC`, `GES`, `FCI`, `NOTEARS`, `LiNGAM`, and `VAR-Granger`

## Additional Non-Core Disclosure

Servers MAY disclose richer optional fields such as:

- `causal_engine`
- `structural_mechanisms`
- `detailed_capabilities`
- `uncertainty_methods_supported`
- `access_tiers`
- `disclosure_policy`
- `bindings`
- `extensions`

Servers MAY disclose these richer fields when they can do so honestly.

When a server supports different `options.response_detail` tiers or access-level response shaping, it SHOULD disclose the practical defaults and any material differences in capability disclosure rather than forcing clients to infer them from examples alone.

When a server uses multiple extension namespaces, such as separate stateless helper extensions and stateful workflow extensions, the capability card SHOULD distinguish those namespaces explicitly rather than presenting them as one undifferentiated extension blob.

Extension namespace entries work best as summary disclosure:

- namespace-scoped verb inventory
- optional namespace documentation link
- short notes that help a client understand what kind of extension surface is mounted

Field-level request and result descriptions belong in `meta.methods`.

For L0 and L0.5 systems, the following disclosure categories are especially important:

- structure origin
- parameter or weight origin
- methodology class
- reproducibility status
- limitation and caveat summary
- Pearl alignment or non-alignment

## Authentication And Access Disclosure

A CAP server MUST declare its authentication model in the capability card.

Clients MUST be able to determine the basic invocation requirement before making protected requests.

When a server uses access tiers or progressive disclosure, it SHOULD describe that policy in a machine-discoverable way where possible.

## Disclosure Integrity

The capability card MUST distinguish between:

- what a server can compute
- what a server is willing to disclose at a given access level

A server MUST NOT overstate causal semantics, reasoning modes, or verb support because richer detail is hidden, summarized, or redacted.

For L0 and L0.5 servers in particular, the capability card MUST NOT hide weaker epistemic status behind stronger verb names.

## Mounted Surface Rule

The capability card MUST describe the server's mounted public surface truthfully.

Convenience verbs and extension verbs MAY appear in discovery metadata, but they MUST be identified as non-core surfaces.

Convenience verbs SHOULD be reserved for ergonomic wrappers over already-standardized CAP semantics. Verbs that depend on provider-owned handles, workflow state, or server-selected graph views SHOULD be disclosed as extensions instead.

When `extensions` is present, it is the natural home for extension namespace grouping and extension verb inventory.

Servers MUST NOT imply that compatibility-only artifacts are part of CAP core unless the specification pages restate them normatively.

Implementation-specific provenance such as snapshot IDs, workflow handles, prompt lineage, or runtime selection metadata MAY be disclosed when useful, but they are not automatically required CAP-core fields for every server in a conformance tier.
