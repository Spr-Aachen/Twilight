// Project data configuration file
// Used to manage data for the project display page
const projectModules = import.meta.glob('./projects/*.json', { eager: true });

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "library" | "ai" | "software" | "website" | "game";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	demoUrl?: string;
	sourceUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
}

export const projectsData: Project[] = Object.entries(projectModules).map(([path, mod]: [string, any]) => {
  const id = path.split('/').pop()?.replace('.json', '') || '';
  const data = mod.default as any;
  const project: Project = {
    id,
    ...data,
    demoUrl: data.demoUrl ?? data.liveDemo,
    sourceUrl: data.sourceUrl ?? data.sourceCode,
  };
  return project;
});

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter((p) => p.status === "completed").length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => techSet.add(tech));
	});
	return Array.from(techSet).sort();
};
