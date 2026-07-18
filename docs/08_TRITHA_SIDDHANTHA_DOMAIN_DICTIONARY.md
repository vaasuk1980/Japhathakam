# Tritha Siddhantha Domain Dictionary
## Document Status

Status: ACTIVE

Authority: Constitutional Domain Document

Owner: Tritha Siddhantha Domain

Version: 1.0

Last Reviewed Sprint: Sprint 8.1
---

# 1. Purpose
This document is the authoritative source for all domain terminology, relationships, governing principles, and business rules used throughout the Japhathakam platform.

Any implementation must conform to the concepts defined in this document.

## Objective

The Tritha Siddhantha Domain Dictionary is the authoritative source of all Tritha Siddhantha knowledge used by the Japhathakam platform.

It defines the domain independently of any programming language, framework, database, user interface, rendering technology, or implementation details.

Every domain concept implemented within Japhathakam shall originate from this document.

This document serves as the constitutional reference for the entire domain model and ensures that all future development remains faithful to the principles of Tritha Siddhantha.

---

## Scope

This document defines:

- Fundamental Vocabulary
- Fundamental Principles
- Core Domain Model
- Domain Relationships
- Governing Principles
- Business Rules
- Reference Data
- Presentation Semantics
- Validation Principles
- Domain Terminology

This document does not define:

- Software Architecture
- User Interface Design
- Database Design
- API Design
- Rendering Technology
- Programming Language Implementation
- Framework-specific Behavior

Those subjects are documented separately within the Japhathakam project.

---

## Authority

Within the Japhathakam project, this document is the highest authority for all Tritha Siddhantha domain knowledge.

Wherever a conflict exists between implementation and this document, the implementation shall be corrected to conform to this Domain Dictionary.

Architecture, calculations, presentation contracts, renderers, reports, APIs, and future modules shall derive their domain behavior from this document.

---

## Guiding Principle

Business Knowledge precedes Software Design.

Software shall implement the domain.

The domain shall never be modified to simplify software implementation.

---

# 2. Core Philosophy

Tritha Siddhantha is the foundational domain model of the Japhathakam platform.

Japhathakam is not an implementation of conventional Vedic astrology. It is an enterprise software platform that implements Tritha Siddhantha while presenting a familiar Traditional Vedic Astrology user experience.

The internal domain model, business rules, and calculation engines are governed exclusively by Tritha Siddhantha.

The external presentation follows traditional astrology conventions to provide a familiar experience for users without exposing internal implementation details.

Accordingly, the platform is founded on the following principles:

- Domain knowledge precedes software design.
- Swiss Ephemeris is the authoritative source of astronomical truth.
- Tritha Siddhantha is the authoritative source of domain truth.
- Presentation shall never alter domain meaning.
- Every business rule shall be traceable to a governing principle.
- Every implementation shall be traceable to the Domain Dictionary.

The objective of Japhathakam is not merely to calculate astrology, but to faithfully preserve and implement the principles of Tritha Siddhantha within a modern, enterprise-grade software platform.

---

# 3. Fundamental Vocabulary
This section defines the fundamental concepts and terminology of Tritha Siddhantha.
Every subsequent principle, rule, calculation, and presentation model is built upon the concepts defined here.

## 3.1 Foundational Frameworks
These concepts define the fundamental frameworks upon which the Tritha Siddhantha universe is established.
Every other domain concept exists within or is derived from these frameworks.

### Kala Chakra

#### Definition

Kala Chakra is the eternal astronomical framework consisting of the twelve fixed Lagnas arranged in their natural sequence.

Within Tritha Siddhantha, all Grahas exist and move only within the Kala Chakra.

Kala Chakra represents astronomical reality and is independent of any individual native.

It does not change according to birth, place, or time. Only the Graha positions within it change.

Kala Chakra forms the astronomical foundation upon which the Karma Chakra is projected.

#### Classification

Fundamental Vocabulary

#### Owner Layer

Domain Layer

#### Notes

- Contains exactly twelve Lagnas.
- Each Lagna has exactly one ruling Graha.
- Grahas never move into the Karma Chakra.
- Kala Chakra exists independently of every horoscope.

### Karma Chakra

#### Definition

Karma Chakra is the karmic framework consisting of twelve Sthanas that are derived by projecting the Kala Chakra through the Janma Lagna.

Unlike the Kala Chakra, the Karma Chakra is not fixed.

For every native, the Janma Lagna becomes the First Sthana, and the remaining eleven Sthanas are established sequentially from it.

The Karma Chakra represents the karmic arrangement used for horoscope interpretation.

