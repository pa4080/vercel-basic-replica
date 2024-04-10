import { mongoRepoGetById } from "./mongodb";

const localCache: { [key: string]: boolean } = {};

export async function getCachedRepo(repoId: string): Promise<boolean> {
	if (localCache[`repo_${repoId}`] !== undefined) {
		return localCache[`repo_${repoId}`];
	} else {
		const repoExists = !!(await mongoRepoGetById(repoId));

		localCache[`repo_${repoId}`] = repoExists;

		return repoExists;
	}
}
