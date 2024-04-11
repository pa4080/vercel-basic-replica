import { cn } from "@/lib/cn-utils";

export function UrlToAnchor({ url, className }: { url: string; className?: string }) {
	return (
		<a
			className={cn("text-blue-600 underline-offset-3 hover:underline", className)}
			href={url}
			rel="noreferrer"
			target="_blank"
		>
			{url.replace(/^https?:\/\//, "")}
		</a>
	);
}
