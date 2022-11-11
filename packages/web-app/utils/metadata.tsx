import { generateCriteria, ResolverMap } from "./criteria";
import { IPFSUriToUrl } from "./ipfs";
import { BigNumber } from "ethers";
import { hexHash } from "./hash";

export type AgreementMetadata = {
	termsHash: string;
	criteria: string;
	title?: string;
	description?: string;
	termsUri?: string;
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
	positions: { account: string; balance: BigNumber }[],
	title?: string,
): AgreementMetadata => {
	const termsHash = hexHash(terms);
	const { criteria, resolvers } = generateCriteria(positions);

	return {
		title: title ?? "Agreement",
		termsHash: termsHash,
		criteria: criteria,
		resolvers: resolvers,
	};
};
