<!-- Copilot / AI agent instructions for contributors -->
# Project overview for AI coding agents

This file contains focused, actionable guidance for AI coding agents working in this repository. Keep edits minimal and only change if you confirm behavior locally.

1) Big picture
- Frontend single-page app built with Vite + React + TypeScript.
- Routing: `react-router-dom` in `src/App.tsx` with page components under `src/pages/` (example: `Index`, `Reserva`, `NotFound`).
- UI primitives: `src/components/ui/*` follows the shadcn-ui pattern (small, composable wrappers around Radix primitives and Tailwind). Prefer reusing these primitives.
- Page layout/components: `src/components/*` contains feature fragments (Header, Hero, Rooms, Amenities, Testimonials, Footer).
- Data fetching/state: uses `@tanstack/react-query` (see `QueryClientProvider` in `src/App.tsx`).

2) Local dev & common commands
- Install: `npm i`
- Dev server: `npm run dev` (runs `vite`). If the dev server fails, check terminal logs for missing env or port conflicts.
- Build: `npm run build` (or `npm run build:dev` for a development-mode build), preview with `npm run preview`.
- Lint: `npm run lint` (ESLint config at project root).

3) Important repo conventions & patterns (do not change without tests)
- Path alias: `@/*` -> `src/*` (configured in `tsconfig.json`). Use `@/` imports where present.
- UI components under `src/components/ui` are reused across pages — prefer editing or composing here rather than duplicating styles in page files.
- Tailwind is the styling system; utility classes are used in components and pages. See `tailwind.config.ts` and `src/index.css`.
- Notifications: two systems exist — a local `Toaster` (`src/components/ui/toaster.tsx`) and a `Sonner` wrapper (`src/components/ui/sonner.tsx`). Prefer the existing wrappers when adding notifications.
- Routing note: add new routes in `src/App.tsx` above the catch-all `*` route.

4) Integration points & external deps to be aware of
- Radix UI + shadcn wrappers live in `src/components/ui/*` (many files present). These are critical for accessibility and consistent behavior.
- `@tanstack/react-query` handles server state and caching; mutations/queries usually live close to components that use them.
- Tailwind & postcss are configured; do not add global CSS files without checking `index.css`.

5) Typical change checklist for agents
- Update imports using the `@/` alias when adding files under `src/`.
- Reuse `src/components/ui/*` primitives before adding new UI components.
- Run `npm run dev` and test the route(s) you changed (`/` and `/reserva` exist).
- Run `npm run lint` if you modify TS/JS files.

6) Files to inspect for context (quick links)
- `src/App.tsx` — routing and providers.
- `src/main.tsx` — app entry.
- `src/pages/Index.tsx`, `src/pages/Reserva.tsx` — main pages.
- `src/components/` — page fragments (Header, Hero, Footer, etc.).
- `src/components/ui/` — shared UI primitives (Radix + Tailwind wrappers).
- `package.json` — scripts and dependencies.

7) When uncertain — what to ask or validate
- Does the change need a new UI primitive or can it use an existing one in `src/components/ui`?
- Will the change affect routing? If so, update `src/App.tsx` and test navigation.
- Any global style changes must be validated with Tailwind build (run dev and inspect visually).

If anything above is unclear or you want me to include examples of common edits (e.g., adding a new route + page, or creating/reusing a UI primitive), tell me which example and I'll add a short, safe code snippet.
