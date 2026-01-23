import yaml from "js-yaml";

import type {
    SiteConfig,
    NavbarLink,
    NavbarConfig,
    SidebarConfig,
    ProfileConfig,
    AnnouncementConfig,
    PostConfig,
    FooterConfig,
    ParticleConfig,
    MusicPlayerConfig,
    PioConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";
import rawConfig from "../twilight.config.yaml?raw";


type ConfigFile = {
    site: SiteConfig;
    umami: {
        enabled: boolean;
        apiKey?: string;
        baseUrl: string;
        scripts?: string;
    };
    navbar: {
        links: Array<NavbarLink | LinkPreset | string>;
    };
    sidebar: SidebarConfig;
    profile: ProfileConfig;
    announcement: AnnouncementConfig;
    post: PostConfig;
    footer: FooterConfig;
    particle: ParticleConfig;
    musicPlayer: MusicPlayerConfig;
    pio: PioConfig;
};

const config = yaml.load(rawConfig) as ConfigFile;

const linkPresetNameMap: Record<string, LinkPreset> = {
    Home: LinkPreset.Home,
    Archive: LinkPreset.Archive,
    Projects: LinkPreset.Projects,
    Skills: LinkPreset.Skills,
    Timeline: LinkPreset.Timeline,
    Diary: LinkPreset.Diary,
    Albums: LinkPreset.Albums,
    Anime: LinkPreset.Anime,
    About: LinkPreset.About,
    Friends: LinkPreset.Friends,
};

const normalizeNavbarLink = (
    link: NavbarLink | LinkPreset | string,
): NavbarLink | LinkPreset => {
    if (typeof link === "string") {
        const preset = linkPresetNameMap[link];
        if (preset === undefined) {
            throw new Error(`Unknown LinkPreset: ${link}`);
        }
        return preset;
    }
    if (typeof link === "number") {
        return link;
    }
    const children = link.children?.map(normalizeNavbarLink);
    return children ? { ...link, children } : link;
};

const normalizeNavbarLinks = (links: Array<NavbarLink | LinkPreset | string>) =>
    links.map(normalizeNavbarLink);

const resolvedPostConfig: PostConfig = {
    ...config.post,
    comment: config.post.comment.twikoo
        ? {
            ...config.post.comment,
            twikoo: {
                ...config.post.comment.twikoo,
                lang: config.post.comment.twikoo.lang ?? config.site.lang,
            },
        }
        : config.post.comment,
};

// 站点配置
export const siteConfig: SiteConfig = config.site;

// Umami统计配置
export const umamiConfig = {
    enabled: config.umami.enabled,
    apiKey: import.meta.env.UMAMI_API_KEY ?? config.umami.apiKey,
    baseUrl: config.umami.baseUrl,
    scripts: import.meta.env.UMAMI_TRACKING_CODE ?? config.umami.scripts,
} as const;

// 导航栏配置
export const navbarConfig: NavbarConfig = {
    links: normalizeNavbarLinks(config.navbar.links),
};

// 侧边栏配置
export const sidebarConfig: SidebarConfig = config.sidebar;

// 资料配置
export const profileConfig: ProfileConfig = config.profile;

// 公告配置
export const announcementConfig: AnnouncementConfig = config.announcement;

// 文章配置
export const postConfig: PostConfig = resolvedPostConfig;

// 页脚配置
export const footerConfig: FooterConfig = config.footer;

// 粒子特效配置
export const particleConfig: ParticleConfig = config.particle;

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = config.musicPlayer;

// 看板娘配置
export const pioConfig: PioConfig = config.pio;