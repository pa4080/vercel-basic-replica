import { Upload } from "@aws-sdk/lib-storage";

import fs from "fs";

import { bucketName, s3client, uploadDirR2 } from ".";

/**
 * @param fileName The name of the file incl. the relative path: tmp/prjId/subPath/file.name
 * @param localFsFilePath The absolute path to the file: /home/user/workDir/tmp/prjId/subPath/file.name
 */
export const uploadObject = async ({
	bucket,
	fileName,
	localFsFilePath,
	log = false,
}: {
	bucket?: string;
	fileName: string;
	localFsFilePath: string;
	log?: boolean;
}) => {
	try {
		const fileContent = fs.readFileSync(localFsFilePath);

		const response = await new Upload({
			client: s3client,

			params: {
				Body: fileContent,
				Bucket: bucket || bucketName,
				Key: fileName,
			},
		}).done();

		if (log) {
			process.stdout.write(`🗂️  File uploaded to: ${response.Key}`);
		}
	} catch (error) {
		console.error(error);
	}
};

export const uploadObjectList = async ({
	fileList,
	repoId,
	repoTmpDir,
}: {
	fileList: string[];
	repoId: string;
	repoTmpDir: string;
}) => {
	await Promise.all(
		fileList.map(
			async (localFsFilePath) =>
				await uploadObject({
					fileName: `${uploadDirR2}/${repoId}/${localFsFilePath.slice(repoTmpDir.length + 1)}`,
					localFsFilePath,
				})
		)
	);
};
