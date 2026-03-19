# Getting Started

Use this page for the shortest path into CAP.

If the docs feel like they are moving too quickly into protocol language, take the causal concepts path first and then come back here.

CAP has two layers of reading:

- `documentation/` explains how to use or implement CAP
- `specification/` defines the normative protocol contract

Choose the path that matches your role:

- If you are new to causal reasoning itself, start with [What Is Causality?](concepts/what-is-causality.md).
- If you want to call a CAP server, start with [Quickstart for Clients](quickstart-client.md).
- If you want to expose a CAP server, start with [Quickstart for Servers](quickstart-server.md).
- If you need the protocol contract itself, go to the [Specification](../specification/index.md).

## One-Minute Intro

CAP is an open protocol for discovering, calling, and interpreting causal services.

The shortest useful mental model is:

- a server publishes a capability card
- a client reads the card before trusting the server
- the server returns responses with semantics clear enough to interpret conservatively

If that mental model already makes sense, jump straight to a quickstart. If not, the causality concepts page gives the missing context.

## Where To Go Next

- Read [What Is Causality?](concepts/what-is-causality.md) if you want the conceptual on-ramp before CAP details.
- Read [Overview](overview.md) if you want the protocol boundary in plain language.
- Read [Quickstart for Clients](quickstart-client.md) for the task-oriented client path.
- Read [Quickstart for Servers](quickstart-server.md) for the smallest honest implementation path.
- Read [Why CAP](rationale/why-cap.md) if you want the design rationale.
