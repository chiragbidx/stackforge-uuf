# FILES.md — Structural & Architectural Index (Next.js App Router Starter)

AI-facing index of the repository as it exists today. Drizzle ORM (PostgreSQL) is wired with a working credentials auth flow at `/auth` (server actions + cookie session) plus tokenized email verification/password reset flows. If something is unclear: **STOP AND ASK**.

---

## 1. High-Level Overview
- Purpose: SaaS boilerplate with App Router, Drizzle + Postgres schema, multi-tenant teams, and modular section-based landing architecture.
- Style: file-system routing, server-preferred components, small isolated client islands.
- Tech: Next.js 16, React 19, TypeScript 5, Tailwind-ready PostCSS, ESLint 9, Zod for validation, SendGrid for email.
- Present: Drizzle schema + migrations for `users`, `teams`, `team_members`, `team_invitations`, `feature_items`, `auth_tokens`; `/auth` route with sign-in/sign-up server actions; email verification flow (token-based via SendGrid); password reset/forgot-password flow; shared dashboard layout with overview, settings (profile/email/password), team management, and a DB-backed feature CRUD reference page; invitation acceptance flow; reusable UI primitives; centralized theme system.
- Not present: middleware guards, queues, tests.

## 2. Application Entry Points
- `app/layout.tsx`: Root layout; mounts `ThemeProvider`, global CSS, and `ErrorReporter`.
- `app/page.tsx`: Public landing page (server component) that composes `Layout*Section` components.
- `app/blank/page.tsx`: Blank landing starter route (`/blank`) with shared navbar/footer and an empty main content area.
- `app/api/health/route.ts`: Runtime health endpoint (`/api/health`) with command-runner busy state.
- `app/api/run/route.ts`: Protected runtime command endpoint (`/api/run`) with bearer token auth and runner lock handling.
- `app/health/route.ts`: Backward-compatible alias route for `/health`.
- `app/run/route.ts`: Backward-compatible alias route for `/run`.
- `app/auth/page.tsx`: Server route entry for `/auth`; reads request params and renders `app/auth/client.tsx`.
- `app/auth/client.tsx`: Client auth UI (sign-in/sign-up toggle, hash mode sync, form interactivity).
- `app/auth/actions.ts`: Server actions that read/write users in Postgres through Drizzle; auto-creates team on signup; sends verification email on signup; resend verification action.
- `app/auth/verify-email/[token]/page.tsx`: Server component that consumes an email verification token, marks the user as verified, and redirects to dashboard (if signed in) or auth sign-in.
- `app/auth/forgot-password/page.tsx`: Server route entry for `/auth/forgot-password`; renders `client.tsx`.
- `app/auth/forgot-password/client.tsx`: Client forgot-password form (email input, wired to server action).
- `app/auth/forgot-password/actions.ts`: Server action that generates a password reset token and sends a reset email.
- `app/auth/reset-password/[token]/page.tsx`: Server route entry for `/auth/reset-password/[token]`; validates token and renders `client.tsx`.
- `app/auth/reset-password/[token]/client.tsx`: Client reset-password form (new password + confirm, wired to server action).
- `app/auth/reset-password/[token]/actions.ts`: Server action that consumes a reset token and updates the user's password.
- `app/dashboard/layout.tsx`: Shared dashboard layout (sidebar, header, auth guard) for all `/dashboard/*` routes.
- `app/dashboard/page.tsx`: Server route entry for `/dashboard`; loads session/data and renders `app/dashboard/client.tsx`.
- `app/dashboard/client.tsx`: Client dashboard overview UI.
- `app/dashboard/actions.tsx`: Shared dashboard server actions (currently sign-out).
- `app/dashboard/settings/page.tsx`: Server route entry for `/dashboard/settings`; loads user/status data and renders `app/dashboard/settings/client.tsx`.
- `app/dashboard/settings/client.tsx`: Client settings UI (profile/email/password/danger zone forms).
- `app/dashboard/settings/actions.tsx`: Settings server actions (`updateProfileAction`, `updateEmailAction`, `updatePasswordAction`, `deleteAccountAction`).
- `app/dashboard/team/page.tsx`: Server route entry for `/dashboard/team`; loads team/member/invitation data and renders `app/dashboard/team/client.tsx`.
- `app/dashboard/team/client.tsx`: Client team management UI (members, invitations, role controls, invite form).
- `app/dashboard/team/actions.tsx`: Team server actions (invite, revoke, remove, role update, team name).
- `app/dashboard/feature/page.tsx`: Server route entry for `/dashboard/feature`; resolves auth/team scope and loads `feature_items`.
- `app/dashboard/feature/client.tsx`: Client feature CRUD UI (list table, add/edit dialogs, delete action, flash status).
- `app/dashboard/feature/actions.tsx`: Feature server actions (`createFeatureItemAction`, `updateFeatureItemAction`, `deleteFeatureItemAction`) with Zod + tenant/role guards.
- `app/invite/[token]/page.tsx`: Invitation acceptance page (validates token, adds user to team).
- `app/invite/[token]/client.tsx`: Client invitation UI with state-based views and acceptance form.
- `app/invite/[token]/actions.ts`: Server action for accepting invitations.
- `app/globals.css`: Global styles; imports Tailwind and design tokens.
- `app/shadcn.css`: shadcn/radix utility classes + keyframes.
- `next.config.ts`: Next config.
- `postcss.config.mjs`: PostCSS with `@tailwindcss/postcss`.
- No `middleware.ts`; requests go straight to App Router.

