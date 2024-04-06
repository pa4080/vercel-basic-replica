import { baseDir, possibleBuildDirs, uploadDirFs } from "@/env";

import fs from "fs";
import path from "path";

export const findRepoBuildDir = async ({ repoId }: { repoId: string | undefined }) => {
	if (!repoId) {
		console.error("🔥  Build project: repoId is required!");

		return null;
	}

	let repoBuildDir: string | undefined = undefined;

	// Find the build directory of the repository
	for (const possibleBuildDir of possibleBuildDirs) {
		const tmpBuildDir = path.join(baseDir, uploadDirFs, repoId, possibleBuildDir);

		if (
			await fs.promises.stat(tmpBuildDir).then(
				() => true,
				() => false
			)
		) {
			repoBuildDir = tmpBuildDir;

			break;
		}
	}

	if (!repoBuildDir) {
		console.error(
			"🔥  Build project: none of the directories exist: ",
			possibleBuildDirs.join(", ")
		);

		return null;
	}

	return repoBuildDir;
};
