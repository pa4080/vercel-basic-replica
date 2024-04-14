import { S3, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

export const config: S3ClientConfig = {
	credentials: {
		accessKeyId: process.env.CLOUDFLARE_API_ACCESS_KEY_ID!,
		secretAccessKey: process.env.CLOUDFLARE_API_ACCESS_KEY_SECRET!,
	},
	region: process.env.CLOUDFLARE_R2_BUCKET_REGION!,
	endpoint: process.env.CLOUDFLARE_API_ENDPOINT!,
};

export const s3client = new S3(config) || new S3Client(config);

export * from "./obj-delete.js";
export * from "./obj-download.js";
export * from "./obj-get.js";
export * from "./obj-list.js";
export * from "./obj-upload.js";
