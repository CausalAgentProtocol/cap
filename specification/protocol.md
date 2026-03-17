# Protocol

## Scope

CAP defines a causal semantics layer for discovering, invoking, and interpreting causal reasoning capabilities.

CAP standardizes:

- capability disclosure
- causal verb semantics
- message envelopes
- conformance levels
- assumptions and provenance disclosure
- transport bindings

CAP does not standardize:

- how an engine discovers causal structure
- how a server ingests or stores source data
- agent orchestration
- implementation-specific discovery surfaces

## Roles

- `CAP Client`: invokes causal reasoning through CAP
- `CAP Server`: exposes a causal engine through CAP and is responsible for honest disclosure

## Protocol Flow

1. Discover the server through `/.well-known/cap.json`
2. Inspect the capability card for level, verbs, assumptions, and auth
3. Invoke a CAP verb
4. Interpret the response using `reasoning_mode`, `identification_status`, `assumptions`, and `provenance`

## State Model

CAP `v0.2.x` is stateless.

Rules:

- every request must be self-contained
- there is no required server-side session
- a server may expose `graph_version` or other freshness metadata in provenance
- freshness metadata is informational, not a session mechanism

## Independent Layer

CAP is an independent semantics layer.

Implications:

- CAP can be exposed natively over HTTP
- CAP can be bound into MCP
- CAP can be referenced from A2A discovery and delegation
- the semantics do not change across bindings
