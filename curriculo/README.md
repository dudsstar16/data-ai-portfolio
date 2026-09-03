# Currículo — Fluxo de Produção

Esta pasta organiza a produção do currículo para candidaturas a **Analista de Dados**. Ela não substitui o PDF publicado em `public/documents/`; atualize e valide cada etapa antes de gerar uma nova versão visual.

## Arquivos

- `01-evidencias/`: métricas confirmadas e fontes de evidência.
- `02-fonte/`: conteúdo editável do currículo.
- `03-layout/`: página HTML usada para gerar o PDF público.
- `04-revisao/`: critérios editoriais e explicações de termos.
- `05-raw_arquivo/`: versão anterior preservada para consulta.
- `06-certificados/`: certificados profissionais.

O painel `04-revisao/painel-profissional.md` é gerado por `npm run career:review` e ajuda a priorizar projetos e certificados sem alterar o currículo ou o site.
O arquivo `04-revisao/diagnostico-curricular.md` registra a análise humana atual e o plano para a transição de cargo.

## Como usar

1. Atualize o inventário quando novos resultados, dashboards ou automações forem concluídos.
2. Altere primeiro o currículo mestre e depois replique a mudança no HTML; gere novamente `public/documents/curriculo-eduarda-reis.pdf` após a revisão visual.
3. Para uma vaga específica, mantenha o resumo, as experiências mais aderentes e até três ou quatro projetos; priorize os termos da descrição sem copiar palavras-chave fora de contexto.
4. Use somente números verificáveis. Quando não houver uma métrica confiável, descreva o impacto qualitativo em vez de estimar um resultado.

## Regra de escrita

Use a estrutura **ação + contexto/escala + resultado**. Exemplo: “Desenvolvi [X] dashboards em Power BI, consolidando dados de [X] fontes para acompanhar [X] indicadores e apoiar decisões de [X] áreas.”

Mantenha bullets curtos, comece com verbo de ação e priorize o problema resolvido. Não inclua dados internos, nomes de clientes, valores financeiros ou informações confidenciais.
