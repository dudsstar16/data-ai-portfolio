# Atualização de projetos e certificados

O portfólio separa o conteúdo aprovado dos itens que ainda precisam de revisão:

- `data/projects.json`: projetos publicados e repositórios encontrados no GitHub.
- `data/certificates.json`: certificações publicadas e PDFs encontrados em `curriculo/06-certificados`.
- `status: "published"`: aparece no site.
- `status: "review"`: permanece apenas no catálogo até a validação editorial.

## Rodar localmente

```bash
npm run sync:github
npm run sync:certificates
```

Para conferir o que seria descoberto sem alterar arquivos:

```bash
npm run sync:github -- --dry-run
npm run sync:certificates -- --dry-run
```

Depois da sincronização, revise os itens com `status: "review"`. Confirme título, categoria, descrição, tecnologias, instituição, data e imagem quando houver. Para publicar, altere o status para `published`, defina `displayOrder` e complete os campos editoriais.

## Pull Request automático

O workflow `.github/workflows/sync-portfolio-content.yml` roda semanalmente e também pode ser iniciado manualmente na aba **Actions** do GitHub. Ele consulta os repositórios públicos, varre os PDFs de certificados e abre um Pull Request apenas quando encontra mudanças.

O workflow nunca faz commit direto na branch principal e nenhum item novo aparece no site antes de ser marcado como `published`.
