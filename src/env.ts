/**
 * The ENV_VARS are managed via Doppler at https://dashboard.doppler.com/
 */
import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]),
	UPLOAD_SERVICE_PORT: z.string().trim().min(1, { message: "UPLOAD_SERVICE_PORT is required!" }),
});

const { NODE_ENV, UPLOAD_SERVICE_PORT } = process.env;

const parsedResults = envSchema.safeParse({ NODE_ENV, UPLOAD_SERVICE_PORT });

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
