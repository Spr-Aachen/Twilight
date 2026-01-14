<div align = "center">

# Twilight

一个基于 Astro 框架打造的支持后台管理的静态博客模板

[![Bilibili](https://img.shields.io/badge/Bilibili-v1.0%20Intro-blue?logo=Bilibili&style=for-the-badge)](https://www.bilibili.com/video/BV18VsUzNEmL)&nbsp;
[![YouTube](https://img.shields.io/badge/YouTube-v1.0%20Intro-red?logo=YouTube&style=for-the-badge)](https://www.youtube.com/watch?v=SdpYpg_EzNg)

[**🖥️ 演示**](https://twilight.spr-aachen.com)
[**📝 文档**](https://docs.twilight.spr-aachen.com)

<table style="width: 100%; table-layout: fixed;">
   <tr>
      <td colspan="5"><img alt="Desktop" src="image/Desktop.jpg" style="max-width: 100%;"></td>
   </tr>
   <tr>
      <td><img alt="Mobile_4" src="image/Mobile_4.jpg" style="max-width: 100%;"></td>
      <td><img alt="Mobile_2" src="image/Mobile_2.jpg" style="max-width: 100%;"></td>
      <td><img alt="Mobile_1" src="image/Mobile_1.jpg" style="max-width: 100%;"></td>
      <td><img alt="Mobile_3" src="image/Mobile_3.jpg" style="max-width: 100%;"></td>
      <td><img alt="Mobile_5" src="image/Mobile_5.jpg" style="max-width: 100%;"></td>
   </tr>
</table>

</div>

---

<div align = "center">

[**English**](../README.md) | 中文

</div>


## ✨ 特性

### 内容
- **CMS 功能**: 基于 Decap CMS 的便捷内容管理
- **数据可视化**: 可视化的项目、技能等个人数据
- **自动化导航**: 自动化生成的文章导航

### 组件
- **站点统计**: 集成 Umami 访客统计的站点分析
- **评论系统**: 基于 Twikoo 的评论功能
- **音乐播放器**: 背景音乐播放和播放列表管理
- **看板娘插件**: 可交互的 live2d 角色

### 视效
- **平滑过渡动画**: 精心设计的页面组件过渡动画
- **自定义主题色**: 可实时调整的个性化配色方案
- **动态壁纸系统**: 拥有多种显示模式的轮播壁纸
- **动态粒子系统**: 可高度自定义的动画粒子特效

### 适配
- **响应式设计**: 支持桌面端、移动端无缝切换
- **多语言能力**: 内置翻译功能，方便全球访问


## 📦 安装

1. **克隆仓库**
   ```bash
   git clone https://github.com/Spr-Aachen/Twilight.git
   cd Twilight
   ```

2. **安装依赖**
   ```bash
   # Install pnpm if not already installed
   npm install -g pnpm
   
   # Install project dependencies
   pnpm install
   ```

3. **配置博客**
   - 在 `src/config.ts` 中 [自定义博客设置](https://docs.twilight.spr-aachen.com/config/core)
   - 在 `.env` 中 [配置 CMS 功能](https://docs.twilight.spr-aachen.com/config/cms)
   - 在 `.env` 中 [配置站点统计功能](https://docs.twilight.spr-aachen.com/config/analytics)
   - 在 `src/data` 中 [更新站点信息](https://docs.twilight.spr-aachen.com/config/data)

4. **本地调试**
   ```bash
   pnpm dev
   ```


## 🚀 部署

将你的博客部署到任何静态托管平台


## ⚡ 命令

| 指令                       | 说明                      |
|:---------------------------|:-------------------------|
| `pnpm lint`                | 检查并修复代码问题         |
| `pnpm format`              | 使用 Biome 格式化代码      |
| `pnpm check`               | 运行 Astro 错误检查       |
| `pnpm dev`                 | 启动本地服务器             |
| `pnpm build`               | 构建站点到 `./dist/`      |
| `pnpm preview`             | 预览本地构建结果           |
| `pnpm astro ...`           | 运行 `Astro CLI` 命令     |
| `pnpm new-post <filename>` | 创建新博客文章             |


## 🙏 致谢

- 原型 - [Fuwari](https://github.com/saicaca/fuwari)
- 灵感 - [Yukina](https://github.com/WhitePaper233/yukina) & [Mizuki](https://github.com/matsuzaka-yuki/Mizuki)
- CMS - [astro-decap-cms-oauth](https://github.com/dorukgezici/astro-decap-cms-oauth)
- 翻译 - [translate](https://gitee.com/mail_osc/translate)


## 🤝 支持

本项目由阿里云ESA提供加速、计算和保护
<a href="https://esa.console.aliyun.com/">
   <img src="https://img.alicdn.com/imgextra/i3/O1CN01H1UU3i1Cti9lYtFrs_!!6000000000139-2-tps-7534-844.png" href="https://esa.console.aliyun.com/" alt="阿里云ESA支持" style="max-width: 100%; height: auto;">
</a>