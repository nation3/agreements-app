// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;
import {
    AgreementParams,
    AgreementPosition,
    PositionParams,
    PositionStatus
} from "../lib/AgreementStructs.sol";
import { CriteriaResolver } from "../lib/CriteriaResolution.sol";
import { Permit } from "../lib/Permit.sol";
import { IArbitrable } from "./IArbitrable.sol";

/// @notice Interface for agreements frameworks.
/// @dev Implementations must write the logic to manage individual agreements.
interface IAgreementFramework is IArbitrable {
    /* ====================================================================== //
                                        EVENTS
    // ====================================================================== */

    /// @dev Raised when a new agreement is created.
    /// @param id Id of the new created agreement.
    /// @param termsHash Hash of the detailed terms of the agreement.
    /// @param criteria Criteria requirements to join the agreement.
    /// @param metadataURI URI of the metadata of the agreement.
    event AgreementCreated(bytes32 id, bytes32 termsHash, uint256 criteria, string metadataURI);

    /// @dev Raised when a new party joins an agreement.
    /// @param id Id of the agreement joined.
    /// @param party Address of party joined.
    /// @param balance Balance of the party joined.
    event AgreementJoined(bytes32 id, address party, uint256 balance);

    /// @dev Raised when an existing party of an agreement updates its position.
    /// @param id Id of the agreement updated.
    /// @param party Address of the party updated.
    /// @param balance New balance of the party.
    /// @param status New status of the position.
    event AgreementPositionUpdated(
        bytes32 id,
        address party,
        uint256 balance,
        PositionStatus status
    );

    /// @dev Raised when an agreement is finalized.
    /// @param id Id of the agreement finalized.
    event AgreementFinalized(bytes32 id);

    /// @dev Raised when an agreement is in dispute.
    /// @param id Id of the agreement in dispute.
    /// @param party Address of the party that raises the dispute.
    event AgreementDisputed(bytes32 id, address party);

    /* ====================================================================== //
                                        ERRORS
    // ====================================================================== */

    error NonExistentAgreement();
    error InsufficientBalance();
    error NoPartOfAgreement();
    error PartyAlreadyJoined();
    error PartyAlreadyFinalized();
    error PartyMustMatchCriteria();
    error AgreementIsDisputed();
    error AgreementIsFinalized();
    error AgreementNotFinalized();
    error AgreementNotDisputed();

    /* ====================================================================== //
                                        VIEWS
    // ====================================================================== */

    /// @notice Retrieve general parameters of an agreement.
    /// @param id Id of the agreement to return data from.
    /// @return AgreementParams struct with the parameters of the agreement.
    function agreementParams(bytes32 id) external view returns (AgreementParams memory);

    /// @notice Retrieve positions of an agreement.
    /// @param id Id of the agreement to return data from.
    /// @return Array of the positions of the agreement.
    function agreementPositions(bytes32 id) external view returns (AgreementPosition[] memory);

    /* ====================================================================== //
                                    USER ACTIONS
    // ====================================================================== */

    /// @notice Create a new agreement with given params.
    /// @param params Struct of agreement params.
    /// @return id Id of the agreement created.
    function createAgreement(AgreementParams calldata params) external returns (bytes32 id);

    /// @notice Join an existing agreement.
    /// @dev Requires a deposit over agreement criteria.
    /// @param id Id of the agreement to join.
    /// @param resolver Criteria data to prove sender can join agreement.
    function joinAgreement(bytes32 id, CriteriaResolver calldata resolver) external;

    /// @notice Join an existing agreement with EIP-2612 permit.
    ///         Allow to approve and transfer funds on the same transaction.
    /// @param id Id of the agreement to join.
    /// @param resolver Criteria data to prove sender can join agreement.
    /// @param permit EIP-2612 permit data to approve transfer of tokens.
    function joinAgreementWithPermit(
        bytes32 id,
        CriteriaResolver calldata resolver,
        Permit calldata permit
    ) external;

    /// @notice Signal the will of the caller to finalize an agreement.
    /// @param id Id of the agreement to settle.
    function finalizeAgreement(bytes32 id) external;

    /// @notice Dispute agreement so arbitration is needed for finalization.
    /// @param id Id of the agreement to dispute.
    function disputeAgreement(bytes32 id) external;

    /// @notice Withdraw your position from the agreement.
    /// @param id Id of the agreement to withdraw from.
    function withdrawFromAgreement(bytes32 id) external;
}
