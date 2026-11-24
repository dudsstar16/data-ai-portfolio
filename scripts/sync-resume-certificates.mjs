import { readFile, writeFile } from "node:fs/promises";
import { scoreItem } from "./lib/content-curation.mjs";

const checkOnly = process.argv.includes("--check");
const catalog = JSON.parse(await readFile("data/certificates.json", "utf8"));
const profile = JSON.parse(await readFile("data/career-profile.json", "utf8"));

const selected = catalog.certificates
  .filter(certificate => certificate.status === "published" && certificate.curation?.siteVisible !== false)
  .map(certificate => ({ certificate, score: scoreItem(certificate, profile.competencyPillars).score }))
  .sort((left, right) =>
    right.score - left.score ||
    (right.certificate.durationHours ?? 0) - (left.certificate.durationHours ?? 0) ||
    (left.certificate.displayOrder ?? 999) - (right.certificate.displayOrder ?? 999) ||
    left.certificate.title.localeCompare(right.certificate.title, "pt-BR")
  )
  .slice(0, profile.selectionPolicy.resumeCertificateLimit)
  .map(entry => entry.certificate);

if (!selected.length) throw new Error("Não há certificados publicados para o currículo.");
const list = selected.map(certificate => certificate.title).join(" · ");

function replaceMarkedSection(source, replacement, filePath) {
  const pattern = /(<!-- certificates:start -->)([\s\S]*?)(<!-- certificates:end -->)/;
  if (!pattern.test(source)) throw new Error(`Marcadores de certificados ausentes em ${filePath}.`);
  return source.replace(pattern, `$1\n${replacement}\n$3`);
}

const markdownPath = "curriculo/02-fonte/curriculo-analista-de-dados.md";
const htmlPath = "curriculo/03-layout/curriculo-analista-de-dados.html";
const [markdown, html] = await Promise.all([readFile(markdownPath, "utf8"), readFile(htmlPath, "utf8")]);
const nextMarkdown = replaceMarkedSection(markdown, list, markdownPath);
const nextHtml = replaceMarkedSection(html, `<p class="certification-list">${list}</p>`, htmlPath);

if (checkOnly) {
  const norm = s => String(s ?? "").replace(/\r\n/g, "\n");
  if (norm(markdown) !== norm(nextMarkdown) || norm(html) !== norm(nextHtml)) {
    throw new Error("Currículo fora de sincronia com os certificados selecionados. Rode: npm run resume:sync");
  }
  console.log("Currículo consistente com a seleção automatizada de certificados.");
} else {
  await Promise.all([writeFile(markdownPath, nextMarkdown), writeFile(htmlPath, nextHtml)]);
  console.log(`Currículo sincronizado com ${selected.length} certificado(s) selecionado(s).`);
}
