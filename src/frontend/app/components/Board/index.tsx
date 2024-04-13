import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Tab from "./Tab";
import TopActions from "./TopActions";

interface Props {
	className?: string;
}
const Board: React.FC<Props> = ({ className }) => {
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

			<Tab framework="all" />
			<Tab framework="react" />
			<Tab framework="astro" />
		</Tabs>
	);
};

export default Board;
