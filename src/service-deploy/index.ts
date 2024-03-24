import "@/env";
import { getObjectListAndDownload } from "@/utils/aws";

import { commandOptions, redisPublisher } from "@/utils/redis";

async function main() {
	// eslint-disable-next-line no-console
	console.log("🚀  Starting deploy service ...");

	while (true) {
		const repoToDeploy = await redisPublisher.brPop(
			commandOptions({ isolated: true }),
			"build-queue",
			0
		);

		// eslint-disable-next-line no-console
		console.log("🚩  Deploying, repoId:", repoToDeploy?.element);

		await getObjectListAndDownload({
			repoId: repoToDeploy?.element,
		});

		// eslint-disable-next-line no-console
		console.log("✨  Deploy finished, repoId:", repoToDeploy?.element);
	}
}

main();
