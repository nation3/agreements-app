const IPFS_GATEWAY = "https://cf-ipfs.com/ipfs";

export type AgreementMetadata = {
	title: string;
	termsHash?: string;
	termsUri?: string;
	description?: string;
	criteria?: {
		root: string;
		resolvers: {
			[key: string]: { amount: string; proof: string[] };
		};
	};
};

export const parseMetadata = (data: { [key: string]: any }): AgreementMetadata => {
	return {
		title: data.title ?? "Agreement",
		termsHash: data.termsHash ?? undefined,
		termsUri: data.termsUri ?? undefined,
		description: data.description ?? undefined,
		criteria: data.criteria ?? undefined,
	};
};

export const fetchMetadata = async (fileURI: string): Promise<AgreementMetadata> => {
	const uri = fileURI.startsWith("ipfs://")
		? `${IPFS_GATEWAY}/${fileURI.split("ipfs://")[1]}`
		: fileURI;

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
