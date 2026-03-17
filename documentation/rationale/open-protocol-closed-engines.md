# Open Protocol, Closed Engines

CAP is an open protocol. That does not imply that every engine behind a CAP server must be open source, open weights, or open data.

The protocol boundary and the engine boundary are different. CAP standardizes the interface and disclosure layer. It does not require every implementation detail behind that interface to be public.

## What "Open" Means Here

When CAP says the protocol is open, it means the protocol contract is open:

- the wire semantics are public
- the capability model is public
- the conformance model is public
- independent implementations can adopt it

That is enough for clients and servers to interoperate without private agreements on the core causal surface.

## What "Open" Does Not Mean

It does not mean a server must open:

- its model weights
- its training data
- its graph construction pipeline
- its internal structural mechanism code
- its proprietary ranking or estimation stack

An engine can remain closed and still participate honestly in CAP, as long as it exposes the protocol surface and discloses its semantics truthfully.

## Why CAP Draws The Boundary This Way

If CAP required open internals from every implementation, it would stop being a general interoperability protocol and become a licensing position.

That would narrow adoption without improving the thing CAP is actually trying to protect: the client's ability to understand what kind of causal contract the server is offering.

CAP's job is to make the server disclose:

- what level it supports
- which verbs it supports
- which reasoning modes it may return
- what assumptions shape those results
- what provenance helps explain how a result was produced

That disclosure is the protocol's openness boundary. It is what lets a client compare systems that differ internally.

## What Closed Engines Still Owe The Client

Closed engines do not get a pass on semantic honesty.

A proprietary implementation still has to avoid:

- claiming stronger conformance than it actually implements
- advertising reasoning modes it cannot technically defend
- hiding implementation-specific behavior inside CAP core labels

In other words, CAP allows closed engines. It does not allow closed semantics.

## Why This Matters For Ecosystem Design

Healthy protocol ecosystems often include a mix of:

- open reference implementations
- commercial hosted services
- hybrid deployments with proprietary internal components

CAP is designed to support that mix. A client should be able to speak the same protocol to all of them while still seeing, through capability disclosure and response semantics, where their claims differ.

## The Practical Reading

The right mental model is simple:

- CAP core should be open
- CAP conformance should be testable
- engine internals may be open or closed
- implementation-specific differentiators should stay out of CAP core

That is how CAP can remain an open standard surface without pretending that every causal engine in the ecosystem will share the same implementation or licensing model.
