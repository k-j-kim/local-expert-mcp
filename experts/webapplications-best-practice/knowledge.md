---
topic: webapplications-best-practice
description: Salesforce React BYO app reference — routes, path aliases, Tailwind/shadcn, folder structure, components, build/test, verification
---

# Salesforce React BYO app reference

Single reference for building or extending this app.

## Overview

This app is a **Salesforce-hosted React (BYO) web application** built with Vite, React Router, Tailwind CSS v4, and shadcn-style UI components. It serves as a foundational template for building features that deploy to Salesforce Orgs.

**Goals:** Keep new code consistent with existing patterns, avoid common mistakes (wrong imports, bypassing routes, breaking layout), and prefer path aliases and copying patterns over ad-hoc choices.

**Stack:** React 19, React Router 7, Vite 7, TypeScript, Tailwind v4, shadcn-style (Radix, CVA, `cn()`), Lucide, `@tanstack/react-form`, Zod, AuthContext + route guards. Build uses `@salesforce/vite-plugin-webapp-experimental`.

## Critical Rules (Read First)

1. **Routes live in `routes.tsx` only.** Do not create new routes in `app.tsx` or elsewhere.
2. **Use path aliases.** Prefer `@/`, `@components/`, `@utils/`, etc. Avoid deep relative paths like `../../../`.
3. **Use Tailwind for layout and styling.** Do not introduce a second CSS approach (e.g. CSS Modules, styled-components) unless a feature package requires it.
4. **Use or extend existing UI components.** Prefer `@/components/ui` (and barrel) over one-off styled divs for buttons, inputs, cards, alerts.
5. **Preserve layout structure.** Page content is rendered inside `AppLayout` via `<Outlet />`. New pages are children of the layout, not a replacement for the shell.
6. **Auth paths:** Use `ROUTES` from `@/utils/authenticationConfig`; do not hardcode `/login`, `/profile`, etc.
7. **Always validate.** After any change (new feature, new route, new component), run `npm i && npm run build && npm run dev` to confirm install, build, and dev server work.

When in doubt, mimic an existing page (`Home`, `About`, `New`) or component (`StatusAlert`, `AuthForm`) and follow the same file location and import style.

## 1. UI & Styling (Tailwind & shadcn)

- **Tailwind** for all layout and styling: flex, grid, spacing, typography, borders, backgrounds, responsive (`sm:`, `lg:`), and design tokens (e.g. `bg-background`, `text-foreground`, `border`, `rounded-lg`).
- **shadcn / `components/ui`** for buttons, inputs, selects, cards, alerts, tabs, tables, labels, spinners — use or extend these; use CVA for variants.
- **Design tokens** in `src/styles/global.css`: `:root` and `.dark` define `--background`, `--foreground`, `--card`, `--primary`, `--destructive`, `--border`, `--radius`, etc. Use token-based classes (e.g. `bg-primary`, `text-destructive`) instead of hardcoded colors.
- **`cn()`** from `@/lib/utils` (clsx + tailwind-merge): use for conditional or overridable class names, e.g. `className={cn(buttonVariants({ variant, size }), className)}`.

**Rules:** Do not add a separate styling system. Do not build new buttons/inputs/cards/alerts from raw HTML when `components/ui` has them. Merge class names with `cn()` in components that accept `className` or use variants.

