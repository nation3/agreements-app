// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.15;

import { IArbitrable } from "nation3-court/interfaces/IArbitrable.sol";
import { PositionParams } from "nation3-court/lib/AgreementStructs.sol";

contract MockArbitrable is IArbitrable {
    mapping(bytes32 => uint8) public disputeStatus;
    uint256 internal counter;
    address public arbitrator;
    uint256 public arbitrationFee;

    error PositionsMustMatch();

    function setUp(address arbitrator_) public {
        arbitrator = arbitrator_;
    }

    function createDispute() public returns (bytes32) {
        bytes32 id = bytes32(counter);
        disputeStatus[id] = 1;
        counter += 1;
        return id;
    }

    function settleDispute(bytes32 id, PositionParams[] calldata settlement) public {
        if (msg.sender != arbitrator) revert OnlyArbitrator();
        if (settlement.length <= 0) revert PositionsMustMatch();
        disputeStatus[id] = 2;
    }
}
