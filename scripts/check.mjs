import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "public/documents/curriculo-eduarda-reis.pdf",
  "public/images/eduarda-reis-noite-lunar.jpg",
  "data/projects.json",
  "curriculo/03-layout/curriculo-analista-de-dados.html",
  "curriculo/02-fonte/curriculo-analista-de-dados.md",
];

for (const file of requiredFiles) {
  await access(file);
}

const [page, resume, source, catalogFile] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("public/documents/curriculo-eduarda-reis.pdf"),
  readFile("curriculo/02-fonte/curriculo-analista-de-dados.md", "utf8"),
  readFile("data/projects.json", "utf8"),
]);

const failures = [];
let projectCatalog;

try {
  projectCatalog = JSON.parse(catalogFile);
} catch {
  failures.push("data/projects.json deve conter JSON válido.");
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
  for (const project of projectCatalog.projects) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id ?? "")) {
      failures.push(`ID de projeto inválido: ${project.id ?? "ausente"}.`);
      continue;
    }
    if (ids.has(project.id)) failures.push(`ID de projeto duplicado: ${project.id}.`);
    ids.add(project.id);
    if (!page.includes(`data-project-id="${project.id}"`)) {
      failures.push(`O cartão do projeto ${project.id} não possui o ID estruturado.`);
    }
    if (!page.includes(`href="${project.url}"`)) {
      failures.push(`O cartão do projeto ${project.id} não contém o link do catálogo.`);
    }
  }
}

if (failures.length) {
  throw new Error(`Falha de validação:\n- ${failures.join("\n- ")}`);
}

console.log("Verificações concluídas: fontes, currículo público e referências essenciais estão consistentes.");
