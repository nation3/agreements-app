# Nation3 Court <!-- omit in toc -->

### Table of contents <!-- omit in toc -->

- [Overall description](#overall-description)
  - [Arbitrable contracts (Agreements)](#arbitrable-contracts-agreements)
  - [Arbitrator](#arbitrator)
- [Further specifications](#further-specifications)

---

## Overall description

The system relies on some basic primitives to work:

- Arbitrable contracts
- Arbitrator

In addition we have to provide human friendly interfaces to operate the system, both to manage agreements and disputes.

### Arbitrable contracts (Agreements)

Contracts must implement the logic to create, define and govern multiple parties' positions.

This logic requirement depends on the type of agreement, so we will delegate specific details on how to implement these operations to each implementation.

However, all arbitrable contracts must implement a method to raise disputes and a common interface to allow arbitrators to settle disputes.

Examples of arbitrable contracts that we can expect in the system:

- Membership agreements
- Hirings
- Service provision contracts
- Conditional payments
- DAO2DAO agreements
- Insurance contracts
- ...

Most agreements will be managed by a type-specific framework defining a common creation, governance, dispute & resolution logic between agreements. These frameworks can be implemented as Clone (proxy) factories or single storage contracts.

### Arbitrator

The arbitrator will be a smart contract owned by a DAO (in our case, Nation3) with the power to settle disputes in other agreements.

The arbitrator could implement default dispute resolution logic or have its control delegated to a third party.

To provide a fair arbitration system, the arbitrator should implement a two-step resolution mechanism in which the parties to an agreement can appeal any settlement before being executed.

In a more advanced implementation, the arbitrator could implement an appeal mechanism that allows for multi-level jurisdictions, for example:  
`Payments court > Finance court > Supreme court > DAO council`

---

## Further specifications

[Jurisdiction V1](./V1/SPEC.md)