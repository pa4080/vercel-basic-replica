/**
 * @see https://authjs.dev/reference/core/types#authaction
 */
import { appBaseURL } from "@/env-frontend.ts";

export const SinIn = async (provider = "github") => {
	const csrfRes = await fetch(`${appBaseURL}/auth/csrf`, { method: "GET" });
	const { csrfToken } = await csrfRes.json();

	const signInRes = await fetch(`${appBaseURL}/auth/signin/${provider}`, {
		method: "post",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"X-Auth-Return-Redirect": "1",
		},
		// @ts-expect-error boolean/string
		body: new URLSearchParams({
			csrfToken,
			json: true,
		}),
	});

	const signInData = await signInRes.json();

	const url = signInData.url ?? `${appBaseURL}/auth/callback/${provider}`;

	window.location.href = url;
};

export const GetSession = async () => {
	const res = await fetch(`${appBaseURL}/auth/session`, { method: "GET" });

	const data = await res.json();

	return data;
};

export const SinOut = async () => {
	const csrfRes = await fetch(`${appBaseURL}/auth/csrf`, { method: "GET" });
	const { csrfToken } = await csrfRes.json();

	// eslint-disable-next-line no-console
	console.log(csrfToken);

	const res = await fetch(`${appBaseURL}/auth/signout`, {
		method: "post",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		// @ts-expect-error boolean/string
		body: new URLSearchParams({
			csrfToken,
			json: true,
		}),
	});

	// eslint-disable-next-line no-console
	console.log(res);
};
