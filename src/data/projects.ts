// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "ai" | "software" | "website" | "game";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
}

export const projectsData: Project[] = [
	{
		id: "blog-mizuki",
		title: "Mizuki Blog Template",
		description:
			"Modern blog theme developed based on the Astro framework, supporting multilingual, dark mode, and responsive design features.",
		image: "",
		category: "website",
		techStack: ["Astro", "Svelte", "Tailwind CSS"],
		status: "in-progress",
		liveDemo: "https://blog.example.com",
		sourceCode: "https://github.com/example/mizuki",
		startDate: "2025-10-04",
		endDate: "",
		featured: false,
		tags: ["Contribution", "Open Source Project", "Blog"],
	},
	{
		id: "unreal-menu-system",
		title: "Unreal Multiplayer Menu System Plugin",
		description:
			"A multiplayer plugin with menu system for Unreal Engine 5.",
		image: "",
		category: "game",
		techStack: ["Unreal Engine", "Blender"],
		status: "in-progress",
		liveDemo: "https://github.com/Spr-Aachen/Unreal-MenuSystem-Demo",
		sourceCode: "https://github.com/Spr-Aachen/Unreal-MenuSystem",
		startDate: "2025-06-28",
		endDate: "",
		featured: false,
		tags: ["Personal Project", "Open Source Project", "Game"],
	},
	{
		id: "comfyui-controlnet-aux",
		title: "Comfyui Controlnet Aux",
		description:
			"ComfyUI's ControlNet Auxiliary Preprocessors.",
		image: "",
		category: "ai",
		techStack: ["PyTorch"],
		status: "in-progress",
		sourceCode: "https://github.com/Fannovel16/comfyui_controlnet_aux",
		startDate: "2025-02-15",
		endDate: "",
		featured: false,
		tags: ["Contribution", "Open Source Project", "AI"],
	},
	{
		id: "android-screen-defects-detector",
		title: "Android Screen Defects Detector",
		description:
			"A model to detect the screen defects of Android devices using local-contrast-measure.",
		image: "",
		category: "ai",
		techStack: ["PyTorch"],
		status: "completed",
		sourceCode: "https://huggingface.co/datasets/SprAachen/Android-Screen-Defects",
		startDate: "2024-10-20",
		endDate: "2025-01-04",
		featured: false,
		tags: ["Personal Project", "Open Source Project", "AI"],
	},
	{
		id: "AOAI Realtime Audio SDK",
		title: "AOAI Realtime Audio SDK",
		description:
			"A Microsoft project aimed at providing real-time Azure OpenAI GPT-4o Audio services.",
		image: "",
		category: "ai",
		techStack: [".Net"],
		status: "in-progress",
		sourceCode: "https://github.com/Azure-Samples/aoai-realtime-audio-sdk",
		startDate: "2024-10-17",
		endDate: "",
		featured: false,
		tags: ["Contribution", "Open Source Project", "AI"],
	},
	{
		id: "llm-prompt-master",
		title: "LLM PromptMaster",
		description:
			"A desktop application for prompt self-iteration based on multi-agent interaction.",
		image: "",
		category: "software",
		techStack: ["FastAPI", "PySide"],
		status: "completed",
		sourceCode: "https://github.com/Spr-Aachen/LLM-PromptMaster",
		startDate: "2024-07-04",
		endDate: "2025-08-31",
		featured: false,
		tags: ["Personal Project", "Open Source Project", "AI"],
	},
];

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
