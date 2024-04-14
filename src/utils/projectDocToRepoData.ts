import { ObjectId } from "mongodb";

import { appBaseDomain, appDeploySubdomainPrefix } from "@/env.js";
import { ProjectData, ProjectDocument } from "@/types.js";

export function projectDocumentToData(projectDoc: ProjectDocument): ProjectData {
	const _id = projectDoc._id.toString();
	const creator =
		projectDoc.creator instanceof ObjectId ? projectDoc.creator.toString() : projectDoc.creator;

	return {
		...projectDoc,
		_id,
		creator,
		deployUrl: `https://${appDeploySubdomainPrefix}-${_id}.${appBaseDomain}`,
	};
}
