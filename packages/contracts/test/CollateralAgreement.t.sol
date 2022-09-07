// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { MockERC20 } from "solmate/src/test/utils/mocks/MockERC20.sol";

import {
    AgreementParams,
    AgreementPosition,
    PositionParams,
    PositionStatus,
    Permit,
    FeeCollector,
    Owned,
    CollateralAgreementFramework
} from "nation3-court/agreements/CollateralAgreement.sol";
import { CriteriaResolver, CriteriaResolution } from "nation3-court/lib/CriteriaResolution.sol";
import { IAgreementFramework } from "nation3-court/interfaces/IAgreementFramework.sol";
import { IArbitrable } from "nation3-court/interfaces/IArbitrable.sol";

import { AgreementFrameworkTestBase } from "./utils/AgreementFrameworkTestBase.sol";

contract CollateralAgreementTest is AgreementFrameworkTestBase {
    /// @dev Framework casted to collateral agreement interface for implementation specific functions.
    CollateralAgreementFramework collateralFramework;

    uint256 constant DISPUTE_FEE = 0.1 * 1e18;

    address doll = hevm.addr(0xD011);

    function setUp() public {
        token = new MockERC20("framework Token", "AT", 18);
        framework = new CollateralAgreementFramework();
        collateralFramework = CollateralAgreementFramework(address(framework));

        collateralFramework.setUp(token, token, arbitrator, DISPUTE_FEE);

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
        assertEq(uint256(agreementPositions[0].status), uint256(PositionStatus.Joined));
        assertEq(collateralFramework.totalBalance(), 2 * 1e18);
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
        assertEq(collateralFramework.totalBalance(), 2 * 1e18);
    }

    function testCantJoinWithInvalidCriteria() public {
        bytes32 agreementId = _createAgreement();
        Permit memory permit = _getPermit(0xB0B, 2 * 1e18, 0);

        hevm.startPrank(bob);
        hevm.expectRevert(CriteriaResolution.InvalidProof.selector);
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
        hevm.expectRevert(IAgreementFramework.PartyAlreadyJoined.selector);
        framework.joinAgreement(agreementId, CriteriaResolver(bob, 2 * 1e18, proofs[bob]));
        hevm.stopPrank();
    }

    function testCantJoinDisputedAgreement() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreementWithPermit(agreementId);
        _disputeAgreement(bob, agreementId);

        _aliceExpectsErrorWhenJoining(
            agreementId,
            IAgreementFramework.AgreementIsDisputed.selector
        );
    }

    function testCantJoinFinalizedAgreement() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreementWithPermit(agreementId);
        hevm.prank(bob);
        framework.finalizeAgreement(agreementId);

        _aliceExpectsErrorWhenJoining(
            agreementId,
            IAgreementFramework.AgreementIsFinalized.selector
        );
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
        hevm.expectRevert(IAgreementFramework.AgreementNotFinalized.selector);
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

        _aliceExpectsErrorWhenFinalizing(
            agreementId,
            IAgreementFramework.NoPartOfAgreement.selector
        );
    }

    function testCantFinalizeDisputedAgreement() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreementWithPermit(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        _disputeAgreement(bob, agreementId);

        _aliceExpectsErrorWhenFinalizing(
            agreementId,
            IAgreementFramework.AgreementIsDisputed.selector
        );
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

        _aliceExpectsErrorWhenFinalizing(
            agreementId,
            IAgreementFramework.PartyAlreadyFinalized.selector
        );
    }

    /* ====================================================================== //
                                    DISPUTE TESTS
    // ====================================================================== */

    function testDisputeAgreement() public {
        bytes32 agreementId = _createAgreement();
        _bobJoinsAgreement(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        hevm.startPrank(bob);
        token.approve(address(framework), DISPUTE_FEE);
        framework.disputeAgreement(agreementId);
        hevm.stopPrank();

        (, , , , , bool disputed) = collateralFramework.agreement(agreementId);

        assertTrue(disputed);
        assertEq(token.balanceOf(address(arbitrator)), DISPUTE_FEE);
    }

    function testDisputeAgreementWithPermit() public {
        bytes32 agreementId = _createAgreement();
        _bobJoinsAgreement(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        hevm.startPrank(bob);
        framework.disputeAgreementWithPermit(agreementId, _getPermit(0xB0B, DISPUTE_FEE, 0));
        hevm.stopPrank();

        (, , , , , bool disputed) = collateralFramework.agreement(agreementId);

        assertTrue(disputed);
        assertEq(token.balanceOf(address(arbitrator)), DISPUTE_FEE);
    }

    function testOnlyPartyCanDisputeAgreement() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreementWithPermit(agreementId);

        _aliceExpectsErrorWhenDisputing(
            agreementId,
            IAgreementFramework.NoPartOfAgreement.selector
        );
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

        _aliceExpectsErrorWhenDisputing(
            agreementId,
            IAgreementFramework.AgreementIsFinalized.selector
        );
    }

    /* ====================================================================== //
                              DISPUTE SETTLEMENT TESTS
    // ====================================================================== */

    function _setupDispute() internal returns (bytes32 agreementId) {
        agreementId = _createAgreement();

        _bobJoinsAgreement(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        _disputeAgreement(bob, agreementId);
    }

    function _getValidSettlement() internal view returns (PositionParams[] memory) {
        PositionParams[] memory settlement = new PositionParams[](2);

        settlement[0] = PositionParams(bob, 3 * 1e18);
        settlement[1] = PositionParams(alice, 0);

        return settlement;
    }

    function _verifySettlement(
        PositionParams[] memory settlement,
        AgreementPosition[] memory agreementPositions
    ) internal {
        for (uint256 i = 0; i < settlement.length; i++) {
            assertEq(agreementPositions[i].party, settlement[i].party);
            assertEq(agreementPositions[i].balance, settlement[i].balance);
            assertEq(uint256(agreementPositions[i].status), uint256(PositionStatus.Finalized));
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
        hevm.expectRevert(CollateralAgreementFramework.PositionsMustMatch.selector);
        framework.settleDispute(disputedId, settlement);
    }

    function testSettlementCantAddNewPositions() public {
        bytes32 disputedId = _setupDispute();

        PositionParams[] memory settlement = new PositionParams[](3);
        settlement[0] = PositionParams(bob, 1.5 * 1e18);
        settlement[1] = PositionParams(alice, 0 * 1e18);
        settlement[2] = PositionParams(doll, 1.5 * 1e18);

        hevm.prank(arbitrator);
        hevm.expectRevert(CollateralAgreementFramework.PositionsMustMatch.selector);
        framework.settleDispute(disputedId, settlement);
    }

    function testSettlementMustMatchBalance() public {
        bytes32 disputedId = _setupDispute();

        PositionParams[] memory settlement = new PositionParams[](2);
        // (Settlement balance = 4) > (3 = agreement balance)
        settlement[0] = PositionParams(bob, 1.5 * 1e18);
        settlement[1] = PositionParams(alice, 2.5 * 1e18);

        hevm.prank(arbitrator);
        hevm.expectRevert(CollateralAgreementFramework.BalanceMustMatch.selector);
        framework.settleDispute(disputedId, settlement);

        // (Settlement balance = 1.5) < (3 = agreement balance)
        settlement[1].balance = 0;

        hevm.prank(arbitrator);
        hevm.expectRevert(CollateralAgreementFramework.BalanceMustMatch.selector);
        framework.settleDispute(disputedId, settlement);
    }

    function testOnlyArbitratorCanSettleDispute() public {
        bytes32 disputedId = _setupDispute();

        PositionParams[] memory settlement = _getValidSettlement();

        hevm.expectRevert(IArbitrable.OnlyArbitrator.selector);
        framework.settleDispute(disputedId, settlement);
    }

    function testCantSettleDisputesInNotDisputedAgreements() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreementWithPermit(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        PositionParams[] memory settlement = _getValidSettlement();

        // Cant dispute ongoing agreement
        hevm.prank(arbitrator);
        hevm.expectRevert(IAgreementFramework.AgreementNotDisputed.selector);
        framework.settleDispute(agreementId, settlement);

        _disputeAgreement(bob, agreementId);

        hevm.prank(arbitrator);
        framework.settleDispute(agreementId, settlement);

        // Cant dispute finalized agreement
        hevm.prank(arbitrator);
        hevm.expectRevert(IAgreementFramework.AgreementIsFinalized.selector);
        framework.settleDispute(agreementId, settlement);
    }

    /* ====================================================================== //
                             AGREEMENT WITHDRAWAL TESTS
    // ====================================================================== */

    function testWithdrawFromAgreement() public {
        bytes32 agreementId = _createAgreement();
        uint256 bobBalance = token.balanceOf(bob);
        uint256 aliceBalance = token.balanceOf(alice);
        uint256 frameworkBalance = token.balanceOf(address(framework));

        _bobJoinsAgreementWithPermit(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        assertEq(token.balanceOf(address(framework)), 3 * 1e18);

        hevm.prank(bob);
        hevm.expectRevert(IAgreementFramework.AgreementNotFinalized.selector);
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
        assertEq(token.balanceOf(address(framework)), frameworkBalance);
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

    /* ====================================================================== //
                             FEES WITHDRAWAL TESTS
    // ====================================================================== */

    function testCollectFees() public {
        bytes32 agreementId = _createAgreement();
        uint256 arbitratorBalance = token.balanceOf(arbitrator);

        _bobJoinsAgreement(agreementId);
        token.mint(address(collateralFramework), 3 * 1e18);

        collateralFramework.collectFees();

        // Checks that only collect tokens in the contract that are not deposited as collateral.
        assertEq(token.balanceOf(arbitrator) - arbitratorBalance, 3 * 1e18);
    }

    function testOnlyOwnerCanWithdrawTokens() public {
        collateralFramework.setOwner(bob);

        hevm.expectRevert(Owned.Unauthorized.selector);
        collateralFramework.withdrawTokens(token, alice, 3 * 1e18);
    }

    function testWithdrawTokens() public {
        bytes32 agreementId = _createAgreement();
        uint256 arbitratorBalance = token.balanceOf(arbitrator);

        _bobJoinsAgreement(agreementId);
        token.mint(address(collateralFramework), 3 * 1e18);

        collateralFramework.withdrawTokens(token, arbitrator, 3 * 1e18);

        assertEq(token.balanceOf(arbitrator) - arbitratorBalance, 3 * 1e18);
    }

    function testCantWithdrawCollateralTokens() public {
        bytes32 agreementId = _createAgreement();
        _bobJoinsAgreement(agreementId);
        token.mint(address(collateralFramework), 3 * 1e18);

        uint256 contractBalance = token.balanceOf(address(collateralFramework));

        hevm.expectRevert(IAgreementFramework.InsufficientBalance.selector);
        collateralFramework.withdrawTokens(token, arbitrator, contractBalance);
    }

    /* ====================================================================== //
                                  TEST SNIPPETS
    // ====================================================================== */

    function _disputeAgreement(address account, bytes32 agreementId) internal {
        hevm.startPrank(account);
        token.approve(address(framework), DISPUTE_FEE);
        framework.disputeAgreement(agreementId);
        hevm.stopPrank();
    }
}
