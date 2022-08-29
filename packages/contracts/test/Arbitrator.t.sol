// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.15;

import { DSTestPlus } from "solmate/src/test/utils/DSTestPlus.sol";
import { MockERC20 } from "solmate/src/test/utils/mocks/MockERC20.sol";

import {
    Arbitrator,
    IArbitrator,
    ResolutionStatus,
    Resolution
} from "nation3-court/Arbitrator.sol";
import { PositionParams } from "nation3-court/lib/AgreementStructs.sol";

import { MockArbitrable } from "./utils/mocks/MockArbitrable.sol";

contract ArbitratorTest is DSTestPlus {
    MockERC20 token;
    MockArbitrable arbitrable;
    Arbitrator arbitrator;

    uint256 constant LOCK_PERIOD = 20;
    uint256 constant APPEAL_FEE = 0.5 * 1e18;

    address bob = hevm.addr(0xB0B);
    address alice = hevm.addr(0xA11CE);
    string metadataURI = "ifps://metadata";

    bytes32 disputeId;

    function setUp() public {
        token = new MockERC20("TestToken", "TEST", 18);
        arbitrator = new Arbitrator();
        arbitrable = new MockArbitrable();

        token.mint(bob, 1e18);
        token.mint(alice, 1e18);

        arbitrator.setUp(token, APPEAL_FEE, LOCK_PERIOD, true);
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
        (ResolutionStatus status, , string memory metadataURI_, uint256 unlockBlock) = arbitrator
            .resolution(hash);

        assertEq(uint256(status), uint256(ResolutionStatus.Pending));
        assertEq(metadataURI_, metadataURI);
        assertEq(unlockBlock, submitBlock + LOCK_PERIOD);
    }

    function testSubmitNewResolutionForSameDispute() public {
        bytes32 hash = _submittedResolution();

        (, bytes32 originalMark, , ) = arbitrator.resolution(hash);

        // Generate new settlement
        PositionParams[] memory newSettlement = _getSettlement();
        newSettlement[1].balance = 1e18;

        hevm.roll(block.number + LOCK_PERIOD);

        // Submit new resolution for the same dispute
        arbitrator.submitResolution(arbitrable, disputeId, metadataURI, newSettlement);

        (, bytes32 mark, , uint256 unlockBlock) = arbitrator.resolution(hash);

        assertTrue(originalMark != mark);
        assertTrue(mark == keccak256(abi.encode(newSettlement)));
        assertTrue(unlockBlock == block.number + LOCK_PERIOD);
    }

    function testCantSubmitNewResolutionForExecutedOne() public {
        _executedResolution();

        hevm.expectRevert(IArbitrator.ResolutionIsExecuted.selector);
        arbitrator.submitResolution(arbitrable, disputeId, "ipfs://metadata.new", _getSettlement());
    }

    function testExecuteResolution() public {
        _submittedResolution();

        hevm.roll(block.number + LOCK_PERIOD);
        assertEq(arbitrable.disputeStatus(disputeId), 1);

        arbitrator.executeResolution(arbitrable, disputeId, _getSettlement());

        assertEq(arbitrable.disputeStatus(disputeId), 2);
    }

    function testCantExecuteResolutionBeforeUnlock() public {
        _submittedResolution();

        hevm.expectRevert(IArbitrator.ExecutionStillLocked.selector);
        arbitrator.executeResolution(arbitrable, disputeId, _getSettlement());
    }

    function testCantExecuteAppealedResolution() public {
        _appealledResolution();

        hevm.expectRevert(IArbitrator.ResolutionIsAppealed.selector);
        arbitrator.executeResolution(arbitrable, disputeId, _getSettlement());
    }

    function testCantExecuteAlreadyExecutedResolution() public {
        _executedResolution();

        hevm.expectRevert(IArbitrator.ResolutionIsExecuted.selector);
        arbitrator.executeResolution(arbitrable, disputeId, _getSettlement());
    }

    function testCantExecuteResolutionMismatch() public {
        _submittedResolution();
        PositionParams[] memory newSettlement = new PositionParams[](2);

        hevm.roll(block.number + LOCK_PERIOD);

        hevm.expectRevert(IArbitrator.ResolutionMustMatch.selector);
        arbitrator.executeResolution(arbitrable, disputeId, newSettlement);
    }

    function testCanAlwaysExecuteEndorsedResolution() public {
        bytes32 resolutionId = _appealledResolution();

        arbitrator.endorseResolution(resolutionId, _getSettlement());

        // Resolution appealed and inside the lock period.
        arbitrator.executeResolution(arbitrable, disputeId, _getSettlement());
    }

    function testAppealResolution() public {
        bytes32 resolutionId = _submittedResolution();

        hevm.startPrank(bob);
        token.approve(address(arbitrator), APPEAL_FEE);
        arbitrator.appealResolution(resolutionId, _getSettlement());
        hevm.stopPrank();

        (ResolutionStatus status, , , ) = arbitrator.resolution(resolutionId);

        assertEq(uint256(status), uint256(ResolutionStatus.Appealed));
    }

    function testOnlyPartiesCanAppeal() public {
        bytes32 resolutionId = _submittedResolution();

        // Pretend to be random user that is not part of settlement
        hevm.prank(address(0xDEAD));
        hevm.expectRevert(IArbitrator.NoPartOfResolution.selector);
        arbitrator.appealResolution(resolutionId, _getSettlement());
    }

    function testEndorseResolution() public {
        bytes32 resolutionId = _appealledResolution();

        arbitrator.endorseResolution(resolutionId, _getSettlement());

        (ResolutionStatus status, , , ) = arbitrator.resolution(resolutionId);

        assertEq(uint256(status), uint256(ResolutionStatus.Endorsed));
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
        hash = arbitrator.submitResolution(arbitrable, disputeId, metadataURI, _getSettlement());
    }

    function _appealledResolution() internal returns (bytes32 hash) {
        hash = _submittedResolution();
        hevm.startPrank(bob);
        token.approve(address(arbitrator), APPEAL_FEE);
        arbitrator.appealResolution(hash, _getSettlement());
        hevm.stopPrank();
    }

    function _endorsedResolution() internal returns (bytes32 hash) {
        hash = _appealledResolution();
        arbitrator.endorseResolution(hash, _getSettlement());
    }

    function _executedResolution() internal returns (bytes32 hash) {
        hash = _submittedResolution();
        hevm.roll(block.number + LOCK_PERIOD);
        arbitrator.executeResolution(arbitrable, disputeId, _getSettlement());
    }
}
