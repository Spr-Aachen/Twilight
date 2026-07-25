---
title: Copy Protection Example
published: 2022-11-01
description: This post demonstrates the copyProtection frontmatter option with granular controls.
pinned: false
tags: [Copy Protection]
category: Examples
draft: false
copyProtection:
    blockSelection: true
    blockClipboard: true
    blockContextMenu: true
    blockDevTools: true
---

# Post with Copy Protection Enabled

This post has all four `copyProtection` sub-options enabled in its frontmatter:

```yaml
copyProtection:
    blockSelection: true
    blockClipboard: true
    blockContextMenu: true
    blockDevTools: true
```

The following protections are active on this page:

- **Block Selection** — Text selection is disabled via `user-select: none`.
- **Block Clipboard** — `copy`, `cut`, and `paste` events are intercepted and prevented.
- **Block Context Menu** — Right-clicking is disabled.
- **Block DevTools** — `F12`, `Ctrl+U` (view source), and `Ctrl+S` (save page) are blocked.

## Options

| Option | Description |
|---|---|
| `blockSelection` | Disable text selection |
| `blockClipboard` | Block copy/cut/paste events |
| `blockContextMenu` | Block right-click menu |
| `blockDevTools` | Block F12 / Ctrl+U / Ctrl+S |

All sub-options default to `false` — enable only the protections you need.

## Try It

Try selecting text, right-clicking, pressing `Ctrl+C`, or hitting `F12` on this page — you'll find all of these actions are blocked.