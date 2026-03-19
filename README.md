# Next.js App Router Boilerplate — Operational Guide

This repository is a minimal Next.js 16 (App Router) starter with React 19, TypeScript, Tailwind-ready PostCSS, and **Drizzle ORM + PostgreSQL ready**. It now includes a working email/password auth system backed by Drizzle + Postgres, with token-based email verification and password reset flows, plus protected command-runner and health endpoints implemented via Next.js route handlers. Use this document as the single operational reference. If anything is unclear: **STOP AND ASK** before proceeding.

---

## 1. Current Scope
- Purpose: baseline UI scaffold with Postgres-backed Drizzle schema and a DB-backed auth entry flow.
- Data: Drizzle configured for PostgreSQL with `users`, `teams`, `team_members`, `team_invitations`, `feature_items`, and `auth_tokens` tables.
- Auth: `/auth` route is implemented with Sign in / Sign up forms and server actions in `app/auth/actions.ts`, plus token routes for email verification and password reset.
- Current auth contract: credentials are validated against `users` table (`bcryptjs` for password hashing/compare).
- Current auth limitation: no middleware-level auth guard is wired yet (`middleware.ts` not used); route protection is enforced in server layouts/pages via `getAuthSession()`.
- Dashboard: authenticated routes with shared layout (`app/dashboard/layout.tsx`) at `/dashboard`, `/dashboard/settings`, and `/dashboard/team`.
- Feature scaffold: `/dashboard/feature` is the canonical CRUD reference route for adding new dashboard features.
- Dashboard actions:
  - `app/dashboard/actions.tsx` contains shared actions (currently `signOutAction`).
  - `app/dashboard/settings/actions.tsx` contains settings-specific actions (`updateProfileAction`, `updateEmailAction`, `updatePasswordAction`, `deleteAccountAction`).
  - `app/dashboard/team/actions.tsx` contains team management actions (invite, revoke, remove, role update, team name update).
- Dashboard Dialog example:
  - `components/dashboard/dashboard-content.tsx` includes a mock CRUD modal using `components/ui/dialog.tsx`.
  - The demo supports local-state `create` and `edit` for projects and does not persist to DB.
  - Treat this as a UI reference pattern; wire to server actions/DB only when requested.
- Teams: multi-tenant team system with roles (owner, admin, member). Auto-created on signup. Team invitation flow via `/invite/[token]` with SendGrid email delivery.
- Email: SendGrid integration for transactional email (`lib/email/sendgrid.ts`).
- AI integration default: OpenAI with model `gpt-4o-mini` (override via `OPENAI_MODEL`).
- Env vars: `env.example` lists `OPENAI_API_KEY`, `OPENAI_MODEL`, `DATABASE_URL`, `DATABASE_SSL`, `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `BASE_URL`, and optional `NEXTAUTH_SECRET` (only for future Auth.js/NextAuth adoption).
- Current landing: section-composed layout with centralized navbar and modular `Layout*Section` components.
  - Active sections: `layout-hero`, `layout-sponsors`, `layout-benefits`, `layout-features`, `layout-services`, `layout-testimonials`, `layout-team`, `layout-pricing`, `layout-contact`, `layout-faq`, `layout-footer`.
  - Runtime visibility control is enabled via `ONLY_SECTIONS` / `HIDE_SECTIONS`.
  - Layout is responsive with wrapping controls and an app max width around `1600px`.
- Theme system is centralized under `components/theme` and mounted in `app/layout.tsx`.
- Client interactivity is isolated to small islands (`HeroOrbs`, `ThemeToggle`, etc.); `AgentActionPanel` exists as a client stub and is not rendered by default on landing.

## Auth Strategy (Custom)
- Current implementation type: custom credentials auth with a stateful cookie session.
- Current session shape: `lib/auth/session.ts` stores `{ userId, email }` as a JSON string in an `httpOnly` cookie (`panda_auth_session`) with `sameSite: "none"`, `secure: true`, and `path: "/"`, then server components/actions read that cookie via `getAuthSession()` for access checks.
- Token lifecycle: `lib/auth/tokens.ts` manages `auth_tokens` rows for `email_verification` (24h TTL) and `password_reset` (1h TTL).
- Token guarantees:
  - `generateAuthToken(userId, type)` invalidates prior tokens for the same `userId + type`, then creates a new 32-byte random hex token.
  - `consumeAuthToken(token, type)` only accepts non-expired tokens and deletes them immediately (single-use semantics).
- Current protected surfaces:
  - Dashboard layout (`app/dashboard/layout.tsx`) checks `getAuthSession()` and redirects unauthenticated users to `/auth#signin`. This guards all `/dashboard/*` routes.
  - Sign-out (`app/dashboard/actions.tsx`) clears cookie session with `clearAuthSession()` (empty value + `maxAge: 0` with the same cookie attributes).
