import express from "express";

import { ProjectApiResponse } from "@/types";
import { mongoProjectDeleteById } from "@/utils/mongodb";

/**
 * Get all projects or a single project
 */
export default async function projectDelete(req: express.Request, res: express.Response) {
	const id = req.query.id || req.params.id;
	let response: ProjectApiResponse;

	/**
	 * Get a single project
	 */
	const project = await mongoProjectDeleteById(id as string);

	if (project) {
		response = {
			data: project,
			ok: true,
			statusCode: 200,
			statusMessage: `Project found, id: ${id}`,
		};
	} else {
		response = {
			data: null,
			ok: false,
			statusCode: 404,
			statusMessage: `Something went wrong, id: ${id}`,
		};
	}

	return res.status(response.statusCode).json(response);
}
