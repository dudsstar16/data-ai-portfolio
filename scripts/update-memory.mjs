import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { scoreItem } from "./lib/content-curation.mjs";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(repoRoot);
const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const isHook = args.includes("--hook");
const noteIndex = args.indexOf("--note");
const customNote = noteIndex !== -1 && args[noteIndex + 1] ? args[noteIndex + 1].trim() : "";

async function readStdinJson() {
  if (process.stdin.isTTY) return null;
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function getGitShortLog() {
  try {
    const { stdout } = await execFileAsync("git", ["log", "-n", "6", "--date=short", "--pretty=format:%ad|%h|%s"]);
    return stdout
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const [date, hash, ...subjectParts] = line.split("|");
        return { date, hash, subject: subjectParts.join("|").trim() };
      });
  } catch {
    return [];
  }
}

async function getGitDirtyFiles() {
  try {
    const { stdout } = await execFileAsync("git", ["status", "--porcelain"]);
    return stdout
      .split(/\r?\n/)
      .filter(line => line.trim().length > 3)
      .map(line => line.slice(3).trim().replace(/^"(.*)"$/, "$1"))
      .filter(file => !file.startsWith("memoria/") && !file.startsWith("dist/"));
  } catch {
    return [];
  }
}

function summarizeArea(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  if (normalized === "index.html") return "Interface principal e estilos (index.html)";
  if (normalized === "data/projects.json") return "Catálogo de projetos (data/projects.json)";
  if (normalized === "data/certificates.json") return "Catálogo de certificados (data/certificates.json)";
  if (normalized === "data/career-profile.json") return "Perfil e metas de carreira (data/career-profile.json)";
  if (normalized.startsWith("curriculo/02-fonte/") || normalized.startsWith("curriculo/03-layout/")) {
    return "Fonte/layout do currículo (curriculo/)";
  }
  if (normalized === "public/documents/curriculo-eduarda-reis.pdf") return "PDF público do currículo";
  if (normalized.startsWith("curriculo/04-revisao/")) return "Painel de revisão profissional";
  if (normalized.startsWith("curriculo/07-linkedin/")) return "Editorial do LinkedIn";
  if (normalized.startsWith("scripts/")) return `Automação e validação (${normalized})`;
  if (normalized.startsWith(".agents/")) return `Configuração de agentes (${normalized})`;
  if (normalized.startsWith("docs/") || normalized === "AGENTS.md" || normalized === "README.md") {
    return `Documentação e governança (${normalized})`;
  }
  return normalized;
}

