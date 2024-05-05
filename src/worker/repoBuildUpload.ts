import { baseDir, uploadDirFs, uploadDirR2Build } from "@/env.js";
import { ProjectData } from "@/types.js";
import { uploadObjectList } from "@/utils/aws/index.js";
import { findRepoBuildDir } from "@/utils/findRepoBuildDir.js";
import { getFileList } from "@/utils/getFileListRecursively.js";
import { mongoProjectGetById, mongoProjectUpdateStatus } from "@/utils/mongodb.js";

import path from "path";

export const repoBuildUpload = async ({
	projectId,
	projectData,
}: {
	projectId: string | undefined;
	projectData?: ProjectData;
}) => {
	try {
		process.stdout.write(`📤  Start build upload, repoId: ${projectId}\n`);

		if (!projectId) {
			throw new Error("🔥  Build project: repoId is required!");
		}

		const project = projectData ?? (await mongoProjectGetById(projectId));

		const repoBuildDir =
			project?.buildOutDir && project?.buildOutDir !== "detect"
				? path.join(baseDir, uploadDirFs, projectId, project?.buildOutDir)
				: await findRepoBuildDir({ projectId });

		if (!repoBuildDir) {
			mongoProjectUpdateStatus(projectId, "upload error");
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
		if (projectId) {
			await mongoProjectUpdateStatus(projectId, "build upload error"); // Update the status of the repo
		}

		console.error((error as Error).message);
	}
};
