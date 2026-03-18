# Extensions

Use CAP extensions for implementation-specific or domain-specific behavior that is useful but not yet part of CAP core.

An extension should not be used to smuggle product topology, vendor discovery semantics, or unvalidated implementation details into the normative protocol surface.

## When You Should Use An Extension

Use an extension when a surface does not fit cleanly inside:

- existing CAP core verbs
- existing CAP convenience verbs
- existing capability-card disclosure fields

Good examples include:

- domain-specific request parameters
- domain-specific metadata
- helper verbs useful in one ecosystem
- preview features not yet stable enough for CAP core

## When You Should Not Use An Extension

Do not use an extension to:

- redefine conformance levels
- relabel proprietary verbs as CAP core
- push vendor discovery semantics into the capability card as if they were universal
- bypass semantic honesty requirements

## Design Extensions So Clients Can Ignore Them Safely

A client that understands only CAP core should still be able to:

- discover the server
- invoke the CAP core surface
- ignore the extension when it is not needed

That is the practical test for a clean extension boundary.

## Know When To Propose Standardization

An extension becomes a future CAP-core candidate only when:

- multiple independent implementations need it
- the semantics are stable
- the value is interoperable rather than vendor-specific

Until then, keep it clearly marked as an extension.

## Read Next

- [Extensions Specification](../../specification/extensions.md)
- [Migrate From a Proprietary Causal API](migrate-from-proprietary-causal-api.md)
