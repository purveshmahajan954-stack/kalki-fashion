# Elara — Indian Ethnic Fashion E-Commerce

A premium Indian ethnic fashion store inspired by Kalki Fashion, featuring a luxury gold/maroon aesthetic on white background. Full-stack app with product browsing, cart, checkout, user accounts, and admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Frontend: React + Vite + Tailwind CSS v4
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Fonts: Playfair Display (serif) + Inter (sans)

## Where things live

- `artifacts/fashion-store/` — React + Vite frontend, preview at `/`
- `artifacts/api-server/` — Express API server, proxied at `/api`
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/src/generated/api.ts` — Generated React Query hooks
- `lib/db/src/schema.ts` — Drizzle ORM database schema
- `artifacts/fashion-store/src/index.css` — CSS theme (gold/maroon palette)
- `artifacts/fashion-store/src/contexts/AuthContext.tsx` — Auth context

## Architecture decisions

- Session-based cart (in-memory Map on server, keyed by cookie `session_id`) — no auth required for cart
- Auth uses bearer tokens stored in localStorage (`auth_token`) + DB sessions table
- Password hashing: sha256(password + "elara_salt_2024")
- Wishlist and orders are DB-backed and require authentication
- Contract-first API: OpenAPI spec → Orval codegen → typed React Query hooks
- Zod import: use `from "zod"` NOT `from "zod/v4"` (zod v3 in catalog)

## Product

**Pages:**
- **Home** — Hero slider, category grid, featured products, new arrivals, testimonials
- **Category** (`/category/:slug`) — Product grid with price/size/color filters and sort
- **Product Detail** (`/product/:slug`) — Image gallery, color/size picker, add to cart, reviews
- **Cart** (`/cart`) — Cart items with quantity update, coupon codes (try ELARA10), order summary
- **Checkout** (`/checkout`) — Address form, COD payment, order placement
- **Account** (`/account`) — Orders list, wishlist, profile
- **Login/Register** (`/login`, `/register`) — JWT auth
- **Search** (`/search?q=`) — Full-text search results
- **Admin** (`/admin`) — Stats dashboard, product CRUD, order management

**Demo credentials:**
- Admin: admin@elara.com / Elara@2024
- User: priya@example.com / Elara@2024

## User preferences

- Premium look with gold/maroon accents on white background (inspired by Kalki Fashion)
- Brand name: Elara

## Gotchas

- Zod in api-server must use `from "zod"` (v3), NOT `from "zod/v4"` — catalog pins zod v3
- Always rebuild api-server after route changes (`pnpm --filter @workspace/api-server run dev` restarts the workflow)
- Cart is in-memory (session-based) — resets on server restart
- `@hookform/resolvers` and `react-hook-form` are already in `artifacts/fashion-store/package.json`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
