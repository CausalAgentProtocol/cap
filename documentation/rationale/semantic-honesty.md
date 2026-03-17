# Semantic Honesty

Semantic honesty is the CAP design principle that a server should describe what it actually computed, not just return an answer that sounds causally impressive.

This principle matters because causal systems are easy to oversell by accident. The same interface can produce answers that look equally polished while carrying very different semantic weight. CAP tries to make those differences visible instead of leaving them to marketing language or client guesswork.

## The Core Idea

A causal response should tell the client more than the numeric result.

It should also tell the client:

- what kind of reasoning produced the result
- whether the claim is formally identified
- which assumptions the claim depends on
- what provenance explains how the answer was produced

That is why CAP treats fields such as `reasoning_mode`, `identification_status`, `assumptions`, and `provenance` as part of the meaning of a response, not as optional decoration.

## Why This Principle Exists

Many systems can answer causal-shaped questions. Fewer systems can answer them with the same semantics.

If a protocol lets all of these answers look equivalent, clients start making mistakes such as:

- treating a graph propagation score as a formally identified effect
- treating a conditional forecast as if it were an intervention estimate
- treating a mechanism-backed simulation as interchangeable with a reduced-form estimate

Those mistakes are not just theoretical. They affect whether a client should compare answers across servers, whether a result can support policy decisions, and whether a discrepancy is alarming or expected.

## Example 1: Same Wording, Different Intervention Semantics

Imagine two servers both answer:

> If we increase ad spend by 10 percent, conversions increase by about 4 percent.

That sentence sounds the same in both products. But the semantics may be very different.

Server A might mean:

- `reasoning_mode: identified_causal_effect`
- `identification_status: identified`
- assumptions disclosed for identification

Server B might mean:

- `reasoning_mode: graph_propagation`
- `identification_status: not_formally_identified`
- assumptions appropriate to a graph-based propagation method

Both answers may be useful. They are not the same claim. CAP's semantic honesty rule is that Server B should not be allowed to look like Server A just because both are answering an intervention-shaped question.

## Example 2: Same "What If" Prompt, Different Underlying Computation

Imagine two servers both answer:

> What happens to revenue if price is set to 95?

One server may be executing structural mechanisms under intervention semantics:

- `reasoning_mode: scm_simulation`
- provenance showing a mechanism-backed computation path

Another may be returning a predictive conditional estimate:

- `reasoning_mode: conditional_forecast`
- `identification_status: not_applicable`

From the user's perspective, both may look like reasonable what-if answers. From the protocol's perspective, they should not be conflated. A forecast conditioned on historical patterns is not the same thing as an intervention simulation, even if the surface text sounds similar.

## What CAP Requires Because Of This Principle

Semantic honesty is the reason CAP emphasizes:

- capability disclosure up front
- explicit conformance levels
- explicit interventional semantics
- assumptions disclosure
- provenance

The capability card prevents a server from being a black box before invocation.

The response fields prevent the result from being a black box after invocation.

## What Semantic Honesty Does Not Mean

Semantic honesty does not require every server to be maximally powerful.

A server can be useful and still be honest about being:

- observational only
- graph-propagation based
- partially identified
- heuristic in some workflows

CAP is not designed to force all engines into the strongest possible claim. It is designed to force each engine to label its claims correctly.

## The Practical Client Rule

When a response matters, do not stop at the estimate.

Also inspect:

- `reasoning_mode`
- `identification_status`
- `assumptions`
- `provenance`

In CAP, those fields are part of the answer. They are what keep a causal-looking result from quietly pretending to be a different kind of result.
