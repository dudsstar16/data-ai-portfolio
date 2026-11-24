# Pasta de Memória Local (`memoria/`)

Esta pasta guarda o resumo operacional, o fluxo de comandos e o histórico de evolução do portfólio em **frases curtas e simples**.

## Objetivos

1. **Reduzir gasto de tokens:** O agente lê `memoria/contexto-rapido.md` em vez de varrer `index.html` (63 KB) e `data/certificates.json` (1.365 linhas) a cada ajuste.
2. **Guia rápido de comandos:** Tabela direta com o comando exato para cada ação (sincronizar GitHub, filtrar certificados de IA/Dados, atualizar currículo PDF e validar o site).
3. **Acompanhamento documental:** Cada modificação ou melhoria fica registrada em `memoria/historico-ajustes.md` com frases diretas sobre o que foi feito e melhorado.

## Arquivos

- [`contexto-rapido.md`](./contexto-rapido.md): Fotografia atualizada automaticamente com fluxo de comandos, estado do site, currículo, projetos do GitHub (publicados e fila de revisão) e certificados de IA/Dados.
- [`historico-ajustes.md`](./historico-ajustes.md): Linha do tempo resumida de alterações, melhorias e estado da árvore local.

## Automação Configurada

1. **Comando Mestre (`npm run content:automate`):** Busca repositórios novos no GitHub, lê PDFs novos em `curriculo/06-certificados/`, pontua e filtra os destaques de IA e Dados, atualiza o painel profissional, sincroniza o currículo (Markdown, HTML e PDF) e atualiza a memória.
2. **Hook automático do Agente (`.agents/hooks.json`):** Ao editar arquivos (`edit_file` / `write_file`), a memória é atualizada automaticamente em segundo plano.
3. **Validação e Build (`npm run check`):** Verifica e sincroniza a memória junto com os demais checks de qualidade do projeto.
4. **Registro manual de nota curta:**
   ```bash
   npm run memory:log -- --note "Resumo curto do que foi feito e melhorado"
   ```
