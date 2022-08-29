// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { Toggleable } from "nation3-court/lib/Toggleable.sol";

contract MockToggleable is Toggleable {
    bool public value;

    function use() public virtual isEnabled {
        value = true;
    }
}
