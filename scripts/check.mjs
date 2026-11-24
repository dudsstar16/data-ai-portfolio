import { access, readFile, readdir } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "public/documents/curriculo-eduarda-reis.pdf",
  "data/projects.json",
  "data/certificates.json",
  "data/career-profile.json",
  ".agents/skills/data-analyst-career-advisor/SKILL.md",
  ".agents/skills/portfolio-content-maintainer/SKILL.md",
  ".agents/skills/controle-execucao-eficiente/SKILL.md",
  "public/styles/portfolio.css",
  "public/scripts/portfolio.js",
  "public/scripts/sculpture.js",
  "curriculo/04-revisao/painel-profissional.md",
  "curriculo/04-revisao/diagnostico-curricular.md",
  "curriculo/03-layout/curriculo-analista-de-dados.html",
  "curriculo/02-fonte/curriculo-analista-de-dados.md",
  "curriculo/07-linkedin/perfil-linkedin.md",
  "memoria/README.md",
  "memoria/contexto-rapido.md",
  "memoria/historico-ajustes.md",
];

for (const file of requiredFiles) {
  await access(file);
}

const [page, resume, source, catalogFile, certificatesFile, client, instructions] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("public/documents/curriculo-eduarda-reis.pdf"),
  readFile("curriculo/02-fonte/curriculo-analista-de-dados.md", "utf8"),
  readFile("data/projects.json", "utf8"),
  readFile("data/certificates.json", "utf8"),
  readFile("public/scripts/portfolio.js", "utf8"),
  readFile("AGENTS.md", "utf8"),
]);

const failures = [];
let projectCatalog;
let certificateCatalog;

try {
  projectCatalog = JSON.parse(catalogFile);
} catch {
  failures.push("data/projects.json deve conter JSON válido.");
}

try {
  certificateCatalog = JSON.parse(certificatesFile);
} catch {
  failures.push("data/certificates.json deve conter JSON válido.");
}

if (!page.includes("./public/documents/curriculo-eduarda-reis.pdf")) {
  failures.push("index.html deve referenciar o currículo público estável.");
}

if (!resume.subarray(0, 4).equals(Buffer.from("%PDF"))) {
  failures.push("O currículo público não é um PDF válido.");
}

if (/\[(?:X|Y|resultado verificável)\]/i.test(source)) {
  failures.push("A fonte final do currículo ainda contém placeholders.");
}

if (!Array.isArray(projectCatalog?.projects) || !projectCatalog.projects.length) {
  failures.push("O catálogo de projetos deve conter ao menos um projeto.");
} else {
  const ids = new Set();
  const featuredOrders = [];
  if (projectCatalog.schemaVersion !== 3) failures.push("O catálogo de projetos deve usar schemaVersion 3.");
  for (const project of projectCatalog.projects) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id ?? "")) {
      failures.push(`ID de projeto inválido: ${project.id ?? "ausente"}.`);
      continue;
    }
    if (ids.has(project.id)) failures.push(`ID de projeto duplicado: ${project.id}.`);
    ids.add(project.id);
    if (!["published", "review"].includes(project.status)) {
      failures.push(`Status inválido no projeto ${project.id}.`);
    }
    if (project.status === "published" && (!project.title || !project.categoryLabel || !project.url || !project.summary)) {
      failures.push(`Projeto publicado incompleto: ${project.id}.`);
    }
    if (project.image && !project.imageAlt) {
      failures.push(`Projeto ${project.id} possui imagem sem texto alternativo.`);
    }
    if (project.presentation?.featured) {
      const { caseStudy, featuredOrder } = project.presentation;
      featuredOrders.push(featuredOrder);
      if (project.status !== "published" || !["challenge", "approach", "deliverables"].every(field => typeof caseStudy?.[field] === "string" && caseStudy[field].trim())) {
        failures.push(`Case destacado incompleto: ${project.id}.`);
      }
    }
  }
  if (featuredOrders.sort().join(",") !== "1,2,3") failures.push("Defina três cases com ordem única de 1 a 3.");
}

if (!page.includes('id="projects"') || !page.includes('id="certificate-grid"')) {
  failures.push("index.html deve conter os destinos de renderização dos catálogos.");
}

if (!client.includes("certificate.curation?.siteVisible !== false")) {
  failures.push("O site deve respeitar a seleção curada de certificados.");
}
if (!["dudsstar16/data-ai-portfolio", "memoria/contexto-rapido.md", "memoria/historico-ajustes.md", "controle-execucao-eficiente"].every(reference => instructions.includes(reference))) {
  failures.push("AGENTS.md deve apontar para o repositório, a memória local e a skill de controle de execução.");
}

if (!Array.isArray(certificateCatalog?.certificates) || !certificateCatalog.certificates.length) {
  failures.push("O catálogo de certificados deve conter ao menos um certificado.");
} else {
  const ids = new Set();
  const files = new Set(await readdir("curriculo/06-certificados"));
  for (const certificate of certificateCatalog.certificates) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(certificate.id ?? "")) {
      failures.push(`ID de certificado inválido: ${certificate.id ?? "ausente"}.`);
      continue;
    }
    if (ids.has(certificate.id)) failures.push(`ID de certificado duplicado: ${certificate.id}.`);
    ids.add(certificate.id);
    if (!["published", "review"].includes(certificate.status)) {
      failures.push(`Status inválido no certificado ${certificate.id}.`);
    }
    if (!files.has(certificate.sourceFile)) {
      failures.push(`PDF não encontrado para o certificado ${certificate.id}.`);
    }
    if (certificate.status === "published" && (!certificate.title || !certificate.issuer || !certificate.date)) {
      failures.push(`Certificado publicado incompleto: ${certificate.id}.`);
    }
    if (certificate.durationHours != null && (!Number.isFinite(certificate.durationHours) || certificate.durationHours <= 0)) {
      failures.push(`Carga horária inválida no certificado ${certificate.id}.`);
    }
    if (certificate.curation && !["rules-v1", "human"].includes(certificate.curation.reviewer)) {
      failures.push(`Responsável de curadoria inválido: ${certificate.id}.`);
    }
  }
}

if (failures.length) {
  throw new Error(`Falha de validação:\n- ${failures.join("\n- ")}`);
}

console.log("Verificações concluídas: fontes, currículo público e referências essenciais estão consistentes.");
