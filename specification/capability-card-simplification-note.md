# Capability Card Simplification Note

## Status

Discussion note for a future CAP revision.

This document does not change the active `v0.3.0` schema by itself.

## Problem

The current capability-card shape carries avoidable duplication across three discovery surfaces:

- `supported_verbs`
- `extensions`
- `meta.methods`

In practice, the most obvious duplication is:

- `supported_verbs.extensions`
- `extensions.<namespace>.verbs`

Both encode the extension verb inventory.

The current shape also allows capability cards to repeat field-level invocation metadata that already belongs in `meta.methods`, especially through:

- `extensions.<namespace>.additional_params`
- `extensions.<namespace>.additional_result_fields`

This increases token cost, increases drift risk, and makes it harder to explain what each discovery surface is for.

## First-Principles Goal

The capability card should answer only this:

"What server is this, what surface does it expose, and what should a client know before making a call?"

It should not also try to be the per-verb schema catalog.

That is what `meta.methods` is for.

## Design Principle

Each fact should have one natural home.

### Proposed responsibility split

- Capability card:
  - server identity
  - endpoint
  - conformance and trust posture
  - high-level surface summary
  - graph and authentication disclosure
  - extension namespace summary

- `meta.methods`:
  - per-verb request metadata
  - per-verb success-result metadata
  - examples
  - field-level detail

## Proposed Simplifications

### 1. Keep extension verb inventory only inside `extensions`

Proposed shape:

```json
{
  "supported_verbs": {
    "core": ["meta.capabilities", "meta.methods", "narrate"],
    "convenience": []
  },
  "extensions": {
    "abel.stateful": {
      "verbs": [
        "extensions.abel.stateful.search_prepare",
        "extensions.abel.stateful.predict"
      ],
      "notes": [
        "Stateful workflow and handle-oriented verbs."
      ]
    }
  }
}
```

Implication:

- `supported_verbs.extensions` is removed in a future schema revision.
- extension verbs are disclosed once, in their namespace container.

Why this is simpler:

- core and convenience are protocol-level top categories
- extensions already require namespace grouping
- clients can flatten `extensions.*.verbs` when they need one full verb list

## 2. Remove field-level extension metadata from the capability card

Proposed change:

- remove `extensions.<namespace>.additional_params`
- remove `extensions.<namespace>.additional_result_fields`

Those details belong in `meta.methods`.

Why this is simpler:

- the capability card stays compact
- there is one clear place for invocation metadata
- servers do not need to maintain two parallel field catalogs

## 3. Prefer omission of empty disclosure groups

For compact capability cards, empty groups should be omitted from examples, SDK builders, and recommended server output where schema compatibility allows it.

Examples:

- omit empty `convenience`
- omit empty `extensions`
- omit empty `access_tiers`
- omit empty `bindings`

This is not a semantic change. It is a disclosure compactness rule.

## 4. Keep capability-card extension entries summary-level only

After simplification, an extension namespace entry should only need:

- `verbs`
- `notes`
- optional `schema_url`

That makes `extensions` a namespace summary rather than a second method catalog.

## Recommended Future Shape

### Capability card

Keep:

- `endpoint`
- `conformance_level`
- `conformance_name`
- `supported_verbs.core`
- `supported_verbs.convenience`
- `assumptions`
- `reasoning_modes_supported`
- `graph`
- `authentication`
- `disclosure_policy`
- `extensions.<namespace>.verbs`
- `extensions.<namespace>.notes`
- `extensions.<namespace>.schema_url`

Remove in next schema revision:

- `supported_verbs.extensions`
- `extensions.<namespace>.additional_params`
- `extensions.<namespace>.additional_result_fields`

### `meta.methods`

Continue to own:

- field descriptors
- examples
- per-verb argument/result detail
- extension-only parameter and result shape disclosure

## Coherence Rule

The protocol should keep these three discovery layers distinct:

- capability card: server summary
- extension namespace block: extension grouping
- `meta.methods`: invocation detail

If the same structured fact appears in more than one of those layers, the format is probably too redundant.

## Migration Path

### Low-risk path

1. Update documentation guidance and examples first.
2. Stop emitting duplicated extension field metadata in SDK examples.
3. Keep `v0.3.0` schema backward-compatible while encouraging compact cards.
4. Remove duplicated fields in the next schema revision.

### Breaking-change path

In the next capability-card schema revision:

- delete `supported_verbs.extensions`
- delete `additional_params`
- delete `additional_result_fields`

## Additional Simplification Candidates

These are lower priority than the extension cleanup above.

### Candidate A: derive `conformance_name` from `conformance_level`

This would remove one more duplicated field, but it is more disruptive because:

- it affects readability
- it changes a widely visible part of the card

This is not recommended as the first simplification step.

### Candidate B: shrink graph disclosure overlap

`graph.scope` and `graph.coverage_description` can both turn into long prose.

A future cleanup could make one field the short structured summary and the other explicitly optional long-form explanation.

This is secondary to the extension duplication issue.

## Recommendation

The next CAP schema cleanup should focus on one narrow goal:

make the capability card a compact server-summary document, and make `meta.methods` the only field-level verb-discovery surface.

That gives the largest reduction in duplication with the smallest conceptual change.
