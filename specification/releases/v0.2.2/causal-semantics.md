# Causal Semantics

## Purpose

CAP standardizes semantic disclosure, not causal science itself.

Every server MAY implement different algorithms and make different scientific tradeoffs, but CAP requires those differences to be disclosed in a machine-readable way.

The normative semantic fields are:

- `reasoning_mode`
- `identification_status`
- `assumptions`

The machine-readable enum catalog for this repository lives in [`schema/shared/enums.json`](../schema/shared/enums.json). It is aligned to the long-form draft where possible and extended where earlier public CAP implementations have already stabilized names in code.

## Reasoning Mode

Every CAP response to an `intervene.*` or `counterfact.*` verb MUST disclose reasoning-mode semantics in a machine-readable way.

For a single causal claim, that disclosure will usually be a singular `reasoning_mode`.

For a multi-claim result, a server MAY use:

- a shared result-level `default_reasoning_mode`
- per-claim `reasoning_mode` override

What CAP cares about is claim-level semantic honesty, not one mandatory field layout for every multi-claim payload.

The current repository canonical reasoning-mode catalog is:

- `identified_causal_effect`
- `scm_simulation`
- `graph_propagation`
- `reduced_form_estimate`
- `conditional_forecast`
- `heuristic`
- `structural_semantics`
- `observational_prediction`
- `validation_gate`

Interpretation guidance:

- `identified_causal_effect` and `scm_simulation` are strong causal-interventional labels
- `graph_propagation`, `reduced_form_estimate`, and `heuristic` are weaker or fallback causal labels
- `conditional_forecast` and `observational_prediction` cover observational prediction surfaces
- `structural_semantics` covers graph-structure or topology disclosure without claiming identified intervention semantics
- `validation_gate` covers precondition or structural-validity checks that still need explicit semantic disclosure

Servers MUST NOT emit `identified_causal_effect` or `scm_simulation` unless the engine genuinely performs those computations.

Additional binding rule:

- if a server advertises `scm_simulation`, its capability card MUST disclose `causal_engine.structural_mechanisms`
- that object MUST show `available: true`
- any public mechanism-override support MUST be disclosed truthfully and MUST NOT be implied by `scm_simulation` alone

## Identification Status

Every CAP response to an `intervene.*` or `counterfact.*` verb MUST include `identification_status`.

Canonical v0.2.2 values are:

- `identified`
- `partially_identified`
- `not_formally_identified`
- `not_applicable`

This field tells the client whether a claim is formally identified, only bounded, merely estimated or simulated, or outside the interventional or counterfactual scope.

## Assumptions Disclosure

Every capability card MUST include a server-level `assumptions` array.

Responses MAY include a response-level `assumptions` array. When present, it MUST be interpreted as the complete effective assumption set for that response. It does not merge with the card-level array.

Canonical assumption values in the v0.2.2 draft include:

- `causal_sufficiency`
- `faithfulness`
- `acyclicity`
- `stationarity`
- `linearity`
- `no_instantaneous_effects`
- `granger_predictive_causality_only`
- `no_latent_confounders_addressed`
- `homogeneity`
- `positivity`
- `consistency`
- `no_interference`
- `mechanism_invariance_under_intervention`

That base catalog remains the preferred unprefixed assumption vocabulary.

When a server needs narrower implementation-specific assumptions, it MAY add custom strings. Those custom strings SHOULD be namespaced to avoid colliding with protocol-level canonical names.

## Provenance Naming

`provenance.mechanism_family_used` SHOULD use the current repository canonical names when applicable:

- `linear`
- `gbdt`
- `neural`
- `gam`
- `none`

`provenance.algorithm` and `causal_engine.algorithm` remain open-world strings. CAP currently standardizes recommended spellings, not a closed enum, for common algorithms:

- `PCMCI`
- `PC`
- `GES`
- `FCI`
- `NOTEARS`
- `LiNGAM`
- `VAR-Granger`

If a server emits a nonstandard algorithm label, it SHOULD still prefer a stable, human-recognizable spelling and avoid overloading an existing canonical name.

Current public implementations may also disclose mechanism families such as `linear_scm` in capability cards or provenance when that is the stable implementation-facing spelling. Repository schemas and examples should preserve that disclosure instead of forcing a looser label.

## Science Boundary

CAP does not standardize which engine is scientifically correct.

It standardizes how a server discloses:

- what kind of claim it is making
- whether that claim is formally identified
- which assumptions the claim rests on

That boundary is the protocol's semantic honesty layer.

## Granularity Note

`reasoning_mode` is conceptually claim-scoped even when a response also exposes shared defaults at the result level.

Some richer CAP payloads may eventually use a shared `default_reasoning_mode` plus per-claim override.

One earlier public adapter contract was narrower: core `intervene.do` carried one treatment and one selected `outcome_node`, and exposed a singular result-level `reasoning_mode` for that one interventional claim.

Structural verbs need the same semantic honesty discipline. In particular:

- Markov blanket membership SHOULD use `reasoning_mode = "structural_semantics"`
- Markov blanket membership SHOULD use `identification_status = "not_applicable"`
- servers SHOULD avoid framing Markov blanket membership as an identified causal effect unless they are actually returning a different effect-bearing relation

## Historical Adapter Note

The earlier public `cap-reference` implementation already used several of the extended canonical names above, including `observational_prediction`, `structural_semantics`, and `validation_gate`.

That means repository prose, schemas, examples, and conformance notes should treat those strings as part of the active CAP naming catalog rather than as ad hoc adapter-only labels.
