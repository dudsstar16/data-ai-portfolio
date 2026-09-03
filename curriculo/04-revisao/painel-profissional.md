# Painel Profissional — Analista de Dados

Relatório determinístico para apoiar decisões humanas. Ele usa somente os metadados versionados em `data/career-profile.json`, `data/projects.json` e `data/certificates.json`; não avalia sozinho a qualidade interna de um PDF ou repositório.

## Direção atual

| Campo | Valor |
| --- | --- |
| Cargo-alvo | Analista de Dados Júnior |
| Posicionamento | Analista de Dados \| Business Intelligence \| Automação e IA Aplicada |
| Transição | Analista de Dados Júnior, prevista para 2026-09-10 |
| Estado da transição | planned — confirmação humana obrigatória |

> Atualizar currículo e site somente após o início ser confirmado por Eduarda.

## Visão rápida

| Conteúdo | Publicados | Em revisão | Limite recomendado |
| --- | ---: | ---: | ---: |
| Projetos | 6 | 7 | 6 no portfólio principal |
| Certificados | 12 | 51 | 8 no site / 6 no currículo |

Há **46 certificado(s)** sem instituição ou data confirmada. Eles não devem ser publicados até a conferência do PDF.

Na fila de revisão, **4** têm alta aderência pelos metadados, **23** são contextuais e **24** são complementares ou ainda não têm sinal suficiente no título.

## Próximas credenciais

| Prioridade | Credencial | Decisão profissional |
| --- | --- | --- |
| next | [Microsoft Certified: Power BI Data Analyst Associate (PL-300)](https://learn.microsoft.com/pt-br/credentials/certifications/data-analyst-associate/) | É a credencial mais alinhada ao uso profissional já demonstrado de Power BI, DAX, modelagem e análise. |
| optional | [Google Data Analytics Certificate](https://grow.google/certificates/data-analytics/) | Pode estruturar fundamentos e gerar um estudo de caso, mas parte do conteúdo se sobrepõe à experiência e à formação atuais. |

Faça uma credencial principal por vez. Para esta trajetória, projeto aplicado e resultado profissional têm prioridade sobre acumular cursos introdutórios.

## Cobertura a fortalecer

- Os pilares definidos já aparecem em ao menos um projeto publicado; a próxima melhoria é aprofundar evidências, não aumentar volume.

## Projetos

Pontuação é uma heurística transparente de aderência aos pilares; não representa qualidade absoluta.

| ID estável | Status | Aderência | Pilares identificados | Decisão sugerida |
| --- | --- | ---: | --- | --- |
| `banco-em-escuta` | published | 11 | Power BI e visualização, Análise e estatística, Negócio e comunicação | manter em destaque |
| `dados-ia-decisoes-humanas` | published | 11 | Power BI e visualização, ETL e qualidade de dados, IA aplicada | manter em destaque |
| `power-bi-dashboard-portfolio` | published | 9 | Power BI e visualização, ETL e qualidade de dados | manter em destaque |
| `horizon-2012-data-lab` | published | 9 | Power BI e visualização, Python e automação | manter em destaque |
| `pokemon-tcg-data-modeling` | published | 5 | SQL e modelagem de dados | manter em destaque |
| `report-automation` | published | 4 | Python e automação | manter em destaque |
| `miniguia-python-notebooklm` | review | 7 | Python e automação, Análise e estatística | desenvolver evidência antes de publicar |
| `dio-customer-feedback-insights` | review | 6 | Análise e estatística, Negócio e comunicação | desenvolver evidência antes de publicar |
| `ciencia-de-dados-iesb` | review | 5 | Análise e estatística, IA aplicada | desenvolver evidência antes de publicar |
| `estudos-de-python` | review | 4 | Python e automação | manter fora do portfólio principal |
| `ifb-estudos` | review | 4 | Python e automação | manter fora do portfólio principal |
| `data-ai-portfolio` | review | 0 | Sem aderência identificada pelo catálogo | manter fora do portfólio principal |
| `programacao-em-c-fundamentos` | review | 0 | Sem aderência identificada pelo catálogo | manter fora do portfólio principal |

## Certificados

A tabela mostra a seleção sugerida, os publicados que perderam prioridade e os candidatos mais aderentes da fila. O catálogo completo continua em `data/certificates.json`.

| ID estável | Status | Aderência | Pilares identificados | Decisão sugerida |
| --- | --- | ---: | --- | --- |
| `consultas-sql-com-copilot` | published | 7 | SQL e modelagem de dados, IA aplicada | selecionar |
| `insights-feedback-clientes-bancarios` | published | 6 | Análise e estatística, Negócio e comunicação | selecionar |
| `calculos-com-dax` | published | 5 | Power BI e visualização | selecionar |
| `visualizacao-e-analise-no-power-bi` | published | 5 | Power BI e visualização | selecionar |
| `banco-de-dados-relacionais` | published | 5 | SQL e modelagem de dados | selecionar |
| `primeiro-dashboard-power-bi` | published | 5 | Power BI e visualização | selecionar |
| `etl-no-power-query` | published | 4 | ETL e qualidade de dados | selecionar |
| `processo-de-etl-com-excel-e-power-query` | published | 4 | ETL e qualidade de dados | selecionar |
| `arquivos-e-dados-externos-em-python` | published | 4 | Python e automação | reduzir redundância no site |
| `fundamentos-de-ia` | published | 2 | IA aplicada | reduzir redundância no site |
| `fundamentos-de-llm` | published | 2 | IA aplicada | reduzir redundância no site |
| `introducao-a-engenharia-de-prompts` | published | 2 | IA aplicada | reduzir redundância no site |
| `introducao-a-analise-de-dados-power-bi` | review | 8 | Power BI e visualização, Análise e estatística | prioridade: validar PDF e metadados |
| `imersao-em-inteligencia-artificial-e-edados-com-claude-code-e-excel` | review | 6 | ETL e qualidade de dados, IA aplicada | avaliar após confirmação editorial |
| `administrando-banco-de-dados` | review | 5 | SQL e modelagem de dados | prioridade: validar PDF e metadados |
| `fundamentos-de-business-intelligence-bi` | review | 5 | Power BI e visualização | avaliar após confirmação editorial |

## Como usar

1. Adicione PDFs em `curriculo/06-certificados/` ou mantenha os projetos públicos no GitHub.
2. Rode `npm run content:sync` para descobrir itens e reconstruir este painel.
3. Revise título, instituição, data, descrição, evidência e confidencialidade.
4. Só então altere `status` para `published` e defina `displayOrder`.

O script nunca publica conteúdo, nunca altera o currículo e nunca decide sozinho em nome de Eduarda.
