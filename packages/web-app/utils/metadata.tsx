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

export type ResolutionMetadata = {
	settlement: { party: string; balance: string }[];
	reasons?: string;
};

export const parseAgreementMetadata = (data: { [key: string]: any }): AgreementMetadata => {
	return {
		title: data.title ?? "Agreement",
		termsHash: data.termsHash ?? undefined,
		termsUri: data.termsUri ?? undefined,
		description: data.description ?? undefined,
		criteria: data.criteria ?? undefined,
		resolvers: data.resolvers ?? undefined,
	};
};

export const parseResolutionMetadata = (data: { [key: string]: any }): ResolutionMetadata => {
	return {
		settlement: data.settlement ?? [],
		reasons: data.reasons ?? undefined,
	};
};

export const fetchMetadata = async <T extends object>(
	fileURI: string,
	parser: (data: object) => T,
): Promise<T> => {
	const uri = fileURI.startsWith("ipfs://") ? IPFSUriToUrl(fileURI) : fileURI;

	let data = parser({});

	try {
		const response = await fetch(uri);
		const raw = await response.json();
		data = parser(raw);
	} catch (error) {
		console.debug(`Failed to fetch metadata: ${uri}`, error);
	}

	return data;
};

export const fetchAgreementMetadata = async (fileURI: string): Promise<AgreementMetadata> => {
	return fetchMetadata<AgreementMetadata>(fileURI, parseAgreementMetadata);
};

export const fetchResolutionMetadata = async (fileURI: string): Promise<ResolutionMetadata> => {
	return fetchMetadata<ResolutionMetadata>(fileURI, parseResolutionMetadata);
};

export const generateAgreementMetadata = ({
	title,
	terms,
	positions,
}: {
	terms: string;
	positions: { account: string; balance: BigNumber }[];
	title?: string;
}): AgreementMetadata => {
	const termsHash = hexHash(terms);
	const { criteria, resolvers } = generateCriteria(positions);

	return {
		title: title ?? "Agreement",
		termsHash: termsHash,
		criteria: criteria,
		resolvers: resolvers,
	};
};

export const generateResolutionMetadata = (
	settlement: { party: string; balance: BigNumber }[],
): ResolutionMetadata => {
	return {
		settlement: settlement.map(({ party, balance }) => ({ party, balance: balance.toString() })),
	};
};
