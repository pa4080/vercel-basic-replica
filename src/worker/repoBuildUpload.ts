import { uploadDirR2Build } from "@/env";
import { uploadObjectList } from "@/utils/aws";
import { findRepoBuildDir } from "@/utils/findRepoBuildDir";
import { getFileList } from "@/utils/getFileListRecursively";

export const repoBuildUpload = async ({ repoId }: { repoId: string | undefined }) => {
	try {
		process.stdout.write(`📤  Start build upload, repoId: ${repoId}\n`);

		if (!repoId) {
			throw new Error("🔥  Build project: repoId is required!");
		}

		const repoBuildDir = await findRepoBuildDir({ repoId });

		if (!repoBuildDir) {
			throw new Error(`🔥  Build project: build dir not found, repoId: ${repoId}`);
		}

		const fileList = getFileList({ dir: repoBuildDir });

		await uploadObjectList({
			fileList,
			repoId,
			repoTmpDir: repoBuildDir,
			uploadDir: uploadDirR2Build,
		});

		process.stdout.write(`📤  Finish build upload, repoId: ${repoId}\n`);
	} catch (error) {
		console.error((error as Error).message);
	}
};
