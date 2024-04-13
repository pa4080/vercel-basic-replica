import React from "react";

import { ProjectData } from "@project/types";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import ProjectForm from "./Form";

interface Props {
	children: React.ReactNode;
	apiUrl: string;
	setProjects: React.Dispatch<React.SetStateAction<ProjectData[]>>;
}

const ProjectDialog: React.FC<Props> = ({ children, apiUrl, setProjects }) => {
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				className="sm:max-w-[380px] w-full max-w-full sm:max-h-fit max-sm:h-full p-0"
				closeOnOverlayClick={false}
			>
				<ProjectForm
					apiUrl={apiUrl}
					className="bg-transparent border-0 shadow-none -mb-2"
					dialogClose={() => setIsDialogOpen(false)}
					setProjects={setProjects}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default ProjectDialog;
