import { baseDir, uploadDirFs } from "@/env.js";

import path from "path";

export function getRepoTmpDir(repoId: string) {
	return path.join(baseDir, uploadDirFs, repoId);
}
