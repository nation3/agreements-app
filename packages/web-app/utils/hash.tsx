import keccak256 from "keccak256";
import { utils } from "ethers";

export const hexHash = (text: string) => {
	return `0x${keccak256(text).toString("hex")}`;
};

export const hashEncoding = (encoding: string) => {
	return utils.hexlify(Buffer.from(keccak256(encoding).toString("hex"), "hex"));
};

export const abiEncodingPacked = (types: string[], values: any[]) => {
	return utils.solidityPack(types, values);
};
