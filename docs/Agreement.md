# Agreement v1 (DRAFT)

An agreement is composed by 5 key components:

- The `termsHash` is a hash of the detailed terms & conditions that all parties agree to when joining an agreement. This terms can be held privately until a dispute is araised, in which case, this hash will be used to verify the allegations submitted to the arbitrator by both parties.
- The `criteria` is the requirement to join an agreement. Indicates the amount of tokens required to join an agreement, or in the case of an advanced criteria, the root of a merkle tree composed of the allowed accounts and amount of tokens per account to join.
- The `party` contains an array of addreses that have joined the agreement.
- The `position` contains an array of positions that take part in the agreement, where each position consists of the following:
- - The `partyId` indicates the id of the party in the `party` array that holds that position.
- - The `balance` indicates the amount of tokens held in the agreement by the party.
- - The `status` indicates the status of the position in the agreement. Currently idle or settled (WIP).

### Colateral

To join an agreement each party must provide a specified amount of tokens that will be held in the agreement contract until the agreement is settled. This colateral must be at least enough to cover the arbitration fee defined in the framework.

When joining an agreement all parties also agree to the meta-agreement of the framework, that allows the arbitrator to manage this colateral as needed on a dispute.

### Settlement

To settle an agreement all parties must agree.

#### On-chain settlement

Agreement to settle will be registered on-chain. When all parties have agreed the agreement is considered settled and each party can withdraw their position from the agreement.

#### Off-chain settlement (TBD)

All parties sign a settlement testimony off-chain that will be verified on-chain. If the settlement is verified the agreement is considered settled and each party can withdraw their position from the agreement.

### Arbitration

If an agreement can't be settled by the parties by consensus, any party can raise a dispute. When dispute is raised the arbitrator will be the only one to be able to settle the agreement.

To settle a dispute the arbitrator will be able to adjust the positions in the agreement as required. This adjustment will be done in a single operation indicating the new arrangement of positions. This operation will settle the agreement by default.

### Appeals (TBD)

When the arbitrator submits a dispute settlement, a grace period will start, during which any party can appeal the settlement. When appealed the arbitration power will be transfered to the higher arbitration instance of the arbitrator.

