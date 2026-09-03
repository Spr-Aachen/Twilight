<div align = "center">

# Twilight

一个支持后台管理的静态博客主题模板，基于 Astro 框架打造

[**🖥️ 演示**](https://twilight.spr-aachen.com)
[**📝 文档**](https://docs.twilight.spr-aachen.com)

[![Bilibili](https://img.shields.io/badge/Bilibili-Intro-blue?logo=Bilibili)](https://space.bilibili.com/359461611/lists/6641229)&nbsp;
[![YouTube](https://img.shields.io/badge/YouTube-Intro-red?logo=YouTube)](https://youtube.com/playlist?list=PLzjq8Hx1SRV7yqZQiACcCJmKPeg5D8JKe&si=Bcz2o0PF8MFvx8ec)

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

### 内容管理
- **CMS 集成**: 基于无头 CMS 的便捷内容管理
- **置顶与草稿**: 置顶重要文章，草稿隐藏于生产环境
- **加密文章**: 支持 AES 密码加密的文章保护
- **自动化导航**: 自动生成文章导航、归档和目录
- **数据可视化**: 项目、技能、历程等个人数据展示

### 内容页面
- **博客文章**: 完整的 Markdown 博客系统，支持标签和分类
- **项目与技能展柜**: 可视化的个人作品集展示
- **历程时间线**: 教育、工作、成就、技能等生平展示
- **日记**: 短形式的社交风格随笔
- **相册**: 图片画廊与 Fancybox 灯箱集成
- **友情链接**: 带图标和描述的友链交换页面
- **RSS 与 Atom**: 专用信息页与自动生成的 XML 订阅文件

### Markdown 增强
- **GitHub 仓库卡片**: 通过 `::github{repo="..."}` 嵌入仓库信息
- **音乐卡片**: 通过 `::music{...}` 嵌入内联播放器与歌词
- **提示块**: 支持 Note、Tip、Warning、Caution 样式
- **代码块增强**: 复制按钮、折叠、行号、语言标签
- **Mermaid 图表**: 渲染 ` ```mermaid ` 代码块为图表
- **KaTeX 数学公式**: 支持 `$...$` 和 `$$...$$` 公式渲染

### UI 组件
- **加载遮罩**: 可配置的启动加载页与动画
- **侧栏系统**: 可配置的资料、公告、目录、分类、标签、统计等侧栏挂件
- **站点统计**: 集成 Umami 访客统计
- **评论系统**: 集成 Waline、Twikoo 评论服务
- **音乐播放器**: 支持 Meting API 或本地歌单
- **看板娘控件**: 可交互的 Live2D 角色

### 视觉特效
- **平滑过渡动画**: 精心设计的页面组件过渡动画
- **自定义主题色**: 可实时调整的个性化配色方案
- **动态壁纸系统**: 拥有多种显示模式的轮播壁纸
- **动态粒子系统**: 可高度自定义的动画粒子特效
- **自定义字体**: 支持 CSS 链接或本地字体文件

### 兼容适配
- **响应式设计**: 支持桌面端、移动端无缝切换
- **多语言能力**: 3 种 UI 语言 (中/英/日) 与 12+ 种页面翻译
- **多平台部署**: 适配 Cloudflare、Netlify、Vercel、EdgeOne 等静态托管平台
- **Docker 支持**: 即用型 Docker 和 docker-compose 配置


## 💻 调试

### 0. Fork 仓库
   点击右上角的 `Fork` 按钮，将仓库 Fork 到自己的 GitHub 账户下

### 1. 克隆仓库
   点击 `Code` -> `Open with GitHub Desktop`，或者执行 `git clone <仓库地址>` (需要安装 Git)

### 2. 安装依赖
   在项目目录下执行以下命令：
   ```bash
   # 安装 pnpm 如果未安装
   npm install -g pnpm
   # 安装项目依赖
   pnpm install
   ```

### 3. 配置博客
   - 在 `twilight.config.yaml` 中 [自定义博客设置](https://docs.twilight.spr-aachen.com/config/core)
   - 在 `src/content` 中 [管理站点内容](https://docs.twilight.spr-aachen.com/config/content)

### 4. 本地调试
   在项目目录下执行以下命令：
   ```bash
   pnpm dev
   ```


## 🚀 部署

将博客部署到任意静态托管平台

PS: 经用户反馈，目前包括 ESA 在内的部分平台无法正常使用后台功能，**请尽量选择 GitHub, Cloudflare, Netify, Vercel 等[推荐部署的平台](https://docs.twilight.spr-aachen.com/guide/deployment/)**


## ⚡ 命令

| 指令                       | 说明                      |
|:---------------------------|:-------------------------|
| ~~`pnpm lint`~~            | ~~检查并修复代码问题~~     |
| ~~`pnpm format`~~          | ~~使用 Biome 格式化代码~~  |
| `pnpm check`               | 运行 Astro 错误检查       |
| `pnpm dev`                 | 启动本地服务器             |
| `pnpm build`               | 构建站点到 `./dist/`      |
| `pnpm preview`             | 预览本地构建结果           |
| `pnpm astro ...`           | 运行 `Astro CLI` 命令     |
| `pnpm new-post <filename>` | 创建新博客文章             |


## 🙏 致谢

- 原型 - [Fuwari](https://github.com/saicaca/fuwari)
- 灵感 - [Yukina](https://github.com/WhitePaper233/yukina) & [Mizuki](https://github.com/matsuzaka-yuki/Mizuki)
- 翻译 - [translate](https://gitee.com/mail_osc/translate)