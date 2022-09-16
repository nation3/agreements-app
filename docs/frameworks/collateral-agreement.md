# Collateral Agreement <!-- omit in toc -->

[Framework implementation](../../packages/contracts/src/agreements/CollateralAgreement.sol)

> Collateral contracts are independent contracts between two or more parties to a separate agreement. This type of contract is usually made before or simultaneously with the original contract.
> The consideration involved in a collateral contract guarantees that both parties will enter and uphold the original contract.

This framework aims to provide a way for multiple parties to safeguard their rights and obligations towards any kind of contractual relationship through a mutual deposit of collateral.

This framework doesn't implement any logic regarding the actual contract that both parties are operating. Instead, it relies on the weight of the collateral deposited to encourage all the parties to achieve consensual finalization of the same.

To create a collateral agreement, the user only needs to provide the contract terms and define who can join and which is the required collateral to deposit by the joining parties.

To join a collateral agreement, the user must prove they can enter it and provide the required collateral. The collateral will then be held in the contract and define this participant's position in the agreement.

The standard finalization procedure requires all the parties to agree to finalize the contract. If the agreement is disputed, the arbitrator will be the only one capable of finalizing the agreement.

To finalize a disputed agreement, the arbitrator can submit a settlement that adjusts the participants' positions in the agreement.

After the agreement is finalized, all participants can withdraw from it, recovering the collateral in the balance of their position at finalization.

**Practical example:**

- Bob and Alice join a collateral agreement with three tokens each as collateral.
- They have agreed to include in the terms that; if any of the parties breach the agreement, depending on the obligations that are not met, they will compensate the other party with between half and the totality of their collateral.
- Bob doesn't fulfil his contractual obligations, and Alice disputes the agreement.
- The Court reviews the evidence and resolves the dispute in favor of Alice. Based on Bob's missed obligations, the court decided to settle the dispute by giving 2/3 of Bob's collateral to Alice.
- Once the resolution is executed and the agreement is finalized, Bob and Alice can withdraw themselves from the agreement, recovering 1 and 5 tokens, respectively.
