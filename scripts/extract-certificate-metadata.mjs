import path from "node:path";
import { readFile } from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { formatDate, normalize } from "./lib/content-curation.mjs";

function titleFromFilename(filename) {
  return path.basename(filename, path.extname(filename)).replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

const monthMap = {
  jan: "01", janeiro: "01",
  fev: "02", fevereiro: "02",
  mar: "03", marco: "03",
  abr: "04", abril: "04",
  mai: "05", maio: "05",
  jun: "06", junho: "06",
  jul: "07", julho: "07",
  ago: "08", agosto: "08",
  set: "09", setembro: "09",
  out: "10", outubro: "10",
  nov: "11", novembro: "11",
  dez: "12", dezembro: "12",
};

function isoDateFromText(text) {
  const fullMatch = text.match(/\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](20\d{2})\b/);
  if (fullMatch) {
    const [, day, month, year] = fullMatch;
    if (Number(month) <= 12 && Number(day) <= 31) {
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
  const shortMatch = text.match(/\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2})\b/);
  if (shortMatch) {
    const [, day, month, shortYear] = shortMatch;
    if (Number(month) <= 12 && Number(day) <= 31) {
      return `20${shortYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
  const normalized = normalize(text);
  const ptMonthMatch = normalized.match(/\b(\d{1,2})\s+de\s+(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(20\d{2})\b/);
  if (ptMonthMatch) {
    const [, day, monthName, year] = ptMonthMatch;
    return `${year}-${monthMap[monthName]}-${day.padStart(2, "0")}`;
  }
  const abbrMonthMatch = normalized.match(/\b(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\s+(\d{1,2})\s+(20\d{2})\b/);
  if (abbrMonthMatch) {
    const [, monthAbbr, day, year] = abbrMonthMatch;
    return `${year}-${monthMap[monthAbbr]}-${day.padStart(2, "0")}`;
  }
  return null;
}

function isoDateFromPdfCreationDate(creationDate) {
  if (!creationDate) return null;
  const match = String(creationDate).match(/D:(20\d{2})(\d{2})(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  return Number(month) <= 12 && Number(day) <= 31 ? `${year}-${month}-${day}` : null;
}

function issuerFromText(text, filename = "", pdfInfo = {}) {
  const combined = `${text} ${filename} ${pdfInfo?.Title ?? ""} ${pdfInfo?.Author ?? ""}`;
  const compact = combined.replace(/\b(?:[A-Za-z]\s+){3,}[A-Za-z]\b/g, match => match.replace(/\s+/g, ""));
  if (/\bLinkedIn\s*Learning\b/i.test(compact)) return "LinkedIn Learning";
  if (/\bHashtag\s*Treinamentos\b/i.test(compact)) return "Hashtag Treinamentos";
  if (/\bEscola\s*Virtual\b|\bFunda[cç][aã]o\s*Bradesco\b|\bPrintCertificateDownload\.ashx\b/i.test(compact)) return "Fundação Bradesco";
  if (/\bAlura\b|\bLearning\.Rocks\b/i.test(compact)) return "Alura";
  if (/\bDIO\b|\bDigital\s*Innovation\s*One\b/i.test(compact)) return "DIO";
  if (/\bMicrosoft\b/i.test(text)) return "Microsoft";
  if (/\bGoogle\b/i.test(text)) return "Google";
  if (/\bCoursera\b/i.test(compact)) return "Coursera";
  if (/\bDataCamp\b/i.test(compact)) return "DataCamp";
  if (/\bIBM\b/i.test(compact)) return "IBM";
  if (/\bUdemy\b/i.test(compact)) return "Udemy";
  if (/\bUnB\b|\bUniversidade\s+de\s+Bras[ií]lia\b/i.test(compact)) return "UnB";
  if (/\bCat[oó]lica\b|\bUBEC\b/i.test(compact)) return "UCB";
  if (/\bUniversidade\s*BRB\b/i.test(compact)) return "Universidade BRB";
  return null;
}

export async function extractCertificateMetadata(filePath, filename = path.basename(filePath)) {
  const bytes = await readFile(filePath);
  const task = getDocument({ data: new Uint8Array(bytes) });
  const document = await task.promise;
  const metadata = await document.getMetadata().catch(() => null);
  const pdfInfo = metadata?.info ?? {};
  const pages = [];
  for (let number = 1; number <= Math.min(document.numPages, 3); number += 1) {
    const page = await document.getPage(number);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => item.str).join(" "));
  }
  const text = pages.join(" ").replace(/\s+/g, " ").trim();
  const normalized = normalize(`${text} ${pdfInfo?.Title ?? ""}`);
  const durationMatch = text.match(/\b(\d+(?:[.,]\d+)?)\s*(?:horas?|hora\(s\)|h)\b/i);
  const title = titleFromFilename(filename);
  const titleTokens = normalize(title).split(" ").filter(token => token.length >= 4);
  const titleEvidence = titleTokens.length
    ? titleTokens.filter(token => normalized.includes(token)).length >= Math.min(2, titleTokens.length)
    : false;
  const date = isoDateFromText(text) ?? isoDateFromPdfCreationDate(pdfInfo?.CreationDate);

  await task.destroy();
  return {
    issuer: issuerFromText(text, filename, pdfInfo),
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
