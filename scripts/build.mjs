import { mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";

const [page, resume, hosting, projectsJson, certificatesJson] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("public/documents/curriculo-eduarda-reis.pdf"),
  readFile(".openai/hosting.json", "utf8"),
  readFile("data/projects.json", "utf8"),
  readFile("data/certificates.json", "utf8"),
]);

const projects = JSON.parse(projectsJson).projects ?? [];
const publicProjectsJson = JSON.stringify({ projects: projects
  .filter(project => project.status === "published")
  .map(({ id, title, category, categoryLabel, technologies, url, summary, linkLabel, image, imageAlt, status, displayOrder, presentation }) =>
    ({ id, title, category, categoryLabel, technologies, url, summary, linkLabel, image, imageAlt, status, displayOrder, presentation }))
});
const publicCertificatesJson = JSON.stringify({ certificates: (JSON.parse(certificatesJson).certificates ?? [])
  .filter(certificate => certificate.status === "published" && certificate.curation?.siteVisible !== false)
  .sort((a, b) => a.displayOrder - b.displayOrder)
  .slice(0, 8)
  .map(({ id, title, issuer, date, displayDate, status, displayOrder }) =>
    ({ id, title, issuer, date, displayDate, status, displayOrder }))
});
const resumeRevision = createHash("sha256").update(resume).digest("hex").slice(0, 12);
const renderedPage = page.replaceAll(
  "./public/documents/curriculo-eduarda-reis.pdf",
  `./public/documents/curriculo-eduarda-reis.pdf?v=${resumeRevision}`,
);
const projectImageEntries = await Promise.all(
  projects
    .filter(project => project.status === "published" && project.image)
    .map(async project => {
      const assetPath = project.image.replace(/^\.?\//, "");
      const extension = assetPath.split(".").pop()?.toLowerCase();
      const contentType = extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";
      return [
        `/${assetPath}`,
        {
          base64: Buffer.from(await readFile(assetPath)).toString("base64"),
          contentType
        }
      ];
    })
);
const assetTypes = { css: "text/css; charset=utf-8", js: "text/javascript; charset=utf-8", woff2: "font/woff2" };
const interfaceAssets = [];
for (const folder of ["styles", "scripts", "fonts"]) {
  const directory = `public/${folder}`;
  const files = await readdir(directory, { withFileTypes: true }).catch(error => {
    if (error.code === "ENOENT" && folder === "fonts") return [];
    throw error;
  });
  for (const file of files) {
    const contentType = assetTypes[file.name.split(".").pop()];
    if (!file.isFile() || !contentType) continue;
    const path = `${directory}/${file.name}`;
    interfaceAssets.push([`/${path}`, {
      base64: (await readFile(path)).toString("base64"),
      contentType
    }]);
  }
}

if (process.argv.includes("--pages")) {
  // Use a fresh directory so previous builds cannot leave files in the artifact.
  await mkdir("dist", { recursive: true });
  const output = await mkdtemp(join("dist", "pages-"));
  const files = [
    ["/index.html", renderedPage],
    ["/data/projects.json", publicProjectsJson],
    ["/data/certificates.json", publicCertificatesJson],
    ["/public/documents/curriculo-eduarda-reis.pdf", resume],
    ...[...projectImageEntries, ...interfaceAssets].map(([path, asset]) => [path, Buffer.from(asset.base64, "base64")]),
  ];
  await Promise.all(files.map(async ([path, contents]) => {
    const dest = join(output, path.slice(1));
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, contents);
  }));
  console.log(output);
  process.exit(0);
}

await Promise.all([
  mkdir("dist/server", { recursive: true }),
  mkdir("dist/.openai", { recursive: true }),
]);

const worker = `const page = ${JSON.stringify(renderedPage)};
const resumeBase64 = ${JSON.stringify(Buffer.from(resume).toString("base64"))};
const projectsJson = ${JSON.stringify(publicProjectsJson)};
const certificatesJson = ${JSON.stringify(publicCertificatesJson)};
const projectImages = ${JSON.stringify(Object.fromEntries(projectImageEntries))};
const interfaceAssets = ${JSON.stringify(Object.fromEntries(interfaceAssets))};

function bytesFromBase64(value) {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0));
}

export default {
  fetch(request) {
    const url = new URL(request.url);
    const asset = Object.hasOwn(interfaceAssets, url.pathname) && interfaceAssets[url.pathname];
    if (asset) {
      return new Response(bytesFromBase64(asset.base64), {
        headers: { "content-type": asset.contentType, "cache-control": "no-cache" }
      });
    }
    if (url.pathname === "/data/projects.json") {
      return new Response(projectsJson, {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "public, max-age=300",
        },
      });
    }
    if (url.pathname === "/data/certificates.json") {
      return new Response(certificatesJson, {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "public, max-age=300",
        },
      });
    }
    if (url.pathname === "/curriculo-eduarda-reis.pdf" || url.pathname === "/documents/curriculo-eduarda-reis.pdf" || url.pathname === "/public/documents/curriculo-eduarda-reis.pdf") {
      return new Response(bytesFromBase64(resumeBase64), {
        headers: {
          "content-type": "application/pdf",
          "content-disposition": "inline; filename=curriculo-eduarda-reis.pdf",
          "cache-control": "no-cache, max-age=0, must-revalidate",
        },
      });
    }
    if (url.pathname === "/eduarda-reis-noite-lunar.jpg" || url.pathname === "/images/eduarda-reis-noite-lunar.jpg" || url.pathname === "/public/images/eduarda-reis-noite-lunar.jpg") {
      return new Response("Página não encontrada", { status: 404 });
    }
    const projectImage = Object.hasOwn(projectImages, url.pathname) && projectImages[url.pathname];
    if (projectImage) {
      return new Response(bytesFromBase64(projectImage.base64), {
        headers: {
          "content-type": projectImage.contentType,
          "cache-control": "public, max-age=31536000, immutable",
        },
      });
    }
    if (["/public/styles/", "/public/scripts/", "/public/fonts/"].some(prefix => url.pathname.startsWith(prefix))) {
      return new Response("Página não encontrada", { status: 404 });
    }
    return new Response(page, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-cache, max-age=0, must-revalidate",
      },
    });
  },
};
`;

await Promise.all([
  writeFile("dist/server/index.js", worker),
  writeFile("dist/.openai/hosting.json", hosting),
]);
