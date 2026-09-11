import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { safeExternalUrl } from "../src/lib/external-url.ts";

const source = ts.transpileModule(readFileSync(new URL("../src/lib/server/nearby-spots.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const id = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const other = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const spot = (id, isPublished = true) => ({ id, name: id, category: "OTHER", description: "description", address: null, externalUrl: "https://example.com", isPublished });
const link = (id, priority, nearbySpot) => ({ id, priority, nearbySpot, recommendationReason: null });

// Small in-memory query double: execute the getter's filters, relation callbacks,
// and ordering. Real SQL integration is checked separately against the local DB.
class Query {
  constructor(rows) { this.rows = rows; }
  where(where) {
    this.rows = this.rows.filter((row) => Object.entries(where).every(([key, value]) => row[key] === value));
    return this;
  }
  select() { return this; }
  include(key, callback) {
    this.rows = this.rows.map((row) => {
      const many = Array.isArray(row[key]);
      const related = callback(new Query(many ? row[key] : row[key] ? [row[key]] : [])).rows;
      return { ...row, [key]: many ? related : related[0] ?? null };
    });
    return this;
  }
  orderBy(callbacks) {
    const fields = new Proxy({}, { get: (_, key) => ({ asc: () => key }) });
    const keys = callbacks.map((callback) => callback(fields));
    this.rows = [...this.rows].sort((a, b) => {
      for (const key of keys) {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
      }
      return 0;
    });
    return this;
  }
  async first() { return this.rows[0] ?? null; }
}
function setup(rows) {
  let accesses = 0;
  const context = { exports: {}, require(name) {
    if (name === "server-only") return {};
    if (name === "../external-url") return { safeExternalUrl };
    if (name === "./db") return { db: { orm: { public: { get Lens() { accesses++; return new Query(rows); } } } } };
    throw new Error(name);
  } };
  vm.runInNewContext(source, context);
  return { get: context.exports.getNearbySpots, accesses: () => accesses };
}
const ids = (rows) => Array.from(rows, (row) => row.id);

test("only the selected Lens's related Spots are returned", async () => {
  const { get } = setup([
    { id, isPublished: true, nearbySpots: [link("one", 1, spot("selected"))] },
    { id: other, isPublished: true, nearbySpots: [link("two", 1, spot("other"))] },
  ]);
  assert.deepEqual(ids(await get(id)), ["selected"]);
  assert.deepEqual(ids(await get(other)), ["other"]);
});
test("empty relations and unregistered Lens return empty", async () => {
  const { get } = setup([{ id, isPublished: true, nearbySpots: [] }]);
  assert.equal((await get(id)).length, 0);
  assert.equal((await get(other)).length, 0);
});
test("unpublished Lens and unpublished NearbySpot are excluded", async () => {
  const hiddenLens = setup([{ id, isPublished: false, nearbySpots: [link("one", 1, spot("visible"))] }]);
  assert.equal((await hiddenLens.get(id)).length, 0);
  const { get } = setup([{ id, isPublished: true, nearbySpots: [link("one", 1, spot("hidden", false)), link("two", 2, spot("visible"))] }]);
  assert.deepEqual(ids(await get(id)), ["visible"]);
});
test("priority asc then relation id asc is stable after filtering", async () => {
  const { get } = setup([{ id, isPublished: true, nearbySpots: [link("z", 2, spot("last")), link("b", 1, spot("second")), link("a", 1, spot("first"))] }]);
  assert.deepEqual(ids(await get(id)), ["first", "second", "last"]);
});
test("invalid IDs never access the DB", async () => {
  const { get, accesses } = setup([]);
  for (const value of ["", "bad", "' OR 1=1", "../lens"]) assert.equal((await get(value)).length, 0);
  assert.equal(accesses(), 0);
});
test("unsafe URL becomes null without hiding the card", async () => {
  const { get } = setup([{ id, isPublished: true, nearbySpots: [link("one", 1, { ...spot("card"), externalUrl: "javascript:alert(1)" })] }]);
  const rows = await get(id);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].externalUrl, null);
});
