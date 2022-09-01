// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { Owned } from "nation3-court/lib/auth/Owned.sol";

contract MockOwned is Owned(msg.sender) {
    bool public flag;

    function updateFlag(bool value) public virtual onlyOwner {
        flag = value;
    }
}
