---
title: Guide for Blog Template
published: 2001-10-02
description: "How to use this blog template."
cover: "./cover.jpg"
coverInContent: false
pinned: true
tags: []
category:
    - Guides:
        - Getting Started
draft: false
---


Tip: For the things that are not mentioned in this guide, you may find the answers in the [Astro Docs](https://docs.astro.build/).


## Front-matter of Posts

```yaml
---
title: My First Blog Post
published: 2020-02-02
description: This is the first post of my new Astro blog.
cover: ./cover.jpg
coverInContent: false
tags: []
category: Guides
comment: true
draft: false
---
```


| Attribute        | Description      |
|------------------|------------------|
| `title`          | The title of the post. |
| `published`      | The date the post was published. |
| `pinned`         | Whether this post is pinned to the top of the post list. |
| `description`    | A short description of the post. Displayed on index page. |
| `cover`          | The cover image path of the post. <br/>1. Start with `http://` or `https://`: For web image <br/>2. Start with `/`: For image in `public` dir <br/>3. With none of the prefixes: Relative to the markdown file |
| `coverInContent` | Whether to show the cover image in the post content. |
| `tags`           | The tags of the post. |
| `category`       | The category of the post <br/>1. Single category: `category: Guides` <br/>2. Multi-category: `category: [Guides, Getting Started]` |
| `licenseName`    | The license name for the post content. |
| `author`         | The author of the post. |
| `sourceLink`     | The source link or reference for the post content. |
| `comment`        | Whether to enable comment for this post. Default is `true`. |
| `draft`          | If this post is still a draft, which won't be displayed. |


## Where to Place the Post Files

Your post files should be placed in `src/content/posts/` directory. You can also create sub-directories to better organize your posts and assets.

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.jpg
    └── index.md
```