import { S3, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

const uploadDirFs = process.env.UPLOAD_DIR_FS!;
const uploadDirR2 = process.env.UPLOAD_DIR_R2!;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
const baseDir = __dirname.includes("dist") ? __dirname : "dist";

const config: S3ClientConfig = {
	credentials: {
		accessKeyId: process.env.CLOUDFLARE_API_ACCESS_KEY_ID!,
		secretAccessKey: process.env.CLOUDFLARE_API_ACCESS_KEY_SECRET!,
	},
	region: process.env.CLOUDFLARE_R2_BUCKET_REGION!,
	endpoint: process.env.CLOUDFLARE_API_ENDPOINT!,
};

const s3client = new S3(config) || new S3Client(config);

export * from "./obj-delete";
export * from "./obj-download";
export * from "./obj-list";
export * from "./obj-upload";
export { baseDir, bucketName, s3client, uploadDirFs, uploadDirR2 };
