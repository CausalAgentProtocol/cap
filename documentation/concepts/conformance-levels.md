# Conformance Levels

Conformance levels are the coarse interoperability signal in CAP.

They answer the question: what minimum causal surface should a client expect from this server?

## The Levels

- Level 1: observe
- Level 2: intervene
- Level 3: reserved in `v0.2.x`

## Level 1

Level 1 is for servers that support:

- capability disclosure
- graph traversal through the Level 1 core surface
- observational querying

Intuition:

- a Level 1 server can help you inspect the graph and ask "what is associated with or predictive for this target?"
- it should not present itself as an intervention-capable server

If a Level 1 server receives interventional `effect.query`, it should return `query_type_not_supported`.

## Level 2

Level 2 adds interventional support.

A Level 2 server should support:

- all Level 1 behavior
- interventional `effect.query`
- `graph.paths`

Intuition:

- a Level 2 server can answer "what happens if we do X?" rather than only "what do we observe around Y?"

For interventional responses, Level 2 also requires explicit disclosure of:

- `reasoning_mode`
- `identification_status`
- `assumptions`

## Level 1 Versus Level 2 In Practice

A simple way to remember the difference:

- Level 1: "show me the graph neighborhood and give me an observational answer"
- Level 2: "tell me what happens under an intervention, and tell me what kind of interventional claim that is"

The second part matters. Level 2 is not just "supports more verbs." It also carries stronger semantic disclosure duties.

## Level 3

Level 3 remains reserved in `v0.2.x`.

That means:

- servers may describe counterfactual readiness in richer capability metadata
- servers must not claim active Level 3 conformance yet

## What Levels Do Not Tell You

Two servers at the same level may still differ materially in:

- engine family
- mechanism coverage
- latent confounding support
- uncertainty methods
- disclosure policy

That is why clients should read:

- `causal_engine`
- `detailed_capabilities`
- `reasoning_modes_supported`
- `assumptions`

not just the level number.

## Read Next

- [Getting Started](../getting-started.md)
- [Conformance Spec](../../specification/conformance.md)
