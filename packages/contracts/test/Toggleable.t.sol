// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { DSTestPlus } from "solmate/src/test/utils/DSTestPlus.sol";
import { Toggleable } from "nation3-court/lib/Toggleable.sol";

import { MockToggleable } from "./utils/mocks/MockToggleable.sol";

contract ToggleableTest is DSTestPlus {
    MockToggleable toggleable;

    function setUp() public {
        toggleable = new MockToggleable();
    }

    function testEnable() public {
        testSetEnabled(true);
    }

    function testDisable() public {
        testSetEnabled(false);
    }

    function testSetEnabled(bool value) public {
        toggleable.setEnabled(value);

        assertTrue(toggleable.enabled() == value);
    }

    function testCallFunctionWhenEnabled() public {
        toggleable.setEnabled(true);

        toggleable.use();
    }

    function testCallFunctionWhenDisabled() public {
        toggleable.setEnabled(false);

        hevm.expectRevert(Toggleable.IsDisabled.selector);
        toggleable.use();
    }
}
