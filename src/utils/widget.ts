import type {
    WidgetComponentConfig,
    WidgetComponentType,
    SidebarConfig,
} from "@/types/config";
import { sidebarConfig } from "@/config";


/**
 * 组件映射表 - 将组件类型映射到实际的组件路径
 */
export const WIDGET_COMPONENT_MAP = {
    profile: "@components/sidebar/profile.astro",
    announcement: "@components/sidebar/announcement.astro",
    categories: "@components/sidebar/categories.astro",
    tags: "@components/sidebar/tags.astro",
    toc: "@components/sidebar/toc.astro",
    statistics: "@components/sidebar/statistics.astro",
    custom: null, // 自定义组件需要在配置中指定路径
} as const;

/**
 * 组件管理器类
 * 负责管理侧边栏组件的动态加载、排序和渲染
 */
export class WidgetManager {
    private config: SidebarConfig;

    constructor(config: SidebarConfig = sidebarConfig) {
        this.config = config;
    }

    /**
     * 获取配置
     */
    getConfig(): SidebarConfig {
        return this.config;
    }

    /**
     * 获取指定侧边栏上的组件列表
     * @param side 侧边栏位置：'left' | 'right'
     */
    getComponentsBySide(side: "left" | "right"): WidgetComponentConfig[] {
        return this.config.components[side] || [];
    }

    /**
     * 根据位置获取组件列表
     * @param position 组件位置：'top' | 'sticky'
     */
    getComponentsByPosition(position: "top" | "sticky"): WidgetComponentConfig[] {
        const left = this.getComponentsBySideAndPosition("left", position);
        const right = this.getComponentsBySideAndPosition("right", position);
        // Note: This might return duplicates if left/right logic overlaps, but used for enabled types check
        return [...left, ...right];
    }

    /**
     * 根据侧边栏和位置获取组件列表
     * @param side 侧边栏位置：'left' | 'right' | 'middle'
     * @param position 组件位置：'top' | 'sticky'
     */
    getComponentsBySideAndPosition(
        side: "left" | "right" | "middle",
        position: "top" | "sticky",
    ): WidgetComponentConfig[] {
        const leftComponents = (this.config.components.left || []).filter(c => c.position === position);
        const rightComponents = (this.config.components.right || []).filter(c => c.position === position);

        if (side === "left") {
            // Left sidebar includes Right components on Tablet (merged)
            return [...leftComponents, ...rightComponents];
        }
        
        if (side === "right") {
            // Right sidebar only shows Right components (Desktop only)
            return rightComponents;
        }

        if (side === "middle") {
            // Middle sidebar includes all components
            return [...leftComponents, ...rightComponents];
        }

        return [];
    }

    /**
     * 获取组件的CSS类名
     * @param component 组件配置
     * @param index 组件在列表中的索引
     * @param side 当前渲染的侧边栏位置
     */
    getComponentClass(component: WidgetComponentConfig, index: number, side: "left" | "right" | "middle"): string {
        const classes: string[] = [];

        // 基础响应式隐藏配置 (用户配置的)
        if (component.responsive?.hidden) {
            component.responsive.hidden.forEach((device) => {
                switch (device) {
                    case "mobile":
                        classes.push("hidden md:block");
                        break;
                    case "tablet":
                        classes.push("md:hidden lg:block");
                        break;
                    case "desktop":
                        classes.push("lg:hidden");
                        break;
                }
            });
        }

        // 自动布局逻辑
        const isFromLeft = (this.config.components.left || []).includes(component);
        const isFromRight = (this.config.components.right || []).includes(component);

        if (side === "left") {
            if (isFromRight && !isFromLeft) {
                // 如果是右侧组件在左侧栏渲染（平板模式），则仅在平板显示
                classes.push("hidden md:block lg:hidden");
            }
            // 左侧组件默认显示
        }

        return classes.join(" ");
    }

    /**
     * 获取组件的内联样式
     * @param component 组件配置
     * @param index 组件在列表中的索引
     */
    getComponentStyle(component: WidgetComponentConfig, index: number): string {
        const styles: string[] = [];

        // 添加自定义样式
        if (component.style) {
            styles.push(component.style);
        }

        return styles.join("; ");
    }

