import { utils, ethers } from "ethers";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

export type ResolverMap = { [key: string]: { balance: string; proof: string[] } };
export type Resolver = { account: string; balance: string; proof: string[] };

export const hashPosition = (address: string, balance: string) => {
	return utils.hexlify(
		Buffer.from(
			keccak256(utils.defaultAbiCoder.encode(["address", "uint256"], [address, balance])).toString(
				"hex",
			),
			"hex",
		),
	);
};

export const generateCriteria = (
	positions: { address: string; balance: ethers.BigNumber }[],
): { criteria: string; resolvers: ResolverMap } => {
	const leaves = positions.map(({ address, balance }) => hashPosition(address, balance.toString()));
	const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
	const criteria = tree.getHexRoot();
	const resolvers = positions.reduce(
		(result, { address, balance }) => ({
			...result,
			[address]: {
				balance: balance.toString(),
				proof: tree.getHexProof(hashPosition(address, balance.toString())),
			},
		}),
		{},
	);
	return { criteria, resolvers };
};
