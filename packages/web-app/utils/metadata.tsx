import { generateCriteria, ResolverMap } from "./criteria";
import { IPFSUriToUrl } from "./ipfs";
import { utils, BigNumber } from "ethers";
import { hexHash } from "./hash";

export type AgreementMetadata = {
	title: string;
	description?: string;
	termsHash?: string;
	termsUri?: string;
	criteria?: string;
	resolvers?: ResolverMap;
};

export const parseMetadata = (data: { [key: string]: any }): AgreementMetadata => {
	return {
		title: data.title ?? "Agreement",
		termsHash: data.termsHash ?? undefined,
		termsUri: data.termsUri ?? undefined,
		description: data.description ?? undefined,
		criteria: data.criteria ?? undefined,
		resolvers: data.resolvers ?? undefined,
	};
};

export const fetchMetadata = async (fileURI: string): Promise<AgreementMetadata> => {
	const uri = fileURI.startsWith("ipfs://") ? IPFSUriToUrl(fileURI) : fileURI;

	let data = parseMetadata({});

	try {
		const response = await fetch(uri);
		const raw = await response.json();
		data = parseMetadata(raw);
	} catch (error) {
		console.debug(`Failed to fetch metadata: ${uri}`, error);
	}

	return data;
};

export const generateMetadata = (
	terms: string,
	positions: { account: string; balance: number | BigNumber }[],
) => {
	const termsHash = hexHash(terms ?? "");
	const { criteria, resolvers } = generateCriteria(
		positions.map(({ account, balance }) => {
			return {
				account: account,
				balance: utils.parseUnits(utils.formatUnits(balance), 18),
			};
		}),
	);

	return { termsHash: termsHash, criteria: criteria, resolvers: resolvers };
};