Grahas do not move within the Karma Chakra.

The Karma Chakra only represents the projected karmic positions of Grahas from the Kala Chakra.

#### Classification

Fundamental Vocabulary

#### Owner Layer

Domain Layer

#### Notes

- Contains exactly twelve Sthanas.
- Exists only after the Janma Lagna is determined.
- Derived from the Kala Chakra.
- Used for horoscope interpretation.
- Grahas are projected into the Karma Chakra for presentation and interpretation.

## 3.2 Core Domain Entities
These concepts represent the primary entities that exist within the Tritha Siddhantha domain.

### Lagna

#### Definition

A Lagna is one of the twelve fixed divisions of the Kala Chakra.

Each Lagna occupies a permanent position within the Kala Chakra and has exactly one ruling Graha (Lagna Adhipathi).

A Lagna is an astronomical identity within the Kala Chakra and does not change its position or nature.

At the moment of birth, one Lagna is identified as the Janma Lagna. This Janma Lagna becomes the reference point for projecting the Karma Chakra.

#### Classification

Fundamental Vocabulary

#### Owner Layer

Domain Layer

#### Notes

- There are exactly twelve Lagnas.
- Lagnas belong exclusively to the Kala Chakra.
- Every Lagna has exactly one ruling Graha.
- Lagnas never become Sthanas.
- A Lagna is selected as the Janma Lagna based on the birth context.
- The selected Janma Lagna is used to establish the Karma Chakra.

### Janma Lagna

#### Definition

Janma Lagna is the Lagna identified at the exact moment and location of birth.

It represents the reference Lagna selected from the Kala Chakra based on the birth context.

The Janma Lagna serves as the starting point for establishing the Karma Chakra, where it defines the First Sthana and determines the sequence of the remaining eleven Sthanas.

A native has exactly one Janma Lagna for a given birth context.

#### Classification

Fundamental Vocabulary

#### Owner Layer

Domain Layer

#### Notes

- Derived from the birth context.
- Exactly one Janma Lagna exists for every horoscope.
- Belongs to the Kala Chakra.
- Acts as the reference point for constructing the Karma Chakra.
- Remains unchanged for the same birth details.

### Gochara Lagna

#### Definition

Gochara Lagna is the Lagna identified for a specified analysis context, consisting of a selected date, time, and location.

It represents the reference Lagna selected from the Kala Chakra for that analysis context.

The Gochara Lagna serves as the starting point for establishing the Gochara Karma Chakra, where it defines the First Sthana and determines the sequence of the remaining eleven Sthanas for transit analysis.

Unlike the Janma Lagna, the Gochara Lagna changes whenever the analysis context changes.

#### Classification

Fundamental Vocabulary

#### Owner Layer

Domain Layer

#### Notes

- Derived from the analysis context.
- Belongs to the Kala Chakra.
- Acts as the reference point for constructing the Gochara Karma Chakra.
- Changes with the selected date, time, or location.
- Used for transit (Gochara) analysis.

### Sthana

#### Definition

A Sthana is one of the twelve fixed positions within the Karma Chakra.

The twelve Sthanas are established by taking the Janma Lagna or the Gochara Lagna as the reference point and assigning the remaining Sthanas sequentially.

A Sthana represents a karmic position within the Karma Chakra and is used for horoscope presentation and interpretation.

A Sthana is not a Lagna and does not exist independently of the Karma Chakra.

#### Classification

Fundamental Vocabulary

#### Owner Layer

Domain Layer

#### Notes

- Contains exactly twelve positions.
- Exists only within the Karma Chakra.
- Numbered sequentially from First Sthana to Twelfth Sthana.
- Established from a reference Lagna.
- Used to present and interpret projected Graha positions.

### Graha

#### Definition

A Graha is an astronomical entity that exists and moves within the Kala Chakra.

Each Graha occupies a single astronomical position in the Kala Chakra at any given moment.

A Graha always remains in the Kala Chakra. The horoscope expresses the Graha's position relative to the reference Lagna by identifying the corresponding Sthana in the Karma Chakra.

A Graha is an independent domain entity and is never a part of the Karma Chakra itself.

#### Classification

Fundamental Vocabulary

#### Owner Layer

Domain Layer

#### Notes

- Exists only within the Kala Chakra.
- Occupies one astronomical position at any instant.
- Is expressed in the Karma Chakra for horoscope presentation.
- Never becomes a Sthana.
- Can influence multiple Sthanas through Drishti according to Tritha Siddhantha rules.

## 3.3 Domain Contexts
These concepts define the information required to establish a horoscope for a birth event or a selected analysis.

