# Overview

CAP is an open protocol for discovering, invoking, and interpreting causal reasoning capabilities.

It exists for a practical reason: a client should be able to tell what kind of causal server it is talking to before it trusts or acts on a result.

## What CAP Gives You

CAP standardizes:

- a machine-readable capability card
- a small interoperable causal verb surface
- conformance levels
- semantic disclosure for interventional claims
- provenance that helps clients compare results

That gives clients a common way to answer:

- what can this server do
- what kind of causal claim is this result making
- what assumptions and production context should shape trust in it

## Why This Matters

Two systems can both answer a causal-looking question and still mean very different things.

One may return a formally identified effect. Another may return graph propagation. Another may return a forecast dressed in intervention language. CAP's job is not to force those systems to be identical. Its job is to make the differences visible in a shared, machine-readable way.

## What CAP Does Not Try To Standardize

CAP does not standardize:

- how a server learns or fits a causal graph
- how source data is ingested, stored, or refreshed
- agent orchestration
- vendor-specific discovery workflows
- which causal engine is scientifically correct

CAP standardizes interface and disclosure, not the underlying science.

## Why The Capability Card Comes First

The capability card is where a client starts because CAP wants discovery to happen before trust.

Before invocation, a client should be able to inspect:

- `conformance_level`
- `supported_verbs`
- `reasoning_modes_supported`
- `causal_engine`
- `assumptions`
- `authentication`

Without that disclosure, a CAP server would collapse toward a generic RPC or tool wrapper.

## CAP As An Independent Layer

CAP is an independent causal semantics layer.

That means:

- CAP is not a replacement for MCP
- CAP is not a replacement for A2A
- CAP can be exposed natively over HTTP
- CAP can be bound into MCP tools
- CAP can be referenced from A2A discovery and delegation

The binding may change. The causal semantics should not.

## The Main Distinction CAP Protects

CAP does not want observational results, intervention estimates, and future counterfactual surfaces to look interchangeable just because they all came through an API.

That is why stronger causal claims come with stronger disclosure. In particular, interventional responses must make clear:

- `reasoning_mode`
- `identification_status`
- `assumptions`

## Where To Go Next

- read [Getting Started](getting-started.md) for the shortest guided path
- read [Quickstart for Clients](quickstart-client.md) if you want to call a CAP server
- read [Quickstart for Servers](quickstart-server.md) if you want to expose one
- use the [Normative Specification](../specification/index.md) when you need exact protocol rules
- use `schema/` when you need machine-readable contracts
