# CLAUDE.md — Contexto do Portfólio de Eduarda Reis

Este arquivo é a memória operacional principal para o Claude Code ao trabalhar neste repositório. Ele formaliza o contexto profissional de Eduarda Reis, o propósito do projeto, as fontes de verdade, os fluxos de manutenção e os limites de segurança.

Leia este documento antes de propor ou executar mudanças. Para detalhes operacionais, leia também `AGENTS.md` e apenas os documentos relacionados à tarefa atual.

## 1. Como conversar com Eduarda

- Responda em português do Brasil, com linguagem simples, amigável e profissional.
- Comece pelo resultado ou pela recomendação mais importante.
- Explique termos técnicos quando forem necessários, sem presumir conhecimento prévio.
- Faça perguntas curtas apenas quando a resposta puder mudar materialmente o resultado.
- Diferencie claramente: fato confirmado, informação planejada, hipótese e sugestão.
- Não trate sugestões de carreira como decisões tomadas. Eduarda decide o que será publicado.
- Quando houver mudança em arquivos, informe de forma objetiva o que foi alterado, como foi validado e quais limites permanecem.

## 2. Quem é Eduarda Reis

### Identidade profissional

- Nome: **Eduarda Reis**.
- Pronomes: **ela/dela**.
- Localização: **Brasília, Distrito Federal, Brasil**.
- Posicionamento principal: **Analista de Dados | Power BI, SQL e Python | Automação e Agentes de IA**.
- Nível de carreira: **Analista de Dados Júnior**.
- Cargo atual confirmado: **Analista de Dados I — Insi**, desde **10/09/2026**, com atuação terceirizada na mesma equipe da **CNP Seguros Holding**, na área de Dados e Relacionamento com o Cliente.
- Idiomas: português nativo e inglês fluente, com três anos de vivência em Londres.
- Formação concluída: Tecnologia em Análise e Desenvolvimento de Sistemas, Universidade Católica de Brasília, 08/2022 a 12/2024.
- Formação complementar: Residência em Inteligência Artificial na Universidade de Brasília, iniciada em 17/08/2026; Formação Back-End em Python no IFB/Bolsa Futuro Digital, em andamento desde 13/05/2026 (aulas teóricas até a primeira semana de dezembro de 2026, seguidas de cerca de 6 meses de residência em empresas; término previsto 06/2027).

### Proposta de valor

Eduarda transforma dores, bases e processos em decisões e soluções confiáveis. Sua atuação conecta:

1. descoberta do problema e entendimento do contexto de negócio;
2. preparação, consolidação, validação e qualidade dos dados;
3. construção de indicadores, dashboards e análises;
4. automação de rotinas com Python;
5. desenho, construção, testes e validação de agentes de IA;
6. comunicação clara de insights para públicos técnicos e não técnicos.

### Pilares de competência

1. **Business Intelligence:** Power BI, DAX, Power Query, KPIs e visualização.
2. **SQL e modelagem:** consultas, PostgreSQL, modelagem relacional, views e normalização.
3. **ETL e qualidade de dados:** tratamento, consolidação, validação e reprodutibilidade.
4. **Python e automação:** Python, Power Automate, Pandas, OpenPyXL e PyAutoGUI.
5. **Analytics e negócio:** análise exploratória, NPS, CES, CSAT, atendimento e experiência do cliente.
6. **IA aplicada:** LLMs, APIs, engenharia de prompts, agentes conversacionais e de desenvolvimento, Microsoft Copilot Studio, saídas estruturadas, guardrails, fallback, testes, troubleshooting e revisão humana.

### Evidências profissionais já publicadas

Estas informações aparecem no currículo e/ou portfólio atual. Não aumente, combine ou extrapole os números sem nova evidência:

- 12 dashboards em Power BI desenvolvidos e mantidos no contexto da CNP Seguros Holding.
- Consolidação de dados de 2 fontes e validação de 3 bases das Centrais de Atendimento.
- Análise diária de NPS e CES para monitoramentos e apresentações gerenciais.
- Mais de 10 relatórios recorrentes automatizados em Python.
- Redução de processamento de relatórios de 1–2 horas para menos de 5 minutos.
- Mais de 10 bases operacionais e mais de 27 milhões de linhas analisadas no BRB.
- Integração de 4 fontes em mais de 10 análises exploratórias e contribuição em 3 indicadores/relatórios no BRB.
- Coordenação de 3 projetos colaborativos com equipe de até 4 pessoas na DatAí.
- Atuação sobre 6 desafios de negócio e 3 iniciativas multidisciplinares na DatAí.

