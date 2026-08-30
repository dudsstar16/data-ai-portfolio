# Portfólio Eduarda Reis — Data & AI

Site estático do portfólio profissional de Eduarda Reis. A página reúne experiências em dados, projetos, currículo e formas de contato.

## Começar

```bash
npm run check
```

O comando valida os arquivos essenciais e gera a versão de publicação em `dist/`. Para abrir localmente, use um servidor de arquivos estáticos, por exemplo `npx serve .`.

## Mapa rápido

| Local | Finalidade |
| --- | --- |
| `index.html` | Fonte da página: estrutura, estilos e interações. |
| `public/` | Arquivos servidos ao visitante, como currículo e retrato. |
| `data/` | Catálogos estruturados de conteúdo, usados como referência humana e por IA. |
| `curriculo/` | Fluxo do currículo por etapa: evidências, fonte, layout, revisão e arquivo. |
| `scripts/` | Build e verificações reproduzíveis. |
| `docs/` | Contexto do projeto e instruções para pessoas e agentes de IA. |
| `dist/` | Artefato gerado para hospedagem; não editar manualmente. |

## Atualizar conteúdo

1. Edite o texto do portfólio em `index.html`.
2. Para o currículo, siga as etapas documentadas em `curriculo/README.md`, depois gere o PDF público em `public/documents/`.
3. Rode `npm run check` antes de publicar.

Métricas profissionais devem ser verificáveis. Não exponha dados internos, nomes de clientes, valores financeiros ou outros dados confidenciais.

## Documentação

- [Mapa do repositório](docs/REPOSITORY_MAP.md)
- [Harness de IA e qualidade](docs/AI_HARNESS.md)
- [IDs e nomenclaturas](docs/NAMING_CONVENTIONS.md)
- [Fluxo do currículo](docs/CURRICULO_WORKFLOW.md)
