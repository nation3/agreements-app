// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

/// @notice Simple single owner authorization mixin.
/// @dev Adapted from Solmate (https://github.com/transmissions11/solmate/blob/main/src/auth/Owned.sol)
abstract contract Owned {

    event OwnerUpdated(address indexed user, address indexed newOwner);

    error Unauthorized();

    address public owner;

    modifier onlyOwner() virtual {
        if (msg.sender != owner) revert Unauthorized();

        _;
    }

    constructor(address owner_) {
        owner = owner_;

        emit OwnerUpdated(msg.sender, owner_);
    }

    function setOwner(address newOwner) public virtual onlyOwner {
        owner = newOwner;

        emit OwnerUpdated(msg.sender, newOwner);
    }
}


