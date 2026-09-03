# Atualização de projetos e certificados

O portfólio separa o conteúdo aprovado dos itens que ainda precisam de revisão:

- `data/projects.json`: projetos publicados e repositórios encontrados no GitHub.
- `data/certificates.json`: certificações publicadas e PDFs encontrados em `curriculo/06-certificados`.
- `curriculo/04-revisao/painel-profissional.md`: recomendações de priorização geradas a partir dos catálogos e do perfil de carreira.
- `status: "published"`: candidato a aparecer no site; a curadoria mantém no máximo oito itens visíveis.
- `status: "review"`: permanece apenas no catálogo até a validação editorial.

## Rodar localmente

```bash
npm run sync:github
npm run sync:certificates
npm run career:review
```

Para conferir o que seria descoberto sem alterar arquivos:

```bash
npm run sync:github -- --dry-run
npm run sync:certificates -- --dry-run
```

O mantenedor registra a decisão em `curation`. Certificados novos só entram automaticamente quando o PDF confirma título, emissor e data, a instituição é reconhecida, há aderência profissional e a carga horária é de ao menos quatro horas (ou se for credencial profissional). Projetos exigem README com problema, dados, método, validação, resultado e instruções de execução.

## Pull Request automático

O workflow `.github/workflows/sync-portfolio-content.yml` roda semanalmente, quando um certificado chega ao GitHub e também pode ser iniciado manualmente. Ele aplica automaticamente apenas decisões rastreáveis e seguras.

Para que copiar um PDF para a pasta local seja suficiente, execute uma vez `automation/install-certificate-task.ps1`. A tarefa do Windows processa PDFs novos, atualiza somente os arquivos gerenciados e interrompe o envio se encontrar outras alterações locais.

O painel continua explicando a decisão. Itens sem evidência, cursos introdutórios e possíveis substituições permanecem em revisão.
