import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import React from "react";

import { appBaseDomain, appDeployUri, appSubdomain } from "@/env";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

export const ProjectAddSchema = z.object({
	repoUrl: z.string().url(),
	projectName: z.string(),
	framework: z.union([z.literal("react"), z.literal("astro")]),
	targetBranch: z.string(),
});

export type ProjectAddSchema = z.infer<typeof ProjectAddSchema>;

const ProjectAdd: React.FC = () => {
	const form = useForm<ProjectAddSchema>({
		resolver: zodResolver(ProjectAddSchema),
		defaultValues: {
			repoUrl: "",
			projectName: "",
			framework: "react",
			targetBranch: "default",
		},
	});

	const onSubmit = async (data: ProjectAddSchema) => {
		console.log(data);

		const URL = `https://${appSubdomain}.${appBaseDomain}/${appDeployUri}`;
		console.log(URL);
		console.log("https://vercel-basic-replica.metalevel.cloud/deploy");
		console.log(`/${appDeployUri}`);

		const res = await fetch(URL, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				"Accept-Encoding": "gzip, deflate, br",
				Accept: "*/*",
				Connection: "keep-alive",
			},
		});

		console.log(res);
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
				<Card className="w-[350px]">
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
							name="framework"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Framework</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
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
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button variant="outline">Cancel</Button>
						<Button type="submit">Deploy</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
};

export default ProjectAdd;
