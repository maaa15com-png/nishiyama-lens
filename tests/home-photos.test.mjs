import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import images from "../src/lib/media/spot-images.json" with { type: "json" };
import generated from "../src/lib/media/home-generated-images.json" with { type: "json" };
import fs from "node:fs";
import { createHash } from "node:crypto";
import { loadUI } from "./helpers/todays-lenses.mjs";
const { getHomePhoto } = loadUI("src/lib/media/home-photos.ts");

test("Home photo placements use distinct generated pandas and official azalea metadata", () => {
  for (const [placement, slug] of [["animals", "generated-panda-bamboo"], ["seasons", "nishiyama-azaleas"], ["familyPanda", "generated-panda-walking"], ["play", "generated-woodland-playground"], ["walk", "generated-green-path"]]) {
    const photo = getHomePhoto(placement);
    assert.equal(JSON.stringify(photo.image), JSON.stringify([...images, ...generated].find(image => image.slug === slug)));
    assert.match(photo.objectPosition, /%/);
  }
});
test("Home photo credits match both assets and deduplicate repeated placements", () => {
  const Credits = loadUI("src/components/home/HomePhotoCredits.tsx").default;
  for (const lang of ["ja", "en"]) {
    const html = renderToStaticMarkup(React.createElement(Credits, { placements: ["animals", "seasons", "familyPanda"], lang }));
    assert.equal((html.match(/<li>/g) ?? []).length, 3);
    for (const slug of ["nishiyama-azaleas"]) {
      const image = images.find(i => i.slug === slug);
      assert.ok(html.includes(image.sourceUrl)); assert.ok(html.includes(image.licenseUrl));
      assert.ok(html.includes(image.title)); assert.ok(html.includes(image.modification));
    }
    assert.match(html, /focus-visible/);
    assert.match(html, lang === "en" ? /Representative images/ : /代表イメージ/);
  }
});
test("Home keeps four image cards, distinct sample panda and query-preserving CTA in JP/EN", async () => {
  const Home = loadUI("src/app/page.tsx", null).default;
  for (const lang of ["ja", "en"]) {
    const html = renderToStaticMarkup(await Home({ searchParams: Promise.resolve({ lang, foo: ["1", "2"] }) }));
    const cards = Array.from(html.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/g), m => m[1]);
    assert.equal(cards.length, 4);
    assert.match(cards[0], /data-home-photo="generated-panda-bamboo"/);
    assert.match(cards[1], /data-home-photo="nishiyama-azaleas"/);
    assert.match(cards[2], /data-home-photo="generated-woodland-playground"/);
    assert.match(cards[3], /data-home-photo="generated-green-path"/);
    assert.equal((html.match(/data-home-photo="generated-panda-bamboo"/g) ?? []).length, 1);
    assert.equal((html.match(/data-home-photo="generated-panda-walking"/g) ?? []).length, 1);
    assert.equal((html.match(/loading="lazy"/g) ?? []).length, 5);
    assert.ok(html.includes(generated.find(i => i.slug === "generated-panda-bamboo").alt));
    assert.match(html, /ONE LENS FOR YOU/); assert.match(html, /GlobalHeader/);
    assert.match(html, /foo=1&amp;foo=2/); assert.ok(html.includes("lang=" + lang));
  }
});

test("Generated assets retain provenance and hashes without official licenses or Seed identities", () => {
  assert.equal(generated.length, 5);
  for (const image of generated) {
    assert.equal(image.kind, "generated");
    assert.equal(image.license, null);
    assert.equal(image.sourceUrl, null);
    assert.equal(image.spotId, undefined);
    assert.ok(Math.max(image.width, image.height) <= 1600);
    assert.match(image.alt, /生成イメージ/);
    assert.equal(createHash("sha256").update(fs.readFileSync("public" + image.imagePath)).digest("hex"), image.sha256);
  }
  const Credits = loadUI("src/components/home/HomePhotoCredits.tsx").default;
  const html = renderToStaticMarkup(React.createElement(Credits, { placements: ["animals", "play", "walk", "familyPanda"], lang: "en" }));
  assert.doesNotMatch(html, /CC BY|creativecommons|href=/);
  assert.match(html, /AI-generated illustration/);
});
