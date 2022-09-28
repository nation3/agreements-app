import { Web3Storage } from "web3.storage";
import { pack } from "ipfs-car/pack";
import { CarReader } from "@ipld/car";

const token = process.env.IPFS_API_TOKEN ?? "";
const ipfsGateway = "https://w3s.link/ipfs";

const objectToFile = (obj: object, filename: string) => {
	const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

	return new File([blob], filename);
};

export const preparePutToIPFS = async (obj: object) => {
	const client = new Web3Storage({ token });

	const file = objectToFile(obj, "data.json");
	const { root, out } = await pack({ input: [file], wrapWithDirectory: false });
	const cid = root.toString();

	const put = async () => {
		const car = await CarReader.fromIterable(out);
		return client.putCar(car);
	};

	return { cid, put };
};

export const IPFSUriToUrl = (uri: string) => {
	return `${ipfsGateway}/${uri.split("ipfs://")[1]}`;
};
