import { uploadDirR2Build } from "@/env";
import { uploadObjectList } from "@/utils/aws";
import { findRepoBuildDir } from "@/utils/findRepoBuildDir";
import { getFileList } from "@/utils/getFileListRecursively";

export const repoBuildUpload = async ({ projectId }: { projectId: string | undefined }) => {
	try {
		process.stdout.write(`📤  Start build upload, repoId: ${projectId}\n`);

		if (!projectId) {
			throw new Error("🔥  Build project: repoId is required!");
		}

		const repoBuildDir = await findRepoBuildDir({ repoId: projectId });

		if (!repoBuildDir) {
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
