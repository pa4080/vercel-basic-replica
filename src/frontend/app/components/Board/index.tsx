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
					<TabsTrigger value="html">Html</TabsTrigger>
				</TabsList>

				<TopActions />
			</div>

			<Tab framework="all" />
			<Tab framework="react" />
			<Tab framework="astro" />
			<Tab framework="html" />
		</Tabs>
	);
};

export default Board;
