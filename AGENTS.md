# Repository Guidelines

## AI Quick Start (leia primeiro)

Este é um portfólio estático de uma única página. Não faça varredura ampla: **leia primeiro `memoria/contexto-rapido.md` e `memoria/historico-ajustes.md`** para economizar tokens e consulte somente a fonte relacionada à tarefa.

| Necessidade | Fonte de verdade | Ação |
| --- | --- | --- |
| Memória rápida | `memoria/contexto-rapido.md`, `memoria/historico-ajustes.md` | Leia antes de abrir arquivos grandes; registre melhorias com `npm run memory:log -- --note "..."`. |
| Interface/site | `index.html`, `data/projects.json`, `data/certificates.json` | Preserve o layout; o site renderiza apenas itens curados/publicados. |
| Currículo | `curriculo/02-fonte/`, `curriculo/03-layout/`, `public/documents/curriculo-eduarda-reis.pdf` | Rode `npm run content:automate` quando a mudança vier de conteúdo. |
| Carreira | `data/career-profile.json`, `curriculo/04-revisao/painel-profissional.md` | Use `$data-analyst-career-advisor`; não invente fatos. |
| Curadoria/aplicação | `.agents/skills/portfolio-content-maintainer/SKILL.md`, `automation/README.md` | Registre decisões em `curation`; casos ambíguos ficam em revisão. |
| LinkedIn | `curriculo/07-linkedin/perfil-linkedin.md` | Use como fonte editorial; publique no navegador somente com confirmação. |

### Endereços oficiais

- Repositório principal deste projeto: [dudsstar16/data-ai-portfolio](https://github.com/dudsstar16/data-ai-portfolio).
- Checkout principal nesta máquina: `C:\Users\eduar\portfolio-duds`. Confirme a raiz e o `origin` antes de editar, inclusive ao usar worktrees.

- Site oficial: `https://dudsstar16.github.io/data-ai-portfolio/`. O endereço do ChatGPT Sites é legado.
- Repositório principal: `https://github.com/dudsstar16/data-ai-portfolio`; branch de publicação: `master`.
- Vitrine interativa de dashboards: `https://sites.google.com/view/portflioeduardareis/início` (somente link, não é destino de deploy)
- GitHub: `https://github.com/dudsstar16`

### Modelo, esforço e uso de contexto

Em cada objetivo novo, use a skill [controle-execucao-eficiente](.agents/skills/controle-execucao-eficiente/SKILL.md) e recomende o modelo e o esforço adequados. Antes de trocar qualquer um deles, explique a mudança e pause até Eduarda confirmar. A configuração aprovada cobre as ações do mesmo objetivo enquanto continuar adequada. Registre a entrega e sua validação na memória do projeto.

### Publicação automática

- O workflow `.github/workflows/deploy-portfolio-pages.yml` publica no GitHub Pages a cada push em `master`, após sucesso do workflow **Atualizar conteúdo profissional** em `master` ou por execução manual na branch.
- Antes de publicar, execute `npm run check` e `node scripts/build.mjs --pages`. O Pages recebe apenas o pacote estático gerado em `dist/pages-*`, com os catálogos curados e o PDF público. Confira a execução no GitHub Actions e abra o endereço oficial.

### Fluxo padrão de conteúdo

1. Novo certificado: colocar o PDF em `curriculo/06-certificados/`; a tarefa local ou o workflow executa a análise.
2. Novo projeto: publicar no GitHub; o workflow semanal descobre e pontua o repositório.
3. Alta confiança: catálogo, site e seleção do currículo podem ser atualizados automaticamente dentro dos limites.
4. Falta de evidência, substituição ou promoção: manter em revisão e explicar a próxima ação.
5. Antes de entregar: `npm run check` e `npm run build`.

Limites atuais: 8 certificados visíveis no site, 6 no currículo e 6 projetos principais. Nunca edite `dist/` diretamente.

## Project Structure & Module Organization

This repository is a static portfolio site. The main page is in [`index.html`](index.html), with styles, JavaScript, fonts and runtime assets under [`public/`](public/). Editable résumé material follows the staged flow in [`curriculo/`](curriculo/). Read [`docs/AI_HARNESS.md`](docs/AI_HARNESS.md) before broad content or automation changes. [`scripts/build.mjs`](scripts/build.mjs) packages the page and assets into the generated `dist/` directory for the hosted worker.

## Build, Test, and Development Commands

- `npm run check` — validates required sources, the public résumé, placeholders, and then generates the deployable output.
- `npm run build` — generates `dist/server/index.js` and copies hosting metadata into `dist/.openai/`.
- `npx serve .` — optionally serves the source locally for browser inspection (use any equivalent static-file server).

There is no configured test runner or linter. After changes, open the site locally and verify navigation, theme switching, résumé dialog/download, contact mailto behavior, responsive menu, and project links.

## Coding Style & Naming Conventions

Use two-space indentation for HTML, CSS, and JavaScript. Prefer semantic HTML, accessible labels and landmarks, and `kebab-case` for CSS classes and `data-*` attributes. Extend the existing theme tokens and responsive rules. Use descriptive, lowercase asset filenames with hyphens.

Keep project metadata synchronized between `data/projects.json` and its matching HTML card. Use the stable project ID instead of a list position or title when a script, agent, or URL needs to identify a project.

## Testing Guidelines

Testing is currently manual and browser-based, with a lightweight repository check. Check desktop and narrow/mobile layouts, keyboard focus, reduced-motion behavior, both color themes, and console errors. Run `npm run check` before committing.

## Commit & Pull Request Guidelines

Recent commits use short Conventional Commit-style subjects such as `fix(portfolio): organize project grid` and `feat(portfolio): add data horizon lab project`. Follow that pattern: use an imperative, focused subject and keep unrelated edits separate. Pull requests should explain the user-visible change, identify affected sections/assets, include screenshots or a short screen recording for visual changes, and state the validation performed (for example, `npm run build` plus responsive browser checks).

## Security & Configuration Tips

Do not commit secrets, private contact data beyond the intentionally public portfolio content, or unnecessary generated files. Keep `.openai/hosting.json` valid JSON and update build logic when adding assets that must be served by the generated worker. Do not invent résumé metrics or expose internal business information.

## Professional Career Advisor

For résumé, portfolio, certificate, project-selection, promotion, or Data Analyst career decisions, use `.agents/skills/data-analyst-career-advisor/SKILL.md`. For deterministic application, use `.agents/skills/portfolio-content-maintainer/SKILL.md`. Treat `data/career-profile.json` as structured career context and `curriculo/04-revisao/painel-profissional.md` as generated decision support. High-confidence content may be published automatically within the documented limits; ambiguous content, replacements, promotion claims, and LinkedIn publication require human confirmation.
