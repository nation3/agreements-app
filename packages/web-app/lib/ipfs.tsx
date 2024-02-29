import { NFTStorage, Blob } from "nft.storage";
const ipfsGateway = "https://w3s.link/ipfs";
export const IPFSUriToUrl = (uri: string) => {
	return `${ipfsGateway}/${uri.split("ipfs://").pop()}`;
};
const client = new NFTStorage({
	token: process.env.NEXT_PUBLIC_NFTSTORAGE_KEY || "",
});
console.log("TRIET");
console.log(process.env);
const objectToFile = (obj: object, filename: string) => {
	const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });
	return new File([blob], filename);
};
const stringToFile = (str: string, filename: string) => {
	return new File([Buffer.from(str)], filename);
};
export const preparePutToIPFS = async (data: string | object, filename?: string) => {
	const d = new Blob([JSON.stringify(data)]);
	const put = async () => {
		return await client.storeBlob(d);
	};
	return { put };
};
