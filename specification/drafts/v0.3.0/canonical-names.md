# Canonical Names

## Purpose

This page defines the canonical semantic names used by the CAP `v0.3.0` draft.

The goal is to ensure that when servers use shared CAP names, clients can interpret them consistently.

Canonical names are protocol terms, not cosmetic labels.

For each canonical name, this page defines:

- what it means
- when it should be used
- what it does not imply by itself

## Registry Families

The draft canonical-name registry currently covers these vocabulary families:

- `conformance_level`
- `conformance_name`
- `pearl_alignment`
- `reasoning_mode`
- `identification_status`
- `assumption_name`
- `provenance_category`

## `conformance_level`

### `0`

`0` means the server conforms at the Narrative tier.

Use it when the server produces causal-form claims without statistical validation.

It does not imply observational or interventional validity.

### `0.5`

`0.5` means the server conforms at the Hybrid tier.

Use it when the server combines a real mathematical inference layer with materially weaker structure, parameter, or prior provenance.

It does not imply Level 1 observational validity.

### `1`

`1` means the server conforms at the Observe tier.

Use it when the server supports statistically validated observational semantics as defined by this draft.

It does not imply interventional support.

### `2`

`2` means the server conforms at the Intervene tier.

Use it when the server supports the Level 1 surface plus interventional claims.

It does not imply counterfactual support.

### `3`

`3` is reserved for the Counterfact tier in this draft.

Servers MUST NOT declare `conformance_level: 3` until the draft activates Level 3 normatively.

## `conformance_name`

### `Narrative`

Human-readable name for Level 0.

### `Hybrid`

Human-readable name for Level 0.5.

### `Observe`

Human-readable name for Level 1.

### `Intervene`

Human-readable name for Level 2.

### `Counterfact`

Human-readable name for Level 3.

## `pearl_alignment`

### `below_pearl`

Use when a tier or claim class sits outside and below Pearl's ladder.

### `partial_rung_1`

Use when a tier or claim class has some observational resemblance but lacks full rung-1 statistical grounding.

### `rung_1`

Use when the server or claim aligns to observational association semantics.

### `rung_2`

Use when the server or claim aligns to intervention semantics.

### `rung_3`

Use when the server or claim aligns to counterfactual semantics.

## `reasoning_mode`

### `identified_causal_effect`

Use when the claim is presented as a formally identified causal effect.

Do not use it for heuristic propagation, narrative explanation, or merely structural graph traversal.

### `scm_simulation`

Use when the claim comes from simulation over executable structural mechanisms.

It does not by itself guarantee counterfactual validity.

### `graph_propagation`

Use when a result is produced by propagating influence, belief, or effect over a graph without claiming full formal identification.

### `reduced_form_estimate`

Use when the server discloses a weaker reduced-form or proxy estimate rather than a formally identified causal effect.

### `conditional_forecast`

Use for conditional forecasting behavior that remains observational rather than interventional.

### `heuristic`

Use when the result depends primarily on heuristic logic rather than a formally justified causal estimator.

### `structural_semantics`

Use for structural graph relations such as neighborhood, blanket membership, or path semantics when the server is not claiming an identified effect.

### `observational_prediction`

Use for observational predictions that are not interventional claims.

### `validation_gate`

Use for outputs that reflect validation or gating logic rather than a direct causal estimate.

### `narrative_claim`

Use for causal-form claims expressed narratively without statistical validation.

### `hybrid_inference`

Use for mathematically structured inference over partially unvalidated structure, parameters, or priors.

It does not imply Level 1 observational validity.

## `identification_status`

### `identified`

Use when the claim is formally identified under the server's stated assumptions.

### `partially_identified`

Use when the claim is only partially identified or bounded.

### `not_formally_identified`

Use when the claim is produced without formal identification.

### `not_applicable`

Use when identification is not the right framing for the output, such as purely structural graph semantics or narrative claims.

## `assumption_name`

Servers MAY use namespaced custom assumptions when they need narrower terminology.

### `causal_sufficiency`

Use when the result assumes no omitted common causes relevant to the claim.

### `faithfulness`

Use when the result assumes observed independences reflect the graph structure faithfully.

### `acyclicity`

Use when the result assumes an acyclic causal structure.

### `stationarity`

Use when the result assumes stable temporal or statistical relationships over time.

### `linearity`

Use when the method assumes linear structural or predictive relationships.

### `no_instantaneous_effects`

Use when the method assumes no same-timestamp causal effects.

### `granger_predictive_causality_only`

Use when the result supports predictive Granger-style semantics only, not stronger causal claims.

### `no_latent_confounders_addressed`

Use when the method does not address latent confounding.

### `homogeneity`

Use when the method assumes homogeneous effects or behavior across units or contexts.

### `positivity`

Use when identification depends on positive support for the relevant treatment or exposure configurations.

### `consistency`

Use when the method assumes observed outcomes correspond consistently to the stated intervention or treatment condition.

### `no_interference`

Use when the method assumes one unit's treatment does not affect another unit's outcome.

### `mechanism_invariance_under_intervention`

Use when the method assumes structural mechanisms remain invariant under intervention except at the intervened node.

## `provenance_category`

These are category names for provenance and disclosure. They are not all mandatory fields.

### `structure_origin`

Describes where graph structure came from.

### `parameter_origin`

Describes where parameters, weights, or priors came from.

### `methodology_class`

Summarizes the broad method family used by the server or claim.

### `reproducibility_status`

Describes whether repeated execution under the same inputs should yield the same result.

### `limitation_summary`

Summarizes the key limits a client should understand before trusting the output.

### `caveat_summary`

Summarizes specific interpretation caveats attached to a result or capability.

### `graph_ref`

Names the graph or graph view used for a request or response when a server chooses to disclose one.

This is an implementation-sensitive provenance term, not a universal requirement.

## Registry Discipline

Servers SHOULD prefer canonical names when the canonical meaning fits.

Servers MUST NOT reuse a canonical CAP name for a different meaning.

When a server needs a more specific name:

- it MAY add implementation-specific names
- those names SHOULD be namespaced
- those names MUST NOT silently override a canonical CAP term
