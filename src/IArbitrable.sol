// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {PositionParams} from "./AgreementStructs.sol";

/// @notice Interface for arbitrable contracts.
/// @dev Implementers must write the logic to raise and settle disputes.
interface IArbitrable {

    error OnlyArbitrator();

    /// @notice Address capable of settle disputes.
    function arbitrator() external view returns(address);

    /// @notice Amount of tokens reserved for an arbitration.
    function arbitrationFee() external view returns(uint256);

    /// @notice Settle dispute providing settlement positions.
    /// @param id Id of the dispute to settle.
    /// @param settlement Arbitrated positions to settle.
    function settleDispute(uint256 id, PositionParams[] calldata settlement) external;
}
