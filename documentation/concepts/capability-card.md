# Capability Card

The capability card is the first thing a client should read.

It exists so a client can decide whether a server is appropriate before sending a causal request.

## What It Answers

A capability card answers questions such as:

- what CAP spec version does this server implement
- what conformance level does it claim
- which core and convenience verbs does it support
- what kind of causal engine sits behind the interface
- which assumptions does the server rely on
- which reasoning modes might appear in responses
- how authentication and disclosure policy work

## Why It Matters

Without the capability card, a CAP server becomes much harder to use safely.

A client would otherwise have to guess:

- whether interventional queries are supported
- whether a result is mechanism-backed or only graph propagation
- whether the graph is partially oriented
- whether response detail is hidden or obfuscated

That guesswork is exactly what CAP is designed to reduce.

## What To Read First

If this is your first time opening a capability card, read it in this order:

1. `conformance_level`
2. `supported_verbs`
3. `reasoning_modes_supported`
4. `causal_engine`
5. `assumptions`
6. `authentication`

That order quickly answers:

- what class of tasks the server supports
- which operations are actually exposed
- what kind of stronger claims may appear
- what kind of engine is behind the interface
- what assumptions should shape trust
- how to call it safely

## Relationship To `meta.capabilities`

If a server exposes `meta.capabilities`, that response should be semantically equivalent to the capability card served at `/.well-known/cap.json`.

## Read Next

- [Quickstart for Clients](../quickstart-client.md)
- [Quickstart for Servers](../quickstart-server.md)
- [Capability Card Spec](../../specification/capability-card.md)
