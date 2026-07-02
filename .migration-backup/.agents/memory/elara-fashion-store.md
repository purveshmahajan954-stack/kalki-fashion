---
name: Elara Fashion Store
description: Key gotchas and decisions for the Elara Indian ethnic fashion e-commerce full-stack app
---

## Auth
- Password hashing: `sha256(password + "elara_salt_2024")` in auth.ts
- Bearer token in localStorage as `auth_token` — read by `custom-fetch.ts` automatically
- Demo credentials: admin@elara.com / Elara@2024, priya@example.com / Elara@2024
- Sessions stored in DB `sessions` table; cart stored in in-memory Map (resets on restart)

## Zod imports
- api-server must use `from "zod"` NOT `from "zod/v4"` — catalog pins zod v3

## Images
- Unsplash photo `1583391733956-6c78276477e2` does NOT load in Replit preview — avoid it
- Working Unsplash IDs: `1610030469983-98e550d6193c`, `1617627143750-d86bc21e42bb`, `1585487000160-6ebcfceb0d03`, `1536440136628-849c177e76a1`
- Hero slider uses CSS background-image; product cards use <img> tags

## Architecture
- Cart: session-based (in-memory Map), no auth needed
- Wishlist + orders: DB-backed, require JWT auth
- Contract-first: OpenAPI → Orval → typed React Query hooks in `lib/api-client-react`
- `getListProductsQueryKey({})` requires empty object arg (not no args)

**Why:** Passing params to query key keeps cache keys unique per filter combination.
