# Migrate From a Proprietary Causal API

Use this guide when you already have a private causal API and want to expose an interoperable CAP surface without flattening product-specific features into CAP core.

## 1. Inventory What Your API Actually Does

Before you map anything to CAP, list your current public operations and classify them by purpose.

Typical buckets:

- capability discovery
- graph traversal
- observational prediction or estimation
- intervention or simulation
- metadata and health
- product-specific helper endpoints

Do not start by renaming endpoints. Start by understanding what semantic claim each operation makes.

## 2. Separate CAP Core From Product Surfaces

Map operations into three groups:

- CAP core verbs
- CAP convenience verbs
- extensions

Examples:

- neighborhood or path lookup may map to `graph.neighbors` or `graph.paths`
- observational prediction may map to `effect.query` with `query_type: "observational"`
- intervention simulation may map to Level 2 `effect.query` or `intervene.do`
- product-specific helper endpoints should remain extensions

Do not force product discovery surfaces or internal workflow helpers into CAP core just because they already exist.

## 3. Translate Semantics, Not Just Names

The hard part of migration is semantic mapping, not endpoint renaming.

Ask for each existing endpoint:

- is this observational, interventional, or something else
- what assumptions does this result rely on
- what reasoning mode would honestly describe this result
- is the result formally identified, estimated, simulated, or heuristic

If your existing API cannot answer those questions, the migration is not only an adapter exercise. It is also a disclosure exercise.

## 4. Publish A Capability Card Early

The capability card is the front door for CAP clients.

Use it to disclose:

- `conformance_level`
- `supported_verbs`
- `causal_engine`
- `detailed_capabilities`
- `assumptions`
- `reasoning_modes_supported`
- `graph`
- `authentication`

This is where product-specific wording gets replaced with interoperable protocol disclosure.

## 5. Keep Product-Specific Features As Extensions

If your private API has features that are useful but not CAP core, expose them as explicit extensions.

Common cases:

- domain-specific node metadata
- custom traversal helpers
- product-tiered analytics verbs
- preview counterfactual or diagnostic surfaces

Clients should be able to tell clearly which parts are:

- CAP core
- CAP convenience
- your extension surface

## 6. Tighten Error Behavior

A proprietary API may rely on implicit fallbacks or product-specific error conventions.

When migrating to CAP, prefer explicit protocol behavior.

Examples:

- unsupported verbs should return `verb_not_supported`
- Level 1 interventional `effect.query` should return `query_type_not_supported`
- invalid intervention parameters should return `invalid_intervention`

## 7. Do Not Overstate The First CAP Release

Your first CAP surface does not need to expose every internal feature.

A smaller honest Level 1 or Level 2 interface is better than a broader but semantically ambiguous adapter.

## Practical Migration Pattern

For many teams, the cleanest order is:

1. publish `/.well-known/cap.json`
2. implement `meta.capabilities`
3. expose the minimum honest verb surface
4. move proprietary extras into named extensions
5. add richer CAP coverage later if the semantics are stable

## Read Next

- [Choose a Conformance Level](choose-a-conformance-level.md)
- [Write an Honest Capability Card](write-an-honest-capability-card.md)
- [Author a Domain Extension](author-a-domain-extension.md)
