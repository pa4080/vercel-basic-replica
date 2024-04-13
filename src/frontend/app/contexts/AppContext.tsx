import { appBaseURL, appUriProject } from "@/env";
import { ProjectData } from "@project/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ContextProps {
	apiUrl: string;
	projects: ProjectData[] | undefined;
	setProjects: React.Dispatch<React.SetStateAction<ProjectData[]>>;
	deleteProject: (id: string) => Promise<void>;
}

const AppContext = createContext<ContextProps>({} as ContextProps);

interface ContextProviderProps {
	children: React.ReactNode;
}

export const AppContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
	const apiUrl = `${appBaseURL}/${appUriProject}`;
	const [projects, setProjects] = useState<ProjectData[]>([]);

	const deleteProject = async (id: string) => {
		fetch(`${apiUrl}/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Accept-Encoding": "gzip, deflate, br",
				Accept: "*/*",
				Connection: "keep-alive",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.ok) {
					setProjects(projects?.filter((project) => project._id !== id));
				}
			});
	};

	useEffect(() => {
		fetch(apiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept-Encoding": "gzip, deflate, br",
				Accept: "*/*",
				Connection: "keep-alive",
			},
		})
			.then((res) => res.json())
			.then((data) => setProjects(data.data));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// eslint-disable-next-line no-console
		console.log(projects);
	}, [projects]);

	return (
		<AppContext.Provider
			value={{
				apiUrl,
				projects,
				setProjects,
				deleteProject,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => useContext(AppContext);
