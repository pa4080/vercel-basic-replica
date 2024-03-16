import { randomBytes } from "node:crypto";

const MAX_LENGTH = 10;

function generateId_byRandom() {
	return Math.random().toString(36).substring(2, MAX_LENGTH);
}

function generateId_bySubset() {
	let ans = "";

	const subset = "abcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < MAX_LENGTH; i++) {
		ans += subset.charAt(Math.floor(Math.random() * subset.length));
	}

	return ans;
}

// https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
function generateId() {
	return randomBytes(MAX_LENGTH).toString("hex");
}

export { generateId_byRandom, generateId_bySubset, generateId };
