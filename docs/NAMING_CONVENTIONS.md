# Identificadores e Nomenclaturas

## IDs de conteúdo

O site não possui tabelas de banco de dados. Para evitar IDs artificiais, os registros de conteúdo recebem identificadores estáveis:

- Projetos: `data/projects.json` usa `id` em `kebab-case` (exemplo: `horizon-2012-data-lab`).
- Interface: cada cartão correspondente usa o mesmo valor em `data-project-id` e um `id` HTML com o prefixo `project-`.
- Se o projeto ganhar banco de dados, cada tabela deve ter chave primária `id`; nunca use título, e-mail ou posição na lista como chave.

Não mude um ID depois que ele estiver publicado. Para corrigir um título ou descrição, altere os outros campos e preserve o identificador.

## Convenções

| Elemento | Padrão | Exemplo |
| --- | --- | --- |
| Arquivos e pastas novos | `kebab-case` | `project-catalog.json` |
| IDs, atributos `data-*` e classes CSS | `kebab-case` | `data-project-id` |
| Variáveis JavaScript | `camelCase` | `projectCatalog` |
| Documentos | título em português claro | `AI_HARNESS.md` é exceção por ser contrato técnico |
| Arquivos numerados | somente versão ou arquivo histórico | `001_inventario-de-metricas.md` |

Os nomes existentes permanecem estáveis para não quebrar links. Ao criar algo novo, siga a convenção acima; não renomeie arquivos de conteúdo ou mídia apenas por estética.

## Catálogo de projetos

`data/projects.json` é o índice estruturado para pessoas e agentes de IA. Ao adicionar ou remover um projeto, atualize o catálogo e o cartão em `index.html` na mesma mudança. `npm run check` confirma IDs únicos, o formato dos IDs e a presença dos links publicados.
