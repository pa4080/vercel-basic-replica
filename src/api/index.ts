import cors from "cors";
import express from "express";

import { appUriProject, appUriProjects } from "@/env";

import contentGet from "./endpoints/contentGet";
import projectDelete from "./endpoints/projectDelete";
import projectGet from "./endpoints/projectGet";
import projectPost from "./endpoints/projectPost";
import projectPut from "./endpoints/projectPut";
import projectsDeleteAll from "./endpoints/projectsDeleteAll";
import { redisPublisher } from "./redis";

const port = process.env.UPLOAD_SERVICE_PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

// Create a new project
app.post(`/${appUriProject}`, projectPost);

// Update a project
app.put(`/${appUriProject}/:id`, projectPut);

// Get a project
app.get(`/${appUriProject}/:id`, projectGet);

// Get all projects
app.get(`/${appUriProject}`, projectGet);

// Delete a single project
app.delete(`/${appUriProject}/:id`, projectDelete);

// Delete all projects
app.delete(`/${appUriProjects}`, projectsDeleteAll);

// Serve the React app (our frontend), or a deployed projects
app.get("/*", contentGet);

// Start the server
app.listen(port, async () => {
	process.stdout.write(`🚀  Starting upload service on port ${port}...\n`);
	await redisPublisher.lPush("build-queue", "warm-up"); // Add the repo to the build-queue
});
