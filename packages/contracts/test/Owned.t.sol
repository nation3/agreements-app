// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { DSTestPlus } from "solmate/src/test/utils/DSTestPlus.sol";
import { Owned } from "nation3-court/lib/auth/Owned.sol";

import { MockOwned } from "./utils/mocks/MockOwned.sol";

contract OwnedTest is DSTestPlus {
    MockOwned owned;

    function setUp() public {
        owned = new MockOwned();
    }

    function testSetOwner() public {
        testSetOwner(address(0xBEEF));
    }

    function testCallFunctionAsNonOwner() public {
        testCallFunctionAsNonOwner(address(0));
    }

    function testCallFunctionAsOwner() public {
        owned.updateFlag(true);
    }

    function testSetOwner(address newOwner) public {
        owned.setOwner(newOwner);

        assertEq(owned.owner(), newOwner);
    }

    function testCallFunctionAsNonOwner(address owner) public {
        hevm.assume(owner != address(this));

        owned.setOwner(owner);

        hevm.expectRevert(Owned.Unauthorized.selector);
        owned.updateFlag(true);
    }
}
