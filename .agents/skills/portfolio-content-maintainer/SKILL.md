---
name: portfolio-content-maintainer
description: Mantém os catálogos, currículo e site de Eduarda sincronizados a partir de certificados e projetos, aplicando somente decisões automáticas rastreáveis.
---

# Manutenção automatizada de portfólio

Use esta skill quando novos PDFs forem incluídos em `curriculo/06-certificados/`, quando o GitHub tiver projetos novos ou quando for necessário atualizar o currículo e o site.

## Fontes e ordem de trabalho

1. Leia `AGENTS.md`, `docs/AI_HARNESS.md`, `data/career-profile.json` e `docs/CAREER_GOVERNANCE.md`.
2. Execute `npm run content:automate` para descoberta, curadoria, painel, sincronização do currículo e PDF.
3. Leia `curriculo/04-revisao/painel-profissional.md` antes de explicar a decisão.

## Limites de publicação automática

- Só publique certificado novo se o PDF confirmar título, emissor e data, a origem for reconhecida, a aderência for suficiente e ele tiver ao menos 4 horas ou for uma certificação profissional.
- Só publique projeto novo se o README demonstrar problema, dados, método, validação, resultado e execução, e se houver espaço no portfólio principal.
- Nunca invente informações, exclua conteúdo publicado automaticamente ou antecipe a promoção planejada.
- Preserve o limite definido em `data/career-profile.json`: oito certificados no site, seis no currículo e seis projetos principais.
- Registre toda decisão no campo `curation`; itens sem evidência ficam em `review`.

## Publicação do site

O repositório e o PDF podem ser atualizados automaticamente. A publicação no Sites depende de uma credencial temporária válida; quando não houver uma, registre a pendência em vez de expor credenciais ou tentar contornar o acesso.
