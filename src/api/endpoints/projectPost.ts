import express from "express";
import simpleGit from "simple-git";

import { RepoUploadResponse } from "@/types";
import { uploadObjectList } from "@/utils/aws";
import { getRepoTmpDir } from "@/utils/getDirectory";
import { getFileList } from "@/utils/getFileListRecursively";
import { mongoRepoIdentify, mongoRepoUpdateStatus } from "@/utils/mongodb";
import { isValidUrl } from "@/utils/urlMatch";

import { redisPublisher } from "../redis";

import fs from "fs";

/**
 * Create a new project
 *
 * TODO:
 *  - 1a) Divide the function in to two parts
 *  - 1b) First identify the project, and give a response with the DB object
 *  - 1c) Before the response call the second part un-synchronously
 * 	- 2a) Clone the repo
 *  - 2b) Upload the files
 */
export default async function projectPost(req: express.Request, res: express.Response) {
	const repoUrl: string = req.body.repoUrl;
	const targetBranch: string = req.body.targetBranch;
	const framework: string = req.body.framework;
	const projectName: string = req.body.projectName;

	const repo = await mongoRepoIdentify({
		status: "identifying",
		date: new Date(),
		projectName,
		repoUrl,
		targetBranch,
		framework,
	});

	if (!repo) {
		throw new Error("Something went wrong");
	}

	const repoId = repo.toString();
	const repoTmpDir = getRepoTmpDir(repoId);
	let response: RepoUploadResponse;

	process.stdout.write(`🚩  Handle, repoId: ${repoId}\n🐙  From: ${repoUrl}\n`);

	try {
		isValidUrl(repoUrl);

		process.stdout.write(`🐑  Start cloning, repoId: ${repoId}\n`);
		await mongoRepoUpdateStatus(repoId, "cloning");

		/**
		 * TODO:
		 *  - AbortController
		 *  - Timeout
		 *  - Error detection
		 *
		 * > https://www.npmjs.com/package/simple-git
		 */
		await simpleGit().clone(repoUrl, repoTmpDir);

		if (targetBranch && !targetBranch.match(/(default|)/)) {
			await simpleGit(repoTmpDir).checkout(targetBranch);
		}

		// await redisPublisher.hSet("status", repoId, "uploading"); // Update the status of the repo
		await mongoRepoUpdateStatus(repoId, "uploading");
		process.stdout.write(`📤  Start upload, repoId: ${repoId}\n`);

		const fileList = getFileList({ dir: repoTmpDir, ignoreList: [".git", ".vscode"] });

		await uploadObjectList({ fileList, repoId, repoTmpDir });
		process.stdout.write(`📤  Finished upload, repoId: ${repoId}\n`);

		response = {
			id: repoId,
			statusMessage: "The repository was successfully cloned",
			statusCode: 200,
			url: repoUrl,
		};

		// eslint-disable-next-line no-console
		console.log("📨\n", response);

		await fs.promises.rm(repoTmpDir, { recursive: true, force: true });
		await redisPublisher.lPush("build-queue", repoId); // Add the repo to the build-queue
		await mongoRepoUpdateStatus(repoId, "uploaded");
	} catch (error) {
		response = {
			id: null,
			statusMessage: (error as Error).message ?? "Invalid Repo URL",
			statusCode: 500,
			url: repoUrl,
		};

		await mongoRepoUpdateStatus(repoId, "error");
	}

	res.json(response).status(response.statusCode);
}
