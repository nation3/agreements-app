// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.13;

/// @dev EIP-2612 Permit
struct Permit {
    uint256 value;
    uint256 deadline;
    uint8 v;
    bytes32 r;
    bytes32 s;
}


