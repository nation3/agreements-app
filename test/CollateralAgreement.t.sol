// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.13;

import {
    AgreementParams,
    PositionParams,
    CollateralAgreementFramework
} from "../src/agreements/CollateralAgreement.sol";
import { CriteriaResolver } from "../src/lib/CriteriaResolution.sol";
import { MockERC20 } from "solmate/src/test/utils/mocks/MockERC20.sol";
import { Hevm } from "solmate/src/test/utils/Hevm.sol";
import { DSTestPlus } from "solmate/src/test/utils/DSTestPlus.sol";
import { Merkle } from "murky/Merkle.sol";

contract CollateralAgreementTest is DSTestPlus {
    Hevm evm = Hevm(HEVM_ADDRESS);
    Merkle merkle = new Merkle();

    CollateralAgreementFramework agreements;
    MockERC20 token;

    bytes32 termsHash;
    uint256 criteria;
    uint256 arbitrationFee;

    address arbitrator = address(0xB055);
    address bob = address(0xB0B);
    address alice = address(0xA11CE);

    mapping(address => bytes32[]) proofs;

    function setUp() public {
        arbitrationFee = 0.02 ether;

        token = new MockERC20("Agreements Token", "AT", 18);
        agreements = new CollateralAgreementFramework(token, arbitrator);

        token.mint(bob, 5 * 1e18);
        token.mint(alice, 5 * 1e18);
    }

    function testCreateAgreement() public {
        uint256 agreementId = _createAgreement();
        AgreementParams memory createdAgreement = agreements.agreementParams(agreementId);

        assertEq(createdAgreement.termsHash, termsHash);
        assertEq(createdAgreement.criteria, criteria);
    }

    function testJoinAgreement() public {
        uint256 agreementId = _createAgreement();

        // Bob joins the agreement
        evm.startPrank(bob);
        token.approve(address(agreements), 2 * 1e18);
        agreements.joinAgreement(agreementId, CriteriaResolver(bob, 2 * 1e18, proofs[bob]));
        evm.stopPrank();

        PositionParams[] memory agreementPositions = agreements.agreementPositions(agreementId);

        assertEq(agreementPositions[0].party, bob);
        assertEq(agreementPositions[0].balance, 2 * 1e18);
    }

    function testFinalization() public {
        uint256 agreementId = _createAgreement();
        uint256 bobBalance = token.balanceOf(bob);
        uint256 aliceBalance = token.balanceOf(alice);

        // Bob joins the agreement.
        evm.startPrank(bob);
        token.approve(address(agreements), 2 * 1e18);
        agreements.joinAgreement(agreementId, CriteriaResolver(bob, 2 * 1e18, proofs[bob]));
        evm.stopPrank();

        // Alice joins the agreement.
        evm.startPrank(alice);
        token.approve(address(agreements), 2 * 1e18);
        agreements.joinAgreement(agreementId, CriteriaResolver(alice, 1e18, proofs[alice]));
        evm.stopPrank();

        assertEq(token.balanceOf(address(agreements)), 3 * 1e18);

        // Bob tries to withdraw himself from the agreement before finalization.
        evm.startPrank(bob);
        evm.expectRevert(abi.encodeWithSignature("AgreementNotFinalized()"));
        agreements.withdrawFromAgreement(agreementId);

        // Bob agrees to finalize the agreement.
        agreements.finalizeAgreement(agreementId);

        // Bob tries to withdraw himself from the agreement before finalization consensus
        evm.expectRevert(abi.encodeWithSignature("AgreementNotFinalized()"));
        agreements.withdrawFromAgreement(agreementId);
        evm.stopPrank();

        // Alice agrees to finalize and withdraw herself from the agreement
        evm.startPrank(alice);
        agreements.finalizeAgreement(agreementId);
        agreements.withdrawFromAgreement(agreementId);
        evm.stopPrank();

        // Bob can withdraw himself after finalization consensus
        evm.prank(bob);
        agreements.withdrawFromAgreement(agreementId);

        assertEq(token.balanceOf(bob), bobBalance);
        assertEq(token.balanceOf(alice), aliceBalance);
    }

    function testDisputeSettlement() public {
        uint256 agreementId = _createAgreement();

        // Bob joins the agreement
        evm.startPrank(bob);
        token.approve(address(agreements), 2 * 1e18);
        agreements.joinAgreement(agreementId, CriteriaResolver(bob, 2 * 1e18, proofs[bob]));
        evm.stopPrank();

        // Alice joins the agreement
        evm.startPrank(alice);
        token.approve(address(agreements), 2 * 1e18);
        agreements.joinAgreement(agreementId, CriteriaResolver(alice, 1e18, proofs[alice]));
        evm.stopPrank();

        // Bob dispute the agreement
        evm.prank(bob);
        agreements.disputeAgreement(agreementId);

        // Arbitrator settle dispute
        PositionParams[] memory settlementPositions = new PositionParams[](3);
        settlementPositions[0] = PositionParams(bob, 1.5 * 1e18);
        settlementPositions[1] = PositionParams(alice, 0);
        settlementPositions[2] = PositionParams(address(0xD0011), 0.5 * 1e18);

        evm.prank(arbitrator);
        agreements.settleDispute(agreementId, settlementPositions);

        // Check new settlement positions
        PositionParams[] memory agreementPositions = agreements.agreementPositions(agreementId);
        assertEq(agreementPositions[0].party, bob);
        assertEq(agreementPositions[0].balance, 1.5 * 1e18);
        assertEq(agreementPositions[1].party, alice);
        assertEq(agreementPositions[1].balance, 0);
        assertEq(agreementPositions[2].balance, 0.5 * 1e18);

        // Bob withdraw from agreement
        evm.prank(bob);
        agreements.withdrawFromAgreement(agreementId);
    }

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

    function _createAgreement() internal returns (uint256 agreementId) {
        _prepareCriteria();
        termsHash = keccak256("Terms & Conditions");

        agreementId = agreements.createAgreement(AgreementParams(termsHash, criteria));
    }
}
