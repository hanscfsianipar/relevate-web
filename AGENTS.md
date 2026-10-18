# AGENTS.md

Instructions for AI agents (Claude, Codex, Cursor, whatever your team uses) working on this repository.

Read in this order: **AGENTS.md** (rules and map), **README.md** (setup and operations), **TEAM.md** (human onboarding).

Project: relevate.id, a bilingual marketing site. Owner: Hans. People working here: Hans, Timothy Indarto, Muhammad Disha.

---

## 1. Stack and where things run

| Layer | Technology | Where |
| --- | --- | --- |
| App | Next.js 16 App Router, React 19, Tailwind v4, TypeScript | This repo |
| Copy | next-intl, Indonesian and English | `messages/id.json`, `messages/en.json` |
| Content | Sanity CMS, project `pcx1y31m`, dataset `production` | Studio at `/studio` and sanity.io |
| Email | Resend, form endpoint `/api/contact` | Vercel env |
| Hosting | Vercel, Hobby plan | Project `relevate-web` |
| CI/CD | GitHub Actions | `.github/workflows/deploy.yml`, `preview.yml` |

Deployment is **not** done by Vercel's Git integration. `vercel.json` sets `git.deploymentEnabled: false`. Every deploy goes through GitHub Actions. Never re-enable Git auto-deploy without asking.

---

## 2. Hard rules (breaking these breaks production or SEO)

1. **Bilingual parity.** Every user-facing string exists in Indonesian and English. If you touch `messages/id.json`, you must update `messages/en.json` in the same commit. If you touch a Sanity document, fill both `id` and `en` objects. Half-translated pages are a bug, not a draft.
2. **No em dashes** in any user-facing text. Use comma, colon, or a period.
3. **Never invent facts.** No fabricated statistics, client names, quotes, certifications, or testimonials. If a number is unknown, write a marker: `[ISI: angka baseline]` in Indonesian copy, `[FILL: baseline number]` in English copy. Markers are expected in drafts and must be resolved before the page is promoted as final.
4. **Every image needs a source.** In Sanity, an image without `imageSourceName` or `imageAlt` fails validation on purpose. Do not bypass it by deleting the field or publishing with empty values.
5. **Never commit secrets.** No tokens, no `.env` values, no keys in code, comments, fixtures, or PR descriptions. Env values live in Vercel. If an agent needs to write to Sanity, each person creates their own token in Sanity manage under API, role Editor, and keeps it in their local `.env.local`. Never reuse someone else's token, never commit it, never paste it into a PR.
6. **Do not touch these without explicit instruction from Hans:** `.github/workflows/`, `vercel.json`, `next.config.ts` `images.remotePatterns`, `lib/sanity/client.ts` (`fetchList`/`fetchOne`), `proxy.ts`, `i18n/routing.ts`, `schemas/actions/`.
7. **URLs are permanent.** Do not change `slug.current` or `shortId` on a published document. `shortId` formats are `a001` (insight), `cs001` (case study), `ex001` (experience) and they are embedded in canonical URLs.
8. **Two layout trees.** `app/[locale]/layout.tsx` covers `/id/...` and `/en/...`. `app/page.tsx` is the `/` language picker with its own `<html>`. Anything site-wide (script, meta, fonts, providers, analytics) must go into both.

---

## 3. Repository map

```
app/
  page.tsx                       "/" language picker, own layout tree
  [locale]/layout.tsx            shared layout for /id and /en
  [locale]/page.tsx              home page (reads homePage doc, falls back to messages)
  [locale]/about/page.tsx        about (reads aboutPage, fallback copy inline)
  [locale]/services/page.tsx     services overview (servicesPage doc + inline fallback)
  [locale]/services/[slug]/      service detail, slug from routing, inline fallback per service
  [locale]/case-studies/         list and detail (caseStudy docs)
  [locale]/insights/             list and detail (insight docs)
  [locale]/experience/           list and detail (experience docs)
  [locale]/speaking/page.tsx     speaking page (speakingPage doc, events array)
  [locale]/contact/page.tsx      contact page (contactPage doc) plus contact form
  studio/[[...tool]]/            Sanity Studio, mounted at /studio
  api/contact/route.ts           POST handler, zod validation, Resend, honeypot field `_trap`
  api/revalidate/route.ts        revalidate webhook used by the Studio action
  api/upload-image/route.ts      batch image upload used by /upload
  robots.ts                      robots.txt from siteConfig.siteUrl
  sitemap.xml/route.ts           sitemap index
  sitemap-pages.xml/route.ts     static and page URLs, localized through getPathname
  sitemap-posts.xml/route.ts     insight URLs, localized through getPathname
components/
  layout/                        nav, footer, language switcher
  sections/                      hero, services snapshot, expertise, CTA, logo strip, contact form
  ui/                            shared primitives
lib/
  site-config.ts                 brand name, wordmark, siteUrl, contactEmail, socials, studio name
  sanity/client.ts               Sanity client plus fetchList and fetchOne safe wrappers
  sanity/queries.ts              every GROQ query and its TypeScript types
  hreflang.ts                    canonical and alternate links
  shortId.ts                     shortId parsing and canonical segment building
messages/                        UI copy, id.json and en.json
schemas/                         Sanity document schemas
scripts/                         seed-examples.ts, assign-short-ids.ts
```

