// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.13;
import { PositionParams } from "../lib/AgreementStructs.sol";

/// @notice Interface for arbitrable contracts.
/// @dev Implementers must write the logic to raise and settle disputes.
interface IArbitrable {

    error OnlyArbitrator();

    /// @notice Address capable of settling disputes.
    function arbitrator() external view returns (address);

    /// @notice Settles a dispute providing settlement positions.
    /// @param id Id of the dispute to settle.
    /// @param settlement Array of final positions.
    function settleDispute(uint256 id, PositionParams[] calldata settlement) external;
}
