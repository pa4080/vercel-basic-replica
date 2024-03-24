/**
 * Delete all objects in the bucket from CLI:
 * > doppler run -- pnpm exec ts-node -e 'require("./src/utils/aws/obj-delete.ts").getObjectListAndDelete({log: true})'
 *
 * References:
 * > https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/s3#code-examples
 * > https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/s3/actions/delete-objects.js
 */
import { DeleteObjectsCommand, ObjectIdentifier } from "@aws-sdk/client-s3";

import { bucketName, listObjects, s3client } from ".";

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

	await deleteObjectList({ objects: objects.map((o) => ({ Key: o.Key })), log });
};
