import "@/env";
import cors from "cors";
import express from "express";
import simpleGit from "simple-git";

import { RepoUploadResponse } from "@/types";

import { getFileList } from "@/utils/getFileListRecursively";
import { generateId } from "@/utils/random";
import { isValidUrl } from "@/utils/urlMatch";

import { uploadRepo } from "./aws";
import { publisher } from "./redis";

import fs from "fs";
import path from "path";

const port = process.env.UPLOAD_SERVICE_PORT || 3001;
const startMessage = `Express listening on port ${port}...`;
const uploadDir = process.env.UPLOAD_DIR_FS;

const app = express();

app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
	const repoUrl = req.body.repoUrl;
	const targetBranch = req.body.targetBranch;

	const repoId = generateId();
	const repoTmpDir = path.join(__dirname, uploadDir, repoId);
	let response: RepoUploadResponse;

	try {
		isValidUrl(repoUrl);

		await simpleGit().clone(repoUrl, repoTmpDir);

		if (targetBranch) {
			await simpleGit(repoTmpDir).checkout(targetBranch);
		}

		const fileList = getFileList({ dir: repoTmpDir, ignoreList: [".git", ".vscode"] });

		await uploadRepo({ fileList, repoId, repoTmpDir });

		publisher.lPush("build-queue", repoId); // Add the repo to the build queue

		await fs.promises.rm(repoTmpDir, { recursive: true, force: true });

		response = {
			id: repoId,
			statusMessage: "The repository was successfully cloned",
			statusCode: 200,
			url: repoUrl,
		};
	} catch (error) {
		response = {
			id: null,
			statusMessage: (error as Error).message ?? "Invalid URL",
			statusCode: 400,
			url: repoUrl,
		};
	}

	// eslint-disable-next-line no-console
	console.log(response);

	res.json(response).status(response.statusCode);
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(startMessage));