// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { DSTestPlus } from "solmate/src/test/utils/DSTestPlus.sol";
import { MockERC20 } from "solmate/src/test/utils/mocks/MockERC20.sol";
import { SafeTransferLib } from "solmate/src/utils/SafeTransferLib.sol";

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

        collector.setFee(newToken, newAmount);

        assertEq(address(collector.feeToken()), address(newToken));
        assertEq(collector.fee(), newAmount);
    }

    function testWithdrawTokens() public {
        testWithdrawTokens(address(0xB0B), 200 * 1e18);
    }

    function testWithdrawTokens(address to, uint256 amount) public {
        hevm.assume(to != address(this));

        SafeTransferLib.safeTransfer(token, address(collector), amount);

        collector.withdrawTokens(token, to, amount);

        assertEq(token.balanceOf(to), amount);
    }
}
