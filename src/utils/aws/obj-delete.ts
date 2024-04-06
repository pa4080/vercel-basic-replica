/**
 * Delete all objects in the bucket from CLI:
 * > doppler run -- pnpm exec ts-node -e 'require("./src/utils/aws/obj-delete.ts").getObjectListAndDelete({log: true})'
 * > doppler run -- pnpm exec ts-node -e 'require("./src/utils/aws/obj-delete.ts").getObjectListAndDelete({log: true, prefix: process.env.UPLOAD_DIR_R2_BUILD})'
 *
 * References:
 * > https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/s3#code-examples
 * > https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/s3/actions/delete-objects.js
 */
import { DeleteObjectsCommand, ObjectIdentifier } from "@aws-sdk/client-s3";

import { bucketName } from "@/env";

import { listObjects, s3client } from ".";

export const deleteObjectList = async ({
	bucket,
	objects,
	log = false,
}: {
	bucket?: string;
	objects: ObjectIdentifier[];
	log?: boolean;
}) => {
	const command = new DeleteObjectsCommand({
		Bucket: bucket || bucketName,
		Delete: {
			Objects: objects,
		},
	});

	try {
		const { Deleted } = await s3client.send(command);

		if (log) {
			process.stdout.write(`\n🌵  Successfully deleted ${Deleted?.length} object(s):  🌵\n`);
			Deleted?.map((o) => process.stdout.write(`💀  ${o.Key}\n`));
		}
	} catch (err) {
		console.error(err);
	}
};

export const getObjectListAndDelete = async ({
	prefix,
	bucket,
	log = false,
}: {
	prefix?: string;
	bucket?: string;
	log?: boolean;
}) => {
	const objects = await listObjects({ bucket, prefix, log: false });

	const slicedObjects = [];

	for (let i = 0; i < objects.length; i += 999) {
		slicedObjects.push(objects.slice(i, i + 999));
	}

	for (const batch of slicedObjects) {
		// The length of the array for delete must be between 1 and 1000
		await deleteObjectList({ objects: batch.map((o) => ({ Key: o.Key })), log });
	}
};
