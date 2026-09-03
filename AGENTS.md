# Repository Guidelines

## AI Quick Start (leia primeiro)

Este é um portfólio estático de uma única página. Não faça varredura ampla: consulte somente a fonte relacionada à tarefa.

| Necessidade | Fonte de verdade | Ação |
| --- | --- | --- |
| Interface/site | `index.html`, `data/projects.json`, `data/certificates.json` | Preserve o layout; o site renderiza apenas itens curados/publicados. |
| Currículo | `curriculo/02-fonte/`, `curriculo/03-layout/`, `public/documents/curriculo-eduarda-reis.pdf` | Rode `npm run content:automate` quando a mudança vier de conteúdo. |
| Carreira | `data/career-profile.json`, `curriculo/04-revisao/painel-profissional.md` | Use `$data-analyst-career-advisor`; não invente fatos. |
| Curadoria/aplicação | `.agents/skills/portfolio-content-maintainer/SKILL.md`, `automation/README.md` | Registre decisões em `curation`; casos ambíguos ficam em revisão. |
| LinkedIn | `curriculo/07-linkedin/perfil-linkedin.md` | Use como fonte editorial; publique no navegador somente com confirmação. |

### Endereços oficiais

- Site principal: `https://eduarda-reis-data-ai.eduardareis1616.chatgpt.site/`
- Vitrine interativa de dashboards: `https://sites.google.com/view/portflioeduardareis/início` (somente link, não é destino de deploy)
- GitHub: `https://github.com/dudsstar16`

### Fluxo padrão de conteúdo

1. Novo certificado: colocar o PDF em `curriculo/06-certificados/`; a tarefa local ou o workflow executa a análise.
2. Novo projeto: publicar no GitHub; o workflow semanal descobre e pontua o repositório.
3. Alta confiança: catálogo, site e seleção do currículo podem ser atualizados automaticamente dentro dos limites.
4. Falta de evidência, substituição ou promoção: manter em revisão e explicar a próxima ação.
5. Antes de entregar: `npm run check` e `npm run build`.

Limites atuais: 8 certificados visíveis no site, 6 no currículo e 6 projetos principais. Nunca edite `dist/` diretamente.

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

## Professional Career Advisor

For résumé, portfolio, certificate, project-selection, promotion, or Data Analyst career decisions, use `.agents/skills/data-analyst-career-advisor/SKILL.md`. For deterministic application, use `.agents/skills/portfolio-content-maintainer/SKILL.md`. Treat `data/career-profile.json` as structured career context and `curriculo/04-revisao/painel-profissional.md` as generated decision support. High-confidence content may be published automatically within the documented limits; ambiguous content, replacements, promotion claims, and LinkedIn publication require human confirmation.
