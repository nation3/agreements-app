import CryptoJS from "crypto-js";

const KEY_ITERATIONS = 1000; // Increase this number for better security
const KEY_SIZE = 256;

export const encryptAES = (terms: string, password: string): string => {
	const salt = CryptoJS.lib.WordArray.random(128 / 8);
	const key = CryptoJS.PBKDF2(password, salt, {
		keySize: KEY_SIZE / 32,
		iterations: KEY_ITERATIONS,
	});

	const encrypted = CryptoJS.AES.encrypt(terms, key, { iv: salt });

	// Store the salt along with the encrypted content
	const encryptedWithSalt = salt.toString() + encrypted.toString();

	return encryptedWithSalt;
};

export const decryptAES = (termsWithSalt: string, password: string): string => {
	const salt = CryptoJS.enc.Hex.parse(termsWithSalt.slice(0, 32));
	const terms = termsWithSalt.slice(32);

	const key = CryptoJS.PBKDF2(password, salt, {
		keySize: KEY_SIZE / 32,
		iterations: KEY_ITERATIONS,
	});

	const decrypted = CryptoJS.AES.decrypt(terms, key, { iv: salt });

	return CryptoJS.enc.Utf8.stringify(decrypted);
};