- If you want to keep custom auth long-term: prefer a signed opaque session token cookie (session ID) backed by a DB `sessions` table, rather than storing identity values in the cookie payload.
- Do not switch to Auth.js/NextAuth by default; only do it when explicitly requested for OAuth/social login/provider flows.

## 2. Technology Stack
- Next.js 16 App Router (server-first, file-based routing).
- React 19, TypeScript 5 (strict).
- Styling: Tailwind via `@tailwindcss/postcss` pipeline; global CSS in `app/globals.css` with additional utilities in `app/shadcn.css`.
- UI kit: shadcn/ui (Radix + Nova preset). Components live under `components/ui` and rely on `components.json` aliases.
- Icons: `lucide-react` + custom icon components under `components/icons`. Landing icon rendering uses explicit named Lucide imports via `components/ui/icon.tsx` (no `icons` namespace import).
- Data: Drizzle ORM + PostgreSQL (schema + migration present).
- Auth deps present: `bcryptjs` for credentials flow.
- Validation: `zod` for server action input validation (schemas co-located in action files).
- Theming: `next-themes` with shared `ThemeProvider` + `ThemeToggle` (preferred export from `components/theme/theme-toggle.tsx`; `ModeToggle` remains as a backward-compatible alias).
- Tooling: ESLint 9 (`eslint-config-next`), PostCSS.

### 2.1 Preferred and Tested Package Versions (Default)
- `Preferred` = version range/version declared in `package.json`.
- `Tested` = currently resolved direct version from `pnpm-lock.yaml` (`pnpm list --depth 0`).
- Use this table as reference whenever you lose context

| Package | Type | Preferred (package.json) | Tested (pnpm-lock) |
|---|---|---|---|
| `@hookform/resolvers` | dependency | `^5.2.2` | `5.2.2` |
| `@radix-ui/react-accordion` | dependency | `^1.2.12` | `1.2.12` |
| `@radix-ui/react-alert-dialog` | dependency | `^1.1.15` | `1.1.15` |
| `@radix-ui/react-avatar` | dependency | `^1.1.11` | `1.1.11` |
| `@radix-ui/react-collapsible` | dependency | `^1.1.12` | `1.1.12` |
| `@radix-ui/react-dialog` | dependency | `^1.1.15` | `1.1.15` |
| `@radix-ui/react-dropdown-menu` | dependency | `^2.1.16` | `2.1.16` |
| `@radix-ui/react-label` | dependency | `^2.1.8` | `2.1.8` |
| `@radix-ui/react-navigation-menu` | dependency | `^1.2.14` | `1.2.14` |
| `@radix-ui/react-popover` | dependency | `^1.1.15` | `1.1.15` |
| `@radix-ui/react-scroll-area` | dependency | `^1.2.10` | `1.2.10` |
| `@radix-ui/react-select` | dependency | `^2.2.6` | `2.2.6` |
| `@radix-ui/react-separator` | dependency | `^1.1.8` | `1.1.8` |
| `@radix-ui/react-slot` | dependency | `^1.2.4` | `1.2.4` |
| `@radix-ui/react-tabs` | dependency | `^1.1.13` | `1.1.13` |
| `@radix-ui/react-tooltip` | dependency | `^1.2.8` | `1.2.8` |
| `@sendgrid/mail` | dependency | `^8.1.6` | `8.1.6` |
| `bcryptjs` | dependency | `2.4.3` | `2.4.3` |
| `class-variance-authority` | dependency | `^0.7.1` | `0.7.1` |
| `clsx` | dependency | `^2.1.1` | `2.1.1` |
| `drizzle-kit` | dependency | `^0.31.9` | `0.31.9` |
| `drizzle-orm` | dependency | `^0.45.1` | `0.45.1` |
| `embla-carousel-react` | dependency | `^8.6.0` | `8.6.0` |
| `geist` | dependency | `^1.7.0` | `1.7.0` |
| `lucide-react` | dependency | `^0.577.0` | `0.577.0` |
| `next` | dependency | `16.1.6` | `16.1.6` |
| `next-themes` | dependency | `^0.4.6` | `0.4.6` |
| `pg` | dependency | `^8.11.0` | `8.20.0` |
| `react` | dependency | `19.2.3` | `19.2.3` |
| `react-dom` | dependency | `19.2.3` | `19.2.3` |
| `react-hook-form` | dependency | `^7.71.2` | `7.71.2` |
| `tailwind-merge` | dependency | `^3.5.0` | `3.5.0` |
| `tw-animate-css` | dependency | `^1.4.0` | `1.4.0` |
| `zod` | dependency | `^4.3.6` | `4.3.6` |
| `@tailwindcss/postcss` | devDependency | `^4` | `4.2.1` |
| `@types/node` | devDependency | `^20` | `20.19.37` |
| `@types/pg` | devDependency | `^8.11.6` | `8.18.0` |
| `@types/react` | devDependency | `^19` | `19.2.14` |
| `@types/react-dom` | devDependency | `^19` | `19.2.3` |
| `eslint` | devDependency | `^9` | `9.39.4` |
| `eslint-config-next` | devDependency | `16.1.6` | `16.1.6` |
| `tailwindcss` | devDependency | `^4` | `4.2.1` |
| `typescript` | devDependency | `^5` | `5.9.3` |

