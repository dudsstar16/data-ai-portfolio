import { mkdir, readFile, writeFile } from "node:fs/promises";

const [page, resume, portrait, hosting, projectsJson, certificatesJson] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("public/documents/curriculo-eduarda-reis.pdf"),
  readFile("public/images/eduarda-reis-noite-lunar.jpg"),
  readFile(".openai/hosting.json", "utf8"),
  readFile("data/projects.json", "utf8"),
  readFile("data/certificates.json", "utf8"),
]);

const projects = JSON.parse(projectsJson).projects ?? [];
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

await Promise.all([
  mkdir("dist/server", { recursive: true }),
  mkdir("dist/.openai", { recursive: true }),
]);

const worker = `const page = ${JSON.stringify(page)};
const resumeBase64 = ${JSON.stringify(Buffer.from(resume).toString("base64"))};
const portraitBase64 = ${JSON.stringify(Buffer.from(portrait).toString("base64"))};
const projectsJson = ${JSON.stringify(projectsJson)};
const certificatesJson = ${JSON.stringify(certificatesJson)};
const projectImages = ${JSON.stringify(Object.fromEntries(projectImageEntries))};

function bytesFromBase64(value) {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0));
}

export default {
  fetch(request) {
    const url = new URL(request.url);
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
          "cache-control": "public, max-age=3600",
        },
      });
    }
    if (url.pathname === "/eduarda-reis-noite-lunar.jpg" || url.pathname === "/images/eduarda-reis-noite-lunar.jpg" || url.pathname === "/public/images/eduarda-reis-noite-lunar.jpg") {
      return new Response(bytesFromBase64(portraitBase64), {
        headers: {
          "content-type": "image/jpeg",
          "cache-control": "public, max-age=31536000, immutable",
        },
      });
    }
    const projectImage = projectImages[url.pathname];
    if (projectImage) {
      return new Response(bytesFromBase64(projectImage.base64), {
        headers: {
          "content-type": projectImage.contentType,
          "cache-control": "public, max-age=31536000, immutable",
        },
      });
    }
    return new Response(page, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300",
      },
    });
  },
};
`;

await Promise.all([
  writeFile("dist/server/index.js", worker),
  writeFile("dist/.openai/hosting.json", hosting),
]);
