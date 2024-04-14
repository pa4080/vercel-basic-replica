import { ObjectId } from "mongodb";

export interface ProjectApiResponse {
	data: ProjectData | ProjectData[] | null | number;
	statusMessage: string;
	statusCode: number;
	ok: boolean;
}

const Framework = ["react", "astro"] as const;
export type FrameworkType = (typeof Framework)[number];
export type FrameworkTypeAll = FrameworkType | "all";

export type ProjectStatus =
	| "identifying"
	| "cloning"
	| "uploading"
	| "uploaded"
	| "building"
	| "built" // not used yet
	| "deploying"
	| "deployed"
	| "error";

export interface ProjectDocument {
	_id: ObjectId;
	status: ProjectStatus;
	projectName: string;
	repoUrl: string;
	targetBranch: string;
	framework: FrameworkType;
	buildOutDir: string;
	date: Date;
	creator: ObjectId | string;
}

export interface ProjectData extends Omit<ProjectDocument, "_id" | "creator"> {
	_id: string;
	deployUrl: string;
	creator: ObjectId | string;
}

export interface UserSessionData {
	user: {
		name: string;
		email: string;
		image: string;
		id: string;
		isAdmin?: boolean;
	};
	expires: string;
}
