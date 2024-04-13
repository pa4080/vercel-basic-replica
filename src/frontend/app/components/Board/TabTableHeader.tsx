import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Props {
	className?: string;
	orderDirection: boolean;
	setOrderDirection: React.Dispatch<React.SetStateAction<boolean>>;
}

const TabTableHeader: React.FC<Props> = ({ className, orderDirection, setOrderDirection }) => {
	return (
		<TableHeader className={className}>
			<TableRow>
				<TableHead className="hidden w-[100px] sm:table-cell">
					<span className="sr-only">Image</span>
				</TableHead>
				<TableHead>Name</TableHead>
				<TableHead>Status</TableHead>
				<TableHead className="hidden md:table-cell">Repo</TableHead>
				<TableHead className="hidden md:table-cell">URL</TableHead>

				<TableHead className="flex flex-row items-center justify-end">
					<Button
						className="h-8 gap-1"
						size="sm"
						variant="outline"
						onClick={() => setOrderDirection(!orderDirection)}
					>
						<Calendar className="h-3.5 w-3.5" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
							{orderDirection ? <>New {">"} Old</> : <>Old {">"} New</>}
						</span>
					</Button>

					<span className="sr-only">Actions</span>
				</TableHead>
			</TableRow>
		</TableHeader>
	);
};

export default TabTableHeader;