---

## 4. Commands

```bash
npm install            # respects .npmrc legacy-peer-deps
npm run dev            # http://localhost:3000, Studio at /studio
npm run build          # must pass before opening a PR
npm run lint
npx tsx scripts/seed-examples.ts      # 2 example docs, idempotent
npx tsx scripts/assign-short-ids.ts   # assign shortId to docs missing one
```

Node 20 or newer, Vercel builds on Node 24. `npm run build` works even when Sanity is unreachable: `fetchList` returns `[]` and `fetchOne` returns `null`, then pages use their inline fallback copy.

---

## 5. Routing and i18n

Route keys live in `i18n/routing.ts`. Indonesian paths differ from English:

| Key | ID | EN |
| --- | --- | --- |
| `/about` | `/id/tentang` | `/en/about` |
| `/experience` | `/id/pengalaman` | `/en/experience` |
| `/services` | `/id/layanan` | `/en/services` |
| `/case-studies` | `/id/studi-kasus` | `/en/case-studies` |
| `/insights` | `/id/insight` | `/en/insights` |
| `/contact` | `/id/kontak` | `/en/contact` |
| `/speaking` | `/id/berbicara` | `/en/speaking` |

Never hardcode `/id/about`. Use `getPathname` from `@/i18n/navigation` or the `Link` from `@/i18n/navigation` with the route key.

Both languages must be checked in the preview: `/id/...` and `/en/...`.

---

## 6. Content model (Sanity)

| Type | Kind | Feeds |
| --- | --- | --- |
| `homePage` | singleton | `/id` and `/en` home |
| `aboutPage` | singleton | about page, plus skills |
| `servicesPage` | singleton | services overview, process steps |
| `servicePage` | one per service | `/services/[slug]`, slugs `seo-consulting`, `marketing-analytics` |
| `contactPage` | singleton | contact page copy, email, LinkedIn |
| `speakingPage` | singleton | speaking page and event list |
| `insight` | document | insight list and detail, blog style article with table support |
| `caseStudy` | document | case study list and detail, hero metric and metrics array |
| `experience` | document | experience list and detail, company, role, period, achievements |

Every content type has an `id` object and an `en` object. Some also carry `seo` (meta title and description for both languages, OG image with source fields, noIndex flag).

Editing paths, from least to most risky:

1. Content only: edit in Studio. No deploy needed, cache revalidates within 60 seconds.
2. UI copy only: edit `messages/id.json` and `messages/en.json`. Deploy needed.
3. Layout or component change: edit under `components/` or `app/`. Deploy needed.
4. Schema change: edit under `schemas/`, then confirm the Studio still opens at `/studio` and existing documents still validate.

---

## 7. Images

- Upload through Sanity, not by adding files to `public/`. Sanity serves through `cdn.sanity.io`, already allowed in `next.config.ts`.
- Feature image for an insight: 16:9, minimum 1200x675.
- OG image: 1200x630, one shared image per document for both languages.
- Required metadata on every image: `imageAlt` (Indonesian, 5 to 15 words, describes the picture, not the article), `imageSourceName` (Unsplash, Pexels, client documentation, own photo, product screenshot), `imageSourceUrl` whenever a public source exists.
- Do not download and commit stock photos into the repo. The source of truth is the Sanity asset plus its credit fields.
- For screenshots that contain client data, blur or crop before upload.

---

## 8. Workflow for every change

1. Create a branch: `feat/<short-name>`, `fix/<short-name>`, or `content/<topic>`.
2. Make the change. Keep it scoped: one purpose per PR.
3. Run `npm run build` locally. Fix errors, do not silence them.
4. Push the branch and open a Pull Request. The workflow `preview.yml` deploys it and comments the preview URL on the PR.
5. Open both language versions of the affected routes on the preview link.
6. Fill the PR body:

   ```
   ## What changed
   ## Why
   ## Pages affected (ID + EN)
   ## Images (source per image)
   ## Anything left as placeholder
   ```

7. Merge only after the preview looks right. Merging to `main` triggers `deploy.yml` and updates production.

Do not push directly to `main`.

---

## 9. Definition of done

- Both languages updated and checked on the preview link
- `npm run build` passes
- No em dashes in user-facing text
- No invented numbers or claims, unresolved facts marked `[ISI: ...]` / `[FILL: ...]`
- Every new image has alt text and a source
- New copy in Studio and the page fallback agree, so the page looks right even if Sanity is empty
- No secrets added
- SEO fields filled where the page has them: meta title up to 60 characters, meta description up to 160
- Sitemap and robots unaffected, or intentionally changed and mentioned in the PR

---

## 10. When you are unsure

- Prefer a placeholder with a clear marker over a guess.
- Prefer asking Hans over inventing brand voice, client names, or numbers.
- If a build fails for a reason you cannot fix in ten minutes, write the error and what you tried in the PR and stop, rather than disabling checks.

---

## 11. Current known state

- Sanity dataset has 2 example documents (`cs001`, `a001`) meant as writing templates. Replace or delete them once real content exists.
- Placeholder assets: `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico` are letter R placeholders.
- Social links in `lib/site-config.ts` are empty, so the social icons do not render.
- `CONTACT_EMAIL` currently points to a personal Gmail until the `hello@relevate.id` mailbox exists.
