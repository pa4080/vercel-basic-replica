import { uploadDirR2 } from "@/env.js";
import { getObjectListAndDelete, getObjectListAndDownload } from "@/utils/aws/index.js";
import { getRepoTmpDir } from "@/utils/getDirectory.js";
import { mongoProjectGetById, mongoProjectUpdateStatus } from "@/utils/mongodb.js";

import { commandOptions, redisSubscriber } from "./redis.js";
import { repoBuild } from "./repoBuild.js";
import { repoBuildUpload } from "./repoBuildUpload.js";

import fs from "fs";

async function main() {
	process.stdout.write("🚀  Starting deploy service...\n");

	while (true) {
		try {
			const projectToDeploy = await redisSubscriber.brPop(
				commandOptions({ isolated: true }),
				"build-queue",
				0
			);

			if (!projectToDeploy) {
				continue;
			}

			const projectId = projectToDeploy?.element;

			if (projectId.match(/warm-up/)) {
				process.stdout.write(`🔔  Warm up: ${projectId}...\n`);

				continue;
			}

			process.stdout.write(`🚩  Deploying, repoId: ${projectId}\n`);
			await mongoProjectUpdateStatus(projectId, "building"); // Update the status of the repo
			await getObjectListAndDownload({ projectId: projectId }); // Download objects from R2/S3

			const project = await mongoProjectGetById(projectId);

			if (project?.framework === "html") {
				await mongoProjectUpdateStatus(projectId, "deploying"); // Update the status of the repo
				await repoBuildUpload({ projectId: projectId, projectData: project }); // Upload objects to R2/S3
			} else if (project?.framework === "react" || project?.framework === "astro") {
				await repoBuild({ repoId: projectId }); // Build the project
				await mongoProjectUpdateStatus(projectId, "deploying"); // Update the status of the repo
				await repoBuildUpload({ projectId: projectId, projectData: project }); // Upload objects to R2/S3
			} else {
				await mongoProjectUpdateStatus(projectId, "build error");
				throw new Error(`🔥  Build project: framework not supported, repoId: ${projectId}`);
			}

			// Clean up
			await fs.promises.rm(getRepoTmpDir(projectId), { recursive: true, force: true });
			await getObjectListAndDelete({ prefix: `${uploadDirR2}/${projectId}` });

			process.stdout.write(`✨  Deploying finished, repoId: ${projectId}\n`);
			await mongoProjectUpdateStatus(projectId, "deployed");
		} catch (error) {
			console.error("🔥  Something went wrong with the deploy service!");
			console.error((error as Error).message);
		}
	}
}

main();
