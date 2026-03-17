# Choose a Conformance Level

Use this guide to decide whether your first CAP surface should be Level 1 or Level 2.

## Start With The Lowest Honest Level

Choose the lowest level your public interface can satisfy today.

Do not choose based on:

- internal experiments
- unpublished features
- roadmap intent

## Choose Level 1 If

Choose Level 1 when your server can already support:

- a capability card
- `graph.neighbors`
- observational `effect.query`

Level 1 is the right place to start when you can expose useful graph structure or prediction-oriented semantics without making intervention claims.

## Choose Level 2 If

Choose Level 2 only when your public interface can honestly support:

- interventional `effect.query`
- `graph.paths`
- explicit interventional semantic disclosure

That disclosure means returning:

- `reasoning_mode`
- `identification_status`
- `assumptions`

for interventional responses.

## A Good Reality Check

Ask yourself:

- can the server reject unsupported interventional requests cleanly
- can you explain which reasoning modes the engine actually uses
- can you disclose assumptions precisely enough for clients to interpret results
- can you support Level 2 publicly, not just inside a private adapter

If any of those answers is still shaky, you probably want Level 1 first.

## Common Mistakes

- shipping Level 2 because the engine sounds causal rather than because the public interface satisfies the contract
- treating proprietary extensions as CAP core
- advertising `scm_simulation` without the mechanism disclosure needed to justify it

## Practical Recommendation

If you are uncertain, start at Level 1 and document the path to Level 2 explicitly.

That is better than overstating interventional semantics and forcing clients to discover the gap at runtime.

## Read Next

- [Quickstart for Servers](../quickstart-server.md)
- [Conformance Spec](../../specification/conformance.md)
