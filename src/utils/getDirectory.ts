import { baseDir, uploadDirFs } from "@/env";

import path from "path";

export function getRepoTmpDir(repoId: string) {
	return path.join(baseDir, uploadDirFs, repoId);
}
