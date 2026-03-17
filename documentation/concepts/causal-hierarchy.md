# Causal Hierarchy

CAP distinguishes among different kinds of causal questions instead of treating every result as the same kind of claim.

That distinction matters because an answer can sound causal while still belonging to a weaker semantic tier.

## The Three Levels

- observational: what is associated with what, or what is expected under ordinary conditions
- interventional: what happens if we perform an intervention
- counterfactual: what would have happened differently for a specific case under a different action

## Why CAP Cares

These question types are related, but they are not interchangeable.

An observational answer is not automatically an interventional answer. An interventional answer is not automatically a counterfactual answer.

That is why CAP does not want all causal-looking outputs to collapse into one generic result type.

## A Simple Intuition

These three prompts may sound similar, but they are asking different things:

- observational: "What tends to happen when price is lower?"
- interventional: "What happens if we set price lower?"
- counterfactual: "For this specific case, what would have happened if price had been lower instead?"

CAP treats those as different semantic categories on purpose.

## How This Shows Up In CAP

- Level 1 covers observational access
- Level 2 adds interventional access
- Level 3 counterfactual remains reserved in `v0.2.x`

For interventional responses, CAP also requires:

- `reasoning_mode`
- `identification_status`
- `assumptions`

Those fields help the client understand what kind of claim was actually produced.

## Practical Reading Rule

When you see a CAP result, do not ask only:

- what is the estimate

Also ask:

- what kind of causal question was answered
- what kind of reasoning produced the answer
- what assumptions make the answer interpretable

## Read Next

- [Conformance Levels](conformance-levels.md)
- [Reasoning Modes](reasoning-modes.md)
