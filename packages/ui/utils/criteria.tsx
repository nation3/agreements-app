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
	positions: { account: string; balance: ethers.BigNumber }[],
): { criteria: string; resolvers: ResolverMap } => {
	if (!validateCriteria(positions)) {
		throw new Error("Invalid criteria positions");
	}

	const leaves = positions.map(({ account, balance }) => hashPosition(account, balance.toString()));
	const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
	const criteria = tree.getHexRoot();
	const resolvers = positions.reduce(
		(result, { account, balance }) => ({
			...result,
			[account]: {
				balance: balance.toString(),
				proof: tree.getHexProof(hashPosition(account, balance.toString())),
			},
		}),
		{},
	);
	return { criteria, resolvers };
};

export const validateCriteria = (
	positions: { account: string; balance: number | string | ethers.BigNumber }[],
): boolean => {
	let isValid = true;
	const addresses: string[] = [];
	positions.map(({ account }) => {
		if (!utils.isAddress(account) || addresses.includes(account)) {
			isValid = false;
		}
		addresses.push(account);
	});
	return isValid;
};
