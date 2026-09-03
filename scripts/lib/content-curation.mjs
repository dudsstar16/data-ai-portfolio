import { createHash } from "node:crypto";

export function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(value) {
  return normalize(value).replace(/\s+/g, "-");
}

export function formatDate(date) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function scoreItem(item, pillars) {
  const searchable = normalize([
    item.title,
    item.summary,
    item.category,
    item.categoryLabel,
    ...(item.technologies ?? [])
  ].join(" "));
  const matches = pillars.filter(pillar =>
    pillar.keywords.some(keyword => searchable.includes(normalize(keyword)))
  );
  return {
    score: matches.reduce((total, pillar) => total + pillar.weight, 0),
    pillars: matches.map(pillar => pillar.id)
  };
}

export function fingerprint(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function isRecognizedIssuer(issuer) {
  return ["alura", "dio", "microsoft", "google", "coursera", "datacamp", "ibm", "udemy", "universidade", "unb"]
    .some(name => normalize(issuer).includes(name));
}
