// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb";

import { mongoUrl } from "@/env.js";

import { clientOptions } from "./mongodb.js";

let _mongoClientPromise: Promise<MongoClient> | undefined;

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
	// In development mode, use a global variable so that the value
	// is preserved across module reloads caused by HMR (Hot Module Replacement).
	if (!_mongoClientPromise) {
		client = new MongoClient(mongoUrl, clientOptions);

		_mongoClientPromise = client.connect();
	}

	clientPromise = _mongoClientPromise;
} else {
	// In production mode, it's best to not use a global variable.
	client = new MongoClient(mongoUrl, clientOptions);
	clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
