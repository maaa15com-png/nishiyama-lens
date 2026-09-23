import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import images from "../src/lib/media/spot-images.json" with { type: "json" };
import { seedSpotImages } from "../prisma/spot-images.mts";
import { fixtureDatabase } from "./helpers/issue-47-db.mjs";
const require = createRequire(import.meta.url);
function load(file, spot) {
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const context = { exports: {}, URL, URLSearchParams, Date, require(name) {
    if (name === "next/image") return { __esModule: true, default: props => { const p = { ...props }; delete p.unoptimized; return React.createElement("img", p); } };
    if (name === "next/link") return { __esModule: true, default: props => React.createElement("a", props) };
    if (name === "next/navigation") return { notFound: () => { throw Error("NOT_FOUND"); } };
    if (name === "@/lib/server/spot-detail") return { getSpotDetail: async () => spot };
    if (name === "@/lib/server/course-detail") return { getCourseDetail: async () => null };
    if (name === "@/lib/server/todays-find") return { getTodaysFinds: async () => [] };
    if (name === "@/components/find/FindCamera") return { __esModule: true, default: () => null };
    if (name.endsWith(".json")) return JSON.parse(fs.readFileSync(path.resolve(path.dirname(file), name), "utf8"));
    if (name.startsWith("@/")) return load("src/" + name.slice(2) + (name.includes("components/") ? ".tsx" : ".ts"), spot);
    if (name.startsWith(".")) return load(path.resolve(path.dirname(file), name + ".ts"), spot);
    return require(name);
  } };
  vm.runInNewContext(code, context); return context.exports;
}
const imageComponent = load("src/components/spots/SpotImage.tsx").default;
const renderImage = props => renderToStaticMarkup(React.createElement(imageComponent, props));

test("licensed assets exist with matching hashes, dimensions and provenance", async () => {
  const sharp = require("sharp");
  assert.equal(new Set(images.map(x => x.imagePath)).size, images.length);
  for (const image of images) {
    const bytes = fs.readFileSync("public" + image.imagePath);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), image.sha256);
    const size = await sharp(bytes).metadata();
    assert.equal(size.width, image.width); assert.equal(size.height, image.height);
    assert.equal(image.license, "CC BY 2.1 JP");
    for (const key of ["sourceUrl", "originalUrl", "datasetUrl", "licenseUrl"]) assert.equal(new URL(image[key]).protocol, "https:");
    assert.ok(image.alt && image.title && image.attribution && image.modification);
  }
});
test("seed only attaches approved images, preserves other fields and is idempotent", async () => {
  const rows = images.map(x => ({ id: x.spotId, slug: x.slug, imageUrl: null, name: "keep", isPublished: false, updatedAt: "old" }));
  rows.push({ id: "other", imageUrl: "https://example.com/keep.jpg" });
  const db = fixtureDatabase({ Spot: rows, Course: [{ id: "keep" }] });
  assert.deepEqual(await seedSpotImages(db), { inserted: 0, updated: images.length, skipped: 0 });
  for (const row of rows) assert.deepEqual(db.rows().Spot.find(x => x.id === row.id), { ...row, imageUrl: images.find(x => x.spotId === row.id)?.imagePath ?? row.imageUrl });
  const after = structuredClone(db.rows());
  assert.deepEqual(await seedSpotImages(db), { inserted: 0, updated: 0, skipped: images.length });
  assert.deepEqual(db.rows(), after);
});
test("identity mismatch, missing target or existing editorial image rolls back all updates", async () => {
  for (const patch of [{ slug: "different" }, { imageUrl: "https://example.com/editorial.jpg" }, null]) {
    const rows = images.map(x => ({ id: x.spotId, slug: x.slug, imageUrl: null }));
    if (patch) Object.assign(rows[1], patch); else rows.pop();
    const db = fixtureDatabase({ Spot: rows });
    await assert.rejects(seedSpotImages(db)); assert.deepEqual(db.rows().Spot, rows);
  }
});
test("image UI provides specific alt, linked title/credit/license, modification and representative notice", () => {
  for (const image of images) {
    const html = renderImage({ slug: image.slug, name: "Spot", imageUrl: image.imagePath });
    for (const text of [image.alt, image.sourceUrl, image.licenseUrl, image.title, image.attribution, image.modification, "代表イメージ"]) assert.ok(html.includes(text));
    assert.match(html, /loading="lazy"/); assert.match(html, /focus-visible/);
  }
});
test("null, unsafe URLs and unmatched local images do not create empty or misattributed images", () => {
  for (const imageUrl of [null, "javascript:alert(1)", "/images/unapproved.jpg", images[0].imagePath]) assert.equal(renderImage({ slug: "different", name: "Spot", imageUrl }), "");
  const legacy = renderImage({ slug: "legacy", name: "Original", imageUrl: "https://example.com/old.jpg" });
  assert.match(legacy, /alt="Original"/); assert.doesNotMatch(legacy, /CC BY/);
});
test("actual Spot detail renders licensed and absent images without losing description or language query", async () => {
  for (const imageUrl of [images[0].imagePath, null]) {
    const spot = { slug: images[0].slug, name: "西山公園のツツジ", description: "既存説明", category: "FLOWER", imageUrl, externalUrl: "https://www.fuku-e.com/spot/detail_1536.html", redPandas: [] };
    const page = load("src/app/spots/[slug]/page.tsx", spot).default;
    const html = renderToStaticMarkup(await page({ params: Promise.resolve({ slug: spot.slug }), searchParams: Promise.resolve({ lang: "en", companion: "FAMILY" }) }));
    assert.match(html, /既存説明/); assert.match(html, /companion=FAMILY/); assert.match(html, /lang=en/);
    assert.equal(html.includes("<figure"), imageUrl !== null);
  }
});

test("zoo image has archive provenance and an exhibition notice, not bloom status", () => {
  const image = images.find(x => x.slug === "nishiyama-zoo");
  assert.equal(image.spotId, "39ad31f0-58be-40d6-90c9-ea52e1a84b7d");
  assert.equal(image.individualImageUrl, null);
  assert.ok(image.archiveMember.endsWith("アケビ３.jpg") && image.archiveSha256.length === 64);
  const html = renderImage({ slug: image.slug, name: "西山動物園", imageUrl: image.imagePath });
  assert.match(html, /現在の展示状況/); assert.doesNotMatch(html, /開花|紅葉状況/);
});
