# Off Auth (Convex + Passkey UI)

US-first subscription control prototype focused on stopping post-cancel charges.

## What is implemented
- Anonymous passkey-based sign in/out UX (no email or user profile required).
- Card policy creation flow (merchant, amount, months, optional buffer).
- One-tap unsubscribe action with immediate freeze + refund request timeline.
- Convex backend schema and functions for cards/events lifecycle.
- Convex HTTP webhook stub for issuing processor callback integration.
- **Next.js 14** (App Router) frontend in `src/app` + VaultGuard UI in `src/components`.

## Flow/Blockchain scope
- Flow smart contracts and blockchain identity anchoring are intentionally excluded so you can implement them directly.
- No `.cdc` files were created or modified.

## Local run
1. Install deps:
   - `npm install`
2. Start web app (Next.js, default http://localhost:3000):
   - `npm run dev`
3. Convex backend:
   - `npm run dev:convex`
   - ensure `.env.local` includes `NEXT_PUBLIC_CONVEX_URL` (set the same deploy URL Convex gives you; Convex CLI may still print `VITE_` in older snippets—rename to `NEXT_PUBLIC_` for Next)

Without `NEXT_PUBLIC_CONVEX_URL`, the app runs with a local in-browser fallback store for quick UI testing.

## Environment values you will provide
- `NEXT_PUBLIC_CONVEX_URL` (and optionally `NEXT_PUBLIC_CONVEX_SITE_URL` if you add site features that read it).
- Passkey RP settings for production domain (Convex actions read `PASSKEY_*` env on the server—mirror in Convex dashboard as needed).
- Issuer/Plaid credentials when wiring real money movement (not committed to git).

## Main files
- Next entry: [`src/app/page.tsx`](src/app/page.tsx) → [`src/App.tsx`](src/App.tsx)
- Global styles: [`src/app/globals.css`](src/app/globals.css)
- Passkey helper: [`src/lib/passkey.ts`](src/lib/passkey.ts)
- Backend client wrapper: [`src/lib/backend.ts`](src/lib/backend.ts)
- Convex schema: [`convex/schema.ts`](convex/schema.ts)
- Convex card API: [`convex/cards.ts`](convex/cards.ts)
- Convex webhook route: [`convex/http.ts`](convex/http.ts)
