# Integrate CAP With A2A

Use this guide when you want A2A discovery or delegation to point to a CAP server.

## The Split Of Responsibilities

- A2A handles agent discovery, delegation, and coordination
- CAP handles causal reasoning semantics

A2A can route work to a CAP-capable agent or service, but it does not replace the CAP capability card or CAP verb contracts.

## 1. Publish A CAP Capability Card

The CAP capability card remains the source of truth for:

- conformance level
- supported verbs
- assumptions
- reasoning modes
- graph and authentication disclosure

## 2. Reference CAP From The A2A Surface

An A2A agent card can reference the CAP capability card so orchestrators know where to find the causal contract.

That lets A2A discovery point to CAP without redefining CAP semantics.

## 3. Keep Delegation Separate From Causal Meaning

A2A can decide:

- which agent to route to
- how tasks are delegated
- how multi-agent coordination happens

CAP still decides:

- what a causal request means
- what fields an interventional response must disclose
- how clients should interpret reasoning mode and provenance

## 4. Avoid Semantic Drift Across Bindings

If a CAP service is reachable directly and also discoverable through A2A:

- the same causal capability should mean the same thing in both paths
- the same capability card should still describe the service

## Read Next

- [Independent Layer](../concepts/independent-layer.md)
- [Transport Bindings Spec](../../specification/transport-bindings.md)
