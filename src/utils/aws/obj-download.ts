/**
 * Download an objects in the bucket from CLI:
 * > doppler run -- pnpm exec ts-node -e 'require("./src/utils/aws/obj-download.ts").getObjectListAndDownload({log: true, prefix: "uploads/a2b2d72a81fed831527e/README.md", repoId: "a2b2d72a81fed831527e"})'
 *
 * References:
 * > https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/s3#code-examples
 * > https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/s3/actions/delete-objects.js
 */
import { GetObjectCommand, S3, S3Client, _Object } from "@aws-sdk/client-s3";

import { baseDir, bucketName, uploadDirFs, uploadDirR2 } from "@/env.js";

import { Readable } from "stream"; // https://stackoverflow.com/a/67373050/6543935

import fs from "fs";
import path from "path";

import { config, listObjects } from "./index.js";

export const downloadObject = async ({
	object,
	projectId,
	bucket,
	log = false,
}: {
	object: _Object;
	projectId: string;
	bucket?: string;
	log?: boolean;
}) => {
	if (!object.Key || !object.Key.includes(projectId)) {
		return;
	}

	try {
		const s3client = new S3(config) || new S3Client(config);

		const command = new GetObjectCommand({
			Bucket: bucket || bucketName,
			Key: object.Key,
		});

		const responseObject = await s3client.send(command);

		const repoFilename = object.Key.replace(new RegExp(`^.*(${projectId}/)`), "$1");
		const fileTmpPath = path.join(baseDir, uploadDirFs, repoFilename);
		const fileDir = path.dirname(fileTmpPath);

		if (!fs.existsSync(fileDir)) {
			fs.mkdirSync(fileDir, { recursive: true });
		}

		const writeStream = fs.createWriteStream(fileTmpPath).on("error", (err) => console.error(err));
		const readStream = responseObject.Body as Readable;

		readStream.pipe(writeStream);

		if (log) {
			process.stdout.write(`🗂️  Saved object: ${fileTmpPath}\n`);
		}
	} catch (err) {
		console.error(err);
	}
};

/**
 * @param repoId The id of the repo
 * @param prefix The prefix of the objects to download
 * @param bucket The name of the bucket
 * @param log If true, the function will print the object names to the console
 */
export const getObjectListAndDownload = async ({
	projectId,
	prefix,
	bucket,
	log = false,
}: {
	projectId: string | undefined;
	prefix?: string;
	bucket?: string;
	log?: boolean;
}) => {
	if (!projectId) {
		console.error("Download objects: repoId is required!");

		return;
	}

	try {
		process.stdout.write(`🗃️   Obtaining the file list, repoId: ${projectId}\n`);

		const actualPrefix = prefix || `${uploadDirR2}/${projectId}`;
		const objectList = await listObjects({ bucket, prefix: actualPrefix, log });

		process.stdout.write(`📥  Download started, repoId: ${projectId}\n`);

		await Promise.all(
			objectList.map((object) => downloadObject({ object, projectId: projectId, log }))
		);

		process.stdout.write(`📥  Download finished, repoId: ${projectId}\n`);
	} catch (err) {
		console.error("🔥  Download objects error: ", err);
	}
};
