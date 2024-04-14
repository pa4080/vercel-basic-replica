import { ProjectData, UserSessionData } from "@project/types";
import React, { createContext, useContext, useEffect, useState } from "react";

import { ProjectSchemaType } from "@/components/ProjectDialog/Form";
import { appBaseURL, appUriProject, appUriProjects } from "@/env-frontend";
import { GetSession } from "@/lib/authUtils.ts";

const headers = {
	"Content-Type": "application/json",
	"Accept-Encoding": "gzip, deflate, br",
	Accept: "*/*",
	Connection: "keep-alive",
};

interface ContextProps {
	apiUrl: string;
	projects: ProjectData[] | undefined;
	setProjects: React.Dispatch<React.SetStateAction<ProjectData[]>>;
	deleteProject: (id: string) => void;
	deleteAllProjects: () => void;
	createProject: (data: ProjectSchemaType) => Promise<boolean | null>;
	updateProject: (id: string, data: ProjectSchemaType) => Promise<boolean | null>;
	session: UserSessionData | null;
	setUserSession: () => Promise<void>;
}

const AppContext = createContext<ContextProps>({} as ContextProps);

interface ContextProviderProps {
	children: React.ReactNode;
}

export const AppContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
	const apiUrl = `${appBaseURL}/${appUriProject}`;
	const [projects, setProjects] = useState<ProjectData[]>([]);
	const [session, setSession] = useState<UserSessionData | null>(null);

	const createProject = async (data: ProjectSchemaType) => {
		try {
			const res = await fetch(apiUrl, {
				method: "POST",
				body: JSON.stringify(data),
				headers,
			});

			if (res.ok) {
				const { data: project } = await res.json();

				setProjects((prev) => [...prev.filter((p) => p._id !== project._id), project]);
			}

			return res.ok;
		} catch (error) {
			console.error(error);

			return null;
		}
	};

	const updateProject = async (id: string, data: ProjectSchemaType) => {
		try {
			const res = await fetch(`${apiUrl}/${id}`, {
				method: "PUT",
				body: JSON.stringify(data),
				headers,
			});

			if (res.ok) {
				const { data: project } = await res.json();

				setProjects((prev) => [...prev.filter((p) => p._id !== project._id), project]);
			}

			return res.ok;
		} catch (error) {
			console.error(error);

			return null;
		}
	};

	const deleteProject = async (id: string) => {
		await fetch(`${apiUrl}/${id}`, { method: "DELETE", headers }).then((res) => {
			if (res.ok) {
				setProjects(projects?.filter((project) => project._id !== id));
			}
		});
	};

	const deleteAllProjects = async () => {
		await fetch(`${appBaseURL}/${appUriProjects}`, { method: "DELETE", headers }).then((res) => {
			if (res.ok) {
				setProjects([]);
			}
		});
	};

	const getAllProjects = async () => {
		try {
			const res = await fetch(apiUrl, { method: "GET", headers });
			const projects = await res.json();

			return projects.data;
		} catch (error) {
			console.error(error);
		}
	};

	const setProjectsData = async () => setProjects(await getAllProjects());
	const setUserSession = async () => setSession(await GetSession());

	useEffect(() => {
		setProjectsData();
		setInterval(setProjectsData, 1000 * 5);

		setUserSession();

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
				createProject,
				updateProject,
				session,
				setUserSession,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => useContext(AppContext);
