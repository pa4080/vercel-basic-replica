import { Upload } from "@aws-sdk/lib-storage";
import mime from "mime-types";

import { bucketName, uploadDirR2 } from "@/env";

import fs from "fs";

import { s3client } from ".";

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
		const contentType = mime.lookup(localFsFilePath) || "application/octet-stream";

		const response = await new Upload({
			client: s3client,

			params: {
				Body: fileContent,
				Bucket: bucket || bucketName,
				Key: fileName,
				ContentType: contentType,
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
	uploadDir,
}: {
	fileList: string[];
	repoId: string;
	repoTmpDir: string;
	uploadDir?: string;
}) => {
	const uploadDirInUse = uploadDir || uploadDirR2;

	try {
		await Promise.all(
			fileList.map((localFsFilePath) =>
				uploadObject({
					fileName: `${uploadDirInUse}/${repoId}/${localFsFilePath.slice(repoTmpDir.length + 1)}`,
					localFsFilePath,
				})
			)
		);
	} catch (err) {
		console.error("🔥  Upload objects error: ", err);
	}
};
