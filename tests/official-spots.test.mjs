import test from "node:test";
import assert from "node:assert/strict";
import { officialSpotSeeds, seedOfficialSpots } from "../prisma/official-spots.mts";

function database(initial = []) {
  let rows = structuredClone(initial);
  return {
    rows: () => structuredClone(rows),
    async transaction(callback) {
      const before = structuredClone(rows);
      try {
        return await callback({ orm: { public: { Spot: {
          where(query) { return { async first() { return rows.find(row => Object.entries(query).every(([key, value]) => row[key] === value)) ?? null; } }; },
          async create(row) {
            assert.ok(!rows.some(existing => existing.id === row.id || existing.slug === row.slug));
            rows.push(structuredClone(row));
          },
        } } } });
      } catch (error) { rows = before; throw error; }
    },
  };
}

test("official seed inserts six unique published Spots and reruns without changes", async () => {
  const existing = [{ id: "existing-zoo-id", slug: "nishiyama-zoo", name: "existing content" }];
  const db = database(existing);
  assert.deepEqual(await seedOfficialSpots(db), { inserted: 6, skipped: 0 });
  const first = db.rows();
  assert.deepEqual(await seedOfficialSpots(db), { inserted: 0, skipped: 6 });
  assert.deepEqual(db.rows(), first);
  assert.deepEqual(first[0], existing[0]);
  for (const seed of officialSpotSeeds) {
    const row = first.find(row => row.slug === seed.slug);
    assert.equal(row.id, seed.id);
    assert.match(row.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    assert.equal(row.nameEn, seed.nameEn ?? null);
    assert.equal(row.isPublished, true);
    for (const key of ["descriptionEn", "openingHours", "strollerAccessible", "hasToilet", "stayMinutes", "feeText"]) assert.equal(row[key], null);
  }
});

test("existing slug retains its original ID, content, and publication state", async () => {
  const existing = { ...officialSpotSeeds[0], id: "preexisting-id", description: "edited content", isPublished: false };
  const db = database([existing]);
  assert.deepEqual(await seedOfficialSpots(db), { inserted: 5, skipped: 1 });
  assert.deepEqual(db.rows()[0], existing);
});

test("fixed ID collision aborts transaction without leaving a partial insert", async () => {
  const existing = [{ id: officialSpotSeeds[1].id, slug: "unrelated-spot" }];
  const db = database(existing);
  await assert.rejects(seedOfficialSpots(db), /ID collision/);
  assert.deepEqual(db.rows(), existing);
});

// Exercise the actual public detail selector so images cannot silently disappear.
test("Spot detail fetches only published rows and includes the optional image", async () => {
  const { readFileSync } = await import("node:fs");
  const { default: ts } = await import("typescript");
  const { default: vm } = await import("node:vm");
  const fixture = { ...officialSpotSeeds[0], isPublished: true };
  let calls = 0;
  const context = { exports: {}, require(name) {
    if (name === "server-only") return {};
    if (name === "./db") return { db: { orm: { public: { Spot: {
      where(filter) {
        calls++;
        assert.equal(filter.isPublished, true);
        return {
          select(...columns) { assert.ok(columns.includes("imageUrl")); return this; },
          include() { return this; },
          async first() { return filter.slug === fixture.slug ? fixture : null; },
        };
      },
    } } } } };
    throw new Error(name);
  } };
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL("../src/lib/server/spot-detail.ts", import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, context);
  assert.equal((await context.exports.getSpotDetail(fixture.slug)).imageUrl, fixture.imageUrl);
  assert.equal(await context.exports.getSpotDetail("not-present"), null);
  assert.equal(await context.exports.getSpotDetail("../invalid"), null);
  assert.equal(calls, 2);
});


test("adding seasonal Spots preserves all three previously seeded Spots", async () => {
  const existing = officialSpotSeeds.slice(0, 3).map(seed => ({ ...seed, description: "existing edited content", isPublished: false }));
  const db = database(existing);
  assert.deepEqual(await seedOfficialSpots(db), { inserted: 3, skipped: 3 });
  const first = db.rows();
  assert.deepEqual(first.slice(0, 3), existing);
  const added = first[3];
  assert.equal(added.slug, "nishiyama-cherry-blossoms");
  assert.equal(added.latitude, "35.950872");
  assert.equal(added.longitude, "136.182828");
  for (const key of ["imageUrl", "descriptionEn", "hasRestArea", "openingHours"]) assert.equal(added[key], null);
  assert.deepEqual(await seedOfficialSpots(db), { inserted: 0, skipped: 6 });
  assert.deepEqual(db.rows(), first);
});
