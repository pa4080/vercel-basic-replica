import cors from "cors";
import express from "express";
import simpleGit from "simple-git";

import { RepoUploadResponse } from "@/types";

import { baseDir, uploadDirR2Build } from "@/env";
import { getObject, uploadObjectList } from "@/utils/aws";
import { getRepoTmpDir } from "@/utils/getDirectory";
import { getFileList } from "@/utils/getFileListRecursively";
import { generateId } from "@/utils/random";
import { isValidUrl } from "@/utils/urlMatch";

import { redisPublisher, redisSubscriber } from "./redis";

import fs from "fs";
import path from "path";

const port = process.env.UPLOAD_SERVICE_PORT || 3001;
const startMessage = `🚀  Starting upload service on port ${port}...\n`;

const app = express();

app.use(cors());
app.use(express.json());
/**
 * 	If we use "frontend" instead of "public" we can sever the
 * 	frontend without any additional conditions as below.
 *
 * app.use(
 * 	express.static(path.join(baseDir, "public"), {
 * 		index: false,
 * 		setHeaders: (res, path) => {
 * 			if (path === "/favicon.ico") {
 * 				res.setHeader("Content-Type", "image/x-icon");
 * 			}
 * 		},
 * 	})
 * );
 */

app.post("/deploy", async (req, res) => {
	const repoUrl = req.body.repoUrl;
	const targetBranch = req.body.targetBranch;

	const repoId = generateId();
	const repoTmpDir = getRepoTmpDir(repoId);
	let response: RepoUploadResponse;

	process.stdout.write(`🚩  Handle, repoId: ${repoId}\n🐙  From: ${repoUrl}\n`);

	try {
		isValidUrl(repoUrl);

		process.stdout.write(`🐑  Start cloning, repoId: ${repoId}\n`);

		await redisPublisher.hSet("status", repoId, "cloning"); // Update the status of the repo
		await simpleGit().clone(repoUrl, repoTmpDir);

		if (targetBranch) {
			await simpleGit(repoTmpDir).checkout(targetBranch);
		}

		await redisPublisher.hSet("status", repoId, "uploading"); // Update the status of the repo
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
		await redisPublisher.hSet("status", repoId, "uploaded"); // Update the status of the repo
	} catch (error) {
		response = {
			id: null,
			statusMessage: (error as Error).message ?? "Invalid Repo URL",
			statusCode: 500,
			url: repoUrl,
		};
	}

	res.json(response).status(response.statusCode);
});

/**
 * We will handle *.example.com; the base domain example.com is not redirected to the app.
 *
 * https://vercel-basic-replica.example.com - will serve the frontend
 * https://deploy-idOfTheRepo.example.com - will serve the deployments
 */
app.get("/*", async (req, res) => {
	const host = req.hostname;
	const subDomain = host.split(".")[0];
	const uri = req.path;

	if (uri === "/status") {
		const id = req.query.id;

		if (!id) {
			return res.status(404).send("Not found");
		}

		const status = await redisSubscriber.hGet("status", id as string);

		if (!status) {
			return res.status(404).send(`Something went wrong, id: ${id}`);
		}

		return res.json({ id, status });
	}

	if (subDomain.match(/^vercel-basic-replica/)) {
		const docRoot = path.join(baseDir, "frontend");
		const filePath = uri === "/" ? "index.html" : uri.slice(1);

		return res.sendFile(filePath, { root: docRoot });
	}

	if (subDomain.match(/^deploy/)) {
		const repoId = subDomain.split("-")[1];
		const filePath = uri === "/" ? "index.html" : uri.slice(1);

		return (async function returnObject(filePath: string) {
			const responseObject = await getObject({
				objectKey: `${uploadDirR2Build}/${repoId}/${filePath}`,
			});

			if (!responseObject || !responseObject.Body) {
				// Handle all routes to index.html for React apps, otherwise
				// return res.status(404).send("Not found");
				return returnObject("index.html");
			}

			res.set("Content-Type", responseObject.ContentType);

			if (responseObject.ContentType?.match(/(image|font|video|audio|media)/)) {
				res.set("Cache-Control", "public, max-age=31536000");
			}

			res.write(await responseObject.Body?.transformToByteArray(), "utf8");
			res.end();
			// The following cause troubles wit binary files:
			// res.send(await responseObject.Body?.transformToString("utf8"));
			// res.end();
		})(filePath);
	}

	return res.redirect(307, process.env.NOT_HANDLED_REQ_REDIRECT_URL);
});

app.listen(port, async () => {
	process.stdout.write(startMessage);

	await redisPublisher.lPush("build-queue", "warm-up"); // Add the repo to the build-queue
});
