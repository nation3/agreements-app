// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;
import { IArbitrable } from "../../src/interfaces/IArbitrable.sol";
import { IArbitrator } from "../../src/interfaces/IArbitrator.sol";
import { Arbitrator, ResolutionStatus, Resolution } from "../../src/Arbitrator.sol";
import { PositionParams } from "../../src/lib/AgreementStructs.sol";
import { DSTestPlus } from "solmate/src/test/utils/DSTestPlus.sol";

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

contract ArbitratorTest is DSTestPlus {

    MockArbitrable arbitrable;
    Arbitrator arbitrator;

    uint256 constant LOCK_PERIOD = 20;

    address bob = hevm.addr(0xB0B);
    address alice = hevm.addr(0xA11CE);
    string metadataURI = "ifps://metadata";

    bytes32 disputeId;

    function setUp() public {
        arbitrator = new Arbitrator();
        arbitrable = new MockArbitrable();
        arbitrator.setUp(LOCK_PERIOD);
        arbitrable.setUp(address(arbitrator));
    }

    function testSubmitResolution() public {
        disputeId = arbitrable.createDispute();

        uint256 submitBlock = block.number;
        bytes32 hash = arbitrator.submitResolution(
            arbitrable,
            disputeId,
            metadataURI,
            _getSettlement()
        );
        (ResolutionStatus status,, string memory metadataURI_, uint256 unlockBlock) = arbitrator.resolution(hash);

        assertEq(uint(status), uint(ResolutionStatus.Pending));
        assertEq(metadataURI_, metadataURI);
        assertEq(unlockBlock, submitBlock + LOCK_PERIOD);
    }

    function testExecuteResolution() public {
        PositionParams[] memory settlement = _getSettlement();
        _submittedResolution();

        assertEq(arbitrable.disputeStatus(disputeId), 1);

        arbitrator.executeResolution(arbitrable, disputeId, settlement);

        assertEq(arbitrable.disputeStatus(disputeId), 2);
    }

    /* ====================================================================== //
                                      UTILS
    // ====================================================================== */

    function _getSettlement() internal view returns (PositionParams[] memory) {
        PositionParams[] memory settlement = new PositionParams[](2);
        settlement[0] = PositionParams(bob, 3 * 1e18);
        settlement[1] = PositionParams(alice, 0);

        return settlement;
    }

    function _submittedResolution() internal returns (bytes32 hash) {
        disputeId = arbitrable.createDispute();
        hash = arbitrator.submitResolution(
            arbitrable,
            disputeId,
            metadataURI,
            _getSettlement()
        );
    }

}
