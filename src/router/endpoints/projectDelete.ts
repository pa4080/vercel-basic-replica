import express from "express";

import { uploadDirR2, uploadDirR2Build } from "@/env.js";
import { ProjectApiResponse } from "@/types.js";
import { getObjectListAndDelete } from "@/utils/aws/index.js";
import { mongoProjectDeleteById, mongoProjectGetById } from "@/utils/mongodb.js";

/**
 * Get all projects or a single project
 */
export default async function projectDelete(req: express.Request, res: express.Response) {
	const { session } = res.locals;

	if (!session) {
		return res.status(401).end();
	}

	const projectId = req.query.id || req.params.id;
	let response: ProjectApiResponse;

	try {
		const project = await mongoProjectGetById(projectId as string);

		const isAdmin = session?.user?.isAdmin ?? false;
		const isOwner = session?.user?.id === project?.creator?._id;

		if (!isAdmin && !isOwner) {
			return res.status(401).end();
		}

		await getObjectListAndDelete({ prefix: `${uploadDirR2}/${projectId}` });
		await getObjectListAndDelete({ prefix: `${uploadDirR2Build}/${projectId}` });
		await mongoProjectDeleteById(projectId as string);

		response = {
			data: null,
			ok: true,
			statusCode: 204,
			statusMessage: `Project found, id: ${projectId}`,
		};
	} catch (error) {
		console.error(error);

		response = {
			data: null,
			ok: false,
			statusCode: 404,
			statusMessage: `Something went wrong, id: ${projectId}`,
		};
	}

	return res.status(response.statusCode).json(response);
}
