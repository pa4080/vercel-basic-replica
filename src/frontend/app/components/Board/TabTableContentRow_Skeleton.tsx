import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";

import { Skeleton } from "../ui/skeleton";

interface Props {
	className?: string;
}

const ProjectRowSkeleton: React.FC<Props> = ({ className }) => {
	return (
		<TableRow className={className}>
			<TableCell className="hidden sm:table-cell">
				<div className="min-w-16 w-16">
					<img
						alt="Product image"
						className="aspect-square rounded-md object-cover"
						height="64"
						src="/image-placeholder.webp"
						width="64"
					/>
				</div>
			</TableCell>
			<TableCell className="w-auto">
				<Skeleton className="h-6" />
			</TableCell>
			<TableCell className="w-16">
				<Badge variant="outline">
					<Skeleton className="w-12 h-4" />
				</Badge>
			</TableCell>
			<TableCell className="hidden lg:table-cell">
				<Skeleton className="h-6" />
			</TableCell>
			<TableCell className="hidden md:table-cell">
				<Skeleton className="h-6" />
			</TableCell>
			<TableCell>
				{/* <div className="text-right">
					<Ellipsis className="h-4 w-4" />
				</div> */}
			</TableCell>
		</TableRow>
	);
};

export default ProjectRowSkeleton;
