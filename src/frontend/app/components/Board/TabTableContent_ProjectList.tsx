import { ProjectData } from "@project/types";

import { TableBody } from "@/components/ui/table";

import ProjectRow from "./TabTableContentRow_Project";

interface Props {
	className?: string;
	projects: ProjectData[] | undefined;
	orderDirection: boolean;
}

const ProjectList: React.FC<Props> = ({ projects, orderDirection, className }) => {
	return (
		<TableBody className={className}>
			{projects
				?.sort((a, b) =>
					orderDirection
						? new Date(b.date).getTime() - new Date(a.date).getTime()
						: new Date(a.date).getTime() - new Date(b.date).getTime()
				)
				.map((project) => <ProjectRow key={project._id} project={project} />)}
		</TableBody>
	);
};

export default ProjectList;
