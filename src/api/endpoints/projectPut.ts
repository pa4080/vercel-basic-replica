import express from "express";

import { FrameworkType, ProjectApiResponse } from "@/types";
import { mongoProjectGetById, mongoProjectUpdate } from "@/utils/mongodb";
import { isValidGitHttpsUrl } from "@/utils/urlMatch";

import { simpleGitCloneRepo } from "@/utils/simpleGitCloneRepo";

import { uploadDirR2, uploadDirR2Build } from "@/env";
import { getObjectListAndDelete } from "@/utils/aws";

import { redisPublisher } from "../redis";

export default async function projectPut(req: express.Request, res: express.Response) {
	const projectId = req.query.id || req.params.id;
	const repoUrl: string = req.body.repoUrl;
	const targetBranch: string = req.body.targetBranch;
	const framework: FrameworkType = req.body.framework;
	const projectName: string = req.body.projectName;
	const buildOutDir: string = req.body.buildOutDir;
	let response: ProjectApiResponse;

	try {
		isValidGitHttpsUrl(repoUrl);

		if (!projectId) {
			throw new Error("Something went wrong, the project could not be created.");
		}

		await getObjectListAndDelete({ prefix: `${uploadDirR2}/${projectId}` });
		await getObjectListAndDelete({ prefix: `${uploadDirR2Build}/${projectId}` });

		const update_ok = await mongoProjectUpdate(projectId as string, {
			status: "identifying",
			date: new Date(),
			projectName,
			repoUrl,
			targetBranch,
			framework,
			buildOutDir,
		});

		const project = await mongoProjectGetById(projectId as string);

		if (!update_ok || !project) {
			throw new Error(`Something went wrong while getting a project, id: ${projectId}`);
		}

		simpleGitCloneRepo({ project, redisPublisher });

		response = {
			statusCode: 200,
			statusMessage: "Project created",
			ok: true,
			data: project,
		};
	} catch (error) {
		response = {
			statusCode: 500,
			statusMessage: (error as Error).message,
			ok: false,
			data: null,
		};
	}

	// eslint-disable-next-line no-console
	console.log("📨\n", response);

	res.json(response).status(response.statusCode);
}
