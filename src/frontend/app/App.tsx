import { RepoDocument } from "@project/types";
import { File, MoreHorizontal, Package2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProjectAddDialog from "./components/ProjectAddDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import { appBaseURL, appUriProject } from "./env";

export default function App() {
	const [projects, setProjects] = useState<RepoDocument>();

	useEffect(() => {
		const URL = `${appBaseURL}/${appUriProject}`;
		// const URL = `//openvscode-3001.metalevel.tech/${appUriProject}`;

		// eslint-disable-next-line no-console
		console.log(URL);

		fetch(URL, {
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
							<ProjectAddDialog>
								<TooltipTrigger asChild>
									<div className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base cursor-pointer">
										<Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
									</div>
								</TooltipTrigger>
							</ProjectAddDialog>
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
								<ProjectAddDialog>
									<Button asChild size="sm">
										<div className="h-8 gap-1 cursor-pointer">
											<PlusCircle className="h-3.5 w-3.5" />
											<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
												Add a project
											</span>
										</div>
									</Button>
								</ProjectAddDialog>
							</div>
						</div>
						<TabsContent value="all">
							<Card x-chunk="dashboard-06-chunk-0">
								<CardHeader>
									<CardTitle>Projects</CardTitle>
									<CardDescription>
										View all your projects and their deployment status.
									</CardDescription>
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

												<TableHead>
													<span className="sr-only">Actions</span>
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableCell className="hidden sm:table-cell">
													<img
														alt="Product image"
														className="aspect-square rounded-md object-cover"
														height="64"
														src="/image-placeholder.webp"
														width="64"
													/>
												</TableCell>
												<TableCell className="font-medium">Name</TableCell>
												<TableCell>
													<Badge variant="outline">STATUS</Badge>
												</TableCell>
												<TableCell className="hidden md:table-cell">Repo</TableCell>
												<TableCell className="hidden md:table-cell">URL</TableCell>
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
															<DropdownMenuItem>Delete</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
								<CardFooter>
									<div className="text-xs text-muted-foreground">Project homepage: www...</div>
								</CardFooter>
							</Card>
						</TabsContent>
					</Tabs>
				</main>
			</div>
		</div>
	);
}
