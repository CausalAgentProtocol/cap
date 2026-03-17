# Schema

The `schema/` directory is the machine-readable CAP contract layer.

This directory contains:

- shared enums and objects
- envelope schemas
- capability-card schemas
- core verb schemas
- minimal valid examples for validation and conformance tooling

Draft notes:

- where the long-form v0.2.2 draft and the current public adapter diverge, the schema files record both shapes explicitly instead of silently collapsing to one
- unresolved protocol gaps are marked with `$comment` in the relevant schema file

Rules:

- treat `specification/` as the normative prose source of truth
- treat `schema/` as the machine-validated contract source of truth
- keep implementation-specific extensions or adapter-only reductions explicit when they differ from CAP core
