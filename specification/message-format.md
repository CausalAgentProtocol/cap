# Message Format

This page defines the CAP protocol envelope, independent of any specific transport binding.

## Request Envelope

A CAP request envelope MUST include:

- `cap_version`
- `verb`
- `params`

It MAY include:

- `request_id`
- `context`
- `options`

If `context` is present, it MAY include shared cross-verb request state such as:

- `graph_ref.graph_id`
- `graph_ref.graph_version`

Shared request context SHOULD be used for cross-cutting selection state rather than reintroducing the same selector independently on multiple verb payloads.

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

## Capability Access Paths

There are two protocol-valid ways to access capability information:

- `GET /.well-known/cap.json`
- `meta.capabilities` through the CAP envelope

These two surfaces MUST be semantically equivalent.

## Version Note

CAP `v0.2.2` uses `cap_version = "0.2.2"`.

Long-form draft examples that still show `0.2` are historical and are not the normative envelope contract.
