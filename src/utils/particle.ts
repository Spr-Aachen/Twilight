import type { ParticleConfig } from "@/types/config";
import { particleConfig } from "@/config";


// 粒子对象类
class Particle {
    x: number;
    y: number;
    s: number;
    r: number;
    a: number;
    fn: {
        x: (x: number, y: number) => number;
        y: (x: number, y: number) => number;
        r: (r: number) => number;
        a: (a: number) => number;
    };
    idx: number;
    img: HTMLImageElement;
    limitArray: number[];
    config: ParticleConfig;
    // 构造函数
    constructor(
        x: number,
        y: number,
        s: number,
        r: number,
        a: number,
        fn: {
            x: (x: number, y: number) => number;
            y: (x: number, y: number) => number;
            r: (r: number) => number;
            a: (a: number) => number;
        },
        idx: number,
        img: HTMLImageElement,
        limitArray: number[],
        config: ParticleConfig,
    ) {
        this.x = x;
        this.y = y;
        this.s = s;
        this.r = r;
        this.a = a;
        this.fn = fn;
        this.idx = idx;
        this.img = img;
        this.limitArray = limitArray;
        this.config = config;
    }
    // 绘制粒子
    draw(cxt: CanvasRenderingContext2D) {
        cxt.save();
        cxt.translate(this.x, this.y);
        cxt.rotate(this.r);
        cxt.globalAlpha = this.a;
        cxt.drawImage(this.img, 0, 0, 40 * this.s, 40 * this.s);
        cxt.restore();
    }
    // 更新粒子位置和状态
    update() {
        this.x = this.fn.x(this.x, this.y);
        this.y = this.fn.y(this.y, this.y);
        this.r = this.fn.r(this.r);
        this.a = this.fn.a(this.a);
        // 如果粒子越界或完全透明，重新调整位置
        if (
            this.x > window.innerWidth ||
            this.x < 0 ||
            this.y > window.innerHeight ||
            this.y < -100 || // 从顶部消失
            this.a <= 0
        ) {
            // 如果粒子不做限制
            if (this.limitArray[this.idx] === -1) {
                this.resetPosition();
            }
            // 否则粒子有限制
            else {
                if (this.limitArray[this.idx] > 0) {
                    this.resetPosition();
                    this.limitArray[this.idx]--;
                }
            }
        }
    }
    // 重置粒子位置
    private resetPosition() {
        this.r = getRandom("fnr", this.config);
        if (Math.random() > 0.4) {
            this.x = getRandom("x", this.config);
            this.y = window.innerHeight + Math.random() * 100; // 从屏幕底部开始
            this.s = getRandom("s", this.config);
            this.r = getRandom("r", this.config);
            this.a = getRandom('a', this.config);
        } else {
            this.x = window.innerWidth;
            this.y = getRandom("y", this.config);
            this.s = getRandom("s", this.config);
            this.r = getRandom("r", this.config);
            this.a = getRandom('a', this.config);
        }
    }
}

// 粒子列表类
class ParticleList {
    list: Particle[];
    // 构造函数
    constructor() {
        this.list = [];
    }
    // 添加粒子
    push(particle: Particle) {
        this.list.push(particle);
    }
    // 更新所有粒子
    update() {
        for (let i = 0, len = this.list.length; i < len; i++) {
            this.list[i].update();
        }
    }
    // 绘制所有粒子
    draw(cxt: CanvasRenderingContext2D) {
        for (let i = 0, len = this.list.length; i < len; i++) {
            this.list[i].draw(cxt);
        }
    }
    // 获取指定索引的粒子
    get(i: number) {
        return this.list[i];
    }
    // 获取粒子数量
    size() {
        return this.list.length;
    }
}

// 获取随机值的函数
function getRandom(option: string, config: ParticleConfig): any {
    let ret: any;
    let random: number;
    // 根据选项获取随机值
    switch (option) {
        case "x":
            ret = Math.random() * window.innerWidth;
            break;
        case "y":
            ret = window.innerHeight + Math.random() * 100; // 初始位置在屏幕底部
            break;
        case "s":
            ret =
                config.size.min + Math.random() * (config.size.max - config.size.min);
            break;
        case "r":
            ret = Math.random() * 6;
            break;
        case "a":
            ret = config.opacity.min + Math.random() * (config.opacity.max - config.opacity.min);
            break;
        case "fnx":
            random = config.speed.horizontal.min + Math.random() * (config.speed.horizontal.max - config.speed.horizontal.min); // x方向保持较小的随机运动
            ret = function (x: number, y: number) {
                return x + random;
            };
            break;
        case "fny":
            random = -(config.speed.vertical.min + Math.random() * (config.speed.vertical.max - config.speed.vertical.min)); // y方向随机向上运动
            ret = function (x: number, y: number) {
                return y + random;
            };
            break;
        case "fnr":
            ret = function (r: number) {
                return r + config.speed.rotation * 0.1;
            };
            break;
        case "fna":
            ret = function (alpha: number) {
                return alpha - config.speed.fadeSpeed * 0.01;
            };
            break;
    }
    return ret;
}