## 3. Project Structure
- Canonical project structure is maintained in `FILES.md`.
- Keep `README.md` focused on operational guidance and workflows.

## 4. Install & Run
```bash
pnpm install
pnpm run dev   # starts Next.js on localhost:3000
pnpm run lint  # ESLint
pnpm run build # production build
pnpm run start # starts Next.js production server (PORT default 3000 unless overridden)
pnpm run start:supervised # starts supervisor (next dev by default + git poller)
```

Dev server / supervisor notes
- `pnpm run dev` runs Next.js directly.
- `pnpm run start` runs `next start`.
- `pnpm run start:supervised` runs `scripts/dev-supervisor.js` (defaults to `next dev --turbo` + git poller).
- Set `NEXT_DEV=false` to switch supervisor to `next start` mode.

Docker dev runtime (current Railway workflow):
```bash
docker build -t saas-boilerplate-dev .
docker run --rm -p 3000:3000 --env-file .env saas-boilerplate-dev
```
- Container entrypoint is `node scripts/dev-supervisor.js`.
- Default container runtime is development mode (`NEXT_DEV=true`); set `NEXT_DEV=false` for `next start`.


Drizzle / DB (Postgres):
```bash
# Regenerate SQL after schema changes (local/dev only)
DATABASE_URL="postgresql://user:pass@host:5432/db" pnpm run db:generate
```
- Migration execution policy: run DB migrations only through GitHub Actions `init-db` (`.github/workflows/init-db.yml`).
- Do not run `pnpm run db:migrate` through command-runner (`/run`), runtime command channels, or ad-hoc supervisor commands.
- Important: Drizzle only applies migrations listed in `drizzle/meta/_journal.json`. Always commit both generated SQL files and the updated journal. `scripts/db-init.js` fails early if a `.sql` migration is not present in the journal.
- Migration retries: `scripts/db-init.js` retries transient DB/network failures by default.
  - `DB_MIGRATE_ATTEMPTS` (default `8`)
  - `DB_MIGRATE_RETRY_MS` (default `3000`, exponential backoff with cap)
- GitHub Actions DB init workflow:
  - `.github/workflows/init-db.yml` is operational via manual dispatch (`workflow_dispatch`).
  - Required input: `database_url`.
  - Optional inputs: `migrate_attempts`, `retry_delay_ms`.
  - Workflow runs `node scripts/db-init.js` (Drizzle migrate + journal guard + retry logic).

