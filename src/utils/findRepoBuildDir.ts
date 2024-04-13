import { baseDir, possibleBuildDirs, uploadDirFs } from "@/env";

import { mongoProjectUpdateStatus } from "./mongodb";

import fs from "fs";
import path from "path";

export const findRepoBuildDir = async ({ projectId }: { projectId: string | undefined }) => {
	if (!projectId) {
		console.error("🔥  Build project: repoId is required!");

		return null;
	}

	let repoBuildDir: string | undefined = undefined;

	// Find the build directory of the repository
	for (const possibleBuildDir of possibleBuildDirs) {
		const tmpBuildDir = path.join(baseDir, uploadDirFs, projectId, possibleBuildDir);

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

		mongoProjectUpdateStatus(projectId, "error");

		return null;
	}

	return repoBuildDir;
};