## 3. Modules / Feature Areas
- `app/`: UI shell and routing.
- `components/`: Shared UI and landing sections.
  - `components/dashboard/`: dashboard-specific client components (`sidebar-nav.tsx`, `dashboard-content.tsx`, `user-menu.tsx`, `mobile-nav.tsx`, `delete-account-dialog.tsx`, `invite-logger.tsx`).
  - `components/home/`: active modular sections (`Layout*Section.tsx`).
  - `components/layout/`: navbar.
  - `components/theme/`: shared `theme-provider` and `theme-toggle` (`ThemeToggle` preferred export; `ModeToggle` compatibility alias).
  - `components/illustrations/`: reusable SVG illustration components.
  - `components/icons/`: reusable social/media icon components.
  - `components/ui/`: shadcn/Radix primitives used across auth, dashboard, and landing sections.
  - client-only helpers: `HeroOrbs.tsx`, `AgentActionPanel.tsx` (stub, unused by default), `ErrorReporter.tsx`.
- `content/`: typed landing content source (`home.ts`) for data-driven copy/config.
- `public/`: static assets (hero/team/images/icons).
- `lib/auth/`: Auth session helpers (`session.ts` — cookie-based, stores `{ userId, email }`) and token helpers (`tokens.ts` — generate/consume single-use auth tokens for email verification and password reset).
- `lib/db/`: Drizzle schema and DB client.
- `lib/email/`: SendGrid email utility (`sendgrid.ts`).
- `drizzle/`: SQL migrations + meta journal.
- Config/tooling: `eslint.config.mjs`, `postcss.config.mjs`, `next.config.ts`, `tsconfig.json`, `drizzle.config.ts`, `components.json`, `railpack.json` (inactive while Dockerfile deploys are active), `railway.json`.
- No route groups yet; create when needed.

### 3.1 Component Quick Edit Map
- Landing page route composition and section order/toggles: `app/page.tsx`.
- Landing content values (copy source of truth): `content/home.ts`.
- Landing section components:
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
- Navbar: `components/layout/navbar.tsx`.
- Dashboard shell and nav components:
  - `app/dashboard/layout.tsx`
  - `components/dashboard/sidebar-nav.tsx`
  - `components/dashboard/user-menu.tsx`
  - `components/dashboard/mobile-nav.tsx`
  - `components/dashboard/dashboard-content.tsx`
- Dashboard route UIs:
  - `app/dashboard/client.tsx`
  - `app/dashboard/settings/client.tsx`
  - `app/dashboard/team/client.tsx`
  - `app/dashboard/feature/client.tsx` (reference scaffold)
- Auth route UIs:
  - `app/auth/client.tsx`
  - `app/auth/forgot-password/client.tsx`
  - `app/auth/reset-password/[token]/client.tsx`
- Invite route UI:
  - `app/invite/[token]/client.tsx`
- Shared reusable primitives and controls: `components/ui/*`.
- Theme toggle import contract: prefer `ThemeToggle` from `components/theme/theme-toggle.tsx`.

