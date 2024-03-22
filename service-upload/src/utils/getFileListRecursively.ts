import fs from "fs";

interface GetFileListParams {
	dir: string;
	ignoreList?: string[];
}
export function getFileList({ dir, ignoreList = [] }: GetFileListParams): string[] {
	const files = [];
	const list = fs.readdirSync(dir, { withFileTypes: true });

	for (const file of list) {
		if (ignoreList.includes(file.name)) {
			continue;
		}

		if (file.isDirectory()) {
			files.push(...getFileList({ dir: `${dir}/${file.name}`, ignoreList }));
		} else {
			files.push(`${dir}/${file.name}`);
		}
	}

	return files;
}
