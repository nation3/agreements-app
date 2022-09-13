
const IPFS_GATEWAY = "https://cf-ipfs.com/ipfs";

export const fetchMetadata = async (fileURI: string): object => {
	const uri = fileURI.startsWith("ipfs://")
		? `${IPFS_GATEWAY}/${fileURI.split("ipfs://")[1]}`
		: fileURI;

	let data = {};

	try {
		const response = await fetch(uri);
		data = response.json();
	} catch (error) {
		console.debug(`Failed to fetch metadata: ${uri}`, error);
	}

	return data;
};


