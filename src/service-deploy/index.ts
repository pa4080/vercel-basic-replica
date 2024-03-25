import "@/env";
import { getObjectListAndDownload } from "@/utils/aws";

import { commandOptions, redisPublisher } from "@/utils/redis";

async function main() {
	process.stdout.write("🚀  Starting deploy service ...\n");

	while (true) {
		const repoToDeploy = await redisPublisher.brPop(
			commandOptions({ isolated: true }),
			"build-queue",
			0
		);

		process.stdout.write(`🚩  Deploying, repoId: ${repoToDeploy?.element}\n`);

		await getObjectListAndDownload({ repoId: repoToDeploy?.element });

		process.stdout.write(`✨  Deploying finished, repoId: ${repoToDeploy?.element}\n`);
	}
}

main();
