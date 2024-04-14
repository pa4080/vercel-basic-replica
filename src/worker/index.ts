import { uploadDirR2 } from "@/env.js";
import { getObjectListAndDelete, getObjectListAndDownload } from "@/utils/aws/index.js";

import { mongoProjectUpdateStatus } from "@/utils/mongodb.js";

import { getRepoTmpDir } from "@/utils/getDirectory.js";

import { commandOptions, redisSubscriber } from "./redis.js";
import { repoBuild } from "./repoBuild.js";
import { repoBuildUpload } from "./repoBuildUpload.js";

import fs from "fs";

async function main() {
	process.stdout.write("🚀  Starting deploy service...\n");

	while (true) {
		try {
			const repoToDeploy = await redisSubscriber.brPop(
				commandOptions({ isolated: true }),
				"build-queue",
				0
			);

			if (!repoToDeploy) {
				continue;
			}

			const repoId = repoToDeploy?.element;

			if (repoId.match(/warm-up/)) {
				process.stdout.write(`🔔  Warm up: ${repoId}...\n`);

				continue;
			}

			process.stdout.write(`🚩  Deploying, repoId: ${repoId}\n`);
			await mongoProjectUpdateStatus(repoId, "building"); // Update the status of the repo
			await getObjectListAndDownload({ repoId }); // Download objects from R2/S3
			await repoBuild({ repoId }); // Build the project

			await mongoProjectUpdateStatus(repoId, "deploying"); // Update the status of the repo
			await repoBuildUpload({ projectId: repoId }); // Upload objects to R2/S3

			// Clean up
			await fs.promises.rm(getRepoTmpDir(repoId), { recursive: true, force: true });
			await getObjectListAndDelete({ prefix: `${uploadDirR2}/${repoId}` });

			process.stdout.write(`✨  Deploying finished, repoId: ${repoId}\n`);
			await mongoProjectUpdateStatus(repoId, "deployed");
		} catch (error) {
			console.error("🔥  Something went wrong with the deploy service!");
			console.error((error as Error).message);
		}
	}
}

main();
