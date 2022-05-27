# Specs for Nation3 Court

See [rationale and initial proposal](https://forum.nation3.org/t/nation3-court-a-backbone-to-bootstrap-a-circular-economy-by-increasing-trust-between-citizens/553) to learn more.

Needed contracts/components:

## VotingEscrow

- Needs a customized version of `VotingEscrow`, with an added function for an address to burn and transfer $NATION.
- Might be worth it to deploy a different one and keep two veTokens, or to deploy a new one and perform a migration. Tradeoffs are:
  - Having two veTokens means less capital efficiency (cannot use your $veNATION for both being a citizen and participating in agreements).
  - Having one veToken means locked $NATION, which is most of the supply, can be burned by a contract. Even with proper safeguards in place, there can be bugs, attacks, etc.

## Agreement

- `createAgreement(hash, lockAmount)`: Creates an agreement with a hash (hash of the file with the human-readable text of the agreement) and a lock amount (maximum amount to be slashed in case of breach).
- `enterAgreement(id)`: Enters an agreement, which means that the $veNATION is escrowed by the court contract and can be slashed by it.
- `resolveDispute(address, outcome, amount)`: Resolves the agreement for an address (which must have entered the agreement). Depending on the outcome for that address, it either slashes an amount (if ruled against), or gives back an extra amount (if ruled in favor). It also removes the ability for the agreement contract to slash the lock amount, meaning that the address is done with the agreement. It should first collect the negative amounts, so the contract has funds to send the positive ones afterwards. This is a protected function only called by the court contract.
- `finishAgreement(id, signatures)`: Finishes the agreeement if all parts are in favor of doing so (by signing a confirmation message). Checks all signatures from participants, and if valid, releases all the locks.

## Court

- 7/9 multisig. Members are elected once a year, and they must enter an agreement (meta-agreement) with a significant $veNATION stake, which can be slashed by the DAO. If a member gets their lock slashed, they are kicked out of the multisig.
- Calls from the multisig need to have a delay, and in that delay $veNATION holders should be able to stop transactions from executing. This is in case the multisig goes rogue or the jury misbehaves.
- Challenge: Gnosis Safe doesn’t have a way to give permission to another entity to control the multisig’s signatories. Aragon would work great, but it’s expensive to vote (may be worth it though).
- Challenge: Gnosis Safe has a timelock, but it looks quite clunky/hacky. This, again, could be very easily implemented in Aragon with the [Delay app](https://github.com/1Hive/delay-app)
