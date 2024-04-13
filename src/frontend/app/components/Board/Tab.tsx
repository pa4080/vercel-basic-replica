import { FrameworkTypeAll, ProjectData } from "@project/types";

import { useState } from "react";

import { Table } from "@/components/ui/table";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

import ProjectList from "./TabTableContent_ProjectList";
import TabTableHeader from "./TabTableHeader";

interface Props {
	className?: string;
	projects: ProjectData[] | undefined;
	framework: FrameworkTypeAll;
}

const Tab: React.FC<Props> = ({ projects, className, framework }) => {
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
						<TabTableHeader orderDirection={orderDirection} setOrderDirection={setOrderDirection} />

						<ProjectList
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

export default Tab;
