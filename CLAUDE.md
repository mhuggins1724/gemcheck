# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (Next.js on localhost:3000)
- `npm run build` — production build
- `npm run lint` — run ESLint
- No test framework is configured

## Architecture

GemCheck is a Pokemon TCG card grading advisor — it tells users whether a card is worth sending to PSA for grading based on eBay prices, gem rates, and pop reports.

**Stack:** Next.js 16 (App Router), React 19, Supabase, TypeScript. No CSS framework — all styling is inline via `style` props with manual dark/light theme variables.

**Data layer:** Single Supabase client (`app/lib/supabase.ts`) using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from `.env.local`. Two tables: `cards` (card data, pricing, grades, pop reports) and `sets` (set metadata with era/logo). There's also an RPC `get_set_card_counts`.

**Pages (all client-side with `"use client"`):**
- `app/page.tsx` — Homepage: stats, top-rated cards grid, featured sets
- `app/card/page.tsx` — Card detail via `?id=` query param: grade score, pricing breakdown, price history chart, PSA pop report
- `app/sets/page.tsx` — Browse all sets grouped by era (era ordering/colors/logos hardcoded)
- `app/sets/[code]/page.tsx` — Set detail with all cards, sortable (price, name, number)
- `app/search/page.tsx` — Live search with debounce and smart name/number matching

**Key patterns:**
- Theme is managed per-page via local `isDark` state (not via the ThemeProvider in `app/components/`). Each page duplicates ~15 color variables derived from `isDark`.
- Card type gradients (`gradients` map) are duplicated across page, card detail, set detail, and search.
- Grading verdict logic: `grade_score >= 7` = "Grade it", `>= 5` = "Hold", else "Skip". Gem rate thresholds: `>= 65%` green, `>= 45%` amber, else red.
- Card images come from `image_url` field; set logos from `logo_url`. Fallback image hosted on Supabase storage.
- Search uses `smartSearch()` which parses queries into name/number parts and builds Supabase `.ilike()` / `.or()` filters with zero-padded card numbers.

## Env Setup

Copy `.env.local.example` or create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```
