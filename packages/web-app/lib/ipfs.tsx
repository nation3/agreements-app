import { Web3Storage } from "web3.storage";
import { pack } from "ipfs-car/pack";
import { CarReader } from "@ipld/car";

const ipfsGateway = "https://w3s.link/ipfs";

export const IPFSUriToUrl = (uri: string) => {
	return `${ipfsGateway}/${uri.split("ipfs://").pop()}`;
};

export const client = () => {
	const token = process.env.IPFS_API_TOKEN || process.env.NEXT_PUBLIC_IPFS_API_TOKEN;
	if (!token) {
		throw new Error("IPFS API token not found");
	}
	return new Web3Storage({ token });
};

const objectToFile = (obj: object, filename: string) => {
	const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

	return new File([blob], filename);
};

const stringToFile = (str: string, filename: string) => {
	return new File([Buffer.from(str)], filename);
};

export const preparePutToIPFS = async (data: string | object, filename?: string) => {
	const file =
		typeof data === "string"
			? stringToFile(data, filename || "file.md")
			: objectToFile(data, "data.json");
	const { root, out } = await pack({ input: [file], wrapWithDirectory: false });
	const cid = root.toString();

	const put = async () => {
		const car = await CarReader.fromIterable(out);
		return client().putCar(car);
	};

	return { cid, put };
};
