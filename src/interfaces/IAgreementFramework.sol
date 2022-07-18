// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.13;
import { AgreementParams, PositionParams } from "../lib/AgreementStructs.sol";
import { CriteriaResolver } from "../lib/CriteriaResolution.sol";
import { IArbitrable } from "./IArbitrable.sol";

/// @notice Interface for agreements frameworks.
/// @dev Implementations must write the logic to manage individual agreements.
interface IAgreementFramework is IArbitrable {
    /* ====================================================================== //
                                        EVENTS
    // ====================================================================== */

    event AgreementCreated(uint256 id, bytes32 termsHash, uint256 criteria);
    event AgreementJoined(uint256 id, address party, uint256 balance);
    event AgreementFinalizationSent(uint256 id, address party);
    event AgreementFinalized(uint256 id);
    event AgreementDisputed(uint256 id, address party);
    event AgreementWithdrawn(uint256 id, address party, uint256 balance);

    /* ====================================================================== //
                                        ERRORS
    // ====================================================================== */

    error NonExistentAgreement();
    error InsufficientBalance();
    error NoPartOfAgreement();
    error PartyAlreadyJoined();
    error PartyAlreadyFinalized();
    error PartyMustMatchCriteria();
    error AgreementAlreadyDisputed();
    error AgreementNotFinalized();
    error AgreementNotDisputed();

    /* ====================================================================== //
                                        VIEWS
    // ====================================================================== */

    /// @notice Retrieve general parameters of an agreement.
    /// @param id Id of the agreement to return data from.
    function agreementParams(uint256 id) external view returns (AgreementParams memory);

    /// @notice Retrieve positions of an agreement.
    /// @param id Id of the agreement to return data from.
    function agreementPositions(uint256 id) external view returns (PositionParams[] memory);

    /* ====================================================================== //
                                    USER ACTIONS
    // ====================================================================== */

    /// @notice Create a new agreement with given params.
    /// @param params Struct of agreement params.
    /// @return id Id of the agreement created.
    function createAgreement(AgreementParams calldata params) external returns (uint256 id);

    /// @notice Join an existent agreement.
    /// @dev Requires a deposit over agreement criteria.
    /// @param id Id of the agreement to join.
    /// @param criteriaResolver Criteria data to proof sender can join agreement.
    function joinAgreement(uint256 id, CriteriaResolver calldata criteriaResolver) external;

    /// @notice Signal the intent to finalize an agreement.
    /// @param id Id of the agreement to settle.
    function finalizeAgreement(uint256 id) external;

    /// @notice Dispute agreement so arbitration is needed for finalization.
    /// @param id Id of the agreement to dispute.
    function disputeAgreement(uint256 id) external;

    /// @notice Withdraw your position for agreement.
    /// @param id Id of the agreement to withdraw from.
    function withdrawFromAgreement(uint256 id) external;
}
