# Blog  

A modern, feature-rich static blog template built with [Astro](https://astro.build), featuring advanced functionality and beautiful design.

[**🖥️ Live Demo**](https://blog.spr-aachen.com/) [**📝 Documentation**](https://docs.blog.spr-aachen.com/)

---

## ✨ Features

### 🎨 Design & Interface
- [x] Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
- [x] Smooth animations and page transitions using [Swup](https://swup.js.org/)
- [x] Light/dark theme switching with system preference detection
- [x] Customizable theme colors and dynamic banner carousel
- [x] Fullscreen background images with carousel, opacity, and blur effects
- [x] Fully responsive design for all devices
- [x] Beautiful typography with JetBrains Mono font

### 🔍 Content & Search
- [x] Advanced search functionality based on [Pagefind](https://pagefind.app/)
- [x] [Enhanced Markdown features](#-markdown-extensions) with syntax highlighting
- [x] Interactive table of contents with auto-scrolling
- [x] RSS feed generation
- [x] Reading time estimation
- [x] Article categorization and tagging system

### 🌐 Internationalization
- [x] **Multi-language support** with real-time translation
- [x] **Automatic language detection** based on user preferences
- [x] **Client-side translation** powered by Edge Translate
- [x] Support for 10+ languages (Chinese, English, Japanese, Korean, Spanish, etc.)

### 📱 Special Pages
- [x] **Anime Tracking Page** - Track anime watching progress and ratings
- [x] **Friends Page** - Beautiful cards showcasing friend websites
- [x] **Diary Page** - Share life moments, similar to social media
- [x] **Archive Page** - Organized timeline view of articles
- [x] **About Page** - Customizable personal introduction

### 🛠 Technical Features
- [x] **Enhanced code blocks** based on [Expressive Code](https://expressive-code.com/)
- [x] **Math formula support** with KaTeX rendering
- [x] **Image optimization** with PhotoSwipe gallery integration
- [x] **SEO optimization** including sitemaps and meta tags
- [x] **Performance optimization** with lazy loading and caching
- [x] **Comment system** with Twikoo integration


## 🚀 Quick Start

### 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Spr-Aachen/Blog.git
   cd Blog
   ```

2. **Install dependencies:**
   ```bash
   # Install pnpm if not already installed
   npm install -g pnpm
   
   # Install project dependencies
   pnpm install
   ```

3. **Configure your blog:**
   - Edit `src/config.ts` to customize blog settings
   - Update site information, theme colors, banner images, and social links
   - Configure translation settings and feature page functionality

4. **Start the development server:**
   ```bash
   pnpm dev
   ```
   Your blog will be available at `http://localhost:4321`

### 📝 Content Management

- **Create new posts:** `pnpm new-post <filename>`
- **Edit posts:** Modify files in `src/content/posts/`
- **Customize special pages:** Edit files in `src/content/spec/`
- **Add images:** Place images in `src/assets/` or `public/`

### 🚀 Deployment

Deploy your blog to any static hosting platform:

- **Vercel:** Connect your GitHub repository to Vercel
- **Netlify:** Deploy directly from GitHub
- **GitHub Pages:** Use the included GitHub Actions workflow
- **Cloudflare Pages:** Connect your repository

Before deployment, update the `site` URL in `astro.config.mjs`.


## ⚡ Commands

All commands are run from the project root:

| Command                    | Action                                   |
|:---------------------------|:-----------------------------------------|
| `pnpm install`             | Install dependencies                     |
| `pnpm dev`                 | Start local dev server at `localhost:4321` |
| `pnpm build`               | Build production site to `./dist/`       |
| `pnpm preview`             | Preview build locally before deployment  |
| `pnpm check`               | Run Astro error checking                 |
| `pnpm format`              | Format code with Biome                   |
| `pnpm lint`                | Check and fix code issues                |
| `pnpm new-post <filename>` | Create a new blog post                   |
| `pnpm astro ...`           | Run Astro CLI commands                   |


## 🙏 Acknowledgements

- Based on the original [Fuwari](https://github.com/saicaca/fuwari) template
- Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
- Inspired by [Yukina](https://github.com/WhitePaper233/yukina) - a beautiful and elegant blog template
- Translation functionality powered by [translate](https://gitee.com/mail_osc/translate) - AI i18n automatic HTML translation solution
- Icons from [Iconify](https://iconify.design/)