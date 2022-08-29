// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { ERC20 } from "solmate/src/tokens/ERC20.sol";
import { SafeTransferLib } from "solmate/src/utils/SafeTransferLib.sol";

abstract contract FeeCollector {

    /// @dev Token used to collect fees.
    ERC20 public feeToken;

    /// @dev Amount of tokens to collect as fee.
    uint256 public fee;

    /// @notice Set fee.
    /// @param token ERC20 token to collect fees with.
    /// @param amount Amount of fee tokens per fee.
    function setFee(ERC20 token, uint256 amount) external virtual {
        feeToken = token;
        fee = amount;
    }

    /// @notice Withdraw any ERC20 in the contract.
    /// @param token Token to withdraw.
    /// @param to Recipient address.
    function withdrawTokens(ERC20 token, address to, uint256 amount) external virtual {
        SafeTransferLib.safeTransfer(token, to, amount);
    }
}