Para usar uma métrica em texto novo, confira `curriculo/01-evidencias/inventario-de-metricas.md` e a fonte editável do currículo. Quando houver conflito, não escolha silenciosamente: sinalize a divergência.

## 3. Objetivo do projeto

Este repositório mantém o ecossistema profissional de Eduarda, não apenas uma página HTML. Ele reúne:

- portfólio público responsivo de uma página;
- currículo em Markdown, HTML e PDF;
- catálogo estruturado de projetos;
- catálogo e PDFs de certificados;
- narrativa editorial para LinkedIn;
- evidências e métricas profissionais;
- automações de descoberta, curadoria, sincronização, revisão e build;
- documentação de governança para pessoas e agentes de IA.

O objetivo é apresentar Eduarda a recrutadores e equipes de Dados, BI, Analytics, Automação e IA aplicada com uma narrativa clara, verdadeira, verificável e visualmente consistente.

## 4. Endereços oficiais

- Portfólio principal: `https://eduarda-reis-data-ai.eduardareis1616.chatgpt.site/`
- GitHub: `https://github.com/dudsstar16`
- LinkedIn: `https://www.linkedin.com/in/eduarda-reis-95b95624a/`
- Vitrine de dashboards Power BI: `https://sites.google.com/view/portflioeduardareis/início`

A vitrine do Google Sites serve somente para exibir dashboards. Ela não é o destino principal de publicação deste repositório.

Dados públicos de contato já estão em `index.html`. Não replique telefone ou e-mail em novos documentos sem necessidade e nunca acrescente dados privados.

## 5. Arquitetura do repositório

### Interface pública

- `index.html`: fonte única da página, incluindo HTML, CSS e JavaScript.
- `public/images/`: imagens servidas ao visitante.
- `public/documents/curriculo-eduarda-reis.pdf`: currículo público, com caminho estável.
- `data/projects.json`: catálogo de projetos carregado pela página.
- `data/certificates.json`: catálogo de certificados carregado pela página.
- `dist/`: saída gerada para hospedagem; nunca editar manualmente.

### Currículo e carreira

- `curriculo/01-evidencias/`: métricas e evidências defensáveis.
- `curriculo/02-fonte/curriculo-analista-de-dados.md`: texto mestre do currículo.
- `curriculo/03-layout/curriculo-analista-de-dados.html`: layout do currículo.
- `curriculo/04-revisao/`: diagnóstico, notas e painel profissional gerado.
- `curriculo/05-raw_arquivo/`: arquivos históricos de referência.
- `curriculo/06-certificados/`: PDFs de certificados usados pela automação.
- `curriculo/07-linkedin/perfil-linkedin.md`: fonte editorial para o LinkedIn.
- `data/career-profile.json`: cargo-alvo, posicionamento, transição, limites e pilares.

### Operação e governança

- `AGENTS.md`: instruções rápidas e regras do repositório.
- `docs/AI_HARNESS.md`: contrato de qualidade e segurança para agentes.
- `docs/CAREER_GOVERNANCE.md`: governança de carreira e curadoria.
- `docs/CURRICULO_WORKFLOW.md`: fluxo correto do currículo.
- `docs/NAMING_CONVENTIONS.md`: IDs e nomenclaturas.
- `docs/REPOSITORY_MAP.md`: mapa das responsabilidades de cada pasta.
- `.agents/skills/data-analyst-career-advisor/`: consultoria profissional baseada em evidências.
- `.agents/skills/portfolio-content-maintainer/`: manutenção determinística dos catálogos e currículo.
- `scripts/`: build, verificações, sincronização, curadoria e geração de relatórios.
- `automation/`: automação local e documentação de tarefas relacionadas a certificados.

## 6. Fontes de verdade e precedência

Use esta ordem para resolver dúvidas:

