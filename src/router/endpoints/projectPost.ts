import express from "express";

import { FrameworkType, ProjectApiResponse } from "@/types.js";
import { mongoProjectGetById, mongoProjectInsert } from "@/utils/mongodb.js";
import { isValidGitHttpsUrl } from "@/utils/urlMatch.js";

import { simpleGitCloneRepo } from "@/utils/simpleGitCloneRepo.js";

import { redisPublisher } from "../redis.js";

export default async function projectPost(req: express.Request, res: express.Response) {
	const { session } = res.locals;

	if (!session) {
		return res.status(401).end();
	}

	const repoUrl: string = req.body.repoUrl;
	const targetBranch: string = req.body.targetBranch;
	const framework: FrameworkType = req.body.framework;
	const projectName: string = req.body.projectName;
	const buildOutDir: string = req.body.buildOutDir;
	let response: ProjectApiResponse;

	try {
		isValidGitHttpsUrl(repoUrl);

		const projectId = await mongoProjectInsert({
			status: "identifying",
			date: new Date(),
			projectName,
			repoUrl,
			targetBranch,
			framework,
			buildOutDir,
			creator: session.user.id,
		});

		if (!projectId) {
			throw new Error("Something went wrong, the project could not be created.");
		}

		const project = await mongoProjectGetById(projectId);

		if (!project) {
			throw new Error(`Something went wrong while getting a project, id: ${projectId.toString()}`);
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
