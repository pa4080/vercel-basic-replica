import React from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import ProjectAdd from "./ProjectAdd";

const ProjectAddDialog: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [open, setOpen] = React.useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				className="sm:max-w-[380px] w-full max-w-full sm:max-h-fit max-sm:h-full p-0"
				closeOnOverlayClick={false}
			>
				<ProjectAdd
					className="bg-transparent border-0 shadow-none -mb-2"
					closeCb={() => setOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default ProjectAddDialog;