## 5. Routing & Components
- Public landing page: `app/page.tsx`.
- Blank landing starter route: `app/blank/page.tsx` (`/blank`) for composing custom landing variants with shared navbar/footer.
- Auth route: `app/auth/page.tsx` (`/auth`) is the server entry and renders `app/auth/client.tsx` for hash-aware sign-in/sign-up UI (`#signin`, `#signup`).
- Forgot password route: `app/auth/forgot-password/page.tsx` (`/auth/forgot-password`) renders the email collection form and sends a generic-success response to avoid user enumeration.
- Reset password route: `app/auth/reset-password/[token]/page.tsx` (`/auth/reset-password/:token`) pre-validates token state and renders reset UI; submit consumes token and updates password hash.
- Verify email route: `app/auth/verify-email/[token]/page.tsx` (`/auth/verify-email/:token`) is server-only, consumes token, marks `users.emailVerified`, and redirects to `/dashboard` (active session) or `/auth#signin` (no session).
- Dashboard layout: `app/dashboard/layout.tsx` (shared sidebar, header, auth guard for all dashboard routes).
- Dashboard overview: `app/dashboard/page.tsx` (`/dashboard`) is the server entry and renders `app/dashboard/client.tsx`.
- Dashboard overview includes a mock local-state Dialog CRUD example in `components/dashboard/dashboard-content.tsx` (create/edit project modal, no backend persistence).
- Dashboard Dialog example behavior:
  1. Click `Create project` to open the modal in create mode.
  2. Click `Edit` on a project row to open the same modal in edit mode.
  3. Save updates local component state only (mock data, no API/server action call).
- Dashboard settings: `app/dashboard/settings/page.tsx` (`/dashboard/settings`) is the server entry and renders `app/dashboard/settings/client.tsx`.
- Dashboard team: `app/dashboard/team/page.tsx` (`/dashboard/team`) is the server entry and renders `app/dashboard/team/client.tsx`.
- Dashboard feature scaffold: `app/dashboard/feature/page.tsx` (`/dashboard/feature`) is the server entry and renders `app/dashboard/feature/client.tsx`.
- Dashboard feature scaffold behavior:
  1. `page.tsx` performs session + team membership checks and loads tenant-scoped records.
  2. `client.tsx` renders a list view with Add/Edit dialogs and row-level delete action.
  3. `actions.tsx` handles create/update/delete with Zod validation and role guards.
- Invitation acceptance: `app/invite/[token]/page.tsx` (`/invite/:token`) is the server entry and renders `app/invite/[token]/client.tsx` for state-based invitation UI and acceptance form wiring (redirects unauthenticated users to `/auth?redirect=/invite/:token#signin`).
- Runtime endpoints:
  - `/api/health` and `/health`: health/status endpoint with command-runner busy state.
  - `/api/run` and `/run`: protected command runner endpoint (expects `Authorization: Bearer <RUN_TOKEN>`).
- No route groups exist yet.
- Route pattern default: keep `page.tsx` server-first, and place interactive UI in co-located `client.tsx`.
- Landing composition currently imports section modules from `components/home/Layout*Section.tsx` and renders them through an ID-based section map.
- Home content source is `content/home.ts`; prefer importing `homeContent` directly in landing/navbar components.
- `getHomeContent()` remains available only for backward compatibility with older imports.
- Section visibility workflow:
  1. Add or update a presentational section in `components/home/<LayoutName>Section.tsx`.
  2. Register/compose it in `app/page.tsx` with a stable section ID.
  3. Optionally control visibility via `ONLY_SECTIONS` / `HIDE_SECTIONS`.
- Navbar remains separate and always mounted from `components/layout/navbar.tsx`.

### 5.1 Component Edit Map (Where To Edit)
- Landing page wiring/order/visibility: `app/page.tsx` (section IDs + `ONLY_SECTIONS` / `HIDE_SECTIONS` behavior).
- Landing copy/content values: `content/home.ts` (text values only; keep keys/object shape intact).
- Landing section components (layout/markup per section):
  - `components/home/LayoutHeroSection.tsx`
  - `components/home/LayoutSponsorsSection.tsx`
  - `components/home/LayoutBenefitsSection.tsx`
  - `components/home/LayoutFeatureGridSection.tsx`
  - `components/home/LayoutServicesSection.tsx`
  - `components/home/LayoutTestimonialSection.tsx`
  - `components/home/LayoutTeamSection.tsx`
  - `components/home/LayoutPricingSection.tsx`
  - `components/home/LayoutContactSection.tsx`
  - `components/home/LayoutFaqSection.tsx`
  - `components/home/LayoutFooterSection.tsx`
