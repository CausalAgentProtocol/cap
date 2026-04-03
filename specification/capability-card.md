# Capability Card

## Requirement

Every CAP server MUST publish a machine-readable capability card at `/.well-known/cap.json`.

If a server also exposes `meta.capabilities`, that verb MUST return capability information that is semantically equivalent to the well-known document.

In CAP `v0.2.2`, the capability card is normative for the active public surface actually mounted by the server.

## Purpose

The capability card exists so a client can determine, before invocation:

- claimed conformance level
- supported verbs
- assumptions
- reasoning modes that may appear in responses
- graph scope or availability
- authentication requirements

Method-level invocation metadata MAY be discovered separately through `meta.methods`.

The active CAP core surface in `v0.2.2` is `meta.capabilities`, `meta.methods`, `observe.predict`, `intervene.do`, `graph.neighbors`, `graph.markov_blanket`, and `graph.paths`.

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
- `supported_verbs`
- `assumptions`
- `reasoning_modes_supported`
- `graph`
- `authentication`

## Endpoint Disclosure

The capability card MUST disclose the invocation endpoint for the current public binding.

For the current HTTP binding, `endpoint` SHOULD be the exact URL clients post CAP envelopes to, not just a higher-level API prefix or site root.

In the current HTTP binding, the single-entry invocation path convention ends in `/cap`.

The current reference binding mounts that entrypoint at `POST /cap`, but deployments MAY expose an equivalent entrypoint under a service prefix such as `POST /api/v1/cap`.

Clients SHOULD treat the capability card `endpoint` field as the canonical invocation URL for that server.

## Canonical Naming Guidance

Capability-card fields that expose semantic or provenance-oriented names SHOULD use the shared CAP naming catalog where applicable.

In practice:

- `reasoning_modes_supported` SHOULD use the canonical `reasoning_mode` strings from [`schema/shared/enums.json`](../schema/shared/enums.json)
- `assumptions` SHOULD use canonical assumption names where they fit, and namespaced custom strings where they do not
- `causal_engine.algorithm` MAY stay open-world, but servers SHOULD prefer the repository's recommended spellings for common algorithms such as `PCMCI`, `PC`, `GES`, `FCI`, `NOTEARS`, `LiNGAM`, and `VAR-Granger`

## Additional Non-Core Disclosure

Compatibility artifacts retained in the schema layer are non-normative unless this specification restates them explicitly.

The repository still retains richer draft-era or compatibility-oriented fields such as:

- `causal_engine`
- `structural_mechanisms`
- `detailed_capabilities`
- `uncertainty_methods_supported`
- `access_tiers`
- `disclosure_policy`
- `bindings`
- `extensions`

Servers MAY disclose these richer fields when they can do so honestly, but they are not required for CAP `v0.2.2` conformance unless another section of this specification says otherwise.

## Authentication And Access Disclosure

A CAP server MUST declare its authentication model in the capability card.

Clients MUST be able to determine the basic invocation requirement before making protected requests.

When a server uses access tiers or progressive disclosure, it SHOULD describe that policy in a machine-discoverable way where possible.

## Disclosure Integrity

The capability card MUST distinguish between:

- what a server can compute
- what a server is willing to disclose at a given access level

A server MUST NOT overstate causal semantics, reasoning modes, or verb support because richer detail is hidden, summarized, or redacted.

## Mounted Surface Rule

The capability card MUST describe the server's mounted public surface truthfully.

Convenience verbs and extension verbs MAY appear in discovery metadata, but they MUST be identified as non-core surfaces.

Servers MUST NOT imply that draft-era or compatibility-only artifacts are part of the active CAP `v0.2.2` contract unless this specification restates them normatively.
