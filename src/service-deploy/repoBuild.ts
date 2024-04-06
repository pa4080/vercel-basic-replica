import getRepoTmpDir from "@/utils/getRepoTmpDir";

import { exec } from "child_process";

export const repoBuild = async ({ repoId }: { repoId: string | undefined }) => {
	if (!repoId) {
		console.error("🔥  Build project: repoId is required!");

		return;
	}

	return new Promise((resolve) => {
		const child = exec(`cd ${getRepoTmpDir(repoId)} && npm i && npm run build`);

		process.stdout.write(`🏗️  Build, repoId: ${repoId}\n`);
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
