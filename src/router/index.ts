import { ExpressAuth } from "@auth/express";
import cors from "cors";
import express from "express";

import { appUriProject, appUriProjects } from "@/env.js";

import { authConfig, authSession } from "./auth.js";
import contentGet from "./endpoints/contentGet.js";
import projectDelete from "./endpoints/projectDelete.js";
import projectGet from "./endpoints/projectGet.js";
import projectPost from "./endpoints/projectPost.js";
import projectPut from "./endpoints/projectPut.js";
import projectsDeleteAll from "./endpoints/projectsDeleteAll.js";
import { redisPublisher } from "./redis.js";

const port = process.env.UPLOAD_SERVICE_PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

// @auth.js https://authjs.dev/getting-started/installation
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth(authConfig));
app.use(authSession);

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
