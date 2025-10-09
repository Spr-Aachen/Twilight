// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "library" | "ai" | "software" | "website" | "game";
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
		tags: ["Contribution", "Open Source Project"],
	},
	{
		id: "unreal-blaster-project",
		title: "Unreal Blaster Project",
		description:
			"A multiplayer FTPS game powered by Unreal Engine 5.",
		image: "",
		category: "game",
		techStack: ["Unreal Engine", "Blender"],
		status: "in-progress",
		liveDemo: "",
		sourceCode: "https://github.com/Spr-Aachen/Unreal-BlasterProject",
		startDate: "2025-08-15",
		endDate: "",
		featured: false,
		tags: ["Personal Project", "Open Source Project"],
	},
	{
		id: "unreal-menu-system",
		title: "Unreal Multiplayer Menu System Plugin",
		description:
			"A multiplayer plugin with menu system for Unreal Engine 5.",
		image: "",
		category: "game",
		techStack: ["Unreal Engine"],
		status: "in-progress",
		liveDemo: "https://github.com/Spr-Aachen/Unreal-MenuSystem-Demo",
		sourceCode: "https://github.com/Spr-Aachen/Unreal-MenuSystem",
		startDate: "2025-06-28",
		endDate: "",
		featured: false,
		tags: ["Personal Project", "Open Source Project"],
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
		liveDemo: "",
		sourceCode: "https://github.com/Fannovel16/comfyui_controlnet_aux",
		startDate: "2025-02-15",
		endDate: "",
		featured: false,
		tags: ["Contribution", "Open Source Project"],
	},
	{
		id: "android-screen-defects-detector",
		title: "Android Screen Defects Detector",
		description:
			"A model to detect the screen defects of Android devices using local-contrast-measure.",
		image: "",
		category: "ai",
		techStack: ["PyTorch", "TensorFlow"],
		status: "completed",
		liveDemo: "",
		sourceCode: "https://huggingface.co/datasets/SprAachen/Android-Screen-Defects",
		startDate: "2024-10-20",
		endDate: "2025-01-04",
		featured: false,
		tags: ["Contribution"],
	},
	{
		id: "aoai-realtime-audio-sdk",
		title: "AOAI Realtime Audio SDK",
		description:
			"A Microsoft project aimed at providing real-time Azure OpenAI GPT-4o Audio services.",
		image: "",
		category: "ai",
		techStack: [".Net"],
		status: "in-progress",
		liveDemo: "",
		sourceCode: "https://github.com/Azure-Samples/aoai-realtime-audio-sdk",
		startDate: "2024-10-17",
		endDate: "",
		featured: false,
		tags: ["Contribution", "Open Source Project"],
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
		liveDemo: "",
		sourceCode: "https://github.com/Spr-Aachen/LLM-PromptMaster",
		startDate: "2024-07-04",
		endDate: "2025-06-15",
		featured: false,
		tags: ["Personal Project", "Open Source Project"],
	},
	{
		id: "gpt-sovits",
		title: "GPT-SoVITS",
		description:
			"A popular TTS project on Github with powerful few-shot voice conversion.",
		image: "",
		category: "ai",
		techStack: ["PyTorch", "FastAPI", "Gradio"],
		status: "in-progress",
		liveDemo: "",
		sourceCode: "https://github.com/Spr-Aachen/GPT-SoVITS",
		startDate: "2024-06-21",
		endDate: "",
		featured: false,
		tags: ["Contribution", "Open Source Project"],
	},
	{
		id: "pyeasyutils",
		title: "PyEasyUtils",
		description:
			"A simple python util library.",
		image: "",
		category: "library",
		techStack: [],
		status: "in-progress",
		liveDemo: "",
		sourceCode: "https://github.com/Spr-Aachen/PyEasyUtils",
		startDate: "2024-12-03",
		endDate: "",
		featured: false,
		tags: ["Personal Project", "Open Source Project"],
	},
	{
		id: "qeasywidgets",
		title: "QEasyWidgets",
		description:
			"A simple Qt widget library.",
		image: "",
		category: "library",
		techStack: ["Qt", "PySide"],
		status: "in-progress",
		liveDemo: "",
		sourceCode: "https://github.com/Spr-Aachen/QEasyWidgets",
		startDate: "2024-04-01",
		endDate: "",
		featured: false,
		tags: ["Personal Project", "Open Source Project"],
	},
	{
		id: "easy-voice-toolkit",
		title: "Easy Voice Toolkit",
		description:
			"An AI voice toolkit covering VPR, ASR, TTS, and other functions.",
		image: "",
		category: "software",
		techStack: ["PyTorch", "TensorFlow", "FastAPI", "PySide", "Gradio"],
		status: "in-progress",
		liveDemo: "",
		sourceCode: "https://github.com/Spr-Aachen/Easy-Voice-Toolkit",
		startDate: "2023-02-26",
		endDate: "",
		featured: false,
		tags: ["Personal Project", "Open Source Project"],
	},
	{
		id: "genshin-to-honkai-pc-control-modification",
		title: "Genshin to Honkai PC Control Modification Project",
		description:
			"A hotkey assistant desktop application aimed at improving the control mechanisms for MiHoYo's PC games.",
		image: "",
		category: "software",
		techStack: ["OpenCV"],
		status: "completed",
		liveDemo: "",
		sourceCode: "https://github.com/Spr-Aachen/Genshin-to-Honkai-PC-Control-Modification-Project",
		startDate: "2022-11-24",
		endDate: "2023-05-27",
		featured: false,
		tags: ["Personal Project", "Open Source Project"],
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
