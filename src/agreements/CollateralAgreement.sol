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
    error SettlementBalanceMustMatch();

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
    
    /// Retrieve parameters of an agreement.
    /// @inheritdoc IAgreementFramework
    function agreementParams(uint256 id) external view override returns (
        AgreementParams memory params
    ) {
        params = AgreementParams(agreement[id].termsHash, agreement[id].criteria);
    }

    /// Retrieve positions of an agreement.
    /// @inheritdoc IAgreementFramework
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

    /// Create a new agreement with given params.
    /// @inheritdoc IAgreementFramework
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

    /// Join an existent agreement.
    /// @inheritdoc IAgreementFramework
    /// @dev Requires that the caller provides a valid criteria resolver.
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

    /// Signal the will of the caller to finalize an agreement.
    /// @inheritdoc IAgreementFramework
    /// @dev Requires the caller to be part of the agreement and not have finalized before.
    /// @dev Can't be perform on disputed agreements.
    function finalizeAgreement(uint256 id) external override {
        if (agreement[id].disputed)
            revert AgreementAlreadyDisputed();
        if (!_isPartOfAgreement(id, msg.sender))
            revert NoPartOfAgreement();
        if (agreement[id].position[msg.sender].status == PositionStatus.Finalized)
            revert PartyAlreadyFinalized();

        agreement[id].position[msg.sender].status = PositionStatus.Finalized;
        agreement[id].finalizations += 1;

        emit AgreementPositionUpdated(
            id,
            msg.sender,
            agreement[id].position[msg.sender].balance,
            PositionStatus.Finalized
        );

        if (_isFinalized(id))
            emit AgreementFinalized(id);
    }

    /// Raise a dispute over an agreement.
    /// @inheritdoc IAgreementFramework
    /// @dev Requires the caller to be part of the agreement.
    /// @dev Can be perform only once per agreement.
    function disputeAgreement(uint256 id) external override {
        if (agreement[id].disputed)
            revert AgreementAlreadyDisputed();
        if (!_isPartOfAgreement(id, msg.sender))
            revert NoPartOfAgreement();

        agreement[id].disputed = true;

        emit AgreementDisputed(id, msg.sender);
    }

    /// @notice Withdraw your position from the agreement.
    /// @inheritdoc IAgreementFramework
    /// @dev Requires the caller to be part of the agreement.
    /// @dev Requires the agreement to be finalized.
    /// @dev Clear your position balance and transfer funds.
    function withdrawFromAgreement(uint256 id) external override {
        if (!_isFinalized(id))
            revert AgreementNotFinalized();
        if (!_isPartOfAgreement(id, msg.sender))
            revert NoPartOfAgreement();

        uint256 withdrawBalance = agreement[id].position[msg.sender].balance;
        agreement[id].position[msg.sender].balance = 0;

        SafeTransferLib.safeTransfer(token, msg.sender, withdrawBalance);

        emit AgreementPositionUpdated(
            id,
            msg.sender,
            0,
            agreement[id].position[msg.sender].status
        );
    }

    /// @dev Check if an agreement is finalized.
    /// @dev An agreement is finalized when all positions are finalized.
    /// @param id Id of the agreement to check.
    /// @return A boolean signaling if the agreement is finalized or not.
    function _isFinalized(uint256 id) internal view returns (bool) {
        return agreement[id].finalizations >= agreement[id].party.length;
    }

    /// @dev Check if an account is part of an agreement.
    /// @param id Id of the agreement to check.
    /// @param account Account to check.
    /// @return A boolean signaling if the account is part of the agreement or not.
    function _isPartOfAgreement(uint256 id, address account) internal view returns (bool) {
        return (
            (agreement[id].party.length > 0)
            && (agreement[id].party[agreement[id].position[account].id] == account)
        );
    }

    /// @dev Add a new position to an existent agreement.
    /// @param agreementId Id of the agreement to update.
    /// @param params Struct of the position params to add.
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

    /// Finalize an agreement with a settlement.
    /// @inheritdoc IArbitrable
    /// @dev Update the agreement's positions with the settlement and finalize the agreement.
    /// @dev The dispute id must match an agreement in dispute.
    /// @dev Requires the caller to be the arbitrator.
    /// @dev Requires that settlement includes all previous positions 
    /// @dev Requires that settlement match total balance of the agreement.
    /// @dev Allows the arbitrator to add new positions.
    function settleDispute(uint256 id, PositionParams[] calldata settlement) external override {
        if (msg.sender != arbitrator)
            revert OnlyArbitrator();
        if (!agreement[id].disputed)
            revert AgreementNotDisputed();

        uint256 positionsLength = settlement.length;
        uint256 newBalance;

        if (positionsLength < agreement[id].party.length)
            revert MissingPositions();
        for (uint256 i = 0; i < positionsLength; i++) {
            // Revert if previous positions parties do not match.
            if ((i < agreement[id].party.length)
                && (agreement[id].party[i] != settlement[i].party))
                revert PositionsMustMatch();

            // Add new parties to the agreement if needed.
            if (i >= agreement[id].party.length)
                agreement[id].party.push(settlement[i].party);

            // Update / Add position params from settlement.
            agreement[id].position[settlement[i].party] = Position(
                i,
                settlement[i].balance,
                PositionStatus.Finalized
            );

            newBalance += settlement[i].balance;

            emit AgreementPositionUpdated(
                id,
                settlement[i].party,
                settlement[i].balance,
                PositionStatus.Finalized
            );
        }

        if (newBalance != agreement[id].balance)
            revert SettlementBalanceMustMatch();

        // Finalize agreement.
        agreement[id].finalizations = positionsLength;

        emit AgreementFinalized(id);
    }

}
