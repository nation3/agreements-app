import keccak256 from "keccak256";

export const hexHash = (text: string) => {
	return `0x${keccak256(text).toString("hex")}`;
};
