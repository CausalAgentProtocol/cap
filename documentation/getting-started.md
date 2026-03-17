# Getting Started

Use this page if you are new to CAP and want the shortest path from "what is this?" to "what should I read next?"

## In One Minute

CAP is an open protocol for discovering, calling, and interpreting causal services.

The practical idea is simple:

- a client should be able to inspect a server before calling it
- a server should say not only what result it returned, but what kind of causal claim that result represents

If you remember only three things, remember these:

- the capability card is the first thing to read
- Level 1 means observation, Level 2 adds intervention support
- interventional results need semantic disclosure, not just an estimate

## Choose Your Path

Most readers are either trying to call a CAP server or expose one. Start with the path that matches your job.

### Client Path

Use this path if you want to:

- discover a CAP server
- decide whether it fits your use case
- make a safe first call
- interpret the response correctly

Read in this order:

1. [Overview](overview.md)
2. [Quickstart for Clients](quickstart-client.md)
3. [Capability Card](concepts/capability-card.md)
4. [Conformance Levels](concepts/conformance-levels.md)

### Server Path

Use this path if you want to:

- expose an existing causal engine through CAP
- choose the lowest honest conformance level
- publish a capability card clients can rely on

Read in this order:

1. [Overview](overview.md)
2. [Quickstart for Servers](quickstart-server.md)
3. [Choose a Conformance Level](guides/choose-a-conformance-level.md)
4. [Write an Honest Capability Card](guides/write-an-honest-capability-card.md)

## The Core Flow

If CAP feels abstract at first, keep this five-step flow in mind:

1. A server publishes a capability card.
2. A client reads the card to see what the server actually supports.
3. The client sends a CAP request.
4. The server returns a structured result.
5. If the result is interventional, the server also discloses how that result should be interpreted.

Most of CAP is just making those five steps explicit and machine-readable.

## What To Inspect First

When you open a capability card for the first time, start here:

- `conformance_level`
- `supported_verbs`
- `reasoning_modes_supported`
- `causal_engine`
- `assumptions`
- `authentication`

That order works well because it answers, in sequence:

- can this server do the class of task I need
- which operations are actually exposed
- what kind of stronger claims might appear
- what kind of engine is behind the interface
- what should shape my trust in the result
- how do I call it safely

## The Few Terms You Need Up Front

You do not need the whole spec vocabulary to get started. These are the terms most readers need first:

- capability card: the machine-readable description of a CAP server
- conformance level: the coarse interoperability tier
- reasoning mode: what kind of causal computation produced a result
- assumptions: what must hold for the result to mean what it claims
- provenance: which server, graph, and method produced the result

## When To Read The Spec

Use the documentation for orientation. Use the specification when you need exact rules.

Good starting points:

- [Capability Card](../specification/capability-card.md)
- [Verbs](../specification/verbs.md)
- [Message Format](../specification/message-format.md)
- [Conformance](../specification/conformance.md)

Use `schema/` when you need machine-readable contracts rather than prose.

## Current `v0.2.2` Note

Current source materials still record a few explicit draft-versus-adapter gaps, especially around:

- capability card richness
- `cap_version` wire value
- `intervene.do` response shape

Those gaps are documented on purpose rather than hidden. If you are building tooling, prefer the schema files and read their `$comment` notes where draft and current adapter behavior differ.
