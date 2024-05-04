import { ObjectId } from "mongodb";

import { appBaseDomain, appDeploySubdomainPrefix, appSubdomain, isProd } from "@/env.js";
import { ProjectData, ProjectDocument } from "@/types.js";

export function projectDocumentToData(projectDoc: ProjectDocument): ProjectData {
	const _id = projectDoc._id.toString();
	const creator =
		projectDoc.creator instanceof ObjectId ? projectDoc.creator.toString() : projectDoc.creator;

	return {
		...projectDoc,
		_id,
		creator,
		deployUrl: isProd
			? `https://${appDeploySubdomainPrefix}-${_id}.${appSubdomain}.${appBaseDomain}`
			: `https://${appDeploySubdomainPrefix}-${_id}.${appBaseDomain}`,
	};
}