- Global navbar/header branding labels: `components/layout/navbar.tsx`.
- Dashboard shell/navigation components:
  - `app/dashboard/layout.tsx` (shell wrapper + auth guard)
  - `components/dashboard/sidebar-nav.tsx` (sidebar labels/entries)
  - `components/dashboard/user-menu.tsx` (user dropdown)
  - `components/dashboard/mobile-nav.tsx` (mobile sidebar sheet)
- Dashboard route UIs:
  - Overview: `app/dashboard/page.tsx` + `app/dashboard/client.tsx`
  - Settings: `app/dashboard/settings/page.tsx` + `app/dashboard/settings/client.tsx`
  - Team: `app/dashboard/team/page.tsx` + `app/dashboard/team/client.tsx`
  - Feature scaffold: `app/dashboard/feature/page.tsx` + `app/dashboard/feature/client.tsx`
- Auth route UIs:
  - Main auth: `app/auth/page.tsx` + `app/auth/client.tsx`
  - Forgot password: `app/auth/forgot-password/page.tsx` + `app/auth/forgot-password/client.tsx`
  - Reset password: `app/auth/reset-password/[token]/page.tsx` + `app/auth/reset-password/[token]/client.tsx`
- Invite route UI:
  - `app/invite/[token]/page.tsx` + `app/invite/[token]/client.tsx`
- Shared primitives used across screens: `components/ui/*`.

## 6. Styling & UI Components (short)
- Tailwind via `app/globals.css`; no standalone `tailwind.config` required for current setup.
- Additional utility classes and keyframes live in `app/shadcn.css` and local page-level styles where needed.
- shadcn/ui primitives are pre-bundled in `components/ui/`:
  - Existing: accordion, alert-dialog, avatar, badge, button, card, carousel, collapsible, form, icon, input, label, navigation-menu, popover, scroll-area, select, separator, sheet, textarea, table.
  - Newly added: dialog, dropdown-menu, pagination, skeleton, tabs, tooltip.
- Icons: `lucide-react` plus local icon components in `components/icons`.
- Import optimization:
  - `next.config.ts` enables `experimental.optimizePackageImports` for `lucide-react` and actively used Radix packages.
  - `components/ui/icon.tsx` uses an explicit icon map with named Lucide imports to avoid namespace-based bundle expansion.
- Landing sections in `components/home/`:
  - `LayoutHeroSection`, `LayoutSponsorsSection`, `LayoutBenefitsSection`, `LayoutFeatureGridSection`
  - `LayoutServicesSection`, `LayoutTestimonialSection`, `LayoutTeamSection`, `LayoutPricingSection`
  - `LayoutContactSection`, `LayoutFaqSection`, `LayoutFooterSection`
- Other reusable components:
  - `components/layout/navbar.tsx`
  - `components/theme/theme-provider.tsx`, `components/theme/theme-toggle.tsx` (`ThemeToggle` preferred, `ModeToggle` alias supported)
  - `components/illustrations/HeroStackIllustration.tsx`, `components/illustrations/GlobeBadgeIllustration.tsx`
  - `components/HeroOrbs.tsx`, `components/AgentActionPanel.tsx`, `components/ErrorReporter.tsx`
- Keep global CSS light; prefer component-scoped styling and reusable tokens.

## 7. Environment & Secrets
- Required for AI: set `OPENAI_API_KEY` in environment.
- Optional model override: `OPENAI_MODEL`.
- Database: set `DATABASE_URL` (Postgres) and `DATABASE_SSL` as needed by your provider.
- Auth (current credentials flow): requires `DATABASE_URL`.
- Optional/future auth (NextAuth-based sessions): `NEXTAUTH_SECRET` can be set in advance, but no Auth.js/NextAuth routes are currently wired.
- Canonical app URL: set `BASE_URL` (used for invitation email links).
- Email delivery: set `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL` for invitation, verification, and reset emails.
- Add additional env vars only when explicitly requested; never commit secrets.

## 8. Data & Backend
- Drizzle + Postgres are configured with `users`, `teams`, `team_members`, `team_invitations`, `feature_items`, and `auth_tokens` tables.
- Migrations live under `drizzle/` and are executed via GitHub Actions `init-db` workflow (not via command-runner/manual runtime commands).
- DB init automation: `scripts/db-init.js` validates migration journal integrity before migration execution.
- Auth server actions live in `app/auth/actions.ts`:
  - `signUpWithPassword`: validates input, checks existing user, hashes password, inserts row, auto-creates team.
  - `signInWithPassword`: validates input, fetches by email, compares password hash.