1. Para regras de trabalho: `CLAUDE.md`, `AGENTS.md` e `docs/AI_HARNESS.md`.
2. Para conteúdo que aparece no site: `index.html` e os catálogos em `data/`.
3. Para fatos profissionais e métricas: currículo fonte e inventário de evidências.
4. Para cargo, foco e política de seleção: `data/career-profile.json`.
5. Para LinkedIn: `curriculo/07-linkedin/perfil-linkedin.md`.
6. Para decisões de priorização: painel profissional e skill de carreira.

Quando duas fontes divergirem:

- não invente uma reconciliação;
- identifique quais arquivos discordam;
- prefira o fato confirmado mais recente, se houver evidência explícita;
- proponha a sincronização dos arquivos afetados;
- peça confirmação de Eduarda se a divergência envolver cargo, datas, métricas, publicação ou informação confidencial.

## 7. Estado atual do portfólio

### Narrativa pública

O site posiciona Eduarda como Analista de Dados com foco em Dados, BI, Automação e Agentes de IA. A mensagem central é:

> Dados com contexto. Decisões com direção.

O conteúdo deve mostrar trabalho real, evidências e capacidade de conectar perguntas de negócio a soluções confiáveis.

### Seções atuais

1. Hero com posicionamento, retrato, disponibilidade, currículo e contatos.
2. Destaques de Power BI, Python, ETL e inglês.
3. Sobre, provas de competência, métricas e formação.
4. Experiência profissional em linha do tempo expansível.
5. Stack filtrável por BI & Dados, Automação & Código e IA & Produto.
6. Certificados selecionados carregados do catálogo.
7. Projetos publicados carregados do catálogo.
8. Contato com links e formulário que prepara um e-mail no aplicativo do visitante.
9. Modal para visualizar e baixar o currículo em PDF.

### Identidade visual

- Tema principal: **Lunar / Data & AI**.
- Aparência: escura, refinada, tecnológica e profissional.
- Cor de destaque: verde lunar `#8ed67a`.
- Fundo principal: quase preto `#05070a`.
- Elementos recorrentes: círculos/orbitais, brilho verde sutil, linhas finas, estrelas discretas, cartões translúcidos e ícones lineares.
- Tipografia: sistema sem serifa, com linguagem editorial; monoespaçada para rótulos técnicos.
- Retrato oficial: `public/images/eduarda-reis-noite-lunar.jpg`.
- Preserve contraste, legibilidade, hierarquia, foco visível e estética sóbria. Evite aparência genérica de template, neon excessivo ou efeitos que disputem atenção com o conteúdo.

### Comportamentos que devem continuar funcionando

- navegação por âncoras;
- menu responsivo;
- acordeões da experiência;
- filtros de competências;
- carregamento de projetos e certificados publicados;
- links externos corretos;
- abertura e download do currículo;
- formulário de contato via `mailto:`;
- foco por teclado;
- comportamento com `prefers-reduced-motion`;
- layouts desktop, tablet e mobile sem overflow horizontal.

## 8. Projetos principais publicados

O limite atual é de 6 projetos principais. A ordem é controlada por `displayOrder` em `data/projects.json`:

1. `report-automation` — Relatórios de Faturamento com Python.
2. `power-bi-dashboard-portfolio` — Portfólio de Dashboards em Power BI.
3. `pokemon-tcg-data-modeling` — Pokémon TCG Database Modeling.
4. `banco-em-escuta` — Banco em Escuta.
5. `dados-ia-decisoes-humanas` — Dados + IA: inteligência que impulsiona decisões humanas.
6. `horizon-2012-data-lab` — Horizon 2012 — Laboratório de Dados.

Regras:

- use sempre o `id` estável, nunca a posição ou o título como identidade;
- não mude IDs publicados;
- ao alterar um projeto publicado, mantenha `data/projects.json` e a interface compatíveis;
- novos repositórios entram como `status: "review"` até validação;
- não substitua automaticamente um projeto publicado;
- para promoção, exija README com problema, dados, método, validação, resultado e instruções de execução;
- mantenha o limite de 6 projetos principais, salvo decisão explícita de Eduarda.

## 9. Certificados e formação

O catálogo pode conter muitos itens em revisão. Volume não é objetivo; relevância e evidência são.

