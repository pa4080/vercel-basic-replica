import { Package2 } from "lucide-react";
import React from "react";
import { FaGithub } from "react-icons/fa";
// import { signIn } from "next-auth/react";

import { cn } from "@/lib/cn-utils";

import ProjectDialog from "@/components/ProjectDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppContext } from "@/contexts/AppContext.tsx";
import { SinIn, SinOut } from "@/lib/authUtils.ts";

interface Props {
	className?: string;
}

const SideNav: React.FC<Props> = ({ className }) => {
	const { session, setUserSession } = useAppContext();

	return (
		<nav className={cn("flex flex-col items-center gap-4 px-2 sm:py-5", className)}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger
						asChild
						onClick={async () => {
							if (session) {
								await SinOut();
								await setUserSession();
							} else {
								await SinIn();
								await setUserSession();
							}
						}}
					>
						<div
							className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base cursor-pointer ${
								session
									? "bg-primary text-primary-foreground"
									: "bg-primary-foreground text-primary"
							}`}
						>
							<FaGithub
								className={`transition-all group-hover:scale-110 duration-150 ${session ? "h-7 w-7 md:h-6 md:w-6" : "h-9 w-9 md:h-8 md:w-8 "}`}
							/>
						</div>
					</TooltipTrigger>
					<TooltipContent side="right">
						<p className="opacity-1 bg-primary-foreground">
							{session ? "Sign out" : "Sign in with GitHub"}
						</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<ProjectDialog>
						<TooltipTrigger asChild>
							<div className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base cursor-pointer">
								<Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
							</div>
						</TooltipTrigger>
					</ProjectDialog>
					<TooltipContent side="right">
						<p className="opacity-1 bg-white">Add a project</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</nav>
	);
};

export default SideNav;
