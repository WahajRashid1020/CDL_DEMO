# CDL1000 — Next

A lighter, modern rebuild of the cdl1000.com web app, talking to the existing CDL test services.

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (Base UI) ·
Motion · Lenis · TanStack Query · Zustand · React Hook Form + Zod · date-fns · Stripe Elements · Google Maps (`@vis.gl/react-google-maps`).

## Getting started

```bash
cp .env.example .env.local   # fill SESSION_SECRET, Stripe test key, Maps key
npm install
npm run dev
```

## How it's wired

- **Browser never calls the CDL services directly.** It calls this app's `/api/*` routes:
  - `src/app/api/[service]/[...path]/route.ts` — proxy to `calculators` / `blogs`, restricted by `src/lib/api/allowlist.ts`.
  - `src/app/api/auth/*` — login / register / logout / me. Login stores the user in a signed, httpOnly `cdl_session` cookie.
- Service base URLs are **server-only** env vars (`CALCULATORS_API_URL`, `BLOGS_API_URL`, `USERS_API_URL`).
- Typed client helpers: `src/lib/api/services.ts`.
- `src/proxy.ts` — redirects old URLs (`/Truckload`, `/Career`, `/privacy-policy`, …) and guards `/dashboard`.

## Structure

```
src/app/(site)/        pages (home, services, solutions, blog, legal, quote, auth, dashboard)
src/app/api/           proxy + auth route handlers
src/components/ui/     shadcn/ui primitives
src/components/site/   navbar, footer, page hero, placeholders
src/components/home/   home page sections
src/config/site.ts     nav, contact info, links
src/content/pages.ts   placeholder copy for routes not built yet
src/lib/               env, api, auth, validation
```

## Quote wizard (`/quote`)

`src/features/quote/` — truckload and drayage in one flow: Route → Price → Book.

- `body.ts` builds request bodies exactly like the old site (field names, defaults such as 10 loads / 45,000 lbs / FAK).
- `normalize.ts` maps both calculators' responses to one price view; `totals()` holds the pay-now / promo rules.
- `use-run-quote.ts` runs or re-runs a quote (truckload lanes are pre-checked with `dryvan_distance`; AK/HI and
  unserved lanes open a request-a-call dialog). An applied promo is re-verified when the quote changes.
- Locations come from Google Places (legacy `AutocompleteService`, like the old site) or a typed 5-digit ZIP checked
  with `verify_postal_code`.
- Checkout uses Stripe `CardElement` + `createToken`, because `pay_now` expects a card token. It's lazy-loaded.

## Auth & dashboard

- `/login` → `POST /api/auth/login` → users `login`; the returned user is stored in the signed `cdl_session` cookie.
  `?next=` is honoured for same-site paths only.
- `/sign-up` is the carrier registration (MC / US DOT), same body as the old site — it doesn't log you in.
- `/dashboard` is server-checked; it shows only whitelisted profile fields, never the raw login payload.
- "Recent quotes" are kept in the browser (`cdl.recentQuotes`) because the calculators service has no
  "my quotes" endpoint. Status updates when a quote is booked, paid or a call is requested.
- The old login's `nuance_data` (Nuance chat) isn't carried over.

## Content pages

- Marketing pages (`shippers`, `carriers`, `truckload`, `drayage`, `daas`, `agency`, `technology`) use the copy from the
  old site and shared blocks in `src/components/marketing/`. The old image bucket (`storage.googleapis.com/cdl_website_assets`)
  now returns 403, so visuals are icon/gradient panels (`Visual`) instead of photos.
- `careers` lists the 16 roles from the old site (`src/content/jobs.json`) — the Lever board no longer exists.
  "Apply for this role" pre-fills `/apply?position=…`.
- `contact` and `apply` post to the blogs service through the proxy; their bodies are validated server-side
  (`schema` in `src/lib/api/allowlist.ts`), including a 5 MB résumé limit.
- `blog` and `blog/[slug]` fetch at request time through `'use cache'` helpers (`src/features/blog/api.ts`); post HTML is
  sanitised on the server. If the service is down, a friendly empty state shows and nothing broken is cached.
  The home page's "CDL in the news" section hides itself in that case.
- Legal pages render `src/content/legal/*.json`, generated from the old JSX — see the README there.

## Status

Done: scaffold, quote wizard, login / sign-up / dashboard, all content pages. Next: polish (OG image, sitemap, analytics).

Known external blockers: the CDL test services return 500/503, the Google Maps key's project has billing disabled
(`BillingNotEnabledMapError`) so Places autocomplete fails (ZIP codes still work), and the old image bucket is private.
