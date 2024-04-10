import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { appBaseURL, appUriProject } from "@/env";

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

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

export const ProjectAddSchema = z.object({
	repoUrl: z.string().url(),
	projectName: z.string(),
	framework: z.union([z.literal("react"), z.literal("astro")]),
	targetBranch: z.string(),
	outDir: z.string(),
});

export type ProjectAddSchema = z.infer<typeof ProjectAddSchema>;

interface Props {
	className?: string;
	closeCb: () => void;
}

const ProjectAdd: React.FC<Props> = ({ className, closeCb }) => {
	const form = useForm<ProjectAddSchema>({
		resolver: zodResolver(ProjectAddSchema),
		defaultValues: {
			repoUrl: "",
			projectName: "",
			framework: "react",
			targetBranch: "default",
			outDir: "default",
		},
	});

	const onSubmit = async (data: ProjectAddSchema) => {
		const URL = `${appBaseURL}/${appUriProject}`;

		const response = await fetch(URL, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				"Accept-Encoding": "gzip, deflate, br",
				Accept: "*/*",
				Connection: "keep-alive",
			},
		});

		// eslint-disable-next-line no-console
		console.log(response);

		closeCb && closeCb();
	};

	// Auto generate slug on the base of the title, if it is not set
	const autoGeneratePrjName = () => {
		if (
			form.getValues("repoUrl") &&
			(!form.getValues("projectName") || form.getValues("projectName") === "")
		) {
			form.setValue("projectName", new URL(form.getValues("repoUrl")).pathname.slice(1));
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card className={cn("w-full", className)}>
					<CardHeader className="pb-3">
						<CardTitle>Create a project</CardTitle>
						<CardDescription>Deploy your new project in one-click.</CardDescription>
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
									<Select defaultValue={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a verified email to display" />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											<SelectItem value="react">React</SelectItem>
											<SelectItem value="astro">Astro</SelectItem>
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
											placeholder={`Leave it blank or use "default" for the default branch`}
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
							name="outDir"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Build output directory</FormLabel>
									<FormControl>
										<Input
											placeholder={`Leave it blank or use "default" for autodetect`}
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
								closeCb && closeCb();
							}}
						>
							Close
						</Button>
						<Button className="w-full" type="submit">
							Deploy
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
};

export default ProjectAdd;
