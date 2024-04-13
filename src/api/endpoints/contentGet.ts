import express from "express";

import { appDeploySubdomainPrefix, appSubdomain, baseDir, uploadDirR2Build } from "@/env";
import { getObject } from "@/utils/aws";
import { getCachedRepo } from "@/utils/cacheUtils";

import path from "path";

/**
 * Serve React app (our frontend) or deployed projects
 */
export default async function contentGet(req: express.Request, res: express.Response) {
	const host = req.hostname;
	const subDomain = host.split(".")[0];
	const uri = req.path;

	/**
	 * Serve React app (our frontend)
	 */
	if (subDomain.match(`${appSubdomain}`)) {
		const docRoot = path.join(baseDir, "frontend");
		const filePath = uri === "/" ? "index.html" : uri.slice(1);

		return res.sendFile(filePath, { root: docRoot });
	}

	/**
	 * Serve deployed projects
	 */
	if (subDomain.match(new RegExp(`^${appDeploySubdomainPrefix}`))) {
		const repoId = subDomain.split("-")[1];

		const filePath = uri === "/" ? "index.html" : uri.slice(1);

		/**
		 * Check if the repo exists
		 */
		const repoExists = await getCachedRepo(repoId);

		if (!repoExists) {
			return res.status(404).json({ message: `Something went wrong, id: ${repoId}`, ok: false });
		}

		let attempts = 0;

		// Provide the requested file if it exists or redirect to index.html
		return (async function returnObject(filePath: string) {
			const responseObject = await getObject({
				objectKey: `${uploadDirR2Build}/${repoId}/${filePath}`,
			});

			if (!responseObject || !responseObject.Body) {
				if (attempts < 3) {
					attempts++;

					return returnObject("index.html");
				} else {
					return res
						.status(404)
						.json({ message: `Something went wrong, id: ${repoId}`, ok: false });
				}
			}

			res.set("Content-Type", responseObject.ContentType);

			if (responseObject.ContentType?.match(/(image|font|video|audio|media)/)) {
				// res.set("Cache-Control", "public, max-age=31536000");
				res.set("Cache-Control", "public, max-age=1");

				return res.write(await responseObject.Body?.transformToByteArray(), "utf8");
			}

			// The following cause troubles wit binary files:
			return res.send(await responseObject.Body?.transformToString("utf8"));
			// res.end();
		})(filePath);
	}

	/**
	 * Not handled request
	 */
	return res.redirect(307, process.env.NOT_HANDLED_REQ_REDIRECT_URL);
}
