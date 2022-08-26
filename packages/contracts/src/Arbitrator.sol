// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { ERC20 } from "solmate/src/tokens/ERC20.sol";
import { SafeTransferLib } from "solmate/src/utils/SafeTransferLib.sol";

import { IArbitrable } from "./interfaces/IArbitrable.sol";
import { IArbitrator } from "./interfaces/IArbitrator.sol";

import { PositionParams } from "./lib/AgreementStructs.sol";
import { Resolution, ResolutionStatus } from "./lib/ResolutionStructs.sol";
import { Controlled } from "./lib/auth/Controlled.sol";
import { FeeCollector } from "./lib/FeeCollector.sol";
import { Toggleable } from "./lib/Toggleable.sol";
import { Permit } from "./lib/Permit.sol";

contract Arbitrator is IArbitrator, Controlled, Toggleable, FeeCollector {
    /// @dev Number of blocks needed to wait before executing a resolution.
    uint256 public executionLockPeriod;

    /// @dev Mapping of all submitted resolutions.
    mapping(bytes32 => Resolution) public resolution;

    constructor() Controlled(msg.sender, msg.sender) {}

    /// @notice Setup arbitrator variables.
    /// @param feeToken_ Token used to pay arbitration costs.
    /// @param fee_ Fee cost.
    /// @param executionLockPeriod_ Number of blocks needed to wait before executing a resolution.
    /// @param enabled_ Status of the arbitrator.
    function setUp(
        ERC20 feeToken_,
        uint256 fee_,
        uint256 executionLockPeriod_,
        bool enabled_
    ) public onlyOwner {
        feeToken = feeToken_;
        fee = fee_;
        executionLockPeriod = executionLockPeriod_;
        enabled = enabled_;
    }

    /// @inheritdoc IArbitrator
    /// @dev Only controller is able to submit resolutions.
    function submitResolution(
        IArbitrable framework,
        bytes32 id,
        string calldata metadataURI,
        PositionParams[] calldata settlement
    ) public isEnabled onlyController returns (bytes32) {
        bytes32 hash = _resolutionHash(address(framework), id);
        Resolution storage resolution_ = resolution[hash];

        if (resolution_.status == ResolutionStatus.Executed) revert ResolutionIsExecuted();

        resolution_.status = ResolutionStatus.Pending;
        resolution_.mark = keccak256(abi.encode(settlement));
        resolution_.metadataURI = metadataURI;
        resolution_.unlockBlock = block.number + executionLockPeriod;

        emit ResolutionSubmitted(address(framework), id, hash);

        return hash;
    }

    /// @inheritdoc IArbitrator
    function executeResolution(
        IArbitrable framework,
        bytes32 id,
        PositionParams[] calldata settlement
    ) public isEnabled {
        bytes32 hash = _resolutionHash(address(framework), id);
        Resolution storage resolution_ = resolution[hash];

        if (resolution_.status == ResolutionStatus.Appealed) revert ResolutionIsAppealed();
        if (resolution_.status == ResolutionStatus.Executed) revert ResolutionIsExecuted();
        if (
            resolution_.status != ResolutionStatus.Endorsed &&
            block.number < resolution_.unlockBlock
        ) revert ExecutionStillLocked();
        if (resolution_.mark != keccak256(abi.encode(settlement))) revert ResolutionMustMatch();

        framework.settleDispute(id, settlement);

        resolution_.status = ResolutionStatus.Executed;

        emit ResolutionExecuted(hash);
    }

    /// @inheritdoc IArbitrator
    function appealResolution(bytes32 hash, PositionParams[] calldata settlement) external {
        _canAppeal(msg.sender, hash, settlement);

        SafeTransferLib.safeTransferFrom(feeToken, msg.sender, address(this), fee);

        resolution[hash].status = ResolutionStatus.Appealed;

        emit ResolutionAppealed(hash, msg.sender);
    }

    /// @inheritdoc IArbitrator
    function appealResolutionWithPermit(
        bytes32 hash,
        PositionParams[] calldata settlement,
        Permit calldata permit
    ) external {
        _canAppeal(msg.sender, hash, settlement);

        feeToken.permit(
            msg.sender,
            address(this),
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
        );
        SafeTransferLib.safeTransferFrom(feeToken, msg.sender, address(this), fee);

        resolution[hash].status = ResolutionStatus.Appealed;

        emit ResolutionAppealed(hash, msg.sender);
    }

    /// @inheritdoc IArbitrator
    function endorseResolution(bytes32 hash, PositionParams[] calldata settlement)
        external
        onlyOwner
    {
        Resolution storage resolution_ = resolution[hash];

        if (resolution_.status == ResolutionStatus.Default) revert ResolutionNotSubmitted();
        if (resolution_.status == ResolutionStatus.Executed) revert ResolutionIsExecuted();
        if (resolution_.mark != keccak256(abi.encode(settlement))) revert ResolutionMustMatch();

        resolution_.status = ResolutionStatus.Endorsed;

        emit ResolutionEndorsed(hash);
    }

    /* ====================================================================== */
    /*                              INTERNAL UTILS
    /* ====================================================================== */

    /// @dev Get resolution hash for given dispute.
    /// @param framework address of the framework of the agreement in dispute.
    /// @param id identifier of the agreement in dispute.
    function _resolutionHash(address framework, bytes32 id) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(framework, id));
    }

    /// @dev Check if account can appeal a resolution.
    /// @param account address to check.
    /// @param hash hash of the resolution.
    function _canAppeal(
        address account,
        bytes32 hash,
        PositionParams[] calldata settlement
    ) internal view {
        Resolution storage resolution_ = resolution[hash];

        if (resolution_.status == ResolutionStatus.Default) revert ResolutionNotSubmitted();
        if (resolution_.status == ResolutionStatus.Executed) revert ResolutionIsExecuted();
        if (resolution_.status == ResolutionStatus.Endorsed) revert ResolutionIsEndorsed();
        if (resolution_.mark != keccak256(abi.encode(settlement))) revert ResolutionMustMatch();
        if (!_isParty(account, settlement)) revert NoPartOfResolution();
    }

    /// @dev Check if an account is part of a settlement.
    /// @param account Address to check.
    /// @param settlement Array of positions.
    function _isParty(address account, PositionParams[] calldata settlement)
        internal
        pure
        returns (bool found)
    {
        for (uint256 i = 0; !found && i < settlement.length; i++) {
            if (settlement[i].party == account) found = true;
        }
    }
}
