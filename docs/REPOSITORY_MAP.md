# Mapa do Repositório

## Como o site funciona

`index.html` é a fonte única da interface pública. Ele referencia o retrato e o currículo em `public/`. O build lê esses arquivos e gera um worker autocontido em `dist/server/index.js`, pronto para a hospedagem configurada em `.openai/hosting.json`.

```text
index.html + public/ + .openai/hosting.json
                  │
                  ▼
          scripts/build.mjs
                  │
                  ▼
                dist/
```

## Responsabilidade por pasta

| Pasta | Pode editar? | Observação |
| --- | --- | --- |
| `public/` | Sim | Apenas arquivos que o visitante deve baixar ou visualizar. Preserve `curriculo-eduarda-reis.pdf` como caminho público estável. |
| `data/` | Sim | Catálogos estruturados de conteúdo. IDs devem ser estáveis e únicos. |
| `curriculo/` | Sim | Fluxo do currículo por etapas; não é servido pelo site. |
| `assets/` | Sim, com cuidado | Materiais brutos ou de trabalho. Só mova algo para `public/` se ele precisar ser publicado. |
| `scripts/` | Sim | Automação de build e validação. Mantenha scripts pequenos e sem efeitos externos. |
| `docs/` | Sim | Contexto operacional para manutenção humana e por IA. |
| `dist/` e `tmp/` | Não manualmente | Saídas geradas e temporárias. |

## Fontes de verdade

- Conteúdo público: `index.html`.
- Catálogo estruturado de projetos: `data/projects.json`.
- Currículo publicado: `public/documents/curriculo-eduarda-reis.pdf`.
- Texto editável do currículo: `curriculo/02-fonte/curriculo-analista-de-dados.md` e `curriculo/03-layout/curriculo-analista-de-dados.html`.
- Regras de trabalho: `AGENTS.md` e `docs/AI_HARNESS.md`.
