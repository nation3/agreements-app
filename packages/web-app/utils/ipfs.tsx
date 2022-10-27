const ipfsGateway = "https://w3s.link/ipfs";

export const IPFSUriToUrl = (uri: string) => {
	return `${ipfsGateway}/${uri.split("ipfs://")[1]}`;
};
