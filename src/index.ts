import "./env";
import express from "express";
import cors from "cors";
import simpleGit from "simple-git";

import { generateId } from "./utils/random";
import { isValidUrl } from "./utils/urlMatch";
import { RepoUploadResponse } from "./types";

const port = process.env.UPLOAD_SERVICE_PORT || 3001;
const startMessage = `Express listening on port ${port}...`;

const app = express();

app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
	const repoUrl = req.body.repoUrl;
	const repoId = generateId();
	let response: RepoUploadResponse;

	try {
		isValidUrl(repoUrl);
		await simpleGit().clone(repoUrl, `./repositories/${repoId}`);
		response = {
			id: repoId,
			statusMessage: "The repository was successfully cloned",
			statusCode: 200,
			url: repoUrl,
		};
	} catch (error) {
		response = {
			id: null,
			statusMessage: (error as Error).message ?? "Invalid URL",
			statusCode: 400,
			url: repoUrl,
		};
	}

	// eslint-disable-next-line no-console
	console.log(response);

	res.json(response).status(response.statusCode);
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(startMessage));
