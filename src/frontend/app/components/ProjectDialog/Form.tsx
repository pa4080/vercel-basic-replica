import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ProjectData, User } from "@project/types";
import { gitHttpsUrlRegex } from "@project/utils/urlMatch";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/cn-utils";

import { useAppContext } from "@/contexts/AppContext";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

export const ProjectSchema = z.object({
	repoUrl: z.string().url().regex(gitHttpsUrlRegex),
	projectName: z.string(),
	framework: z.union([z.literal("react"), z.literal("astro"), z.literal("html")]),
	targetBranch: z.string().min(1, { message: "Required!" }),
	buildOutDir: z.string().min(1, { message: "Required!" }),
});

export type ProjectSchemaType = z.infer<typeof ProjectSchema>;

interface Props {
	className?: string;
	dialogClose: () => void;
	project?: ProjectData;
}

const ProjectForm: React.FC<Props> = ({ className, dialogClose, project }) => {
	const { createProject, updateProject, session } = useAppContext();
	const [submitting, setSubmitting] = React.useState(false);

	const form = useForm<ProjectSchemaType>({
		resolver: zodResolver(ProjectSchema),
		defaultValues: {
			repoUrl: "",
			projectName: "",
			framework: "react",
			targetBranch: "default",
			buildOutDir: "detect",
		},
		values: project,
	});

	const creatorId = (project?.creator as User)?._id || project?.creator;
	const isSessionUserCreator = session?.user?.id === creatorId;
	const isSessionUserAdmin = session?.user?.isAdmin || false;
	const isActionDisabled = project && !isSessionUserCreator && !isSessionUserAdmin;

	const onSubmit = async (data: ProjectSchemaType) => {
		try {
			setSubmitting(true);

			if (project) {
				await updateProject(project._id, data);
				dialogClose && dialogClose();
			} else {
				await createProject(data);
				dialogClose && dialogClose();
			}
		} catch (error) {
			console.error(error);
		} finally {
			setSubmitting(false);
		}
	};

	// Auto generate slug on the base of the title, if it is not set
	const autoGeneratePrjName = () => {
		if (
			form.getValues("repoUrl") &&
			(!form.getValues("projectName") || form.getValues("projectName") === "")
		) {
			form.setValue(
				"projectName",
				new URL(form.getValues("repoUrl")).pathname.slice(1).replace(/\.git$/, "")
			);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card className={cn("w-full", className)}>
					<CardHeader className="pb-3">
						<CardTitle>{project ? "Update project" : "Create a project"}</CardTitle>
						<CardDescription>
							{project ? `Id: ${project._id}` : "Deploy your new project in one-click"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="repoUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Repo url</FormLabel>
									<FormControl>
										<Input
											placeholder="The URL address of your repository"
											{...field}
											onBlur={autoGeneratePrjName}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="projectName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Project name</FormLabel>
									<FormControl>
										<Input
											placeholder="The name of your project"
											{...field}
											onBlur={autoGeneratePrjName}
											onFocus={autoGeneratePrjName}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="framework"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Framework</FormLabel>
									<Select
										defaultValue={project?.framework ?? field.value}
										onValueChange={field.onChange}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a verified email to display" />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											<SelectItem value="react">React</SelectItem>
											<SelectItem value="astro">Astro</SelectItem>
											<SelectItem value="html">Html</SelectItem>
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="targetBranch"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Branch to deploy</FormLabel>
									<FormControl>
										<Input
											placeholder={`Use "default" for the default branch`}
											{...field}
											onBlur={autoGeneratePrjName}
											onFocus={autoGeneratePrjName}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="buildOutDir"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Build output directory</FormLabel>
									<FormControl>
										<Input
											placeholder={`Use "detect" for autodetect`}
											{...field}
											onBlur={autoGeneratePrjName}
											onFocus={autoGeneratePrjName}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>

					<CardFooter className="flex justify-between gap-5">
						<Button
							variant="outline"
							onClick={(e) => {
								e.preventDefault();
								dialogClose && dialogClose();
							}}
						>
							Close
						</Button>
						<Button
							className="w-full"
							disabled={!session || isActionDisabled || form.formState.isSubmitting || submitting}
							type="submit"
						>
							{project ? "Update and deploy project" : "Deploy project"}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
};

export default ProjectForm;
