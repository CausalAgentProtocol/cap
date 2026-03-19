# What Is Causality?

If you are new to CAP, this is the best place to start.

Causality is not only about what moved together. It is about what would happen if something were changed.

## Correlation Versus Causation

Suppose ice cream sales rise on the same days that drowning incidents rise.

Those variables are correlated. They move together.

But it would be a mistake to conclude that buying ice cream causes drowning.

A more plausible explanation is that hot weather affects both:

- hot days increase ice cream purchases
- hot days also increase swimming activity

That is the core problem causal reasoning tries to handle. When two things move together, you still need to ask why, and whether changing one of them would really change the other.

## The Question Causality Tries To Answer

A causal question usually has this shape:

- if I change `X`, what happens to `Y`?

That is different from:

- when `X` changes in the data, what tends to happen near `Y`?

The first is about intervention.
The second is about association.

Many software systems are good at the second question. Far fewer can support the first honestly.

## Three Common Kinds Of Causal Questions

It helps to separate three question types.

### 1. Observational Questions

These ask what patterns appear in observed data.

Examples:

- which nodes are connected to this node?
- which variables tend to move together?
- which predictors are associated with the target?

This can still be useful. It is often the right place to start. But it is not yet a claim about what would happen under intervention.

### 2. Interventional Questions

These ask what would happen if something were deliberately changed.

Examples:

- if we increase price, what happens to demand?
- if we suppress node `X`, what happens downstream?
- if policy `A` is applied, how does outcome `Y` change?

These are stronger claims, which means they need stronger assumptions and clearer disclosure.

### 3. Counterfactual Questions

These ask what would have happened differently in a specific case.

Examples:

- given what happened to this customer, what would have happened if treatment had not been applied?
- for this market move, what would the outcome have been under a different intervention?

These are usually the strongest and most assumption-sensitive claims, and they are also the easiest to overstate.

## Why Assumptions Matter

Causal answers do not come from data alone.

They also depend on assumptions such as:

- whether important confounders are missing
- whether the graph structure is credible
- whether the intervention is actually represented by the model
- whether the target effect is identifiable from the available information
- whether the current case is inside the model's valid scope

That is why two systems can both return something that looks like an answer to "what causes Y" while meaning very different things.

One system may be returning:

- a graph neighborhood
- a propagation score
- a forecast
- an identified causal effect
- a simulation from a structural causal model

Those are not interchangeable, even if they sound similar in product copy or UI labels.

## Why This Matters For CAP

CAP exists because ordinary invocation interoperability is not enough for causal systems.

A client needs more than a URL and a JSON schema. It also needs to know:

- what kind of causal question the server can answer
- how strong those answers are
- what assumptions shape them
- what semantic meaning the response actually carries

That is why CAP focuses on disclosure as much as invocation. The point is not to make every causal system identical. The point is to make their differences visible.

## The Practical CAP Mental Model

When you read a CAP response, do not ask only:

- what is the result?

Also ask:

- what kind of claim is this?
- what assumptions is it relying on?
- how should I interpret it conservatively?

In CAP, those distinctions show up through fields such as:

- `supported_verbs`
- `reasoning_mode`
- `identification_status`
- `assumptions`
- `provenance`

The protocol does not decide the science for you.
It makes the scientific posture of the server visible enough to inspect before you trust the answer too much.

## Where To Go Next

- Read [Overview](../overview.md) for the CAP boundary in plain language.
- Read [Quickstart for Clients](../quickstart-client.md) if you want to call a CAP server.
- Read [Quickstart for Servers](../quickstart-server.md) if you want to expose one.
- Read [Causal Semantics Specification](../../specification/causal-semantics.md) when you want the protocol's semantic contract.
