import { appBaseDomain, appDeploySubdomainPrefix, appSubdomain, isProd } from "@/env.js";
import { ProjectData, ProjectDocumentPopulated } from "@/types.js";

export function projectDocumentToData(projectDoc: ProjectDocumentPopulated): ProjectData {
	const _id = projectDoc._id.toString();
	const creator = { ...projectDoc.creator, _id: projectDoc.creator._id.toString() };

	return {
		...projectDoc,
		_id,
		creator,
		deployUrl: isProd
			? `https://${appDeploySubdomainPrefix}-${_id}.${appSubdomain}.${appBaseDomain}`
			: `https://${appDeploySubdomainPrefix}-${_id}.${appBaseDomain}`,
	};
}
