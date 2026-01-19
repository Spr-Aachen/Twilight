/**
 * Markdown 相关交互逻辑
 * 包括代码块复制和折叠功能
 * 使用事件委托，确保在 Swup 无刷新跳转后依然有效
 */

export function initMarkdownActions() {
    if (typeof document === "undefined") return;
    // 移除旧的监听器（如果有），防止重复绑定
    // 注意：由于使用的是匿名函数且通常在页面加载时只运行一次，在 Swup 环境下只要这个脚本在主布局中加载，它就只会运行一次。
    document.addEventListener("click", function (e: MouseEvent) {
        const target = e.target as Element | null;
        if (!target) return;

        // 1. 处理复制按钮点击
        if (target.classList.contains("copy-btn") || target.closest(".copy-btn")) {
            const btn = target.classList.contains("copy-btn") ? target : target.closest(".copy-btn");
            if (!btn) return;
            
            const codeEle = btn.parentElement?.querySelector("code");

            // 精确的代码提取逻辑
            let code = '';
            if (codeEle) {
                // 获取所有代码行元素
                const lineElements = codeEle.querySelectorAll('span.line');
                // 对于有行结构的代码块，精确处理每一行
                if (lineElements.length > 0) {
                    const lines: string[] = [];
                    for (let i = 0; i < lineElements.length; i++) {
                        const lineElement = lineElements[i];
                        const lineText = lineElement.textContent || '';
                        lines.push(lineText);
                    }
                    code = lines.join('\n');
                } else {
                    const codeElements = codeEle.querySelectorAll('.code:not(summary *)');
                    if (codeElements.length > 0) {
                        const lines: string[] = [];
                        for (let i = 0; i < codeElements.length; i++) {
                            const el = codeElements[i];
                            const lineText = el.textContent || '';
                            lines.push(lineText);
                        }
                        code = lines.join('\n');
                    } else {
                        code = codeEle.textContent || '';
                    }
                }
            }

            // 处理连续空行
            code = code.replace(/\n\n\n+/g, function(match) {
                const newlineCount = match.length;
                const emptyLineCount = newlineCount - 1;
                let resultEmptyLines: number;
                if (emptyLineCount % 2 === 0) {
                    resultEmptyLines = emptyLineCount / 2;
                } else {
                    resultEmptyLines = Math.floor((emptyLineCount + 1) / 2);
                }
                if (resultEmptyLines < 1) resultEmptyLines = 1;
                return '\n'.repeat(resultEmptyLines + 1);
            });

            // 尝试多种复制方法
            const copyToClipboard = async (text: string) => {
                try {
                    await navigator.clipboard.writeText(text);
                } catch (clipboardErr) {
                    console.warn('Clipboard API 失败，尝试备用方案:', clipboardErr);
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        document.execCommand('copy');
                    } catch (execErr) {
                        console.error('execCommand 也失败了:', execErr);
                        throw new Error('所有复制方法都失败了');
                    } finally {
                        document.body.removeChild(textArea);
                    }
                }
            };

            // 调用复制函数
            copyToClipboard(code).then(() => {
                const timeoutId = btn.getAttribute("data-timeout-id");
                if (timeoutId) {
                    clearTimeout(parseInt(timeoutId));
                }
                btn.classList.add("success");
                const newTimeoutId = setTimeout(() => {
                    btn.classList.remove("success");
                }, 1000);
                btn.setAttribute("data-timeout-id", newTimeoutId.toString());
            }).catch(err => {
                console.error('复制失败:', err);
            });
        }

        // 2. 处理折叠按钮点击
        if (target.classList.contains("collapse-btn") || target.closest(".collapse-btn")) {
            const btn = target.classList.contains("collapse-btn") ? target : target.closest(".collapse-btn");
            const codeBlock = btn?.closest(".expressive-code");
            if (codeBlock) {
                codeBlock.classList.toggle("collapsed");
                codeBlock.classList.toggle("expanded");
            }
        }
    });
}
