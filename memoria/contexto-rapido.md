# Memória Rápida do Repositório (Economia de Tokens)

Leia este arquivo primeiro. Ele resume o estado atual do projeto em frases curtas para evitar releituras completas de `index.html` e dos catálogos `data/*.json`.

## Site oficial e publicação

- GitHub Pages: `https://dudsstar16.github.io/data-ai-portfolio/`. O endereço do ChatGPT Sites é legado.
- Fonte: `dudsstar16/data-ai-portfolio`, branch `master`. O workflow `deploy-portfolio-pages.yml` publica após push em `master`, após o sucesso de **Atualizar conteúdo profissional** nessa branch ou por execução manual.
- Valide com `npm run check` e `node scripts/build.mjs --pages`. Confira o deploy no GitHub Actions e teste a página, os catálogos e o PDF no endereço oficial.

## 1. Identidade e Posicionamento

- **Profissional:** Eduarda Reis — Analista de Dados I (Insi / atuação na CNP Seguros Holding, desde 2026-09-10).
- **Alvo e foco:** Analista de Dados Júnior | Analista de Dados | Power BI, SQL e Python | Automação e Agentes de IA.
- **Métricas-chave no site:** 27M+ linhas no BRB; 12 dashboards em Power BI; relatórios de 1–2h para <5min; 3 anos em Londres (inglês fluente).

## 2. Fluxo Geral de Comandos por Ação (Guia Rápido)

| Ação desejada | Comando único para aplicar | O que ele faz automaticamente |
| --- | --- | --- |
| **Sincronizar TUDO (GitHub + Certificados + Site + Currículo PDF + Memória)** | `npm run content:automate` | Busca repositórios novos no GitHub, lê PDFs novos em `curriculo/06-certificados/`, pontua por IA/Dados, atualiza o painel, sincroniza o Top 8 no site e Top 6 no currículo, gera o PDF e atualiza a memória. |
| **Apenas buscar novos repositórios no GitHub** | `npm run sync:github` | Consulta a API do GitHub (`dudsstar16`), verifica evidências do README (problema, dados, método, validação, resultado, execução) e adiciona/atualiza em `data/projects.json`. |
| **Apenas ler novos certificados PDF salvos na pasta** | `npm run sync:certificates` | Extrai instituição, data e carga horária dos PDFs em `curriculo/06-certificados/` e registra em `data/certificates.json`. |
| **Filtrar e classificar destaques de IA & Dados** | `npm run curate:content` | Avalia pontuação nos 7 pilares de IA/Dados, aprova certificados elegíveis (score >= 5 e >= 4h), ordena por relevância e seleciona os visíveis no site. |
| **Atualizar painel de carreira e correlação** | `npm run career:review` | Recalcula a correlação entre projetos, certificados e pilares profissionais em `curriculo/04-revisao/painel-profissional.md`. |
| **Atualizar currículo (Markdown + HTML + PDF 2 páginas)** | `npm run resume:sync && npm run resume:render` | Injeta o Top 6 de certificados de IA/Dados no currículo e exporta `public/documents/curriculo-eduarda-reis.pdf`. |
| **Registrar nota curta na memória local** | `npm run memory:log -- --note "Resumo curto"` | Registra no histórico documental (`memoria/historico-ajustes.md`) o que foi feito e melhorado. |
| **Validar qualidade e gerar pacote final do site** | `npm run check` | Verifica integridade de todos os arquivos, painel, currículo, memória e gera o worker em `dist/`. |

## 3. Mapa Cirúrgico de Arquivos (Onde Editar)

- `AGENTS.md`: repositório principal e skill de controle de execução. Pause antes de trocar modelo ou esforço.
- `index.html`: estrutura do site; estilos e scripts editoriais ficam em `public/styles/` e `public/scripts/`.
- `data/projects.json`: 9 publicados (limite: 9) e 10 em revisão.
- `data/certificates.json`: 16 publicados (8 visíveis no site, limite: 8) e 53 em revisão.
- `curriculo/02-fonte/curriculo-analista-de-dados.md`: Texto-fonte do currículo (sincronizado com layout HTML e PDF de 2 páginas).
- `curriculo/04-revisao/painel-profissional.md`: Painel determinístico gerado por `npm run career:review`.
- `dist/`: Saída gerada por `npm run build`. Nunca editar diretamente.