function buildContextMarkdown({ profile, projects, certificates }) {
  const publishedProjects = projects.filter(item => item.status === "published")
    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
  const reviewProjects = projects.filter(item => item.status === "review");
  const publishedCerts = certificates.filter(item => item.status === "published");
  const visibleCerts = publishedCerts
    .filter(item => item.curation?.siteVisible !== false)
    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
    .slice(0, profile.selectionPolicy.siteCertificateLimit);
  const resumeCerts = [...visibleCerts]
    .sort((left, right) =>
      scoreItem(right, profile.competencyPillars).score - scoreItem(left, profile.competencyPillars).score ||
      (right.durationHours ?? 0) - (left.durationHours ?? 0) ||
      (left.displayOrder ?? 999) - (right.displayOrder ?? 999) ||
      left.title.localeCompare(right.title, "pt-BR")
    )
    .slice(0, profile.selectionPolicy.resumeCertificateLimit);
  const reviewCerts = certificates.filter(item => item.status === "review");

  const projectLines = publishedProjects
    .map(item => {
      const assessment = scoreItem(item, profile.competencyPillars);
      return `- \`${item.id}\` (#${item.displayOrder}, score ${assessment.score}): ${item.title} [${item.categoryLabel}]`;
    })
    .join("\n");
  const topReviewProjects = reviewProjects
    .map(item => ({ item, assessment: scoreItem(item, profile.competencyPillars) }))
    .filter(entry => entry.assessment.score >= 4)
    .sort((a, b) => b.assessment.score - a.assessment.score || a.item.title.localeCompare(b.item.title, "pt-BR"))
    .slice(0, 6)
    .map(({ item, assessment }) => `- \`${item.id}\` (score ${assessment.score}, README ok: ${item.github?.readmeEvidence?.complete ? "sim" : "não"}): ${item.title}`);
  const certLines = visibleCerts
    .map(item => {
      const assessment = scoreItem(item, profile.competencyPillars);
      return `- \`${item.id}\` (#${item.displayOrder}, score ${assessment.score}): ${item.title} (${item.issuer}, ${item.displayDate})`;
    })
    .join("\n");
  const resumeCertNames = resumeCerts.map(item => item.title).join(" · ");

  return `# Memória Rápida do Repositório (Economia de Tokens)

Leia este arquivo primeiro. Ele resume o estado atual do projeto em frases curtas para evitar releituras completas de \`index.html\` e dos catálogos \`data/*.json\`.

## Site oficial e publicação

- GitHub Pages: \`https://dudsstar16.github.io/data-ai-portfolio/\`. O endereço do ChatGPT Sites é legado.
- Fonte: \`dudsstar16/data-ai-portfolio\`, branch \`master\`. O workflow \`deploy-portfolio-pages.yml\` publica após push em \`master\`, após o sucesso de **Atualizar conteúdo profissional** nessa branch ou por execução manual.
- Valide com \`npm run check\` e \`node scripts/build.mjs --pages\`. Confira o deploy no GitHub Actions e teste a página, os catálogos e o PDF no endereço oficial.

## 1. Identidade e Posicionamento

- **Profissional:** Eduarda Reis — ${profile.transition.newTitle} (Insi / atuação na CNP Seguros Holding, desde ${profile.transition.effectiveDate}).
- **Alvo e foco:** ${profile.target.role} ${profile.target.level} | ${profile.target.positioning}.
- **Métricas-chave no site:** 27M+ linhas no BRB; 12 dashboards em Power BI; relatórios de 1–2h para <5min; 3 anos em Londres (inglês fluente).

## 2. Fluxo Geral de Comandos por Ação (Guia Rápido)

| Ação desejada | Comando único para aplicar | O que ele faz automaticamente |
| --- | --- | --- |
| **Sincronizar TUDO (GitHub + Certificados + Site + Currículo PDF + Memória)** | \`npm run content:automate\` | Busca repositórios novos no GitHub, lê PDFs novos em \`curriculo/06-certificados/\`, pontua por IA/Dados, atualiza o painel, sincroniza o Top 8 no site e Top 6 no currículo, gera o PDF e atualiza a memória. |
| **Apenas buscar novos repositórios no GitHub** | \`npm run sync:github\` | Consulta a API do GitHub (\`dudsstar16\`), verifica evidências do README (problema, dados, método, validação, resultado, execução) e adiciona/atualiza em \`data/projects.json\`. |
| **Apenas ler novos certificados PDF salvos na pasta** | \`npm run sync:certificates\` | Extrai instituição, data e carga horária dos PDFs em \`curriculo/06-certificados/\` e registra em \`data/certificates.json\`. |
| **Filtrar e classificar destaques de IA & Dados** | \`npm run curate:content\` | Avalia pontuação nos 7 pilares de IA/Dados, aprova certificados elegíveis (score >= 5 e >= 4h), ordena por relevância e seleciona os visíveis no site. |
| **Atualizar painel de carreira e correlação** | \`npm run career:review\` | Recalcula a correlação entre projetos, certificados e pilares profissionais em \`curriculo/04-revisao/painel-profissional.md\`. |
| **Atualizar currículo (Markdown + HTML + PDF 2 páginas)** | \`npm run resume:sync && npm run resume:render\` | Injeta o Top 6 de certificados de IA/Dados no currículo e exporta \`public/documents/curriculo-eduarda-reis.pdf\`. |
| **Registrar nota curta na memória local** | \`npm run memory:log -- --note "Resumo curto"\` | Registra no histórico documental (\`memoria/historico-ajustes.md\`) o que foi feito e melhorado. |
| **Validar qualidade e gerar pacote final do site** | \`npm run check\` | Verifica integridade de todos os arquivos, painel, currículo, memória e gera o worker em \`dist/\`. |

## 3. Mapa Cirúrgico de Arquivos (Onde Editar)

- \`AGENTS.md\`: repositório principal e skill de controle de execução. Pause antes de trocar modelo ou esforço.
- \`index.html\`: estrutura do site; estilos e scripts editoriais ficam em \`public/styles/\` e \`public/scripts/\`.
- \`data/projects.json\`: ${publishedProjects.length} publicados (limite: ${profile.selectionPolicy.portfolioProjectLimit}) e ${reviewProjects.length} em revisão.
- \`data/certificates.json\`: ${publishedCerts.length} publicados (${visibleCerts.length} visíveis no site, limite: ${profile.selectionPolicy.siteCertificateLimit}) e ${reviewCerts.length} em revisão.
- \`curriculo/02-fonte/curriculo-analista-de-dados.md\`: Texto-fonte do currículo (sincronizado com layout HTML e PDF de 2 páginas).
- \`curriculo/04-revisao/painel-profissional.md\`: Painel determinístico gerado por \`npm run career:review\`.
- \`dist/\`: Saída gerada por \`npm run build\`. Nunca editar diretamente.

## 4. Projetos Publicados Atualmente (${publishedProjects.length}/${profile.selectionPolicy.portfolioProjectLimit})

${projectLines}

## 5. Repositórios do GitHub na Fila de Revisão (Mais Aderentes a IA & Dados)

${topReviewProjects.length ? topReviewProjects.join("\n") : "- Nenhum projeto em revisão com pontuação >= 4."}

## 6. Certificados Visíveis no Site (${visibleCerts.length}/${profile.selectionPolicy.siteCertificateLimit})

${certLines}

## 7. Certificados no Currículo (${resumeCerts.length}/${profile.selectionPolicy.resumeCertificateLimit})

- ${resumeCertNames}

## 8. Como Manter Site e Currículo Sempre Atualizados Automaticamente

1. **Na nuvem (GitHub Actions — já ativo):** O workflow \`.github/workflows/sync-portfolio-content.yml\` roda toda **segunda-feira às 12:30 UTC**, além de rodar automaticamente sempre que um PDF novo é enviado para \`curriculo/06-certificados/\`. Ele executa \`npm run content:automate\` e faz o commit das atualizações no repositório.
2. **No computador local (Tarefa agendada do Windows):** Execute uma vez no PowerShell \`powershell -ExecutionPolicy Bypass -File .\\automation\\install-certificate-task.ps1\`. Ele monitora a pasta \`curriculo/06-certificados/\` a cada 30 minutos e no login.
3. **Manualmente a qualquer momento:** Rode \`npm run content:automate && npm run check\`.
`;
}