**Patterns:** Page container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12`. Icons: `lucide-react`; `aria-hidden="true"` when decorative. Prefer `focus-visible:` for focus; `prefers-reduced-motion` is handled in `global.css`.

## 2. Routing (React Router & routes.tsx)

- **Single source of truth:** All route definitions in `src/routes.tsx` in the exported `routes` array (`RouteObject[]`). `app.tsx` only creates the router and provides `RouterProvider`.
- **Layout:** `path: "/"`, `element: <AppLayout />`. All user-facing routes are **children** of this. `AppLayout` renders `NavigationMenu` and `<Outlet />`; the active route's `element` renders in place of `<Outlet />`.
- **Nav:** Routes can set `handle: { showInNavigation: true, label: "Label" }`. The nav uses `getAllRoutes()` from `router-utils.tsx` and filters by `handle?.showInNavigation === true`, using `handle?.label` for link text.
- **Auth groups:**
  - **Public:** Home, About, NotFound — direct children of layout.
  - **AuthenticationRoute:** Login, Register, ForgotPassword, ResetPassword — redirects authenticated users away.
  - **PrivateRoute:** Profile, ChangePassword — redirects unauthenticated users to Login with `startUrl`.

Use `ROUTES.LOGIN.PATH`, `ROUTES.PROFILE.PATH`, etc. from `@/utils/authenticationConfig` for auth paths. Catch-all `path: '*'` (NotFound) must remain last among layout children.

**Adding a new page:** (1) Create `src/pages/MyPage.tsx` (default export, same container pattern as existing pages). (2) In `routes.tsx`, import the page and add a route under the layout's `children`: `path`, `element`, and `handle` if it should show in nav. (3) Put under the correct guard (public, AuthenticationRoute, or PrivateRoute). (4) Use `getAllRoutes()` from `@/router-utils` if you need full paths for nav/breadcrumbs.

## 3. Folder Structure & Path Aliases

**Path aliases (vite.config.ts & tsconfig.json):**

| Alias         | Resolves to     | Use for                          |
|---------------|-----------------|----------------------------------|
| `@/*`         | `./src/*`       | General app code                 |
| `@api/*`      | `./src/api/*`   | API, GraphQL, types              |
| `@components/*` | `./src/components/*` | React components          |
| `@utils/*`    | `./src/utils/*` | Helpers, config                 |
| `@styles/*`   | `./src/styles/*`| Global/theme CSS                 |
| `@assets/*`   | `./src/assets/*`| Static assets                    |

**Folder structure (src):**

- `api/` — API layer, GraphQL types
- `components/` — `alerts/`, `auth/` (guards), `forms/`, `footers/`, `layout/`, `ui/` (shadcn-style + `index.ts` barrel)
- `context/` — e.g. AuthContext
- `hooks/` — shared hooks
- `lib/` — e.g. `utils.ts` (`cn`)
- `pages/` — one default-export component per route
- `styles/` — global.css, theme
- `test/` — test setup
- `utils/` — authenticationConfig, helpers
- Root: `app.tsx`, `appLayout.tsx`, `navigationMenu.tsx`, `routes.tsx`, `router-utils.tsx`

**Where to add what:** New page → `src/pages/`. New route → add to `routes.tsx` only. New shadcn-style UI → `src/components/ui/` + export in `components/ui/index.ts`. Form/layout/guard/alert → `components/forms/`, `layout/`, `auth/`, `alerts/`. Context → `context/`. Hooks → `hooks/`. Config → `utils/`. Pure util → `lib/`. API/GraphQL → `api/`.

**Rules:** Use path aliases in new code. Keep `routes.tsx` and `router-utils.tsx` at src root. When adding a component under `components/ui`, export it from `components/ui/index.ts`.

## 4. Component Patterns (CVA, Radix, Forms, Context)

- **CVA:** Use when a component has multiple visual variants (e.g. button, alert). Define `variants` and `defaultVariants`, then `className={cn(componentVariants({ variant, size }), className)}`. Use `VariantProps<typeof componentVariants>` for props. Single-style components can use plain `cn(base, className)`.
- **Radix:** Use existing wrappers in `components/ui` (Button with Slot, Label, Select, etc.). New primitives go in `components/ui` with CVA + `cn()`.
- **Barrel:** Import from `@/components/ui` (e.g. `import { Button, Input, Card } from "@/components/ui"`). New UI components must be exported from `src/components/ui/index.ts`.
- **Forms:** `useFormContext` from a parent using `@tanstack/react-form`. **AuthForm** wraps auth pages (card, title, description, error/success alerts, FieldGroup, SubmitButton, footer link). **SubmitButton** uses form context. New auth forms should use AuthForm + Field, Input, Label, StatusAlert, FooterLink.
- **Auth:** **AuthProvider** in `app.tsx` provides `user`, `isAuthenticated`, `loading`, `error`, `checkAuth`. **useAuth()** only under AuthProvider. Do not create a second auth context; use `useAuth()` for current user.

**Rules:** Always use `cn()` for component class merging. Forward ref and spread props on wrapper components. Prefer composition (CardLayout, Card, Alert, StatusAlert) over new one-off layout components. Use AuthForm + guards (PrivateRoute / AuthenticationRoute) for auth flows.

**Adding a new UI component:** (1) Place in `src/components/ui/` or a feature folder that uses `components/ui`. (2) Use CVA + `cn()` if variants needed; forward ref and props. (3) Export from `components/ui/index.ts` if under ui/. (4) Use design tokens for colors/radius.

## 5. Build, Test & Verify

### Build

- **dev:** `npm run dev` — Vite dev server.
- **build:** `npm run build` — `tsc -b` then `vite build` → `dist/`.
- **build:e2e:** `npm run build:e2e` — build + rewrite `dist/` for E2E (root-relative assets + SPA fallback).
- **preview:** `npm run preview` — serve `dist/` locally.

Do not remove `tsc -b` from build. Do not change `outDir`/`assetsDir` without updating Playwright and deploy config.

### Unit/component tests (Vitest)

- **test:** `npm run test`. With coverage: `npm run test -- --coverage`.
- Config in vite.config: jsdom, `setupFiles: ['./src/test/setup.ts']`, patterns `src/**/*.{test,spec}.*` and `src/**/__tests__/**/*`. Timeout 10s. Coverage: v8, 85% thresholds.
- Use `@testing-library/react` and path aliases; wrap with AuthProvider/RouterProvider when needed.

### E2E (Playwright)

- Run: `npm run build:e2e` then `npx playwright test`.
- Config: `e2e/` dir, port 5175, webServer runs `npx serve dist -l 5175` (built app, not Vite dev). SPA fallback via `dist/serve.json` (written by `scripts/rewrite-e2e-assets.mjs`).
- Add specs under `e2e/`; use role-based selectors; baseURL is set.

### Verify changes (order)

**Always validate** with:

```bash
npm i && npm run build && npm run dev
```

Then, as needed:

1. **Lint:** `npm run lint`
2. **Type-check/build:** `npm run build`
3. **Unit tests:** `npm run test` (optionally `--coverage`)
4. **E2E:** `npm run build:e2e && npx playwright test`

**Minimal:** `npm run lint && npm run build`. **Full (e.g. before PR):** lint, build, test, build:e2e, playwright test.

## 6. Verification Checklist & Quick Reference

### Verification checklist

**Routing:** New route only in `src/routes.tsx`; nav route has `handle: { showInNavigation: true, label: "..." }`; auth paths use `ROUTES.*`; catch-all last.

**UI:** Tailwind + tokens; use `@/components/ui` where applicable; `cn()` for conditional/override classes; no hardcoded colors that have a token.

**Structure:** New page in `src/pages/` with default export; imports use aliases; new UI in `components/ui` exported from barrel.

**Forms/auth:** Auth-like forms use AuthForm + Field/Input/SubmitButton/StatusAlert; use `useAuth()` only under AuthProvider; private under PrivateRoute, public-only auth under AuthenticationRoute.

**Quality:** No unused imports/variables; focus and aria where needed; decorative icons `aria-hidden="true"`.

**Validate:** Always run `npm i && npm run build && npm run dev` after changes to confirm the app runs.

**Build/test:** Lint passes; build passes; test passes; after build:e2e, playwright test passes; critical new routes covered by E2E if needed.

### Key files

| Concern           | File(s) |
|-------------------|--------|
| Route definitions | `src/routes.tsx` |
| Nav from routes   | `src/navigationMenu.tsx`, `src/router-utils.tsx` |
| Layout shell      | `src/appLayout.tsx` |
| Root & router     | `src/app.tsx` |
| Auth config       | `src/utils/authenticationConfig.ts` |
| Auth state        | `src/context/AuthContext.tsx` |
| Route guards      | `src/components/auth/authentication-route.tsx`, `private-route.tsx` |
| Global styles     | `src/styles/global.css` |
| Class merge       | `src/lib/utils.ts` (`cn`) |
| UI barrel         | `src/components/ui/index.ts` |
| Path aliases      | `vite.config.ts`, `tsconfig.json` |

### Common errors (condensed)

| Error / symptom              | Fix |
|-----------------------------|-----|
| Page not found / no shell   | Add route in `routes.tsx` as child of layout; nest under AppLayout. |
| Link in nav wrong/missing    | Set `handle: { showInNavigation: true, label: "..." }`. |
| Module not found (alias)    | Use exact alias; file under `src/`. |
| Form submit does nothing    | Wrap in FormProvider; call `form.handleSubmit()` in onSubmit. |
| useAuth undefined           | Use useAuth only under AuthProvider. |
| Redirect loop auth          | Use ROUTES from authenticationConfig; correct guard. |
| Styles/override not working | Use `cn(baseClasses, variantClasses, className)`. |
| Unknown Tailwind class       | Use classes from global.css / @theme. |
| Barrel import fails         | Export from `src/components/ui/index.ts`. |
| tsc/build fails             | Fix types; aliases match vite/tsconfig. |
| E2E 404 on routes           | Use `build:e2e` so `serve.json` is written; serve dist. |

### Commands quick reference

| Goal            | Command |
|-----------------|---------|
| **Validate (always)** | `npm i && npm run build && npm run dev` |
| Dev server      | `npm run dev` |
| Production build| `npm run build` |
| Build for E2E   | `npm run build:e2e` |
| Lint            | `npm run lint` |
| Unit tests      | `npm run test` |
| Unit + coverage | `npm run test -- --coverage` |
| E2E             | `npm run build:e2e && npx playwright test` |
| Preview build   | `npm run preview` |

## Optional: Salesforce & metadata

- **Metadata:** May live in local SFDX project and/or remote Org; consider both for deployment/config.
- **Auth:** DX CLI auth tokens can be used for Org access where applicable.
- **Feature packages:** For auth, search, charts, GraphQL, shadcn, prefer the official Salesforce feature package; follow README/AGENT.md; integrate by **copying** files and adjusting imports (e.g. to `@/`) rather than rewriting. Use **webapplications-feature-adding-features** for the copy-then-adjust workflow.
