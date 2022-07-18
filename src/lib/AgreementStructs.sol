// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.13;

enum PositionStatus {
    Idle,
    Finalized
}

/// @dev Agreement party position
struct Position {
    /// @dev Matches index of the party in the agreement
    uint256 id;
    /// @dev Amount of tokens corresponding to this position.
    uint256 balance;
    /// @dev Status of the position
    PositionStatus status;
}

struct Agreement {
    /// @dev Hash of the detailed terms of the agreement.
    bytes32 termsHash;
    /// @dev Required amount to join or merkle root of (address,amount).
    uint256 criteria;
    /// @dev Total balance deposited in the agreement.
    uint256 balance;
    /// @dev Number of finalizations confirmations.
    uint256 finalizations;
    /// @dev Signal if agreement is disputed.
    bool disputed;
    /// @dev List of parties involved in the agreement.
    address[] party;
    /// @dev Position by party.
    mapping(address => Position) position;
}

/// @dev Adapter of agreement params for functions I/O.
struct AgreementParams {
    /// @dev Hash of the detailed terms of the agreement.
    bytes32 termsHash;
    /// @dev Required amount to join or merkle root of (address,amount).
    uint256 criteria;
}

/// @dev Adapter of agreement params for functions I/O.
struct PositionParams {
    /// @dev Holder of the position.
    address party;
    /// @dev Amount of tokens corresponding to this position.
    uint256 balance;
}
