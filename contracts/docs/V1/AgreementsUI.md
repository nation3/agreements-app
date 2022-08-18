# Agreements UI <!-- omit in toc -->

A page to create & manage collateral agreements.

- [Use Cases](#use-cases)
  - [Create agreement](#create-agreement)
  - [Join agreement](#join-agreement)
  - [Finalize agreement](#finalize-agreement)
  - [Dispute agreement](#dispute-agreement)
  - [Withdraw from the agreement](#withdraw-from-the-agreement)
- [Views](#views)
  - [Agreement creation](#agreement-creation)
  - [Agreement details](#agreement-details)
  - [Agreement list](#agreement-list)
- [Integrations](#integrations)

## Use Cases

### Create agreement

To create an agreement, we need to send a hash of the terms of the agreement and a criteria tree root.
Additionally we send and URI of the agreement's metadata.

The system will generate the hash of the terms from a file the user provides.
The system will generate the criteria tree from a list of (account, balance) nodes.
The system will generate the URI of the agreement's metadata from the metadata file.

**Steps:**

1. The user uploads the terms file.
2. The system hash the file, stores the hash, and shows it to the user in the form.
3. The system sets the name of the agreement from the terms file header. The user can choose between storing this name locally or making it public with the criteria.
4. The user fills the criteria with all the expected positions.
5. The user submits the agreement.
6. The system generates the criteria tree, metadata file and the IPFS hash of the metadata file.
7. The system generates the transaction to create the agreement.
8. The user approves the transaction.
9. The system uploads the metadata file to IPFS.
10. The system prompts the user to download the metadata and copy the URL of the agreement.

### Add an existing agreement

To add an existing agreement the user will provide the ID of the agreement.

**Steps:**

1. The system will ask the user for the ID of the agreement to add.
2. The user will input the ID.
3. The system will redirect to the agrement details page if the agrement is found, prompt an error if not.

### Join agreement

To join an agreement, we need to prove membership to the criteria tree and provide the required collateral.

To perform only one transaction, we will use signed approvals ([EIP-2612](https://eips.ethereum.org/EIPS/eip-2612))

We will retrieve the criteria tree & proofs from the metadata of the agreement to join.

**Steps:**

1. The system checks if the user can join the agreement.
2. The user presses the join button.
3. The system generates an EIP-712 permit for the funds required to join.
4. The user signs the permit.
5. The system generates the join with permit transaction.
6. The user approves the transaction.

### Finalize agreement

To finalize an agreement, all the parties need to signal their willingness to finalize with the current positions.

**Steps:**

1. The system checks the user can finalize the agreement.
2. The user presses the finalize button.
3. The system generates the transaction to finalize.
4. The user approves the transaction.

### Dispute agreement

To raise a dispute, any of the parties can call the contract to dispute an agreement.

**Steps:**

1. The system checks if the user can dispute the agreement.
2. The user presses the dispute button.
3. The system generates the dispute transaction.
4. The user approves the transaction.

### Withdraw from the agreement

When the contract is finalized, the parties can withdraw their positions.

**Steps:**
1. The system checks if the user can withdraw from the agreement & shows withdrawal details.
2. The user presses the withdraw button.
3. The system generates the withdrawal transaction.
4. The user approves the transaction.

### Verify terms

The users can verify if a terms file matches with the terms of the agreement.

**Steps:**
1. The system opens a dialog to select the terms file.
2. The user picks the file.
3. The system hashes the file and checks the hash against the agreement's hash. Then prompts the user with the result.

## Views

### Agreement creation

This view will show the form required to create an agreement.

Must provide:

- A button to upload terms of the agreement.
- A set of buttons to insert and edit the list of accounts and balances to include on the criteria tree.

From this view, the user must be able to:

- [Create agreement](#create-agreement)
- Download agreement metadata

### Agreement details

This view will show the details of the agreement.

Must show:

- Agreement identifier
- Agreement terms hash
- Agreement status
- A list of the party positions in the agreement

From this view, the user must be able to:

- [Join agreement](#join-agreement) (if not joined before)
- [Dispute agreement](#dispute-agreement) (if joined & not finalized)
- [Finalize agreement](#finalize-agreement) (if joined & not disputed)
- [Withdraw from agreement](#withdraw-from-agreement) (if finalized)
- [Verify terms](#verify-terms)
- Go to the linked dispute (if disputed)

### Agreement list

When logged, this view will show all the agreements an account is a part of.

Each agreement must show:

- Agreement identifier
- Agreement status
- Account position in the agreement

From this view user must be able to:

- [Create a new agreement](#create-agreement)
- [Add an existing agreement](#add-an-existing-agreement)
- Go to each agreement details view

## Integrations

The UI will need to integrate with:

- User's Web3 provider
- Collateral Agreement contract
- Subgraph
