---
sessionID: ses_f57e95cfbffeGlEvfTbjUIt9GZ
baseMessageCount: 0
updatedAt: 2026-09-16T02:48:02.207Z
version: 1.0
date_created: 2026-09-16
owner: agent
tags: [spec, diagnostic]
---

# astro-portfolio-markdown-migration-theme

## Current spec

# Introduction
This specification defines a redesign and re-platforming of the personal portfolio/blog site at https://ahndev.com (Astro 7 repo `frontend`). Two tracks, to be implemented in order:

1. **Re-platform**: migrate the blog from Strapi CMS to local Markdown content collections (fresh start; Strapi loader, credentials, and the `marked` dependency removed entirely).
2. **Redesign**: restyle the site with a modern-minimalist, light-only theme via the `/theme-factory` skill; restructure the homepage as Hero (name + tagline) → Projects → Recent posts; replace all starter placeholders with a placeholder-free skeleton. Real personal copy is deferred to a later pass.

Implementation should land as a single verifiable change set: content layer first (build must stay green), then theme + homepage, then placeholder sweep.

## 1. Purpose & Scope
- **Audience**: site owner (ahn) maintaining a low-cost, low-maintenance personal portfolio.
- **In scope**: `src/content.config.ts`, blog collection, pages (`/`, `/about`, `/blog`, `/blog/[...slug]`), `BlogPost` layout, components (`Header`, `Footer`, `BaseHead`, `HeaderLink`, `FormattedDate`), styles (`global.css`, `reset.css`), `rss.xml.js`, `.env`, `astro.config.mjs`, `consts.ts`, `package.json`.
- **Out of scope**: final personal copy (later pass), deployment infrastructure, the Strapi server itself, domain/DNS, a dedicated Projects page.
- **Verified facts** (grounding):
  - Astro 7 + `@astrojs/mdx` + `@astrojs/sitemap` + `sharp` + `marked`; plain CSS (`global.css`, `reset.css`), no Tailwind; biome for lint/format; Node >= 22.12.
  - Blog currently loads from Strapi via a custom REST loader in `src/content.config.ts` with zod schema: `title`, `description`, `pubDate`, `updatedDate?`, `heroImage?`.
  - Pages already consume `getCollection('blog')` and `render(post)` (`/blog/[...slug].astro`) — the content-layer switch is drop-in.
  - Starter placeholders confirmed: `SITE_TITLE = 'Astro Blog'`, `SITE_DESCRIPTION = 'Welcome to my website!'`, footer "Your name here" with Astro's Mastodon/Twitter/GitHub links.
  - `BlogPost.astro` renders `heroImage` conditionally; no-heroImage posts already render correctly.

## 2. Definitions
- **Content collection**: Astro's typed local content layer (`src/content/` + `content.config.ts`).
- **Strapi**: headless CMS currently powering the blog via a REST loader — to be removed.
- **Theme-factory**: local skill (`.opencode/skills/theme-factory/`) that applies a chosen visual theme (modern minimalist, light-only) across site styles via design tokens.
- **Projects section**: a homepage block listing selected work (no separate page).
- **Placeholder-free skeleton**: real structure, navigation, empty states, and generic-but-truthful copy (e.g., site title constants), with personal details filled in later.
- **Slug**: canonical post URL segment, derived from the markdown filename (`hello-world.md` → `/blog/hello-world`).

## 3. Requirements, Constraints & Guidelines
- **REQ-001**: Replace the Strapi loader with a local Markdown/MDX `blog` content collection using a glob loader from `src/content/blog/`.
- **REQ-002**: Start fresh: no migration of Strapi posts; delete the Strapi loader and all Strapi-specific helpers (`toMarkdown`, `toAbsoluteUrl`) from `content.config.ts`.
- **REQ-003**: Keep the post schema: `title`, `description`, `pubDate`, `updatedDate?`, `heroImage?` (tags dropped). `heroImage` uses Astro's `image()` helper so images resolve through `src/assets/` and the sharp optimization pipeline.
- **REQ-004**: Apply a modern-minimalist theme across all pages using the theme-factory skill (design tokens, typography, spacing, layout polish), light mode only.
- **REQ-005**: Homepage composition, top to bottom: Hero (name + tagline) → Projects section → Recent posts (latest 3). No dedicated Projects page.
- **REQ-006**: Replace all starter placeholders (site title/description in `consts.ts`, footer name + social links, header nav labels) with truthful skeleton values; personal copy deferred.
- **REQ-007**: Footer carries GitHub + email links only (replacing the placeholder Astro links).
- **REQ-008**: RSS (`rss.xml.js`) and sitemap must continue to work after migration; an empty blog must not break them.
- **SEC-001**: Remove `.env` Strapi credentials (`STRAPI_URL`, `STRAPI_TOKEN`) and any other secrets from the repo; no runtime fetch to an external CMS.
- **CON-001**: Must stay on Astro 7 static output; no server runtime added.
- **CON-002**: Keep biome as formatter/linter; keep existing build scripts (`dev`, `build`, `preview`, `astro`).
- **CON-003**: Remove the `marked` dependency after loader removal (its only consumer is the Strapi loader, verified).
- **GUD-001**: Posts authored as `.md` or `.mdx`; canonical slug derived from the filename.
- **GUD-002**: Seed one sample post (`src/content/blog/hello-world.md`) so the blog, RSS, and detail page are non-empty and testable.
- **GUD-003**: Future-dated posts (`pubDate > now`) are filtered out of the blog index and RSS.

