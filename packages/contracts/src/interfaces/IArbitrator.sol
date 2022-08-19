// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { PositionParams } from "../lib/AgreementStructs.sol";
import { IArbitrable } from "./IArbitrable.sol";

interface IArbitrator {

    event ResolutionSubmited(address indexed framework, bytes32 indexed id);
    event ResolutionExecuted(address indexed framework, bytes32 indexed id);

    /// @notice Submit a resolution for a dispute.
    /// @dev Any new resolution for the same dispute overrides the last one.
    /// @param framework address of the framework of the agreement in dispute.
    /// @param id identifier of the agreement in dispute.
    /// @param settlement Array of final positions in the resolution.
    /// @return Hash of the resolution submitted.
    function submitResolution(
        IArbitrable framework,
        bytes32 id,
        string calldata metadataURI,
        PositionParams[] calldata settlement
    ) external returns (bytes32);

    /// @notice Execute a submitted resolution.
    /// @param framework address of the framework of the agreement in dispute.
    /// @param id identifier of the agreement in dispute.
    /// @param settlement Array of final positions in the resolution.
    function executeResolution(
        IArbitrable framework,
        bytes32 id,
        PositionParams[] calldata settlement
    ) external;

}

