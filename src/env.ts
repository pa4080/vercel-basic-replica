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
	UPLOAD_DIR_FS: zStringReq(),
	UPLOAD_DIR_R2: zStringReq(),
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
	UPLOAD_DIR_FS,
	UPLOAD_DIR_R2,
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
	UPLOAD_DIR_FS,
	UPLOAD_DIR_R2,
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
