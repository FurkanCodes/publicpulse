# Repository Guidelines

## Project Structure & Module Organization
PublicPulse is a Next.js 16 app that keeps routes under `app/`, with grouped segments such as `app/(auth)` for sign-in flows and `app/(main)` for the dashboard. Shared UI lives in `components/`, while request logic and server actions sit in `data-access/`. Database schema files are maintained in `db/`, and generated Drizzle migrations land in `supabase/migrations`. Cross-cutting utilities live in `lib/`, reusable hooks in `hooks/`, and static assets (icons, fonts, images) in `public/`.

## Build, Test, and Development Commands
- `npm run dev` starts the Next.js dev server with hot reload.
- `npm run build` compiles the production bundle and validates TypeScript types.
- `npm run start` serves the compiled app; run after `npm run build`.
- `npm run lint` runs ESLint with the Next.js Core Web Vitals ruleset.
- `npx drizzle-kit generate` regenerates SQL migrations from `db/schema.ts` into `supabase/migrations`.

## Coding Style & Naming Conventions
Code is TypeScript-first with 2-space indentation, double quotes, and trailing commas where permitted. Components and files exporting React elements use PascalCase; hooks begin with `use` and live in `hooks/`; route segment files follow the Next.js convention (`page.tsx`, `layout.tsx`). Tailwind utilities are the primary styling mechanism; keep class lists readable with logical grouping. Before pushing, run `npm run lint`, and address lint feedback instead of suppressing rules.

## Testing Guidelines
An automated test suite is not yet checked in. When adding features, include unit or integration tests alongside the code (e.g., `feature-name.test.tsx` adjacent to the component or within a `__tests__/` folder) and document any new tooling in `README.md`. At minimum, ensure `npm run lint` passes and verify key user flows locally via the Next.js dev server.

## Commit & Pull Request Guidelines
Commits should follow Conventional Commits (`feat:`, `refactor:`, etc.) as reflected in the existing history. Keep commits scoped and descriptive, referencing affected areas (e.g., `feat: add onboarding checklist to dashboard`). Pull requests must describe the change, link relevant issues, include environment setup notes, and provide screenshots or screencasts for UI-facing updates. Flag any schema changes and include the generated migration files.

## Environment & Security Notes
Application secrets reside in `.env.local`; never commit this file. Ensure Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc.) are present before running Drizzle commands or starting the app. When adding new configuration, document required variables and provide safe defaults. Review dependencies for security notices and prefer environment-based configuration over hard-coded values.
