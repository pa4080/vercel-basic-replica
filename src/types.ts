import { ObjectId } from "mongodb";

export interface RepoUploadResponse {
	id?: string | null;
	message?: string;
	statusMessage: string;
	statusCode: number;
	url: string;
}

export interface RepoDocument {
	_id?: ObjectId | undefined;
	status:
		| "identifying"
		| "cloning"
		| "uploading"
		| "uploaded"
		| "building"
		| "built" // not used
		| "deploying" // not used
		| "deployed"
		| "error";
	projectName: string;
	repoUrl: string;
	targetBranch: string;
	framework: string;
	date: Date;
}
