# Why CAP

CAP exists because generic agent and tool protocols are good at describing how to call a system, but not good enough at describing what a causal answer means.

That gap matters more in causal systems than in ordinary APIs. A causal-looking answer can be useful, weak, strongly identified, simulation-backed, or mostly heuristic. If the protocol does not make those differences explicit, clients are pushed into guesswork at exactly the moment they should be calibrating trust.

## The Problem CAP Is Trying To Solve

Suppose a client asks a server a question that sounds interventional:

> What happens to revenue if price is reduced by 5 percent?

Several systems can return an answer that looks plausible on the surface:

- one system may be returning a formally identified causal effect
- one may be simulating an explicit structural model
- one may be propagating influence over a graph
- one may be returning a conditional forecast that is only intervention-shaped in wording

Those are not interchangeable claims. They rely on different assumptions, have different failure modes, and deserve different levels of trust. A generic tool interface can expose all of them as "callable," but that does not make them semantically comparable.

CAP exists to close that gap.

## What Generic Tooling Usually Gives You

A generic protocol usually tells a client:

- which endpoint or tool to call
- what arguments to send
- what shape of data comes back
- how authentication and transport work

That is useful, but causal interoperability needs more than invocation interoperability.

A client also needs to know:

- whether the server supports observation only or actual intervention semantics
- what kind of causal computation produced the result
- whether the claim is formally identified
- which assumptions the answer depends on
- how to compare one server's answer with another's

Without that layer, "causal API" becomes mostly a product label rather than a protocol contract.

## Why Causal Systems Need Stronger Disclosure

Causal systems are unusually easy to over-read.

Two interfaces can both talk about causes, interventions, and policies while meaning very different things underneath. The words sound similar, but the semantics are not. That is why CAP focuses so much on disclosure before invocation and disclosure alongside results.

The capability card lets a client inspect the server before trusting it.

The response semantics let a client inspect the answer before acting on it.

Together, those two moves turn CAP into more than a transport wrapper. They make the server explain what kind of causal contract it is actually offering.

## What CAP Adds

CAP adds a small, explicit semantics layer for causal services.

In practice, that means CAP standardizes:

- a machine-readable capability card
- a small causal verb surface
- coarse conformance levels
- semantic honesty fields for interventional claims
- provenance that helps clients compare results across servers and over time

This is enough for a client to answer three practical questions:

- what can this server honestly do
- what kind of causal claim is this response making
- what assumptions and production context should shape my trust in it

## Why The Capability Card Comes First

In many protocols, discovery is mostly a convenience feature. In CAP, capability disclosure is part of the safety model.

Before sending a causal request, a client should be able to learn:

- the server's `conformance_level`
- which verbs are supported
- which `reasoning_modes_supported` may appear
- what the server says about its `causal_engine`
- which assumptions it relies on

That matters because a client should not have to infer interventional ability from branding, demos, or prose documentation. CAP's position is that a causal server should disclose its surface in machine-readable form before the client depends on it.

## Why CAP Keeps The Core Small

CAP is not trying to standardize every causal workflow. It standardizes the part that needs to be interoperable across engines and deployments.

That means:

- keeping the core verb surface small
- making conformance levels coarse rather than overly granular
- pushing implementation-specific workflows into convenience verbs or extensions

The goal is not to flatten all causal systems into one engine model. The goal is to make their differences inspectable and comparable without forcing clients to learn a new private contract for every server.

## What CAP Does Not Claim

CAP does not claim that all causal engines are equally good, scientifically equivalent, or substitutable.

It does not standardize:

- how graphs are learned
- which estimation strategy is correct
- how internal mechanisms are implemented
- which product-specific discovery surfaces a vendor wants to expose

CAP standardizes interface, disclosure, and semantic boundaries. It does not standardize the science itself.

## The Short Version

CAP exists because causal interoperability is not only about calling a server. It is about being able to tell, in a structured and comparable way, what kind of causal claim came back and how seriously to take it.

That is the point of CAP's capability card, conformance model, semantic disclosure fields, and provenance. Without them, a causal API is easy to invoke but hard to interpret safely.
