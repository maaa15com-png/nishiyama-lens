import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));
const id = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const date = { epochMilliseconds: Date.parse("2026-05-01T15:00:00Z"), toString: () => "2026-05-01T15:00:00Z" };
// Render the actual Server page/components against fixtures without inserting DB data.
function load(relative, data) {
  const filename = path.join(root, relative);
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const context = { exports: {}, URL, URLSearchParams, Intl, Date, require(name) {
    if (name === "next/link") return { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) };
    if (name === "next/navigation") return { notFound: () => { throw new Error("NOT_FOUND"); } };
    if (name === "@/lib/server/information") return {
      getNewsDetail: async () => data, getEventDetail: async () => data,
      getNews: async () => data, getEvents: async () => data,
    };
    if (name.startsWith("@/")) {
      const base = "src/" + name.slice(2);
      return load(base + (name.includes("components/") ? ".tsx" : ".ts"), data);
    }
    return require(name);
  } };
  vm.runInNewContext(compiled, context);
  return context.exports;
}
async function render(route, data, lang = "en") {
  const page = load(`src/app/${route}/page.tsx`, data).default;
  return renderToStaticMarkup(await page({ params: Promise.resolve({ id }), searchParams: Promise.resolve({ lang, courseId: "keep" }) }));
}
test("news detail renders English title, escaped Japanese body fallback and no invented date", async () => {
  const html = await render("news/[id]", { id, title: "題名", titleEn: "News title", body: "<script>alert(1)</script>", bodyEn: null, publishedAt: null });
  assert.match(html, /News title/);
  assert.match(html, /lang="ja">&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>|<time/);
  assert.match(html, /courseId=keep&amp;lang=en/);
});
test("event detail handles missing end, Japanese location fallback and safe external link", async () => {
  const html = await render("events/[id]", { id, title: "催し", titleEn: "Event title", description: "説明", descriptionEn: "Description", startAt: date, endAt: null, location: "会場", locationEn: null, externalUrl: "https://example.com/event" });
  assert.match(html, /2 May 2026/);
  assert.doesNotMatch(html, />Ends</);
  assert.match(html, /lang="ja">会場/);
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /opens in a new tab/);
});
test("unsafe event links are absent and missing records invoke notFound", async () => {
  const html = await render("events/[id]", { id, title: "Event", titleEn: null, description: "Text", descriptionEn: null, startAt: date, endAt: date, location: null, locationEn: null, externalUrl: "https://user:secret@example.com" });
  assert.doesNotMatch(html, /user:secret/);
  for (const route of ["news/[id]", "events/[id]"]) await assert.rejects(render(route, null), /NOT_FOUND/);
});
test("empty lists show their language-specific messages", async () => {
  assert.match(await render("news", []), /There is no news/);
  assert.match(await render("events", []), /There are no events listed/);
  assert.match(await render("news", [], "ja"), /現在お知らせはありません/);
});
