// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

/// @dev Data structure to prove membership to a criteria tree.
///      Account and balance are used to encode the leaf.
struct CriteriaResolver {
    address account;
    uint256 balance;
    bytes32[] proof;
}

/// @dev Methods to verify membership to a criteria Merkle tree.
contract CriteriaResolution {

    error InvalidProof();

    /// @dev Check that given resolver is valid for the provided criteria.
    /// @param criteria Root of the Merkle tree.
    /// @param resolver Struct with the required params to prove membership to the tree.
    function _validateCriteria(uint256 criteria, CriteriaResolver calldata resolver) internal pure {
        // Encode the leaf from the (account, balance) pair.
        bytes32 leaf = keccak256(abi.encode(resolver.account, resolver.balance));

        bool isValid = _verifyProof(
            resolver.proof,
            bytes32(criteria),
            leaf
        );

        if (!isValid)
            revert InvalidProof();
    }

    /// @dev Based on Solmate (https://github.com/Rari-Capital/solmate/blob/main/src/utils/MerkleProofLib.sol)
    ///      Verify proofs for given root and leaf are correct.
    function _verifyProof(
        bytes32[] calldata proof,
        bytes32 root,
        bytes32 leaf
    ) internal pure returns (bool isValid) {
        assembly {
            let computedHash := leaf // The hash starts as the leaf hash.

            // Initialize data to the offset of the proof in the calldata.
            let data := proof.offset

            // Iterate over proof elements to compute root hash.
            for {
                // Left shifting by 5 is like multiplying by 32.
                let end := add(data, shl(5, proof.length))
            } lt(data, end) {
                data := add(data, 32) // Shift 1 word per cycle.
            } {
                // Load the current proof element.
                let loadedData := calldataload(data)

                // Slot where computedHash should be put in scratch space.
                // If computedHash > loadedData: slot 32, otherwise: slot 0.
                let computedHashSlot := shl(5, gt(computedHash, loadedData))

                // Store elements to hash contiguously in scratch space.
                // The xor puts loadedData in whichever slot computedHash is
                // not occupying, so 0 if computedHashSlot is 32, 32 otherwise.
                mstore(computedHashSlot, computedHash)
                mstore(xor(computedHashSlot, 32), loadedData)

                computedHash := keccak256(0, 64) // Hash both slots of scratch space.
            }

            isValid := eq(computedHash, root) // The proof is valid if the roots match.
        }
    }
}
