# Capability Card

## Requirement

Every CAP server MUST publish a machine-readable capability card at `/.well-known/cap.json`.

If a server also exposes `meta.capabilities`, that verb MUST return capability information that is semantically equivalent to the well-known document.

## Purpose

The capability card exists so a client can determine, before invocation:

- claimed conformance level
- supported verbs
- assumptions
- reasoning modes that may appear in responses
- graph scope or availability
- authentication requirements

## Minimum Required Disclosure

A CAP server MUST disclose enough information for a client to determine:

- claimed conformance level
- supported verbs
- assumptions
- reasoning modes that may appear in responses
- graph scope or availability
- authentication requirements

At minimum, this includes these field groups:

- `conformance_level`
- `supported_verbs`
- `assumptions`
- `reasoning_modes_supported`
- `graph`
- `authentication`

## Canonical Naming Guidance

Capability-card fields that expose semantic or provenance-oriented names SHOULD use the shared CAP naming catalog where applicable.

In practice:

- `reasoning_modes_supported` SHOULD use the canonical `reasoning_mode` strings from [`schema/shared/enums.json`](../schema/shared/enums.json)
- `assumptions` SHOULD use canonical assumption names where they fit, and namespaced custom strings where they do not
- `causal_engine.algorithm` MAY stay open-world, but servers SHOULD prefer the repository's recommended spellings for common algorithms such as `PCMCI`, `PC`, `GES`, `FCI`, `NOTEARS`, `LiNGAM`, and `VAR-Granger`

## Additional Draft-Era Disclosure

The long-form draft also defines richer fields such as:

- `causal_engine`
- `structural_mechanisms`
- `detailed_capabilities`
- `uncertainty_methods_supported`
- `access_tiers`
- `disclosure_policy`
- `bindings`
- `extensions`

These remain part of CAP protocol direction even when a current implementation does not yet expose all of them publicly.

## Authentication And Access Disclosure

A CAP server MUST declare its authentication model in the capability card.

Clients MUST be able to determine the basic invocation requirement before making protected requests.

When a server uses access tiers or progressive disclosure, it SHOULD describe that policy in a machine-discoverable way where possible.

## Disclosure Integrity

The capability card MUST distinguish between:

- what a server can compute
- what a server is willing to disclose at a given access level

A server MUST NOT overstate causal semantics, reasoning modes, or verb support because richer detail is hidden, summarized, or redacted.

## Draft Gap Rule

Current adapters may trail richer draft-era disclosure.

That gap does not shrink CAP core by itself. It means implementations should either expose the richer fields or label their narrower public surface explicitly.
