import simpleGit from "simple-git";

import { RedisClientType } from "redis";

import { ProjectData } from "@/types.js";
import { uploadObjectList } from "@/utils/aws/index.js";
import { getRepoTmpDir } from "@/utils/getDirectory.js";
import { getFileList } from "@/utils/getFileListRecursively.js";
import { mongoProjectUpdateStatus } from "@/utils/mongodb.js";

import fs from "fs";

export async function simpleGitCloneRepo({
	project,
	redisPublisher,
}: {
	project: ProjectData;
	redisPublisher: RedisClientType;
}) {
	const { _id: repoId, targetBranch, repoUrl } = project;

	const repoTmpDir = getRepoTmpDir(repoId);

	process.stdout.write(`🚩  Handle, repoId: ${repoId}\n🐙  From: ${repoUrl}\n`);

	try {
		process.stdout.write(`🐑  Start cloning, repoId: ${repoId}\n`);
		await mongoProjectUpdateStatus(repoId, "cloning");

		/**
		 * TODO:
		 *  - AbortController
		 *  - Timeout
		 *  - Error detection
		 *
		 * > https://www.npmjs.com/package/simple-git
		 */

		// Clone the repo
		await simpleGit().clone(repoUrl, repoTmpDir);

		// Checkout the branch
		if (targetBranch && targetBranch !== "default") {
			await simpleGit(repoTmpDir).checkout(targetBranch);
		}

		await mongoProjectUpdateStatus(repoId, "uploading");
		process.stdout.write(`📤  Start upload, repoId: ${repoId}\n`);

		const fileList = getFileList({ dir: repoTmpDir, ignoreList: [".git", ".vscode"] });

		await uploadObjectList({ fileList, repoId, repoTmpDir });
		process.stdout.write(`📤  Finished upload, repoId: ${repoId}\n`);

		await mongoProjectUpdateStatus(repoId, "uploaded");
		await fs.promises.rm(repoTmpDir, { recursive: true, force: true });

		await redisPublisher.lPush("build-queue", repoId); // Add the repo to the build-queue
	} catch (error) {
		console.error(error);
		// Remove the old repo if it exists
		await fs.promises.rm(repoTmpDir, { recursive: true, force: true });
		await mongoProjectUpdateStatus(repoId, "clone error");
	}
}
