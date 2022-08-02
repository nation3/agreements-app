// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.13;

import {
    AgreementParams,
    PositionParams,
    Permit,
    CollateralAgreementFramework
} from "../src/agreements/CollateralAgreement.sol";
import { CriteriaResolver } from "../src/lib/CriteriaResolution.sol";
import { MockERC20 } from "solmate/src/test/utils/mocks/MockERC20.sol";
import { Hevm } from "solmate/src/test/utils/Hevm.sol";
import { DSTestPlus } from "solmate/src/test/utils/DSTestPlus.sol";
import { Merkle } from "murky/Merkle.sol";

contract CollateralAgreementTest is DSTestPlus {
    Merkle merkle = new Merkle();

    CollateralAgreementFramework agreements;
    MockERC20 token;

    bytes32 termsHash;
    uint256 criteria;
    uint256 arbitrationFee;

    address arbitrator = address(0xB055);
    address bob = hevm.addr(0xB0B);
    address alice = hevm.addr(0xA11CE);

    mapping(address => bytes32[]) proofs;

    bytes32 constant PERMIT_HASH =
        keccak256(
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
        );

    function setUp() public {
        arbitrationFee = 0.02 ether;

        token = new MockERC20("Agreements Token", "AT", 18);
        agreements = new CollateralAgreementFramework(token, arbitrator);

        token.mint(bob, 5 * 1e18);
        token.mint(alice, 5 * 1e18);
    }

    function testCreateAgreement() public {
        bytes32 agreementId = _createAgreement();
        AgreementParams memory createdAgreement = agreements.agreementParams(agreementId);

        assertEq(createdAgreement.termsHash, termsHash);
        assertEq(createdAgreement.criteria, criteria);
    }

    function testJoinAgreement() public {
        bytes32 agreementId = _createAgreement();

        // Bob joins the agreement
        hevm.startPrank(bob);
        token.approve(address(agreements), 2 * 1e18);
        agreements.joinAgreement(agreementId, CriteriaResolver(bob, 2 * 1e18, proofs[bob]));
        hevm.stopPrank();

        PositionParams[] memory agreementPositions = agreements.agreementPositions(agreementId);

        assertEq(agreementPositions[0].party, bob);
        assertEq(agreementPositions[0].balance, 2 * 1e18);
    }

    function testJoinAgreementWithPermit() public {
        bytes32 agreementId = _createAgreement();

        // Bob joins the agreement
        hevm.startPrank(bob);
        agreements.joinAgreementWithPermit(
            agreementId,
            CriteriaResolver(bob, 2 * 1e18, proofs[bob]),
            _getPermit(0xB0B, 2 * 1e18, 0)
        );
        hevm.stopPrank();

        PositionParams[] memory agreementPositions = agreements.agreementPositions(agreementId);

        assertEq(agreementPositions[0].party, bob);
        assertEq(agreementPositions[0].balance, 2 * 1e18);
    }

    function testCantJoinWithInvalidCriteria() public {
        bytes32 agreementId = _createAgreement();
        Permit memory permit = _getPermit(0xB0B, 2 * 1e18, 0);

        hevm.startPrank(bob);
        hevm.expectRevert(abi.encodeWithSignature("InvalidProof()"));
        agreements.joinAgreementWithPermit(
            agreementId,
            CriteriaResolver(bob, 1 * 1e18, proofs[bob]),
            permit
        );
        hevm.stopPrank();
    }

    function testCantJoinAgreementMultipleTimes() public {
        bytes32 agreementId = _createAgreement();

        hevm.startPrank(bob);
        token.approve(address(agreements), 5 * 1e18);

        agreements.joinAgreement(agreementId, CriteriaResolver(bob, 2 * 1e18, proofs[bob]));

        hevm.expectRevert(abi.encodeWithSignature("PartyAlreadyJoined()"));
        agreements.joinAgreement(agreementId, CriteriaResolver(bob, 2 * 1e18, proofs[bob]));

        hevm.stopPrank();
    }

    function testCantJoinDisputedAgreement() public {
        bytes32 agreementId = _createAgreement();

        // Bob joins the agreement & disputes.
        hevm.startPrank(bob);
        agreements.joinAgreementWithPermit(
            agreementId,
            CriteriaResolver(bob, 2 * 1e18, proofs[bob]),
            _getPermit(0xB0B, 2 * 1e18, 0)
        );
        agreements.disputeAgreement(agreementId);
        hevm.stopPrank();

        // Alice tries to join the agreement.
        hevm.startPrank(alice);
        token.approve(address(agreements), 2 * 1e18);

        hevm.expectRevert(abi.encodeWithSignature("AgreementIsDisputed()"));
        agreements.joinAgreement(agreementId, CriteriaResolver(alice, 1e18, proofs[alice]));
        hevm.stopPrank();
    }

    function testCantJoinFinalizedAgreement() public {
        bytes32 agreementId = _createAgreement();

        // Bob joins the agreement & finalize.
        hevm.startPrank(bob);
        agreements.joinAgreementWithPermit(
            agreementId,
            CriteriaResolver(bob, 2 * 1e18, proofs[bob]),
            _getPermit(0xB0B, 2 * 1e18, 0)
        );
        agreements.finalizeAgreement(agreementId);
        hevm.stopPrank();

        // Alice tries to join the agreement.
        hevm.startPrank(alice);
        token.approve(address(agreements), 2 * 1e18);

        hevm.expectRevert(abi.encodeWithSignature("AgreementIsFinalized()"));
        agreements.joinAgreement(agreementId, CriteriaResolver(alice, 1e18, proofs[alice]));
        hevm.stopPrank();
    }

    function testFinalization() public {
        bytes32 agreementId = _createAgreement();
        uint256 bobBalance = token.balanceOf(bob);
        uint256 aliceBalance = token.balanceOf(alice);

        // Bob joins the agreement.
        hevm.startPrank(bob);
        token.approve(address(agreements), 2 * 1e18);
        agreements.joinAgreement(agreementId, CriteriaResolver(bob, 2 * 1e18, proofs[bob]));
        hevm.stopPrank();

        // Alice joins the agreement.
        hevm.startPrank(alice);
        token.approve(address(agreements), 2 * 1e18);
        agreements.joinAgreement(agreementId, CriteriaResolver(alice, 1e18, proofs[alice]));
        hevm.stopPrank();

        assertEq(token.balanceOf(address(agreements)), 3 * 1e18);

        // Bob tries to withdraw himself from the agreement before finalization.
        hevm.startPrank(bob);
        hevm.expectRevert(abi.encodeWithSignature("AgreementNotFinalized()"));
        agreements.withdrawFromAgreement(agreementId);

        // Bob agrees to finalize the agreement.
        agreements.finalizeAgreement(agreementId);

        // Bob tries to withdraw himself from the agreement before finalization consensus
        hevm.expectRevert(abi.encodeWithSignature("AgreementNotFinalized()"));
        agreements.withdrawFromAgreement(agreementId);
        hevm.stopPrank();

        // Alice agrees to finalize and withdraws herself from the agreement
        hevm.startPrank(alice);
        agreements.finalizeAgreement(agreementId);
        agreements.withdrawFromAgreement(agreementId);
        hevm.stopPrank();

        // Bob can withdraw himself after finalization consensus
        hevm.prank(bob);
        agreements.withdrawFromAgreement(agreementId);

        assertEq(token.balanceOf(bob), bobBalance);
        assertEq(token.balanceOf(alice), aliceBalance);
    }

    function testDisputeSettlement() public {
        bytes32 agreementId = _createAgreement();

        // Bob joins the agreement
        hevm.startPrank(bob);
        token.approve(address(agreements), 2 * 1e18);
        agreements.joinAgreement(agreementId, CriteriaResolver(bob, 2 * 1e18, proofs[bob]));
        hevm.stopPrank();

        // Alice joins the agreement
        hevm.startPrank(alice);
        token.approve(address(agreements), 2 * 1e18);
        agreements.joinAgreement(agreementId, CriteriaResolver(alice, 1e18, proofs[alice]));
        hevm.stopPrank();

        // Bob dispute the agreement
        hevm.prank(bob);
        agreements.disputeAgreement(agreementId);

        // Arbitrator settles dispute
        PositionParams[] memory settlementPositions = new PositionParams[](3);
        settlementPositions[0] = PositionParams(bob, 1.5 * 1e18);
        settlementPositions[1] = PositionParams(alice, 0);
        settlementPositions[2] = PositionParams(address(0xD0011), 1.5 * 1e18);

        hevm.prank(arbitrator);
        agreements.settleDispute(agreementId, settlementPositions);

        // Check new settlement positions
        PositionParams[] memory agreementPositions = agreements.agreementPositions(agreementId);
        assertEq(agreementPositions[0].party, bob);
        assertEq(agreementPositions[0].balance, 1.5 * 1e18);
        assertEq(agreementPositions[1].party, alice);
        assertEq(agreementPositions[1].balance, 0);
        assertEq(agreementPositions[2].balance, 1.5 * 1e18);

        // Bob withdraws from agreement
        hevm.prank(bob);
        agreements.withdrawFromAgreement(agreementId);
    }

    /* ====================================================================== //
                                        UTILS
    // ====================================================================== */

    function _prepareCriteria() internal {
        PositionParams[] memory criteriaPositions = new PositionParams[](2);
        criteriaPositions[0] = PositionParams(bob, 2 * 1e18);
        criteriaPositions[1] = PositionParams(alice, 1 * 1e18);

        bytes32[] memory leafs = new bytes32[](criteriaPositions.length);

        for (uint256 i = 0; i < criteriaPositions.length; i++) {
            leafs[i] = keccak256(
                abi.encode(criteriaPositions[i].party, criteriaPositions[i].balance)
            );
        }

        for (uint256 i = 0; i < criteriaPositions.length; i++) {
            proofs[criteriaPositions[i].party] = merkle.getProof(leafs, i);
        }

        bytes32 root = merkle.getRoot(leafs);
        criteria = uint256(root);
    }

    function _createAgreement() internal returns (bytes32 agreementId) {
        _prepareCriteria();
        termsHash = keccak256("Terms & Conditions");

        agreementId = agreements.createAgreement(AgreementParams(termsHash, criteria));
    }

    function _getPermit(
        uint256 privateKey,
        uint256 value,
        uint256 nonce
    ) private returns (Permit memory permit) {
        address account = hevm.addr(privateKey);

        (uint8 v, bytes32 r, bytes32 s) = hevm.sign(
            privateKey,
            keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    token.DOMAIN_SEPARATOR(),
                    keccak256(
                        abi.encode(
                            PERMIT_HASH,
                            account,
                            address(agreements),
                            value,
                            nonce,
                            block.timestamp
                        )
                    )
                )
            )
        );

        permit = Permit(value, block.timestamp, v, r, s);
    }
}
