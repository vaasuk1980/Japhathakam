# ADR-008

## Title

Tritha Siddhantha Domain Dictionary is the Constitutional Source of Domain Truth

## Status

ACCEPTED

## Context

The Japhathakam platform implements the Tritha Siddhantha system as an enterprise software platform.

As the project grows, domain concepts, business rules, governing principles, calculations, APIs, UI, reports, and presentation models will all depend upon a consistent domain language.

Without a single authoritative source, terminology and implementation may diverge over time.

## Decision

The document `08_TRITHA_SIDDHANTHA_DOMAIN_DICTIONARY.md` is established as the constitutional source of truth for all domain concepts used throughout the Japhathakam platform.

All implementation artifacts, including software architecture, calculation engines, presentation models, APIs, documentation, and user interfaces, shall conform to the definitions contained within this document.

If a conflict exists between implementation and the Domain Dictionary, the Domain Dictionary shall be considered authoritative until an approved architectural decision updates it.

## Consequences

- Domain terminology remains consistent across the platform.
- Business rules become implementation-independent.
- Documentation and software evolve together.
- Future contributors have a single authoritative domain reference.