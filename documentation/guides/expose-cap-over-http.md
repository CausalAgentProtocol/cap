# Expose CAP Over HTTP

HTTP is the primary CAP binding.

This guide covers the minimum public surface an implementation should expose over HTTP without mixing in implementation-specific semantics.

## 1. Publish The Capability Card

Expose:

- `GET /.well-known/cap.json`

This is the first discovery entry point for clients.

If you also expose `meta.capabilities`, it should return the same capability information through the CAP envelope.

## 2. Accept CAP Request Envelopes Over POST

The long-form draft uses verb-category paths:

- `POST {endpoint}/{verb_category}/{verb_name}`

Example:

- `intervene.do` becomes `POST {endpoint}/intervene/do`

The important rule is not your internal router shape. The important rule is that the HTTP binding preserves CAP request and response semantics.

## 3. Keep The Envelope Stable

HTTP should carry the CAP request envelope, including:

- `cap_version`
- `request_id`
- `verb`
- `params`
- optional `options`

Responses should carry:

- `status`
- `result` or `error`
- optional `provenance`

## 4. Make Auth Visible Up Front

Clients should not have to guess auth behavior.

Declare authentication in the capability card and enforce it consistently in HTTP handlers.

Current source materials include models such as:

- `none`
- `api_key`
- `oauth2`

## 5. Return Protocol Errors, Not Silent Fallbacks

Examples:

- use `verb_not_supported` when a verb is unavailable
- use `query_type_not_supported` when Level 1 cannot satisfy interventional `effect.query`
- use `invalid_intervention` when intervention parameters are invalid

## 6. Keep The Binding Separate From Product Internals

Do not let internal URL layout or service topology redefine CAP semantics.

The HTTP layer is a binding for CAP, not a place to smuggle in product-specific concepts as if they were CAP core.

## Read Next

- [Message Format Spec](../../specification/message-format.md)
- [Transport Bindings Spec](../../specification/transport-bindings.md)
