// Timeline data configuration file
// Used to manage data for the timeline page

export interface TimelineItem {
	id: string;
	title: string;
	description: string;
	type: "education" | "work" | "project" | "achievement";
	startDate: string;
	endDate?: string; // If empty, it means current
	location?: string;
	organization?: string;
	position?: string;
	skills?: string[];
	achievements?: string[];
	links?: {
		name: string;
		url: string;
		type: "certificate" | "project" | "other";
	}[];
	icon?: string; // Iconify icon name
	color?: string;
	featured?: boolean;
}


export const timelineData: TimelineItem[] = [
	{
		id: "current-study",
		title: "Studying IMS in BNBU",
		description:
			"Currently studying Interactive Media Studies, focusing on game development and software engineering.",
		type: "education",
		startDate: "2025-09-04",
		endDate: "",
		location: "Zhuhai",
		organization: "Beijing Normal-Hong Kong Baptist University",
		skills: ["C++", "C#", "Python", "JavaScript", "HTML/CSS"],
		achievements: [
		],
		icon: "material-symbols:school",
		color: "#059669",
		featured: false,
	},
	{
		id: "english-certificate",
		title: "IELTS Certificate",
		description:
			"Finished the IELTS tests.",
		type: "achievement",
		startDate: "2025-01-21",
		endDate: "2025-01-21",
		organization: "British Council",
		achievements: [
			"IELTS overall score: 6.5",
		],
		icon: "material-symbols:translate",
		color: "#059669",
		featured: false,
	},
	{
		id: "internship-2024",
		title: "AIGC Backend Development Intern",
		description:
			"Long term internship at an internet company called Transsion, participating in backend development of AIGC applications.",
		type: "work",
		startDate: "2024-07-04",
		endDate: "2025-01-04",
		location: "Shenzhen",
		organization: "Transsion Holdings",
		position: "AIGC Backend Engineer (Intern)",
		skills: ["PyTorch", "TensorFlow", "FastAPI", "Flask", "PyQt", "SQLite", "Git", "Docker"],
		achievements: [
			"Completed algorithm and backend development",
			"Learned team collaboration and code standards",
			"Received outstanding internship performance certificate",
		],
		icon: "material-symbols:work",
		color: "#DC2626",
		featured: false,
	},
	{
		id: "first-popular-project-contribution",
		title: "GPT-SoVITS",
		description:
			"My first popular open source project contribution, submitted multiple fixes for major issues in the model inference part.",
		type: "project",
		startDate: "2024-06-21",
		endDate: "",
		skills: ["PyTorch", "FastAPI", "Gradio", "Git"],
		achievements: [
			"Became a contributor to the project with multiple pull requests merged",
			"Gained a pull shark badge",
		],
		links: [
			{
				name: "GitHub Repository",
				url: "https://github.com/RVC-Boss/GPT-SoVITS",
				type: "project",
			},
		],
		icon: "material-symbols:code",
		color: "#7C3AED",
		featured: false,
	},
	{
		id: "first-high-star-project",
		title: "Easy Voice Toolkit",
		description:
			"My first high star open source project, an AI voice toolkit covering VPR, ASR, TTS, and other functions.",
		type: "project",
		startDate: "2023-02-26",
		endDate: "",
		skills: ["PyTorch", "FastAPI", "Qt", "Git"],
		achievements: [
			"Had a user base exceeding 5k",
			"Attracted partnership applications from numerous companies",
		],
		links: [
			{
				name: "GitHub Repository",
				url: "https://github.com/Spr-Aachen/Easy-Voice-Toolkit",
				type: "project",
			},
			{
				name: "Video",
				url: "https://www.bilibili.com/video/BV1uJ4m157P2",
				type: "other",
			},
		],
		icon: "material-symbols:code",
		color: "#7C3AED",
		featured: false,
	},
	{
		id: "english-certificate",
		title: "English CET-6 Certificate",
		description:
			"Passed the College English Test Band 6.",
		type: "achievement",
		startDate: "2023-06-17",
		endDate: "2023-06-17",
		organization: "National College English Test Committee",
		achievements: [
			"CET-6 score: 501",
		],
		icon: "material-symbols:translate",
		color: "#059669",
		featured: false,
	},
	{
		id: "first-open-source-project",
		title: "Genshin to Honkai PC Control Modification Project",
		description:
			"My first open source project, a hotkey assistant software aimed at improving the control mechanisms for MiHoYo's PC games.",
		type: "project",
		startDate: "2022-11-24",
		endDate: "2023-05-27",
		skills: ["AutoHotkey", "Git"],
		achievements: [
			"Learned responsive design and user experience optimization",
			"Received an internal referral from MiHoYo",
		],
		links: [
			{
				name: "GitHub Repository",
				url: "https://github.com/Spr-Aachen/Genshin-to-Honkai-PC-Control-Modification-Project",
				type: "project",
			},
			{
				name: "Video",
				url: "https://www.bilibili.com/video/BV1DY4y1T7aS",
				type: "other",
			},
		],
		icon: "material-symbols:code",
		color: "#7C3AED",
		featured: false,
	},
	{
		id: "english-certificate",
		title: "English CET-4 Certificate",
		description:
			"Passed the College English Test Band 4.",
		type: "achievement",
		startDate: "2022-12-18",
		endDate: "2022-12-18",
		organization: "National College English Test Committee",
		achievements: [
			"CET-4 score: 550",
		],
		icon: "material-symbols:translate",
		color: "#059669",
		featured: false,
	},
	{
		id: "first-programming-experience",
		title: "First Programming Experience",
		description:
			"First encountered programming in high school makerspace, started learning C basic syntax.",
		type: "education",
		startDate: "2019-03-03",
		endDate: "2020-06-15",
		skills: ["C", "Arduino", "LEGO"],
		achievements: [
			'Completed first "Hello World" program',
			"Developed interest in programming",
		],
		icon: "material-symbols:code",
		color: "#7C3AED",
		featured: false,
	},
];


// Get timeline statistics
export const getTimelineStats = () => {
	const total = timelineData.length;
	const byType = {
		education: timelineData.filter((item) => item.type === "education").length,
		work: timelineData.filter((item) => item.type === "work").length,
		project: timelineData.filter((item) => item.type === "project").length,
		achievement: timelineData.filter((item) => item.type === "achievement")
			.length,
	};

	return { total, byType };
};


// Get timeline items by type
export const getTimelineByType = (type?: string) => {
	if (!type || type === "all") {
		return timelineData.sort(
			(a, b) =>
				new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
		);
	}
	return timelineData
		.filter((item) => item.type === type)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
		);
};


// Get featured timeline items
export const getFeaturedTimeline = () => {
	return timelineData
		.filter((item) => item.featured)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
		);
};


// Get current ongoing items
export const getCurrentItems = () => {
	return timelineData.filter((item) => !item.endDate);
};


// Calculate total work experience
export const getTotalWorkExperience = () => {
	const workItems = timelineData.filter((item) => item.type === "work");
	let totalMonths = 0;

	workItems.forEach((item) => {
		const startDate = new Date(item.startDate);
		const endDate = item.endDate ? new Date(item.endDate) : new Date();
		const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
		const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
		totalMonths += diffMonths;
	});

	return {
		years: Math.floor(totalMonths / 12),
		months: totalMonths % 12,
	};
};
