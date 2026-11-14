/**
 * 首屏揭开（loading overlay 移除 `html.is-loading`）后的公共调度
 * 轮播、播放器、统计图等需要等首屏可见后再预取/初始化的逻辑共用同一套监听，避免各自创建 MutationObserver，也避免重复触发
 */

const LOADING_CLASS = "is-loading";

// 等浏览器空闲再执行；不支持 `requestIdleCallback` 时退回下一轮事件循环
export function runWhenIdle(callback: () => void, timeout = 1000): () => void {
    let idleHandle: number | null = null;
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const run = (): void => {
        if (cancelled) return;
        cancelled = true;
        idleHandle = null;
        timeoutHandle = null;
        callback();
    };

    if (typeof requestIdleCallback === "function") {
        idleHandle = requestIdleCallback(run, { timeout });
    } else {
        timeoutHandle = setTimeout(run, 1);
    }

    return () => {
        if (cancelled) return;
        cancelled = true;
        if (idleHandle !== null && typeof cancelIdleCallback === "function") {
            cancelIdleCallback(idleHandle);
        }
        if (timeoutHandle !== null) clearTimeout(timeoutHandle);
        idleHandle = null;
        timeoutHandle = null;
    };
}

interface RevealTask {
    callback: () => void;
    timeout: number;
    cancelIdle: (() => void) | null;
}

const pendingTasks = new Set<RevealTask>();
let revealObserver: MutationObserver | null = null;

const isRevealed = (): boolean =>
    !document.documentElement.classList.contains(LOADING_CLASS);

const scheduleTask = (task: RevealTask): void => {
    task.cancelIdle = runWhenIdle(task.callback, task.timeout);
};

// loading overlay 已揭开时立即排入空闲队列；否则用单个共享的 MutationObserver 等待
export function onFirstScreenVisible(callback: () => void, timeout = 1000): () => void {
    if (typeof document === "undefined") return () => { };

    if (isRevealed()) {
        return runWhenIdle(callback, timeout);
    }

    const task: RevealTask = { callback, timeout, cancelIdle: null };
    pendingTasks.add(task);

    if (!revealObserver) {
        revealObserver = new MutationObserver(() => {
            if (!isRevealed()) return;
            revealObserver?.disconnect();
            revealObserver = null;
            const tasks = Array.from(pendingTasks);
            pendingTasks.clear();
            tasks.forEach(scheduleTask);
        });
        revealObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
    }

    return () => {
        if (pendingTasks.delete(task)) return;
        task.cancelIdle?.();
        task.cancelIdle = null;
    };
}