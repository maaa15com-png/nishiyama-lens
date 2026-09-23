import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import images from "../../src/lib/media/spot-images.json" with { type: "json" };
import { fixtureDatabase, serverModules } from "./issue-47-db.mjs";
const require = createRequire(import.meta.url);
export const fixtures = () => ({
  Season: [
    { id: "cherry", slug: "spring-cherry-blossoms", name: "春の桜", nameEn: null, startMonth: 4, startDay: 1, endMonth: 4, endDay: 10, isPublished: true },
    { id: "azalea", slug: "spring-azaleas", name: "春のツツジ", nameEn: "Spring Azaleas", startMonth: 5, startDay: null, endMonth: 5, endDay: null, isPublished: true },
    { id: "autumn", slug: "autumn-leaves", name: "秋の紅葉", nameEn: "Autumn Leaves", startMonth: 11, startDay: null, endMonth: 11, endDay: null, isPublished: true },
  ],
  Lens: ["COUPLE", "FAMILY", "SOLO"].map(companion => ({ id: companion, companion, interest: "SEASON", name: companion + " × SEASON", description: "季節の景色を楽しむ。", descriptionEn: "Enjoy seasonal scenery.", isPublished: true })),
  Course: ["COUPLE", "FAMILY", "SOLO"].map(lensId => ({ id: lensId, lensId, durationType: "MINUTES_30_60", isPublished: true })),
  Spot: images.map(i => ({ id: i.spotId, slug: i.slug, imageUrl: i.imagePath, isPublished: true })),
});
export function recommendations(db) {
  return serverModules(db, { "./spot-images.json": { default: images } })("src/lib/server/todays-recommended-lenses.ts").getTodaysRecommendedLenses;
}
export async function seasonalFixture(at = "2026-05-10T00:00:00Z") {
  return recommendations(fixtureDatabase(fixtures()))(new Date(at));
}
export function loadUI(file, recommendation) {
  const context = { exports: {}, Date, URL, URLSearchParams, require(name) {
    if (name === "next/link") return { __esModule: true, default: props => React.createElement("a", props) };
    if (name === "next/image") return { __esModule: true, default: props => { const p = { ...props }; delete p.unoptimized; return React.createElement("img", p); } };
    if (name === "@/components/navigation/GlobalHeader") return { __esModule: true, default: () => React.createElement("header", {}, "GlobalHeader") };
    if (name === "@/lib/server/todays-recommended-lenses") return { getTodaysRecommendedLenses: async () => recommendation };
    if (name.endsWith(".module.css")) return { __esModule: true, default: {} };
    if (name.endsWith(".json")) return JSON.parse(fs.readFileSync(path.resolve(path.dirname(file), name), "utf8"));
    if (name.startsWith("@/")) return loadUI("src/" + name.slice(2) + (name.includes("components/") ? ".tsx" : ".ts"), recommendation);
    if (name.startsWith(".")) return loadUI(path.resolve(path.dirname(file), name + ".ts"), recommendation);
    return require(name);
  } };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
  return context.exports;
}
export function renderSection(recommendation, lang = "ja", query = {}) {
  return renderToStaticMarkup(React.createElement(loadUI("src/components/home/TodaysLenses.tsx").default, { recommendation, lang, query }));
}
