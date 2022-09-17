// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { DSTestPlus } from "solmate/src/test/utils/DSTestPlus.sol";
import { MockERC20 } from "solmate/src/test/utils/mocks/MockERC20.sol";
import { SafeTransferLib } from "solmate/src/utils/SafeTransferLib.sol";

import { FeeCollector } from "nation3-court/lib/FeeCollector.sol";
import { MockFeeCollector } from "./utils/mocks/MockFeeCollector.sol";

contract FeeCollectorTest is DSTestPlus {
    MockERC20 token;
    MockFeeCollector collector;

    uint256 FEE_AMOUNT = 2 * 1e18;

    function setUp() public {
        token = new MockERC20("TestToken", "TEST", 18);
        collector = new MockFeeCollector(token, FEE_AMOUNT);

        token.mint(address(this), type(uint256).max);
    }

    function testSetFee() public {
        MockERC20 newToken = new MockERC20("TestToken2", "TEST2", 18);
        uint256 newAmount = 3 * 1e18;

        collector.setFee(newToken, address(this), newAmount);

        assertEq(address(collector.feeToken()), address(newToken));
        assertEq(address(collector.feeRecipient()), address(this));
        assertEq(collector.fee(), newAmount);
    }

    function testCantSetInvalidRecipient() public {
        hevm.expectRevert(FeeCollector.InvalidRecipient.selector);
        collector.setFee(token, address(0), 1e18);
    }

    function testCollectFees() public {
        testCollectFees(address(0xB0B), 200 * 1e18);
    }

    function testCantCollectToInvalidRecipient() public {
        // The recipient is not initialized so its set to 0x0
        hevm.expectRevert(FeeCollector.InvalidRecipient.selector);
        collector.collectFees();
    }

    function testCollectFees(address to, uint256 amount) public {
        hevm.assume(to != address(this) && to != address(0));

        collector.setFee(token, to, amount);
        SafeTransferLib.safeTransfer(token, address(collector), collector.fee());

        collector.collectFees();

        assertEq(token.balanceOf(to), amount);
    }
}
