---
title: Guide for Blog Template
published: 2001-10-02
description: "How to use this blog template."
cover: "./cover.webp"
pinned: true
tags: []
category: Guides
draft: false
---


Tip: For the things that are not mentioned in this guide, you may find the answers in the [Astro Docs](https://docs.astro.build/).


## Front-matter of Posts

```yaml
---
title: My First Blog Post
published: 2020-02-02
description: This is the first post of my new Astro blog.
cover: ./cover.webp
tags: [Foo, Bar]
category: Front-end
draft: false
---
```


| Attribute     | Description   |
|---------------|---------------|
| `title`       | The title of the post. |
| `published`   | The date the post was published. |
| `pinned`      | Whether this post is pinned to the top of the post list. |
| `description` | A short description of the post. Displayed on index page. |
| `cover`       | The cover image path of the post. <br/>1. Start with `http://` or `https://`: For web image <br/>2. Start with `/`: For image in `public` dir <br/>3. With none of the prefixes: Relative to the markdown file |
| `tags`        | The tags of the post. |
| `category`    | The category of the post. |
| `licenseName` | The license name for the post content. |
| `author`      | The author of the post. |
| `sourceLink`  | The source link or reference for the post content. |
| `draft`       | If this post is still a draft, which won't be displayed. |


## Where to Place the Post Files

Your post files should be placed in `src/content/posts/` directory. You can also create sub-directories to better organize your posts and assets.

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```