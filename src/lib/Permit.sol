// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

/// @dev EIP-2612 Permit
///      Together with a EIP-2612 compliant token,
///      allows a contract to approve transfer of funds through signature.
///      This is specially usefull to implement operations 
///      that approve and transfer funds on the same transaction.
struct Permit {
    uint256 value;
    uint256 deadline;
    /// ECDSA Signature components.
    uint8 v;
    bytes32 r;
    bytes32 s;
}


