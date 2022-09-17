// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { ERC20 } from "solmate/src/tokens/ERC20.sol";
import { SafeTransferLib } from "solmate/src/utils/SafeTransferLib.sol";


/// @notice Simple mixin to setup and collect fees.
abstract contract FeeCollector {

    /// @dev Token used to collect fees.
    ERC20 public feeToken;

    /// @dev Default fee recipient.
    address public feeRecipient;

    /// @dev Amount of tokens to collect as fee.
    uint256 public fee;

    /// @dev Raised when the recipient is not valid.
    error InvalidRecipient();

    /// @notice Withdraw any fees in the contract to the default recipient.
    function collectFees() external virtual {
        if (feeRecipient == address(0)) revert InvalidRecipient();

        uint256 amount = feeToken.balanceOf(address(this));
        _withdraw(feeToken, feeRecipient, amount);
    }

    /// @notice Set fee parameters.
    /// @param token ERC20 token to collect fees with.
    /// @param recipient Default recipient for the fees.
    /// @param amount Amount of fee tokens per fee.
    function setFee(ERC20 token, address recipient, uint256 amount) external virtual {
        _setFee(token, recipient, amount);
    }

    /// @dev Withdraw ERC20 tokens from the contract.
    function _withdraw(ERC20 token, address to, uint256 amount) internal virtual {
        SafeTransferLib.safeTransfer(token, to, amount);
    }

    /// @dev Set fee parameters.
    function _setFee(ERC20 token, address recipient, uint256 amount) internal {
        if (recipient == address(0)) revert InvalidRecipient();

        feeToken = token;
        feeRecipient = recipient;
        fee = amount;
    }

}
