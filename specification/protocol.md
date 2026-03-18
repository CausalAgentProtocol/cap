# Protocol

## Scope

CAP defines the semantic protocol layer for discovering, invoking, and interpreting causal reasoning capabilities.

CAP standardizes:

- capability disclosure
- verb semantics
- common request and response envelopes
- conformance boundaries
- semantic honesty and provenance expectations

CAP does not standardize:

- graph-learning or model-fitting internals
- source-data ingestion or storage
- product-specific discovery surfaces
- agent orchestration

## Roles

- `CAP Client`: discovers a CAP server, invokes CAP verbs, and interprets results
- `CAP Server`: exposes a causal service and is responsible for truthful capability and response disclosure

## Protocol Flow

1. A client discovers the server's capability card.
2. The client evaluates conformance level, supported verbs, assumptions, and invocation requirements.
3. The client invokes a CAP verb through a transport binding.
4. The server returns a CAP response envelope.
5. The client interprets the result using the disclosed semantics and provenance.

## State Model

CAP `v0.2.x` is stateless.

Rules:

- each request MUST be self-contained
- CAP does not require server-side session state
- freshness metadata MAY appear in provenance
- freshness metadata MUST NOT be treated as a session mechanism

## Binding Model

CAP is transport-agnostic at the semantic layer.

Bindings may change discovery or invocation mechanics, but they MUST NOT change the meaning of capability disclosure, verb semantics, semantic honesty fields, or provenance.

HTTP is the primary current public binding.

Other integration surfaces such as MCP or A2A MAY carry or expose CAP behavior, but they do not redefine CAP semantics.

If the same capability is exposed through multiple bindings, the server MUST preserve the same:

- capability disclosure
- verb semantics
- semantic honesty obligations
- provenance expectations

## Disclosure And Redaction

A server MAY summarize, quantize, or redact parts of a response according to its disclosure policy.

A server MUST NOT use disclosure limits as a reason to overstate causal semantics, identification strength, or evidentiary status.
