# Fluxo de Atualização do Currículo

## Ordem correta

1. Para certificados elegíveis, rode `npm run content:automate`; ele sincroniza a seleção curada entre a fonte, o layout e o PDF.
2. Para fatos e métricas profissionais, atualize primeiro `curriculo/02-fonte/curriculo-analista-de-dados.md` com informações confirmadas.
3. Ajuste `curriculo/03-layout/curriculo-analista-de-dados.html` para a versão visual de duas páginas A4.
4. Exporte o HTML para `public/documents/curriculo-eduarda-reis.pdf`.
4. Rode `npm run check` para incluir o PDF novo no build.

## Checklist editorial

- Cada bullet responde: o que foi feito, em qual escala e qual resultado foi gerado.
- Métricas têm contexto e podem ser explicadas em entrevista.
- Resultados confidenciais são agregados ou removidos.
- Termos como guardrails, fallback e troubleshooting aparecem ligados a uma prática real.
- O título profissional permanece amplo e pesquisável: **Analista de Dados | Business Intelligence | Automação e IA Aplicada**.

## Arquivos numerados

As pastas numeradas indicam a etapa do fluxo. Os marcadores `certificates:start` e `certificates:end` pertencem à automação e não devem ser removidos.
