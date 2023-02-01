import keccak256 from "keccak256";
import { utils } from "ethers";

export const hexHash = (text: string) => {
	return `0x${keccak256(text).toString("hex")}`;
};

export const trimHash = (hash: string): string => {
	return `${hash.substring(2, 6)}${hash.substring(hash.length - 4)}`;
};

export const hashEncoding = (encoding: string) => {
	return utils.hexlify(Buffer.from(keccak256(encoding).toString("hex"), "hex"));
};

export const abiEncodingPacked = (types: string[], values: any[]) => {
	return utils.solidityPack(types, values);
};

export const abiEncoding = (types: string[], values: any[]) => {
	const encoder = new utils.AbiCoder();
	return encoder.encode(types, values);
};
