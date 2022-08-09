// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.13;
import {
    AgreementParams,
    AgreementPosition,
    PositionParams,
    PositionStatus,
    Permit,
    CollateralAgreementFramework
} from "../../src/agreements/CollateralAgreement.sol";
import { MockERC20 } from "solmate/src/test/utils/mocks/MockERC20.sol";
import { CriteriaResolver } from "../../src/lib/CriteriaResolution.sol";
import { AgreementFrameworkTestBase } from "./utils/AgreementFrameworkTestBase.sol";

contract CollateralAgreementTest is AgreementFrameworkTestBase {
    function setUp() public {
        token = new MockERC20("framework Token", "AT", 18);
        framework = new CollateralAgreementFramework(token, arbitrator);

        token.mint(bob, 5 * 1e18);
        token.mint(alice, 5 * 1e18);
    }

    function testCreateAgreement() public {
        bytes32 agreementId = _createAgreement();
        AgreementParams memory createdAgreement = framework.agreementParams(agreementId);

        assertEq(createdAgreement.termsHash, termsHash);
        assertEq(createdAgreement.criteria, criteria);
        assertEq(createdAgreement.metadataURI, metadataURI);
    }

    /* ====================================================================== //
                                     JOIN TESTS
    // ====================================================================== */

    function testJoinAgreement() public {
        bytes32 agreementId = _createAgreement();

        // Bob joins the agreement
        hevm.startPrank(bob);
        token.approve(address(framework), 2 * 1e18);
        framework.joinAgreement(agreementId, CriteriaResolver(bob, 2 * 1e18, proofs[bob]));
        hevm.stopPrank();

        AgreementPosition[] memory agreementPositions = framework.agreementPositions(agreementId);

        assertEq(agreementPositions[0].party, bob);
        assertEq(agreementPositions[0].balance, 2 * 1e18);
        assertEq(uint256(agreementPositions[0].status), 0);
    }

    function testJoinAgreementWithPermit() public {
        bytes32 agreementId = _createAgreement();

        // Bob joins the agreement
        hevm.startPrank(bob);
        framework.joinAgreementWithPermit(
            agreementId,
            CriteriaResolver(bob, 2 * 1e18, proofs[bob]),
            _getPermit(0xB0B, 2 * 1e18, 0)
        );
        hevm.stopPrank();

        AgreementPosition[] memory agreementPositions = framework.agreementPositions(agreementId);

        assertEq(agreementPositions[0].party, bob);
        assertEq(agreementPositions[0].balance, 2 * 1e18);
    }

    function testCantJoinWithInvalidCriteria() public {
        bytes32 agreementId = _createAgreement();
        Permit memory permit = _getPermit(0xB0B, 2 * 1e18, 0);

        hevm.startPrank(bob);
        hevm.expectRevert(abi.encodeWithSignature("InvalidProof()"));
        framework.joinAgreementWithPermit(
            agreementId,
            CriteriaResolver(bob, 1 * 1e18, proofs[bob]),
            permit
        );
        hevm.stopPrank();
    }

    function testCantJoinAgreementMultipleTimes() public {
        bytes32 agreementId = _createAgreement();
        _bobJoinsAgreement(agreementId);

        hevm.startPrank(bob);
        hevm.expectRevert(abi.encodeWithSignature("PartyAlreadyJoined()"));
        framework.joinAgreement(agreementId, CriteriaResolver(bob, 2 * 1e18, proofs[bob]));
        hevm.stopPrank();
    }

    function testCantJoinDisputedAgreement() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreementWithPermit(agreementId);
        hevm.prank(bob);
        framework.disputeAgreement(agreementId);

        _aliceExpectsErrorWhenJoining(agreementId, "AgreementIsDisputed()");
    }

    function testCantJoinFinalizedAgreement() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreementWithPermit(agreementId);
        hevm.prank(bob);
        framework.finalizeAgreement(agreementId);

        _aliceExpectsErrorWhenJoining(agreementId, "AgreementIsFinalized()");
    }

    /* ====================================================================== //
                                FINALIZATION TESTS
    // ====================================================================== */

    function testFinalization() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreement(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        assertEq(token.balanceOf(address(framework)), 3 * 1e18);

        hevm.prank(bob);
        framework.finalizeAgreement(agreementId);

        // Bob tries to withdraw himself from the agreement before finalization consensus
        hevm.expectRevert(abi.encodeWithSignature("AgreementNotFinalized()"));
        framework.withdrawFromAgreement(agreementId);
        hevm.stopPrank();

        hevm.prank(alice);
        framework.finalizeAgreement(agreementId);

        hevm.prank(bob);
        framework.withdrawFromAgreement(agreementId);
    }

    function testOnlyPartyCanFinalizeAgreement() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreementWithPermit(agreementId);

        _aliceExpectsErrorWhenFinalizing(agreementId, "NoPartOfAgreement()");
    }

    function testCantFinalizeDisputedAgreement() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreementWithPermit(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        hevm.prank(bob);
        framework.disputeAgreement(agreementId);

        _aliceExpectsErrorWhenFinalizing(agreementId, "AgreementIsDisputed()");
    }

    function testCantFinalizeAlreadyFinalizedframework() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreementWithPermit(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        // Bob & alice finalize the agreement
        hevm.prank(bob);
        framework.finalizeAgreement(agreementId);
        hevm.prank(alice);
        framework.finalizeAgreement(agreementId);

        _aliceExpectsErrorWhenFinalizing(agreementId, "PartyAlreadyFinalized()");
    }

    /* ====================================================================== //
                                    DISPUTE TESTS
    // ====================================================================== */

    function testDisputeAgreement() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreement(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        hevm.prank(bob);
        framework.disputeAgreement(agreementId);
    }

    function testOnlyPartyCanDisputeAgreement() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreementWithPermit(agreementId);

        _aliceExpectsErrorWhenDisputing(agreementId, "NoPartOfAgreement()");
    }

    function testCantDisputeFinalizedAgreement() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreementWithPermit(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        // Bob & alice finalize the agreement
        hevm.prank(bob);
        framework.finalizeAgreement(agreementId);
        hevm.prank(alice);
        framework.finalizeAgreement(agreementId);

        _aliceExpectsErrorWhenDisputing(agreementId, "AgreementIsFinalized()");
    }

    /* ====================================================================== //
                              DISPUTE SETTLEMENT TESTS
    // ====================================================================== */

    function _setupDispute() internal returns (bytes32 agreementId) {
        agreementId = _createAgreement();

        _bobJoinsAgreement(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        hevm.prank(bob);
        framework.disputeAgreement(agreementId);
    }

    function _getValidSettlement() internal view returns (PositionParams[] memory) {
        PositionParams[] memory settlement = new PositionParams[](2);

        settlement[0] = PositionParams(bob, 3 * 1e18);
        settlement[1] = PositionParams(alice, 0);
        // settlement[2] = PositionParams(address(0xD011), 1.5 * 1e18);

        return settlement;
    }

    function _verifySettlement(
        PositionParams[] memory settlement,
        AgreementPosition[] memory agreementPositions
    ) internal {
        for (uint256 i = 0; i < settlement.length; i++) {
            assertEq(agreementPositions[i].party, settlement[i].party);
            assertEq(agreementPositions[i].balance, settlement[i].balance);
            assertEq(uint256(agreementPositions[i].status), 1);
        }
    }

    function testDisputeSettlement() public {
        bytes32 disputedId = _setupDispute();

        PositionParams[] memory settlement = _getValidSettlement();

        hevm.prank(arbitrator);
        framework.settleDispute(disputedId, settlement);

        AgreementPosition[] memory agreementPositions = framework.agreementPositions(disputedId);

        _verifySettlement(settlement, agreementPositions);
    }

    function testSettlementCantRemovePositions() public {
        bytes32 disputedId = _setupDispute();

        PositionParams[] memory settlement = new PositionParams[](1);
        settlement[0] = PositionParams(bob, 3 * 1e18);

        hevm.prank(arbitrator);
        hevm.expectRevert(abi.encodeWithSignature("PositionsMustMatch()"));
        framework.settleDispute(disputedId, settlement);
    }

    function testSettlementCantAddNewPositions() public {
        bytes32 disputedId = _setupDispute();

        PositionParams[] memory settlement = new PositionParams[](3);
        settlement[0] = PositionParams(bob, 1.5 * 1e18);
        settlement[1] = PositionParams(alice, 0 * 1e18);
        settlement[2] = PositionParams(address(0xD011), 1.5 * 1e18);

        hevm.prank(arbitrator);
        hevm.expectRevert(abi.encodeWithSignature("PositionsMustMatch()"));
        framework.settleDispute(disputedId, settlement);
    }

    function testSettlementMustMatchBalance() public {
        bytes32 disputedId = _setupDispute();

        PositionParams[] memory settlement = new PositionParams[](2);
        // Settlement balance = 4 > 3 = agreement balance
        settlement[0] = PositionParams(bob, 1.5 * 1e18);
        settlement[1] = PositionParams(alice, 2.5 * 1e18);

        hevm.prank(arbitrator);
        hevm.expectRevert(abi.encodeWithSignature("BalanceMustMatch()"));
        framework.settleDispute(disputedId, settlement);

        // Settlement balance = 1.5 < 3 = agreement balance
        settlement[1].balance = 0;

        hevm.prank(arbitrator);
        hevm.expectRevert(abi.encodeWithSignature("BalanceMustMatch()"));
        framework.settleDispute(disputedId, settlement);
    }

    function testOnlyArbitratorCanSettleDispute() public {
        bytes32 disputedId = _setupDispute();

        PositionParams[] memory settlement = _getValidSettlement();

        hevm.expectRevert(abi.encodeWithSignature("OnlyArbitrator()"));
        framework.settleDispute(disputedId, settlement);
    }

    function testCantSettleDisputesInNotDisputedAgreements() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreementWithPermit(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        PositionParams[] memory settlement = _getValidSettlement();

        // Cant dispute ongoing agreement
        hevm.prank(arbitrator);
        hevm.expectRevert(abi.encodeWithSignature("AgreementNotDisputed()"));
        framework.settleDispute(agreementId, settlement);

        hevm.prank(bob);
        framework.disputeAgreement(agreementId);

        hevm.prank(arbitrator);
        framework.settleDispute(agreementId, settlement);

        // Cant dispute finalized agreement
        hevm.prank(arbitrator);
        hevm.expectRevert(abi.encodeWithSignature("AgreementIsFinalized()"));
        framework.settleDispute(agreementId, settlement);
    }

    /* ====================================================================== //
                                  WITHDRAW TESTS
    // ====================================================================== */

    function testWithdrawFromAgreement() public {
        bytes32 agreementId = _createAgreement();
        uint256 bobBalance = token.balanceOf(bob);
        uint256 aliceBalance = token.balanceOf(alice);

        _bobJoinsAgreementWithPermit(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        assertEq(token.balanceOf(address(framework)), 3 * 1e18);

        hevm.prank(bob);
        hevm.expectRevert(abi.encodeWithSignature("AgreementNotFinalized()"));
        framework.withdrawFromAgreement(agreementId);

        hevm.prank(bob);
        framework.finalizeAgreement(agreementId);
        hevm.prank(alice);
        framework.finalizeAgreement(agreementId);

        hevm.prank(alice);
        framework.withdrawFromAgreement(agreementId);
        hevm.prank(bob);
        framework.withdrawFromAgreement(agreementId);

        assertEq(token.balanceOf(bob), bobBalance);
        assertEq(token.balanceOf(alice), aliceBalance);
    }

    function testWithdrawAfterSettlement() public {
        bytes32 disputedId = _setupDispute();

        uint256 bobBalance = token.balanceOf(bob);
        uint256 aliceBalance = token.balanceOf(alice);

        PositionParams[] memory settlement = _getValidSettlement();

        hevm.prank(arbitrator);
        framework.settleDispute(disputedId, settlement);

        hevm.prank(alice);
        framework.withdrawFromAgreement(disputedId);
        hevm.prank(bob);
        framework.withdrawFromAgreement(disputedId);

        assertEq(token.balanceOf(bob) - bobBalance, settlement[0].balance);
        assertEq(token.balanceOf(alice) - aliceBalance, settlement[1].balance);
    }
}
