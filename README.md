# ahndev — personal portfolio & blog

Personal site for [ahndev.com](https://ahndev.com): a static Astro 7 portfolio with a git-based markdown blog. No CMS, no server runtime — content lives in this repo as files.

## Stack

- [Astro 7](https://docs.astro.build) (static output) + MDX, sitemap, RSS
- Local content collections (glob loader) — previously Strapi CMS, now markdown files in git
- Modern-minimalist light-only theme, token-driven (`src/styles/global.css`)
- [Biome](https://biomejs.dev) for lint/format; Node >= 22.12
- Google Analytics (gtag, in `src/components/BaseHead.astro`)

## Getting started

```sh
npm install
npm run dev
```

When using the OpenCode agent, start the dev server in background mode: `astro dev --background` (manage with `astro dev stop` / `status` / `logs`).

## Writing a post

1. Create `src/content/blog/<slug>.md` (or `.mdx`). The filename is the URL slug: `my-post.md` → `/blog/my-post`.
2. Add frontmatter:

```yaml
---
title: "Post title"
description: "One-line summary"
pubDate: 2026-09-16
updatedDate: 2026-09-16   # optional
heroImage: "../../assets/cover.webp"   # optional, from src/assets/
---
```

3. Write markdown. Images referenced from `src/assets/` are auto-optimized by sharp:

```markdown
![Screenshot of the setup](../../assets/screenshot.png)
```

Notes:

- Hero and body images go in `src/assets/` (optimized). `public/` is only for verbatim files (`favicon`, `robots.txt`).
- Future-dated posts (`pubDate > now`) are hidden from the blog index and RSS until their date arrives.
- Homepage shows the latest 3 posts; the full list is at `/blog`.

## Site data

Site constants (title, description, contact email, projects, social links) live in `src/consts.ts`:

- `PROJECTS: Project[]` — shown on the homepage Projects section (hidden while empty)
- `SOCIAL_LINKS` — GitHub + email links in the footer
- `CONTACT_EMAIL` — replace `hello@ahndev.com` with your real address

## Build & SEO

| Command          | Action                                        |
| :--------------- | :-------------------------------------------- |
| `npm run build`  | Production build to `./dist/`                 |
| `npm run preview`| Preview the build locally                     |
| `npx biome check`| Lint/format check                             |

The build generates `sitemap-index.xml` + `sitemap-0.xml` and `public/robots.txt` points Google at it. RSS feed at `/rss.xml`. If Google Search Console can't discover the sitemap, check that the deployed `robots.txt` actually serves the `Sitemap:` line (Cloudflare may serve its own managed robots.txt) or submit the sitemap manually.

## Structure

```text
├── public/            # verbatim static files (favicon, robots.txt)
├── src/
│   ├── assets/        # optimized images (sharp via Astro image())
│   ├── content/blog/  # blog posts (markdown/MDX, glob collection)
│   ├── components/    # Header, Footer, BaseHead (meta/OG/analytics)
│   ├── layouts/       # BlogPost layout
│   ├── pages/         # /, /about, /blog, /blog/[...slug], rss.xml
│   ├── styles/        # design tokens (global.css) + reset
│   └── consts.ts      # site title/description, projects, social links
└── astro.config.mjs   # site URL, mdx + sitemap integrations
```
