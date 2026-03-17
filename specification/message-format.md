# Message Format

## Scope

CAP defines a shared request and response envelope so that clients, transports, and conformance tooling can reuse one framing model across verbs.

The machine-readable contract for the common envelope lives in `schema/envelopes/v0.2.2.json`.

## Request Envelope

A CAP request envelope MUST include:

- `cap_version`
- `verb`
- `params`

It MAY include:

- `request_id`
- `options`

`options` currently includes:

- `timeout_ms`
- `response_detail`

The long-form draft defines `response_detail` values `summary`, `full`, and `raw`.
The current public adapter model is narrower and currently exposes `summary` and `full`.

## Response Envelope

Every response envelope MUST include:

- `cap_version`
- `request_id`
- `verb`
- `status`

If `status = "success"`, the envelope MUST include:

- `result`

If `status = "error"`, the envelope MUST include:

- `error.code`
- `error.message`

It MAY also include:

- `error.suggestion`
- `error.details`
- `provenance`
- `pagination`

The long-form draft also reserves `status = "partial"` at the generic envelope layer. The current public adapter does not currently emit partial responses.

## Request Identity

Clients SHOULD provide `request_id` when available.

If `request_id` is omitted, a server MAY generate one for correlation.

## Version Field Note

Current source materials contain a visible mismatch:

- the long-form draft examples use `cap_version: "0.2"`
- the current public adapter emits `cap_version: "0.2.2"`

The schema layer accepts both values and marks the mismatch explicitly. This specification file should be tightened further once the repo decides which exact wire value is normative for v0.2.2 envelopes.

## Capability Access Paths

There are two protocol-valid ways to access capability information:

- `GET /.well-known/cap.json`
- `meta.capabilities` through the CAP envelope

These two surfaces MUST be semantically equivalent.
