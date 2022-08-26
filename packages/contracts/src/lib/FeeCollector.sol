// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { ERC20 } from "solmate/src/tokens/ERC20.sol";
import { SafeTransferLib } from "solmate/src/utils/SafeTransferLib.sol";

import { Owned } from "./auth/Owned.sol";

abstract contract FeeCollector is Owned {

    /// @dev Token used to pay arbitration costs.
    ERC20 public feeToken;

    /// @dev Cost of appeal.
    uint256 public fee;

    /// @notice Set fee amount.
    /// @param amount Amount of fee tokens per fee.
    function setFee(uint256 amount) public onlyOwner {
        fee = amount;
    }

    /// @notice Withdraw any ERC20 in the contract.
    /// @param token Token to withdraw.
    /// @param to Recipient address.
    function withdrawTokens(ERC20 token, address to) public onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        SafeTransferLib.safeTransfer(token, to, balance);
    }
}
