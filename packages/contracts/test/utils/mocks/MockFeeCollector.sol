// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { ERC20 } from "solmate/src/tokens/ERC20.sol";
import { SafeTransferLib } from "solmate/src/utils/SafeTransferLib.sol";

import { FeeCollector } from "nation3-court/lib/FeeCollector.sol";

contract MockFeeCollector is FeeCollector {
    constructor(ERC20 feeToken_, uint256 feeAmount) {
        feeToken = feeToken_;
        fee = feeAmount;
    }
}
