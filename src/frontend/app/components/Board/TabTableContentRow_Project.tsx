import { MoreHorizontal } from "lucide-react";

import { ProjectData } from "@project/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";

import { useAppContext } from "@/contexts/AppContext";

import { UrlToAnchor } from "../atoms/UrlToAnchor";
import DeleteConfirm from "../DeleteConfirm";
import ProjectDialog from "../ProjectDialog";

interface Props {
	className?: string;
	project: ProjectData;
}

const ProjectRow: React.FC<Props> = ({ className, project }) => {
	const { _id, projectName, status, repoUrl, deployUrl } = project;
	const { deleteProject, session } = useAppContext();

	const dropdownMenuItemClassName =
		"w-full relative flex cursor-default select-none items-center rounded-sm px-4 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-slate-100 disabled:hover:bg-transparent disabled:opacity-50";

	return (
		<TableRow key={_id} className={className}>
			<TableCell className="hidden md:table-cell">
				<div className="min-w-16 w-16">
					<img
						alt="Product image"
						className="aspect-square rounded-md object-cover"
						height="64"
						src="/image-placeholder.webp"
						width="64"
					/>
				</div>
			</TableCell>
			<TableCell className="font-medium">{projectName}</TableCell>
			<TableCell>
				<Badge
					className={`${status !== "deployed" ? "animate-pulse" : "border-blue-400 hover:bg-blue-200 cursor-pointer"} w-28 justify-center`}
					variant="outline"
				>
					{status === "deployed" ? (
						<UrlToAnchor
							className="text-blue-500 hover:no-underline line-clamp-1"
							label={status}
							url={deployUrl}
						/>
					) : (
						status
					)}
				</Badge>
			</TableCell>
			<TableCell className="hidden md:table-cell">
				<UrlToAnchor
					className="text-blue-500 line-clamp-1"
					label={deployUrl.replace(new RegExp(_id), "..")}
					url={deployUrl}
				/>
			</TableCell>
			<TableCell className="hidden lg:table-cell">
				<UrlToAnchor className="text-purple-500 line-clamp-1" label={repoUrl} url={repoUrl} />
			</TableCell>

			<TableCell className="text-right">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button aria-haspopup="true" size="icon" variant="ghost">
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-fit min-w-fit py-1 px-1">
						<DropdownMenuLabel className="px-4">Actions</DropdownMenuLabel>

						<ProjectDialog project={project}>
							<div className={dropdownMenuItemClassName}>Edit</div>
						</ProjectDialog>

						<DeleteConfirm
							actionCallback={deleteProject}
							disabled={
								(session?.user?.id !== project?.creator && !session?.user?.isAdmin) || undefined
							}
							keyword={_id}
							messages={{
								title: "Delete all projects",
								description: "Are you sure you want to delete all projects? Then enter:",
								errorMsg: "Invalid keyword",
								inputDescription: "This action is irreversible!",
							}}
						>
							<button className={dropdownMenuItemClassName}>Delete</button>
						</DeleteConfirm>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
};

export default ProjectRow;
