import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

import { mongoCollectionProjects, mongoDbName, mongoUrl } from "@/env";

export interface RepoDocument {
	_id?: ObjectId | undefined;
	status:
		| "identifying"
		| "cloning"
		| "uploading"
		| "uploaded"
		| "building"
		| "built" // not used
		| "deploying" // not used
		| "deployed"
		| "error";
	projectName: string;
	repoUrl: string;
	targetBranch: string;
	framework: string;
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoUrl, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
	tls: true,
});

export const mongoRepoIdentify = async (repoData: RepoDocument) => {
	try {
		await client.connect();
		const db = client.db(mongoDbName);
		const collection = db.collection(mongoCollectionProjects);
		const result = await collection.insertOne(repoData);

		return result.insertedId;
	} catch (error) {
		console.error((error as Error).message);
	} finally {
		await client.close();
	}
};

export const mongoRepoUpdateStatus = async (id: string, status: RepoDocument["status"]) => {
	try {
		await client.connect();
		const db = client.db(mongoDbName);
		const collection = db.collection(mongoCollectionProjects);
		const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status } });

		return result.modifiedCount;
	} catch (error) {
		console.error((error as Error).message);
	} finally {
		await client.close();
	}
};

export const mongoRepoGetById = async (id: string) => {
	try {
		await client.connect();
		const db = client.db(mongoDbName);
		const collection = db.collection(mongoCollectionProjects);
		const result = await collection.findOne({ _id: new ObjectId(id) });

		const resultJson = result
			? {
					...result,
					_id: result._id.toString(),
				}
			: null;

		return resultJson;
	} catch (error) {
		console.error((error as Error).message);
	} finally {
		await client.close();
	}
};

/**
 * CLI: doppler run -- pnpm exec ts-node -e 'require("./src/utils/mongodb.ts").run().catch()'
 */
export async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		// eslint-disable-next-line no-console
		console.log("Pinged your deployment. You successfully connected to MongoDB!");
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
} // run().catch(console.dir);
