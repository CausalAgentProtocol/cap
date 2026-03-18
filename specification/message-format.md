# Message Format

This page defines the CAP protocol envelope, independent of any specific transport binding.

## Request Envelope

A CAP request envelope MUST include:

- `cap_version`
- `verb`
- `params`

It MAY include:

- `request_id`
- `options`

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

Current source materials still record a draft-versus-adapter mismatch around the exact `cap_version` wire value.

That mismatch should remain explicit until the repo decides the final normative wire value for `v0.2.2`.
