import { getRepoTmpDir } from "@/utils/getDirectory.js";

import { exec } from "child_process";

export const repoBuild = async ({ repoId }: { repoId: string | undefined }) => {
	if (!repoId) {
		console.error("🔥  Build project: repoId is required!");

		return;
	}

	/**
	 * TODO:
	 * - We should provide .env file... for now we prefer to unset the NODE_ENV
	 *   in order to avoid using the value inherited from the application itself.
	 * - Detect what we should use `pnpm` or `yarn` or `npm`...
	 */
	return new Promise((resolve) => {
		const child = exec(
			`cd ${getRepoTmpDir(repoId)} && NODE_ENV= pnpm i && NODE_ENV= pnpm run build`
		);

		process.stdout.write(`🏗️   Build, repoId: ${repoId}\n`);
		child.stdout?.on("data", (data) => {
			process.stdout.write(data);
		});

		child.stderr?.on("data", (data) => {
			process.stdout.write(data);
		});

		child.on("close", () => {
			const message = `🏛   Build done, repoId: ${repoId}\n`;

			process.stdout.write(message);
			resolve(message);
		});
	});
};