## 4. Routes (Controllers)
- `/` → `app/page.tsx`
  - Purpose: section-based landing page composed from `components/home/Layout*Section.tsx` modules.
  - Section IDs currently include: `layout-hero`, `layout-sponsors`, `layout-benefits`, `layout-features`, `layout-services`, `layout-testimonials`, `layout-team`, `layout-pricing`, `layout-contact`, `layout-faq`, `layout-footer`.
  - Visibility controls: `ONLY_SECTIONS` (whitelist) and `HIDE_SECTIONS` (blacklist).
  - Layout: responsive, centered content up to ~1600px; client interactivity kept in small islands.
  - To add a custom section: create `components/home/<NewLayoutSection>.tsx` and register it in the `sections` array in `app/page.tsx` with a stable ID.
  - DTOs/validation/guards: none; render-focused route.
- `/blank` → `app/blank/page.tsx`
  - Purpose: minimal landing starter with shared navbar/footer.
  - Use case: rapid creation of new marketing/landing variants without changing default `/`.
  - DTOs/validation/guards: none; render-focused route.
- `/auth` → `app/auth/page.tsx` + `app/auth/client.tsx`
  - Purpose: credentials entry (one visible form at a time, toggled sign-in/sign-up).
  - Backend wiring: form `action` targets server actions in `app/auth/actions.ts`.
  - Data contract:
    - Sign up inserts into `users` with `password_hash` from bcrypt, auto-creates a personal team, and adds user as owner.
    - Sign in verifies `email` + bcrypt password compare.
    - Redirect safety: `redirectTo` only accepts internal paths that start with `/`.
  - Mode deep links: `/auth#signin`, `/auth#signup`.
  - Signup sends a verification email; verification token is consumed at `/auth/verify-email/[token]`.
- `/auth/forgot-password` → `app/auth/forgot-password/page.tsx` + `client.tsx`
  - Purpose: collect email for password reset request.
  - Backend wiring: `app/auth/forgot-password/actions.ts` generates a `password_reset` token (1-hour TTL) and sends a reset email via SendGrid. Returns a generic success message regardless of whether the email exists (prevents user enumeration).
- `/auth/reset-password/[token]` → `app/auth/reset-password/[token]/page.tsx` + `client.tsx`
  - Purpose: accept a new password after clicking the reset link.
  - Backend wiring: `app/auth/reset-password/[token]/actions.ts` consumes the token (single-use) and updates the password hash.
  - Server component validates token before rendering the form.
- `/auth/verify-email/[token]` → `app/auth/verify-email/[token]/page.tsx`
  - Purpose: consume email verification token and set `users.emailVerified`.
  - Server-only (no client component); redirects to `/dashboard` when a session exists, otherwise redirects to `/auth#signin` with flash status/message.
- `/dashboard` → `app/dashboard/layout.tsx` + `app/dashboard/page.tsx` + `app/dashboard/client.tsx`
  - Layout: shared sidebar (Overview, Team, Settings) + header with sign-out. Auth guard reads session from `lib/auth/session.ts` and redirects unauthenticated users to `/auth#signin`.
  - Purpose: dashboard overview with demo metric cards, getting started checklist, charts, recent activity feed, and a mock Dialog-based CRUD example (local state only).
  - Backend wiring: sign-out form uses server action from `app/dashboard/actions.tsx` (`clearAuthSession()` + redirect).
- `/dashboard/settings` → `app/dashboard/settings/page.tsx` + `app/dashboard/settings/client.tsx`
  - Purpose: account settings for profile (first/last name), email, password, and account deletion.
  - Backend wiring: forms target server actions in `app/dashboard/settings/actions.tsx`.
  - Data contract:
    - Update profile writes `firstName`/`lastName` to `users` table.
    - Update email verifies current password, checks uniqueness, updates `users.email`, and refreshes auth session.
    - Update password verifies current password and writes new bcrypt hash to `users.password_hash`.
    - Delete account verifies current password, deletes user row, and clears session.
