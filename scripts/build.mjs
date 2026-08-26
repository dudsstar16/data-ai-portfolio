import { mkdir, readFile, writeFile } from "node:fs/promises";

const [page, resume, portrait, hosting] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("public/curriculo-eduarda-reis.pdf"),
  readFile("public/eduarda-reis-noite-lunar.jpg"),
  readFile(".openai/hosting.json", "utf8"),
]);

await Promise.all([
  mkdir("dist/server", { recursive: true }),
  mkdir("dist/.openai", { recursive: true }),
]);

const worker = `const page = ${JSON.stringify(page)};
const resumeBase64 = ${JSON.stringify(Buffer.from(resume).toString("base64"))};
const portraitBase64 = ${JSON.stringify(Buffer.from(portrait).toString("base64"))};

function resumeBytes() {
  return Uint8Array.from(atob(resumeBase64), character => character.charCodeAt(0));
}

function portraitBytes() {
  return Uint8Array.from(atob(portraitBase64), character => character.charCodeAt(0));
}

export default {
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/curriculo-eduarda-reis.pdf" || url.pathname === "/public/curriculo-eduarda-reis.pdf") {
      return new Response(resumeBytes(), {
        headers: {
          "content-type": "application/pdf",
          "content-disposition": "inline; filename=curriculo-eduarda-reis.pdf",
          "cache-control": "public, max-age=3600",
        },
      });
    }
    if (url.pathname === "/eduarda-reis-noite-lunar.jpg" || url.pathname === "/public/eduarda-reis-noite-lunar.jpg") {
      return new Response(portraitBytes(), {
        headers: {
          "content-type": "image/jpeg",
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
