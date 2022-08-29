// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { Owned } from "./Owned.sol";

/// @notice Authorization mixin that extends Owned with Controller rol.
abstract contract Controlled is Owned {

    event ControllerUpdated(address indexed user, address indexed newController);

    address public controller;

    modifier onlyController() virtual {
        if (msg.sender != controller) revert Unauthorized();

        _;
    }

    modifier onlyOwnerOrController() virtual {
        if (msg.sender != owner && msg.sender != controller) revert Unauthorized();

        _;
    }

    constructor(address owner_, address controller_) Owned(owner_) {
        controller = controller_;

        emit ControllerUpdated(msg.sender, controller_);
    }

    function setController(address newController) public virtual onlyOwner {
        controller = newController;

        emit ControllerUpdated(msg.sender, newController);
    }
}
