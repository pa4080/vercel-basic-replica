import { ProjectData } from "@project/types";

import { TableBody } from "@/components/ui/table";

import ProjectRow from "./TabTableContentRow_Project";
import ProjectRowSkeleton from "./TabTableContentRow_Skeleton";

interface Props {
	className?: string;
	projects: ProjectData[] | undefined;
	orderDirection: boolean;
}

const ProjectList: React.FC<Props> = ({ projects, orderDirection, className }) => {
	return (
		<TableBody className={className}>
			{projects
				? projects
						.sort((a, b) =>
							orderDirection
								? new Date(b.date).getTime() - new Date(a.date).getTime()
								: new Date(a.date).getTime() - new Date(b.date).getTime()
						)
						.map((project) => <ProjectRow key={project._id} project={project} />)
				: Array.from({ length: 5 }).map((_, i) => <ProjectRowSkeleton key={i} />)}
		</TableBody>
	);
};

export default ProjectList;
