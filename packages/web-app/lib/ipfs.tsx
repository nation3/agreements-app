import { NFTStorage, Blob } from "nft.storage";
const ipfsGateway = "https://w3s.link/ipfs";
export const IPFSUriToUrl = (uri: string) => {
  return `${ipfsGateway}/${uri.split("ipfs://").pop()}`;
};
const client = new NFTStorage({
  token: process.env.NEXT_PUBLIC_NFTSTORAGE_KEY || "",
});

export const preparePutToIPFS = async (data: string | object, filename?: string) => {
  const d = new Blob([JSON.stringify(data)]);
  const put = async () => {
    return await client.storeBlob(d);
  };
  return { put };
};
