import { Package2 } from "lucide-react";
import React from "react";

import { cn } from "@/lib/cn-utils";

import ProjectAddDialog from "@/components/ProjectAdd";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
	className?: string;
}

const SideNav: React.FC<Props> = ({ className }) => {
	return (
		<nav className={cn("flex flex-col items-center gap-4 px-2 sm:py-5", className)}>
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
	);
};

export default SideNav;
