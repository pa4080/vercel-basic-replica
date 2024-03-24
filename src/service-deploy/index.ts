import "@/env";

import { commandOptions, redisPublisher } from "@/utils/redis";

async function main() {
	// eslint-disable-next-line no-console
	console.log("🚀 Starting deploy service ...");

	while (true) {
		const repoId = await redisPublisher.brPop(commandOptions({ isolated: true }), "build-queue", 0);

		// eslint-disable-next-line no-console
		console.log("repoId -- ", repoId);
	}
}

main();
