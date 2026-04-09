# Extensions

## Purpose

Extensions allow domain-specific or implementation-specific growth without redefining CAP core.

They are how CAP stays small while still permitting practical adoption across heterogeneous engines and domains.

## What Belongs In An Extension

Examples of extension-worthy content include:

- domain-specific node or metadata schemas
- domain-specific parameters beyond CAP core
- implementation-specific helper verbs
- capabilities that are not yet stable enough for CAP core

## Registration Principle

An extension namespace SHOULD:

- be explicitly named
- declare a schema or contract location
- list the verbs or additional parameters it adds

Clients must be able to distinguish CAP core from extension behavior without relying on vendor guesswork.

## CAP Core Boundary

Do not move a surface into CAP core merely because one implementation uses it.

Examples that remain outside CAP core in the current boundary include:

- product-specific discovery surfaces
- vendor-specific regime operations
- vendor-specific reflexivity operations
- implementation-specific product topology

## Upgrade Path

If an extension becomes broadly useful across independent implementations, it may become a candidate for future standardization.

Until then, it remains an extension and must not be presented as CAP core.
