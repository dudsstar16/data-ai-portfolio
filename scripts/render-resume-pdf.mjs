import { access, mkdir, readFile, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const input = path.resolve("curriculo/03-layout/curriculo-analista-de-dados.html");
const output = path.resolve("public/documents/curriculo-eduarda-reis.pdf");
const candidates = process.platform === "win32"
  ? [process.env.CHROME_PATH, "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"]
  : [process.env.CHROME_PATH, "google-chrome", "chromium", "chromium-browser"];

async function pickBrowser() {
  for (const candidate of candidates.filter(Boolean)) {
    if (!candidate.includes(path.sep)) return candidate;
    try {
      await access(candidate);
      return candidate;
    } catch { /* try next */ }
  }
  throw new Error("Chrome ou Edge não encontrado. Defina CHROME_PATH para gerar o PDF.");
}

const browser = await pickBrowser();
await mkdir(path.dirname(output), { recursive: true });
const userDataDirectory = path.resolve("tmp/chrome-resume-render-profile");
await mkdir(userDataDirectory, { recursive: true });
const args = ["--headless=new", "--disable-gpu", "--disable-software-rasterizer", "--use-angle=swiftshader", `--user-data-dir=${userDataDirectory}`, "--no-pdf-header-footer", "--print-to-pdf-no-header", `--print-to-pdf=${output}`, pathToFileURL(input).href];
await new Promise((resolve, reject) => {
  const child = spawn(browser, args, { stdio: "inherit" });
  child.on("error", reject);
  child.on("exit", code => code === 0 ? resolve() : reject(new Error(`Navegador encerrou com código ${code}.`)));
});
const generated = await stat(output);
if (generated.size < 20_000) throw new Error("PDF gerado parece incompleto.");
const bytes = await readFile(output);
const task = getDocument({ data: new Uint8Array(bytes) });
const pdf = await task.promise;
if (pdf.numPages !== 2) throw new Error(`O currículo deve ter duas páginas; foram geradas ${pdf.numPages}.`);
await task.destroy();
console.log(`PDF do currículo atualizado (${generated.size} bytes).`);