## 4. Projetos Publicados Atualmente (9/9)

- `report-automation` (#1, score 4): Relatórios de Faturamento com Python [Automação]
- `power-bi-dashboard-portfolio` (#2, score 9): Portfólio de Dashboards em Power BI [Business Intelligence]
- `pokemon-tcg-data-modeling` (#3, score 5): Pokémon TCG Database Modeling [Banco de dados]
- `banco-em-escuta` (#4, score 11): Banco em Escuta [Customer Analytics]
- `dados-ia-decisoes-humanas` (#5, score 11): Dados + IA: inteligência que impulsiona decisões humanas [Dados & IA]
- `horizon-2012-data-lab` (#6, score 9): Horizon 2012 — Laboratório de Dados [Engenharia de dados]
- `desafio-primora` (#7, score 8): Desafio Primora — ETL, Qualidade de Dados e API [Engenharia de dados]
- `syntonia-spotify-agent` (#8, score 9): SyntonIA — Agente de Recomendação Musical (Spotify) [Dados & IA]
- `bsbora-ai-planner` (#9, score 11): BSBora — Planejador com Multiagentes de IA e Busca Vetorial [Dados & IA]

## 5. Repositórios do GitHub na Fila de Revisão (Mais Aderentes a IA & Dados)

- `miniguia-python-notebooklm` (score 7, README ok: não): miniguia-python-notebooklm
- `dio-customer-feedback-insights` (score 6, README ok: não): dio-customer-feedback-insights
- `ciencia-de-dados-iesb` (score 5, README ok: não): ciencia-de-dados-iesb
- `porsche-hygiene-pipeline` (score 5, README ok: não): porsche-hygiene-pipeline
- `estudos-de-python` (score 4, README ok: não): Estudos-de-Python
- `ifb-estudos` (score 4, README ok: não): IFB-Estudos

## 6. Certificados Visíveis no Site (8/8)

- `introducao-a-analise-de-dados-power-bi` (#1, score 8): Introdução à Análise de Dados - Microsoft Power BI (Fundação Bradesco, 16/01/2026)
- `consultas-sql-com-copilot` (#2, score 7): Consultas SQL com Microsoft Copilot (DIO, 31/07/2026)
- `ai-reports-com-ecel-gpt-agents-e-claude` (#3, score 6): AI Reports com Excel, GPT Agents e Claude (DIO, 06/09/2026)
- `insights-feedback-clientes-bancarios` (#4, score 6): Insights do feedback de clientes bancários (DIO, 04/08/2026)
- `curso-iniciante-de-bi` (#5, score 5): Formação Power BI (Alura, 28/11/2025)
- `administrando-banco-de-dados` (#6, score 5): Administrando Banco de Dados (Fundação Bradesco, 08/01/2026)
- `calculos-com-dax` (#7, score 5): Cálculos com DAX (Alura, 14/09/2025)
- `visualizacao-e-analise-no-power-bi` (#8, score 5): Visualização e análise no Power BI (Alura, 28/11/2025)

## 7. Certificados no Currículo (6/6)

- Introdução à Análise de Dados - Microsoft Power BI · Consultas SQL com Microsoft Copilot · AI Reports com Excel, GPT Agents e Claude · Insights do feedback de clientes bancários · Formação Power BI · Administrando Banco de Dados

## 8. Como Manter Site e Currículo Sempre Atualizados Automaticamente

1. **Na nuvem (GitHub Actions — já ativo):** O workflow `.github/workflows/sync-portfolio-content.yml` roda toda **segunda-feira às 12:30 UTC**, além de rodar automaticamente sempre que um PDF novo é enviado para `curriculo/06-certificados/`. Ele executa `npm run content:automate` e faz o commit das atualizações no repositório.
2. **No computador local (Tarefa agendada do Windows):** Execute uma vez no PowerShell `powershell -ExecutionPolicy Bypass -File .\automation\install-certificate-task.ps1`. Ele monitora a pasta `curriculo/06-certificados/` a cada 30 minutos e no login.
3. **Manualmente a qualquer momento:** Rode `npm run content:automate && npm run check`.
