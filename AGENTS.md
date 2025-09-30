# Repository Guidelines

This Astro site powers the Skipulagsfræðingafélag Íslands web presence and pulls content from Sanity.

## Project Structure & Module Organization
- `src/pages/` defines routes such as `index.astro` and `frettir/`; add new public-facing pages here.
- `src/components/` holds reusable Astro components; keep filenames in PascalCase.
- `src/lib/` centralizes Sanity helpers (`sanity.ts`, `news.ts`, `portableText.ts`); place shared data utilities here.
- `src/assets/` and `src/styles/` store images and Tailwind configuration, while `public/` ships static files unchanged.
- Astro outputs to `dist/`; never commit that directory.

## Build, Test, and Development Commands
- `npm install` — install or refresh dependencies.
- `npm run dev` — start Astro with live reload at `http://localhost:4321`.
- `npm run build` — produce the static build and fetch current Sanity content.
- `npm run preview` — serve the most recent build in production mode.
- `npm run astro -- check` — run Astro strict type and config checks before a PR.

## Coding Style & Naming Conventions
- Use two-space indentation and single quotes; prefer PascalCase for component filenames and camelCase for helpers.
- Keep reusable logic in `src/lib/` and avoid `any` unless you document why it is required.
- Update shared styles through `src/styles/global.css` and lean on Tailwind utilities instead of inline CSS.

## Testing Guidelines
- No automated tests yet; verify changes with `npm run build` and `npm run preview`.
- For new data-processing logic, add integration tests with `@astrojs/test` under `src/tests/` or document manual verification steps in the PR.
- Confirm Sanity connectivity by copying `.env.example` to `.env`, filling Sanity variables, and running `npm run dev`.

## Commit & Pull Request Guidelines
- Follow the existing style of focused, imperative commit subjects (e.g., `Integrate Tailwind CSS`).
- Keep each change scoped, omit secrets and generated files (`dist/`, `.env`), and use commit bodies for essential context.
- Pull requests should include goals, testing notes (`dev`, `build`, `preview`, manual steps), and screenshots for UI updates. Reference related issues where possible.
- Update `.env.example` whenever new environment variables are required and call that out in the PR.

## Environment & Configuration
- Copy `.env.example` to `.env` and supply `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, and any required `SANITY_API_READ_TOKEN` before running locally.
- Never expose secrets in the repository or PR descriptions; prefer local env files or CI-managed secrets for deployments.
