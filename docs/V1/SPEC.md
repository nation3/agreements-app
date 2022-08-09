# Nation3 Court Jurisdiction V1 <!-- omit in toc -->

[Nation3 Court Spec](./SPEC.md)

### Table of contents <!-- omit in toc -->
- [Introduction](#introduction)
- [Collateral agreements](#collateral-agreements)
  - [Collateral](#collateral)
  - [Agreement definition](#agreement-definition)
  - [Agreement identifier](#agreement-identifier)
  - [Agreement positions](#agreement-positions)
  - [Agreement status](#agreement-status)
  - [Agreement creation](#agreement-creation)
  - [Joining an agreement](#joining-an-agreement)
    - [Joining agreement with permit](#joining-agreement-with-permit)
  - [Agreement finalization](#agreement-finalization)
    - [Finalize agreement (on-chain)](#finalize-agreement-on-chain)
    - [Finalize agreement (off-chain)](#finalize-agreement-off-chain)
  - [Dispute agreement](#dispute-agreement)
  - [Dispute settlement](#dispute-settlement)
  - [Withdraw position](#withdraw-position)
- [Court (Arbitrator V1)](#court-arbitrator-v1)
  - [Submit resolution](#submit-resolution)
  - [Appeal resolution](#appeal-resolution)
  - [Execute resolution](#execute-resolution)
- [User Interfaces](#user-interfaces)
- [Agreements indexers](#agreements-indexers)

---

## Introduction

To bootstrap & test the system, we are implementing an initial simplified version with:
- One type of agreement framework
- Single-level arbitration system

---

## Collateral agreements

> Collateral contracts are independent contracts between two or more parties to a separate agreement. This type of contract is usually made before or simultaneously with the original contract.
> The consideration involved in a collateral contract guarantees that both parties will enter and uphold the original contract.

This framework aims to provide a way for multiple parties to guarantee an independent agreement through depositing an agreed collateral balance.

We will implement this framework through a single storage contract.
It will manage a collection of agreements through storage structs.
It will hold all agreement funds.
It will only accept NATION as a collateralization token.

[Agreement Framework Interface]()
[Collateral Agreement Framework Implementation]()

### Collateral

Each party must provide a specified amount of tokens to join an agreement. The smart contract will hold those tokens until the agreement is finalized.

### Agreement definition

Each agreement is composed by:

- A hash of the detailed terms of the agreement in human-readable text. This guarantees that all joining parties and arbitrators can verify the terms of the agreement without making them public.
- A criteria tree root. The criteria tree is a Merkle tree containing all the addresses allowed and their balance required to join an agreement.
- The positions of the parties that joined the agreement.

### Agreement identifier

Each agreement is linked to a unique identifier throughout the system.

The identifier is used on interfaces, events, and databases to reference an agreement or a dispute raised from the agreement.

The identifier should be generated from the framework's address + framework nonce. Alternatively: the terms hash + nonce.

### Agreement positions

An agreement position is composed by:

- The address of the holder. (the party)
- The balance of the position. (the deposit)

### Agreement status

An agreement can have one of these statuses:

- `Created` When it's created, but no parties have joined.
- `Ongoing` At least two parties have joined.
- `Disputed` When a dispute is raised.
- `Finalized` When it has been successfully finalized.

### Agreement creation

When creating a collateral agreement, must be provided:
- The hash of the terms of the agreement.
- The criteria tree root.
- (Optionally) The URI of the agreement's metadata.

The creator of the agreement does not need to be one of the parties.
If the creator decides to link public metadata to the agreement this metadata URI will be used to retrieve it.

### Joining an agreement

To join an agreement an account must prove membership to the criteria tree. To do this, the user will provide a criteria resolver.

The criteria resolver is composed by:
- The address of the party joining, it must match the caller.
- The deposit balance to join with, it must be available for transfer.
- The Merkle proofs to validate the membership to the criteria tree with the previous parameters.

When joining an agreement, the party joining is implicitly accepting to comply with the terms of the specific agreement joining as well as the terms of the agreement framework.

#### Joining agreement with permit

As NATION implements EIP-2612, the contract can approve and transfer the required funds in the same transaction.

In addition to the criteria resolution, the user must provide a valid permit to transfer the specified amount. Permit is composed by:

- The amount of tokens allowed to transfer, must be equal or greater to the amount required to join.
- The deadline of the permit.
- The ECDSA signature components.

### Agreement finalization

An agreement can be finalized by:
- Unanimity of all the parties through on-chain signaling.
- Unilateral settlement by the arbitrator after a dispute.

#### Finalize agreement (on-chain)

Parties signal they are willing to finalize the agreement by executing an agreement finalization on-chain.

When all parties have finalized, the agreement is considered finalized.

#### Finalize agreement (off-chain)

All parties sign a finalization testimony off-chain that is submitted to the contract for verification.

The contract will finalize all the positions automatically if it's valid, so the agreement is also finalized.

### Dispute agreement

Any parties can dispute an ongoing agreement by on-chain signaling.

This action will set the agreement in a dispute status from which only can be finalized by the framework arbitrator.

### Dispute settlement

When an agreement is in dispute can be unilaterally finalized by its arbitrator.

When finalizing the agreement, the arbitrator will provide a set of party positions to finalize the agreement with.

The arbitrator can adjust the balance of the previously existing positions. The final total balance must match the previous total balance of the agreement.

The arbitrator will provide all the adjustments in a single operation that will automatically finalize the agreement.

### Withdraw position

Once an agreement is finalized, all parties can withdraw from the agreement with their final balances.

--- 

## Court (Arbitrator V1)

The initial agreements arbitrator will be a contract owned by the DAO but controlled by a multi-sig of accounts elected by the DAO to resolve disputes, hereafter called Jurors.

These jurors will enter an agreement with the DAO providing significant collateral that would be slashable by the DAO in case of misbehavior.

### Submit resolution

Once jurors reach a consensus, they will submit a resolution to settle an agreement in dispute. They will provide:

- The framework that manages the agreement in dispute.
- The identification of the agreement in dispute.
- The set of finalization positions.

Once submitted, a resolution will enter a review period before being able to execute.

The span of the review period could be changed in the future but we propose 48 hours.

### Appeal resolution

During the review period, any parties involved in a resolution can appeal it.

Once appealed, the resolution won't be executable unless the DAO overrides the appeal by actively ratifying the resolution.

### Execute resolution

If a resolution goes through the entire review period without being appealed or it counts with the DAO support, anyone can execute it.

Executing a resolution will settle the dispute with the provided resolution on the framework of the agreement.

---

## User Interfaces

We will provide user-friendly interfaces to manage both agreements and disputes.

[Agreements UI Specs](./AgreementsUI.md)
[Jurors UI Specs](./JurorsUI.md)

---

## Agreements indexers

We will implement a dedicated subgraph for the system that will index both framework and arbitrator's events to track the status of agreements & disputes.
