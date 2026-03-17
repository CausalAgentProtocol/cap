# Extensions

Extensions let CAP stay small at the core while still supporting domain-specific or implementation-specific growth.

The point of an extension is not to bypass CAP. The point is to add useful surface area without pretending that one implementation's special case is now universal protocol behavior.

## Use An Extension When

Use an extension when you need:

- domain-specific node types or metadata
- extra parameters that are outside the CAP core contract
- helper verbs that are useful for one implementation or one vertical
- preview surfaces that are not ready for CAP-wide standardization

## Do Not Expand CAP Core Prematurely

Do not move a surface into CAP core merely because one implementation already has it.

That is especially important for:

- discovery surfaces tied to one product or workflow
- regime-specific or reflexivity-specific operations
- internal helper verbs that do not yet have multi-implementation value

## What Good Extension Disclosure Looks Like

A well-disclosed extension should have:

- an explicit namespace
- a schema or contract location
- a clear list of extension verbs or extra parameters

Clients should be able to distinguish:

- CAP core behavior
- implementation-specific behavior

without reverse-engineering vendor docs.

## The Client Test

A client that only understands CAP core should still be able to:

- discover the server
- call the CAP core surface
- ignore the extension when it is not relevant

If that is not true, the extension boundary is probably not clean enough yet.

## Upgrade Path

An extension can become a future standardization candidate if it proves broadly useful across independent implementations.

Until then, it should stay outside CAP core.

## Read Next

- [Extensions Spec](../../specification/extensions.md)
- [Capability Card](capability-card.md)
