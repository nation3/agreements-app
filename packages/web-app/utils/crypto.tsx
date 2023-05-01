import CryptoJS from "crypto-js";

export const encryptAES = (terms: string, password: string): string => {
	const encrypted = CryptoJS.AES.encrypt(terms, password);
	return encrypted.toString();
};
