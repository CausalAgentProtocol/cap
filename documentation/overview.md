# Overview

CAP is an open protocol for discovering, invoking, and interpreting causal reasoning services.

It standardizes a small interoperable surface for capability disclosure, causal invocation, and semantically qualified responses. It does not standardize how a server learns graphs, fits models, or organizes its internal product surface.

CAP exists because invocation interoperability is not enough for causal systems. A client also needs to know what kind of causal claim a result represents, which assumptions it depends on, and how far that result should be trusted.

## What CAP Standardizes

CAP standardizes:

- a machine-readable capability card
- a small causal verb surface
- a common request and response envelope
- semantic disclosure for stronger causal claims
- a coarse conformance model

Together, those let clients determine what a server can do before invocation and what a response means after invocation.

## What CAP Does Not Standardize

CAP does not standardize:

- how a server learns or fits causal structure
- which engine family or estimation strategy is scientifically best
- source-data ingestion, storage, or refresh policy
- product-specific discovery workflows
- agent orchestration or delegation logic

CAP standardizes interface and disclosure, not the underlying science or product topology.

## Why Semantic Honesty Matters

Two servers can answer the same causal-looking question while making very different claims. One may return an identified effect, another a graph propagation score, another a forecast dressed in intervention language.

CAP does not force those systems to become identical. It forces the differences to stay visible through fields such as `reasoning_mode`, `identification_status`, `assumptions`, and `provenance`.

## CAP As An Independent Protocol Layer

CAP is an independent semantics layer.

That means:

- CAP can be exposed directly over HTTP
- CAP can be wrapped by MCP tools
- CAP can be referenced from A2A discovery or delegation
- bindings may change invocation mechanics, but they must not change CAP semantics

CAP is therefore not a generic tool wrapper and not a replacement for MCP or A2A. It is the causal protocol layer that can coexist with them.

## Where To Go Next

- Start with [Getting Started](getting-started.md) for the shortest path.
- Use [Quickstart for Clients](quickstart-client.md) if you want to call a CAP server.
- Use [Quickstart for Servers](quickstart-server.md) if you want to expose one.
- Use the [Specification](../specification/index.md) when you need normative rules.
