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

In `v0.3.0`, the capability card also carries more of the burden for telling clients whether a server is:

- narrative
- hybrid
- observational
- interventional

and what that actually means for trust and interpretation.

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

## Draft Direction For L0 And L0.5 Cards

For `v0.3.0` draft review, the intended card direction for L0 and L0.5 includes:

- a stable `conformance_level`
- a human-readable `conformance_name`
- a machine-readable indicator of Pearl alignment or non-alignment
- enough provenance to understand where structure and parameterization came from
- enough caveat disclosure to prevent narrative or hybrid outputs from being mistaken for stronger causal claims

The exact field names for all of those disclosure details remain draft-era and may still tighten before release, but the categories themselves are part of the intended contract direction.

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

The repository still retains richer draft-era or compatibility-oriented fields such as:

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

For `v0.3.0` draft review, the following disclosure categories are especially important for L0 and L0.5 systems:

- structure origin
- parameter or weight origin
- methodology class
- reproducibility status
- limitation and caveat summary
- Pearl alignment or non-alignment

The exact field names may continue to evolve in draft review, but the disclosure burden itself is part of the intended `v0.3.0` direction.

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

Servers MUST NOT imply that draft-era or compatibility-only artifacts are part of the active CAP `v0.2.2` contract unless the specification pages restate them normatively.

Implementation-specific provenance such as snapshot IDs, workflow handles, prompt lineage, or runtime selection metadata MAY be disclosed when useful, but they are not automatically required CAP-core fields for every server in a conformance tier.
