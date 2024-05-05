import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

import { mongoCollectionProjects, mongoDbName, mongoUrl } from "@/env.js";
import { ProjectDocument, ProjectDocumentPopulated } from "@/types.js";

import { projectDocumentToData } from "./projectDocToRepoData.js";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const clientOptions = {
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
export const mongoProjectInsert = async (
	repoData: Omit<ProjectDocument, "_id" | "creator"> & { creator: string | ObjectId }
) => {
	const client = new MongoClient(mongoUrl, clientOptions);

	try {
		await client.connect();
		const db = client.db(mongoDbName);
		const collection = db.collection(mongoCollectionProjects);
		const result = await collection.insertOne({
			...repoData,
			creator: new ObjectId(repoData.creator),
		});

		return result.insertedId;
	} catch (error) {
		console.error((error as Error).message);
	} finally {
		await client.close();
	}
};

export const mongoProjectUpdateStatus = async (id: string, status: ProjectDocument["status"]) => {
	const client = new MongoClient(mongoUrl, clientOptions);

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
	const client = new MongoClient(mongoUrl, clientOptions);

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
	const client = new MongoClient(mongoUrl, clientOptions);

	try {
		await client.connect();
		const db = client.db(mongoDbName);
		const collection = db.collection(mongoCollectionProjects);
		// const project = (await collection.findOne({ _id })) as ProjectDocument;

		// https://stackoverflow.com/a/50825751/6543935
		const pipeline = [
			{ $match: { _id } },
			{
				$lookup: {
					from: "users",
					localField: "creator",
					foreignField: "_id",
					as: "creator",
				},
			},
			{ $unwind: "$creator" },
		];

		const projectPopulated = (
			await collection.aggregate(pipeline).toArray()
		)[0] as ProjectDocumentPopulated;

		return projectDocumentToData(projectPopulated);
	} catch (error) {
		console.error((error as Error).message);
	} finally {
		await client.close();
	}
};

export const mongoProjectGetAll = async () => {
	const client = new MongoClient(mongoUrl, clientOptions);

	try {
		await client.connect();
		const db = client.db(mongoDbName);
		const collection = db.collection(mongoCollectionProjects);

		// https://stackoverflow.com/a/50825751/6543935
		const pipeline = [
			{ $match: {} },
			{
				$lookup: {
					from: "users",
					localField: "creator",
					foreignField: "_id",
					as: "creator",
				},
			},
			{ $unwind: "$creator" },
		];

		const projectsPopulated = (await collection
			.aggregate(pipeline)
			.toArray()) as ProjectDocumentPopulated[];

		// const allProjects = (await collection.find({}).toArray()) as ProjectDocument[];
		// const projectsWithNoOwner = allProjects.filter(({ creator }) => !creator);

		return projectsPopulated.map((doc) => projectDocumentToData(doc));
	} catch (error) {
		console.error((error as Error).message);
	} finally {
		await client.close();
	}
};

export const mongoProjectDeleteById = async (objectId: string | ObjectId) => {
	const _id = objectId instanceof ObjectId ? objectId : new ObjectId(objectId);
	const client = new MongoClient(mongoUrl, clientOptions);

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
	const client = new MongoClient(mongoUrl, clientOptions);

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
