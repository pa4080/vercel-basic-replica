import express from "express";

import { FrameworkType, ProjectApiResponse } from "@/types";
import { mongoProjectGetById, mongoProjectInsert } from "@/utils/mongodb";
import { isValidUrl } from "@/utils/urlMatch";

/**
 * Create a new project
 *
 * TODO:
 *  x 1a) Divide the function in to two parts
 *  x 1b) First identify the project, and give a response with the DB object
 *  - 1c) Before the response call the second part un-synchronously
 * 	- 2a) Clone the repo
 *  - 2b) Upload the files
 */
export default async function projectPost(req: express.Request, res: express.Response) {
	const repoUrl: string = req.body.repoUrl;
	const targetBranch: string = req.body.targetBranch;
	const framework: FrameworkType = req.body.framework;
	const projectName: string = req.body.projectName;
	const buildOutDir: string = req.body.buildOutDir;
	let response: ProjectApiResponse;

	try {
		isValidUrl(repoUrl);

		const projectId = await mongoProjectInsert({
			status: "identifying",
			date: new Date(),
			projectName,
			repoUrl,
			targetBranch,
			framework,
			buildOutDir,
		});

		if (!projectId) {
			throw new Error("Something went wrong, the project could not be created.");
		}

		const project = await mongoProjectGetById(projectId);

		if (!project) {
			throw new Error(`Something went wrong while getting a project, id: ${projectId.toString()}`);
		}

		response = {
			statusCode: 200,
			statusMessage: "Project created",
			ok: true,
			data: project,
		};
	} catch (error) {
		response = {
			statusCode: 500,
			statusMessage: (error as Error).message,
			ok: false,
			data: null,
		};
	}

	res.json(response).status(response.statusCode);
}

// async function cloneRepo(repoUrl: string) {
// 	const repoId = repo.toString();
// 	const repoTmpDir = getRepoTmpDir(repoId);
// 	let response: ProjectApiResponse;

// 	process.stdout.write(`🚩  Handle, repoId: ${repoId}\n🐙  From: ${repoUrl}\n`);

// 	try {
// 		process.stdout.write(`🐑  Start cloning, repoId: ${repoId}\n`);
// 		await mongoProjectUpdateStatus(repoId, "cloning");

// 		/**
// 		 * TODO:
// 		 *  - AbortController
// 		 *  - Timeout
// 		 *  - Error detection
// 		 *
// 		 * > https://www.npmjs.com/package/simple-git
// 		 */
// 		await simpleGit().clone(repoUrl, repoTmpDir);

// 		if (targetBranch && !targetBranch.match(/(default|)/)) {
// 			await simpleGit(repoTmpDir).checkout(targetBranch);
// 		}

// 		// await redisPublisher.hSet("status", repoId, "uploading"); // Update the status of the repo
// 		await mongoProjectUpdateStatus(repoId, "uploading");
// 		process.stdout.write(`📤  Start upload, repoId: ${repoId}\n`);

// 		const fileList = getFileList({ dir: repoTmpDir, ignoreList: [".git", ".vscode"] });

// 		await uploadObjectList({ fileList, repoId, repoTmpDir });
// 		process.stdout.write(`📤  Finished upload, repoId: ${repoId}\n`);

// 		response = {
// 			id: repoId,
// 			statusMessage: "The repository was successfully cloned",
// 			statusCode: 200,
// 			url: repoUrl,
// 		};

// 		// eslint-disable-next-line no-console
// 		console.log("📨\n", response);

// 		await fs.promises.rm(repoTmpDir, { recursive: true, force: true });
// 		await redisPublisher.lPush("build-queue", repoId); // Add the repo to the build-queue
// 		await mongoProjectUpdateStatus(repoId, "uploaded");
// 	} catch (error) {
// 		response = {
// 			id: null,
// 			statusMessage: (error as Error).message ?? "Invalid Repo URL",
// 			statusCode: 500,
// 			url: repoUrl,
// 		};

// 		await mongoProjectUpdateStatus(repoId, "error");
// 	}
// }
