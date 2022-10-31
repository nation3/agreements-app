// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { ERC20 } from "solmate/src/tokens/ERC20.sol";
import { SafeTransferLib } from "solmate/src/utils/SafeTransferLib.sol";

import { IAgreementFramework } from "../interfaces/IAgreementFramework.sol";
import { IArbitrable } from "../interfaces/IArbitrable.sol";

import {
    Agreement,
    AgreementParams,
    AgreementPosition,
    AgreementStatus,
    Position,
    PositionParams,
    PositionStatus
} from "../lib/AgreementStructs.sol";
import { Permit } from "../lib/Permit.sol";
import { CriteriaResolver, CriteriaResolution } from "../lib/CriteriaResolution.sol";
import { Owned } from "../lib/auth/Owned.sol";
import { FeeCollector } from "../lib/FeeCollector.sol";

/// @notice Framework to create collateral agreements.
/// @dev Funds are held on each agreement.
/// @dev Joining agreements criteria is defined by Merkle trees.
/// @dev Parties manually join previously created agreements.
/// @dev Agreements finalization by unanimity of its parties.
/// @dev Parties manually withdraw their position from agreement.
contract CollateralAgreementFramework is
    IAgreementFramework,
    CriteriaResolution,
    Owned(msg.sender),
    FeeCollector
{
    /* ====================================================================== //
                                        ERRORS
    // ====================================================================== */

    error PositionsMustMatch();
    error BalanceMustMatch();

    /* ====================================================================== //
                                        STORAGE
    // ====================================================================== */

    /// @dev Token used as collateral in agreements.
    ERC20 public collateralToken;

    /// @dev Address with the power to settle agreements in dispute.
    address public arbitrator;

    /// @dev Total amount of collateral tokens deposited in the framework.
    uint256 public totalBalance;

    /// @dev Map of agreements by id.
    mapping(bytes32 => Agreement) public agreement;

    /// @dev Internal agreement nonce.
    uint256 internal _nonce;

    function setUp(
        ERC20 collateralToken_,
        ERC20 feeToken_,
        address arbitrator_,
        uint256 fee_
    ) external onlyOwner {
        _setFee(feeToken_, arbitrator_, fee_);
        collateralToken = collateralToken_;
        arbitrator = arbitrator_;
    }

    /* ====================================================================== */
    /*                                  VIEWS
    /* ====================================================================== */

    /// @dev Retrieve an AgreementParams struct with the data of a given agreement.
    /// @inheritdoc IAgreementFramework
    function agreementParams(bytes32 id)
        external
        view
        override
        returns (AgreementParams memory params)
    {
        params = AgreementParams(
            agreement[id].termsHash,
            agreement[id].criteria,
            agreement[id].metadataURI
        );
    }

    /// @dev Retrieve the array of positions of given agreement with its balance and status.
    /// @inheritdoc IAgreementFramework
    function agreementPositions(bytes32 id)
        external
        view
        override
        returns (AgreementPosition[] memory)
    {
        uint256 partyLength = agreement[id].party.length;
        AgreementPosition[] memory positions = new AgreementPosition[](partyLength);

        for (uint256 i = 0; i < partyLength; i++) {
            address party = agreement[id].party[i];

            positions[i] = AgreementPosition(
                party,
                agreement[id].position[party].balance,
                agreement[id].position[party].status
            );
        }

        return positions;
    }

    /// @dev Retrieve a simplified status of the agreement from its attributes.
    /// @inheritdoc IAgreementFramework
    function agreementStatus(bytes32 id) external view override returns (AgreementStatus) {
        if (agreement[id].party.length > 0) {
            if (agreement[id].finalizations >= agreement[id].party.length)
                return AgreementStatus.Finalized;
            if (agreement[id].disputed) return AgreementStatus.Disputed;
            // else
            return AgreementStatus.Ongoing;
        } else if (agreement[id].criteria != 0) {
            return AgreementStatus.Created;
        }
        revert NonExistentAgreement();
    }

    /* ====================================================================== */
    /*                                USER LOGIC
    /* ====================================================================== */

    /// @dev Create a new agreement with given params.
    /// @inheritdoc IAgreementFramework
    function createAgreement(AgreementParams calldata params)
        external
        override
        returns (bytes32 agreementId)
    {
        agreementId = keccak256(abi.encode(address(this), _nonce));

        agreement[agreementId].termsHash = params.termsHash;
        agreement[agreementId].criteria = params.criteria;
        agreement[agreementId].metadataURI = params.metadataURI;

        _nonce++;

        emit AgreementCreated(agreementId, params.termsHash, params.criteria, params.metadataURI);
    }

    /// @dev Join an existent agreement providing a valid criteria resolver.
    /// @inheritdoc IAgreementFramework
    function joinAgreement(bytes32 id, CriteriaResolver calldata resolver) external override {
        _canJoinAgreement(id, resolver);

        SafeTransferLib.safeTransferFrom(
            collateralToken,
            msg.sender,
            address(this),
            resolver.balance
        );

        _addPosition(id, PositionParams(msg.sender, resolver.balance));
        totalBalance += resolver.balance;

        emit AgreementJoined(id, msg.sender, resolver.balance);
    }

    /// @inheritdoc IAgreementFramework
    /// @dev Approve tokens & transfer on the same transaction by permit.
    function joinAgreementWithPermit(
        bytes32 id,
        CriteriaResolver calldata resolver,
        Permit calldata permit
    ) external override {
        _canJoinAgreement(id, resolver);

        collateralToken.permit(
            msg.sender,
            address(this),
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
        );
        SafeTransferLib.safeTransferFrom(
            collateralToken,
            msg.sender,
            address(this),
            resolver.balance
        );

        _addPosition(id, PositionParams(msg.sender, resolver.balance));
        totalBalance += resolver.balance;

        emit AgreementJoined(id, msg.sender, resolver.balance);
    }

    /// @inheritdoc IAgreementFramework
    /// @dev Requires the caller to be part of the agreement and not have finalized before.
    /// @dev Can't be perform on disputed agreements.
    function finalizeAgreement(bytes32 id) external override {
        if (agreement[id].disputed) revert AgreementIsDisputed();
        if (!_isPartOfAgreement(id, msg.sender)) revert NoPartOfAgreement();
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

        if (_isFinalized(id)) emit AgreementFinalized(id);
    }

    /// @inheritdoc IAgreementFramework
    function disputeAgreement(bytes32 id) external override {
        _canDisputeAgreement(id);

        SafeTransferLib.safeTransferFrom(feeToken, msg.sender, feeRecipient, fee);

        agreement[id].disputed = true;

        emit AgreementDisputed(id, msg.sender);
    }

    /// @inheritdoc IAgreementFramework
    function disputeAgreementWithPermit(bytes32 id, Permit calldata permit) external override {
        _canDisputeAgreement(id);

        feeToken.permit(
            msg.sender,
            address(this),
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
        );
        SafeTransferLib.safeTransferFrom(feeToken, msg.sender, feeRecipient, fee);

        agreement[id].disputed = true;

        emit AgreementDisputed(id, msg.sender);
    }

    /// @notice Withdraw your position from the agreement.
    /// @inheritdoc IAgreementFramework
    /// @dev Requires the caller to be part of the agreement.
    /// @dev Requires the agreement to be finalized.
    /// @dev Draw funds from the position of the caller.
    function withdrawFromAgreement(bytes32 id) external override {
        if (!_isFinalized(id)) revert AgreementNotFinalized();
        if (!_isPartOfAgreement(id, msg.sender)) revert NoPartOfAgreement();

        uint256 withdrawBalance = agreement[id].position[msg.sender].balance;
        agreement[id].position[msg.sender].balance = 0;
        totalBalance -= withdrawBalance;

        SafeTransferLib.safeTransfer(collateralToken, msg.sender, withdrawBalance);

        emit AgreementPositionUpdated(id, msg.sender, 0, agreement[id].position[msg.sender].status);
    }

    /// @dev Check if caller can join an agreement with the criteria resolver provided.
    /// @param id Id of the agreement to check.
    /// @param resolver Criteria resolver to check against criteria.
    function _canJoinAgreement(bytes32 id, CriteriaResolver calldata resolver) internal view {
        if (agreement[id].disputed) revert AgreementIsDisputed();
        if (_isFinalized(id)) revert AgreementIsFinalized();
        if (_isPartOfAgreement(id, msg.sender)) revert PartyAlreadyJoined();
        if (msg.sender != resolver.account) revert PartyMustMatchCriteria();

        _validateCriteria(agreement[id].criteria, resolver);
    }

    /// @dev Check if caller can dispute an agreement.
    /// @dev Requires the caller to be part of the agreement.
    /// @dev Can be perform only once per agreement.
    /// @param id Id of the agreement to check.
    function _canDisputeAgreement(bytes32 id) internal view returns (bool) {
        if (agreement[id].disputed) revert AgreementIsDisputed();
        if (_isFinalized(id)) revert AgreementIsFinalized();
        if (!_isPartOfAgreement(id, msg.sender)) revert NoPartOfAgreement();
        return true;
    }

    /// @dev Check if an agreement is finalized.
    /// @dev An agreement is finalized when all positions are finalized.
    /// @param id Id of the agreement to check.
    /// @return A boolean signaling if the agreement is finalized or not.
    function _isFinalized(bytes32 id) internal view returns (bool) {
        return (agreement[id].party.length > 0 &&
            agreement[id].finalizations >= agreement[id].party.length);
    }

    /// @dev Check if an account is part of an agreement.
    /// @param id Id of the agreement to check.
    /// @param account Account to check.
    /// @return A boolean signaling if the account is part of the agreement or not.
    function _isPartOfAgreement(bytes32 id, address account) internal view returns (bool) {
        return ((agreement[id].party.length > 0) &&
            (agreement[id].party[agreement[id].position[account].id] == account));
    }

    /// @dev Add a new position to an existent agreement.
    /// @param agreementId Id of the agreement to update.
    /// @param params Struct of the position params to add.
    function _addPosition(bytes32 agreementId, PositionParams memory params) internal {
        uint256 partyId = agreement[agreementId].party.length;
        agreement[agreementId].party.push(params.party);
        agreement[agreementId].position[params.party] = Position(
            partyId,
            params.balance,
            PositionStatus.Joined
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
    function settleDispute(bytes32 id, PositionParams[] calldata settlement) external override {
        if (msg.sender != arbitrator) revert OnlyArbitrator();
        if (_isFinalized(id)) revert AgreementIsFinalized();
        if (!agreement[id].disputed) revert AgreementNotDisputed();

        uint256 positionsLength = settlement.length;
        uint256 newBalance;

        if (positionsLength != agreement[id].party.length) revert PositionsMustMatch();
        for (uint256 i = 0; i < positionsLength; i++) {
            // Revert if previous positions parties do not match.
            if (agreement[id].party[i] != settlement[i].party) revert PositionsMustMatch();

            // Update position params from settlement.
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

        if (newBalance != agreement[id].balance) revert BalanceMustMatch();

        // Finalize agreement.
        agreement[id].finalizations = positionsLength;
        emit AgreementFinalized(id);
    }

    /* ====================================================================== */
    /*                                 FEE COLLECTOR
    /* ====================================================================== */

    /// @inheritdoc FeeCollector
    function setFee(
        ERC20 token,
        address recipient,
        uint256 amount
    ) external override onlyOwner {
        _setFee(token, recipient, amount);
    }

    /// @inheritdoc FeeCollector
    /// @dev Prevents collecting deposited collateral as fees.
    /// @dev As this implementation send dispute fees directly to the feeRecipient the only tokens that would be collected as fee are tokens sent to the contract by error.
    function collectFees() external override {
        if (feeRecipient == address(0)) revert InvalidRecipient();
        uint256 amount = feeToken.balanceOf(address(this));

        if (feeToken == collateralToken) amount -= totalBalance;

        _withdraw(feeToken, feeRecipient, amount);
    }

    /// @notice Withdraw any ERC20 from the contract.
    /// @param token Token to withdraw.
    /// @param to Recipient address.
    /// @param amount Amount of tokens to withdraw.
    /// @dev Prevents withdrawing deposited collateral.
    function withdrawTokens(
        ERC20 token,
        address to,
        uint256 amount
    ) external onlyOwner {
        if (token == collateralToken) {
            uint256 available = token.balanceOf(address(this)) - totalBalance;
            if (amount > available) revert InsufficientBalance();
        }

        _withdraw(token, to, amount);
    }
}
