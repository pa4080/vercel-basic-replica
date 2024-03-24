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
}: {
	bucket?: string;
	fileName: string;
	localFsFilePath: string;
}) => {
	const fileContent = fs.readFileSync(localFsFilePath);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const response = await new Upload({
		client: s3client,

		params: {
			Body: fileContent,
			Bucket: bucket || bucketName,
			Key: fileName,
		},
	}).done();

	// eslint-disable-next-line no-console
	console.log("File uploaded to: ", response);
};

export const uploadRepo = async ({
	fileList,
	repoId,
	repoTmpDir,
}: {
	fileList: string[];
	repoId: string;
	repoTmpDir: string;
}) => {
	for (const localFsFilePath of fileList) {
		// string.slice(n) will remove the first n characters from the string
		const fileName = `${uploadDirR2}/${repoId}/${localFsFilePath.slice(repoTmpDir.length + 1)}`;

		await uploadObject({ fileName, localFsFilePath });
	}
};
