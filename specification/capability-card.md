# Capability Card

## Requirement

Every CAP server MUST publish a machine-readable capability card at `/.well-known/cap.json`.

If the server also exposes `meta.capabilities`, that verb MUST return capability information that is semantically equivalent to the well-known document.

The machine-readable contract for this object lives in `schema/capability-card/v0.2.2.json`.

## Purpose

The capability card exists so a client can determine, before invocation:

- which CAP version the server implements
- which conformance level it claims
- which verbs it supports
- which assumptions the server depends on
- which reasoning modes may appear in responses
- what graph coverage, authentication, and disclosure constraints apply

Without this object, CAP loses one of its main interoperability guarantees and collapses toward a generic RPC surface.

## Required Field Groups

The v0.2.2 protocol draft requires these top-level groups:

- identity: `name`, `description`, `version`, `cap_spec_version`, `provider`, `endpoint`
- conformance: `conformance_level`, `supported_verbs`
- engine disclosure: `causal_engine`
- detailed capability disclosure: `detailed_capabilities`
- semantic disclosure: `assumptions`, `reasoning_modes_supported`
- graph metadata: `graph`
- authentication: `authentication`

The draft also defines these optional but important groups:

- `uncertainty_methods_supported`
- `access_tiers`
- `disclosure_policy`
- `bindings`
- `extensions`

## Engine Disclosure

`causal_engine` is part of the normative contract, not optional narrative.

It MUST disclose:

- `family`
- `algorithm`
- `discovery_method`
- `supports_time_lag`
- `supports_latent_variables`
- `supports_nonlinear`
- `supports_instantaneous`

If a server claims `scm_simulation` in `reasoning_modes_supported`, then `causal_engine.structural_mechanisms` becomes conditionally required.

In that case:

- `structural_mechanisms.available` MUST be `true`
- `structural_mechanisms.mechanism_override_supported` MUST be `true`

Claiming `scm_simulation` without that disclosure is a conformance violation.

## Verb And Level Disclosure

`supported_verbs.core` is the conformance-relevant verb surface.

Minimum rules:

- Level 1 cards MUST disclose support for `meta.capabilities`, `graph.neighbors`, and `effect.query`
- Level 2 cards MUST additionally disclose `graph.paths`
- convenience verbs MAY be listed in `supported_verbs.convenience`, but they do not redefine CAP core

## Semantic Disclosure

The capability card MUST disclose:

- server-level `assumptions`
- `reasoning_modes_supported`

These fields are central to CAP's semantic honesty model. A server MUST NOT advertise:

- a conformance level it does not implement
- reasoning modes it never returns
- extension verbs as CAP core

## Access And Disclosure Controls

`authentication` is required because a client must know how to invoke the server safely.

`access_tiers` and `disclosure_policy` are how a server explains progressive disclosure. When present, they SHOULD let a client infer:

- which verbs are available at each tier
- which response detail levels are available
- whether weights or paths may be hidden or obfuscated

## Current Draft-Implementation Gap

The long-form v0.2.2 draft defines a richer capability card than the current public `cap-reference` adapter currently emits.

Notable draft fields that the current adapter does not yet expose include:

- `causal_engine`
- `structural_mechanisms`
- `detailed_capabilities`
- `uncertainty_methods_supported`
- `bindings`

The repo rule is:

- the normative protocol definition keeps the richer draft boundary
- the machine schema records the current narrower adapter explicitly rather than silently collapsing the protocol to it
