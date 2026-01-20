import type {
    SiteConfig,
    NavBarConfig,
    SidebarLayoutConfig,
    ProfileConfig,
    AnnouncementConfig,
    PostConfig,
    FooterConfig,
    ParticleConfig,
    MusicPlayerConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

/**
 * 
 */

// 设置浏览器语言 ('zh', 'en', ...)
const SITE_LANG = "en";

// 设置网站时区 (from -12 to 12)
const SITE_TIMEZONE = 8; // UTC+8


// 站点配置
export const siteConfig: SiteConfig = {
    // 站点 URL（以斜杠结尾）
    siteURL: "https://twilight.spr-aachen.com/", // 请替换为你的站点 URL 并以斜杠结尾
    // 站点标题
    title: "Twilight",
    // 站点副标题
    subtitle: "Blog Template",
    // 语言配置
    lang: SITE_LANG, // 自动检测的浏览器语言
    // 翻译配置
    translate: {
        // 启用翻译功能
        enable: true,
        // 翻译服务
        service: "client.edge", // 使用 Edge 浏览器
        // 显示语言选择下拉框
        showSelectTag: false, // 使用自定义按钮
        // 自动检测用户语言
        autoDiscriminate: true,
        // 翻译时忽略的 CSS 类名
        ignoreClasses: ["ignore", "banner-title", "banner-subtitle"],
        // 翻译时忽略的 HTML 标签
        ignoreTags: ["script", "style", "code", "pre"],
    },
    // 时区配置
    timeZone: SITE_TIMEZONE,
    // 字体配置
    font: {
        // 示例字体配置 - Zen Maru Gothic
        "Example - ZenMaruGothic": {
            // 字体源 (字体 CSS 链接 | 字体文件路径)
            src: "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic&display=swap", // 使用 ZenMaruGothic CSS 链接
            // 字体名 (font-family)
            family: "Zen Maru Gothic",
        }
    },
    // 主题色配置
    themeColor: {
        // 主题色的默认色相 (范围从 0 到 360。例如：红色：0，青色：200，蓝绿色：250，粉色：345)
        hue: 255,
    },
    // 默认主题 ("system" 跟随系统 | "light" 浅色 | "dark" 深色)
    defaultTheme: "dark",
    // 壁纸配置
    wallpaper: {
        // 模式 ("banner" 横幅 | "fullscreen" 全屏 | "none" 纯色)
        mode: "banner",
        // 图片源配置 (fullscreen 和 banner 模式共享)
        src: {
            // 桌面壁纸图片 (相对于 /public 目录; 支持单张图片或图片数组，当数组长度 > 1 时自动启用轮播)
            desktop: [
                "/assets/images/desktopWallpaper_1.jpg",
                "/assets/images/desktopWallpaper_2.jpg",
                "/assets/images/desktopWallpaper_3.jpg",
            ],
            // 移动壁纸图片 (相对于 /public 目录; 支持单张图片或图片数组，当数组长度 > 1 时自动启用轮播)
            mobile: [
                "/assets/images/mobileWallpaper_1.jpg",
                "/assets/images/mobileWallpaper_2.jpg",
            ],
        },
        // 壁纸位置 ('top' | 'center' | 'bottom')
        position: "center",
        // 轮播配置 (fullscreen 和 banner 模式共享)
        carousel: {
            // 为多张图片启用轮播，否则随机显示一张图片
            enable: true,
            // 轮播间隔时间 (秒)
            interval: 3.6,
            // 启用 Ken Burns 效果
            kenBurns: true,
        },
        // Banner 模式专属配置
        banner: {
            // 横幅文本配置
            homeText: {
                // 在主页显示文本
                enable: true,
                // 主标题
                title: "Twilight",
                // 副标题，支持单个字符串或字符串数组
                subtitle: [
                    "Illuminate Our Paths",
                ],
                // 副标题打字机效果
                typewriter: {
                    // 启用副标题打字机效果
                    enable: true,
                    // 打字速度 (毫秒)
                    speed: 111,
                    // 删除速度 (毫秒)
                    deleteSpeed: 51,
                    // 完全显示后的暂停时间 (毫秒)
                    pauseTime: 3000,
                },
            },
            // 横幅图片来源文本
            credit: {
                // 显示横幅图片来源文本
                enable: false,
                // 要显示的来源文本
                text: "Describe",
                // (可选) 原始艺术品或艺术家页面的 URL 链接
                url: "",
            },
            // 导航栏配置
            navbar: {
                // 导航栏透明模式 ("semi" 半透明加圆角 | "full" 完全透明 | "semifull" 动态透明)
                transparentMode: "semifull",
            },
            // 水波纹效果配置
            waves: {
                // 启用水波纹效果
                enable: true,
                // 启用性能模式 (简化波浪效果以提升性能)
                performanceMode: false,
            },
        },
        // Fullscreen 模式专属配置
        fullscreen: {
            // 层级
            zIndex: -1, // 确保壁纸在背景层
            // 壁纸透明度，0-1之间
            opacity: 0.9,
            // 背景模糊程度 (像素值)
            blur: 1,
            // 导航栏透明模式
            navbar: {
                transparentMode: "semi", // 使用半透明模式而不是完全透明
            },
        },
    },
    // 加载页配置
    loadingOverlay: {
        // 是否启用加载页
        enable: true,
        // 加载标题配置
        title: {
            // 是否启用加载标题
            enable: true,
            // 加载标题文本
            content: "LOADING",
            // 动画周期 (s)
            interval: 1.5,
        },
        // 加载动画配置
        spinner: {
            // 是否启用加载动画
            enable: true,
            // 动画周期 (s)
            interval: 1.5,
        },
    },
    // favicon 配置
    favicon: [
    ],
    // bangumi 配置
    bangumi: {
        // 用户 ID
        userId: "your-bangumi-id", // 可以设置为 "sai" 测试
    },
    // OpenGraph 配置
    generateOgImages: false, // 注意开启图片生成后要渲染很长时间，不建议本地调试的时候开启
};

/**
 * 
 */

// 导航栏配置
export const navBarConfig: NavBarConfig = {
    // 链接配置
    links: [
        LinkPreset.Home,
        LinkPreset.Archive,
        {
            name: "Exhibition",
            url: "/exhibition/",
            icon: "material-symbols:person",
            description: "A collection of my creative works and experiences",
            children: [
                LinkPreset.Projects,
                LinkPreset.Skills,
                LinkPreset.Timeline,
                LinkPreset.Diary,
                LinkPreset.Albums,
                LinkPreset.Anime,
            ],
        },
        LinkPreset.Friends,
        LinkPreset.About,
    ],
};

/**
 * 
 */

// 侧边栏布局配置
export const sidebarLayoutConfig: SidebarLayoutConfig = {
    // 侧边栏组件配置列表
    components: [
        {
            // 组件类型
            type: "profile", // 用户资料组件
            // 是否启用该组件
            enable: true,
            // 组件所属侧边栏
            side: "left",
            // 组件显示顺序 (数字越小越靠前)
            order: 1,
            // 组件位置
            position: "top", // 固定在顶部
        },
        {
            // 组件类型
            type: "announcement", // 公告组件
            // 是否启用该组件
            enable: true,
            // 组件所属侧边栏
            side: "left",
            // 组件显示顺序 (数字越小越靠前)
            order: 2,
            // 组件位置
            position: "top", // 固定在顶部
        },
        {
            // 组件类型
            type: "categories", // 分类组件
            // 是否启用该组件
            enable: true,
            // 组件所属侧边栏
            side: "left",
            // 组件显示顺序 (数字越小越靠前)
            order: 3,
            // 组件位置
            position: "sticky", // 粘性定位，可滚动
            // 响应式配置
            responsive: {
                // 折叠阈值
                collapseThreshold: 5, // 当分类数量超过5个时自动折叠
            },
        },
        {
            // 组件类型
            type: "tags", // 标签组件
            // 是否启用该组件
            enable: true,
            // 组件所属侧边栏
            side: "left",
            // 组件显示顺序 (数字越小越靠前)
            order: 4,
            // 组件位置
            position: "sticky", // 粘性定位，可滚动
            // 响应式配置
            responsive: {
                // 折叠阈值
                collapseThreshold: 20, // 当标签数量超过20个时自动折叠
            },
        },
        {
            // 组件类型
            type: "toc", // 目录组件
            // 是否启用该组件
            enable: true,
            // 组件所属侧边栏
            side: "right",
            // 组件显示顺序 (数字越小越靠前)
            order: 1,
            // 组件位置
            position: "sticky", // 粘性定位，可滚动
            // 自定义属性
            customProps: {
                // 目录深度 (1-6，1 表示只显示 h1 标题，2 表示显示 h1 和 h2 标题，依此类推)
                depth: 3,
            },
        },
        {
            // 组件类型
            type: "statistics", // 文章统计组件
            // 是否启用该组件
            enable: true,
            // 组件所属侧边栏
            side: "right",
            // 组件显示顺序 (数字越小越靠前)
            order: 2,
            // 组件位置
            position: "sticky", // 固定在顶部
        },
    ],
    // 响应式布局配置
    responsive: {
        // 不同设备的布局模式 ("hidden" 不显示侧边栏 | "drawer" 抽屉模式 | "sidebar" 显示侧边栏)
        layout: {
            // 移动端
            mobile: "sidebar",
            // 平板端
            tablet: "sidebar",
            // 桌面端
            desktop: "sidebar",
        },
    },
};


// Umami统计配置
export const umamiConfig = {
    // 是否显示Umami统计
    enabled: false,
    // API密钥
    apiKey: import.meta.env.UMAMI_API_KEY,
    // UmamiCloudAPI地址
    baseUrl: "https://api.umami.is",
    // 要插入的Script
    scripts: import.meta.env.UMAMI_TRACKING_CODE,
} as const;


// 资料配置
export const profileConfig: ProfileConfig = {
    // 头像配置 (相对于 /public 目录)
    avatar: "/assets/images/avatar.jpg",
    // 信息配置
    name: "Twilight",
    // 简介配置
    bio: "Hi",
    // 链接配置
    links: [
        {
            name: "GitHub",
            icon: "fa6-brands:github",
            url: "https://github.com/Spr-Aachen/Twilight",
        },
    ],
};


// 公告配置
export const announcementConfig: AnnouncementConfig = {
    // 公告标题
    title: "Announcement",
    // 公告内容
    content: "Welcome to my blog!",
    // 允许用户关闭公告
    closable: true,
    // 链接配置
    link: {
        // 启用链接
        enable: true,
        // 链接文本
        text: "Learn More",
        // 链接 URL
        url: "/about/",
        // 是否外部链接
        external: false, // 内部链接
    },
};

/**
 * 
 */

// 文章配置
export const postConfig: PostConfig = {
    // 显示“上次编辑”卡片
    showLastModified: true,
    // 在文章内容中显示封面
    showCoverInContent: false,
    // 代码高亮配置
    expressiveCode: {
        // 主题
        theme: "github-dark", // 深色背景
    },
    // 许可证配置
    license: {
        // 启用许可证
        enable: true,
        // 许可证名称
        name: "CC BY-NC-SA 4.0",
        // 许可证链接
        url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    },
    // 评论配置
    comment: {
        // 启用评论功能
        enable: false,
        // Twikoo 评论系统配置
        twikoo: {
            // 环境 ID
            envId: "https://twikoo.vercel.app",
            // 语言
            lang: SITE_LANG, // 默认使用站点语言
        },
    },
};

/**
 * 
 */

// 页脚配置
export const footerConfig: FooterConfig = {
    // 启用 Footer HTML 注入功能
    enable: false,
    // 自定义 HTML 内容，用于添加备案号等信息
    customHtml: "",
};

/**
 * 
 */

// 粒子特效配置
export const particleConfig: ParticleConfig = {
    // 启用粒子特效
    enable: true,
    // 粒子数量
    particleNum: 12,
    // 粒子越界限制次数，-1为无限循环
    limitTimes: -1,
    // 粒子尺寸配置
    size: {
        // 粒子最小尺寸倍数
        min: 0.3,
        // 粒子最大尺寸倍数
        max: 0.9,
    },
    // 粒子透明度配置
    opacity: {
        // 粒子最小不透明度
        min: 0.3,
        // 粒子最大不透明度
        max: 0.9,
    },
    // 粒子移动速度配置
    speed: {
        // 水平移动速度
        horizontal: {
            // 最小值
            min: -0.9,
            // 最大值
            max: 0.9,
        },
        // 垂直移动速度
        vertical: {
            // 最小值
            min: 0.15,
            // 最大值
            max: 0.3,
        },
        // 旋转速度
        rotation: 0.12,
        // 消失速度
        fadeSpeed: 0.12, // 不应大于最小不透明度
    },
    // 粒子层级
    zIndex: 100, // 确保粒子在合适的层级显示
};


// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
    // 启用音乐播放器功能
    enable: true,
    // 默认模式 ("meting" API | "local" 本地)
    mode: "meting",
    // meting 模式专属配置
    meting: {
        // Meting API 地址
        meting_api: "https://api.i-meto.com/meting/api",
        // 音乐平台
        server: "netease",
        // 类型 ("playlist" 歌单 | "song" 单曲)
        type: "playlist",
        // 资源 ID
        id: "2161912966",
    },
    // local 模式专属配置
    local: {
        // 播放列表
        playlist: [
            {
                // 序号
                id: 1,
                // 标题
                title: "深海之息",
                // 作者
                artist: "Youzee Music",
                // 封面
                cover: "https://p1.music.126.net/PhKOqFtljgHDDpKYM2ADUA==/109951169858309716.jpg",
                // 路径
                url: "assets/music/深海之息.m4a",
                // 时长
                duration: 146,
            },
        ],
    },
    // 是否自动播放
    autoplay: true,
};


// 看板娘配置
export const pioConfig: import("./types/config").PioConfig = {
    // 启用看板娘
    enable: false,
    // 模型文件路径
    models: ["/pio/models/pio/model.json"],
    // 看板娘位置
    position: "left",
    // 看板娘宽度
    width: 280,
    // 看板娘高度
    height: 250,
    // 展现模式
    mode: "draggable",
    // 是否在移动设备上隐藏
    hiddenOnMobile: true,
    // 对话框配置
    dialog: {
        // 欢迎词
        welcome: "Welcome!",
        // 触摸提示
        touch: [
            "What are you doing?",
            "Stop touching me!",
            "Don't bully me like that!",
            "(｡í _ ì｡)",
        ],
        // 首页提示
        home: "Click here to go back to homepage!",
        // 换装提示
        skin: ["Want to see my new outfit?", "The new outfit looks great~"],
        // 关闭提示
        close: "See you next time~",
        // 关于链接
        link: "https://nav.kungal.org",
    },
};