# Virtual Wig Boutique

Developer guide and reference for the Virtual Wig Boutique storefront (Next.js App Router).

This repository is a Next.js application (App Router) with server-side Postgres access, Cloudinary uploads for media, JWT-based authentication, and a set of reusable UI components under `src/app/ui`.

## Quickstart (local)

1. Install dependencies

   npm install

   # or

   pnpm install

2. Create a local environment file `.env.local` with the variables below (see "Environment variables")

3. Run the dev server

   npm run dev

   Open http://localhost:3000

4. Optional: create DB tables used by examples

   The project contains a simple seed route at `/api/seed` (implemented in `src/app/seed/route.ts`) which can create the `request` and `request_product` tables. It requires `POSTGRES_URL` to be set and a reachable Postgres instance.

   Use the seed route in development only (it runs SQL directly and may not be idempotent):

   Navigate in your browser to: http://localhost:3000/api/seed

## Scripts

- `npm run dev` — start Next.js dev server (Turbopack enabled in package.json)
- `npm run build` — produce production build
- `npm run start` — start server from built output
- `npm run lint` — run ESLint checks

## Environment variables

Place secrets in `.env.local` (do not commit). Important variables used by the app:

- `POSTGRES_URL` — connection string for Postgres (server-only)
- `JWT_SECRET` — JWT secret for signing tokens (server-only)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name (client-safe)
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` — Cloudinary upload preset (client-safe)
- `NEXTAUTH_URL` — used for metadata base URL (optional)

Server-only secrets must NOT be prefixed with `NEXT_PUBLIC_`. Files that run in the browser should only access `NEXT_PUBLIC_` variables.

## Architecture overview (big picture)

- Framework: Next.js (App Router) with React 19. Components and pages live under `src/app/`.
- UI: `src/app/ui/` contains reusable components. Many are client components (include `'use client'` at top where needed).
- API routes: `src/app/api/**/route.ts` implement server endpoints using Next.js server functions.
- Database: `src/app/lib/data.ts` uses the `postgres` client library. To avoid bundling Node-only modules into the browser, the app uses dynamic imports (see below).
- Auth: JWT utilities are implemented in `src/app/lib/jwt.ts` (Node.js-specific) and `src/app/lib/jwt-unified.ts` (proxy wrappers that can be used from Edge or Node contexts). Server APIs read the `auth-token` cookie for authenticated endpoints.
- Media uploads: `src/app/helper/uploadCloud.tsx` uploads directly to Cloudinary (client-side), using `NEXT_PUBLIC_` vars.

Design decisions to respect in edits

- Avoid top-level imports of Node-only modules (e.g., `postgres`, `jsonwebtoken`) in files that might run in the browser. Use `await import('...')` inside server-only code to keep those modules out of client bundles. Example: `src/app/api/products/route.ts` dynamically imports `src/app/lib/data`.
- For code that should work in both Edge and Node runtimes, use `src/app/lib/jwt-unified.ts` which proxies to `jwt.ts` via dynamic import.
- API routes fall back to in-repo placeholder data (`src/app/lib/placeholder-data.ts`) when DB access fails — preserve this fallback unless intentionally removing it.

Key files and where to look

- Root layout and providers: `src/app/layout.tsx`, `src/app/providers.tsx`
- API examples: `src/app/api/products/route.ts`, `src/app/api/orders/route.ts`
- DB helpers: `src/app/lib/data.ts`, `src/app/lib/placeholder-data.ts`
- Auth: `src/app/lib/jwt.ts`, `src/app/lib/jwt-unified.ts`, `src/app/lib/auth-types.ts`, `src/app/lib/auth-service.ts`
- Seed / schema helpers: `src/app/seed/route.ts`
- Upload helper: `src/app/helper/uploadCloud.tsx`

Conventions & patterns

- Naming: UI components live in `src/app/ui/<ComponentName>/` with the main component as `<ComponentName>.tsx` and optional CSS alongside.
- CSS: global styles in `src/app/globals.css` and component styles next to components when present.
- Database access: centralize SQL in `src/app/lib/data.ts` and use typed return shapes (`ProductField`, `UserField` in `src/app/lib/definitions.ts`).
- Fallback data: `placeholder-data.ts` is used to keep the UI functional in environments without a DB.

Debugging and troubleshooting

- Common issue: accidentally bundling Node-only libraries into the client. If build or dev logs mention `postgres` or `fs` in browser code, ensure imports are dynamic and only used inside server files.
- Environment variable missing: server will crash on DB or JWT usage if `POSTGRES_URL` or `JWT_SECRET` are missing. Check `.env.local` and restart the dev server.
- Seed route failures: check that `POSTGRES_URL` is correct and the Postgres user has privileges to create tables.

Security notes

- Keep `JWT_SECRET` and `POSTGRES_URL` out of source control.
- Cloudinary client-side uploads rely on an unsigned `upload_preset` — ensure the preset and cloud name are limited appropriately.

Contributing & PR checklist

- Run `npm run lint` and ensure no lint errors
- Test the app locally with `npm run dev` and verify relevant pages/components
- Avoid introducing server-only imports at module top-level in UI code

Questions or additions?

If you'd like I can add a component map (which UI files are used by which pages), an authentication developer flow (sample curl requests), or a short PR template. Tell me which you'd prefer and I'll update this README accordingly.
