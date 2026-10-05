import yaml from "js-yaml";

import type {
    SiteConfig,
    AnalyticsConfig,
    NavbarLink,
    NavbarConfig,
    SidebarConfig,
    ProfileConfig,
    AnnouncementConfig,
    CommentProvider,
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
    analytics: AnalyticsConfig;
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

// 判断配置项是否已填写有效内容
const isFilled = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;
// 解析评论配置
const resolveCommentConfig = (): PostConfig["comment"] => {
    const comment = config.post.comment ?? { enable: false };
    const waline = comment.waline
        ? {
            ...comment.waline,
            lang: isFilled(comment.waline.lang) ? comment.waline.lang : config.site.lang,
        }
        : undefined;
    const twikoo = comment.twikoo
        ? {
            ...comment.twikoo,
            lang: isFilled(comment.twikoo.lang) ? comment.twikoo.lang : config.site.lang,
        }
        : undefined;
    // 仅当必填配置项均已填写时，才认为该服务提供商可用
    const configuredProviders: CommentProvider[] = [];
    if (isFilled(comment.waline?.serverURL)) configuredProviders.push("waline");
    if (isFilled(comment.twikoo?.envId)) configuredProviders.push("twikoo");
    // 如果显式指定了评论服务提供商，则检查其是否已配置
    const explicitProvider = comment.provider ?? undefined;
    if (explicitProvider !== undefined) {
        if (explicitProvider !== "waline" && explicitProvider !== "twikoo") {
            throw new Error(`Unknown CommentProvider: ${explicitProvider}`);
        }
        if (!configuredProviders.includes(explicitProvider)) {
            const requiredKey = explicitProvider === "waline" ? "waline.serverURL" : "twikoo.envId";
            throw new Error(
                `CommentProvider "${explicitProvider}" is selected but "post.comment.${requiredKey}" is not configured.`,
            );
        }
    }
    // 未显式指定时，按 waline -> twikoo 的顺序选取第一个已配置的服务提供商
    const provider = explicitProvider ?? configuredProviders[0];
    // 
    return { ...comment, provider, waline, twikoo };
};

// 文章配置
const resolvedPostConfig: PostConfig = {
    ...config.post,
    comment: resolveCommentConfig(),
};

// 站点配置
export const siteConfig: SiteConfig = config.site;

// 统计配置
export const analyticsConfig: AnalyticsConfig = {
    enabled: config.analytics.enabled,
    platform: config.analytics.platform,
    umami: {
        apiKey: config.analytics.umami.apiKey ?? import.meta.env.UMAMI_API_KEY,
        baseUrl: config.analytics.umami.baseUrl,
        code: config.analytics.umami.code ?? import.meta.env.UMAMI_TRACKING_CODE,
    }
};

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