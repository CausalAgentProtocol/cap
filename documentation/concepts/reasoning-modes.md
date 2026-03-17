# Reasoning Modes

`reasoning_mode` tells the client what kind of causal computation a result represents.

This is one of CAP's key honesty mechanisms. A response should not only say what it predicts or estimates. It should also say what kind of claim it is making.

## Why This Matters

Two servers may both answer an interventional-looking question and still mean very different things.

One may return:

- a formally identified causal effect

Another may return:

- a graph propagation estimate

Both can be useful. They are not the same claim, and clients should not compare them as if they were.

## Canonical `v0.2.2` Values

The current canonical set includes:

- `identified_causal_effect`
- `scm_simulation`
- `graph_propagation`
- `reduced_form_estimate`
- `conditional_forecast`
- `heuristic`

## How To Read Them

- `identified_causal_effect` means the server is claiming formal identification under disclosed assumptions
- `scm_simulation` means the server is executing structural mechanisms under intervention semantics
- `graph_propagation` means the server is propagating effects over graph structure rather than claiming formal identification
- `reduced_form_estimate` means the result is effect-shaped but backed by a lighter reduced-form strategy rather than full identification or mechanism execution
- `conditional_forecast` means the result is predictive or conditional, not interventional in the Pearlian sense
- `heuristic` means the server is returning a useful approximation that should not be read as a stronger semantic claim

## Friendly Example

Consider the question:

> What happens to conversions if ad spend increases by 10 percent?

These answers can all be numerically similar while meaning different things:

- `identified_causal_effect`: the server claims the effect is formally identified under stated assumptions
- `scm_simulation`: the server is simulating the intervention through structural mechanisms
- `graph_propagation`: the server is tracing influence through graph structure
- `conditional_forecast`: the server is predicting what usually follows similar conditions, not claiming a true intervention effect

The estimate alone does not tell you which of those happened. `reasoning_mode` does.

## Important Rule

Servers should only emit reasoning modes they can defend technically.

In particular:

- a server should not label a result `scm_simulation` unless it has the required structural mechanism support
- a client should not infer strong intervention semantics from a vague result label or product description

## Current Implementation Note

The current public `cap-reference` adapter still uses some narrower implementation-specific labels in places. The normative protocol direction is the canonical `v0.2.2` enum set documented in the spec and schema.

## Read Next

- [Causal Semantics Spec](../../specification/causal-semantics.md)
- [Quickstart for Clients](../quickstart-client.md)
