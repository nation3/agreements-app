import { Web3Storage } from "web3.storage";
import { pack } from "ipfs-car/pack";
import { CarReader } from "@ipld/car";

// TODO: Move IPFS queries to proxy API to avoid exposing web3.storage api key

const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_IPFS_API_TOKEN ?? "" });

const objectToFile = (obj: object, filename: string) => {
	const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

	return new File([blob], filename);
};

export const preparePutToIPFS = async (obj: object) => {
	const file = objectToFile(obj, "data.json");
	const { root, out } = await pack({ input: [file], wrapWithDirectory: false });
	const cid = root.toString();

	const put = async () => {
		const car = await CarReader.fromIterable(out);
		return client.putCar(car);
	};

	return { cid, put };
};
