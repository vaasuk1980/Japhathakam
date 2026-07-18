# Core Domain Model

## Purpose

The Core Domain Model defines the software representation of the Tritha Siddhantha business domain.

Its responsibility is to transform the frozen business language defined in the Domain Dictionary into explicit Domain-Driven Design (DDD) constructs that are independent of:

- User Interface
- Database
- APIs
- Frameworks
- Astronomy libraries
- Calculation engines
- Infrastructure

The Core Domain Model represents business meaning only.

Every domain concept is classified according to DDD principles as one of the following:

- Entity
- Value Object
- Aggregate
- Domain Service
- Domain Event
- Repository

The Core Domain Model becomes the single authoritative source for all business behavior within Japhathakam.

Architecture, application services, persistence, and presentation layers must depend on this model—not the reverse.

---

## Entities

### Graha

**Classification:** Entity

**Reasoning:**
A Graha possesses a permanent business identity (e.g., Ravi, Chandra, Kuja, Bhumi, Mitra, Chitra) that remains constant across all Analysis Contexts. The time-dependent astronomical information associated with a Graha is modeled separately. Therefore, Graha is classified as an Entity rather than a Value Object.

**Identity:**
- Immutable business identifier defined by the Tritha Siddhantha domain.
- Examples: Ravi, Chandra, Kuja, Budha, Guru, Sukra, Shani, Rahu, Ketu, Bhumi, Mitra, Chitra.

**Associated Information (managed outside the Graha Entity):**
- Longitude
- Nakshatra
- Pada
- Sthana
- Other domain attributes defined in future iterations

**Notes:**
A Graha represents the permanent celestial identity defined by the Tritha Siddhantha domain. It is independent of astronomical calculation engines, infrastructure, persistence mechanisms, and presentation concerns.

**Architectural Constraint**

A Graha represents only its permanent business identity.

Time-dependent astronomical information (such as longitude, Nakshatra, Pada, and Sthana) does not belong to the Graha Entity itself. That information belongs to a separate domain concept associated with a specific Analysis Context and referenced by a Kundali.

This separation enables the same Graha to participate simultaneously in multiple Kundalis (e.g., Janma Lagna Kundali and Gochara Kundali) without conflicting state.

### Sthana

**Reasoning:**
A Sthana represents a permanent business concept within the Karma Chakra. Its identity is fixed by its position in the Karma Chakra (First Sthana through Twelfth Sthana). While different Grahas may occupy a Sthana under different Analysis Contexts, the Sthana itself never changes. Therefore, Sthana is classified as an Entity rather than a Value Object.

**Identity:**
- Immutable business identifier defined by the Tritha Siddhantha domain.
- Examples:
  - First Sthana
  - Second Sthana
  - Third Sthana
  - ...
  - Twelfth Sthana

**Associated Information (managed outside the Sthana Entity):**
- Occupying Grahas
- Graha positions within the Sthana
- Time-dependent astronomical information
- Other analysis-specific information defined in future iterations

**Notes:**
A Sthana represents a permanent location within the Karma Chakra. It is independent of astronomical calculation engines, infrastructure, persistence mechanisms, and presentation concerns.

**Architectural Constraint**

A Sthana represents only its permanent business identity.

Time-dependent information, including which Grahas occupy the Sthana, does not belong to the Sthana Entity itself. That information belongs to a separate domain concept associated with a specific Analysis Context and referenced by a Kundali.

This separation enables the same Sthana to participate simultaneously in multiple Kundalis (for example, Janma Lagna Kundali and Gochara Kundali) without conflicting state.

### Lagna

**Reasoning:**
A Lagna represents one of the permanent signs defined by the Kala Chakra. Its identity never changes, although different Analysis Contexts may determine which Lagna is active. Therefore, Lagna is classified as an Entity rather than a Value Object.

**Identity:**
- Immutable business identifier defined by the Tritha Siddhantha domain.
- Examples:
  - Mesha
  - Vrishabha
  - Mithuna
  - Karka
  - Simha
  - Kanya
  - Tula
  - Vrischika
  - Dhanussu
  - Makara
  - Kumbha
  - Meena

**Associated Information (managed outside the Lagna Entity):**
- Active Analysis Context
- Longitude
- Time-dependent astronomical information
- Other analysis-specific information defined in future iterations

**Notes:**
A Lagna represents a permanent identity within the Kala Chakra. It is independent of astronomical calculation engines, infrastructure, persistence mechanisms, and presentation concerns.

**Architectural Constraint**

A Lagna represents only its permanent business identity.

The active Lagna for a particular analysis is determined by the associated Analysis Context. Time-dependent astronomical information does not belong to the Lagna Entity itself.

This separation enables the same Lagna to participate simultaneously in multiple Kundalis (for example, Janma Lagna Kundali and Gochara Kundali) without conflicting state.
---

## Value Objects

### Analysis Context

**Reasoning:**
An Analysis Context defines the conditions under which a Kundali is produced. It has no independent business identity and is completely defined by its values. If any of those values change, it represents a different Analysis Context. Therefore, it is classified as a Value Object.

