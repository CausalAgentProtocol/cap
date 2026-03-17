# Transport Bindings

## Principle

CAP is transport-agnostic at the semantic layer.

Different bindings may change discovery or invocation mechanics, but they MUST NOT change the meaning of CAP capability disclosure, request semantics, semantic honesty fields, or provenance.

## HTTP Binding

HTTP is the primary CAP binding in current source materials.

The long-form v0.2.2 draft defines:

- `GET /.well-known/cap.json` for the capability card
- `POST {endpoint}/{verb_category}/{verb_name}` for CAP invocation

Example:

- `intervene.do` maps to `POST {endpoint}/intervene/do`

HTTP request bodies carry the CAP request envelope.
HTTP responses carry the CAP response envelope.

## MCP Binding

MCP is an optional CAP binding.

When CAP verbs are exposed as MCP tools:

- tool schemas SHOULD be derived from CAP verb contracts
- tool descriptions SHOULD identify the represented CAP verb
- MCP transport changes access mechanics, not CAP semantics

MCP authorization, when used, is separate from CAP capability-card disclosure.

## A2A Binding

A2A is an optional discovery and delegation binding.

An A2A agent card MAY reference a CAP capability card so orchestrators can discover a CAP-capable service.

Rule:

- A2A may route to CAP
- A2A does not redefine CAP request or response meaning

## Binding Invariance Rule

If the same causal capability is exposed through multiple bindings, the server MUST preserve the same:

- capability disclosure
- verb semantics
- semantic honesty obligations
- provenance expectations
