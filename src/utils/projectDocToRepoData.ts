import { appBaseDomain, appDeploySubdomainPrefix } from "@/env";
import { ProjectData, ProjectDocument } from "@/types";

export function projectDocumentToData(projectDoc: ProjectDocument): ProjectData {
	const _id = projectDoc._id.toString();

	return {
		...projectDoc,
		_id,
		deployUrl: `https://${appDeploySubdomainPrefix}-${_id}.${appBaseDomain}`,
	};
}
