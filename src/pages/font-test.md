---
title: 字体测试页面
---

# 字体测试

这是一个用于测试 Hanalei 字体的页面。

## 测试内容

- 英文：The quick brown fox jumps over the lazy dog
- 中文：快速的棕色狐狸跳过懒狗
- 数字：1234567890
- 符号：!@#$%^&*()

## 启用 Hanalei 字体

要启用 Hanalei 字体，请在 [config.ts](../config.ts) 文件中将 `hanalei.enable` 设置为 `true`：

```ts
font: {
  zenMaruGothic: {
    enable: true, // 启用全局圆体
  },
  hanalei: {
    enable: true, // 启用 Hanalei 字体作为全局字体
  },
},
```

请注意，Hanalei 字体文件应位于 `/public/assets/font/Hanalei.woff2`。