let fancyboxSelectors: string[] = [];
let Fancybox: any;

// 图片灯箱按需加载
export async function initFancybox() {
    if (typeof document === "undefined") return;
    // 相册图片选择器 (只绑定不在 a 标签内的图片，避免与链接绑定冲突)
    const albumImagesSelector = ".custom-md img:not(a *), #post-cover img:not(a *), .moment-images img:not(a *), .photo-gallery img:not(a *)";
    // 相册链接选择器
    const albumLinksSelector = ".moment-images a[data-fancybox], .photo-gallery a[data-fancybox]";
    // 单张图片选择器
    const singleFancyboxSelector = "[data-fancybox]:not(.moment-images a):not(.photo-gallery a)";
    // 检查是否有图片需要绑定
    const hasImages =
        document.querySelector(albumImagesSelector) ||
        document.querySelector(albumLinksSelector) ||
        document.querySelector(singleFancyboxSelector);
    if (!hasImages) return;
    // 检查是否已初始化 Fancybox
    if (!Fancybox) {
        const mod = await import("@fancyapps/ui");
        Fancybox = mod.Fancybox;
        await import("@fancyapps/ui/dist/fancybox/fancybox.css");
    }
    if (fancyboxSelectors.length > 0) {
        return; // 已经初始化，直接返回
    }
    // 公共配置
    const commonConfig = {
        Thumbs: {
            autoStart: true,
            showOnStart: "yes"
        },
        Toolbar: {
            display: {
                left: ["infobar"],
                middle: [
                    "zoomIn",
                    "zoomOut",
                    "toggle1to1",
                    "rotateCCW",
                    "rotateCW",
                    "flipX",
                    "flipY",
                ],
                right: ["slideshow", "thumbs", "close"],
            },
        },
        animated: true,
        dragToClose: true,
        keyboard: {
            Escape: "close",
            Delete: "close",
            Backspace: "close",
            PageUp: "next",
            PageDown: "prev",
            ArrowUp: "next",
            ArrowDown: "prev",
            ArrowRight: "next",
            ArrowLeft: "prev",
        },
        fitToView: true,
        preload: 3,
        infinite: true,
        Panzoom: {
            maxScale: 3,
            minScale: 1
        },
        caption: false,
    };
    // 绑定相册/文章图片
    Fancybox.bind(albumImagesSelector, {
        ...commonConfig,
        groupAll: true,
        Carousel: {
            transition: "slide",
            preload: 2,
        },
    });
    fancyboxSelectors.push(albumImagesSelector);
    // 绑定相册链接
    Fancybox.bind(albumLinksSelector, {
        ...commonConfig,
        source: (el: any) => {
            return el.getAttribute("data-src") || el.getAttribute("href");
        },
    });
    fancyboxSelectors.push(albumLinksSelector);
    // 绑定单独的 fancybox 图片
    Fancybox.bind(singleFancyboxSelector, commonConfig);
    fancyboxSelectors.push(singleFancyboxSelector);
}

// 清理 Fancybox 实例
export function cleanupFancybox() {
    if (!Fancybox) return; // 如果从未加载过，无需清理
    fancyboxSelectors.forEach((selector) => {
        Fancybox.unbind(selector);
    });
    fancyboxSelectors = [];
}