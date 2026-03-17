# Protocol Evolution Notes

This page explains a few deliberate shape changes in the `v0.2.2` CAP draft. The short version is that the protocol became smaller in its core, clearer about what belongs outside that core, and more disciplined about which future levels are active versus only reserved.

## Why The Core Became Smaller

Earlier internal framing carried a longer list of primitives and helper surfaces. That was useful for exploration, but it blurred an important distinction: not every useful operation belongs in the minimum interoperable contract.

The `v0.2.2` direction keeps the CAP core small on purpose.

The main reasons are:

- smaller cores are easier for independent implementations to adopt honestly
- conformance is more credible when the required surface is narrow and testable
- clients benefit more from a few dependable verbs than from a long list of unevenly implemented ones
- implementation-specific ergonomics change faster than protocol-level semantics

This is why CAP centers its core around a small set of verbs, the capability card, and semantic disclosure rules instead of trying to standardize every causal workflow at once.

## Why That Is Better For Interoperability

Interoperability is not improved by adding more names to the spec if those names do not carry stable shared behavior.

A small core gives clients something concrete to rely on:

- which verbs should exist
- what each level means
- when semantic disclosure is required

Everything beyond that can still exist, but it should not quietly redefine the meaning of CAP conformance.

That is also why CAP distinguishes:

- `core` verbs that define conformance
- `convenience` verbs that improve ergonomics
- `extensions` that remain implementation-specific

## Why Discovery Surface Was Moved Out Of Core

CAP still requires capability disclosure through the capability card. What moved out of core was the idea that product-specific discovery surfaces should be standardized as CAP itself.

That boundary matters for two reasons.

First, discovery UX varies by transport and product environment. A native HTTP deployment, an MCP binding, and an agent platform integration may all want different discovery affordances.

Second, those affordances evolve faster than CAP's causal semantics. If CAP core absorbs them too early, the protocol becomes cluttered with workflow choices that are not actually required for causal interoperability.

So the current direction is:

- keep the machine-readable capability card in CAP core
- keep `meta.capabilities` in CAP core because it is the same disclosure through the CAP envelope
- keep richer or vendor-specific discovery surfaces outside CAP core

This preserves the part clients truly need while avoiding protocol lock-in around product-specific discovery patterns.

## Why Level 3 Is Still Reserved

Level 3 remains reserved in `v0.2.x` because CAP wants to mark the direction toward counterfactual semantics without pretending that the conformance contract is already finished.

Counterfactual support has a higher semantic bar than observation or intervention. It needs clearer agreement on:

- request and response shapes
- disclosure rules
- schema-level contracts
- conformance tests

Reserving Level 3 keeps that future space visible while preventing premature claims of support.

Under the current model:

- servers can disclose technical readiness in richer capability metadata
- servers cannot declare active Level 3 conformance yet

That is stricter than simply omitting Level 3 altogether, and that is intentional. It gives the ecosystem a stable place to grow into without letting "counterfactual" turn into another vague marketing claim.

## The General Pattern Behind These Changes

Across these edits, the protocol moved toward the same design rule:

- standardize what must be shared
- disclose what differs
- avoid freezing product-specific choices into CAP core

That is why the capability card stays important, the core verb surface stays tight, and future levels stay explicitly reserved until their semantics are ready.
