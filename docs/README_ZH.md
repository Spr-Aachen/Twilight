<div align = "center">

# Twilight

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

一个带后台管理系统的静态博客模板，基于 [Astro](https://astro.build) 框架打造

[**🖥️ 演示**](https://twilight.spr-aachen.com)
[**📝 文档**](https://docs.twilight.spr-aachen.com)

[**English**](../README.md) | 中文

</div>

---

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
   - [编辑 `src/config.ts` 自定义博客设置](https://docs.twilight.spr-aachen.com/config/core)
   - [配置 `.env` 支持 CMS 功能](https://docs.twilight.spr-aachen.com/config/cms)
   - [更新 `src/data` 中的站点信息](https://docs.twilight.spr-aachen.com/config/data)

4. **本地调试**
   ```bash
   pnpm dev
   ```


## 🚀 部署

将你的博客部署到任何静态托管平台


## ⚡ 命令

| 指令                       | 说明                      |
|:---------------------------|:-------------------------|
| `pnpm install`             | 安装依赖                  |
| `pnpm dev`                 | 启动本地服务器             |
| `pnpm build`               | 构建站点到 `./dist/`      |
| `pnpm preview`             | 在部署前本地预览构建       |
| `pnpm check`               | 运行 Astro 错误检查       |
| `pnpm format`              | 使用 Biome 格式化代码      |
| `pnpm lint`                | 检查并修复代码问题         |
| `pnpm new-post <filename>` | 创建新博客文章             |
| `pnpm astro ...`           | 运行 `Astro CLI` 命令     |


## 🙏 致谢

- 基于原版的 [Fuwari](https://github.com/saicaca/fuwari) 模板二次开发
- 灵感来源于 [Mizuki](https://github.com/matsuzaka-yuki/Mizuki) 模板
- CMS 功能由 [astro-decap-cms-oauth](https://github.com/dorukgezici/astro-decap-cms-oauth) 提供
- 翻译功能由 [translate](https://gitee.com/mail_osc/translate) 提供