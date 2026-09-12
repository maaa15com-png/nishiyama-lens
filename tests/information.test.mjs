import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(readFileSync(new URL("../src/lib/server/information.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const id = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const now = new Date("2026-09-12T00:00:00Z");
const instant = (delta) => ({ epochMilliseconds: now.getTime() + delta });
function setup(data = {}) {
  const calls = [];
  function model(name) {
    return { where(condition) {
      calls.push({ name, condition });
      assert.equal(condition.isPublished, true);
      const rows = (data[name] ?? []).filter((row) => row.isPublished && (!condition.id || row.id === condition.id));
      const query = {
        select() { return this; },
        orderBy(spec) {
          const proxy = new Proxy({}, { get: (_, field) => ({ asc: () => field }) });
          const fields = (Array.isArray(spec) ? spec : [spec]).map((fn) => fn(proxy));
          rows.sort((a, b) => {
            for (const field of fields) { const x = a[field]?.epochMilliseconds ?? a[field]; const y = b[field]?.epochMilliseconds ?? b[field]; if (x < y) return -1; if (x > y) return 1; }
            return 0;
          });
          return this;
        },
        async all() { return rows; }, async first() { return rows[0] ?? null; },
      };
      return query;
    } };
  }
  const context = { exports: {}, Date, require(name) {
    if (name === "server-only") return {};
    if (name === "./db") return { db: { orm: { public: Object.fromEntries(["News", "Event", "Spot", "Season"].map((name) => [name, model(name)])) } } };
    throw new Error(name);
  } };
  vm.runInNewContext(source, context);
  return { ...context.exports, calls };
}
test("news excludes hidden/future; includes undated and boundary; stable date/ID order", async () => {
  const query = setup({ News: [
    { id: "z", isPublished: true, publishedAt: null },
    { id: "b", isPublished: true, publishedAt: instant(0) },
    { id: "a", isPublished: true, publishedAt: instant(0) },
    { id: "old", isPublished: true, publishedAt: instant(-1) },
    { id: "future", isPublished: true, publishedAt: instant(1) },
    { id: "hidden", isPublished: false, publishedAt: null },
  ] });
  assert.deepEqual(Array.from(await query.getNews(now), (row) => row.id), ["a", "b", "old", "z"]);
  assert.equal((await query.getNews(new Date("invalid"))).length, 0);
});
test("news detail applies the same release conditions", async () => {
  for (const [publishedAt, isPublished, visible] of [[null, true, true], [instant(0), true, true], [instant(1), true, false], [null, false, false]]) {
    const query = setup({ News: [{ id, publishedAt, isPublished }] });
    assert.equal(Boolean(await query.getNewsDetail(id, now)), visible);
  }
});
test("invalid IDs skip DB and unknown IDs return null; empty lists are supported", async () => {
  const query = setup();
  assert.equal(await query.getNewsDetail("bad"), null);
  assert.equal(await query.getEventDetail("bad"), null);
  assert.equal(query.calls.length, 0);
  assert.equal(await query.getNewsDetail(id), null);
  assert.equal(await query.getEventDetail(id), null);
  assert.equal((await query.getNews()).length, 0);
  assert.equal((await query.getEvents()).length, 0);
});
test("events are public only, start/ID sorted, and null end is retained", async () => {
  const query = setup({ Event: [
    { id: "b", isPublished: true, startAt: instant(0), endAt: null },
    { id: "a", isPublished: true, startAt: instant(0), endAt: null },
    { id, isPublished: false, startAt: instant(-1) },
  ] });
  assert.deepEqual(Array.from(await query.getEvents(), (row) => row.id), ["a", "b"]);
  assert.equal((await query.getEvents())[0].endAt, null);
  assert.equal(await query.getEventDetail(id), null);
});
test("park uses only known public facilities and published spring/autumn descriptions", async () => {
  const query = setup({ Spot: [
    { id: "1", name: "Zoo", slug: "nishiyama-zoo", isPublished: true },
    { id: "2", name: "Season", slug: "seasonal-highlight", isPublished: true },
    { id: "3", name: "Play", slug: "adventure-forest", isPublished: false },
  ], Season: [
    { id: "1", startMonth: 5, seasonGroup: "SPRING", isPublished: true },
    { id: "2", startMonth: 11, seasonGroup: "AUTUMN", isPublished: false },
    { id: "3", startMonth: 8, seasonGroup: "SUMMER", isPublished: true },
  ] });
  const result = await query.getParkInformation();
  assert.equal(result.facilities.length, 1);
  assert.equal(result.facilities[0].slug, "nishiyama-zoo");
  assert.equal(result.seasons.length, 1);
});
