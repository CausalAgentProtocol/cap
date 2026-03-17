# Author a Domain Extension

Use this guide when you need to extend CAP for a specific domain without destabilizing CAP core.

The point of an extension is to add value without pretending that one implementation's special case is now universal protocol behavior.

## 1. Confirm That You Really Need An Extension

First ask whether the capability already fits inside:

- existing CAP core verbs
- existing CAP convenience verbs
- existing capability-card disclosure fields

If it does, use the core contract directly.

Create an extension only when the new surface is genuinely outside current CAP core.

## 2. Good Candidates For Domain Extensions

Common examples:

- domain-specific node taxonomies
- domain-specific response metadata
- extra request parameters tied to one vertical
- helper verbs that are useful within one domain but not yet broadly interoperable

## 3. Keep The Boundary Visible

A domain extension should be easy for clients to identify as an extension.

That means:

- use an explicit namespace
- publish a schema or contract location
- list the extension verbs or extra parameters clearly
- avoid mixing extension-only fields into CAP core examples without labeling them

## 4. Design The Extension So Clients Can Ignore It Safely

A client that only understands CAP core should still be able to:

- discover the server
- invoke the CAP core surface
- ignore the extension if it is not needed

That is a good test of whether the extension boundary is clean.

## 5. Avoid Polluting CAP Core Terminology

Do not rewrite CAP core concepts to fit one domain.

For example:

- do not redefine conformance levels
- do not relabel extension verbs as CAP core
- do not add product-specific discovery semantics to the capability card as if they were universal

## 6. Decide Whether The Extension Is Stable Enough To Publish

Before publishing, ask:

- is the shape stable enough for external clients
- can the semantics be described clearly
- would another implementation understand what this extension means

If not, keep iterating before presenting it as a public extension contract.

## 7. Know When To Propose Future Standardization

An extension may become a future CAP-core candidate when:

- multiple independent implementations need the same concept
- the semantics are stable and reusable
- the value is interoperable rather than product-specific

Until then, keep it as an extension.

## Read Next

- [Extensions](../concepts/extensions.md)
- [Extensions Spec](../../specification/extensions.md)
- [Migrate From a Proprietary Causal API](migrate-from-proprietary-causal-api.md)
