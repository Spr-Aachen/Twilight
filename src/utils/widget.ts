import type {
    WidgetComponentConfig,
    WidgetComponentType,
    SidebarLayoutConfig,
} from "@/types/config";
import { sidebarLayoutConfig } from "@/config";


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
    private config: SidebarLayoutConfig;
    private enabledComponents: WidgetComponentConfig[];

    constructor(config: SidebarLayoutConfig = sidebarLayoutConfig) {
        this.config = config;
        this.enabledComponents = this.getEnabledComponents();
    }

    /**
     * 获取配置
     */
    getConfig(): SidebarLayoutConfig {
        return this.config;
    }

    /**
     * 获取启用的组件列表
     */
    private getEnabledComponents(): WidgetComponentConfig[] {
        return this.config.components
            .filter((component) => component.enable)
            .sort((a, b) => a.order - b.order);
    }

    /**
     * 获取指定侧边栏上启用的组件列表
     * @param side 侧边栏位置：'left' | 'right'
     */
    getEnabledComponentsBySide(side: "left" | "right"): WidgetComponentConfig[] {
        return this.enabledComponents.filter((component) => component.side === side);
    }

    /**
     * 根据位置获取组件列表
     * @param position 组件位置：'top' | 'sticky'
     */
    getComponentsByPosition(position: "top" | "sticky"): WidgetComponentConfig[] {
        return this.enabledComponents.filter(
            (component) => component.position === position,
        );
    }

    /**
     * 根据侧边栏和位置获取组件列表
     * @param side 侧边栏位置：'left' | 'right'
     * @param position 组件位置：'top' | 'sticky'
     */
    getComponentsBySideAndPosition(
        side: "left" | "right",
        position: "top" | "sticky",
    ): WidgetComponentConfig[] {
        return this.enabledComponents.filter(
            (component) => component.side === side && component.position === position,
        );
    }

    /**
     * 获取组件的CSS类名
     * @param component 组件配置
     * @param index 组件在列表中的索引
     */
    getComponentClass(component: WidgetComponentConfig, index: number): string {
        const classes: string[] = [];

        // 添加响应式隐藏类名
        if (component.responsive?.hidden) {
            component.responsive.hidden.forEach((device) => {
                switch (device) {
                    case "mobile":
                        classes.push("hidden", "md:block");
                        break;
                    case "tablet":
                        classes.push("md:hidden", "lg:block");
                        break;
                    case "desktop":
                        classes.push("lg:hidden");
                        break;
                }
            });
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
     * 检查当前设备是否应该显示侧边栏
     * @param deviceType 设备类型
     */
    shouldShowSidebar(deviceType: "mobile" | "tablet" | "desktop"): boolean {
        // 如果没有任何启用的组件，则不显示侧边栏
        if (this.enabledComponents.length === 0) {
            return false;
        }

        const layoutMode = this.config.responsive.layout[deviceType];
        return layoutMode === "sidebar";
    }

    /**
     * 检查指定侧边栏是否具有实际可显示的内容
     * @param side 侧边栏位置：'left' | 'right'
     * @param headings 页面标题列表，用于判断特殊组件是否显示
     */
    hasContentOnSide(side: "left" | "right", headings: any[] = []): boolean {
        const components = this.getEnabledComponentsBySide(side);
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
    updateConfig(newConfig: Partial<SidebarLayoutConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.enabledComponents = this.getEnabledComponents();
    }

    /**
     * 添加新组件
     * @param component 组件配置
     */
    addComponent(component: WidgetComponentConfig): void {
        this.config.components.push(component);
        this.enabledComponents = this.getEnabledComponents();
    }

    /**
     * 移除组件
     * @param componentType 组件类型
     */
    removeComponent(componentType: WidgetComponentType): void {
        this.config.components = this.config.components.filter(
            (component) => component.type !== componentType,
        );
        this.enabledComponents = this.getEnabledComponents();
    }

    /**
     * 启用/禁用组件
     * @param componentType 组件类型
     * @param enable 是否启用
     */
    toggleComponent(componentType: WidgetComponentType, enable: boolean): void {
        const component = this.config.components.find(
            (c) => c.type === componentType,
        );
        if (component) {
            component.enable = enable;
            this.enabledComponents = this.getEnabledComponents();
        }
    }

    /**
     * 重新排序组件
     * @param componentType 组件类型
     * @param newOrder 新的排序值
     */
    reorderComponent(componentType: WidgetComponentType, newOrder: number): void {
        const component = this.config.components.find(
            (c) => c.type === componentType,
        );
        if (component) {
            component.order = newOrder;
            this.enabledComponents = this.getEnabledComponents();
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
        const hasLeftSidebar = this.hasContentOnSide("left", headings);
        const hasRightSidebar = this.hasContentOnSide("right", headings);

        const mobileShowSidebar = (hasLeftSidebar || hasRightSidebar) && this.shouldShowSidebar("mobile");
        const tabletShowSidebar = (hasLeftSidebar || hasRightSidebar) && this.shouldShowSidebar("tablet");
        const desktopShowSidebar = (hasLeftSidebar || hasRightSidebar) && this.shouldShowSidebar("desktop");

        // 动态网格布局类名
        const gridCols = `
            grid-cols-1
            ${tabletShowSidebar ? "md:grid-cols-[17.5rem_1fr]" : "md:grid-cols-1"}
            ${
                desktopShowSidebar
                    ? hasLeftSidebar && hasRightSidebar
                        ? "lg:grid-cols-[17.5rem_1fr_17.5rem]"
                        : hasLeftSidebar
                            ? "lg:grid-cols-[17.5rem_1fr]"
                            : "lg:grid-cols-[1fr_17.5rem]"
                    : "lg:grid-cols-1"
            }
        `.trim().replace(/\s+/g, " ");

        // 左侧侧边栏容器类名
        const leftSidebarClass = `
            mb-0 col-span-1
            ${mobileShowSidebar && hasLeftSidebar ? "block row-start-2 row-end-3" : "hidden"}
            ${tabletShowSidebar && hasLeftSidebar ? "md:block md:max-w-[17.5rem]" : "md:hidden"}
            ${desktopShowSidebar && hasLeftSidebar ? "lg:block lg:max-w-[17.5rem] lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2" : "lg:hidden"}
        `.trim().replace(/\s+/g, " ");

        // 右侧侧边栏容器类名
        const rightSidebarClass = `
            mb-0 col-span-1
            ${mobileShowSidebar && hasRightSidebar ? "block row-start-3 row-end-4" : "hidden"}
            ${tabletShowSidebar && hasRightSidebar ? "md:block md:max-w-[17.5rem]" : "md:hidden"}
            ${
                desktopShowSidebar && hasRightSidebar
                    ? hasLeftSidebar
                        ? "lg:block lg:max-w-[17.5rem] lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2"
                        : "lg:block lg:max-w-[17.5rem] lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2"
                    : "lg:hidden"
            }
        `.trim().replace(/\s+/g, " ");

        // 主内容区域类名
        const mainContentClass = `
            overflow-hidden w-full
            col-span-1 row-start-1 row-end-2
            ${tabletShowSidebar ? "md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-2" : "md:col-span-1"}
            ${
                desktopShowSidebar
                    ? hasLeftSidebar
                        ? "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2"
                        : hasRightSidebar
                            ? "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2"
                            : "lg:col-span-1"
                    : "lg:col-span-1"
            }
        `.trim().replace(/\s+/g, " ");

        return {
            hasLeftSidebar,
            hasRightSidebar,
            mobileShowSidebar,
            tabletShowSidebar,
            desktopShowSidebar,
            gridCols,
            leftSidebarClass,
            rightSidebarClass,
            mainContentClass,
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
    return widgetManager.getConfig().components.find((c) => c.type === componentType);
}

/**
 * 工具函数：检查组件是否启用
 * @param componentType 组件类型
 */
export function isComponentEnabled(
    componentType: WidgetComponentType,
): boolean {
    const config = getComponentConfig(componentType);
    return config?.enable ?? false;
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