const readmeContent = `# Pasta de Memória Local (\`memoria/\`)

Esta pasta guarda o resumo operacional, o fluxo de comandos e o histórico de evolução do portfólio em **frases curtas e simples**.

## Objetivos

1. **Reduzir gasto de tokens:** O agente lê \`memoria/contexto-rapido.md\` em vez de varrer \`index.html\` (63 KB) e \`data/certificates.json\` (1.365 linhas) a cada ajuste.
2. **Guia rápido de comandos:** Tabela direta com o comando exato para cada ação (sincronizar GitHub, filtrar certificados de IA/Dados, atualizar currículo PDF e validar o site).
3. **Acompanhamento documental:** Cada modificação ou melhoria fica registrada em \`memoria/historico-ajustes.md\` com frases diretas sobre o que foi feito e melhorado.

## Arquivos

- [\`contexto-rapido.md\`](./contexto-rapido.md): Fotografia atualizada automaticamente com fluxo de comandos, estado do site, currículo, projetos do GitHub (publicados e fila de revisão) e certificados de IA/Dados.
- [\`historico-ajustes.md\`](./historico-ajustes.md): Linha do tempo resumida de alterações, melhorias e estado da árvore local.

## Automação Configurada

1. **Comando Mestre (\`npm run content:automate\`):** Busca repositórios novos no GitHub, lê PDFs novos em \`curriculo/06-certificados/\`, pontua e filtra os destaques de IA e Dados, atualiza o painel profissional, sincroniza o currículo (Markdown, HTML e PDF) e atualiza a memória.
2. **Hook automático do Agente (\`.agents/hooks.json\`):** Ao editar arquivos (\`edit_file\` / \`write_file\`), a memória é atualizada automaticamente em segundo plano.
3. **Validação e Build (\`npm run check\`):** Verifica e sincroniza a memória junto com os demais checks de qualidade do projeto.
4. **Registro manual de nota curta:**
   \`\`\`bash
   npm run memory:log -- --note "Resumo curto do que foi feito e melhorado"
   \`\`\`
`;

