# Harness de IA e Qualidade

Este documento é o **harness** do repositório: o conjunto de contexto, limites, instruções e verificações que permite a uma pessoa ou agente de IA fazer mudanças seguras e repetíveis.

## Objetivo

Manter um portfólio profissional claro, acessível e verdadeiro. Toda mudança deve melhorar a comunicação do trabalho de Eduarda sem inventar resultados, expor dados confidenciais ou quebrar o currículo publicado.

## Contexto mínimo antes de editar

1. Leia `memoria/contexto-rapido.md` e `memoria/historico-ajustes.md` primeiro para obter o resumo atualizado do repositório sem gastar tokens relendo arquivos extensos.
2. Leia `README.md`, `AGENTS.md` e o documento desta pasta relacionado à tarefa apenas quando precisar de detalhes específicos.
3. Identifique a fonte de verdade: `index.html` para o site; `curriculo/` para o currículo.
4. Use `data/projects.json` para identificar projetos por ID, tecnologia, categoria e link.
5. Para decisões profissionais, leia `data/career-profile.json`, use a skill `.agents/skills/data-analyst-career-advisor/` e confira `curriculo/04-revisao/painel-profissional.md`.
6. Preserve arquivos que já estejam modificados ou não rastreados, a menos que a tarefa peça explicitamente para alterá-los.
7. A cada ajuste concluído, garanta que a melhoria esteja registrada em `memoria/historico-ajustes.md` em frase curta e simples (o hook `.agents/hooks.json` atualiza automaticamente após edições, e `npm run memory:log -- --note "..."` registra notas descritivas).
8. Siga a regra de modelo e esforço do `AGENTS.md` antes de trocar a configuração da execução.

## Contrato de conteúdo

- Use português claro e linguagem profissional, evitando jargão sem contexto.
- Descreva resultados com ação + contexto + evidência. Não crie métricas, clientes, percentuais ou impactos.
- Para IA aplicada, prefira práticas demonstráveis: prompts estruturados, validação de saída, guardrails, fallback, testes e troubleshooting.
- “Harness engineering” deve aparecer como prática operacional: contexto versionado, instruções explícitas, dados de entrada definidos, avaliações e quality gates.
- IDs e nomenclaturas devem seguir `docs/NAMING_CONVENTIONS.md`; nunca deduza a identidade de um projeto pela posição visual do cartão.

## Quality gates

Antes de entregar uma mudança:

1. Rode `npm run check`.
2. Quando projetos, certificados ou o perfil de carreira mudarem, rode `npm run career:review` antes da verificação final.
3. Para alterações visuais, abra o site e valide layout desktop e mobile, foco de teclado, tema, links e currículo.
4. Para alterações no currículo, confirme que o PDF público existe, tem uma página quando esse for o objetivo e não contém placeholders.
5. Explique o que mudou, como foi validado e qualquer limite conhecido.

## Limites

- Não editar `dist/` diretamente.
- Não enviar dados, fazer requisições externas ou publicar sem solicitação explícita.
- Não alterar arquivos de mídia ou backups por “limpeza” sem confirmar referências e intenção.
