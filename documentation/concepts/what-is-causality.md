# What Is Causality?

Causality is not about association. It is about intervention: what happens when we change something, and counterfactuals: what would have happened if we had changed it.

## Correlation Versus Causation

Suppose ice cream sales rise on the same days that drowning incidents rise.

These variables are correlated. They move together. However, it would be a mistake to conclude that buying ice cream causes drowning. A more plausible explanation is that hot weather is a **confounder** affecting both:

* Hot days increase ice cream purchases.
* Hot days increase swimming activity.

This is the core problem causal reasoning attempts to solve. When two variables move together in your data, you still need to ask *why*, and whether manually changing one would actually change the other.

## The Question Causality Tries to Answer

At its heart, a causal question has a specific shape:
> **If I change `X`, what happens to `Y`?**

This is fundamentally different from the standard statistical question:
> **When `X` changes in the data, what tends to happen near `Y`?**

The first question is about **intervention**. The second is about **association**. While many modern software systems and machine learning models are exceptional at answering the second question, far fewer can honestly support the first.

## Three Kinds of Causal Questions

It helps to separate causal queries into three distinct tiers. As you move down this list, the claims become stronger, but the assumptions required to prove them become heavier.

### 1. Observational (Association)
These ask what patterns naturally appear in observed data.
* *Examples:* Which nodes are connected to this node? Which variables tend to move together? Which predictors are associated with the target?
* *The Takeaway:* This is often the right place to start, but it does not represent what would happen under active intervention.

### 2. Interventional (Action)
These ask what would happen if a system were deliberately changed.
* *Examples:* If we increase the price, what happens to demand? If we suppress node `X`, what happens downstream? If policy `A` is applied, how does outcome `Y` change?
* *The Takeaway:* These are strong claims. They require strict assumptions and clear disclosure about the model's structure.

### 3. Counterfactual (Imagining)
These ask what *would have happened* differently in a specific, historical case.
* *Examples:* Given what happened to this specific customer, what would their outcome be if the treatment had not been applied? For this past market move, what would the outcome have been under a different intervention?
* *The Takeaway:* These are the strongest, most assumption-sensitive claims a model can make—and the easiest to overstate.

## Why Assumptions Matter

Causal answers do not come from data alone. They are inextricably linked to the assumptions you make about the world, such as:

* Are any important confounding variables missing from the data?
* Is the underlying graph structure credible?
* Does the model actually represent the intended intervention?
* Is the target effect mathematically identifiable from the available information?
* Is the current case inside the model's valid scope?

Because of these dependencies, two systems might return a response to "what causes `Y`" that looks identical in product copy or UI, but means wildly different things under the hood.

Depending on the system, you might be looking at a graph neighborhood, a propagation score, a standard forecast, an identified causal effect, or a simulation from a structural causal model. **These are not interchangeable.**

## Why This Matters for CAP

CAP exists because ordinary invocation interoperability (like REST or gRPC) is not enough for causal systems.

A client needs more than just a URL and a JSON schema. It needs to understand the semantic weight of the response:
* What kind of causal question is the server actually equipped to answer?
* How mathematically strong are those answers?
* What assumptions shape them?

**CAP focuses on disclosure as much as invocation.** The goal of the protocol is not to force every causal system to behave identically; the goal is to make their underlying differences visible and machine-readable.

## The Practical CAP Mental Model

When you parse a CAP response, do not just ask, *"What is the result?"*

You must also ask:

1. **What kind of claim is this?** (Observation, Intervention, or Counterfactual?)
2. **What assumptions is it relying on?**
3. **How should I interpret this conservatively?**

In CAP, these vital distinctions are exposed directly in the protocol through fields such as:
* `supported_verbs`
* `reasoning_mode`
* `identification_status`
* `assumptions`
* `provenance`

The protocol does not decide the science for you. Instead, it makes the scientific posture of the server visible enough to inspect *before* you decide to trust the answer.

## Where To Go Next

- Read [Overview](../overview.md) for the CAP boundary in plain language.
- Read [Quickstart for Clients](../quickstart-client.md) if you want to call a CAP server.
- Read [Quickstart for Servers](../quickstart-server.md) if you want to expose one.
- Read [Causal Semantics Specification](../../specification/causal-semantics.md) when you want the protocol's semantic contract.
