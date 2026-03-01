/**
 * 图标预处理脚本 (Twilight 版)
 * 在构建时自动扫描 Svelte 和 Astro 组件中使用的图标，并生成内联 SVG 数据
 * 
 * 逻辑：
 * 1. 扫描 src 目录下的 .svelte 和 .astro 文件
 * 2. 提取所有形如 icon="prefix:name" 的图标
 * 3. 从 node_modules/@iconify-json/[prefix]/icons.json 中读取 SVG 数据
 * 4. 生成 src/utils/icons.ts
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const SRC_DIR = join(ROOT_DIR, "src");
const OUTPUT_FILE = join(SRC_DIR, "utils", "icons.ts");

// 支持的图标集及其包名
const ICON_SETS = {
    "material-symbols": "@iconify-json/material-symbols",
    "fa6-solid": "@iconify-json/fa6-solid",
    "fa6-brands": "@iconify-json/fa6-brands",
    "fa6-regular": "@iconify-json/fa6-regular",
    "mdi": "@iconify-json/mdi",
    "eos-icons": "@iconify-json/eos-icons",
};

// 图标集数据缓存
const iconSetCache = new Map();

/**
 * 递归获取目录下所有文件
 */
function getAllFiles(dir, extensions = [".svelte", ".astro"]) {
    const files = [];

    function walk(currentDir) {
        if (!existsSync(currentDir)) return;
        const items = readdirSync(currentDir);
        for (const item of items) {
            const fullPath = join(currentDir, item);
            const stat = statSync(fullPath);

            if (stat.isDirectory()) {
                if (!item.startsWith(".") && item !== "node_modules" && item !== "dist") {
                    walk(fullPath);
                }
            } else if (extensions.some((ext) => item.endsWith(ext))) {
                files.push(fullPath);
            }
        }
    }

    walk(dir);
    return files;
}

/**
 * 从文件内容中提取图标名称
 */
function extractIconNames(content) {
    const icons = new Set();

    // 匹配各种图标使用模式
    const patterns = [
        // icon="xxx:yyy" 或 icon='xxx:yyy'
        /icon=["']([a-z0-9-]+:[a-z0-9-]+)["']/gi,
        // icon={`xxx:yyy`}
        /icon=\{[`"']([a-z0-9-]+:[a-z0-9-]+)[`"']\}/gi,
    ];

    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            icons.add(match[1]);
        }
    }

    return icons;
}

/**
 * 加载图标集数据
 */
function loadIconSet(prefix) {
    if (iconSetCache.has(prefix)) {
        return iconSetCache.get(prefix);
    }

    const packageName = ICON_SETS[prefix];
    if (!packageName) {
        console.warn(`⚠️  未知图标集: ${prefix}`);
        return null;
    }

    try {
        const iconSetPath = join(ROOT_DIR, "node_modules", packageName, "icons.json");
        if (!existsSync(iconSetPath)) {
            console.warn(`⚠️  找不到图标集文件: ${iconSetPath}`);
            return null;
        }
        const data = JSON.parse(readFileSync(iconSetPath, "utf-8"));
        iconSetCache.set(prefix, data);
        return data;
    } catch (error) {
        console.warn(`⚠️  无法加载图标集 ${packageName}: ${error.message}`);
        return null;
    }
}

/**
 * 获取单个图标的 SVG
 */
function getIconSvg(iconName) {
    const [prefix, name] = iconName.split(":");
    if (!prefix || !name) return null;

    const iconSet = loadIconSet(prefix);
    if (!iconSet) return null;

    const iconData = iconSet.icons[name];
    if (!iconData) {
        // 尝试从别名中查找
        if (iconSet.aliases && iconSet.aliases[name]) {
            const alias = iconSet.aliases[name];
            const realName = alias.parent;
            const realData = iconSet.icons[realName];
            if (realData) {
                return buildSvg(realData, iconSet);
            }
        }
        console.warn(`⚠️  图标未找到: ${iconName}`);
        return null;
    }

    return buildSvg(iconData, iconSet);
}

function buildSvg(iconData, iconSet) {
    const width = iconData.width || iconSet.width || 24;
    const height = iconData.height || iconSet.height || 24;
    const body = iconData.body;

    // 简单的 SVG 构建
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 ${width} ${height}" fill="currentColor">${body}</svg>`;
}

/**
 * 生成 icons.ts 文件
 */
function generateIconsFile(iconsMap) {
    const iconEntries = Array.from(iconsMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, svg]) => `\t"${name}":\n\t\t'${svg.replace(/'/g, "\\'")}'`)
        .join(",\n");

    return `/**
 * 自动生成的图标数据文件
 * 由 scripts/generate-icons.js 在构建时生成
 * 请勿手动编辑此文件
 */

const iconSvgData: Record<string, string> = {
${iconEntries}
};

export function getIconSvg(iconName: string): string {
    return iconSvgData[iconName] || "";
}

export function hasIcon(iconName: string): boolean {
    return iconName in iconSvgData;
}

export default iconSvgData;
`;
}

/**
 * 主逻辑
 */
async function main() {
    console.log("🚀 开始扫描图标...");
    const files = getAllFiles(SRC_DIR);
    const allIcons = new Set();

    for (const file of files) {
        const content = readFileSync(file, "utf-8");
        const icons = extractIconNames(content);
        for (const icon of icons) {
            allIcons.add(icon);
        }
    }

    console.log(`📦 发现 ${allIcons.size} 个唯一图标`);

    const iconsMap = new Map();
    for (const icon of allIcons) {
        const svg = getIconSvg(icon);
        if (svg) {
            iconsMap.set(icon, svg);
        }
    }

    const outputDir = dirname(OUTPUT_FILE);
    if (!existsSync(outputDir)) {
        readdirSync(outputDir, { recursive: true });
    }

    writeFileSync(OUTPUT_FILE, generateIconsFile(iconsMap));
    console.log(`✅ 已生成 ${OUTPUT_FILE}`);
}

main().catch(console.error);