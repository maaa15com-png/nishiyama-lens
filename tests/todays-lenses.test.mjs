import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { fixtures, recommendations, seasonalFixture, renderSection, loadUI } from "./helpers/todays-lenses.mjs";
import { fixtureDatabase } from "./helpers/issue-47-db.mjs";

for (const [date, name, image] of [["2026-04-05", "春の桜", null], ["2026-05-10", "春のツツジ", "nishiyama-azaleas"], ["2026-11-10", "秋の紅葉", "nishiyama-autumn-leaves"]]) {
  test("active Season and fixed FAMILY/COUPLE order: " + date, async () => {
    const r = await seasonalFixture(date + "T00:00:00Z");
    assert.equal(r.season.name, name); assert.deepEqual(Array.from(r.lenses, l => l.companion), ["FAMILY", "COUPLE"]);
    assert.equal(r.image?.slug ?? null, image);
  });
}
test("Japan calendar boundaries and off-season hide recommendations", async () => {
  for (const date of ["2026-03-31T14:59:59Z", "2026-04-10T15:00:00Z", "2026-05-31T15:00:00Z", "2026-09-23T00:00:00Z"]) assert.equal(await seasonalFixture(date), null);
  assert.ok(await seasonalFixture("2026-03-31T15:00:00Z"));
  assert.ok(await seasonalFixture("2026-04-10T14:59:59Z"));
  assert.ok(await seasonalFixture("2026-04-30T15:00:00Z"));
});
test("unpublished, overlapping and unknown Seasons fail closed", async () => {
  for (const mutate of [f => f.Season[1].isPublished = false, f => f.Season.push({ ...f.Season[1], id: "other", slug: "unknown" }), f => f.Season[1].slug = "unknown"]) {
    const f = fixtures(); mutate(f);
    assert.equal(await recommendations(fixtureDatabase(f))(new Date("2026-05-10")), null);
  }
});
test("unpublished Lens, absent/hidden/legacy-only Courses are excluded", async () => {
  for (const mutate of [f => f.Lens.find(l => l.id === "FAMILY").isPublished = false, f => f.Course = f.Course.filter(c => c.lensId !== "FAMILY"), f => f.Course.find(c => c.lensId === "FAMILY").isPublished = false, f => f.Course.find(c => c.lensId === "FAMILY").durationType = "HALF_DAY"]) {
    const f = fixtures(); mutate(f);const r = await recommendations(fixtureDatabase(f))(new Date("2026-05-10"));
    assert.deepEqual(Array.from(r.lenses, l => l.companion), ["COUPLE"]);
  }
  const f = fixtures(); f.Course = [];assert.equal(await recommendations(fixtureDatabase(f))(new Date("2026-05-10")), null);
});
test("unpublished or unapproved Spot image leaves valid text cards", async () => {
  for (const patch of [{ isPublished: false }, { imageUrl: "https://unapproved.example/image.jpg" }]) {
    const f = fixtures();Object.assign(f.Spot.find(s => s.slug === "nishiyama-azaleas"), patch);
    const r = await recommendations(fixtureDatabase(f))(new Date("2026-05-10"));assert.equal(r.image, null);assert.equal(r.lenses.length, 2);
  }
});
test("database failure hides optional section and invalid clock skips reads", async () => {
  const db = { orm: { public: { Season: { where() { throw Error("offline"); } } } } };
  const old = console.error;let logged = 0;console.error = () => logged++;
  try {const fn = recommendations(db);assert.equal(await fn(new Date(NaN)), null);assert.equal(logged, 0);assert.equal(await fn(new Date("2026-05-10")), null);assert.equal(logged, 1);} finally {console.error = old;}
});
test("cards render titles, images with credit, and Japanese-only destination notice", async () => {
  const html = renderSection(await seasonalFixture());
  for (const text of ["今日おすすめのLENS", "春のツツジ", "FAMILY × SEASON", "COUPLE × SEASON", "季節の景色", "CC BY 2.1 JP", "代表イメージ", "Japanese only", "focus-visible"]) assert.ok(html.includes(text));
  assert.equal((html.match(/<article/g) ?? []).length, 2);assert.equal((html.match(/<figure/g) ?? []).length, 2);
  assert.match(html, /<h2/); assert.match(html, /<h3/);
});
test("cherry has no image placeholder and off-season section is absent", async () => {
  const html = renderSection(await seasonalFixture("2026-04-05"));assert.match(html, /春の桜/);assert.doesNotMatch(html, /<img|<figure/);assert.equal(renderSection(null), "");
});
test("English copy and CTA preserve repeated query while replacing only answers and lang", async () => {
  const html = renderSection(await seasonalFixture(), "en", { lang: "ja", tag: ["a", "b"], courseId: "keep", companion: ["SOLO", "FRIENDS"], interest: "PANDA" });
  assert.match(html, /Spring Azaleas/);assert.match(html, /Enjoy seasonal scenery/);assert.match(html, /Explore this LENS/);
  const links = [...html.matchAll(/href="([^"]*)"/g)].filter(m => m[1].includes("/lens/result?"));assert.equal(links.length, 2);
  for (let i=0;i<links.length;i++) {const u = new URL(links[i][1].replaceAll("&amp;", "&"), "https://example.com");assert.deepEqual(u.searchParams.getAll("tag"), ["a", "b"]);assert.equal(u.searchParams.get("courseId"), "keep");assert.equal(u.searchParams.get("lang"), "en");assert.deepEqual(u.searchParams.getAll("companion"), [i === 0 ? "FAMILY" : "COUPLE"]);assert.equal(u.searchParams.get("interest"), "SEASON");}
});
test("home retains normal quiz CTAs and header with or without seasonal recommendations", async () => {
  for (const recommendation of [null, await seasonalFixture()]) {
    const page = loadUI("src/app/page.tsx", recommendation).default;
    const html = renderToStaticMarkup(await page({ searchParams: Promise.resolve({ lang: "ja" }) }));
    assert.equal((html.match(/わたしに合う楽しみ方を見つける/g) ?? []).length, 2);assert.match(html, /GlobalHeader/);
    assert.equal(html.includes("todays-lenses-title"), recommendation !== null);
  }
});

