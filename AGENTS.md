<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:content-rules -->
# Content Constitution

## Language
- This site is bilingual: Indonesian (ID) and English (EN).
- **Any time content is added or changed in one language, the other language MUST be updated in the same commit.** Never leave one language stale.
- After editing content, always verify both `/id/...` and `/en/...` routes in the preview before pushing.

## Writing Style
- **Never use em dashes (—) in any user-facing content.** This character reads as AI-generated to Indonesian audiences. Replace with:
  - A comma for soft pauses: "Saya cari driver nyata, bukan korelasi."
  - A colon for clarifications: "Satu tujuan: menemukan driver yang sesungguhnya."
  - A period to break into two sentences when the thought is complete.
- Hyphens (-) for compound words and date ranges are fine.
<!-- END:content-rules -->

<!-- BEGIN:routing-rules -->
# Routing Constitution

## Layout Structure
This site has two independent layout trees:

- `app/[locale]/layout.tsx` — covers all `/id/...` and `/en/...` routes
- `app/page.tsx` — the root `/` language-picker page, has its own `<html>` and `<body>`, **not wrapped by the locale layout**

## Rule
**Any change that must apply to all pages (scripts, meta tags, fonts, providers, analytics, etc.) MUST be applied to both trees.** Adding something only to `app/[locale]/layout.tsx` silently skips `/`.

Checklist when adding a site-wide element:
1. `app/[locale]/layout.tsx` — for all locale routes
2. `app/page.tsx` — for the root `/` page
<!-- END:routing-rules -->
