import { GetObjectCommand, GetObjectCommandOutput, _Object } from "@aws-sdk/client-s3";

import fs from "fs";

/**
 * Download an objects in the bucket from CLI:
 * > doppler run -- pnpm exec ts-node -e 'require("./src/utils/aws/obj-download.ts").getObjectListAndDownload({log: true, prefix: "uploads/a2b2d72a81fed831527e/README.md", repoId: "a2b2d72a81fed831527e"})'
 *
 * References:
 * > https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/s3#code-examples
 * > https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/s3/actions/delete-objects.js
 */

import path from "path";

import { baseDir, bucketName, listObjects, s3client, uploadDirFs, uploadDirR2 } from ".";

export const getSingleObject = async ({
	bucket,
	object,
	log = false,
}: {
	bucket?: string;
	object: _Object;
	log?: boolean;
}) => {
	const command = new GetObjectCommand({
		Bucket: bucket || bucketName,
		Key: object.Key,
	});

	try {
		const response = await s3client.send(command);

		if (log) {
			// eslint-disable-next-line no-console
			console.log(`\nGet object: ${object.Key}.\n`);

			// The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
			// Note the Body could be transformed only once.
			const str = await response.Body?.transformToString();

			// eslint-disable-next-line no-console
			console.log(str);
		}

		return response;
	} catch (err) {
		console.error(err);
	}
};

export const saveObject = async ({
	requestObject,
	responseObject,
	repoId,
	log = false,
}: {
	requestObject: _Object;
	responseObject: GetObjectCommandOutput | undefined;
	repoId: string;
	log?: boolean;
}) => {
	if (!requestObject.Key || !responseObject || !requestObject.Key.includes(repoId)) {
		return;
	}

	const repoFilename = requestObject.Key.replace(new RegExp(`^.*(${repoId}/)`), "$1");
	const fileTmpPath = path.join(baseDir, uploadDirFs, repoFilename);
	const fileDir = path.dirname(fileTmpPath);

	if (!fs.existsSync(fileDir)) {
		fs.mkdirSync(fileDir, { recursive: true });
	}

	const writeStream = fs.createWriteStream(fileTmpPath).on("error", (err) => console.error(err));

	writeStream.write(await responseObject.Body?.transformToByteArray());

	if (log) {
		// eslint-disable-next-line no-console
		console.log(`\nSaved object: ${fileTmpPath}\n`);
	}
};

/**
 * @param prefix The prefix of the objects to download
 * @param bucket The name of the bucket
 * @param repoId The id of the repo
 * @param log If true, the function will print the object names to the console
 */
export const getObjectListAndDownload = async ({
	repoId,
	prefix,
	bucket,
	log = false,
}: {
	repoId: string | undefined;
	prefix?: string;
	bucket?: string;
	log?: boolean;
}) => {
	if (!repoId) {
		console.error("Download objects: repoId is required!");

		return;
	}

	process.stdout.write(`🗃️  Obtaining the file list, repoId:${repoId}\n`);

	const actualPrefix = prefix || `${uploadDirR2}/${repoId}`;
	const objectList = await listObjects({ bucket, prefix: actualPrefix, log: false });
	let fileCounter = 0;

	process.stdout.write(`📥  Download started, repoId:${repoId}\n`);

	for (const requestObject of objectList) {
		const responseObject = await getSingleObject({ object: requestObject, log: false });

		process.stdout.write("\x1b[2K");
		process.stdout.write(
			`\r 🗂️  Downloading object ${++fileCounter}/${objectList.length}: ${requestObject.Key}`
		);

		saveObject({ requestObject, responseObject, repoId, log });
	}

	process.stdout.write(`\n📥  Download finished, repoId:${repoId}\n`);
};