### Birth Context

#### Definition

Birth Context is the complete set of birth information required to identify the Janma Lagna and the astronomical positions of all Grahas at the moment of birth.

The Birth Context defines a unique instant and location from which the Janma Kundali is established.

The Birth Context is the foundation for all birth-based calculations within Tritha Siddhantha.

#### Classification

Fundamental Vocabulary

#### Owner Layer

Domain Layer

#### Notes

- Represents a single birth event.
- Includes the date, time, and geographical location of birth.
- Used to determine the Janma Lagna.
- Used to determine the astronomical positions of all Grahas.
- Produces exactly one Janma Kundali.

### Analysis Context

#### Definition

Analysis Context is the complete set of information required to identify the Gochara Lagna and the astronomical positions of all Grahas for a specified moment and location.

The Analysis Context defines the date, time, and geographical location for which a Gochara Kundali is generated.

Unlike the Birth Context, the Analysis Context is user-selectable and may change whenever a different analysis is requested.

#### Classification

Fundamental Vocabulary

#### Owner Layer

Domain Layer

#### Notes

- Represents a single analysis event.
- Includes the date, time, and geographical location for analysis.
- Used to determine the Gochara Lagna.
- Used to determine the astronomical positions of all Grahas for the selected analysis.
- Produces exactly one Gochara Kundali.

## 3.4 Specialized Lagna Concepts
These concepts represent specific applications of the Lagna concept for different purposes within Tritha Siddhantha.

## 3.5 Kundali Concepts
These concepts define the presentation structures used to represent a horoscope.

### Kundali

#### Definition

A Kundali is the structured representation of a Karma Chakra, consisting of twelve Sthanas together with the Graha positions expressed relative to a reference Lagna.

A Kundali is the fundamental domain representation used for horoscope presentation and interpretation.

A Kundali is independent of its visual layout and may be presented in different formats without changing its domain meaning.

#### Classification

Fundamental Vocabulary

#### Owner Layer

Domain Layer

#### Notes

- Represents one Karma Chakra.
- Contains exactly twelve Sthanas.
- Expresses Graha positions relative to a reference Lagna.
- Independent of visual presentation.
- Serves as the base representation for specialized Kundalis such as the Janma Lagna Kundali and Gochara Kundali.

### Janma Lagna Kundali

#### Definition

A Janma Lagna Kundali is the structured presentation of the Graha positions determined from the native's Birth Context, organized according to the Karma Chakra established by the native's Janma Lagna.

It represents the native's permanent birth horoscope and serves as the foundational reference for all future interpretation and analysis.

#### Classification

Fundamental Vocabulary

#### Owner Layer

Domain Layer

#### Notes

- Established once from the Birth Context.
- The Karma Chakra is established using the native's Janma Lagna.
- The Kundali structure remains unchanged throughout the native's lifetime.
- Graha positions represent the astronomical positions at the time of birth.
- Serves as the permanent reference for interpretation and Gochara analysis.

### Gochara Kundali

### Gochara Kundali

#### Definition

A Gochara Kundali is the structured presentation of the Graha positions determined from a selected Analysis Context, organized according to the native's permanent Karma Chakra established by the Janma Lagna.

The Karma Chakra and Sthana arrangement remain permanently established by the native's Janma Lagna and never change. Only the Graha positions are recalculated for the selected Analysis Context.

The Gochara Kundali is presented alongside the Janma Lagna Kundali to support comparison and interpretation for the selected Analysis Context.

#### Classification

Fundamental Vocabulary

#### Owner Layer

Domain Layer

#### Notes

- Uses the native's permanent Karma Chakra established by the Janma Lagna.
- The First Sthana is always determined by the native's Janma Lagna.
- The Karma Chakra and Sthana arrangement never change.
- Graha positions are calculated from the selected Analysis Context.
- The Analysis Context consists of Date, Time, and Place.
- The current Gochara Lagna may be indicated as an interpretive reference but does not redefine the Karma Chakra or the Sthana arrangement.
- Used together with the Janma Lagna Kundali for Gochara interpretation.

---

# 4. Fundamental Principles

> Reserved

---

# 5. Core Domain Model

> Reserved

---

# 6. Domain Relationships

> Reserved

---

# 7. Governing Principles

> Reserved

---

# 8. Business Rules

> Reserved

---

# 9. Reference Data

> Reserved

---

# 10. Presentation Semantics

> Reserved

---

# 11. Validation Principles

> Reserved

---

# 12. Future Reserved Concepts

> Reserved

---

# 13. Glossary

> Reserved

---

# 14. Change Log

> Reserved