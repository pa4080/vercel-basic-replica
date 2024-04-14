import { mongoProjectGetById } from "./mongodb.js";

const localCache: { [key: string]: boolean } = {};

export async function getCachedRepo(repoId: string): Promise<boolean | undefined> {
	if (localCache[`repo_${repoId}`] !== undefined) {
		return localCache[`repo_${repoId}`];
	} else {
		const repoExists = !!(await mongoProjectGetById(repoId));

		localCache[`repo_${repoId}`] = repoExists;

		return repoExists;
	}
}