- Forgot/reset flows live in `app/auth/forgot-password/actions.ts` and `app/auth/reset-password/[token]/actions.ts`.
- Token lifecycle is centralized in `lib/auth/tokens.ts` (`generateAuthToken`, `consumeAuthToken`) and backed by the `auth_tokens` table.
- Session lifecycle is handled by cookie helpers in `lib/auth/session.ts` (stores `{ userId, email }` as JSON) and used by auth/dashboard/invite actions.
- Settings server actions include account deletion (`deleteAccountAction`) with password verification.
- Team management actions live in `app/dashboard/team/actions.tsx`.
- Server actions use Zod schemas for input validation (co-located in each action file).
- Email delivery via `@sendgrid/mail` through `lib/email/sendgrid.ts`.
- When adding routes or server actions, place data helpers under `lib/` and document contracts in `FILES.md` and `RULES.md`.
- New dashboard features should start by copying/extending `app/dashboard/feature/page.tsx`, `app/dashboard/feature/client.tsx`, and `app/dashboard/feature/actions.tsx`, then adding/updating the sidebar item in `components/dashboard/sidebar-nav.tsx`.

## 9. Server vs Client Components (Guardrails)
- Default to Server Components for files inside `app/`. They may fetch data, access databases, and read env vars, but must not use React hooks or browser APIs.
- Preferred route split: `page.tsx` handles server concerns (auth/data/searchParams), and co-located `client.tsx` handles client concerns.
- Client-only features (`useState`/`useEffect`, handlers like `onClick`/`onSubmit`, browser APIs like `window`/`document`/`localStorage`) must only exist in files that begin with `"use client"`.
- Keep Client Components small and isolated. Example: theme toggle or interaction widgets should be small client components imported into server layouts/pages.
- Import rules: Server Components can import Client Components; Client Components must not import Server Components.
- Mutations/actions: use Server Actions or API routes; trigger them from a Client Component via forms, handlers, or helper calls.
- Security: never expose secrets or server-only logic inside Client Components.
- Quick check: if route UI needs hooks/event handlers/browser APIs, move that UI into segment-level `client.tsx` and keep `page.tsx` server-only.

## 10. Testing (Not Present)
- No tests are included. If adding tests, prefer:
  - Unit: `__tests__/` or co-located `*.test.tsx`
  - E2E: Playwright under `e2e/`
  - Provide lightweight stubs/utilities

## 11. Change Guidelines
- Default to minimal diffs; avoid rewrites.
- Do not move files across route groups without coordination.
- Avoid new Markdown explainer files unless explicitly requested; update existing docs instead.
- Do not introduce time- or randomness-dependent values directly in React render (`Date.now()`, `Math.random()`). Precompute in server components, constants, or `useEffect` if client-only.
- If adding auth, team, or DB changes: implement the full contract in one coherent change.
- Only `scripts/error-reporter.ts` may be imported into runtime UI (`components/ErrorReporter.tsx`); keep other scripts server-only.
- Agent policy: treat `scripts/*` as locked infrastructure; do not modify files under `scripts/` unless explicitly requested in that task.

## 12. Hard Stops
- Unclear requirements or missing context.
- Requests to alter session/cookie behavior without explicit approval.
- Hand-editing generated migration SQL without explicit intent (Drizzle migrations are committed; edit cautiously).
- Storing or logging secrets in code or assets.

## 13. Deployment
- Development target: Docker (`Dockerfile`) by Railway (dev server/runtime workflow).
- Production target: Vercel for Next.js hosting.
- `railpack.json` is retained for compatibility/reference but is inactive while Dockerfile-based deploys are used.

## 14. Cookie Configuration Rules (Iframe Auth)
- Current implementation in `lib/auth/session.ts` already uses iframe-compatible cookie options: `sameSite: "none"`, `secure: true`, `httpOnly: true`, and `path: "/"`.
- When changing auth/session cookies, keep those attributes for both set and clear operations.
- Do not alter redirect/guard logic when adjusting cookie behavior; update cookie metadata only.
- If embedding in another repo/app: ensure iframe host and Next.js app share the same root domain (or use a parent-proxy domain) to keep cookies first-party.
- Avoid client-side cookie hacks; adjust only server-set cookie options.

---

Please operate cautiously, keep changes small, and align new features with the documented structure. When uncertain: **STOP AND ASK**.
