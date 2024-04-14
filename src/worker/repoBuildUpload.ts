import { uploadDirR2Build } from "@/env.js";
import { uploadObjectList } from "@/utils/aws/index.js";
import { findRepoBuildDir } from "@/utils/findRepoBuildDir.js";
import { getFileList } from "@/utils/getFileListRecursively.js";
import { mongoProjectGetById, mongoProjectUpdateStatus } from "@/utils/mongodb.js";

export const repoBuildUpload = async ({ projectId }: { projectId: string | undefined }) => {
	try {
		process.stdout.write(`📤  Start build upload, repoId: ${projectId}\n`);

		if (!projectId) {
			throw new Error("🔥  Build project: repoId is required!");
		}

		const project = await mongoProjectGetById(projectId);

		const repoBuildDir =
			project?.buildOutDir && project?.buildOutDir !== "default"
				? project?.buildOutDir
				: await findRepoBuildDir({ projectId });

		if (!repoBuildDir) {
			mongoProjectUpdateStatus(projectId, "error");
			throw new Error(`🔥  Build project: build dir not found, repoId: ${projectId}`);
		}

		const fileList = getFileList({ dir: repoBuildDir });

		await uploadObjectList({
			fileList,
			repoId: projectId,
			repoTmpDir: repoBuildDir,
			uploadDir: uploadDirR2Build,
		});

		process.stdout.write(`📤  Finish build upload, repoId: ${projectId}\n`);
	} catch (error) {
		console.error((error as Error).message);
	}
};
