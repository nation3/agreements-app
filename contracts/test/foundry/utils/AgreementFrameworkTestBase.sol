// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;
import { AgreementParams, PositionParams } from "../../../src/lib/AgreementStructs.sol";
import { Permit } from "../../../src/lib/Permit.sol";
import { IAgreementFramework } from "../../../src/interfaces/IAgreementFramework.sol";
import { CriteriaResolver } from "../../../src/lib/CriteriaResolution.sol";
import { MockERC20 } from "solmate/src/test/utils/mocks/MockERC20.sol";
import { Hevm } from "solmate/src/test/utils/Hevm.sol";
import { DSTestPlus } from "solmate/src/test/utils/DSTestPlus.sol";
import { Merkle } from "murky/Merkle.sol";

contract AgreementFrameworkTestBase is DSTestPlus {
    Merkle merkle = new Merkle();

    IAgreementFramework framework;
    MockERC20 token;

    bytes32 termsHash;
    uint256 criteria;
    string metadataURI;

    address arbitrator = address(0xB055);
    address bob = hevm.addr(0xB0B);
    address alice = hevm.addr(0xA11CE);

    mapping(address => bytes32[]) proofs;

    bytes32 constant PERMIT_HASH =
        keccak256(
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
        );

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
        metadataURI = "ipfs://sha256";

        agreementId = framework.createAgreement(AgreementParams(termsHash, criteria, metadataURI));
    }

    /// Sign an EIP-2612 Permit and returns permit data
    function _getPermit(
        uint256 privateKey,
        uint256 value,
        uint256 nonce
    ) internal returns (Permit memory permit) {
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
                            address(framework),
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

    function _bobJoinsAgreement(bytes32 agreementId) internal {
        hevm.startPrank(bob);
        token.approve(address(framework), 5 * 1e18);

        framework.joinAgreement(agreementId, CriteriaResolver(bob, 2 * 1e18, proofs[bob]));
        hevm.stopPrank();
    }

    function _bobJoinsAgreementWithPermit(bytes32 agreementId) internal {
        hevm.startPrank(bob);
        framework.joinAgreementWithPermit(
            agreementId,
            CriteriaResolver(bob, 2 * 1e18, proofs[bob]),
            _getPermit(0xB0B, 2 * 1e18, 0)
        );
        hevm.stopPrank();
    }

    function _aliceJoinsAgreementWithPermit(bytes32 agreementId) internal {
        hevm.startPrank(alice);
        framework.joinAgreementWithPermit(
            agreementId,
            CriteriaResolver(alice, 1 * 1e18, proofs[alice]),
            _getPermit(0xA11CE, 1 * 1e18, 0)
        );
        hevm.stopPrank();
    }

    function _aliceExpectsErrorWhenJoining(bytes32 agreementId, string memory error) internal {
        hevm.startPrank(alice);
        token.approve(address(framework), 2 * 1e18);

        hevm.expectRevert(abi.encodeWithSignature(error));
        framework.joinAgreement(agreementId, CriteriaResolver(alice, 1e18, proofs[alice]));
        hevm.stopPrank();
    }

    function _aliceExpectsErrorWhenFinalizing(bytes32 agreementId, string memory error) internal {
        hevm.startPrank(alice);
        hevm.expectRevert(abi.encodeWithSignature(error));
        framework.finalizeAgreement(agreementId);
        hevm.stopPrank();
    }

    function _aliceExpectsErrorWhenDisputing(bytes32 agreementId, string memory error) internal {
        hevm.startPrank(alice);
        hevm.expectRevert(abi.encodeWithSignature(error));
        framework.disputeAgreement(agreementId);
        hevm.stopPrank();
    }
}
