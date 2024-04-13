import React from "react";

import { PlusCircle } from "lucide-react";

import { cn } from "@/lib/cn-utils";

import { useAppContext } from "@/contexts/AppContext";

import DeleteConfirm from "../DeleteConfirm";
import ProjectAddDialog from "../ProjectAdd";
import { Button } from "../ui/button";

interface Props {
	className?: string;
}

const TopActions: React.FC<Props> = ({ className }) => {
	const { deleteAllProjects } = useAppContext();

	return (
		<div className={cn("ml-auto flex items-center gap-2", className)}>
			<DeleteConfirm
				actionCallback={deleteAllProjects}
				keyword="Delete All Pr0j3ct$"
				messages={{
					defaultButtonText: "Delete all",
					title: "Delete all projects",
					description: "Are you sure you want to delete all projects? Then enter:",
					errorMsg: "Invalid keyword",
					inputDescription: "This action is irreversible!",
				}}
			/>

			<ProjectAddDialog>
				<Button asChild size="sm">
					<div className="h-8 gap-1 cursor-pointer">
						<PlusCircle className="h-3.5 w-3.5" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add a project</span>
					</div>
				</Button>
			</ProjectAddDialog>
		</div>
	);
};

export default TopActions;
