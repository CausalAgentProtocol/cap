# Expose CAP via MCP

Use this guide when you want to present CAP verbs through MCP tools without changing CAP semantics.

## The Split Of Responsibilities

- MCP provides tool transport and lifecycle
- CAP provides causal semantics, disclosure rules, and response interpretation

An MCP wrapper does not turn CAP into an MCP-native semantic model. It remains CAP exposed through an MCP binding.

## 1. Map CAP Verbs To MCP Tools

A common mapping is:

- `observe.predict` -> `cap_observe_predict`
- `graph.neighbors` -> `cap_graph_neighbors`

The exact tool names can vary, but the represented CAP verb should stay clear.

## 2. Preserve CAP Input And Output Meaning

The MCP tool schema should be derived from the CAP verb contract rather than inventing a parallel semantic model.

That means preserving:

- CAP request parameters
- CAP result semantics
- semantic honesty fields where required
- provenance when exposed

## 3. Keep Capability Discovery Separate

MCP tool descriptions are not a substitute for the CAP capability card.

A client or orchestrator should still be able to find:

- conformance level
- assumptions
- reasoning modes
- graph and auth disclosure

through the CAP capability card or an explicit reference to it.

## 4. Keep Strong Semantics Structured

If an interventional result requires:

- `reasoning_mode`
- `identification_status`
- `assumptions`

those fields should remain structured, not be buried inside a tool description string or free-text summary.

## 5. Use MCP For Access, Not Semantic Redefinition

MCP is useful for:

- local tool access
- remote tool access
- integration with MCP-native agent environments

It should not change what the CAP response means.

## Read Next

- [Independent Layer](../concepts/independent-layer.md)
- [Transport Bindings Spec](../../specification/transport-bindings.md)
