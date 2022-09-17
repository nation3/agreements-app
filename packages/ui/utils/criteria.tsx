import { ethers } from "ethers";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

export const hashPosition = (address: string, balance: string) => {
	return ethers.utils.hexlify(
		Buffer.from(
			keccak256(
				ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [address, balance]),
			).toString("hex"),
			"hex",
		),
	);
};

export const generateCriteria = (
	positions: { address: string; balance: ethers.BigNumber }[],
): string => {
	const leaves = positions.map(({ address, balance }) => hashPosition(address, balance.toString()));
	const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
	const criteria = tree.getHexRoot();
	return criteria;
};