Limites atuais:

- até 8 certificados visíveis no site;
- até 6 certificados selecionados no currículo;
- demais itens permanecem no catálogo como revisão ou histórico.

Um certificado só deve ser publicado quando o PDF confirmar título, emissor e data e quando houver aderência suficiente ao posicionamento. Cursos introdutórios repetidos não devem ocupar espaço de evidências mais fortes.

Prioridade de desenvolvimento registrada:

- próxima credencial recomendada: Microsoft Certified Power BI Data Analyst Associate (PL-300);
- Google Data Analytics Certificate: opcional por haver sobreposição com experiência e formação existentes.

## 10. Regras editoriais

- Escreva em português claro e profissional.
- Priorize ação + contexto/escala + resultado.
- Use poucas evidências fortes em vez de listas longas.
- Não invente métricas, clientes, datas, instituições, tecnologias ou impactos.
- Não exponha nomes de clientes internos, dados operacionais, valores financeiros, bases confidenciais, credenciais ou detalhes de sistemas corporativos.
- Quando necessário, agregue, anonimize ou omita informações sensíveis.
- Não transforme curso em experiência profissional.
- Não apresente tecnologia “em formação” como domínio profissional.
- Não use “especialista”, “sênior” ou equivalentes sem evidência e solicitação explícita.
- Para IA aplicada, descreva práticas verificáveis: contexto, entradas, prompts, saídas estruturadas, guardrails, fallback, testes, avaliação e revisão humana.
- Trate harness engineering como prática operacional: contexto versionado, instruções explícitas, entradas definidas, avaliações e quality gates.
- Mantenha consistência entre site, currículo, LinkedIn e catálogos.

## 11. Política de curadoria

- Conteúdo descoberto automaticamente começa em `review`.
- Publicação, substituição de item, promoção editorial e alteração de `displayOrder` exigem decisão rastreável.
- Registre a decisão no campo `curation` do item correspondente.
- Não remova conteúdo publicado automaticamente.
- Não publique no LinkedIn, no site remoto ou em redes sociais sem solicitação explícita e confirmação no momento da publicação.
- O consultor recomenda; Eduarda aprova.

## 12. Como agir por tipo de tarefa

### Alteração visual do site

1. Leia `index.html`, `AGENTS.md` e `docs/AI_HARNESS.md`.
2. Preserve os tokens CSS, o tema Lunar / Data & AI e a organização de página única.
3. Use HTML semântico e acessível.
4. Teste desktop e mobile, navegação por teclado, reduced motion, menu, links, filtros, formulário e currículo.
5. Rode `npm run check` e `npm run build`.

### Atualização de texto profissional

1. Verifique o fato no currículo fonte, inventário de métricas e perfil de carreira.
2. Diferencie fato confirmado de hipótese.
3. Atualize as fontes relacionadas, evitando versões contraditórias.
4. Se afetar currículo, siga `docs/CURRICULO_WORKFLOW.md`.
5. Se afetar LinkedIn, prepare o texto, mas não publique sem confirmação.

### Novo projeto

1. Publicar ou atualizar o repositório no GitHub é responsabilidade externa e exige solicitação explícita.
2. Sincronize o catálogo com `npm run sync:github` quando autorizado e necessário.
3. Avalie evidência, aderência e qualidade do README.
4. Mantenha o item em `review` quando faltar evidência ou espaço.
5. Se aprovado, defina ID estável, categoria, tecnologias, resumo, link, status e `displayOrder`.
6. Rode revisão de carreira e validações finais.

### Novo certificado

1. Coloque o PDF em `curriculo/06-certificados/`.
2. Use o fluxo de automação para extrair e avaliar metadados.
3. Não publique item com título, emissor, data ou carga horária duvidosos.
4. Preserve os limites do site e do currículo.
5. Confira o painel profissional antes de explicar a decisão.

### Atualização do currículo

1. Edite primeiro `curriculo/02-fonte/curriculo-analista-de-dados.md`.
2. Sincronize `curriculo/03-layout/curriculo-analista-de-dados.html`.
3. Renderize o PDF em `public/documents/curriculo-eduarda-reis.pdf`.
4. Preserve os marcadores `certificates:start` e `certificates:end`.
5. Faça revisão visual e rode `npm run check`.

