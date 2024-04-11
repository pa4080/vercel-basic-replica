import express from "express";

import { ProjectApiResponse } from "@/types";
import { mongoProjectGetAll, mongoProjectGetById } from "@/utils/mongodb";

/**
 * Get all projects or a single project
 */
export default async function projectGet(req: express.Request, res: express.Response) {
	const id = req.query.id || req.params.id;
	let response: ProjectApiResponse;

	/**
	 * Get all projects if no Id is provided
	 */
	if (!id) {
		const projects = await mongoProjectGetAll();

		if (projects) {
			response = {
				data: projects,
				ok: true,
				statusCode: 200,
				statusMessage: "OK",
			};
		} else {
			response = {
				data: null,
				ok: false,
				statusCode: 404,
				statusMessage: "Error. Cannot get the projects.",
			};
		}

		return res.status(response.statusCode).json(response);
	}

	/**
	 * Get a single project
	 */
	const project = await mongoProjectGetById(id as string);

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
