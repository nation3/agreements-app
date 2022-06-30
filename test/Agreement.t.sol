// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {AgreementParams, PartyPosition, AgreementFramework} from "../src/Agreement.sol";
import {MockERC20} from "@rari-capital/solmate/src/test/utils/mocks/MockERC20.sol";
import {Hevm} from "@rari-capital/solmate/src/test/utils/Hevm.sol";
import {DSTestPlus} from "@rari-capital/solmate/src/test/utils/DSTestPlus.sol";

contract CourtTest is DSTestPlus {
    Hevm evm = Hevm(HEVM_ADDRESS);

    AgreementFramework court;
    MockERC20 token;

    bytes32 termsHash;
    uint256 criteria;
    uint256 arbitrationFee;

    address arbitrator = address(0xB055);
    address bob = address(0xB0B);
    address alice = address(0xBABE);

    function setUp() public {
        arbitrationFee = 0.02 ether;

        token = new MockERC20("Court Token", "CT", 18);
        court = new AgreementFramework(token, arbitrator, arbitrationFee);

        token.mint(bob, 5*1e18);
        token.mint(alice, 5*1e18);
    }

    function testCreateAgreement() public {
        uint256 agreementId = _createAgreement();
        AgreementParams memory createdAgreement = court.getAgreementParams(agreementId);

        assertEq(createdAgreement.termsHash, termsHash);
        assertEq(createdAgreement.criteria, criteria);
    }

    function testJoinAgreement() public {
        uint256 agreementId = _createAgreement();

        // Bob joins the agreement
        evm.startPrank(bob);
        token.approve(address(court), 2*1e18);
        court.joinAgreement(agreementId);
        evm.stopPrank();

        PartyPosition[] memory agreementPositions = court.getAgreementPositions(agreementId);

        assertEq(agreementPositions[0].party, address(0xB0B));
        assertEq(agreementPositions[0].balance, criteria);
    }

    function testSettlement() public {
        uint256 agreementId = _createAgreement();
        uint256 bobBalance = token.balanceOf(bob);
        uint256 aliceBalance = token.balanceOf(alice);

        // Bob joins the agreement
        evm.startPrank(bob);
        token.approve(address(court), 2*1e18);
        court.joinAgreement(agreementId);
        evm.stopPrank();

        // Alice joins the agreement
        evm.startPrank(alice);
        token.approve(address(court), 2*1e18);
        court.joinAgreement(agreementId);
        evm.stopPrank();

        assertEq(token.balanceOf(address(court)), 2*criteria); 

        // Bob tries to withdraw himself from the agreement before settlement
        evm.startPrank(bob);
        evm.expectRevert(abi.encodeWithSignature("AgreementNotSettled()"));
        court.withdrawFromAgreement(agreementId);

        // Bob agrees to settle
        court.settleAgreement(agreementId);

        // Bob tries to withdraw himself from the agreement before settlement consensus
        evm.expectRevert(abi.encodeWithSignature("AgreementNotSettled()"));
        court.withdrawFromAgreement(agreementId);
        evm.stopPrank();

        // Alice agrees to settle and withdraw herself from the agreement
        evm.startPrank(alice);
        court.settleAgreement(agreementId);
        court.withdrawFromAgreement(agreementId);
        evm.stopPrank();

        // Bob can withdraw himself after settlement consensus
        evm.prank(address(0xB0B));
        court.withdrawFromAgreement(agreementId);

        assertEq(token.balanceOf(bob), bobBalance);
        assertEq(token.balanceOf(alice), aliceBalance);
    }

    function _createAgreement() internal returns (uint256 agreementId) {
        termsHash = keccak256("Some terms");
        criteria = 1e18;

        agreementId = court.createAgreement(AgreementParams(termsHash, criteria));
    }
}
