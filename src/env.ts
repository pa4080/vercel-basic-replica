/**
 * The ENV_VARS are managed via Doppler at https://dashboard.doppler.com/
 * https://github.com/colinhacks/zod/issues/63
 */
import { z as zod } from "zod";

const z = zod as typeof zod & { stringRequired: (key?: string) => zod.ZodString };

z.stringRequired = (key: string | undefined = undefined) =>
	zod
		.string()
		.trim()
		.min(1, { message: `${key ? `${key} is ` : ""}Required!` });

const envSchema = z.object({
	NODE_ENV: z.enum(["dev", "stg", "prod"]),
	UPLOAD_SERVICE_PORT: z.stringRequired(),
	CLOUDFLARE_ACCOUNT_ID: z.stringRequired(),
	CLOUDFLARE_API_TOKEN: z.stringRequired(),
	CLOUDFLARE_API_ACCESS_KEY_ID: z.stringRequired(),
	CLOUDFLARE_API_ACCESS_KEY_SECRET: z.stringRequired(),
	CLOUDFLARE_API_ENDPOINT: z.stringRequired(),
});

const {
	NODE_ENV,
	UPLOAD_SERVICE_PORT,
	CLOUDFLARE_ACCOUNT_ID,
	CLOUDFLARE_API_TOKEN,
	CLOUDFLARE_API_ACCESS_KEY_ID,
	CLOUDFLARE_API_ACCESS_KEY_SECRET,
	CLOUDFLARE_API_ENDPOINT,
} = process.env;

const parsedResults = envSchema.safeParse({
	NODE_ENV,
	UPLOAD_SERVICE_PORT,
	CLOUDFLARE_ACCOUNT_ID,
	CLOUDFLARE_API_TOKEN,
	CLOUDFLARE_API_ACCESS_KEY_ID,
	CLOUDFLARE_API_ACCESS_KEY_SECRET,
	CLOUDFLARE_API_ENDPOINT,
});

if (!parsedResults.success) {
	console.error(parsedResults.error);
	throw new Error("Invalid ENV_VARS");
}

export const env = parsedResults.data;

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv extends zod.infer<typeof envSchema> {}
	}
}
