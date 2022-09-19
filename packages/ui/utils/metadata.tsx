const IPFS_GATEWAY = "https://cf-ipfs.com/ipfs";

export type AgreementMetadata = {
	title: string;
	termsHash: string;
	termsUri?: string;
	description?: string;
	criteria?: {
		root: string;
		resolvers: {
			[key: string]: { amount: string; proof: string[] };
		};
	};
};

export const fetchMetadata = async (fileURI: string): Promise<AgreementMetadata> => {
	const uri = fileURI.startsWith("ipfs://")
		? `${IPFS_GATEWAY}/${fileURI.split("ipfs://")[1]}`
		: fileURI;

	let data = { title: "", termsHash: "" };

	try {
		const response = await fetch(uri);
		const raw = await response.json();
		data = { ...data, ...raw };
	} catch (error) {
		console.debug(`Failed to fetch metadata: ${uri}`, error);
	}

	return data;
};