// 粒子管理器类
export class ParticleManager {
    private config: ParticleConfig;
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private particleList: ParticleList | null = null;
    private animationId: number | null = null;
    private img: HTMLImageElement | null = null;
    private isRunning = false;
    // 构造函数
    constructor(config: ParticleConfig) {
        this.config = config;
    }
    // 初始化粒子特效
    async init(): Promise<void> {
        if (!this.config.enable || this.isRunning) {
            return;
        }
        // 创建图片对象
        this.img = new Image();
        this.img.src = "/particle.png"; // 使用粒子图片
        // 等待图片加载完成
        await new Promise<void>((resolve, reject) => {
            if (this.img) {
                this.img.onload = () => resolve();
                this.img.onerror = () =>
                    reject(new Error("Failed to load particle image"));
            }
        });
        // 创建画布
        this.createCanvas();
        // 创建粒子列表
        this.createParticleList();
        // 启动动画循环
        this.startAnimation();
        // 标记为运行中
        this.isRunning = true;
    }
    // 创建画布
    private createCanvas(): void {
        this.canvas = document.createElement("canvas");
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.canvas.setAttribute(
            "style",
            `position: fixed; left: 0; top: 0; pointer-events: none; z-index: ${this.config.zIndex};`,
        );
        this.canvas.setAttribute("id", "canvas_particle");
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        // 监听窗口大小变化
        window.addEventListener("resize", this.handleResize.bind(this));
    }
    // 创建粒子列表
    private createParticleList(): void {
        if (!this.img || !this.ctx) return;
        this.particleList = new ParticleList();
        const limitArray = new Array(this.config.particleNum).fill(
            this.config.limitTimes,
        );
        for (let i = 0; i < this.config.particleNum; i++) {
            const randomX = getRandom("x", this.config);
            const randomY = getRandom("y", this.config);
            const randomS = getRandom("s", this.config);
            const randomR = getRandom("r", this.config);
            const randomA = getRandom("a", this.config);
            const randomFnx = getRandom("fnx", this.config);
            const randomFny = getRandom("fny", this.config);
            const randomFnR = getRandom("fnr", this.config);
            const randomFnA = getRandom("fna", this.config);
            const particle = new Particle(
                randomX,
                randomY,
                randomS,
                randomR,
                randomA,
                {
                    x: randomFnx,
                    y: randomFny,
                    r: randomFnR,
                    a: randomFnA,
                },
                i,
                this.img,
                limitArray,
                this.config,
            );
            particle.draw(this.ctx);
            this.particleList.push(particle);
        }
    }
    // 开始动画
    private startAnimation(): void {
        if (!this.ctx || !this.canvas || !this.particleList) return;
        const animate = () => {
            if (!this.ctx || !this.canvas || !this.particleList) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particleList.update();
            this.particleList.draw(this.ctx);
            this.animationId = requestAnimationFrame(animate);
        };
        this.animationId = requestAnimationFrame(animate);
    }
    // 处理窗口大小变化
    private handleResize(): void {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }
    // 停止粒子特效
    stop(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.canvas) {
            document.body.removeChild(this.canvas);
            this.canvas = null;
        }
        window.removeEventListener("resize", this.handleResize.bind(this));
        this.isRunning = false;
    }
    // 切换粒子特效
    toggle(): void {
        if (this.isRunning) {
            this.stop();
        } else {
            this.init();
        }
    }
    // 更新配置
    updateConfig(newConfig: ParticleConfig): void {
        const wasRunning = this.isRunning;
        if (wasRunning) {
            this.stop();
        }
        this.config = newConfig;
        if (wasRunning && newConfig.enable) {
            this.init();
        }
    }
    // 获取运行状态
    getIsRunning(): boolean {
        return this.isRunning;
    }
}

// 创建全局粒子管理器实例
let globalParticleManager: ParticleManager | null = null;

// 初始化粒子特效
export function initParticle(config: ParticleConfig): void {
    if (globalParticleManager) {
        globalParticleManager.updateConfig(config);
    } else {
        globalParticleManager = new ParticleManager(config);
        if (config.enable) {
            globalParticleManager.init();
        }
    }
}

// 切换粒子特效
export function toggleParticle(): void {
    if (globalParticleManager) {
        globalParticleManager.toggle();
    }
}

// 停止粒子特效
export function stopParticle(): void {
    if (globalParticleManager) {
        globalParticleManager.stop();
        globalParticleManager = null;
    }
}

// 获取粒子特效运行状态
export function getParticleStatus(): boolean {
    return globalParticleManager ? globalParticleManager.getIsRunning() : false;
}

// 包含配置检查、重复初始化检查以及页面加载状态处理
export function setupParticleEffects(): void {
    if (typeof window === "undefined") return;
    // 初始化函数
    const init = () => {
        if (!particleConfig || !particleConfig.enable) return;
        if ((window as any).particleInitialized) return;
        initParticle(particleConfig);
        (window as any).particleInitialized = true;
    };
    // 处理页面加载状态
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
}