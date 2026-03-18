# Migrate From a Proprietary Causal API

Use this guide when you already have a private causal API and want to expose an interoperable CAP surface without flattening product-specific features into CAP core.

Migration should preserve CAP semantics first and transport ergonomics second.

## 1. Inventory What Your API Actually Does

Before mapping anything to CAP, classify current public operations by purpose:

- capability discovery
- graph traversal
- observational prediction or estimation
- intervention or simulation
- metadata and health
- product-specific helper endpoints

Do not start by renaming endpoints. Start by identifying what semantic claim each operation makes.

## 2. Separate CAP Core From Product Surfaces

Map operations into:

- CAP core verbs
- CAP convenience verbs
- extensions

Do not force product discovery surfaces or internal workflow helpers into CAP core just because they already exist.

## 3. Translate Semantics, Not Just Names

For each existing endpoint, ask:

- is this observational, interventional, or something else
- what assumptions does the result depend on
- what reasoning mode would honestly describe the result
- is the claim identified, simulated, heuristic, or merely predictive

If you cannot answer those questions, the migration is also a disclosure exercise.

## 4. Publish A Capability Card Early

Use the capability card to disclose the minimum honest surface first:

- `conformance_level`
- `supported_verbs`
- `assumptions`
- `reasoning_modes_supported`
- `graph`
- `authentication`

Add richer draft-era fields when they are stable and genuinely public.

## 5. Keep Product-Specific Features As Extensions

Useful proprietary surfaces can remain public without becoming CAP core.

Common examples:

- domain-specific node metadata
- custom traversal helpers
- tier-specific analytics verbs
- preview diagnostic or counterfactual helpers

## 6. Tighten Error Behavior

Prefer explicit CAP errors over implicit fallbacks:

- `verb_not_supported`
- `query_type_not_supported`
- `invalid_intervention`

## 7. Do Not Overstate The First CAP Release

A smaller honest Level 1 or Level 2 interface is better than a broader but semantically ambiguous adapter.

## Read Next

- [Quickstart for Servers](../quickstart-server.md)
- [Write an Honest Capability Card](write-an-honest-capability-card.md)
- [Extensions](extensions.md)
