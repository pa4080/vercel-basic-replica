import { S3 } from "aws-sdk";

import fs from "fs";

const uploadDir = process.env.UPLOAD_DIR_R2;

const s3 = new S3({
	accessKeyId: process.env.CLOUDFLARE_API_ACCESS_KEY_ID,
	secretAccessKey: process.env.CLOUDFLARE_API_ACCESS_KEY_SECRET,
	endpoint: process.env.CLOUDFLARE_API_ENDPOINT,
});

/**
 * @param fileName The name of the file incl. the relative path: tmp/prjId/subPath/file.name
 * @param localFsFilePath The absolute path to the file: /home/user/workDir/tmp/prjId/subPath/file.name
 */
export const uploadFile = async ({
	fileName,
	localFsFilePath,
}: {
	fileName: string;
	localFsFilePath: string;
}) => {
	const fileContent = fs.readFileSync(localFsFilePath);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const response = await s3
		.upload({
			Body: fileContent,
			Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
			Key: fileName,
		})
		.promise();
	// console.log("Upload response", response);
};

export const uploadRepo = async (fileList: string[], repoId: string) => {
	for (const localFsFilePath of fileList) {
		const regex = new RegExp(`^.*/${repoId}`);
		const fileName = localFsFilePath.replace(regex, `${uploadDir}/${repoId}`);

		await uploadFile({ fileName, localFsFilePath });
	}
};