async function main() {
  const hookPayload = isHook ? await readStdinJson() : null;

  const [profile, projectCatalog, certificateCatalog] = await Promise.all([
    readFile("data/career-profile.json", "utf8").then(JSON.parse),
    readFile("data/projects.json", "utf8").then(JSON.parse),
    readFile("data/certificates.json", "utf8").then(JSON.parse),
  ]);

  const contextMarkdown = buildContextMarkdown({
    profile,
    projects: projectCatalog.projects ?? [],
    certificates: certificateCatalog.certificates ?? [],
  });

  const contextPath = "memoria/contexto-rapido.md";
  const historyPath = "memoria/historico-ajustes.md";
  const readmePath = "memoria/README.md";

  if (checkOnly) {
    await Promise.all([access(contextPath), access(historyPath), access(readmePath)]);
    const currentContext = (await readFile(contextPath, "utf8").catch(() => "")).replace(/\r\n/g, "\n");
    if (currentContext !== contextMarkdown.replace(/\r\n/g, "\n")) {
      throw new Error("Memória rápida desatualizada. Rode: npm run memory:sync");
    }
    if (!isHook) {
      console.log("Memória local consistente com os catálogos e o estado do projeto.");
    }
    return;
  }

  await mkdir("memoria", { recursive: true });

  let existingHistory = await readFile(historyPath, "utf8").catch(() => "");
  const gitCommits = await getGitShortLog();
  const dirtyFiles = await getGitDirtyFiles();

  const manualEntriesMatch = existingHistory.match(/<!-- manual-notes:start -->([\s\S]*?)<!-- manual-notes:end -->/);
  let manualLines = manualEntriesMatch
    ? manualEntriesMatch[1].split(/\r?\n/).map(line => line.trim()).filter(line => line.startsWith("- "))
    : [
      "- **2026-11-21**: Criada pasta `memoria/` com contexto rápido e automação via hook/scripts para economia de tokens e registro documental.",
    ];

  const today = new Date().toISOString().slice(0, 10);

  if (customNote) {
    const formattedNote = `- **${today}**: ${customNote.replace(/\.$/, "")}.`;
    if (!manualLines.includes(formattedNote)) {
      manualLines = [formattedNote, ...manualLines].slice(0, 20);
    }
  } else if (isHook && hookPayload?.toolCall?.args?.Path) {
    const rawPath = String(hookPayload.toolCall.args.Path);
    const relPath = path.relative(process.cwd(), rawPath).replace(/\\/g, "/");
    if (relPath && !relPath.startsWith("..") && !relPath.startsWith("memoria/") && !relPath.startsWith("dist/")) {
      const area = summarizeArea(relPath);
      const hookLine = `- **${today}**: Ajuste registrado automaticamente em ${area}.`;
      if (!manualLines.includes(hookLine)) {
        manualLines = [hookLine, ...manualLines].slice(0, 20);
      }
    }
  }

  const activeAreas = [...new Set(dirtyFiles.map(summarizeArea))];
  const worktreeSection = activeAreas.length
    ? activeAreas.map(area => `- Em ajuste atual: ${area}.`).join("\n")
    : "- Árvore limpa: todas as melhorias estão consolidadas e sincronizadas.";

  const commitLines = gitCommits.length
    ? gitCommits.map(commit => `- **${commit.date}** (\`${commit.hash}\`): ${commit.subject}.`).join("\n")
    : "- Sem histórico git disponível.";

  const historyMarkdown = `# Histórico de Ajustes e Qualidade

Registro documental em frases curtas e simples sobre o que foi feito e melhorado no projeto.

## Notas de Evolução e Melhorias Recentes

<!-- manual-notes:start -->
${manualLines.join("\n")}
<!-- manual-notes:end -->

## Estado da Árvore Local (Ajustes em Andamento)

<!-- worktree-status:start -->
${worktreeSection}
<!-- worktree-status:end -->

## Últimas Entregas Consolidadas (Git)

<!-- git-log:start -->
${commitLines}
<!-- git-log:end -->
`;

  await Promise.all([
    writeFile(readmePath, readmeContent, "utf8"),
    writeFile(contextPath, contextMarkdown, "utf8"),
    writeFile(historyPath, historyMarkdown, "utf8"),
  ]);

  if (isHook) {
    process.stdout.write("{}\n");
  } else {
    console.log("Memória local sincronizada em memoria/contexto-rapido.md e memoria/historico-ajustes.md.");
  }
}

main().catch(error => {
  if (isHook) {
    process.stdout.write("{}\n");
    process.exit(0);
  }
  console.error(error.message || error);
  process.exit(1);
});