- `/dashboard/team` → `app/dashboard/team/page.tsx` + `app/dashboard/team/client.tsx`
  - Purpose: team management — view members, manage roles, invite new members, view/revoke pending invitations.
  - Backend wiring: forms target server actions in `app/dashboard/team/actions.tsx`.
  - Data contract:
    - Invite creates `team_invitations` row with unique token, sends SendGrid email.
    - Revoke sets invitation status to `expired`.
    - Remove deletes `team_members` row (owner/admin only, cannot remove owner).
    - Role update changes `team_members.role` (owner only).
    - Team name updates `teams.name`.
- `/dashboard/feature` → `app/dashboard/feature/page.tsx` + `app/dashboard/feature/client.tsx`
  - Purpose: canonical CRUD scaffold for future dashboard features.
  - Backend wiring: forms target server actions in `app/dashboard/feature/actions.tsx`.
  - Data contract:
    - Create inserts `feature_items` row scoped by `team_id`.
    - Update mutates row by `id` and `team_id` guard.
    - Delete removes row by `id` and `team_id` guard.
  - Permission model: owner/admin can mutate; members can read.
- `/invite/[token]` → `app/invite/[token]/page.tsx` + `app/invite/[token]/client.tsx`
  - Purpose: invitation acceptance — validates token, checks expiry, adds logged-in user to team.
  - If user is not logged in, redirects to `/auth?redirect=/invite/:token#signin`.
  - Backend wiring: `app/invite/[token]/actions.ts` handles acceptance.

## 5. Services & Providers
- `ThemeProvider`: centralized in `components/theme/theme-provider.tsx`, mounted at root layout.
- SendGrid email: `lib/email/sendgrid.ts` (server-side, sends transactional email for invitations, verification, and password reset).
- Auth session: `lib/auth/session.ts` (cookie-based, stores JSON `{ userId, email }` payload with iframe-compatible attributes: `sameSite: "none"`, `secure: true`, `httpOnly: true`, `path: "/"`).
- No background service layer or worker runtime in-app.

## 6. Data Layer
- ORM/DB: Drizzle ORM + PostgreSQL.
- Schema: `lib/db/schema.ts` — tables: `users`, `teams`, `team_members`, `team_invitations`, `feature_items`, `auth_tokens`.
- Client: `lib/db/client.ts`.
- Migrations: `drizzle/*.sql` + `drizzle/meta/_journal.json` (`0000` base tables + `0001` feature CRUD table + `0002` auth tokens table).
- Auth persistence: `users` table is the source of truth for credentials flow.
- Auth token persistence: `auth_tokens` stores one active token per user/type (`email_verification`, `password_reset`) and tokens are consumed once.
- Team model: multi-tenant. Each user belongs to a team via `team_members` (roles: `owner`, `admin`, `member`). A personal team is auto-created on signup. Invitations are tracked in `team_invitations` with unique tokens and expiry.
- Rule: keep migrations and journal in sync; `scripts/db-init.js` validates journal integrity before migrate.

## 7. DTOs, Schemas & Validation
- Server actions use Zod for input validation (schemas co-located in the action files).
- UI form primitives exist in `components/ui/form.tsx` and related controls.
- When adding APIs/forms, keep validators with the feature or under `lib/validation/` and document contracts.

## 8. Cross-Cutting Concerns
- Middleware guards, tracing, and centralized logging are not implemented.
- Credentials auth form + DB actions are implemented; cookie-based session (`lib/auth/session.ts`) stores `{ userId, email }`. Dashboard layout enforces auth guard.
- Current custom auth type is stateful cookie session (credentials + DB user lookup + `httpOnly` cookie managed in `lib/auth/session.ts`).
- If custom auth is expanded, standardize on DB-backed session IDs (opaque/signed token) instead of raw identity values in cookie payloads.
- Iframe embedding cookie policy is defined in `README.md` Section 14 and mirrored in `RULES.md` Auth & Security rules.
- Error forwarding exists via `scripts/error-reporter.ts` + `components/ErrorReporter.tsx`.
- Theme switching is cross-cutting and centralized in `components/theme/*`.
- Email delivery via SendGrid is wired for team invitations, email verification, and password reset; gracefully degrades if `SENDGRID_API_KEY` is not set.

