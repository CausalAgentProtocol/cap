# Quickstart for Servers

This is the smallest honest path for exposing a causal engine through CAP.

Start by choosing the lowest conformance level your public interface actually satisfies. CAP rewards honest disclosure more than ambitious labeling. A narrower but truthful Level 1 or Level 2 surface is better than a richer surface that overstates semantics or capabilities.

## 1. Choose The Lowest Honest Level

Choose Level 1 when your public interface can support:

- capability disclosure
- `meta.capabilities`
- `graph.neighbors`
- observational `effect.query`

Choose Level 2 only when your public interface can also support:

- interventional `effect.query`
- `graph.paths`
- structured semantic disclosure for interventional responses

If the answer is uncertain, choose the lower level.

## 2. Publish The Minimum Capability Card

Before tuning ergonomics, publish a truthful capability card.

At minimum, clients should be able to determine:

- `conformance_level`
- `supported_verbs`
- `assumptions`
- `reasoning_modes_supported`
- `graph`
- `authentication`

Richer draft-era fields are useful when stable, but the minimum honest card comes first.

## 3. Expose The Minimum Verb Surface

The smallest useful CAP surface is:

- `meta.capabilities`
- `graph.neighbors`
- `effect.query` for observational use

Level 2 adds:

- `graph.paths`
- `effect.query` for interventional use

`intervene.do` is practical and valuable, but it should not be presented here as the whole conformance boundary.

## 4. Return Semantically Honest Responses

If you return stronger causal claims, disclose them clearly.

For interventional responses, include:

- `reasoning_mode`
- `identification_status`
- `assumptions`

If you cannot support the requested semantics, return a protocol error instead of a stronger-looking answer.

## 5. Keep Draft Gaps Explicit

Current public adapters still trail parts of the richer draft.

Do this:

- align new work to the CAP protocol boundary where possible
- document implementation narrowing explicitly when needed
- keep product-specific behavior in extensions rather than CAP core

## Read Next

- [Write an Honest Capability Card](guides/write-an-honest-capability-card.md)
- [Conformance Specification](../specification/conformance.md)
- [Verbs Specification](../specification/verbs.md)
