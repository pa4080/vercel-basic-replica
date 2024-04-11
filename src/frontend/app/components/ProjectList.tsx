import { MoreHorizontal } from "lucide-react";

import { ProjectData } from "@project/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

import { UrlToAnchor } from "./atoms/UrlToAnchor";

interface Props {
	className?: string;
	projects: ProjectData[] | undefined;
	orderDirection: boolean;
	deleteProject: (id: string) => void;
}

const ProjectList: React.FC<Props> = ({ projects, orderDirection, deleteProject, className }) => {
	return (
		<TableBody className={className}>
			{projects
				?.sort((a, b) =>
					orderDirection
						? new Date(b.date).getTime() - new Date(a.date).getTime()
						: new Date(a.date).getTime() - new Date(b.date).getTime()
				)
				.map(({ _id, deployUrl, projectName, status, repoUrl }) => (
					<TableRow key={_id}>
						<TableCell className="hidden sm:table-cell">
							<img
								alt="Product image"
								className="aspect-square rounded-md object-cover"
								height="64"
								src="/image-placeholder.webp"
								width="64"
							/>
						</TableCell>
						<TableCell className="font-medium">{projectName}</TableCell>
						<TableCell>
							<Badge variant="outline">{status}</Badge>
						</TableCell>
						<TableCell className="hidden md:table-cell">
							<UrlToAnchor url={repoUrl} />
						</TableCell>
						<TableCell className="hidden md:table-cell">
							<UrlToAnchor className="text-purple-600" url={deployUrl} />
						</TableCell>
						<TableCell>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button aria-haspopup="true" size="icon" variant="ghost">
										<MoreHorizontal className="h-4 w-4" />
										<span className="sr-only">Toggle menu</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<DropdownMenuItem onClick={() => deleteProject(_id)}>Delete</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))}
		</TableBody>
	);
};

export default ProjectList;
