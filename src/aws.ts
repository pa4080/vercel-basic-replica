import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";

import fs from "fs";

const uploadDir = process.env.UPLOAD_DIR_R2;

const s3 = new S3({
	credentials: {
		accessKeyId: process.env.CLOUDFLARE_API_ACCESS_KEY_ID,
		secretAccessKey: process.env.CLOUDFLARE_API_ACCESS_KEY_SECRET,
	},
	region: process.env.CLOUDFLARE_R2_BUCKET_REGION,
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
	const response = await new Upload({
		client: s3,

		params: {
			Body: fileContent,
			Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
			Key: fileName,
		},
	}).done();
	// console.log("Upload response", response);
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
		const fileName = `${uploadDir}/${repoId}/${localFsFilePath.slice(repoTmpDir.length + 1)}`;

		await uploadFile({ fileName, localFsFilePath });
	}
};
