---
title: Guide for Blog Template
published: 2020-02-02
description: "How to use this blog template."
image: "./cover.webp"
tags: []
category: Guides
draft: false
series: ""
---


Tip: For the things that are not mentioned in this guide, you may find the answers in the [Astro Docs](https://docs.astro.build/).


## Front-matter of Posts

```yaml
---
title: My First Blog Post
published: 2020-02-02
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
series: "Mizuki"
---
```


| Attribute     | Description                                                                                                                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`       | The title of the post.                                                                                                                                                                                      |
| `published`   | The date the post was published.                                                                                                                                                                            |
| `pinned`      | Whether this post is pinned to the top of the post list.                                                                                                                                                   |
| `description` | A short description of the post. Displayed on index page.                                                                                                                                                   |
| `image`       | The cover image path of the post.<br/>1. Start with `http://` or `https://`: Use web image<br/>2. Start with `/`: For image in `public` dir<br/>3. With none of the prefixes: Relative to the markdown file |
| `tags`        | The tags of the post.                                                                                                                                                                                       |
| `category`    | The category of the post.                                                                                                                                                                                   |
| `licenseName` | The license name for the post content.                                                                                                                                                                      |
| `author`      | The author of the post.                                                                                                                                                                                     |
| `sourceLink`  | The source link or reference for the post content.                                                                                                                                                          |
| `draft`       | If this post is still a draft, which won't be displayed.                                                                                                                                                    |


## Where to Place the Post Files

Your post files should be placed in `src/content/posts/` directory. You can also create sub-directories to better organize your posts and assets.

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```


## 🧩 Markdown Extensions

Enhanced features beyond standard GitHub Flavored Markdown are supported as below:

### 📝 Enhanced Writing
- **Callouts:** Create beautiful annotation boxes using `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, etc.
- **Math Formulas:** Write LaTeX math formulas using `$inline$` and `$$block$$` syntax
- **Code Highlighting:** Advanced syntax highlighting with line numbers and copy buttons
- **GitHub Cards:** Embed repository cards using `::github{repo="user/repo"}`

### 🎨 Visual Elements
- **Image Gallery:** Automatic PhotoSwipe integration for image viewing
- **Collapsible Sections:** Create expandable content blocks
- **Custom Components:** Enhance content with special directives

### 📊 Content Organization
- **Table of Contents:** Automatically generated from headings with smooth scrolling
- **Reading Time:** Automatically calculated and displayed
- **Article Metadata:** Rich frontmatter support with categories and tags