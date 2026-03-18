# Write an Honest Capability Card

This guide covers one of CAP's core differentiators: capability disclosure before invocation.

## What A Client Must Decide Before The First Call

A client should be able to decide, before sending a request:

- what conformance level the server claims
- which verbs the server actually supports
- what assumptions shape the server's claims
- which reasoning modes may appear in responses
- what graph scope is available
- what authentication is required

Write the card from public runtime behavior, not from roadmap intent, internal experiments, or private product surfaces.

## Minimum Fields Versus Richer Draft Fields

Publish the minimum honest card first.

At minimum, a CAP server should disclose:

- `conformance_level`
- `supported_verbs`
- `assumptions`
- `reasoning_modes_supported`
- `graph`
- `authentication`

Some servers will also publish richer draft-era fields such as `causal_engine`, `detailed_capabilities`, `access_tiers`, `disclosure_policy`, or `bindings`.

Do not treat richer draft metadata as required merely because the long-form draft sketches it. Publish the minimum honest card first; add richer capability detail only when it is stable and truly supported by the public surface.

## Common Ways To Overstate Support

The most common mistakes are:

- claiming a higher conformance level than the public interface actually satisfies
- listing verbs that only work through private adapters or extensions
- advertising reasoning modes the server cannot defend technically
- presenting product-specific discovery or workflow semantics as CAP core
- hiding draft-versus-implementation narrowing instead of labeling it explicitly

If your public implementation is narrower than the richer protocol direction, document that narrowing clearly. Do not redefine CAP core downward just to match a temporary adapter.

## Read Next

- [Quickstart for Servers](../quickstart-server.md)
- [Capability Card Specification](../../specification/capability-card.md)
