/**
 * 自动生成的图标数据文件
 * 由 scripts/generate-icons.js 在构建时生成
 * 请勿手动编辑此文件
 */

const iconSvgData: Record<string, string> = {};

export function getIconSvg(iconName: string): string {
    return iconSvgData[iconName] || "";
}

export function hasIcon(iconName: string): boolean {
    return iconName in iconSvgData;
}

export default iconSvgData;