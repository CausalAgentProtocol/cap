# Security

## Authentication

A CAP server MUST declare its authentication model in the capability card.

Current `v0.2.2` source materials include models such as:

- `none`
- `api_key`

The capability card MAY describe additional authentication details, but clients MUST be able to determine the basic invocation requirement before making protected requests.

## Disclosure

CAP distinguishes between:

- what a server can compute
- what a server is willing to disclose at a given access level

The protocol MUST allow a server to describe disclosure policy without confusing disclosure class with causal semantics.

## Required Behavior

A server MUST NOT:

- expose hidden detail as if it were raw truth
- claim raw coefficients when values are quantized or summarized
- overstate interventional semantics because of access-tier redaction

If a server redacts, quantizes, or summarizes fields, that policy SHOULD be machine-discoverable where possible.

Redaction or summarization does not relax the server's semantic honesty obligations. A server MUST NOT use disclosure limits as a reason to present a weaker method as a stronger causal claim.