## 4. Interfaces & Data Contracts
- New `blog` collection (glob loader):
```ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: image().optional(),
  }),
});
```
- Example post frontmatter:
```yaml
---
title: "Post title"
description: "One-line summary"
pubDate: 2026-09-16
updatedDate: 2026-09-16
heroImage: "../../assets/hero.png"
---
```
- Projects data: typed TS array in `src/consts.ts`:
```ts
type Project = { name: string; description: string; url: string; image?: string };
export const PROJECTS: Project[] = [];
```
- Social links: typed array in `src/consts.ts` (label, url) — GitHub + email; consumed by `Footer.astro`.
- Consumers (unchanged interfaces): `/blog/index.astro`, `/blog/[...slug].astro`, `rss.xml.js`, and `BlogPost.astro` via `getCollection('blog')`. Homepage Recent posts uses `getCollection('blog')`, sorted by `pubDate` descending, sliced to 3.

## 5. Acceptance Criteria
- **AC-001**: Given the repo, When `astro build` runs, Then it succeeds with zero Strapi fetches and no `STRAPI_` env variables required.
- **AC-002**: Given the seeded post in `src/content/blog/`, When `/blog/hello-world` is visited, Then it renders with title, formatted date, description, and optional hero image.
- **AC-003**: Given `/blog` index, When visited, Then posts list in descending `pubDate` order; an empty blog shows a graceful empty state.
- **AC-004**: Given the theme applied, When viewing `/`, `/about`, `/blog`, Then visual style is token-consistent and responsive at mobile/tablet/desktop widths.
- **AC-005**: Given `/rss.xml`, When fetched, Then items match published markdown posts (non-empty with the seeded post).
- **AC-006**: Given any page, When inspected, Then no starter placeholder remains (no "Astro Blog" title, no "Your name here", no Astro social links).
- **AC-007**: Given the homepage, When viewed, Then sections render in order: hero (name + tagline), Projects, Recent posts (≤ 3, descending `pubDate`); the Projects section is hidden when `PROJECTS` is empty.
- **AC-008**: Given a repo-wide grep for `STRAPI` or `marked`, When run, Then no runtime references remain and `marked` is absent from `package.json`.
- **AC-009**: Given a post with `pubDate` in the future, When the blog index or RSS is generated, Then that post is excluded.

## 6. Test Automation Strategy
- **Build-level validation**: `astro build` — collection schema violations fail the build automatically.
- **Content checks**: small Node script or CI step asserting every post has `title`, `description`, `pubDate`; slugs unique.
- **Visual QA**: dev-server screenshots at 3 breakpoints (mobile/tablet/desktop); no formal unit test framework exists — rely on build + biome.
- **Placeholder sweep**: grep-based check for known placeholder strings ("Astro Blog", "Your name here", "Welcome to my website!").

## 7. Rationale & Context
- **Static markdown over CMS**: removes the runtime dependency on a CMS and matches the low-maintenance reality — content as files in git is the lowest-friction authoring path. Since the blog had no real published content, a fresh start beats a migration script.
- **Keep the schema (minus tags)**: makes the page/layout/RSS switch nearly drop-in; `image()` reuses the already-installed sharp pipeline for optimized hero images.
- **Homepage hero + Projects + Recent posts**: balances portfolio signaling with blog visibility in a single, viewport-anchored flow; avoids adding a fourth route.
- **Light-only**: avoids toggle state, FOUC handling, and duplicate token sets — aligns with minimalist intent.
- **GitHub + email**: minimal credible contact set; no personal handles were committed, so the skeleton ships with owner-replaceable constants in `consts.ts`.
- **theme-factory over hand-rolled CSS**: restyle is token-driven and consistent across pages.
- **Trade-off**: losing Strapi's admin UI (rich editing, media library) — accepted given low publish frequency and the preference for git-based writing.

## 8. Dependencies & External Integrations
- **EXT-001**: Astro 7 content layer + glob loader + `image()` helper (built-in; no new dependency).
- **EXT-002**: `sharp` / `@astrojs` assets for hero image optimization (already installed).
- **EXT-003**: theme-factory skill (`.opencode/skills/theme-factory/SKILL.md`) for style generation.
- **EXT-004**: Existing Strapi deployment: no runtime integration after migration (reference only).
- **EXT-005**: Biome lint/format unchanged.

## 9. Examples & Edge Cases
- **Slug rule**: `src/content/blog/hello-world.md` → `/blog/hello-world`; `...slug.astro` resolves via `getCollection` + id match.
- **Post without heroImage**: layout renders without the image block (existing conditional already handles this).
- **MDX post using Astro components**: supported via the existing mdx integration.
- **Future-dated post**: filtered from index and RSS (GUD-003).
- **Zero blog posts**: homepage Recent posts section hidden or empty-state; no build error.
- **Project without image**: text-only card variant; empty `PROJECTS` array → section hidden.
- **Light-only theme**: tokens defined once; no `prefers-color-scheme` handling.

## 10. Validation Criteria
- `astro build` + `astro preview` smoke pass.
- All AC-001…AC-009 verified; content lint script green.
- Biome check clean; no `STRAPI_` references in `src/`, `.env`, or config; `marked` removed from `package.json`.
- Responsive + contrast spot-check after the theme-factory pass.
- Placeholder sweep clean.

## 11. Related Specifications / Further Reading
- `AGENTS.md` (dev server conventions: `astro dev --background`).
- Astro docs: content collections, MDX, assets.
- theme-factory skill docs (`.opencode/skills/theme-factory/SKILL.md`).
- Interview transcript: `interview/okay-this-is-my-portfolio-website-which-i-haven--b84d7df0-434d-44d8-89f0-2414331eb225.md`.
