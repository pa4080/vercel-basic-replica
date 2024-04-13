import { cn } from "@/lib/cn-utils";

export function UrlToAnchor({
	url,
	label,
	className,
}: {
	url: string;
	label: string;
	className?: string;
}) {
	return (
		<a
			className={cn("text-gray-500 underline-offset-3 hover:underline", className)}
			href={url}
			rel="noreferrer"
			target="_blank"
		>
			{label.replace(/^https?:\/\//, "")}
		</a>
	);
}
