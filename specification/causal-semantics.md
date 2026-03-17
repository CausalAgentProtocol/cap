# Causal Semantics

## Purpose

CAP standardizes semantic disclosure, not causal science itself.

Every server MAY implement different algorithms and make different scientific tradeoffs, but CAP requires those differences to be disclosed in a machine-readable way.

The normative semantic fields are:

- `reasoning_mode`
- `identification_status`
- `assumptions`

## Reasoning Mode

Every CAP response to an `intervene.*` or `counterfact.*` verb MUST include `reasoning_mode`.

Canonical v0.2.2 values are:

- `identified_causal_effect`
- `scm_simulation`
- `graph_propagation`
- `reduced_form_estimate`
- `conditional_forecast`
- `heuristic`

Servers MUST NOT emit `identified_causal_effect` or `scm_simulation` unless the engine genuinely performs those computations.

Additional binding rule:

- if a server advertises `scm_simulation`, its capability card MUST disclose `causal_engine.structural_mechanisms`
- that object MUST show `available: true`
- that object MUST show `mechanism_override_supported: true`

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

The machine-readable enum catalog lives in `schema/shared/enums.json`.

## Science Boundary

CAP does not standardize which engine is scientifically correct.

It standardizes how a server discloses:

- what kind of claim it is making
- whether that claim is formally identified
- which assumptions the claim rests on

That boundary is the protocol's semantic honesty layer.

## Current Adapter Note

The current public `cap-reference` adapter still emits several adapter-specific reasoning mode strings such as `observational_prediction` and `structural_semantics`.

Those strings are useful for documenting the current implementation surface, but they are narrower implementation behavior, not the canonical v0.2.2 semantic enum set. The schema layer records this mismatch explicitly instead of normalizing it away.
