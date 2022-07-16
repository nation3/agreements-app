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
        CriteriaResolver calldata criteriaResolver
    ) external override {
        if (_isPartOfAgreement(id, msg.sender)) revert PartyAlreadyJoined();
        if (msg.sender != criteriaResolver.party) revert PartyMustMatchCriteria();

        _validateCriteria(agreement[id].criteria, criteriaResolver);

        SafeTransferLib.safeTransferFrom(token, msg.sender, address(this), criteriaResolver.balance);

        _registerParty(id, msg.sender, criteriaResolver.balance);

        emit AgreementJoined(id, msg.sender, criteriaResolver.balance);
    }

    function _registerParty(uint256 id, address party, uint256 balance) internal {
        uint256 newPartyId = agreement[id].party.length;

        Position memory newPositon = Position(newPartyId, balance, PositionStatus.Idle);

        agreement[id].party.push(party);
        agreement[id].position[party] = newPositon;
    }

    function finalizeAgreement(uint256 id) external override {
        if (!_isPartOfAgreement(id, msg.sender))
            revert NoPartOfAgreement();
        if (agreement[id].position[msg.sender].status == PositionStatus.Finalized)
            revert PartyAlreadyFinalized();

        agreement[id].position[msg.sender].status = PositionStatus.Finalized;
        agreement[id].finalizations += 1;

        emit AgreementFinalizationSent(id, msg.sender);
    }

    function disputeAgreement(uint256 id) external override {}

    function withdrawFromAgreement(uint256 id) external override {
        if (!_isFinalized(id)) revert AgreementNotFinalized();
        if (agreement[id].party[agreement[id].position[msg.sender].id] != msg.sender)
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
        return agreement[id].party.length > 0 && agreement[id].party[agreement[id].position[account].id] == account;
    }

    /* ====================================================================== */
    /*                              IArbitrable
    /* ====================================================================== */

    function settleDispute(uint256 id, PositionParams[] calldata settlement) external override {
        uint256 positionsLength = settlement.length;

        if (msg.sender != arbitrator) revert OnlyArbitrator();
        if (settlement.length < agreement[id].party.length) revert MissingPositions();

        for (uint256 i = 0; i < positionsLength; i++) {
            if (i < agreement[id].party.length && agreement[id].party[0] != settlement[0].party)
                revert PositionsMustMatch();
            agreement[id].position[settlement[i].party] = Position(
                i,
                settlement[i].balance,
                PositionStatus.Finalized
            );
            if (i >= agreement[id].party.length) {
                agreement[id].party.push(settlement[i].party);
            }
        }

        agreement[id].finalizations = positionsLength;
    }
}
