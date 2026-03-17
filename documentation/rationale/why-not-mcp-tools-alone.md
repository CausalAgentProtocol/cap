# Why Not MCP Tools Alone

MCP is useful for exposing tools to agents. CAP is useful for making causal services interoperable as causal services.

Those are related goals, but they are not the same goal.

## What MCP Solves Well

MCP is strong at questions such as:

- how tools are listed and invoked
- how an agent discovers callable operations
- how a host and tool provider exchange structured input and output

If you want to make a causal engine reachable by an agent, MCP can absolutely be part of the answer.

## What MCP Alone Does Not Define

MCP by itself does not define a shared causal contract for:

- capability disclosure before invocation
- conformance levels for causal systems
- the semantic meaning of interventional versus observational results
- required fields such as `reasoning_mode`, `identification_status`, and `assumptions`
- provenance expectations for causal responses

In practice, you can expose a causal engine as an MCP tool, but without CAP each provider is still free to invent its own semantics for what the tool means and how strong its answers are.

## Why Tool Invocation Is Not Enough

A tool signature can tell a client how to call something. It does not by itself tell the client how to interpret a causal answer safely.

For example, an MCP tool might be named `intervene_do` or `estimate_effect`. That still leaves major open questions:

- is the system observational only, or truly interventional
- is the answer formally identified, simulated, propagated, or heuristic
- what assumptions should the client attach to the result
- how should two providers' answers be compared

Those are exactly the questions CAP is meant to standardize.

## Where CAP Fits

CAP adds the semantics layer that MCP intentionally does not try to define.

CAP gives the ecosystem:

- a machine-readable capability card
- a small shared causal verb surface
- conformance levels
- semantic honesty rules for stronger causal claims
- provenance conventions for comparing outputs

That means CAP can sit inside different delivery environments without giving up its causal meaning.

## CAP And MCP Are Complementary

The point is not "CAP instead of MCP."

The useful combination is often:

- MCP for agent-facing transport and tool exposure
- CAP for the causal semantics of the service behind that tool

In that setup, MCP helps an agent call the service, while CAP helps the agent or client understand what kind of causal claim came back.

## A Concrete Comparison

With MCP tools alone, two vendors can both expose a tool called "what if" and both accept similar arguments. The protocol still does not tell the client whether:

- both are returning the same kind of intervention semantics
- one is only providing a forecast
- one is using graph propagation while the other is using structural simulation
- either one is making a formally identified claim

With CAP, those differences are not left to naming conventions or product prose. They are surfaced through the capability card and the response semantics.

## The Short Version

MCP answers "how do I call this tool?"

CAP answers "what kind of causal service is this, and what kind of causal claim did it just make?"

If you only need callability, MCP may be enough. If you need interoperable causal semantics, MCP tools alone are not enough.
