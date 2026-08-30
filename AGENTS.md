# Repository Guidelines

## Project Structure & Module Organization

This repository is a small, static portfolio site. The main page, responsive CSS, and browser JavaScript are kept in [`index.html`](index.html). Runtime assets live in [`public/`](public/), while editable résumé material follows the staged flow in [`curriculo/`](curriculo/). Read [`docs/AI_HARNESS.md`](docs/AI_HARNESS.md) before broad content or automation changes. [`scripts/build.mjs`](scripts/build.mjs) packages the page and selected assets into `dist/` for the hosted worker; treat `dist/` as generated output.

## Build, Test, and Development Commands

- `npm run check` — validates required sources, the public résumé, placeholders, and then generates the deployable output.
- `npm run build` — generates `dist/server/index.js` and copies hosting metadata into `dist/.openai/`.
- `npx serve .` — optionally serves the source locally for browser inspection (use any equivalent static-file server).

There is no configured test runner or linter. After changes, open the site locally and verify navigation, theme switching, résumé dialog/download, contact mailto behavior, responsive menu, and project links.

## Coding Style & Naming Conventions

Use two-space indentation for HTML, CSS, and JavaScript. Keep the existing single-file organization unless a change clearly benefits from extraction. Prefer semantic HTML, accessible labels/landmarks, and `kebab-case` for CSS classes and `data-*` attributes (for example, `.project-link` and `data-filter`). Preserve the existing CSS custom-property design tokens and responsive breakpoints. Use descriptive, lowercase asset filenames with hyphens; avoid spaces in new filenames.

Keep project metadata synchronized between `data/projects.json` and its matching HTML card. Use the stable project ID instead of a list position or title when a script, agent, or URL needs to identify a project.

## Testing Guidelines

Testing is currently manual and browser-based, with a lightweight repository check. Check desktop and narrow/mobile layouts, keyboard focus, reduced-motion behavior, both color themes, and console errors. Run `npm run check` before committing.

## Commit & Pull Request Guidelines

Recent commits use short Conventional Commit-style subjects such as `fix(portfolio): organize project grid` and `feat(portfolio): add data horizon lab project`. Follow that pattern: use an imperative, focused subject and keep unrelated edits separate. Pull requests should explain the user-visible change, identify affected sections/assets, include screenshots or a short screen recording for visual changes, and state the validation performed (for example, `npm run build` plus responsive browser checks).

## Security & Configuration Tips

Do not commit secrets, private contact data beyond the intentionally public portfolio content, or unnecessary generated files. Keep `.openai/hosting.json` valid JSON and update build logic when adding assets that must be served by the generated worker. Do not invent résumé metrics or expose internal business information.
