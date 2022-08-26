// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;
import { Owned } from "./auth/Owned.sol";

/// @notice Simple mixin to able / disable a contract.
abstract contract Toggleable is Owned {

    error IsDisabled();

    /// @dev Set status of the arbitrator.
    bool public enabled;

    /// @dev Requires to be enabled before performing function.
    modifier isEnabled() {
        if (!enabled) revert IsDisabled();
        _;
    }

    /// @notice Enable / disable a contract.
    /// @param status New enabled status.
    function setEnabled(bool status) external virtual onlyOwner {
        enabled = status;
    }

}
