import cors from "cors";
import express from "express";
import simpleGit from "simple-git";

import { RepoUploadResponse } from "@/types";

import { getFileList } from "@/utils/getFileListRecursively";
import { generateId } from "@/utils/random";
import { isValidUrl } from "@/utils/urlMatch";

import { uploadObjectList } from "@/utils/aws";
import { redisPublisher } from "@/utils/redis";

import getRepoTmpDir from "@/utils/getRepoTmpDir";

import fs from "fs";

const port = process.env.UPLOAD_SERVICE_PORT || 3001;
const startMessage = `🚀  Starting upload service on port ${port}...\n`;

const app = express();

app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
	const repoUrl = req.body.repoUrl;
	const targetBranch = req.body.targetBranch;

	const repoId = generateId();
	const repoTmpDir = getRepoTmpDir(repoId);
	let response: RepoUploadResponse;

	process.stdout.write(`🚩  Handle, repoId: ${repoId}\n🐙  From: ${repoUrl}\n`);

	try {
		isValidUrl(repoUrl);

		process.stdout.write(`🐑  Start clone, repoId: ${repoId}\n`);

		await simpleGit().clone(repoUrl, repoTmpDir);

		if (targetBranch) {
			await simpleGit(repoTmpDir).checkout(targetBranch);
		}

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
	} catch (error) {
		response = {
			id: null,
			statusMessage: (error as Error).message ?? "Invalid URL",
			statusCode: 500,
			url: repoUrl,
		};
	}

	res.json(response).status(response.statusCode);
});

app.listen(port, async () => {
	process.stdout.write(startMessage);

	await redisPublisher.lPush("build-queue", "warm-up"); // Add the repo to the build-queue
});
