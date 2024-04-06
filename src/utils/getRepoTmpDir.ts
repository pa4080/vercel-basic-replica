import { baseDir, uploadDirFs } from "@/env";

import path from "path";

export default function getRepoTmpDir(repoId: string) {
	return path.join(baseDir, uploadDirFs, repoId);
}
