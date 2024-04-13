import express from "express";

import { uploadDirR2, uploadDirR2Build } from "@/env";
import { ProjectApiResponse } from "@/types";
import { getObjectListAndDelete } from "@/utils/aws";
import { mongoProjectDeleteById } from "@/utils/mongodb";

/**
 * Get all projects or a single project
 */
export default async function projectDelete(req: express.Request, res: express.Response) {
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
