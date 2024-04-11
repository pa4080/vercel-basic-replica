import { FrameworkTypeAll, ProjectData } from "@project/types";

import { Calendar } from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

import ProjectList from "./ProjectList";

interface Props {
	className?: string;
	projects: ProjectData[] | undefined;
	deleteProject: (id: string) => void;
	framework: FrameworkTypeAll;
}

const ProjectTab: React.FC<Props> = ({ projects, deleteProject, className, framework }) => {
	const [orderDirection, setOrderDirection] = useState<boolean>(true);

	return (
		<TabsContent className={className} value={framework}>
			<Card x-chunk="dashboard-06-chunk-0">
				<CardHeader>
					<CardTitle>Projects</CardTitle>
					<CardDescription>{`View ${framework === "all" ? "all your projects" : `all of your ${framework} projects`} and their deployment status.`}</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="hidden w-[100px] sm:table-cell">
									<span className="sr-only">Image</span>
								</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="hidden md:table-cell">Repo</TableHead>
								<TableHead className="hidden md:table-cell">URL</TableHead>

								<TableHead className="flex flex-row items-center justify-start">
									<Button
										className="h-8 gap-1"
										size="sm"
										variant="outline"
										onClick={() => setOrderDirection(!orderDirection)}
									>
										<Calendar className="h-3.5 w-3.5" />
										<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
											{orderDirection ? <>New {">"} Old</> : <>Old {">"} New</>}
										</span>
									</Button>

									<span className="sr-only">Actions</span>
								</TableHead>
							</TableRow>
						</TableHeader>
						<ProjectList
							deleteProject={deleteProject}
							orderDirection={orderDirection}
							projects={projects?.filter(
								(project) => framework === "all" || project.framework === framework
							)}
						/>
					</Table>
				</CardContent>
				<CardFooter>
					<div className="text-xs text-muted-foreground">Project homepage: www...</div>
				</CardFooter>
			</Card>
			{/*  */}
		</TabsContent>
	);
};

export default ProjectTab;
