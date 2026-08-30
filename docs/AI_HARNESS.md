# Harness de IA e Qualidade

Este documento é o **harness** do repositório: o conjunto de contexto, limites, instruções e verificações que permite a uma pessoa ou agente de IA fazer mudanças seguras e repetíveis.

## Objetivo

Manter um portfólio profissional claro, acessível e verdadeiro. Toda mudança deve melhorar a comunicação do trabalho de Eduarda sem inventar resultados, expor dados confidenciais ou quebrar o currículo publicado.

## Contexto mínimo antes de editar

1. Leia `README.md`, `AGENTS.md` e o documento desta pasta relacionado à tarefa.
2. Identifique a fonte de verdade: `index.html` para o site; `curriculo/` para o currículo.
3. Use `data/projects.json` para identificar projetos por ID, tecnologia, categoria e link.
4. Preserve arquivos que já estejam modificados ou não rastreados, a menos que a tarefa peça explicitamente para alterá-los.

## Contrato de conteúdo

- Use português claro e linguagem profissional, evitando jargão sem contexto.
- Descreva resultados com ação + contexto + evidência. Não crie métricas, clientes, percentuais ou impactos.
- Para IA aplicada, prefira práticas demonstráveis: prompts estruturados, validação de saída, guardrails, fallback, testes e troubleshooting.
- “Harness engineering” deve aparecer como prática operacional: contexto versionado, instruções explícitas, dados de entrada definidos, avaliações e quality gates.
- IDs e nomenclaturas devem seguir `docs/NAMING_CONVENTIONS.md`; nunca deduza a identidade de um projeto pela posição visual do cartão.

## Quality gates

Antes de entregar uma mudança:

1. Rode `npm run check`.
2. Para alterações visuais, abra o site e valide layout desktop e mobile, foco de teclado, tema, links e currículo.
3. Para alterações no currículo, confirme que o PDF público existe, tem uma página quando esse for o objetivo e não contém placeholders.
4. Explique o que mudou, como foi validado e qualquer limite conhecido.

## Limites

- Não editar `dist/` diretamente.
- Não enviar dados, fazer requisições externas ou publicar sem solicitação explícita.
- Não alterar arquivos de mídia ou backups por “limpeza” sem confirmar referências e intenção.
