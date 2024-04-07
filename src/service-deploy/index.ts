import { uploadDirR2 } from "@/env";
import { getObjectListAndDelete, getObjectListAndDownload } from "@/utils/aws";
import getRepoTmpDir from "@/utils/getRepoTmpDir";
import { commandOptions, redisSubscriber } from "@/utils/redis";

import { repoBuild } from "./repoBuild";
import { repoBuildUpload } from "./repoBuildUpload";

import fs from "fs";

async function main() {
	process.stdout.write("🚀  Starting deploy service ...\n");

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

			await getObjectListAndDownload({ repoId }); // Download objects from R2/S3
			await repoBuild({ repoId }); // Build the project
			await repoBuildUpload({ repoId }); // Upload objects to R2/S3

			// Clean up
			await fs.promises.rm(getRepoTmpDir(repoId), { recursive: true, force: true });
			await getObjectListAndDelete({ prefix: `${uploadDirR2}/${repoId}` });

			process.stdout.write(`✨  Deploying finished, repoId: ${repoId}\n`);
		} catch (error) {
			console.error("🔥  Something went wrong with the deploy service!");
			console.error((error as Error).message);
		}
	}
}

main();
