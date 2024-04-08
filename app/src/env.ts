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
	VITE_APP_BASE_DOMAIN: zStringReq(),
	VITE_APP_SUBDOMAIN: zStringReq(),
	VITE_APP_SUBDOMAIN_DEPLOY: zStringReq(),
	VITE_APP_URI_DEPLOY: zStringReq(),
	VITE_APP_URI_PROJECT: zStringReq(),
	VITE_APP_URI_PROJECTS: zStringReq(),
});

const {
	VITE_APP_BASE_DOMAIN,
	VITE_APP_SUBDOMAIN,
	VITE_APP_SUBDOMAIN_DEPLOY,
	VITE_APP_URI_DEPLOY,
	VITE_APP_URI_PROJECT,
	VITE_APP_URI_PROJECTS,
} = import.meta.env;

const parsedResults = envSchema.safeParse({
	VITE_APP_BASE_DOMAIN,
	VITE_APP_SUBDOMAIN,
	VITE_APP_SUBDOMAIN_DEPLOY,
	VITE_APP_URI_DEPLOY,
	VITE_APP_URI_PROJECT,
	VITE_APP_URI_PROJECTS,
});

if (!parsedResults.success) {
	console.error(parsedResults.error);
	throw new Error("Invalid ENV_VARS");
}

export const env = parsedResults.data;

export const appBaseDomain = import.meta.env.VITE_APP_BASE_DOMAIN;
export const appSubdomain = import.meta.env.VITE_APP_SUBDOMAIN;
export const appSubDeploy = import.meta.env.VITE_APP_SUBDOMAIN_DEPLOY;
export const appDeployUri = import.meta.env.VITE_APP_URI_DEPLOY;
export const appUriProjects = import.meta.env.VITE_APP_URI_PROJECTS;
export const appUriProject = import.meta.env.VITE_APP_URI_PROJECT;
export const appBaseURL = `//${appSubdomain}.${appBaseDomain}`;
