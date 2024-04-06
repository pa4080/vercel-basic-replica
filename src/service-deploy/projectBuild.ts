import { baseDir, uploadDirFs } from "@/env";

import { exec } from "child_process";

import path from "path";

export const projectBuild = async ({ repoId }: { repoId: string | undefined }) => {
	if (!repoId) {
		console.error("🔥  Build project: repoId is required!");

		return;
	}

	return new Promise((resolve) => {
		const projectDir = path.join(baseDir, uploadDirFs, repoId);

		const child = exec(`cd ${projectDir} && npm i && npm run build`);

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
