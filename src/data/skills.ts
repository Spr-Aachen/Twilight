// Skill data configuration file
// Used to manage data for the skill display page

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string; // Iconify icon name
	category: "ai" | "server" | "client" | "web" | "database" | "tools" | "designers" | "others";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[]; // Related project IDs
	certifications?: string[];
	color?: string; // Skill card theme color
}


export const skillsData: Skill[] = [
	// AI Skills
	{
		id: "pytorch",
		name: "PyTorch",
		description:
			"An open source deep learning framework.",
		icon: "logos:pytorch-icon",
		category: "ai",
		level: "intermediate",
		experience: {years: 2, months: 6},
		projects: ["Easy-Voice-Toolkit", "GPT-SoVITS", "Kohya-Trainer"],
		color: "#F05032",
	},
	{
		id: "tensorflow",
		name: "Tensorflow",
		description:
			"An open source machine learning framework.",
		icon: "logos:tensorflow",
		category: "ai",
		level: "beginner",
		experience: {years: 0, months: 6},
		projects: ["Android-Screen-Defects-Detector"],
		color: "#FF9600",
	},
	// Server Skills
	{
		id: "fastapi",
		name: "FastAPI",
		description:
			"A high-level Python web framework.",
		icon: "logos:fastapi-icon",
		category: "server",
		level: "intermediate",
		experience: {years: 1, months: 0},
		projects: ["Easy-Voice-Toolkit", "LLM-PromptMaster"],
		color: "#3776AB",
	},
	// Client Skills
	{
		id: "qt",
		name: "Qt",
		description:
			"A cross-platform application development framework.",
		icon: "logos:qt",
		category: "client",
		level: "advanced",
		experience: {years: 2, months: 4},
		projects: ["Easy-Voice-Toolkit", "LLM-PromptMaster", "Android-Screen-Defects-Detector"],
		color: "#84da84",
	},
	{
		id: "arkts",
		name: "ArkTS",
		description:
			"A TypeScript-based mobile application development framework.",
		icon: "logos:android-icon",
		category: "client",
		level: "beginner",
		experience: {years: 0, months: 1},
		projects: ["Spr_Aachens-Unnamed-DevEcoStudio-Project"],
		color: "#00d2d2",
	},
	// Web Skills
	{
		id: "astro",
		name: "Astro",
		description:
			"A modern static site generator supporting multi-framework integration.",
		icon: "logos:astro-icon",
		category: "web",
		level: "beginner",
		experience: {years: 0, months: 1},
		projects: ["EasySite"],
		color: "#9969cc",
	},
	{
		id: "tailwindcss",
		name: "Tailwind CSS",
		description:
			"A utility-first CSS framework.",
		icon: "logos:tailwindcss-icon",
		category: "web",
		level: "beginner",
		experience: {years: 0, months: 1},
		projects: ["EasySite"],
		color: "#06B6D4",
	},
	// Database Skills
	{
		id: "mysql",
		name: "MySQL",
		description:
			"The world's most popular open-source relational database management system.",
		icon: "logos:mysql-icon",
		category: "database",
		level: "beginner",
		experience: {years: 0, months: 6},
		projects: ["MySQL-BasicTutorial"],
		color: "#4479A1",
	},
	{
		id: "sqlite",
		name: "SQLite",
		description:
			"A lightweight embedded relational database.",
		icon: "simple-icons:sqlite",
		category: "database",
		level: "intermediate",
		experience: {years: 1, months: 0},
		projects: ["Android-Screen-Defects-Detector"],
		color: "#003B57",
	},
	// Tools
	{
		id: "git",
		name: "Git",
		description:
			"A distributed version control system.",
		icon: "logos:git-icon",
		category: "tools",
		level: "advanced",
		experience: {years: 3, months: 0},
		color: "#F05032",
	},
	{
		id: "vscode",
		name: "Visual Studio Code",
		description:
			"A lightweight but powerful code editor.",
		icon: "logos:visual-studio-code",
		category: "tools",
		level: "advanced",
		experience: {years: 3, months: 0},
		color: "#007ACC",
	},
	// Designers
	{
		id: "unreal",
		name: "Unreal Engine",
		description:
			"A game engine developed by Epic Games.",
		icon: "simple-icons:unrealengine",
		category: "others",
		level: "intermediate",
		experience: {years: 0, months: 9},
		projects: ["MultiplayerMenuSystem", "BlasterProject"],
		color: "#666666",
	},
	{
		id: "blender",
		name: "Blender",
		description:
			"A modeling software by Blender Foundation.",
		icon: "simple-icons:blender",
		category: "others",
		level: "intermediate",
		experience: {years: 0, months: 9},
		projects: ["MultiplayerMenuSystem", "BlasterProject"],
		color: "#FF9600",
	},
	// Others
	{
		id: "linux",
		name: "Linux",
		description:
			"An open-source operating system, the preferred choice for server deployment and development environments.",
		icon: "logos:linux-tux",
		category: "others",
		level: "intermediate",
		experience: {years: 1, months: 0},
		projects: ["Kohya-Trainer"],
		color: "#FCC624",
	},
	{
		id: "premiere",
		name: "Premiere",
		description: "Professional vedio editing software.",
		icon: "logos:adobe-premiere",
		category: "others",
		level: "intermediate",
		experience: {years: 3, months: 0},
		projects: ["ShortMovie-WarThunder"],
		color: "#9969cc",
	},
	{
		id: "photoshop",
		name: "Photoshop",
		description: "Professional image editing software.",
		icon: "logos:adobe-photoshop",
		category: "others",
		level: "intermediate",
		experience: {years: 3, months: 0},
		projects: ["ShortMovie-WarThunder"],
		color: "#31A8FF",
	},
];


// Get skill statistics
export const getSkillStats = () => {
	const total = skillsData.length;
	const byLevel = {
		beginner: skillsData.filter((s) => s.level === "beginner").length,
		intermediate: skillsData.filter((s) => s.level === "intermediate").length,
		advanced: skillsData.filter((s) => s.level === "advanced").length,
		expert: skillsData.filter((s) => s.level === "expert").length,
	};
	const byCategory = {
		ai: skillsData.filter((s) => s.category === "ai").length,
		server: skillsData.filter((s) => s.category === "server").length,
		client: skillsData.filter((s) => s.category === "client").length,
		web: skillsData.filter((s) => s.category === "web").length,
		database: skillsData.filter((s) => s.category === "database").length,
		tools: skillsData.filter((s) => s.category === "tools").length,
		others: skillsData.filter((s) => s.category === "others").length,
	};

	return { total, byLevel, byCategory };
};


// Get skills by category
export const getSkillsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return skillsData;
	}
	return skillsData.filter((s) => s.category === category);
};


// Get advanced skills
export const getAdvancedSkills = () => {
	return skillsData.filter(
		(s) => s.level === "advanced" || s.level === "expert",
	);
};


// Calculate total years of experience
export const getTotalExperience = () => {
	const totalMonths = skillsData.reduce((total, skill) => {
		return total + skill.experience.years * 12 + skill.experience.months;
	}, 0);
	return {
		years: Math.floor(totalMonths / 12),
		months: totalMonths % 12,
	};
};
