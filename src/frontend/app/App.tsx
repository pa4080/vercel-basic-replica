import { File, Package2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { ProjectData } from "@project/types";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProjectDialog from "./components/ProjectDialog";
import ProjectTab from "./components/ProjectTab";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import { appBaseURL, appUriProject } from "./env";

export default function App() {
	const [projects, setProjects] = useState<ProjectData[]>([]);
	const apiUrl = `${appBaseURL}/${appUriProject}`;

	const deleteProject = async (id: string) => {
		fetch(`${apiUrl}/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Accept-Encoding": "gzip, deflate, br",
				Accept: "*/*",
				Connection: "keep-alive",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.ok) {
					setProjects(projects?.filter((project) => project._id !== id));
				}
			});
	};

	useEffect(() => {
		fetch(apiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept-Encoding": "gzip, deflate, br",
				Accept: "*/*",
				Connection: "keep-alive",
			},
		})
			.then((res) => res.json())
			.then((data) => setProjects(data.data));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// eslint-disable-next-line no-console
		console.log(projects);
	}, [projects]);

	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
				<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
					<TooltipProvider>
						<Tooltip>
							<ProjectDialog apiUrl={apiUrl} setProjects={setProjects}>
								<TooltipTrigger asChild>
									<div className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base cursor-pointer">
										<Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
									</div>
								</TooltipTrigger>
							</ProjectDialog>
							<TooltipContent side="right">
								<p className="opacity-1 bg-white">Add a project</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</nav>
			</aside>
			<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
				<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
					<Tabs defaultValue="all">
						<div className="flex items-center">
							<TabsList>
								<TabsTrigger value="all">All</TabsTrigger>
								<TabsTrigger value="react">React</TabsTrigger>
								<TabsTrigger value="astro">Astro</TabsTrigger>
							</TabsList>
							<div className="ml-auto flex items-center gap-2">
								<Button className="h-8 gap-1" size="sm" variant="outline">
									<File className="h-3.5 w-3.5" />
									<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
								</Button>
								<ProjectDialog apiUrl={apiUrl} setProjects={setProjects}>
									<Button asChild size="sm">
										<div className="h-8 gap-1 cursor-pointer">
											<PlusCircle className="h-3.5 w-3.5" />
											<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
												Add a project
											</span>
										</div>
									</Button>
								</ProjectDialog>
							</div>
						</div>
						<ProjectTab deleteProject={deleteProject} framework="all" projects={projects} />
						<ProjectTab deleteProject={deleteProject} framework="react" projects={projects} />
						<ProjectTab deleteProject={deleteProject} framework="astro" projects={projects} />
					</Tabs>
				</main>
			</div>
		</div>
	);
}