**Characteristics:**
- Immutable.
- Equality is determined entirely by its values.
- Independent of infrastructure and presentation concerns.

**Typical Information:**
- Analysis type (e.g., Janma Lagna, Gochara)
- Analysis date and time
- Geographic location
- Time zone
- Other analysis parameters defined by the domain

**Responsibilities:**
- Defines the context for generating a Kundali.
- Ensures all information within a Kundali belongs to the same analysis conditions.
- Provides a consistent basis for domain calculations and interpretation.

**Architectural Constraint**

An Analysis Context does not own Grahas, Sthanas, or a Kundali.

It defines the immutable conditions under which a Kundali is established. Changing any value of an Analysis Context results in a new Analysis Context rather than modifying an existing one.

### Birth Context

**Reasoning:**
A Birth Context defines the immutable birth information required to establish a person's Janma Lagna Kundali. It has no independent business identity and is completely defined by its values. If any value changes, it represents a different Birth Context. Therefore, it is classified as a Value Object.

**Characteristics:**
- Immutable.
- Equality is determined entirely by its values.
- Independent of infrastructure and presentation concerns.

**Typical Information:**
- Date of birth
- Time of birth
- Geographic location of birth
- Time zone
- Other birth-related domain parameters defined by the domain

**Responsibilities:**
- Defines the birth conditions for generating a Janma Lagna Kundali.
- Provides the immutable input required for birth-based domain analysis.
- Serves as the foundation for deriving the corresponding Analysis Context for birth analysis.

**Architectural Constraint**

A Birth Context does not own a Kundali, Grahas, or Sthanas.

It represents only the immutable birth conditions. Changing any value results in a new Birth Context rather than modifying an existing one.


### Janma Lagna

**Reasoning:**
A Janma Lagna represents the Lagna determined from a specific Birth Context. It has no independent business identity and is completely defined by its values. If any value of the underlying Birth Context changes, a different Janma Lagna is produced. Therefore, Janma Lagna is classified as a Value Object.

**Characteristics:**
- Immutable.
- Equality is determined entirely by its values.
- Derived from a Birth Context.
- Independent of infrastructure and presentation concerns.

**Typical Information:**
- Lagna
- Longitude
- Other birth-specific domain information defined in future iterations

**Responsibilities:**
- Represents the Lagna determined for a Birth Context.
- Serves as the basis for establishing a Janma Lagna Kundali.
- Provides an immutable birth-specific Lagna for domain analysis.

**Architectural Constraint**

A Janma Lagna does not own a Kundali, Grahas, or Sthanas.

It represents only the immutable Lagna determined from a Birth Context. Changing the Birth Context results in a new Janma Lagna rather than modifying an existing one.

### Gochara Lagna

**Reasoning:**
A Gochara Lagna represents the Lagna determined from a specific Analysis Context. It has no independent business identity and is completely defined by its values. If any value of the underlying Analysis Context changes, a different Gochara Lagna is produced. Therefore, Gochara Lagna is classified as a Value Object.

**Characteristics:**
- Immutable.
- Equality is determined entirely by its values.
- Derived from an Analysis Context.
- Independent of infrastructure and presentation concerns.

**Typical Information:**
- Lagna
- Longitude
- Other analysis-specific domain information defined in future iterations

**Responsibilities:**
- Represents the Lagna determined for an Analysis Context.
- Serves as the basis for establishing a Gochara Kundali.
- Provides an immutable analysis-specific Lagna for domain analysis.

**Architectural Constraint**

A Gochara Lagna does not own a Kundali, Grahas, or Sthanas.

It represents only the immutable Lagna determined from an Analysis Context. Changing the Analysis Context results in a new Gochara Lagna rather than modifying an existing one.
---

## Aggregates

### Kundali

**Classification:** Aggregate

**Reasoning:**
A Kundali is the consistency boundary for a specific Analysis Context. It groups together the domain information required to represent a complete astrological chart while ensuring that all contained information belongs to the same Analysis Context.

**Boundary Responsibilities:**
- Represents one Analysis Context.
- Coordinates all domain information belonging to a single Analysis Context.
- Maintains consistency of all information within the chart.
- Serves as the root of the Kundali Aggregate.

**Specializations:**
- Janma Lagna Kundali
- Gochara Kundali

---

## Domain Services

> Reserved

---

## Domain Events

> Reserved

---

## Repositories

### Kundali Repository

**Reasoning:**

The Kundali Aggregate is the consistency boundary of the domain model. A repository provides an abstraction for storing and retrieving Kundali Aggregates while keeping the domain independent of database technology and infrastructure concerns.

**Responsibilities:**
- Save a Kundali Aggregate.
- Retrieve a Kundali Aggregate.
- Update a Kundali Aggregate.
- Remove a Kundali Aggregate when required.
- Hide persistence implementation details from the domain.

**Architectural Constraint**

A Repository belongs only to an Aggregate Root.

It does not contain business rules, calculations, or application logic. Its sole responsibility is persistence abstraction for the Kundali Aggregate.