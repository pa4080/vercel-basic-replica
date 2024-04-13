import { FrameworkTypeAll } from "@project/types";

import { useState } from "react";

import { Table, TableBody } from "@/components/ui/table";
import { appProjectHome } from "@/env-frontend";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

import { useAppContext } from "@/contexts/AppContext";

import { UrlToAnchor } from "../atoms/UrlToAnchor";
import ProjectRowSkeleton from "./TabTableContentRow_Skeleton";
import ProjectList from "./TabTableContent_ProjectList";
import TabTableHeader from "./TabTableHeader";

interface Props {
	className?: string;
	framework: FrameworkTypeAll;
}

const Tab: React.FC<Props> = ({ className, framework }) => {
	const { projects } = useAppContext();
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

						{projects && projects.length > 0 ? (
							<ProjectList
								orderDirection={orderDirection}
								projects={projects?.filter(
									(project) => framework === "all" || project.framework === framework
								)}
							/>
						) : (
							<TableBody className={className}>
								{Array.from({ length: 5 }).map((_, i) => (
									<ProjectRowSkeleton key={i} />
								))}
							</TableBody>
						)}
					</Table>
				</CardContent>
				<CardFooter>
					<div className="text-xs text-muted-foreground">
						Project homepage: <UrlToAnchor label={appProjectHome} url={appProjectHome} />
					</div>
				</CardFooter>
			</Card>
		</TabsContent>
	);
};

export default Tab;
