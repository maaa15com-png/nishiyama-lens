import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadUI } from "./helpers/todays-lenses.mjs";
const { heroImages, selectHeroImage, createHeroImageStore, HERO_IMAGE_STORAGE_KEY } = loadUI("src/lib/media/hero-image.ts");

test("Hero: Japanese title keeps three semantic lines and both descriptions wrap without forced breaks", async () => {
  const Home = loadUI("src/app/page.tsx", null).default;
  for (const lang of ["ja", "en"]) {
    const html = renderToStaticMarkup(await Home({ searchParams: Promise.resolve({ lang }) }));
    const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1];
    assert.ok(heading);
    if (lang === "ja") {
      const lines = [...heading.matchAll(/<span class="block whitespace-nowrap">([^<]+)<\/span>/g)].map(match => match[1]);
      assert.deepEqual(lines, ["見方を変えると、", "公園は", "旅になる。"]);
      assert.equal(heading.replace(/<[^>]*>/g, ""), "見方を変えると、公園は旅になる。");
    } else {
      assert.equal(heading, "See the park anew.<br/>Let a journey begin.");
    }
    const description = html.match(/<\/h1><p\b([^>]*)>([\s\S]*?)<\/p>/);
    assert.ok(description);
    assert.match(description[1], /text-pretty/);
    assert.doesNotMatch(description[2], /<br\b/);
    assert.equal(description[2], lang === "ja"
      ? "動物、季節、遊び、ひと休み。いつもの公園に、まだ知らない一日を見つけよう。"
      : "Animals, seasons, play, and a moment to rest. Discover a new kind of day in a familiar park.");
  }
});

test("Hero: three distinct presentation images are reachable; no cherry", () => {
  assert.deepEqual(Array.from(heroImages, i => i.slug), ["nishiyama-azaleas", "nishiyama-autumn-leaves", "generated-panda-sunlight"]);
  for (let n = 0; n < 3; n++) assert.equal(selectHeroImage(heroImages, null, () => (n + 0.5) / 3), heroImages[n]);
});
test("Hero: exclude previous for every random interval", () => {
  for (const previous of heroImages) for (const random of [0, .4, .99]) assert.notEqual(selectHeroImage(heroImages, previous.imagePath, () => random), previous);
});
test("Hero: one candidate, stale previous and empty candidates are safe", () => {
  assert.equal(selectHeroImage([heroImages[0]], heroImages[0].imagePath), heroImages[0]);
  assert.equal(selectHeroImage(heroImages, "removed", () => .99), heroImages[2]);
  assert.equal(selectHeroImage([], null), null);
});
test("Hero: SSR is empty; subscription initializes once; only successfully displayed image is saved", () => {
  let reads = 0, writes = 0, randomCalls = 0, notifications = 0;
  const store = createHeroImageStore(heroImages, () => ({
    getItem(key) { assert.equal(key, HERO_IMAGE_STORAGE_KEY); reads++; return heroImages[0].imagePath; },
    setItem(key, value) { assert.equal(key, HERO_IMAGE_STORAGE_KEY); assert.equal(value, heroImages[1].imagePath); writes++; },
  }), () => { randomCalls++; return 0; });
  assert.equal(store.getServerSnapshot(), null); assert.equal(store.getSnapshot(), null); assert.equal(reads, 0);
  const unsubscribe = store.subscribe(() => notifications++);
  const selected = store.getSnapshot();
  assert.equal(selected.image, heroImages[1]); assert.equal(selected.ready, false); assert.equal(writes, 0);
  unsubscribe(); store.subscribe(() => notifications++); store.subscribe(() => notifications++);
  assert.equal(store.getSnapshot(), selected); store.loaded(); store.loaded();
  assert.equal(store.getSnapshot().ready, true); assert.equal(store.getServerSnapshot(), null);
  assert.equal(reads, 1); assert.equal(randomCalls, 1); assert.equal(writes, 1); assert.equal(notifications, 2);
});
test("Hero: unavailable storage getter/read/write does not prevent display", () => {
  const fail = () => { throw new Error("storage blocked"); };
  for (const storage of [fail, () => ({ getItem: fail, setItem: fail }), () => ({ getItem: () => null, setItem: fail })]) {
    const store = createHeroImageStore(heroImages, storage, () => 0);
    store.subscribe(() => {}); store.loaded(); assert.equal(store.getSnapshot().ready, true);
  }
});
test("Hero: failed image and empty candidates retain fallback without saving or retry cycling", () => {
  let writes = 0;
  for (const candidates of [heroImages, []]) {
    const store = createHeroImageStore(candidates, () => ({ getItem: () => null, setItem: () => writes++ }));
    const unsubscribe = store.subscribe(() => {}); store.failed(); store.loaded(); unsubscribe(); store.subscribe(() => {});
    assert.equal(store.getSnapshot(), null);
  }
  assert.equal(writes, 0);
});
test("Hero: SSR keeps photo absent and reserves credits space for both languages", () => {
  const { HeroImage, HeroImageCredits } = loadUI("src/components/home/HeroImage.tsx");
  assert.equal(renderToStaticMarkup(React.createElement(HeroImage)), "");
  for (const lang of ["ja", "en"]) {
    const html = renderToStaticMarkup(React.createElement(HeroImageCredits, { lang }));
    assert.match(html, /min-h-14/); assert.doesNotMatch(html, /<img|<a/);
  }
});

test("Hero: blocked sessionStorage uses history through ten reloads, preserving router state", () => {
  const { heroHistoryStorage } = loadUI("src/lib/media/hero-image.ts");
  const history = { state: { __NA: true, router: "preserved" }, replaceState(value) { this.state = value; } };
  const blocked = () => { throw new Error("blocked"); };
  let previous = null;
  for (let reload = 0; reload < 10; reload++) {
    const store = createHeroImageStore(heroImages, blocked, () => 0, () => heroHistoryStorage(history));
    const unsubscribe = store.subscribe(() => {});
    const selected = store.getSnapshot().image.imagePath;
    assert.notEqual(selected, previous);
    unsubscribe(); store.subscribe(() => {});
    assert.equal(store.getSnapshot().image.imagePath, selected);
    store.loaded();
    assert.equal(history.state.__NA, true);
    assert.equal(history.state.router, "preserved");
    previous = selected;
  }
});
