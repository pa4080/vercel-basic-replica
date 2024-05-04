/**
 * The ENV_VARS are managed via Doppler at https://dashboard.doppler.com/
 *
 * > https://github.com/colinhacks/zod/issues/63
 */
import { z } from "zod";

const zStringReq = (msg?: string) =>
	z
		.string()
		.trim()
		.min(1, { message: msg ?? "Required!" });

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "stage", "production"]),
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
	UPLOAD_DIR_R2_BUILD: zStringReq(),
	REDIS_URL: zStringReq(),
	REDIS_URL_LOCAL: zStringReq(),
	REDIS_URL_REMOTE: zStringReq(),
	NOT_HANDLED_REQ_REDIRECT_URL: zStringReq(),
	MONGODB_URL: zStringReq(),
	MONGODB_DB_NAME: zStringReq(),
	MONGODB_COLLECTION_PROJECTS: zStringReq(),
	VITE_APP_BASE_DOMAIN: zStringReq(),
	VITE_APP_SUBDOMAIN: zStringReq(),
	VITE_APP_SUBDOMAIN_PROJECT: zStringReq(),
	VITE_APP_URI_PROJECT: zStringReq(),
	VITE_PROJECT_HOME: zStringReq(),
	AUTH_SECRET: zStringReq(),
	VITE_APP_SUBDOMAIN_DEV: zStringReq(),
	AUTH_GITHUB_ID: zStringReq(),
	AUTH_GITHUB_SECRET: zStringReq(),
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
	UPLOAD_DIR_R2_BUILD,
	REDIS_URL,
	REDIS_URL_LOCAL,
	REDIS_URL_REMOTE,
	NOT_HANDLED_REQ_REDIRECT_URL,
	MONGODB_URL,
	MONGODB_DB_NAME,
	MONGODB_COLLECTION_PROJECTS,
	VITE_APP_BASE_DOMAIN,
	VITE_APP_SUBDOMAIN,
	VITE_APP_SUBDOMAIN_PROJECT,
	VITE_APP_URI_PROJECT,
	VITE_PROJECT_HOME,
	AUTH_SECRET,
	VITE_APP_SUBDOMAIN_DEV,
	AUTH_GITHUB_ID,
	AUTH_GITHUB_SECRET,
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
	UPLOAD_DIR_R2_BUILD,
	REDIS_URL,
	REDIS_URL_LOCAL,
	REDIS_URL_REMOTE,
	NOT_HANDLED_REQ_REDIRECT_URL,
	MONGODB_URL,
	MONGODB_DB_NAME,
	MONGODB_COLLECTION_PROJECTS,
	VITE_APP_BASE_DOMAIN,
	VITE_APP_SUBDOMAIN,
	VITE_APP_SUBDOMAIN_PROJECT,
	VITE_APP_URI_PROJECT,
	VITE_PROJECT_HOME,
	AUTH_SECRET,
	VITE_APP_SUBDOMAIN_DEV,
	AUTH_GITHUB_ID,
	AUTH_GITHUB_SECRET,
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

export const isProd = NODE_ENV === "production";
export const uploadDirFs = UPLOAD_DIR_FS;
export const uploadDirR2 = UPLOAD_DIR_R2;
export const uploadDirR2Build = UPLOAD_DIR_R2_BUILD;
export const bucketName = CLOUDFLARE_R2_BUCKET_NAME;
export const baseDir = "dist"; // NODE_ENV.match(/dev|development/) ? "dist" : __dirname; --> ?.js/?.cjs
export const possibleBuildDirs = ["dist", "build", "out", "builds", "output"];
export const mongoUrl = MONGODB_URL;
export const mongoDbName = MONGODB_DB_NAME;
export const mongoCollectionProjects = MONGODB_COLLECTION_PROJECTS;
export const appBaseDomain = VITE_APP_BASE_DOMAIN;
export const appSubdomain = VITE_APP_SUBDOMAIN;
export const appSubdomainDev = VITE_APP_SUBDOMAIN_DEV;
export const appDeploySubdomainPrefix = VITE_APP_SUBDOMAIN_PROJECT;
export const appUriProject = VITE_APP_URI_PROJECT;
export const appUriProjects = `${appUriProject}s`;
export const authSecret = AUTH_SECRET;
export const authGithubId = AUTH_GITHUB_ID;
export const authGithubSecret = AUTH_GITHUB_SECRET;
