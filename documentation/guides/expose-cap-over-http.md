# Expose CAP Over HTTP

This guide explains one practical way to expose a CAP server over HTTP.

It is not the normative protocol definition. The normative contract lives in [the specification](../../specification/index.md). This guide focuses on implementation choices that preserve CAP semantics without mixing in implementation-specific product behavior.

The current `cap-reference` implementation uses a single HTTP entrypoint with CAP envelopes, not one path per verb. In practice that means clients post to `/api/v1/cap` and the server dispatches by the request's `verb` field. The same app also serves `GET /`, `GET /.well-known/cap.json`, and `GET /api/v1/health` as discovery and operational metadata.

## 1. Publish The Capability Card

Expose:

- `GET /.well-known/cap.json`

This is the primary discovery path for clients.

If you also expose `meta.capabilities`, it should return the same capability information through the CAP envelope.

## 2. Use A Single CAP Entrypoint

The current reference binding is:

- `POST /api/v1/cap`

Example request:

```json
{
  "cap_version": "0.2.2",
  "request_id": "req-neighbors-1",
  "verb": "graph.neighbors",
  "context": {
    "graph_ref": {
      "graph_id": "abel-main",
      "graph_version": "CausalNodeV2"
    }
  },
  "params": {
    "node_id": "<node-id>",
    "scope": "parents",
    "max_neighbors": 5
  }
}
```

This is JSON-RPC-like in shape, but the semantic contract is still CAP: the envelope carries `verb`, CAP params, CAP errors, and CAP provenance. FastAPI routing is only the binding layer.

Route-style aliases such as `intervene/do` or `extensions/your_service/custom_operation` may still exist in SDKs as convenience input. In `cap-reference`, those aliases are resolved client-side back to canonical CAP verbs before dispatch.

Handler registries MAY still distinguish between core verbs, convenience verbs, and extension verbs internally, but the HTTP binding should keep one semantic CAP envelope surface.

## 3. Keep Auth Visible Up Front

Declare authentication in the capability card and enforce it consistently.

Clients should be able to determine the basic invocation requirement before making protected requests.

## 4. Return Protocol Errors

Prefer explicit protocol behavior over silent fallbacks.

Examples:

- `verb_not_supported`
- `invalid_intervention`
- `upstream_error`

## 5. Keep The Binding Separate From Product Internals

HTTP is a binding for CAP, not a place to promote internal URL topology or product workflow concepts into protocol core.

If you later expose alternative HTTP bindings, keep them semantically equivalent to the canonical CAP envelope surface.

## Other Integration Surfaces

MCP can wrap CAP verbs, but it does not replace CAP capability disclosure or causal semantics.

A2A can help with discovery or delegation, but it does not redefine CAP request meaning, response meaning, or semantic honesty rules.

## Read Next

- [Protocol Specification](../../specification/protocol.md)
- [Message Format Specification](../../specification/message-format.md)
