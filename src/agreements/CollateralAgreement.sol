// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.13;

import { ERC20 } from "solmate/src/tokens/ERC20.sol";
import { SafeTransferLib } from "solmate/src/utils/SafeTransferLib.sol";
import {
    Agreement,
    AgreementParams,
    Position,
    PositionParams,
    PositionStatus
} from "../lib/AgreementStructs.sol";
import { IAgreementFramework } from "../interfaces/IAgreementFramework.sol";
import { IArbitrable } from "../interfaces/IArbitrable.sol";
import {CriteriaResolver, CriteriaResolution} from "../lib/CriteriaResolution.sol";

/// @notice Framework to create collateral agreements.
contract CollateralAgreementFramework is IAgreementFramework, CriteriaResolution {
    /* ====================================================================== //
                                        ERRORS
    // ====================================================================== */

    error MissingPositions();
    error PositionsMustMatch();
    error DisputeBalanceMustMatch();

    /* ====================================================================== //
                                        STORAGE
    // ====================================================================== */

    /// @dev Token used in agreements.
    ERC20 public token;

    /// @dev Address with the power to settle agreements in dispute.
    address public arbitrator;

    /// @dev Map of agreements by id.
    mapping(uint256 => Agreement) public agreement;

    /// @dev Current last agreement index.
    uint256 private _currentIndex;

    /* ====================================================================== //
                                      CONSTRUCTOR
    // ====================================================================== */

    constructor(
        ERC20 token_,
        address arbitrator_
    ) {
        arbitrator = arbitrator_;
        token = token_;
    }

    /* ====================================================================== */
    /*                                  VIEWS
    /* ====================================================================== */

    function agreementParams(uint256 id) external view override returns (
        AgreementParams memory params
    ) {
        params = AgreementParams(agreement[id].termsHash, agreement[id].criteria);
    }

    function agreementPositions(uint256 id) external view override returns (
        PositionParams[] memory
    ) {
        uint256 partyLength = agreement[id].party.length;
        PositionParams[] memory positions = new PositionParams[](partyLength);

        for (uint256 i = 0; i < partyLength; i++) {
            address party = agreement[id].party[i];
            uint256 balance = agreement[id].position[party].balance;

            positions[i] = PositionParams(party, balance);
        }

        return positions;
    }

    /* ====================================================================== */
    /*                                USER LOGIC
    /* ====================================================================== */

    function createAgreement(AgreementParams calldata params)
        external
        override
        returns (uint256 agreementId)
    {
        agreementId = _currentIndex;

        agreement[agreementId].termsHash = params.termsHash;
        agreement[agreementId].criteria = params.criteria;

        _currentIndex++;

        emit AgreementCreated(agreementId, params.termsHash, params.criteria);
    }

    function joinAgreement(
        uint256 id,
        CriteriaResolver calldata resolver
    ) external override {
        if (_isPartOfAgreement(id, msg.sender))
            revert PartyAlreadyJoined();
        if (msg.sender != resolver.party)
            revert PartyMustMatchCriteria();

        _validateCriteria(agreement[id].criteria, resolver);

        SafeTransferLib.safeTransferFrom(token, msg.sender, address(this), resolver.balance);

        _addPosition(id, PositionParams(msg.sender, resolver.balance));

        emit AgreementJoined(id, msg.sender, resolver.balance);
    }

    function finalizeAgreement(uint256 id) external override {
        if (agreement[id].disputed)
            revert AgreementAlreadyDisputed();
        if (!_isPartOfAgreement(id, msg.sender))
            revert NoPartOfAgreement();
        if (agreement[id].position[msg.sender].status == PositionStatus.Finalized)
            revert PartyAlreadyFinalized();

        agreement[id].position[msg.sender].status = PositionStatus.Finalized;
        agreement[id].finalizations += 1;

        emit AgreementFinalizationSent(id, msg.sender);
    }

    function disputeAgreement(uint256 id) external override {
        if (!_isPartOfAgreement(id, msg.sender))
            revert NoPartOfAgreement();

        agreement[id].disputed = true;

        emit AgreementDisputed(id, msg.sender);
    }

    function withdrawFromAgreement(uint256 id) external override {
        if (!_isFinalized(id))
            revert AgreementNotFinalized();
        if (!_isPartOfAgreement(id, msg.sender))
            revert NoPartOfAgreement();

        uint256 withdrawBalance = agreement[id].position[msg.sender].balance;
        agreement[id].position[msg.sender].balance = 0;

        SafeTransferLib.safeTransfer(token, msg.sender, withdrawBalance);

        emit AgreementWithdrawn(id, msg.sender, withdrawBalance);
    }

    function _isFinalized(uint256 id) internal view returns (bool) {
        return agreement[id].finalizations >= agreement[id].party.length;
    }

    function _isPartOfAgreement(uint256 id, address account) internal view returns (bool) {
        return (
            (agreement[id].party.length > 0)
            && (agreement[id].party[agreement[id].position[account].id] == account)
        );
    }

    function _addPosition(uint256 agreementId, PositionParams memory params) internal {
        uint256 partyId = agreement[agreementId].party.length;
        agreement[agreementId].party.push(params.party);
        agreement[agreementId].position[params.party] = Position(
            partyId,
            params.balance,
            PositionStatus.Idle
        );
        agreement[agreementId].balance += params.balance;
    }

    /* ====================================================================== */
    /*                              IArbitrable
    /* ====================================================================== */

    function settleDispute(uint256 id, PositionParams[] calldata settlement) external override {
        if (msg.sender != arbitrator)
            revert OnlyArbitrator();
        if (!agreement[id].disputed)
            revert AgreementNotDisputed();

        uint256 positionsLength = settlement.length;
        uint256 settleBalance;

        if (positionsLength < agreement[id].party.length)
            revert MissingPositions();
        for (uint256 i = 0; i < positionsLength; i++) {
            if ((i < agreement[id].party.length)
                && (agreement[id].party[0] != settlement[0].party))
                revert PositionsMustMatch();
            settleBalance += settlement[i].balance;
            _updatePosition(
                id,
                i,
                settlement[i],
                PositionStatus.Finalized
            );
        }
        if (settleBalance > agreement[id].balance)
            revert DisputeBalanceMustMatch();

        agreement[id].balance = settleBalance;
        agreement[id].finalizations = positionsLength;
    }

    function _updatePosition(
        uint256 agreementId,
        uint256 partyId,
        PositionParams memory params,
        PositionStatus status
    ) internal {
        agreement[agreementId].position[params.party] = Position(
                partyId,
                params.balance,
                status
        );

        if (partyId >= agreement[agreementId].party.length)
            agreement[agreementId].party.push(params.party);
    }
}
