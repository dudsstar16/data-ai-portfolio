# Governança de Carreira e Curadoria

Este repositório inclui um consultor de carreira em dados, disponível como a skill `$data-analyst-career-advisor`. Ele ajuda a revisar currículo, projetos, certificados, narrativa profissional e desenvolvimento para Analista de Dados.

O consultor **recomenda; Eduarda decide**. Nenhuma sugestão muda automaticamente o conteúdo público.

## Fluxo simples

```text
PDF novo ou repositório público
              |
              v
     descoberta automática
       status: "review"
              |
              v
  painel profissional explicável
              |
              v
   conferência humana de fatos
              |
              v
 publicação manual + displayOrder
```

## Fontes de conhecimento

| Fonte | O que informa |
| --- | --- |
| `data/career-profile.json` | Cargo-alvo, transição, limites e pilares profissionais. |
| `data/projects.json` | Projetos publicados ou aguardando revisão. |
| `data/certificates.json` | Certificados publicados ou aguardando metadados. |
| `curriculo/01-evidencias/` | Números e resultados que podem ser defendidos. |
| `curriculo/02-fonte/` | Texto mestre do currículo. |
| `curriculo/04-revisao/painel-profissional.md` | Priorização reproduzível e legível. |

## Promoção planejada

A mudança para **Analista de Dados Júnior** está registrada com vigência prevista em **10/09/2026**. Até Eduarda confirmar o início, o site e o currículo não devem apresentar a função como experiência já exercida.

Depois da confirmação, a atualização deve ocorrer na fonte Markdown, no layout HTML e no PDF público, com validação visual conforme `docs/CURRICULO_WORKFLOW.md`.

## Critério para certificados

- Uma credencial forte e aderente vale mais do que vários cursos introdutórios repetidos.
- Para o foco atual, a próxima credencial de maior aderência é **Microsoft Certified: Power BI Data Analyst Associate (PL-300)**.
- O **Google Data Analytics Certificate** é opcional: pode organizar fundamentos e produzir estudo de caso, mas há sobreposição com a experiência e a formação já registradas.
- SQL, Python, ETL e estatística devem aparecer principalmente em projetos e resultados verificáveis; um certificado pode complementar, mas não substituir essa evidência.

As referências oficiais e a data da última revisão ficam em `data/career-profile.json`, evitando recomendações soltas sem origem.

## Conversas úteis com o agente

- “Use `$data-analyst-career-advisor` para revisar os certificados em `review` e me dizer quais merecem completar os metadados primeiro.”
- “Transforme esta entrega da minha nova função em evidência segura para o inventário, sem expor dados internos.”
- “Compare uma vaga com meu currículo e indique lacunas reais, sem inventar experiência.”
- “Monte um plano de 30, 60 e 90 dias para minha entrada como Analista de Dados Júnior.”

## Comandos

```bash
npm run career:review
npm run career:review:check
npm run content:sync
npm run check
```

`career:review` só lê os catálogos e gera o painel. `content:sync` também consulta os repositórios públicos no GitHub. A rotina semanal abre Pull Request para revisão e nunca publica na branch principal por conta própria.

