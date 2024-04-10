import express from "express";

import { mongoRepoGetAll, mongoRepoGetById } from "@/utils/mongodb";

/**
 * Get all projects or a single project
 */
export default async function projectGet(req: express.Request, res: express.Response) {
	const id = req.query.id || req.params.id;

	/**
	 * Get all projects if no Id is provided
	 */
	if (!id) {
		const projects = await mongoRepoGetAll();

		if (!projects) {
			return res
				.status(404)
				.json({ message: "Something went wrong, cannot get the projects.", ok: false });
		}

		return res.status(200).json({ data: projects, ok: true });
	}

	/**
	 * Get a single project
	 */
	const project = await mongoRepoGetById(id as string);

	if (!project) {
		return res.status(404).json({ message: `Something went wrong, id: ${id}`, ok: false });
	}

	return res.status(200).json({ data: project, ok: true });
}
