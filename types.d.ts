import { DefaultSession, User as DefaultUser } from "@auth/express";

declare module "@auth/express" {
	// Adding custom properties to the session object
	interface Session {
		user: {
			isAdmin?: string;
			id: string;
		} & DefaultSession["user"];
	}

	interface User extends DefaultUser {
		isAdmin?: string;
		id: string;
	}
}