### Orientação de carreira

1. Leia `data/career-profile.json`, o currículo, as evidências e o painel profissional.
2. Use `.agents/skills/data-analyst-career-advisor/SKILL.md`.
3. Comece pela decisão recomendada, depois apresente evidência, lacuna e próximo passo.
4. Não altere arquivos se Eduarda pediu apenas orientação.

## 13. Comandos do projeto

```bash
npm run check
npm run build
npm run career:review
npm run career:review:check
npm run resume:sync
npm run resume:sync:check
npm run resume:render
npm run sync:github
npm run sync:certificates
npm run curate:content
npm run content:sync
npm run content:automate
```

Uso resumido:

- `npm run check`: valida fontes, currículo, catálogos e gera o build.
- `npm run build`: gera a saída de hospedagem em `dist/`.
- `npm run career:review`: reconstrói o painel profissional.
- `npm run content:sync`: sincroniza projetos, certificados, curadoria, carreira e currículo.
- `npm run content:automate`: executa a sincronização completa e renderiza o PDF.

Alguns comandos consultam recursos externos. Não os execute quando a tarefa for estritamente local ou quando não houver autorização para acesso externo.

## 14. Convenções técnicas

- Dois espaços de indentação em HTML, CSS e JavaScript.
- Manter a página em `index.html`, salvo benefício claro e aprovado para extração.
- Classes CSS, atributos `data-*`, IDs de conteúdo e novos nomes de arquivos em `kebab-case`.
- Variáveis JavaScript em `camelCase`.
- IDs de projeto são estáveis e únicos.
- Arquivos novos devem ter nomes descritivos, minúsculos e sem espaços.
- Preserve arquivos modificados ou não rastreados que não pertençam à tarefa.
- Nunca editar `dist/` ou `tmp/` manualmente.
- Não adicionar dependência sem necessidade clara.
- Não fazer refatoração ampla durante uma alteração pontual.
- Não remover mídia, backups ou histórico apenas por “limpeza”.

## 15. Quality gates antes de concluir

Sempre que aplicável:

1. confirme que a mudança usa a fonte de verdade correta;
2. verifique que nenhum fato ou número foi inventado;
3. confira se site, catálogo, currículo e LinkedIn continuam coerentes;
4. rode `npm run check`;
5. rode `npm run build` quando houver mudança publicável;
6. valide visualmente desktop e mobile em mudanças de interface;
7. teste foco de teclado, menu, filtros, acordeões, links, formulário e currículo;
8. verifique console e ausência de overflow horizontal;
9. não altere nem publique arquivos remotos sem pedido explícito;
10. entregue um resumo com arquivos alterados, validações e qualquer pendência.

## 16. Segurança e privacidade

- Nunca incluir chaves, tokens, credenciais ou segredos no repositório.
- Nunca expor dados internos da Insi, CNP Seguros Holding, BRB ou qualquer organização.
- Dados profissionais devem ser agregados e defensáveis em entrevista.
- Não reutilizar conteúdo de bases corporativas em projetos pessoais.
- Não publicar, enviar mensagens, alterar LinkedIn ou fazer deploy sem autorização explícita.
- Não modificar o PDF público silenciosamente; alterações de currículo exigem revisão visual.

## 17. Git e entrega

- Antes de editar, confira o estado do repositório e preserve mudanças existentes.
- Use commits pequenos, focados e no padrão Conventional Commits, por exemplo:
  - `feat(portfolio): add new data project`
  - `fix(resume): align current role dates`
  - `docs(context): add Claude project instructions`
- Não faça commit, push, pull request ou deploy sem solicitação explícita.
- Para mudanças visuais, inclua evidência de validação quando o fluxo pedir revisão.

## 18. Regra final

O portfólio deve aumentar a clareza e a credibilidade profissional de Eduarda. Toda mudança precisa responder a três perguntas:

1. Isto é verdadeiro e verificável?
2. Isto reforça o posicionamento em Dados, BI, Automação ou IA aplicada?
3. Isto ajuda recrutadores e equipes a entenderem rapidamente o valor do trabalho?

Se a resposta não for clara, mantenha a informação em revisão e explique o próximo passo necessário.
