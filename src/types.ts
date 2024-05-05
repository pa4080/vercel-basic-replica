import { ObjectId } from "mongodb";

export interface ProjectApiResponse {
	data: ProjectData | ProjectData[] | null | number;
	statusMessage: string;
	statusCode: number;
	ok: boolean;
}

const Framework = ["react", "astro", "html"] as const;
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
	| "error"
	| "clone error"
	| "upload error"
	| "build upload error"
	| "build error";

export interface ProjectDocument {
	_id: ObjectId;
	status: ProjectStatus;
	projectName: string;
	repoUrl: string;
	targetBranch: string;
	framework: FrameworkType;
	buildOutDir: string;
	date: Date;
	creator: ObjectId | string | User;
}

export interface ProjectDocumentPopulated extends Omit<ProjectDocument, "creator"> {
	creator: User;
}

export interface User {
	_id: string;
	email: string;
	emailVerified?: boolean | null;
	name: string;
	image: string;
	isAdmin?: boolean;
}

export interface ProjectData extends Omit<ProjectDocument, "_id" | "creator"> {
	_id: string;
	deployUrl: string;
	creator: User;
}

export interface SessionUser extends Omit<User, "_id"> {
	id: string;
}

export interface UserSessionData {
	user: SessionUser;
	expires: string;
}
