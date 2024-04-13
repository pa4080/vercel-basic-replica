import { ProjectData } from "@project/types";
import React, { createContext, useContext, useEffect, useState } from "react";

import { appBaseURL, appUriProject, appUriProjects } from "@/env-frontend";

interface ContextProps {
	apiUrl: string;
	projects: ProjectData[] | undefined;
	setProjects: React.Dispatch<React.SetStateAction<ProjectData[]>>;
	deleteProject: (id: string) => void;
	deleteAllProjects: () => void;
}

const AppContext = createContext<ContextProps>({} as ContextProps);

interface ContextProviderProps {
	children: React.ReactNode;
}

export const AppContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
	const apiUrl = `${appBaseURL}/${appUriProject}`;
	const [projects, setProjects] = useState<ProjectData[]>([]);

	const deleteProject = (id: string) => {
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

	const deleteAllProjects = () => {
		fetch(`${appBaseURL}/${appUriProjects}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Accept-Encoding": "gzip, deflate, br",
				Accept: "*/*",
				Connection: "keep-alive",
			},
		}).then((res) => {
			if (res.ok) {
				setProjects([]);
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
				deleteAllProjects,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => useContext(AppContext);
