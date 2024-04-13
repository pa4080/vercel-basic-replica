import express from "express";

import { uploadDirR2, uploadDirR2Build } from "@/env";
import { ProjectApiResponse } from "@/types";
import { getObjectListAndDelete } from "@/utils/aws";
import { mongoProjectDeleteById, mongoProjectGetAll } from "@/utils/mongodb";

/**
 * Get all projects or a single project
 */
export default async function projectsDeleteAll(req: express.Request, res: express.Response) {
	const projects = await mongoProjectGetAll();
	let response: ProjectApiResponse;

	console.warn(`🗑️  Deleting all projects...`);

	if (projects) {
		try {
			await Promise.all([
				...projects.map((project) => mongoProjectDeleteById(project._id)),
				getObjectListAndDelete({ log: true, prefix: uploadDirR2 }),
				getObjectListAndDelete({ log: true, prefix: uploadDirR2Build }),
			]);

			response = {
				data: null,
				ok: true,
				statusCode: 204,
				statusMessage: `All projects deleted`,
			};
		} catch (error) {
			console.error(error);

			response = {
				data: null,
				ok: false,
				statusCode: 500,
				statusMessage: `Something went wrong, cannot delete the projects.`,
			};
		}
	} else {
		response = {
			data: null,
			ok: false,
			statusCode: 404,
			statusMessage: `Something went wrong, cannot get the projects.`,
		};
	}

	return res.status(response.statusCode).json(response);
}
