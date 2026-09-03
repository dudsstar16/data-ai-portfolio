import { readFile, writeFile } from "node:fs/promises";

const catalogPath = "data/projects.json";
const githubUser = "dudsstar16";
const dryRun = process.argv.includes("--dry-run");

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeUrl(value) {
  return String(value ?? "").replace(/\/$/, "").toLowerCase();
}

async function fetchRepositories() {
  const repositories = [];
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-duds-content-sync",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  for (let page = 1; ; page += 1) {
    const response = await fetch(
      `https://api.github.com/users/${githubUser}/repos?per_page=100&sort=updated&page=${page}`,
      { headers }
    );
    if (!response.ok) {
      throw new Error(`GitHub API respondeu ${response.status}: ${await response.text()}`);
    }
    const batch = await response.json();
    repositories.push(...batch);
    if (batch.length < 100) break;
  }

  return repositories.filter(repository => !repository.fork && !repository.archived);
}

async function fetchReadmeEvidence(repository) {
  const headers = { Accept: "application/vnd.github.raw+json", "User-Agent": "portfolio-duds-content-sync" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`https://api.github.com/repos/${githubUser}/${repository.name}/readme`, { headers });
  if (!response.ok) return { complete: false, checkedAt: new Date().toISOString(), signals: [] };
  const text = (await response.text()).toLowerCase();
  const signals = [
    ["problem", /problema|objetivo|contexto/],
    ["data", /dados|dataset|csv|excel|sql/],
    ["method", /metodo|metodologia|etl|analise|anÃ¡lise|modelagem/],
    ["validation", /validacao|validaÃ§Ã£o|teste|qualidade/],
    ["result", /resultado|insight|conclusao|conclusÃ£o/],
    ["run", /instala|como executar|how to run|npm run|python/]
  ].filter(([, expression]) => expression.test(text)).map(([signal]) => signal);
  return { complete: signals.length === 6, checkedAt: new Date().toISOString(), signals };
}

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const projects = Array.isArray(catalog.projects) ? catalog.projects : [];
const knownUrls = new Set(projects.map(project => normalizeUrl(project.url)));
const usedIds = new Set(projects.map(project => project.id));
const repositories = await fetchRepositories();
let added = 0;

for (const repository of repositories) {
  if (knownUrls.has(normalizeUrl(repository.html_url))) continue;
  const baseId = slugify(repository.name) || `github-${repository.id}`;
  let id = baseId;
  if (usedIds.has(id)) id = `${baseId}-${repository.id}`;
  usedIds.add(id);

  const readmeEvidence = await fetchReadmeEvidence(repository);
  projects.push({
    id,
    title: repository.name,
    category: "review",
    categoryLabel: "Revisar",
    technologies: repository.language ? [repository.language] : [],
    url: repository.html_url,
    summary: repository.description?.trim() || "Descrição de apresentação pendente de revisão.",
    linkLabel: "Ver repositório",
    image: null,
    imageAlt: null,
    status: "review",
    displayOrder: null,
    github: {
      repositoryId: repository.id,
      defaultBranch: repository.default_branch,
      createdAt: repository.created_at,
      updatedAt: repository.updated_at,
      readmeEvidence
    },
    automation: {
      discoveredBy: "github-sync-v2",
      discoveredAt: new Date().toISOString()
    }
  });
  knownUrls.add(normalizeUrl(repository.html_url));
  added += 1;
}

catalog.schemaVersion = 2;
catalog.projects = projects;

if (!dryRun && added) {
  await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
}

console.log(
  dryRun
    ? `Simulação: ${added} repositório(s) novo(s) entrariam como revisão.`
    : `Catálogo atualizado: ${added} repositório(s) novo(s) em revisão.`
);
