# Message Format

This page defines the CAP protocol envelope, independent of any specific transport binding.

## Request Envelope

A CAP request envelope MUST include:

- `cap_version`
- `verb`

It MAY include:

- `request_id`
- `context`
- `options`
- `params`

When a verb defines request parameters, the request MUST include `params`.

Discovery verbs such as `meta.capabilities` and `meta.methods` MAY omit `params`.

For CAP core verbs, the request schema defines the portable canonical contract.

Servers SHOULD keep CAP core requests small and stable.

Provider-specific request knobs SHOULD NOT be added to CAP core merely because one implementation finds them useful.

If a server accepts implementation-specific optional hints on a CAP core request, those hints MUST:

- have safe defaults
- remain ignorable without changing the verb's canonical semantics
- not become required for correct invocation by a generic CAP client

If a request field materially changes the operation's semantics or is required for correctness, it belongs in an extension surface unless CAP later standardizes it explicitly.

If `context` is present, it MAY include shared cross-verb request state such as:

- `graph_ref.graph_id`
- `graph_ref.graph_version`

Shared request context SHOULD be used for cross-cutting selection state rather than reintroducing the same selector independently on multiple verb payloads.

## Request Options

When `options` is present, it MAY include envelope-level execution hints that apply across verbs.

The current standardized options are:

- `timeout_ms`
- `response_detail`

`timeout_ms` is a best-effort server hint for how long the client is willing to wait.

`response_detail` is a best-effort response-shaping hint with these canonical values:

- `summary`
- `full`
- `raw`

Their semantics are:

- `summary`: prefer the smallest high-signal result that still satisfies the verb's canonical minimum success fields
- `full`: include the canonical minimum fields plus additional structured detail that improves ordinary client or agent usability
- `raw`: include the canonical minimum fields plus fuller provider-specific detail, debugging-oriented payloads, or low-level supporting structures when available

Servers MAY ignore `response_detail` when they only expose one practical response shape for a verb.

When a server honors `response_detail`, it SHOULD preserve the canonical minimum success fields for that verb at every detail level.

Clients MUST NOT assume that `full` or `raw` are supported merely because the request option exists.

Servers SHOULD document any supported detail-tier behavior and defaults in capability disclosure when those differences materially affect integration behavior.

## Response Envelope

Every CAP response envelope MUST include:

- `cap_version`
- `request_id`
- `verb`
- `status`

If `status = "success"`, the envelope MUST include `result`.

If `status = "error"`, the envelope MUST include:

- `error.code`
- `error.message`

It MAY also include:

- `error.suggestion`
- `error.details`
- `provenance`
- `pagination`

When a response carries provenance, its interpretation is defined in [Provenance](./provenance.md).

This page defines envelope shape only. It does not fully define the semantic categories of provenance.

For CAP core verbs, the result schema defines the canonical minimum success payload, not necessarily the exhaustive payload.

Servers MAY include additional result fields beyond the canonical minimum when doing so improves usability or disclosure.

Clients MUST NOT fail solely because additional unknown result fields are present in a successful CAP core response.

Additional result fields are additive only. They MUST NOT replace, rename, or semantically contradict the canonical minimum fields defined for that verb.

## Capability Access Paths

There are two protocol-valid ways to access capability information:

- `GET /.well-known/cap.json`
- `meta.capabilities` through the CAP envelope

These two surfaces MUST be semantically equivalent.

CAP method-discovery information is exposed through `meta.methods` in the CAP envelope.

`meta.methods` describes the public request `params` and success `result` fields for the verbs currently mounted on that endpoint. It does not replace the capability card.

When a client already has a verb inventory from `meta.capabilities`, it SHOULD prefer targeted `meta.methods` requests over whole-surface method dumps.

## Current HTTP Binding

HTTP is the primary current public binding for CAP.

In the current HTTP binding, a CAP server SHOULD expose:

- `GET /.well-known/cap.json`
- `POST {service-prefix}/cap`

The discovery path is fixed at `/.well-known/cap.json`.

The invocation path is a single CAP-envelope entrypoint whose path convention ends in `/cap`.

That entrypoint MAY be mounted directly at `/cap` or under a service prefix such as `/api/v1/cap`.

Clients MUST treat the capability card's `endpoint` field as the source of truth for the exact invocation URL.

Servers SHOULD NOT expose one HTTP path per CAP verb as if those paths were the normative protocol surface.

## Version Note

CAP `v0.3.0` uses `cap_version = "0.3.0"`.

Older examples that still show `0.2` or `0.2.2` should be read as historical version material, not as the active envelope contract.
