# Write an Honest Capability Card

This guide focuses on one CAP principle: semantic honesty.

The capability card is where a server tells clients what kind of causal surface it is actually exposing. If that disclosure is overstated, the rest of the protocol becomes much less trustworthy.

## 1. Start From Public Runtime Behavior

Write the card from the behavior your public server actually exposes.

Do not write it from:

- internal roadmap intent
- unpublished research capabilities
- features only available through private extensions

## 2. Declare The Lowest Honest Level

- choose Level 1 unless you truly support interventional semantics
- choose Level 2 only when your public interface can satisfy the Level 2 contract
- do not claim Level 3 under `v0.2.x`

## 3. Be Conservative About Verb Support

List only verbs that a client can actually invoke successfully.

Keep CAP core separate from extensions:

- CAP core verbs belong in `supported_verbs`
- implementation-specific verbs belong in extension namespaces

## 4. Disclose Engine And Capability Shape Clearly

Do not stop at the level number.

Be explicit about:

- `causal_engine`
- `detailed_capabilities`
- `reasoning_modes_supported`
- `graph`

This is how a client tells, for example, whether a server is closer to graph propagation or mechanism-backed simulation.

## 5. Write Assumptions Precisely

`assumptions` should describe what must hold for the server's claims to be interpreted correctly.

Good assumption disclosure is:

- specific
- conservative
- stable enough to be machine-read

Avoid vague promotional language where a client needs machine-readable constraints.

## 6. Do Not Overstate Interventional Semantics

If you cannot support a stronger causal claim, say so.

Examples:

- do not advertise `scm_simulation` unless the server genuinely supports it
- do not imply counterfactual conformance because you have partial internal machinery
- do not hide narrower semantics behind broad labels like "causal AI"

## 7. Keep Draft-Implementation Gaps Explicit

If your public implementation is narrower than the richer protocol direction:

- document the narrowing explicitly
- do not silently redefine CAP core to match your implementation

That keeps the protocol honest while still allowing phased adoption.

## Read Next

- [Capability Card Concept](../concepts/capability-card.md)
- [Capability Card Spec](../../specification/capability-card.md)
- [Quickstart for Servers](../quickstart-server.md)
