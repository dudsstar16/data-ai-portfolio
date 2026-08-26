import { mkdir, readFile, writeFile } from "node:fs/promises";

const [page, hosting] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile(".openai/hosting.json", "utf8"),
]);

await Promise.all([
  mkdir("dist/server", { recursive: true }),
  mkdir("dist/.openai", { recursive: true }),
]);

const worker = `const page = ${JSON.stringify(page)};

export default {
  fetch() {
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
