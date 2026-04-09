# Conformance

## Level Model

CAP uses a progressive conformance model:

- Level 0: Narrative
- Level 0.5: Hybrid
- Level 1: Observe
- Level 2: Intervene
- Level 3: Counterfact

The capability card declares `conformance_level`, but clients SHOULD treat that level as a coarse signal and still inspect detailed capability metadata.

Verb meaning is defined in [Verbs](./verbs.md). This page defines which tiers MUST, MAY, or MUST NOT expose those verbs.

Draft Pearl alignment:

- Level 0 sits below Pearl's ladder
- Level 0.5 is only partially aligned to rung 1 semantics
- Level 1 aligns to observational association claims
- Level 2 aligns to intervention claims
- Level 3 aligns to counterfactual claims when later activated

## Tier Summary

| Level | Name | Pearl Alignment | Claim Class | Minimum Core Verbs | Disclosure Burden |
| --- | --- | --- | --- | --- | --- |
| `0` | Narrative | below Pearl hierarchy | Causal-form narrative claims without statistical validation | `meta.capabilities`, `meta.methods`, `narrate` | Highest epistemic caveat burden |
| `0.5` | Hybrid | partial rung-1 alignment only | Mathematically structured inference over partially unvalidated structure, parameters, or assumptions | `meta.capabilities`, `meta.methods`, `narrate` | L0 disclosure plus hybrid-layer disclosure |
| `1` | Observe | rung 1 | Observational claims grounded in statistically validated observational semantics | `meta.capabilities`, `meta.methods`, `observe.predict`, `graph.neighbors`, `graph.markov_blanket` | Observational semantics and assumptions |
| `2` | Intervene | rung 2 | Interventional claims | Level 1 core plus `intervene.do`, `graph.paths` | Formal reasoning mode, identification status, assumptions |
| `3` | Counterfact | rung 3 | Counterfactual claims | reserved in this version | highest disclosure burden |

## Tier-To-Verb Matrix

| Verb | L0 | L0.5 | L1 | L2 | L3 |
| --- | --- | --- | --- | --- | --- |
| `meta.capabilities` | MUST | MUST | MUST | MUST | reserved |
| `meta.methods` | MUST | MUST | MUST | MUST | reserved |
| `narrate` | MUST | MUST | MAY | MAY | reserved |
| `observe.predict` | MUST NOT | MAY, restricted | MUST | MUST | reserved |
| `intervene.do` | MUST NOT | MAY, restricted | MUST NOT | MUST | reserved |
| `graph.neighbors` | MAY | MAY | MUST | MUST | reserved |
| `graph.markov_blanket` | MAY | MAY | MUST | MUST | reserved |
| `graph.paths` | MAY | MAY | MAY | MUST | reserved |

This matrix is the authoritative gate for tier-level verb expectations in this version.

## Level 0: Narrative

Level 0 admits systems that produce causal-form statements without statistical validation.

A Level 0 server MUST implement:

- `meta.capabilities`
- `meta.methods`
- `narrate`

A Level 0 server MUST disclose enough information for a client to understand that:

- the claim is not statistically validated
- the result may be heuristic, extracted, asserted, or generative
- the server is not claiming identified causal effect semantics

Level 0 MUST NOT imply observational or interventional validity.

## Level 0.5: Hybrid

Level 0.5 extends Level 0 for systems that contain a real mathematical inference layer but still depend materially on weaker structure, parameter, or prior provenance.

A Level 0.5 server MUST implement:

- all Level 0 requirements

A Level 0.5 server MAY implement:

- restricted `observe.predict`
- restricted `intervene.do`
- structural graph verbs

only when it can disclose the weaker epistemic status honestly.

A Level 0.5 server MUST disclose, at minimum:

- what part of the system is mathematically structured
- what part of the system is heuristic, generated, expert-authored, or otherwise unvalidated
- why its outputs are not equivalent to Level 1 or Level 2 claims

