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
		fileName: data.fileName ?? "",
		fileStatus: data.fileStatus ?? "",
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
		console.log("$$$ Parsing data IPFS => ", uri, raw, data);
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
	terms: string;
	positions: { account: string; balance: BigNumber }[];
	title?: string;
	fileName?: string;
	fileStatus: string;
	filePass?: string;
}

export type AgreementMetadata = {
	termsHash: string;
	criteria: string;
	title: string;
	fileName?: string | null;
	fileStatus: string;
	description?: string;
	termsUri?: string;
	resolvers?: ResolverMap;
};

export const generateAgreementMetadata = async ({
	title,
	fileName,
	fileStatus,
	filePass,
	terms,
	positions,
}: GAMInterface): Promise<AgreementMetadata> => {
	const termsHash = hexHash(terms);
	const { criteria, resolvers } = generateCriteria(positions);

	const uploadTermsFile = async () => {
		/* RETURN EMPTY URI ON PRIVATE */
		if (fileStatus === "private") {
			return "";
		}

		/* ENCRYPT TERMS FILE IF IT IS ENCRYPTED */
		const termsData =
			fileStatus === "public"
				? terms
				: fileStatus === "public-encrypted"
				? encryptAES(terms, filePass ? filePass : "")
				: "";

		/* UPLOAD TERMS FILE TO IPFS */
		const { put } = await preparePutToIPFS({ termsData });
		const cid = await put();

		console.log(`$$$ TERMS IPFS URI ipfs://${cid}`);
		return `ipfs://${cid}`;
	};

	const termsFileURI = await uploadTermsFile();
	console.log(`$$$ TERMS metadata uploaded to ${termsFileURI}`);

	const agreementMetadata = {
		title: title ?? "Agreement",
		fileStatus: fileStatus,
		fileName: fileStatus === "public" || fileStatus === "public-encrypted" ? fileName : null,
		termsUri: termsFileURI,
		termsHash: termsHash,
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
