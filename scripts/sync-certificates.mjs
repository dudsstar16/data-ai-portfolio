import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { extractCertificateMetadata } from "./extract-certificate-metadata.mjs";
import { slugify } from "./lib/content-curation.mjs";

const catalogPath = "data/certificates.json";
const certificatesDirectory = "curriculo/06-certificados";
const dryRun = process.argv.includes("--dry-run");

function titleFromFilename(filename) {
  return path
    .basename(filename, path.extname(filename))
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const certificates = Array.isArray(catalog.certificates) ? catalog.certificates : [];
const bySourceFile = new Map(certificates.map(certificate => [certificate.sourceFile, certificate]));
const usedIds = new Set(certificates.map(certificate => certificate.id));
const files = (await readdir(certificatesDirectory))
  .filter(filename => filename.toLowerCase().endsWith(".pdf"))
  .sort((a, b) => a.localeCompare(b, "pt-BR"));

let added = 0;
let refreshed = 0;

for (const filename of files) {
  const bytes = await readFile(path.join(certificatesDirectory, filename));
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const existing = bySourceFile.get(filename);

  if (existing) {
    if (existing.sha256 !== sha256) {
      existing.sha256 = sha256;
      refreshed += 1;
    }
    continue;
  }

  const baseId = slugify(titleFromFilename(filename)) || `certificado-${sha256.slice(0, 8)}`;
  let id = baseId;
  if (usedIds.has(id)) id = `${baseId}-${sha256.slice(0, 8)}`;
  usedIds.add(id);

  let extracted = null;
  try {
    extracted = await extractCertificateMetadata(path.join(certificatesDirectory, filename), filename);
  } catch (error) {
    console.warn(`NÃ£o foi possÃ­vel extrair metadados de ${filename}: ${error.message}`);
  }

  certificates.push({
    id,
    title: titleFromFilename(filename),
    issuer: extracted?.issuer ?? null,
    date: extracted?.date ?? null,
    displayDate: extracted?.displayDate ?? null,
    durationHours: extracted?.durationHours ?? null,
    sourceFile: filename,
    sha256,
    status: "review",
    displayOrder: null,
    automation: {
      discoveredBy: "certificate-ingestion-v1",
      discoveredAt: new Date().toISOString(),
      evidence: extracted?.evidence ?? { textExtracted: false, titleEvidence: false, sourcePages: 0 }
    }
  });
  added += 1;
}

catalog.schemaVersion = 1;
catalog.certificates = certificates;

if (!dryRun && (added || refreshed)) {
  await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
}

console.log(
  dryRun
    ? `Simulação: ${added} certificado(s) novo(s) e ${refreshed} hash(es) a atualizar.`
    : `Catálogo atualizado: ${added} certificado(s) novo(s), ${refreshed} hash(es) atualizado(s).`
);
