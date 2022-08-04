# Jurors UI <!-- omit in toc -->

A page to create & manage disputes.

- [Use Cases](#use-cases)
  - [Create a resolution proposal](#create-a-resolution-proposal)
  - [Approve resolution proposal](#approve-resolution-proposal)
  - [Reject resolution proposal](#reject-resolution-proposal)
  - [Submit resolution proposal](#submit-resolution-proposal)
  - [Appeal resolution](#appeal-resolution)
  - [Execute resolution](#execute-resolution)
- [Views](#views)
  - [Resolution creation](#resolution-creation)
  - [Dispute details](#dispute-details)
    - [As jurors](#as-jurors)
    - [As users](#as-users)
  - [Dispute list](#dispute-list)
- [Integrations](#integrations)

## Use Cases

### Create resolution proposal

Any juror can propose a resolution for a dispute.
They will need to provide a valid settlement for the dispute.

**Steps:**
1. The user fills the parties and balances for the settlement.
2. The system checks that the settlement is valid and shows the result to the user.
3. The user submits the resolution proposal.
4. The system generates the message to sign.
5. The user signs the message.
6. The system stores the signed message.

### Approve resolution proposal

Jurors can approve proposed resolution submissions.

**Steps:**
1. The user triggers the approval.
2. The system generates the message to sign.
3. The user signs the message.
4. The system stores the signed message.

### Reject resolution proposal

Jurors can approve proposed resolution submissions.

**Steps:**
1. The user triggers the rejection.
2. The system generates the message to sign.
3. The user signs the message.
4. The system stores the signed message.

### Submit resolution proposal

Once a resolution proposal is signed by the required jurors any of them can submit the resolution by on-chain execution.

**Steps:**
1. The user submits the resolution.
2. The system generates the submit transaction.
3. The user approves the transaction.
4. The system confirms that the resolution has been submitted.

### Appeal resolution

Once a resolution is submitted any party involved on the resolution can appeal it.

**Steps:**
1. The user triggers the appeal.
2. The system generates the transaction to appeal.
3. The user approves the transaction.
4. The system confirms that the resolution has been appealed.

### Execute resolution

Once a submitted resolution passes the review period it can be executed by anyone.

**Steps:**
1. The user triggers the execution.
2. The system generates the execution transaction.
3. The user approves the transaction.
4. The system confirms that the resolution has been executed.

### Verify terms

The users can verify if a terms file matches with the terms of the agreement.

**Steps:**
1. The system opens a dialog to select the terms file.
2. The user picks the file.
3. The system hashes the file and checks the hash against the agreement's hash. Then prompts the user with the result.

## Views

### Resolution creation

This view will show the form required to create a resolution.

Must provide:

- A set of buttons to insert and edit the agreement positions.
- An indicator of the validity of the settlement.

From this view, the user must be able to:

- [Create resolution proposal](#create-resolution-proposal)

### Dispute details

This view will show the details of the dispute.

#### As jurors

Must show:

- Dispute identifier (same as agreement)
- The terms hash
- A list of the party positions in the agreement
- A list of proposed resolutions with resolution details

From this view, the user must be able to:

- [Create resolution proposal](#create-resolution-proposal)
- [Approve resolution proposal](#approve-resolution-proposal) (when selected)
- [Reject resolution proposal](#reject-resolution-proposal) (when selected)
- [Submit resolution proposal](#submit-resolution-proposal) (when approved)
- [Appeal resolution](#appeal-resolution) (when submitted)
- [Execute resolution](#execute-resolution) (when executable)
- [Verify terms](#verify-terms)

#### As users

Must show:

- Dispute identifier (same as agreement)
- The terms hash
- A list of the party positions in the agreement
- The submitted resolution

From this view, the user must be able to:

- [Appeal resolution](#appeal-resolution) (when submitted)
- [Execute resolution](#execute-resolution) (when executable)
- [Verify terms](#verify-terms)

### Dispute list

When logged, this view will show all the available disputes.

Each dispute must show:

- Dispute identifier
- Dispute status

From this view user must be able to:
- Go to each dispute details view

## Integrations

The UI will need to integrate with:

- User's Web3 provider
- Gnosis Safe API
- Arbitrator contract
- Subgraph

### Gnosis Safe API

As jurors court will be implemented as a Gnosis-safe multi-sig we can use their API to manage the creation, approval & rejection of resolution proposals. Meaning that most of the development in this UI will be dedicated to provide a custom UI over Gnosis Safe to encode and decode dispute resolutions.
