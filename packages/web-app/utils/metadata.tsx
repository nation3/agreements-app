import { BigNumber } from "ethers";
import { preparePutToIPFS } from "../lib/ipfs";
import { generateCriteria, ResolverMap } from "./criteria";
import { encryptAES } from "./crypto";
import { hexHash } from "./hash";
import { IPFSUriToUrl } from "./ipfs";

export type ResolutionMetadata = {
	settlement: { party: string; balance: string }[];
	reasons?: string;
};

export const parseAgreementMetadata = (data: { [key: string]: any }): AgreementMetadata => {
	return {
		title: data.title ?? "Agreement",
		description: data.description ?? undefined,
		termsHash: data.termsHash ?? undefined,
		termsPrivacy: data.termsPrivacy ?? "",
		termsURI: data.termsURI ?? undefined,
		termsFilename: data.termsFilename ?? "",
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

export const fetchAgreementTerms = async (fileURI: string): Promise<string | undefined> => {
	const uri = fileURI.startsWith("ipfs://") ? IPFSUriToUrl(fileURI) : fileURI;

	try {
		const response = await fetch(uri);
		if (response.ok) {
			return await response.text();
		}
	} catch (error) {
		console.debug(`Failed to fetch terms: ${uri}`, error);
	}
	return;
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
		console.log("$$$ Parsing data from IPFS => ", data);
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

interface GAMInterface {
	positions: { account: string; balance: BigNumber }[];
	terms: string;
	termsPrivacy: string;
	termsFilename?: string;
	termsPassword?: string;
	title?: string;
}

export type AgreementMetadata = {
	title: string;
	criteria: string;
	termsHash: string;
	termsURI?: string;
	termsPrivacy?: string;
	termsFilename?: string | null;
	description?: string;
	resolvers?: ResolverMap;
};

export const generateAgreementMetadata = async ({
	title,
	positions,
	terms,
	termsPrivacy,
	termsPassword,
	termsFilename,
}: GAMInterface): Promise<AgreementMetadata> => {
	const termsHash = hexHash(terms);
	const { criteria, resolvers } = generateCriteria(positions);

	const uploadTermsFile = async () => {
		/* RETURN EMPTY URI ON PRIVATE */
		if (termsPrivacy === "private") {
			return "";
		}

		/* ENCRYPT TERMS FILE IF IT IS ENCRYPTED */
		const termsData =
			termsPrivacy === "public-encrypted" ? encryptAES(terms, termsPassword ?? "") : terms;

		/* UPLOAD TERMS FILE TO IPFS */
		const { put } = await preparePutToIPFS(termsData, termsFilename);
		const cid = await put();

		console.log(`$$$ TERMS IPFS URI ipfs://${cid}`);
		return `ipfs://${cid}`;
	};

	const termsFileURI = await uploadTermsFile();
	console.log(`$$$ TERMS metadata uploaded to ${termsFileURI}`);

	const agreementMetadata = {
		title: title ?? "Agreement",
		termsHash: termsHash,
		termsURI: termsFileURI,
		termsPrivacy: termsPrivacy,
		termsFilename: termsPrivacy === "private" ? null : termsFilename,
		criteria: criteria,
		resolvers: resolvers,
	};
	console.log("$$$ METADATA AGREEMENT => ", agreementMetadata);
	return agreementMetadata;
};

export const generateResolutionMetadata = (
	settlement: { party: string; balance: BigNumber }[],
): ResolutionMetadata => {
	return {
		settlement: settlement.map(({ party, balance }) => ({ party, balance: balance.toString() })),
	};
};
