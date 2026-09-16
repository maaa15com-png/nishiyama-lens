import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as language from "../src/lib/language.ts";

const require = createRequire(import.meta.url);
const code = ts.transpileModule(readFileSync(new URL("../src/components/navigation/GlobalHeader.tsx", import.meta.url), "utf8"), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const context = { exports: {}, require(name) {
  if (name.endsWith(".module.css")) return { __esModule: true, default: {} };
  if (name === "@/lib/language") return language;
  if (name === "next/link") return { __esModule: true, default: ({ children, ...props }) => { delete props.scroll; return React.createElement("a", props, children); } };
  return require(name);
} };
vm.runInNewContext(code, context);
const Header = context.exports.default;
const render = (path, lang = "en") => renderToStaticMarkup(React.createElement(Header, { path, lang, query: { lang, tag: ["a", "b"], courseId: "course" } }));

test("translated pages switch language on the current path and preserve repeated query", () => {
  for (const path of ["/", "/park", "/news", "/events", "/news/id", "/events/id"]) {
    for (const lang of ["ja", "en"]) {
      const html = render(path, lang);
      assert.match(html, new RegExp('href="' + path + '\\?tag=a&amp;tag=b&amp;courseId=course&amp;lang=' + (lang === "en" ? "ja" : "en") + '"'));
      assert.match(html, /aria-label="(?:Current language|現在の表示言語)/);
      assert.doesNotMatch(html.split("<nav")[0], /Open English Guide/);
    }
  }
});
test("Japanese-only pages leave the right cell empty and offer the guide inside the menu", () => {
  for (const path of ["/lens", "/lens/result", "/courses/id", "/map", "/spots/slug", "/recap"]) {
    for (const lang of ["ja", "en"]) {
      const html = render(path, lang);
      assert.match(html, /href="\/park\?tag=a&amp;tag=b&amp;courseId=course&amp;lang=en" lang="en" aria-label="Open English Guide/);
      assert.doesNotMatch(html.split("<nav")[0], /Open English Guide|GUIDE/);
      assert.equal((html.split("<nav")[0].match(/<a /g) ?? []).length, 1);
      assert.match(html.split("<nav")[1], /Open English Guide/);
      assert.match(html, /main content is available in Japanese only/);
      assert.match(html, /aria-controls="global-navigation"/);
      assert.match(html, /aria-expanded="false"/);
      assert.doesNotMatch(html, /Current language:|現在の表示言語/);
      assert.match(html, /LENS quiz .* Japanese only/);
    }
  }
});
test("current link is exact page, ancestor location, or absent for contextual routes", () => {
  for (const path of ["/", "/lens", "/park", "/news", "/events"]) {
    const html = render(path);
    assert.equal((html.match(/aria-current=/g) ?? []).length, 1);
    assert.match(html, new RegExp('href="' + path + '\\?[^"]+" aria-current="page"'));
  }
  for (const [path, parent] of [["/lens/result", "/lens"], ["/news/id", "/news"], ["/events/id", "/events"]]) {
    assert.match(render(path), new RegExp('href="' + parent + '\\?[^"]+" aria-current="location"'));
  }
  for (const path of ["/courses/id", "/map", "/spots/slug", "/recap"]) assert.doesNotMatch(render(path), /aria-current=/);
});
test("destination IDs and answers win while source language and repeated parameters survive", () => {
  const source = { courseId: "old", companion: "SOLO", interest: "PHOTO", lang: "en", tag: ["a", "b"] };
  const href = language.navigationHref("/map?courseId=new#map", source);
  const url = new URL(href, "http://localhost");
  assert.equal(url.pathname, "/map");
  assert.equal(url.searchParams.get("courseId"), "new");
  assert.equal(url.searchParams.get("companion"), "SOLO");
  assert.equal(url.searchParams.get("interest"), "PHOTO");
  assert.equal(url.searchParams.get("lang"), "en");
  assert.deepEqual(url.searchParams.getAll("tag"), ["a", "b"]);
  assert.equal(url.hash, "#map");
  const result = new URL(language.navigationHref("/lens/result?companion=FAMILY&interest=PANDA", source), "http://localhost");
  assert.equal(result.searchParams.get("companion"), "FAMILY");
  assert.equal(result.searchParams.get("interest"), "PANDA");
  assert.deepEqual(source.tag, ["a", "b"]);
});
