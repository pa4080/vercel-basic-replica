/**
 * The ENV_VARS are managed via Doppler at https://dashboard.doppler.com/
 * https://github.com/colinhacks/zod/issues/63
 */
import { z } from "zod";

const zStringReq = (msg?: string) =>
	z
		.string()
		.trim()
		.min(1, { message: msg ?? "Required!" });

const envSchema = z.object({
	NODE_ENV: z.enum(["dev", "stg", "prod"]),
	UPLOAD_SERVICE_PORT: zStringReq(),
	CLOUDFLARE_ACCOUNT_ID: zStringReq(),
	CLOUDFLARE_API_TOKEN: zStringReq(),
	CLOUDFLARE_API_ACCESS_KEY_ID: zStringReq(),
	CLOUDFLARE_API_ACCESS_KEY_SECRET: zStringReq(),
	CLOUDFLARE_API_ENDPOINT: zStringReq(),
	CLOUDFLARE_R2_BUCKET_NAME: zStringReq(),
	CLOUDFLARE_R2_BUCKET_REGION: zStringReq(),
	UPLOAD_DIR_FS: zStringReq(),
	UPLOAD_DIR_R2: zStringReq(),
	REDIS_URL: zStringReq(),
	REDIS_URL_LOCAL: zStringReq(),
	REDIS_URL_REMOTE: zStringReq(),
});

const {
	NODE_ENV,
	UPLOAD_SERVICE_PORT,
	CLOUDFLARE_ACCOUNT_ID,
	CLOUDFLARE_API_TOKEN,
	CLOUDFLARE_API_ACCESS_KEY_ID,
	CLOUDFLARE_API_ACCESS_KEY_SECRET,
	CLOUDFLARE_API_ENDPOINT,
	CLOUDFLARE_R2_BUCKET_NAME,
	CLOUDFLARE_R2_BUCKET_REGION,
	UPLOAD_DIR_FS,
	UPLOAD_DIR_R2,
	REDIS_URL,
	REDIS_URL_LOCAL,
	REDIS_URL_REMOTE,
} = process.env;

const parsedResults = envSchema.safeParse({
	NODE_ENV,
	UPLOAD_SERVICE_PORT,
	CLOUDFLARE_ACCOUNT_ID,
	CLOUDFLARE_API_TOKEN,
	CLOUDFLARE_API_ACCESS_KEY_ID,
	CLOUDFLARE_API_ACCESS_KEY_SECRET,
	CLOUDFLARE_API_ENDPOINT,
	CLOUDFLARE_R2_BUCKET_NAME,
	CLOUDFLARE_R2_BUCKET_REGION,
	UPLOAD_DIR_FS,
	UPLOAD_DIR_R2,
	REDIS_URL,
	REDIS_URL_LOCAL,
	REDIS_URL_REMOTE,
});

if (!parsedResults.success) {
	console.error(parsedResults.error);
	throw new Error("Invalid ENV_VARS");
}

export const env = parsedResults.data;

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envSchema> {}
	}
}

export const uploadDirFs = process.env.UPLOAD_DIR_FS!;
export const uploadDirR2 = process.env.UPLOAD_DIR_R2!;
export const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
export const baseDir = process.env.NODE_ENV.includes("dev") ? "dist" : __dirname;