## 9. Configuration & Environment
- `env.example` currently defines: `OPENAI_API_KEY`, optional `OPENAI_MODEL`, `DATABASE_URL`, `DATABASE_SSL`, `BASE_URL`, `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, and optional `NEXTAUTH_SECRET`.
- Secrets: keep in `.env.local` (gitignored); never commit secrets.
- Config files in repo: `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json`, `drizzle.config.ts`, `railpack.json` (inactive while Dockerfile deploys are active), `railway.json`.
- Runtime/deployment contract: Docker (`Dockerfile`) by Railway for development workflow and Vercel for production. `railpack.json` is retained but inactive while Dockerfile deploys are active.

## 10. Async & Background Processing
- Queues/workers/schedulers: none.
- Operational scripts in `scripts/`:
  - `dev-supervisor.js`: supervised dev runtime (Next + git poll integration).
  - `git-poll.js`: optional origin polling for supervised environments.
  - `db-init.js`: migration bootstrap with Drizzle journal guard.

## 11. Testing Structure
- No tests currently.
- Suggested layout when added: unit (`__tests__/` or co-located), e2e (`e2e/` via Playwright), shared fixtures in `tests/utils/`.

## 12. File & Directory Index
```text
.gitignore                 # Git ignores
.dockerignore              # Docker ignores
README.md                  # Operational guide
FILES.md                   # Structural index (this file)
RULES.md                   # Change boundaries
components.json            # shadcn/ui configuration (radix-nova preset)
app/
  favicon.ico              # Favicon
  auth/
    actions.ts             # Server actions for sign in / sign up (+ team auto-creation + verification email + resend)
    page.tsx               # Server route entry for /auth
    client.tsx             # Client auth UI
    verify-email/
      [token]/
        page.tsx           # Consumes email verification token, sets emailVerified
    forgot-password/
      actions.ts           # Generates password reset token + sends email
      page.tsx             # Server route entry for /auth/forgot-password
      client.tsx           # Client forgot-password form
    reset-password/
      [token]/
        actions.ts         # Consumes reset token + updates password
        page.tsx           # Server route entry (validates token)
        client.tsx         # Client reset-password form
  dashboard/
    layout.tsx             # Shared dashboard layout (sidebar, header, auth guard)
    actions.tsx            # Shared dashboard actions (sign out)
    page.tsx               # Server route entry for /dashboard
    client.tsx             # Client dashboard overview UI
    settings/
      actions.tsx          # Settings actions (profile/email/password/delete account)
      page.tsx             # Server route entry for /dashboard/settings
      client.tsx           # Client account settings UI
    team/
      actions.tsx          # Team management actions (invite, revoke, remove, roles, name)
      page.tsx             # Server route entry for /dashboard/team
      client.tsx           # Client team members and invitations UI
    feature/
      actions.tsx          # Feature CRUD server actions (create/update/delete)
      page.tsx             # Server route entry for /dashboard/feature
      client.tsx           # Client feature CRUD UI (list + dialogs)
  invite/
    [token]/
      actions.ts           # Invitation acceptance action
      client.tsx           # Invitation acceptance UI
      page.tsx             # Invitation acceptance route
  globals.css              # Global styles + tokens
  layout.tsx               # Root layout (ThemeProvider + ErrorReporter)
  page.tsx                 # Public landing page (composes Layout* sections)
  shadcn.css               # Utility classes/keyframes
content/
  home.ts                  # Typed landing content + defaults
public/
  demo-img.jpg             # Demo image
  hero-image-light.jpeg    # Hero asset
  hero-image-dark.jpeg     # Hero asset
  team1.jpg                # Team asset
  team2.jpg                # Team asset
  team3.jpg                # Team asset
  file.svg                 # Sample asset
  globe.svg                # Sample asset
  next.svg                 # Next.js logo
  vercel.svg               # Vercel logo
  window.svg               # Sample asset
scripts/
  commandRunner.js          # Command execution engine used by /api/run and /run handlers
  db-init.js               # Validates Drizzle journal + runs migrate
  dev-supervisor.js        # Supervisor for next dev (default) / next start (NEXT_DEV=false) + git poller
  git-poll.js              # Polls git origin for updates
  error-reporter.ts        # Client-safe error forwarder
types/
  bcryptjs.d.ts            # TypeScript declarations for bcryptjs
