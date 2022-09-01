// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

enum ResolutionStatus {
    Default,
    Pending,
    Endorsed,
    Appealed,
    Executed
}

struct Resolution {
    ResolutionStatus status;
    bytes32 mark;
    string metadataURI;
    uint256 unlockBlock;
}