When a Level 0.5 server exposes `intervene.do`, it MUST disclose weaker semantics such as:

- `reasoning_mode = "graph_propagation"` or another equally explicit weaker mode
- `identification_status = "not_formally_identified"`

Level 0.5 `intervene.do` does not satisfy Pearl rung-2 identified intervention semantics.

Supporting a stronger mathematical layer does not by itself justify Level 1.

Higher tiers MAY still implement `narrate`, but `narrate` is not required above Level 0.5 unless another section of this specification says so explicitly.

## Level 1: Observe

Level 1 is the minimum statistically validated CAP server.

A Level 1 server MUST implement these core verbs:

- `meta.capabilities`
- `meta.methods`
- `observe.predict`
- `graph.neighbors`
- `graph.markov_blanket`

A Level 1 server SHOULD implement these convenience verbs:

- `traverse.parents`
- `traverse.children`

Level 1 MUST NOT imply interventional support.

Level 1 MUST NOT use narrative or hybrid framing as a substitute for observational validation.

Convenience verbs are optional ergonomic wrappers. Supporting them does not change the Level 1 core requirement set or justify a higher declared level.

The Level 1 `observe.predict` result includes:

- `target_node`
- `prediction`
- `drivers`

Level 1 servers MAY also include additional observational semantic disclosure when doing so improves semantic clarity.

When a Level 1 server exposes `graph.markov_blanket`, it MUST NOT describe blanket membership as an identified interventional effect.

## Level 2: Intervene

Level 2 extends Level 1 for engines that can simulate or estimate interventions.

A Level 2 server MUST implement:

- all Level 1 requirements
- `intervene.do`
- `graph.paths`

A Level 2 server SHOULD implement:

- `traverse.parents`
- `traverse.children`

For every `intervene.*` response, the server MUST disclose:

- `reasoning_mode`
- `identification_status`
- `assumptions`

The Level 2 `intervene.do` result includes:

- `outcome_node`
- `effect`
- `reasoning_mode`
- `identification_status`
- `assumptions`

The CAP core `intervene.do` request is intent-only:

- `treatment_node`
- `treatment_value`
- `outcome_node`
- optional `context.graph_ref`

Servers MUST NOT present server-specific execution defaults, such as a fixed mechanism family or a fixed rollout horizon, as if they were generic CAP core parameters that clients are expected to supply or control.

If a server needs richer intervention controls, it SHOULD expose them through an extension or another explicitly non-core surface until CAP standardizes those controls normatively.

Extension verbs remain outside CAP conformance unless this specification explicitly promotes them into CAP core.

## Level 3: Counterfact

Level 3 remains reserved in this version.

In this version:

- servers MUST NOT declare `conformance_level: 3`
- counterfactual technical readiness MAY be disclosed through richer capability metadata
- counterfactual conformance is not yet active because normative schemas and conformance tests are not finalized

## Declaration Rules

A server's declared level MUST align with:

- its supported core verbs
- its actual runtime behavior
- its semantic disclosure behavior

A server MUST NOT declare a higher level merely because it has a related internal algorithm.

A server MUST NOT declare a higher level merely because it exposes convenience verbs or extension verbs beyond the required CAP core surface.

A server MUST NOT declare Level 1 or Level 2 merely because it wraps narrative or hybrid reasoning in causal terminology.

## Capability Metadata Versus Levels

`conformance_level` is intentionally coarse.

Two Level 0.5 servers may differ materially in:

- whether structure is LLM-generated or expert-authored
- whether parameters are heuristic or statistically updated
- whether inference is deterministic or generative
- whether graph or model provenance is disclosed richly or minimally

Two Level 2 servers may also differ materially in:

- whether they model latent confounding
- whether they have executable structural mechanisms
- whether they expose uncertainty methods
- whether they support only graph propagation versus richer intervention semantics

That finer interpretation belongs in:

- `detailed_capabilities`
- `causal_engine`
- `reasoning_modes_supported`
- `assumptions`
