import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { isSeasonActive } from "../src/lib/seasons/period.ts";
const source = ts.transpileModule(readFileSync(new URL("../src/lib/server/todays-find.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const id = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const base = { id: "year", title: "year", description: "text", spot: { id }, lensId: null, lens: null, seasonId: null, season: null, startAt: null, endAt: null };
const seasonal = (month) => ({ ...base, id: String(month), seasonId: String(month), season: { name: String(month), description: "season", startMonth: month, endMonth: month, startDay: null, endDay: null } });
function setup(rows) {
  let calls = 0;
  const query = {
    where(value) { calls++; assert.equal(value.spotId, id); assert.equal(value.isPublished, true); assert.equal(Object.hasOwn(value, "seasonId"), false); return this; },
    select() { return this; },
    include(_name, callback) { const related = { where(value) { assert.equal(value.isPublished, true); return this; }, select() { return this; } }; callback(related); return this; },
    orderBy() { return this; }, async all() { return rows; },
  };
  const context = { exports: {}, Date, require(name) {
    if (name === "server-only") return {};
    if (name === "./db") return { db: { orm: { public: { TodaysFind: query } } } };
    if (name === "../seasons/period") return { isSeasonActive };
    throw new Error(name);
  } };
  vm.runInNewContext(source, context);
  return { get: context.exports.getTodaysFinds, calls: () => calls };
}
for (const [month, expected] of [[5, ["year", "5"]], [11, ["year", "11"]], [9, ["year"]]]) {
  test(`month ${month}: annual and matching Season only`, async () => {
    const { get } = setup([base, seasonal(5), seasonal(11)]);
    assert.deepEqual(Array.from(await get(id, id, new Date(`2026-${String(month).padStart(2, "0")}-15`)), (f) => f.id), expected);
  });
}
test("no Season and no seasonal Find remain valid", async () => {
  assert.equal((await setup([base]).get(id)).length, 1);
  assert.equal((await setup([]).get(id)).length, 0);
});
test("hidden Season/Spot/Lens, other Lens and expired/future Find are excluded", async () => {
  const now = new Date("2026-05-15");
  const rows = [{ ...seasonal(5), season: null }, { ...base, spot: null }, { ...base, lensId: id },
    { ...base, lensId: "other", lens: { id: "other" } },
    { ...base, startAt: { epochMilliseconds: now.getTime() + 1 } },
    { ...base, endAt: { epochMilliseconds: now.getTime() } }];
  assert.equal((await setup(rows).get(id, id, now)).length, 0);
});
test("invalid ID skips DB; invalid clock fails closed", async () => {
  const { get, calls } = setup([base]);
  assert.equal((await get("bad")).length, 0); assert.equal(calls(), 0);
  assert.equal((await get(id, id, new Date("invalid"))).length, 0);
});
