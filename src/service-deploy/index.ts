import "@/env";
import { getObjectListAndDownload } from "@/utils/aws";
import { commandOptions, redisSubscriber } from "@/utils/redis";

import { projectBuild } from "./projectBuild";

async function main() {
	process.stdout.write("🚀  Starting deploy service ...\n");

	while (true) {
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

		await getObjectListAndDownload({ repoId });
		await projectBuild({ repoId });

		process.stdout.write(`✨  Deploying finished, repoId: ${repoId}\n`);
	}
}

main();
