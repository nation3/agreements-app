// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { Controlled } from "nation3-court/lib/auth/Controlled.sol";

contract MockControlled is Controlled(msg.sender, msg.sender) {
    bool public flag;

    function updateFlag(bool value) public virtual onlyOwner {
        flag = value;
    }

    function toggleFlag() public virtual onlyController {
        flag = !flag;
    }

    function isFlag() public view virtual onlyOwnerOrController returns (bool) {
        return flag == true;
    }
}
