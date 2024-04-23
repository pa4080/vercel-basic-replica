import { S3ClientConfig } from "@aws-sdk/client-s3";

export const config: S3ClientConfig = {
	credentials: {
		accessKeyId: process.env.CLOUDFLARE_API_ACCESS_KEY_ID!,
		secretAccessKey: process.env.CLOUDFLARE_API_ACCESS_KEY_SECRET!,
	},
	region: process.env.CLOUDFLARE_R2_BUCKET_REGION!,
	endpoint: process.env.CLOUDFLARE_API_ENDPOINT!,
};

/**
 * Initialize the client for each request (move it inside the relevant functions),
 * In order to avoid: Aws-sdk-v3 hangs after ~50 getObject requests
 * ?> https://community.cloudflare.com/t/aws-sdk-v3-hangs-after-50-getobject-requests/476149/2
 *
// export const s3client = new S3(config) || new S3Client(config);
 */

export * from "./obj-delete.js";
export * from "./obj-download.js";
export * from "./obj-get.js";
export * from "./obj-list.js";
export * from "./obj-upload.js";