    /**
     * 检查组件是否应该折叠
     * @param component 组件配置
     * @param itemCount 组件内容项数量
     */
    isCollapsed(component: WidgetComponentConfig, itemCount: number): boolean {
        if (!component.responsive?.collapseThreshold) {
            return false;
        }
        return itemCount >= component.responsive.collapseThreshold;
    }

    /**
     * 获取组件的路径
     * @param componentType 组件类型
     */
    getComponentPath(componentType: WidgetComponentType): string | null {
        return WIDGET_COMPONENT_MAP[componentType];
    }

    /**
     * 检查指定侧边栏是否具有实际可显示的内容
     * @param side 侧边栏位置：'left' | 'right'
     * @param headings 页面标题列表，用于判断特殊组件是否显示
     */
    hasContentOnSide(side: "left" | "right", headings: any[] = []): boolean {
        const components = this.getComponentsBySide(side);
        if (components.length === 0) return false;

        // 只要有一个组件能显示内容，侧边栏就不是空的
        return components.some((component) => {
            // TOC 组件只有在有标题时才显示
            if (component.type === "toc") {
                return headings && headings.length > 0;
            }
            // 其他组件暂认为始终有内容
            return true;
        });
    }

    /**
     * 更新组件配置
     * @param newConfig 新的配置
     */
    updateConfig(newConfig: Partial<SidebarConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * 添加新组件
     * @param component 组件配置
     * @param side 侧边栏位置
     */
    addComponent(component: WidgetComponentConfig, side: "left" | "right"): void {
        if (!this.config.components[side]) {
            this.config.components[side] = [];
        }
        this.config.components[side].push(component);
    }

    /**
     * 移除组件
     * @param componentType 组件类型
     */
    removeComponent(componentType: WidgetComponentType): void {
        if (this.config.components.left) {
            this.config.components.left = this.config.components.left.filter(
                (component) => component.type !== componentType,
            );
        }
        if (this.config.components.right) {
            this.config.components.right = this.config.components.right.filter(
                (component) => component.type !== componentType,
            );
        }
    }

    /**
     * 重新排序组件
     * @param side 侧边栏
     * @param oldIndex 旧索引
     * @param newIndex 新索引
     */
    reorderComponent(side: "left" | "right", oldIndex: number, newIndex: number): void {
        const list = this.config.components[side];
        if (!list) return;
        
        if (oldIndex >= 0 && oldIndex < list.length && newIndex >= 0 && newIndex < list.length) {
            const [moved] = list.splice(oldIndex, 1);
            list.splice(newIndex, 0, moved);
        }
    }

    /**
     * 检查组件是否应该在侧边栏中渲染
     * @param componentType 组件类型
     */
    isSidebarComponent(componentType: WidgetComponentType): boolean {
        return true;
    }

    /**
     * 获取页面中的标题列表
     * @returns 格式化后的标题数组
     */
    getPageHeadings() {
        if (typeof document === "undefined") return [];
        return Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"))
            .filter((h) => h.id)
            .map((h) => ({
                depth: parseInt(h.tagName.substring(1)),
                slug: h.id,
                text: (h.textContent || "").replace(/#+\s*$/, ""),
            }));
    }

    /**
     * 获取网格布局相关的类名
     * @param headings 页面标题列表
     */
    getGridLayout(headings: any[] = []) {
        const hasLeftComponents = this.hasContentOnSide("left", headings);
        const hasRightComponents = this.hasContentOnSide("right", headings);
        const hasAnyComponents = hasLeftComponents || hasRightComponents;

        // Desktop: Left if hasLeft, Right if hasRight
        const hasLeftSidebar = hasLeftComponents;
        const hasRightSidebar = hasRightComponents;

        // 动态网格布局类名
        const gridCols = `
            grid-cols-1
            ${hasAnyComponents ? "md:grid-cols-[17.5rem_1fr]" : "md:grid-cols-1"}
            ${
                hasLeftSidebar && hasRightSidebar
                    ? "lg:grid-cols-[17.5rem_1fr_17.5rem]"
                    : hasLeftSidebar
                        ? "lg:grid-cols-[17.5rem_1fr]"
                        : hasRightSidebar
                            ? "lg:grid-cols-[1fr_17.5rem]"
                            : "lg:grid-cols-1"
            }
        `.trim().replace(/\s+/g, " ");

        // 左侧侧边栏容器类名
        // Mobile: Hidden
        // Tablet: Visible if hasAnyComponents (merged)
        // Desktop: Visible if hasLeftSidebar
        const leftSidebarClass = `
            mb-0 col-span-1 hidden
            ${hasAnyComponents ? "md:block md:max-w-[17.5rem]" : ""}
            ${hasLeftSidebar ? "lg:block lg:max-w-[17.5rem] lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2" : "lg:hidden"}
        `.trim().replace(/\s+/g, " ");

        // 右侧侧边栏容器类名
        // Mobile: Hidden
        // Tablet: Hidden
        // Desktop: Visible if hasRightSidebar
        const rightSidebarClass = `
            mb-0 col-span-1 hidden
            md:hidden
            ${
                hasRightSidebar
                    ? hasLeftSidebar
                        ? "lg:block lg:max-w-[17.5rem] lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2"
                        : "lg:block lg:max-w-[17.5rem] lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2"
                    : "lg:hidden"
            }
        `.trim().replace(/\s+/g, " ");

        // 移动端 Footer 类名
        // Always 1 col on mobile
        // 2 cols on tablet if sidebar is present
        const mobileFooterClass = `
            footer col-span-1 onload-animation-up block lg:hidden transition-swup-fade
            ${hasAnyComponents ? "md:col-span-2" : "md:col-span-1"}
        `.trim().replace(/\s+/g, " ");
        
        // 移动端侧边栏类名
        const middleSidebarClass = `
            col-span-1 block md:hidden
            ${!hasAnyComponents ? "hidden" : ""}
        `.trim().replace(/\s+/g, " ");

        // 主内容区域类名
        const mainContentClass = `
            overflow-hidden w-full
            col-span-1 row-start-1 row-end-2
            ${hasAnyComponents ? "md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-2" : "md:col-span-1"}
            ${
                hasLeftSidebar && hasRightSidebar
                    ? "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2"
                    : hasLeftSidebar
                        ? "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2"
                        : hasRightSidebar
                            ? "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2"
                            : "lg:col-span-1"
            }
        `.trim().replace(/\s+/g, " ");

        return {
            hasLeftSidebar,
            hasRightSidebar,
            hasAnyComponents,
            gridCols,
            leftSidebarClass,
            rightSidebarClass,
            mainContentClass,
            mobileFooterClass,
            middleSidebarClass,
        };
    }
}

/**
 * 默认组件管理器实例
 */
export const widgetManager = new WidgetManager();

/**
 * 工具函数：根据组件类型获取组件配置
 * @param componentType 组件类型
 */
export function getComponentConfig(
    componentType: WidgetComponentType,
): WidgetComponentConfig | undefined {
    const left = widgetManager.getConfig().components.left || [];
    const right = widgetManager.getConfig().components.right || [];
    return left.find((c) => c.type === componentType) ||
           right.find((c) => c.type === componentType);
}

/**
 * 工具函数：检查组件是否启用
 * @param componentType 组件类型
 */
export function isComponentEnabled(
    componentType: WidgetComponentType,
): boolean {
    // 默认所有配置中存在的组件都视为启用
    return !!getComponentConfig(componentType);
}

/**
 * 工具函数：获取所有启用的组件类型
 */
export function getEnabledComponentTypes(): WidgetComponentType[] {
    const enabledComponents = widgetManager.getComponentsByPosition("top").concat(
        widgetManager.getComponentsByPosition("sticky")
    );
    return enabledComponents.map((c) => c.type);
}

/**
 * 通用的点击外部关闭处理函数
 * @param event 鼠标事件
 * @param panelId 面板ID
 * @param ignoreIds 忽略的元素ID（按钮等），支持单个ID或ID数组
 * @param action 关闭回调
 */
export function onClickOutside(
    event: MouseEvent,
    panelId: string,
    ignoreIds: string | string[],
    action: () => void
) {
    if (typeof document === "undefined") {
        return;
    }
    const panel = document.getElementById(panelId);

    const target = event.target as HTMLElement;

    const ids = Array.isArray(ignoreIds) ? ignoreIds : [ignoreIds];
    
    // 如果点击的是忽略元素或其内部元素，则不执行关闭操作
    for (const id of ids) {
        if (target.closest(`#${id}`)) {
            return;
        }
    }

    // 如果面板存在且点击发生在面板外部，则执行关闭操作
    if (panel && !panel.contains(target)) {
        action();
    }
}