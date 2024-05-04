import { getSession } from "@auth/express";
import GitHub from "@auth/express/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import express from "express";

import { mongoDbName } from "@/env.js";
import clientPromise from "@/utils/mongodbAuth.js";

type AuthConfig = Parameters<typeof getSession>[1];

export const authConfig: AuthConfig = {
	providers: [GitHub({ authorization: { params: { scope: "user:email login name avatar_url" } } })],
	adapter: MongoDBAdapter(clientPromise, { databaseName: mongoDbName }),
	useSecureCookies: true,
	// trustHost: true,
	callbacks: {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		async session({ session, user, token }) {
			// Add custom property to user object in session
			session.user.isAdmin = user.isAdmin;

			return session;
		},
	},
};

export async function authSession(
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) {
	res.locals.session = await getSession(req, authConfig);
	next();
}
