import { Toaster } from "@/components/ui/sonner";

import Board from "./components/Board";
import SideNav from "./components/Sideabar";
import { AppContextProvider } from "./contexts/AppContext";

export default function App() {
	return (
		<AppContextProvider>
			<div className="flex min-h-screen w-full flex-col bg-muted/40">
				<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
					<SideNav />
				</aside>
				<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
					<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
						<Board />
					</main>
				</div>
			</div>
			<Toaster />
		</AppContextProvider>
	);
}
