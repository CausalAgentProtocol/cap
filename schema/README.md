# Schema

The [schema layer](./README.md) is the machine-readable CAP contract layer.

This directory contains:

- shared enums and objects
- envelope schemas
- capability-card schemas
- core verb schemas
- minimal valid examples for validation and conformance tooling

Draft notes:

- where older draft-era contracts and the current public adapter diverge, the schema files record both shapes explicitly instead of silently collapsing to one
- the active public core surface includes `meta.capabilities`, `meta.methods`, `observe.predict`, `intervene.do`, `graph.neighbors`, `graph.markov_blanket`, and `graph.paths`
- older `effect.query` artifacts are retained as legacy compatibility records rather than as the active public core surface
- unresolved protocol gaps are marked with `$comment` in the relevant schema file

Rules:

- treat [the specification](../specification/index.md) as the normative prose source of truth
- treat [the schema layer](./README.md) as the machine-validated contract source of truth
- keep implementation-specific extensions or adapter-only reductions explicit when they differ from CAP core
