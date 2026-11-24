import { readFile, writeFile } from "node:fs/promises";
import { isRecognizedIssuer, scoreItem } from "./lib/content-curation.mjs";

const dryRun = process.argv.includes("--dry-run");
const profile = JSON.parse(await readFile("data/career-profile.json", "utf8"));
const certificateCatalog = JSON.parse(await readFile("data/certificates.json", "utf8"));
const projectCatalog = JSON.parse(await readFile("data/projects.json", "utf8"));
const now = new Date().toISOString();

function curation(previous, decision, confidence, reasons) {
  const sameDecision = previous && previous.decision === decision && previous.confidence === confidence &&
    previous.reviewer === "rules-v1" && JSON.stringify(previous.reasons) === JSON.stringify(reasons);
  if (sameDecision) return previous;
  return { decision, confidence, reasons, reviewer: "rules-v1", reviewedAt: now, ...(previous?.siteVisible !== undefined ? { siteVisible: previous.siteVisible } : {}) };
}

let changed = 0;

for (const certificate of certificateCatalog.certificates) {
  const assessment = scoreItem(certificate, profile.competencyPillars);
  const evidence = certificate.automation?.evidence;
  const hasCoreMetadata = Boolean(certificate.title && certificate.issuer && certificate.date);
  const metadataComplete = Boolean(hasCoreMetadata && ((evidence?.textExtracted && evidence?.titleEvidence) || certificate.curation?.reviewer === "human" || certificate.durationHours != null));
  const eligible = certificate.status === "review" &&
    metadataComplete &&
    isRecognizedIssuer(certificate.issuer) &&
    assessment.score >= 5 &&
    (certificate.durationHours >= 4 || /certified|certifica[cç][aã]o profissional|associate|forma[cç][aã]o/i.test(certificate.title));
  const next = certificate.status === "published" && !hasCoreMetadata
    ? curation(certificate.curation, "maintain-published-evidence-pending", "medium", ["published certificate retained; evidence extraction is pending"])
    : certificate.status === "published"
      ? curation(certificate.curation, "publish-site-and-resume", "high", ["PDF metadata confirmed", "data-career alignment", "eligible duration or professional credential"])
      : eligible
        ? curation(certificate.curation, "publish-site-and-resume", "high", ["PDF metadata confirmed", "data-career alignment", "eligible duration or professional credential"])
        : curation(certificate.curation,
          hasCoreMetadata ? "review-or-keep-complementary" : "hold-missing-evidence",
          hasCoreMetadata ? "medium" : "low",
          [
            !hasCoreMetadata && "metadados ou título ainda não confirmados no PDF",
            assessment.score < 5 && "aderência insuficiente aos pilares prioritários",
            certificate.durationHours != null && certificate.durationHours < 4 && "curso introdutório com menos de 4 horas",
          ].filter(Boolean)
        );
  if (eligible) {
    certificate.status = "published";
  }
  if (JSON.stringify(certificate.curation) !== JSON.stringify(next)) {
    certificate.curation = next;
    changed += 1;
  }
}

const rankedPublishedCertificates = certificateCatalog.certificates
  .filter(item => item.status === "published")
  .map(item => ({ item, assessment: scoreItem(item, profile.competencyPillars) }))
  .sort((left, right) =>
    right.assessment.score - left.assessment.score ||
    (right.item.durationHours ?? 0) - (left.item.durationHours ?? 0) ||
    (left.item.displayOrder ?? Number.MAX_SAFE_INTEGER) - (right.item.displayOrder ?? Number.MAX_SAFE_INTEGER) ||
    left.item.title.localeCompare(right.item.title, "pt-BR")
  );
const visibleCertificates = rankedPublishedCertificates.slice(0, profile.selectionPolicy.siteCertificateLimit);
const visibleIds = new Set(visibleCertificates.map(entry => entry.item.id));
for (const [index, { item: certificate }] of rankedPublishedCertificates.entries()) {
  const siteVisible = visibleIds.has(certificate.id);
  const nextOrder = index + 1;
  if (certificate.displayOrder !== nextOrder) {
    certificate.displayOrder = nextOrder;
    changed += 1;
  }
  if (certificate.curation?.siteVisible !== siteVisible) {
    certificate.curation = { ...certificate.curation, siteVisible };
    changed += 1;
  }
}

for (const project of projectCatalog.projects) {
  const assessment = scoreItem(project, profile.competencyPillars);
  const autoCandidate = project.status === "review" && project.automation?.discoveredBy === "github-sync-v2";
  const reasons = [
    assessment.score < 8 && "aderência abaixo da pontuação mínima",
    assessment.pillars.length < 2 && "menos de dois pilares de competência identificados",
    profile.selectionPolicy.portfolioProjectLimit <= projectCatalog.projects.filter(item => item.status === "published").length && "limite de projetos publicados já ocupado",
    !project.github?.readmeEvidence?.complete && "README ainda não demonstra problema, dados, método, validação, resultado e execução"
  ].filter(Boolean);
  const next = curation(project.curation,
    autoCandidate && !reasons.length ? "publish-site" : autoCandidate ? "review-replacement-or-evidence" : "maintain-current-decision",
    autoCandidate && !reasons.length ? "high" : autoCandidate ? "medium" : "n/a",
    reasons.length ? reasons : ["projeto publicado ou ainda não originado pela automação v2"]
  );
  if (JSON.stringify(project.curation) !== JSON.stringify(next)) {
    project.curation = next;
    changed += 1;
  }
}

if (!dryRun && changed) {
  await Promise.all([
    writeFile("data/certificates.json", `${JSON.stringify(certificateCatalog, null, 2)}\n`),
    writeFile("data/projects.json", `${JSON.stringify(projectCatalog, null, 2)}\n`)
  ]);
}

console.log(`${dryRun ? "Simulação" : "Curadoria"}: ${changed} decisão(ões) atualizada(s).`);
