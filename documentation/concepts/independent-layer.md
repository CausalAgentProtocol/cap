# Independent Layer

CAP is an independent causal semantics layer.

That means CAP defines its own capability disclosure, verb semantics, assumptions, and provenance rules rather than borrowing those meanings from another protocol.

## What This Does Not Mean

It does not mean:

- CAP replaces MCP
- CAP replaces A2A
- CAP requires one transport

## What It Does Mean

It means:

- CAP can be exposed natively over HTTP
- CAP verbs can be exposed through MCP tools
- CAP servers can be referenced from A2A discovery surfaces
- the causal semantics should stay the same across those bindings

## Why This Separation Matters

MCP is strong at tool transport and lifecycle.

A2A is strong at agent discovery, delegation, and coordination.

CAP adds the part those protocols do not natively standardize:

- causal capability disclosure
- causal question types
- reasoning-mode honesty
- assumption disclosure
- causal provenance

## Practical Rule

Changing the transport should not change the meaning of the causal claim.

If the same causal operation is reachable over HTTP, MCP, or A2A-linked routing, the semantic contract should still be CAP's contract.

## Read Next

- [Expose CAP Over HTTP](../guides/expose-cap-over-http.md)
- [Expose CAP via MCP](../guides/expose-cap-via-mcp.md)
- [Integrate CAP With A2A](../guides/integrate-cap-with-a2a.md)
