# Expose CAP Over HTTP

This guide explains one practical way to expose a CAP server over HTTP.

It is not the normative protocol definition. The normative contract lives in `specification/`. This guide focuses on implementation choices that preserve CAP semantics without mixing in implementation-specific product behavior.

## 1. Publish The Capability Card

Expose:

- `GET /.well-known/cap.json`

This is the primary discovery path for clients.

If you also expose `meta.capabilities`, it should return the same capability information through the CAP envelope.

## 2. Carry CAP Envelopes Over HTTP

The current public draft uses verb-category paths such as:

- `POST {endpoint}/{verb_category}/{verb_name}`

Example:

- `intervene.do` -> `POST {endpoint}/intervene/do`

The important rule is not the router shape. The important rule is that HTTP preserves CAP request and response semantics.

## 3. Keep Auth Visible Up Front

Declare authentication in the capability card and enforce it consistently.

Clients should be able to determine the basic invocation requirement before making protected requests.

## 4. Return Protocol Errors

Prefer explicit protocol behavior over silent fallbacks.

Examples:

- `verb_not_supported`
- `query_type_not_supported`
- `invalid_intervention`

## 5. Keep The Binding Separate From Product Internals

HTTP is a binding for CAP, not a place to promote internal URL topology or product workflow concepts into protocol core.

## Other Integration Surfaces

MCP can wrap CAP verbs, but it does not replace CAP capability disclosure or causal semantics.

A2A can help with discovery or delegation, but it does not redefine CAP request meaning, response meaning, or semantic honesty rules.

## Read Next

- [Protocol Specification](../../specification/protocol.md)
- [Message Format Specification](../../specification/message-format.md)
