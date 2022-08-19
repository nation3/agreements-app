# Nation3 Court <!-- omit in toc -->

[Original rational](https://forum.nation3.org/t/nation3-court-a-backbone-to-bootstrap-a-circular-economy-by-increasing-trust-between-citizens/553)

### Table of contents <!-- omit in toc -->

- [Introduction](#introduction)
- [Overall description](#overall-description)
  - [Arbitrable contracts (Agreements)](#arbitrable-contracts-agreements)
  - [Arbitrator](#arbitrator)
- [Further specifications](#further-specifications)

---

## Introduction

A system that allows the creation of agreements between two or more non-trusted parties that are arbitrable by a trusted third party in the case of a dispute.

The scope of this project includes:

- Smart contracts architecture.
- Human-friendly interface to interact with the contracts.

> A contract is a legally enforceable agreement that creates, defines, and governs mutual rights and obligations among its parties.

While common smart contracts guarantee their enforceability by a built-in mechanism defined by code, they fall short of the flexibility or complexity required to resolve complex & subjective human-based disputes.

To resolve complex human-based disputes is required to build complex human-based oracles, such as:

- [Aragon Court](https://github.com/aragon/aragon-court)
- [Kleros](https://github.com/kleros)

In contrast to these projects, Nation3 Court does not aim to be a fully decentralized protocol but a standard to build DAO-centric jurisdictions, where the arbitration power is delegated to one or more trusted decentralized organizations.

## Overall description

The system relies on two basic primitives to work.

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