import path from "node:path";
import { readFile } from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { formatDate, normalize } from "./lib/content-curation.mjs";

function titleFromFilename(filename) {
  return path.basename(filename, path.extname(filename)).replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function isoDateFromText(text) {
  const match = text.match(/\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](20\d{2})\b/);
  if (!match) return null;
  const [, day, month, year] = match;
  const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return Number(month) <= 12 && Number(day) <= 31 ? date : null;
}

function issuerFromText(text) {
  if (/\bDIO\b/i.test(text)) return "DIO";
  if (/\bAlura\b/i.test(text)) return "Alura";
  if (/\bMicrosoft\b/i.test(text)) return "Microsoft";
  if (/\bGoogle\b/i.test(text)) return "Google";
  if (/\bCoursera\b/i.test(text)) return "Coursera";
  if (/\bDataCamp\b/i.test(text)) return "DataCamp";
  if (/\bIBM\b/i.test(text)) return "IBM";
  return null;
}

export async function extractCertificateMetadata(filePath, filename = path.basename(filePath)) {
  const bytes = await readFile(filePath);
  const task = getDocument({ data: new Uint8Array(bytes) });
  const document = await task.promise;
  const pages = [];
  for (let number = 1; number <= Math.min(document.numPages, 3); number += 1) {
    const page = await document.getPage(number);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => item.str).join(" "));
  }
  const text = pages.join(" ").replace(/\s+/g, " ").trim();
  const normalized = normalize(text);
  const durationMatch = text.match(/\b(\d+(?:[.,]\d+)?)\s*(?:horas?|h)\b/i);
  const title = titleFromFilename(filename);
  const titleTokens = normalize(title).split(" ").filter(token => token.length >= 4);
  const titleEvidence = titleTokens.length
    ? titleTokens.filter(token => normalized.includes(token)).length >= Math.min(2, titleTokens.length)
    : false;
  const date = isoDateFromText(text);

  await task.destroy();
  return {
    issuer: issuerFromText(text),
    date,
    displayDate: formatDate(date),
    durationHours: durationMatch ? Number(durationMatch[1].replace(",", ".")) : null,
    evidence: {
      textExtracted: Boolean(text),
      titleEvidence,
      sourcePages: pages.length,
      checkedAt: new Date().toISOString()
    }
  };
}