test("English seasonal heading works when DB nameEn is missing", async () => {
  const r = await seasonalFixture("2026-04-05");
  assert.match(renderSection(r, "en"), /Spring cherry blossoms/);
});


test("seasonal CTAs remove legacy duration but preserve repeated query and language", async () => {
  const recommendation = await seasonalFixture();
  for (const duration of ["HALF_DAY", ["HALF_DAY", "HOURS_1_2"]]) {
    const query = { lang: "en", foo: ["1", "2"], duration, companion: "SOLO", interest: "PHOTO", courseId: "keep" };
    const before = structuredClone(query);
    const html = renderSection(recommendation, "en", query);
    const links = [...html.matchAll(/href="([^"]*)"/g)].filter(m => m[1].includes("/lens/result?"));
    assert.equal(links.length, 2);
    for (const [index, match] of links.entries()) {
      const url = new URL(match[1].replaceAll("&amp;", "&"), "https://example.com");
      assert.equal(url.pathname, "/lens/result");
      assert.equal(url.searchParams.has("duration"), false);
      assert.deepEqual(url.searchParams.getAll("lang"), ["en"]);
      assert.deepEqual(url.searchParams.getAll("foo"), ["1", "2"]);
      assert.deepEqual(url.searchParams.getAll("companion"), [index === 0 ? "FAMILY" : "COUPLE"]);
      assert.deepEqual(url.searchParams.getAll("interest"), ["SEASON"]);
      assert.equal(url.searchParams.get("courseId"), "keep");
    }
    assert.deepEqual(query, before);
  }
});
