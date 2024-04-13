import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAppContext } from "@/contexts/AppContext";

import Tab from "./Tab";
import TopActions from "./TopActions";

interface Props {
	className?: string;
}
const Board: React.FC<Props> = ({ className }) => {
	const { projects } = useAppContext();

	return (
		<Tabs className={className} defaultValue="all">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="react">React</TabsTrigger>
					<TabsTrigger value="astro">Astro</TabsTrigger>
				</TabsList>

				<TopActions />
			</div>

			<Tab framework="all" projects={projects} />
			<Tab framework="react" projects={projects} />
			<Tab framework="astro" projects={projects} />
		</Tabs>
	);
};

export default Board;
