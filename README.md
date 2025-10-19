<div align = "center">

# Twilight

<table style="width: 100%; table-layout: fixed;">
   <tr>
      <td colspan="5"><img alt="Desktop" src="docs/image/Desktop.jpg" style="max-width: 100%;"></td>
   </tr>
   <tr>
      <td><img alt="Mobile_4" src="docs/image/Mobile_4.jpg" style="max-width: 100%;"></td>
      <td><img alt="Mobile_2" src="docs/image/Mobile_2.jpg" style="max-width: 100%;"></td>
      <td><img alt="Mobile_1" src="docs/image/Mobile_1.jpg" style="max-width: 100%;"></td>
      <td><img alt="Mobile_3" src="docs/image/Mobile_3.jpg" style="max-width: 100%;"></td>
      <td><img alt="Mobile_5" src="docs/image/Mobile_5.jpg" style="max-width: 100%;"></td>
   </tr>
</table>

A CMS integrated static blog template built with [Astro](https://astro.build) framework.

[**🖥️ Live Demo**](https://twilight.spr-aachen.com)
[**📝 Documentation**](https://docs.twilight.spr-aachen.com)

English | [**中文**](docs/README_ZH.md)

</div>

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Spr-Aachen/Twilight.git
   cd Twilight
   ```

2. **Install dependencies:**
   ```bash
   # Install pnpm if not already installed
   npm install -g pnpm
   
   # Install project dependencies
   pnpm install
   ```

3. **Configure your blog:**
   - [Edit `src/config.ts` to customize blog settings](https://docs.twilight.spr-aachen.com/config/core)
   - [Configure `.env` to support CMS functionality](https://docs.twilight.spr-aachen.com/config/cms)
   - [Update site information inside `src/data`](https://docs.twilight.spr-aachen.com/config/data)

4. **Start the development server:**
   ```bash
   pnpm dev
   ```


## 🚀 Deployment

Deploy your blog to any static hosting platform


## ⚡ Commands

| Command                    | Action                                  |
|:---------------------------|:----------------------------------------|
| `pnpm install`             | Install dependencies                    |
| `pnpm dev`                 | Start local dev server                  |
| `pnpm build`               | Build production site to `./dist/`      |
| `pnpm preview`             | Preview build locally before deployment |
| `pnpm check`               | Run Astro error checking                |
| `pnpm format`              | Format code with Biome                  |
| `pnpm lint`                | Check and fix code issues               |
| `pnpm new-post <filename>` | Create a new blog post                  |
| `pnpm astro ...`           | Run Astro CLI commands                  |


## 🙏 Acknowledgements

- Based on the original [Fuwari](https://github.com/saicaca/fuwari) template
- Inspired by [Mizuki](https://github.com/matsuzaka-yuki/Mizuki) template
- CMS functionality powered by [astro-decap-cms-oauth](https://github.com/dorukgezici/astro-decap-cms-oauth)
- Translation functionality powered by [translate](https://gitee.com/mail_osc/translate)