components/
  dashboard/
    sidebar-nav.tsx        # Client sidebar nav with active-route detection
    dashboard-content.tsx  # Client dashboard overview (metrics, charts, search, activity, mock Dialog CRUD demo)
    user-menu.tsx          # Client user avatar popover with sign-out
    mobile-nav.tsx         # Client mobile navigation sheet (imports SidebarNav)
    delete-account-dialog.tsx  # Client account deletion dialog with password confirmation
    invite-logger.tsx      # Client helper that logs invite URLs to console
  home/
    LayoutHeroSection.tsx
    LayoutSponsorsSection.tsx
    LayoutBenefitsSection.tsx
    LayoutFeatureGridSection.tsx
    LayoutServicesSection.tsx
    LayoutTestimonialSection.tsx
    LayoutTeamSection.tsx
    LayoutPricingSection.tsx
    LayoutContactSection.tsx
    LayoutFaqSection.tsx
    LayoutFooterSection.tsx
  layout/
    navbar.tsx             # Responsive navbar
  theme/
    theme-provider.tsx     # Shared ThemeProvider wrapper
    theme-toggle.tsx       # Shared theme toggle (`ThemeToggle` preferred, `ModeToggle` alias supported)
  illustrations/
    HeroStackIllustration.tsx
    GlobeBadgeIllustration.tsx
  icons/
    discord-icon.tsx
    github-icon.tsx
    linkedin-icon.tsx
    x-icon.tsx
  ui/
    accordion.tsx
    alert-dialog.tsx
    avatar.tsx
    badge.tsx
    button.tsx
    card.tsx
    carousel.tsx
    collapsible.tsx
    dialog.tsx
    dropdown-menu.tsx
    form.tsx
    icon.tsx
    input.tsx
    label.tsx
    navigation-menu.tsx
    pagination.tsx
    popover.tsx
    scroll-area.tsx
    select.tsx
    separator.tsx
    sheet.tsx
    skeleton.tsx
    table.tsx
    tabs.tsx
    textarea.tsx
    tooltip.tsx
  HeroOrbs.tsx             # Client parallax helper
  AgentActionPanel.tsx     # Client note stub (not rendered by default)
  ErrorReporter.tsx        # Mounts error reporter on client
lib/
  utils.ts                 # Shared utility helpers
  auth/
    session.ts             # Cookie-backed auth session helper (userId+email)
    tokens.ts              # Auth token generate/consume helpers (email verification + password reset)
  db/
    schema.ts              # Drizzle schema (users, teams, team_members, team_invitations, auth_tokens) (server-only)
    client.ts              # Drizzle + pg pool client (server-only)
  email/
    sendgrid.ts            # SendGrid email utility
drizzle/
  0000_minor_crusher_hogan.sql  # Initial migration (users/teams/invitations)
  0001_chubby_ser_duncan.sql    # Adds feature_items table
  0002_tense_sabretooth.sql    # Adds auth_tokens table
  meta/
    _journal.json          # Migration journal
    0000_snapshot.json     # Schema snapshot
    0001_snapshot.json     # Schema snapshot
drizzle.config.ts          # Drizzle CLI config
eslint.config.mjs          # ESLint config
next.config.ts             # Next.js config
postcss.config.mjs         # PostCSS config (Tailwind-ready)
tsconfig.json              # TypeScript config
package.json               # Scripts and dependencies
pnpm-lock.yaml            # Locked deps
railpack.json              # Railpack config (retained, inactive while Dockerfile deploys are active)
railway.json               # Railway start/build config
.github/
  workflows/
    init-db.yml            # GitHub Actions DB init workflow (manual dispatch, operational)
```

## 13. Safe Modification Guidance
- New public pages: add under `app/` with route folders (for example `app/about/page.tsx`).
- New dashboard features: add under `app/dashboard/<feature>/` with co-located actions. The shared layout (`app/dashboard/layout.tsx`) handles sidebar and auth guard automatically.
- Landing sections: add under `components/home/` and register in `app/page.tsx` using stable section IDs.
- Data/API: place server code in `lib/` or `app/api/.../route.ts`; validate inputs at the edge; keep server-only dependencies out of client components.
- Keep theme logic centralized in `components/theme/*`.
- Avoid expanding global CSS unnecessarily; prefer scoped/component styles.
- Keep changes minimal; update `README.md` and `RULES.md` if scope (auth, DB, payments, deployment architecture) changes.

---

If structure or intent is uncertain, **STOP AND ASK** before modifying.
