import express from "express";

import { uploadDirR2, uploadDirR2Build } from "@/env.js";
import { ProjectApiResponse } from "@/types.js";
import { getObjectListAndDelete } from "@/utils/aws/index.js";
import { mongoProjectDeleteById } from "@/utils/mongodb.js";

/**
 * Get all projects or a single project
 */
export default async function projectDelete(req: express.Request, res: express.Response) {
	const { session } = res.locals;

	if (!session) {
		return res.status(401).end();
	}

	const id = req.query.id || req.params.id;
	let response: ProjectApiResponse;

	try {
		await getObjectListAndDelete({ prefix: `${uploadDirR2}/${id}` });
		await getObjectListAndDelete({ prefix: `${uploadDirR2Build}/${id}` });
		await mongoProjectDeleteById(id as string);

		response = {
			data: null,
			ok: true,
			statusCode: 204,
			statusMessage: `Project found, id: ${id}`,
		};
	} catch (error) {
		console.error(error);

		response = {
			data: null,
			ok: false,
			statusCode: 404,
			statusMessage: `Something went wrong, id: ${id}`,
		};
	}

	return res.status(response.statusCode).json(response);
}
