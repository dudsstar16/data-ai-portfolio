import { readFile, writeFile } from "node:fs/promises";

const profilePath = "data/career-profile.json";
const projectsPath = "data/projects.json";
const certificatesPath = "data/certificates.json";
const outputPath = "curriculo/04-revisao/painel-profissional.md";
const checkOnly = process.argv.includes("--check");

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeCell(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function collectText(item) {
  return normalize([
    item.title,
    item.summary,
    item.category,
    item.categoryLabel,
    ...(item.technologies ?? [])
  ].join(" "));
}

function assess(item, pillars) {
  const text = ` ${collectText(item)} `;
  const matches = pillars.filter(pillar =>
    pillar.keywords.some(keyword => text.includes(` ${normalize(keyword)} `))
  );
  return {
    ...item,
    score: matches.reduce((total, pillar) => total + pillar.weight, 0),
    matches
  };
}

function rank(items) {
  return [...items].sort((a, b) =>
    b.score - a.score ||
    (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER) ||
    a.title.localeCompare(b.title, "pt-BR")
  );
}

function pillarLabels(item) {
  return item.matches.length ? item.matches.map(match => match.label).join(", ") : "Sem aderência identificada pelo catálogo";
}

function projectDecision(project, highlightedIds) {
  if (project.status === "published") {
    return highlightedIds.has(project.id) ? "manter em destaque" : "reavaliar espaço";
  }
  if (project.score >= 8 && project.matches.length >= 2) return "candidato forte após revisão editorial";
  if (project.score >= 5) return "desenvolver evidência antes de publicar";
  return "manter fora do portfólio principal";
}

function certificateDecision(certificate, selectedIds) {
  const missingMetadata = !certificate.issuer || !certificate.date;
  if (missingMetadata && certificate.score >= 5) return "prioridade: validar PDF e metadados";
  if (missingMetadata && certificate.score >= 2) return "validar quando houver espaço";
  if (missingMetadata) return "baixa prioridade; manter no acervo";
  if (selectedIds.has(certificate.id)) return "selecionar";
  if (certificate.status === "published") return "reduzir redundância no site";
  if (certificate.score >= 5) return "avaliar após confirmação editorial";
  return "manter como formação complementar";
}

const [profile, projectCatalog, certificateCatalog] = await Promise.all([
  readFile(profilePath, "utf8").then(JSON.parse),
  readFile(projectsPath, "utf8").then(JSON.parse),
  readFile(certificatesPath, "utf8").then(JSON.parse)
]);

const projects = rank((projectCatalog.projects ?? []).map(item => assess(item, profile.competencyPillars)));
const certificates = rank((certificateCatalog.certificates ?? []).map(item => assess(item, profile.competencyPillars)));
const publishedProjects = projects.filter(item => item.status === "published");
const reviewProjects = projects.filter(item => item.status === "review");
const publishedCertificates = certificates.filter(item => item.status === "published");
const visibleCertificates = publishedCertificates.filter(item => item.curation?.siteVisible !== false);
const reviewCertificates = certificates.filter(item => item.status === "review");
const highlightedIds = new Set(publishedProjects.slice(0, profile.selectionPolicy.portfolioProjectLimit).map(item => item.id));
const selectedCertificateIds = new Set(visibleCertificates
  .filter(item => item.issuer && item.date)
  .slice(0, profile.selectionPolicy.siteCertificateLimit)
  .map(item => item.id));
const publishedCoverage = new Set(publishedProjects.flatMap(item => item.matches.map(match => match.id)));
const coverageGaps = profile.competencyPillars.filter(pillar => !publishedCoverage.has(pillar.id));
const missingCertificateMetadata = certificates.filter(item => !item.issuer || !item.date).length;
const selectedCertificates = certificates.filter(item => selectedCertificateIds.has(item.id));
const deprioritizedPublishedCertificates = publishedCertificates.filter(item => !selectedCertificateIds.has(item.id));
const priorityReviewCertificates = reviewCertificates.filter(item => item.score >= 5).slice(0, 10);
const certificateDecisionList = [
  ...selectedCertificates,
  ...deprioritizedPublishedCertificates,
  ...priorityReviewCertificates.filter(item => !selectedCertificateIds.has(item.id))
];
const reviewQueueCounts = {
  priority: reviewCertificates.filter(item => item.score >= 5).length,
  contextual: reviewCertificates.filter(item => item.score >= 2 && item.score < 5).length,
  complementary: reviewCertificates.filter(item => item.score < 2).length
};

const projectRows = [...publishedProjects, ...reviewProjects]
  .map(item => `| \`${escapeCell(item.id)}\` | ${escapeCell(item.status)} | ${item.score} | ${escapeCell(pillarLabels(item))} | ${projectDecision(item, highlightedIds)} |`)
  .join("\n");
const certificateRows = certificateDecisionList
  .map(item => `| \`${escapeCell(item.id)}\` | ${escapeCell(item.status)} | ${item.score} | ${escapeCell(pillarLabels(item))} | ${certificateDecision(item, selectedCertificateIds)} |`)
  .join("\n");
const credentialRows = profile.credentialRoadmap
  .map(item => `| ${escapeCell(item.priority)} | [${escapeCell(item.title)}](${item.url}) | ${escapeCell(item.reason)} |`)
  .join("\n");
const gapText = coverageGaps.length
  ? coverageGaps.map(pillar => `- **${pillar.label}:** incluir ou fortalecer uma evidência aplicada antes de ampliar certificados.`).join("\n")
  : "- Os pilares definidos já aparecem em ao menos um projeto publicado; a próxima melhoria é aprofundar evidências, não aumentar volume.";

const report = `# Painel Profissional — Analista de Dados

Relatório determinístico para apoiar decisões humanas. Ele usa somente os metadados versionados em \`${profilePath}\`, \`${projectsPath}\` e \`${certificatesPath}\`; não avalia sozinho a qualidade interna de um PDF ou repositório.

## Direção atual

| Campo | Valor |
| --- | --- |
| Cargo-alvo | ${profile.target.role} ${profile.target.level} |
| Posicionamento | ${escapeCell(profile.target.positioning)} |
| Transição | ${profile.transition.newTitle}, prevista para ${profile.transition.effectiveDate} |
| Estado da transição | ${profile.transition.status} — confirmação humana obrigatória |

> ${profile.transition.note}

## Visão rápida

| Conteúdo | Publicados | Em revisão | Limite recomendado |
| --- | ---: | ---: | ---: |
| Projetos | ${publishedProjects.length} | ${reviewProjects.length} | ${profile.selectionPolicy.portfolioProjectLimit} no portfólio principal |
| Certificados | ${publishedCertificates.length} | ${reviewCertificates.length} | ${profile.selectionPolicy.siteCertificateLimit} no site / ${profile.selectionPolicy.resumeCertificateLimit} no currículo |

Há **${missingCertificateMetadata} certificado(s)** sem instituição ou data confirmada. Eles não devem ser publicados até a conferência do PDF.

Na fila de revisão, **${reviewQueueCounts.priority}** têm alta aderência pelos metadados, **${reviewQueueCounts.contextual}** são contextuais e **${reviewQueueCounts.complementary}** são complementares ou ainda não têm sinal suficiente no título.

## Próximas credenciais

| Prioridade | Credencial | Decisão profissional |
| --- | --- | --- |
${credentialRows}

Faça uma credencial principal por vez. Para esta trajetória, projeto aplicado e resultado profissional têm prioridade sobre acumular cursos introdutórios.

## Cobertura a fortalecer

${gapText}

## Projetos

Pontuação é uma heurística transparente de aderência aos pilares; não representa qualidade absoluta.

| ID estável | Status | Aderência | Pilares identificados | Decisão sugerida |
| --- | --- | ---: | --- | --- |
${projectRows}

## Certificados

A tabela mostra a seleção sugerida, os publicados que perderam prioridade e os candidatos mais aderentes da fila. O catálogo completo continua em \`data/certificates.json\`.

| ID estável | Status | Aderência | Pilares identificados | Decisão sugerida |
| --- | --- | ---: | --- | --- |
${certificateRows}

## Como usar

1. Adicione PDFs em \`curriculo/06-certificados/\` ou mantenha os projetos públicos no GitHub.
2. Rode \`npm run content:sync\` para descobrir itens e reconstruir este painel.
3. Revise título, instituição, data, descrição, evidência e confidencialidade.
4. Só então altere \`status\` para \`published\` e defina \`displayOrder\`.

O script nunca publica conteúdo, nunca altera o currículo e nunca decide sozinho em nome de Eduarda.
`;

if (checkOnly) {
  const current = await readFile(outputPath, "utf8").catch(() => "");
  if (current !== report) {
    throw new Error(`Painel profissional desatualizado. Rode: npm run career:review`);
  }
  console.log("Painel profissional consistente com os catálogos e o perfil de carreira.");
} else {
  await writeFile(outputPath, report);
  console.log(`Painel profissional atualizado em ${outputPath}.`);
}
