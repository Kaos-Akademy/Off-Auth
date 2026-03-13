# Off Auth (Convex + Passkey UI)

US-first subscription control prototype focused on stopping post-cancel charges.

## What is implemented
- Anonymous passkey-based sign in/out UX (no email or user profile required).
- Card policy creation flow (merchant, amount, months, optional buffer).
- One-tap unsubscribe action with immediate freeze + refund request timeline.
- Convex backend schema and functions for cards/events lifecycle.
- Convex HTTP webhook stub for issuing processor callback integration.

## Flow/Blockchain scope
- Flow smart contracts and blockchain identity anchoring are intentionally excluded so you can implement them directly.
- No `.cdc` files were created or modified.

## Local run
1. Install deps:
   - `npm install`
2. Start web app:
   - `npm run dev`
3. Convex backend:
   - `npm run dev:convex`
   - ensure `.env.local` includes `VITE_CONVEX_URL` (created by Convex CLI)

Without `VITE_CONVEX_URL`, the app runs with a local in-browser fallback store for quick UI testing.

## Environment values you will provide
- `VITE_CONVEX_URL` and `VITE_CONVEX_SITE_URL` (already provisioned by Convex CLI).
- Passkey RP settings for production domain:
  - `VITE_PASSKEY_RP_ID`
  - `VITE_PASSKEY_RP_NAME`
- Issuer/Plaid credentials when wiring real money movement (not committed to git).

## Main files
- Frontend: `src/App.tsx`
- Passkey helper: `src/lib/passkey.ts`
- Backend client wrapper: `src/lib/backend.ts`
- Convex schema: `convex/schema.ts`
- Convex card API: `convex/cards.ts`
- Convex webhook route: `convex/http.ts`
