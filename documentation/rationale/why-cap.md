# Why CAP

CAP exists because generic tool and agent protocols are good at callability, but not sufficient for interoperable causal meaning.

## Why CAP Exists

A causal-looking answer can be useful, weak, identified, simulated, or mostly heuristic. If the protocol only standardizes invocation, clients are left guessing what kind of claim came back and how much trust it deserves.

CAP closes that gap with capability disclosure, semantically qualified responses, and a small interoperable verb surface.

## Why Generic Tools Are Not Enough

A generic tool contract can tell a client how to call something. It does not by itself tell the client:

- whether the server supports observation only or intervention semantics
- what kind of reasoning produced the result
- whether the claim is formally identified
- which assumptions shape the answer
- how to compare answers across providers

That is why CAP is more than a transport wrapper.

## Why Semantic Honesty Matters

CAP is built around semantic honesty: a server should describe what it actually computed, not just return an answer that sounds causally impressive.

That is why CAP treats fields such as `reasoning_mode`, `identification_status`, `assumptions`, and `provenance` as part of the meaning of a response.

## Why CAP Stays Separate From Transport

CAP is transport-agnostic at the semantic layer.

HTTP, MCP, or A2A may change discovery or invocation mechanics, but they should not redefine capability disclosure, verb meaning, or response semantics.

## How CAP Coexists With MCP And A2A

MCP is useful for tool exposure. A2A is useful for discovery, delegation, and coordination. CAP can sit behind either one.

The split is straightforward:

- MCP or A2A can help route to a causal service
- CAP defines what that causal service means

## Why CAP Does Not Require Open Engines

CAP is an open protocol, not a requirement that every engine, model, graph pipeline, or dataset be open.

Closed implementations can participate honestly as long as the public protocol surface and semantic disclosure stay truthful.

## Why CAP Keeps The Core Small

CAP does not try to standardize every causal workflow. It standardizes the parts that need to be interoperable across engines:

- capability disclosure
- a small core verb surface
- semantic honesty fields
- a common envelope
- conformance boundaries

That keeps the boundary hard without collapsing CAP into the current adapter surface.
