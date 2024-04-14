import { FileWarning } from "lucide-react";

import React from "react";
import { toast } from "sonner";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/contexts/AppContext.tsx";
import { cn } from "@/lib/cn-utils";

const FormSchemaGenerator = (keyword: string, errorMsg: string) =>
	z.object({
		keyword: z.literal(keyword, {
			errorMap: () => ({ message: errorMsg }),
		}),
	});

type FormSchemaType = z.infer<ReturnType<typeof FormSchemaGenerator>>;

interface Props {
	className?: string;
	keyword: string;
	actionCallback: (keyword: string) => void;
	undoCallback?: () => void;
	messages?: {
		defaultButtonText?: string | null;
		title?: string | null;
		description?: string | null;
		errorMsg?: string | null;
		inputLabel?: string | null;
		inputDescription?: string | null;
	};
	children?: React.ReactNode;
	executionDelaySeconds?: number;
	disabled?: boolean;
}

const DeleteConfirm: React.FC<Props> = ({
	className,
	keyword,
	actionCallback,
	messages = {
		defaultButtonText: "Delete all",
		title: "Delete all projects",
		description: "Are you sure you want to delete all projects? Then enter the keyword:",
		errorMsg: "Invalid keyword",
		inputLabel: "Keyword",
		inputDescription: "This action is irreversible!",
	},
	children,
	executionDelaySeconds = 5,
	disabled,
}) => {
	const { session } = useAppContext();

	const [open, setOpen] = React.useState(false);
	let actionPerform = true;

	const FormSchema = FormSchemaGenerator(keyword, "Invalid keyword");

	const form = useForm<FormSchemaType>({
		resolver: zodResolver(FormSchema),
		defaultValues: { keyword: "" },
	});

	function onSubmit(data: FormSchemaType) {
		setTimeout(() => {
			if (actionPerform) {
				actionCallback(data.keyword);
			}
		}, 1000 * executionDelaySeconds);

		toast("Event has been created", {
			description: `Execution in ${executionDelaySeconds} seconds`,
			action: {
				label: "Undo",
				onClick: () => {
					actionPerform = false;
				},
			},
		});

		form.reset();
		setOpen(false);
	}

	const onCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		form.reset();
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild disabled={disabled || !session}>
				{children ? (
					children
				) : (
					<Button className={cn("h-8 gap-1", className)} size="sm" variant="outline">
						<FileWarning className="h-3.5 w-3.5" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
							{messages.defaultButtonText}
						</span>
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<Form {...form}>
					<form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>{messages.title}</DialogTitle>
							<DialogDescription>
								{messages.description} <span className="font-bold">{keyword}</span>
							</DialogDescription>
						</DialogHeader>

						<FormField
							control={form.control}
							name="keyword"
							render={({ field }) => (
								<FormItem>
									{messages.inputLabel && <FormLabel>{messages.inputLabel}</FormLabel>}
									<FormControl>
										<Input placeholder={keyword} {...field} />
									</FormControl>
									{form.formState.errors.keyword ? (
										<FormMessage />
									) : (
										messages.inputDescription && (
											<FormDescription>{messages.inputDescription}</FormDescription>
										)
									)}
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button variant="outline" onClick={onCancel}>
								Cancel
							</Button>
							<Button className="font-bold" type="submit" variant="destructive">
								Submit
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteConfirm;
