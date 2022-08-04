// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.13;
import {
    AgreementParams,
    PositionParams,
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
                                     JOINING TESTS
    // ====================================================================== */

    function testJoinAgreement() public {
        bytes32 agreementId = _createAgreement();

        // Bob joins the agreement
        hevm.startPrank(bob);
        token.approve(address(framework), 2 * 1e18);
        framework.joinAgreement(agreementId, CriteriaResolver(bob, 2 * 1e18, proofs[bob]));
        hevm.stopPrank();

        PositionParams[] memory agreementPositions = framework.agreementPositions(agreementId);

        assertEq(agreementPositions[0].party, bob);
        assertEq(agreementPositions[0].balance, 2 * 1e18);
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

        PositionParams[] memory agreementPositions = framework.agreementPositions(agreementId);

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
        uint256 bobBalance = token.balanceOf(bob);
        uint256 aliceBalance = token.balanceOf(alice);

        _bobJoinsAgreement(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        assertEq(token.balanceOf(address(framework)), 3 * 1e18);

        // Bob tries to withdraw himself from the agreement before finalization.
        hevm.startPrank(bob);
        hevm.expectRevert(abi.encodeWithSignature("AgreementNotFinalized()"));
        framework.withdrawFromAgreement(agreementId);

        // Bob agrees to finalize the agreement.
        framework.finalizeAgreement(agreementId);

        // Bob tries to withdraw himself from the agreement before finalization consensus
        hevm.expectRevert(abi.encodeWithSignature("AgreementNotFinalized()"));
        framework.withdrawFromAgreement(agreementId);
        hevm.stopPrank();

        // Alice agrees to finalize and withdraws herself from the agreement
        hevm.startPrank(alice);
        framework.finalizeAgreement(agreementId);
        framework.withdrawFromAgreement(agreementId);
        hevm.stopPrank();

        // Bob can withdraw himself after finalization consensus
        hevm.prank(bob);
        framework.withdrawFromAgreement(agreementId);

        assertEq(token.balanceOf(bob), bobBalance);
        assertEq(token.balanceOf(alice), aliceBalance);
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

    function testDisputeAndSettlement() public {
        bytes32 agreementId = _createAgreement();

        _bobJoinsAgreement(agreementId);
        _aliceJoinsAgreementWithPermit(agreementId);

        hevm.prank(bob);
        framework.disputeAgreement(agreementId);

        // Arbitrator settles dispute
        PositionParams[] memory settlementPositions = new PositionParams[](3);
        settlementPositions[0] = PositionParams(bob, 1.5 * 1e18);
        settlementPositions[1] = PositionParams(alice, 0);
        settlementPositions[2] = PositionParams(address(0xD0011), 1.5 * 1e18);

        hevm.prank(arbitrator);
        framework.settleDispute(agreementId, settlementPositions);

        // Check new settlement positions
        PositionParams[] memory agreementPositions = framework.agreementPositions(agreementId);
        assertEq(agreementPositions[0].party, bob);
        assertEq(agreementPositions[0].balance, 1.5 * 1e18);
        assertEq(agreementPositions[1].party, alice);
        assertEq(agreementPositions[1].balance, 0);
        assertEq(agreementPositions[2].balance, 1.5 * 1e18);

        // Bob withdraws from agreement
        hevm.prank(bob);
        framework.withdrawFromAgreement(agreementId);
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
}
