<div align = "center">

# Twilight

A CMS integrated static blog template built with [Astro](https://astro.build) framework.

[![Bilibili](https://img.shields.io/badge/Bilibili-v1.0%20Intro-blue?logo=Bilibili&style=for-the-badge)](https://www.bilibili.com/video/BV18VsUzNEmL)&nbsp;
[![YouTube](https://img.shields.io/badge/YouTube-v1.0%20Intro-red?logo=YouTube&style=for-the-badge)](https://www.youtube.com/watch?v=SdpYpg_EzNg)

[**🖥️ Live Demo**](https://twilight.spr-aachen.com)
[**📝 Documentation**](https://docs.twilight.spr-aachen.com/en)

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

</div>

---

<div align = "center">

English | [**中文**](docs/README_ZH.md)

</div>


## ✨ Features

### Content
- **CMS Functionality**: Easy content management with Decap CMS integration
- **Data Visualization**: Visualized personal data like projects, skills etc.
- **Automatic Navigation**: Automatic generation of post navigation

### Components
- **Analytics Support**: Umami analytics integration for visitor insights
- **Comment System**: Twikoo-powered comment functionality
- **Music Player**: Background music support with playlist management
- **PIO Widget**: Interactive live2d character support

### VFX
- **Smooth Transition Animations**: Polished page component transition animations
- **Customizable Theme Colors**: Realtime customizable color schemes
- **Dynamic Wallpaper System**: Carousel support with multiple display modes
- **Immersive Particle Effects**: Highly customizable animated particles

### Compability
- **Modern & Responsive Design**: Fully optimized for desktop and mobile devices
- **Multilingual Capability**: Built-in translation functionality for global accessibility


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
   - [Customize blog settings](https://docs.twilight.spr-aachen.com/en/config/core) inside `src/config.ts`
   - [Support CMS functionality](https://docs.twilight.spr-aachen.com/en/config/cms) inside `.env`
   - [Support Umami analytics](https://docs.twilight.spr-aachen.com/en/config/analytics) inside `.env`
   - [Update site information](https://docs.twilight.spr-aachen.com/en/config/data) inside `src/data`

4. **Start the development server:**
   ```bash
   pnpm dev
   ```


## 🚀 Deployment

Deploy your blog to any static hosting platform


## ⚡ Commands

| Command                     | Action                      |
|:----------------------------|:----------------------------|
| `pnpm lint`                 | Check and fix code issues   |
| `pnpm format`               | Format code with Biome      |
| `pnpm check`                | Run Astro error checking    |
| `pnpm dev`                  | Start local dev server      |
| `pnpm build`                | Build site to `./dist/`     |
| `pnpm preview`              | Preview build locally       |
| `pnpm astro ...`            | Run Astro CLI commands      |
| `pnpm new-post <filename>`  | Create a new blog post      |


## 🙏 Acknowledgements

- Prototype   - [Fuwari](https://github.com/saicaca/fuwari)
- Inspiration - [Yukina](https://github.com/WhitePaper233/yukina) & [Mizuki](https://github.com/matsuzaka-yuki/Mizuki)
- CMS         - [astro-decap-cms-oauth](https://github.com/dorukgezici/astro-decap-cms-oauth)
- Translation - [translate](https://gitee.com/mail_osc/translate)


## 🤝 Support

This project is supported by Alibaba Cloud ESA for accelerated delivery, compute, and protection.
<a href="https://esa.console.aliyun.com/">
   <img src="https://img.alicdn.com/imgextra/i3/O1CN01H1UU3i1Cti9lYtFrs_!!6000000000139-2-tps-7534-844.png" alt="Alibaba Cloud ESA Support" style="max-width: 100%; height: auto;">
</a>