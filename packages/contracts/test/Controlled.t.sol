// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { DSTestPlus } from "solmate/src/test/utils/DSTestPlus.sol";
import { Owned } from "nation3-court/lib/auth/Owned.sol";

import { MockControlled } from "./utils/mocks/MockControlled.sol";

contract ControlledTest is DSTestPlus {
    MockControlled controlled;

    function setUp() public {
        controlled = new MockControlled();
    }

    function testSetOwner() public {
        testSetOwner(address(0xBEEF));
    }

    function testSetController() public {
        testSetController(address(0xBEEF));
    }

    function testCallFunctionAsNonOwner() public {
        testCallFunctionAsNonOwner(address(0));
    }

    function testCallFunctionAsOwner() public {
        controlled.updateFlag(true);
    }

    function testCallFunctionAsController() public {
        controlled.toggleFlag();
    }

    function testSetOwner(address newOwner) public {
        controlled.setOwner(newOwner);

        assertEq(controlled.owner(), newOwner);
    }

    function testSetController(address newController) public {
        controlled.setController(newController);

        assertEq(controlled.controller(), newController);
    }

    function testCallFunctionAsNonOwner(address owner) public {
        hevm.assume(owner != address(this));

        controlled.setOwner(owner);

        hevm.expectRevert(Owned.Unauthorized.selector);
        controlled.updateFlag(true);
    }

    function testCallFunctionAsNonController(address controller) public {
        hevm.assume(controller != address(this));

        controlled.setController(controller);

        hevm.expectRevert(Owned.Unauthorized.selector);
        controlled.toggleFlag();
    }

    function testCallFunctionAsNeitherOwnerOrController(address owner, address controller) public {
        hevm.assume(owner != address(this));
        hevm.assume(controller != address(this));

        controlled.setController(controller);
        controlled.setOwner(owner);

        hevm.expectRevert(Owned.Unauthorized.selector);
        controlled.isFlag();
    }
}
