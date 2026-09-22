import test from "node:test";
import assert from "node:assert/strict";
import { officialNearbySpotSeeds, seedOfficialNearbySpots } from "../prisma/official-nearby-spots.mts";

function database(initial = []) {
  let rows = structuredClone(initial);
  return {
    rows: () => structuredClone(rows),
    async transaction(callback) {
      const before = structuredClone(rows);
      try {
        return await callback({ orm: { public: { NearbySpot: {
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


test("add seven NearbySpots once, preserving Manabe and fixed IDs on rerun", async () => {
  const original = { id: "b23c8a02-a9d9-45b7-be8e-6d358a52a412", slug: "sabae-manabe-museum", name: "existing name", descriptionEn: "existing English", isPublished: false, updatedAt: "unchanged" };
  const db = database([original]);
  assert.deepEqual(await seedOfficialNearbySpots(db), { inserted: 7, skipped: 0 });
  const first = db.rows();
  assert.equal(first.length, 8);
  assert.deepEqual(first[0], original);
  assert.equal(new Set(first.map(row => row.slug)).size, 8);
  assert.equal(new Set(first.map(row => row.id)).size, 8);
  for (const seed of officialNearbySpotSeeds) {
    assert.match(seed.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    const row = first.find(row => row.slug === seed.slug);
    for (const key of ["id", "name", "nameEn", "latitude", "longitude", "externalUrl", "description"]) assert.equal(row[key], seed[key]);
    assert.equal(row.category, "SIGHTSEEING");
    assert.equal(row.isPublished, true);
    for (const key of ["imageUrl", "descriptionEn", "address", "addressEn", "openingHours"]) assert.equal(row[key], null);
  }
  const emi = first.find(row => row.slug === "emi-photo-studio");
  assert.equal(emi.nameEn, null);
  assert.match(emi.description, /内部非公開/);
  assert.match(emi.description, /事前問い合わせが必要/);
  assert.deepEqual(await seedOfficialNearbySpots(db), { inserted: 0, skipped: 7 });
  assert.deepEqual(db.rows(), first);
});

test("a preexisting candidate slug retains all data and its different ID", async () => {
  const original = { ...officialNearbySpotSeeds[0], id: "existing-id", description: "edited", isPublished: false };
  const db = database([original]);
  assert.deepEqual(await seedOfficialNearbySpots(db), { inserted: 6, skipped: 1 });
  assert.deepEqual(db.rows()[0], original);
});

test("fixed UUID collision rolls back earlier inserts", async () => {
  const original = [{ id: officialNearbySpotSeeds[6].id, slug: "unrelated-existing-facility" }];
  const db = database(original);
  await assert.rejects(seedOfficialNearbySpots(db), /ID collision/);
  assert.deepEqual(db.rows(), original);
});
