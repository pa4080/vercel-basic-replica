import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

import { mongoCollectionProjects, mongoDbName, mongoUrl } from "@/env";
import { ProjectDocument } from "@/types";

import { projectDocumentToData } from "./projectDocToRepoData";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const clientSettings = {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
	tls: true,
};

/**
 * console.log(result);
 * {
 * 	acknowledged: true,
 * 	insertedId: new ObjectId('6616a9f66cdb002011b1b299')
 * }
 */
export const mongoProjectInsert = async (repoData: Omit<ProjectDocument, "_id">) => {
	const client = new MongoClient(mongoUrl, clientSettings);

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

export const mongoProjectUpdateStatus = async (id: string, status: ProjectDocument["status"]) => {
	const client = new MongoClient(mongoUrl, clientSettings);

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

export const mongoProjectUpdate = async (id: string, update: Partial<ProjectDocument>) => {
	const client = new MongoClient(mongoUrl, clientSettings);

	try {
		await client.connect();
		const db = client.db(mongoDbName);
		const collection = db.collection(mongoCollectionProjects);
		const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: update });

		return result.modifiedCount;
	} catch (error) {
		console.error((error as Error).message);
	} finally {
		await client.close();
	}
};

export const mongoProjectGetById = async (objectId: string | ObjectId) => {
	const _id = objectId instanceof ObjectId ? objectId : new ObjectId(objectId);
	const client = new MongoClient(mongoUrl, clientSettings);

	try {
		await client.connect();
		const db = client.db(mongoDbName);
		const collection = db.collection(mongoCollectionProjects);
		const result = (await collection.findOne({ _id })) as ProjectDocument;

		if (!result) {
			throw new Error(`Project not found, id: ${_id.toString()}`);
		}

		return projectDocumentToData(result);
	} catch (error) {
		console.error((error as Error).message);
	} finally {
		await client.close();
	}
};

export const mongoProjectGetAll = async () => {
	const client = new MongoClient(mongoUrl, clientSettings);

	try {
		await client.connect();
		const db = client.db(mongoDbName);
		const collection = db.collection(mongoCollectionProjects);
		const result = (await collection.find({}).toArray()) as ProjectDocument[];

		return result.map((doc) => projectDocumentToData(doc));
	} catch (error) {
		console.error((error as Error).message);
	} finally {
		await client.close();
	}
};

export const mongoProjectDeleteById = async (objectId: string | ObjectId) => {
	const _id = objectId instanceof ObjectId ? objectId : new ObjectId(objectId);
	const client = new MongoClient(mongoUrl, clientSettings);

	try {
		await client.connect();
		const db = client.db(mongoDbName);
		const collection = db.collection(mongoCollectionProjects);
		const result = await collection.deleteOne({ _id });

		return result.deletedCount;
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
	const client = new MongoClient(mongoUrl, clientSettings);

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
