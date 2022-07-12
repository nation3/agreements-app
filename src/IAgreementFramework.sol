// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {AgreementParams, PositionParams} from "./AgreementStructs.sol";
import {IArbitrable} from "./IArbitrable.sol";

/// @notice Interface for agreemnts frameworks.
/// @dev Implementations must manage the logic to manage individual agreements inside the same framework.
interface IAgreementFramework is IArbitrable {

    /* ====================================================================== //
                                        EVENTS
    // ====================================================================== */

    event AgreementCreated(uint256 agreementId, bytes32 termsHash, uint256 criteria);
    event AgreementJoined(uint256 agreementId, address party, uint256 balance);
    event AgreementTermination(uint256 agreementId, address party);
    event AgreementWithdrawn(uint256 agreementId, address party, uint256 balance);

    /* ====================================================================== //
                                        ERRORS
    // ====================================================================== */

    error CriteriaUnderArbitrationFee();
    error NonExistentAgreement();
    error InsuficientBalance();
    error NoPartOfAgreement();
    error PartyAlreadyTerminated();
    error AgreementNotTerminated();

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
    /// @param balance Amount to deposit on the agreement.
    function joinAgreement(uint256 id, uint256 balance) external;

    /// @notice Signal the intend to terminate an agreement by consensus.
    /// @param id Id of the agreement to settle.
    function terminateAgreement(uint256 id) external;

    /// @notice Dispute agreement so arbitration is needed for termination.
    /// @param id Id of the agreement to dispute.
    function disputeAgreement(uint256 id) external;

    /// @notice Withdraw your position for agreement.
    /// @param id Id of the agreement to withdraw from.
    function withdrawFromAgreement(uint256 id) external;
}


