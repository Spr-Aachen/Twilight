// 本地番剧数据配置
export type AnimeItem = {
	title: string;
	status: "watching" | "completed" | "planned";
	rating: number;
	cover: string;
	description: string;
	episodes: string;
	year: string;
	genre: string[];
	studio: string;
	link: string;
	progress: number;
	totalEpisodes: number;
	startDate: string;
	endDate: string;
};


const localAnimeList: AnimeItem[] = [
	{
		title: "Ghost in the Shell: Stand Alone Complex",
		status: "completed",
		rating: 9.8,
		cover: "/assets/anime/GhostInTheShell.webp",
		description: "The story of a fictional counter-cyberterrorist organisation.",
		episodes: "52 episodes",
		year: "2022",
		genre: ["Science Fiction", "Action"],
		studio: "Production I.G",
		link: "https://www.bilibili.com/bangumi/media/md1564",
		progress: 52,
		totalEpisodes: 52,
		startDate: "2002-10",
		endDate: "2025-01",
	},
];

export default localAnimeList;
