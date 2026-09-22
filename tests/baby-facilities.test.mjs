import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parkFacilitySeeds, babyFacilityEvidence } from "../prisma/park-facility-data.mts";
import { seedParkFacilities } from "../prisma/park-facilities.mts";
import { fixtureDatabase, serverModules } from "./helpers/issue-47-db.mjs";
const load = serverModules(fixtureDatabase());
const { matchesFacilityFilter, isFacilityVisible, facilityAmenityLabels } = load("src/lib/map/facilities.ts");
const plain = value => JSON.parse(JSON.stringify(value));

test("only two officially verified facilities have baby flags; unknown is null", () => {
  const station = parkFacilitySeeds.find(f => f.id === "96902ac7-2229-42d6-a55e-db58a0125caf");
  const zoo = parkFacilitySeeds.find(f => f.id === "586282f7-ea81-4520-afd2-197f04073ba3");
  assert.equal(station.hasNursingRoom, true); assert.equal(station.hasDiaperChange, true);
  assert.equal(zoo.hasNursingRoom, null); assert.equal(zoo.hasDiaperChange, true);
  for (const f of parkFacilitySeeds.filter(f => !babyFacilityEvidence[f.id])) {
    assert.equal(f.hasNursingRoom, null); assert.equal(f.hasDiaperChange, null);
  }
});
test("upgrade changes only approved fields on two legacy facilities and is idempotent", async () => {
  const legacy = parkFacilitySeeds.map(f => ({ ...f, hasNursingRoom: null, hasDiaperChange: null,
    description: "Existing editorial description", isPublished: false, updatedAt: "old" }));
  const db = fixtureDatabase({ ParkFacility: legacy, Course: [{ id: "keep-course" }] });
  const before = structuredClone(db.rows());
  assert.deepEqual(await seedParkFacilities(db), { inserted: 0, updated: 2, skipped: 8 });
  for (const f of db.rows().ParkFacility) {
    const old = before.ParkFacility.find(x => x.id === f.id);
    if (!babyFacilityEvidence[f.id]) assert.deepEqual(f, old);
    for (const key of Object.keys(old).filter(k => !["description", "hasNursingRoom", "hasDiaperChange"].includes(k))) assert.deepEqual(f[key], old[key]);
    assert.ok(f.description.startsWith(old.description));
  }
  assert.deepEqual(db.rows().Course, before.Course);
  const after = structuredClone(db.rows());
  assert.deepEqual(await seedParkFacilities(db), { inserted: 0, updated: 0, skipped: 10 });
  assert.deepEqual(db.rows(), after);
});
test("baby filter includes true only, unions with type filters without duplicate facilities", () => {
  const select = visible => parkFacilitySeeds.filter(f => isFacilityVisible(f, visible));
  assert.equal(select({ TOILET: false, PARKING: false, BABY: false }).length, 0);
  assert.equal(select({ TOILET: false, PARKING: false, BABY: true }).length, 2);
  assert.equal(select({ TOILET: true, PARKING: false, BABY: true }).length, 8);
  const all = select({ TOILET: true, PARKING: true, BABY: true });
  assert.equal(all.length, 10); assert.equal(new Set(all.map(f => f.id)).size, 10);
  for (const value of [null, false]) assert.equal(matchesFacilityFilter({ hasNursingRoom: value, hasDiaperChange: value }, "BABY"), false);
});
test("amenity text shows only confirmed presence, never equates unknown with absent", () => {
  assert.deepEqual(plain(facilityAmenityLabels({ hasNursingRoom: null, hasDiaperChange: null })), []);
  assert.deepEqual(plain(facilityAmenityLabels({ hasNursingRoom: null, hasDiaperChange: true })), ["おむつ交換設備あり"]);
  assert.deepEqual(plain(facilityAmenityLabels({ hasNursingRoom: true, hasDiaperChange: true })), ["授乳室あり", "おむつ交換設備あり"]);
});
test("published facility query preserves nullable flags", async () => {
  const db = fixtureDatabase({ ParkFacility: parkFacilitySeeds });
  const result = await serverModules(db)("src/lib/server/park-facilities.ts").getParkFacilities();
  assert.equal(result.length, 10);
  for (const f of result) {
    const seed = parkFacilitySeeds.find(s => s.id === f.id);
    assert.equal(f.hasNursingRoom, seed.hasNursingRoom); assert.equal(f.hasDiaperChange, seed.hasDiaperChange);
  }
});
test("baby columns are nullable and migration only adds the two columns without defaults", () => {
  const contract = JSON.parse(fs.readFileSync("prisma/schema.json", "utf8"));
  const columns = contract.storage.namespaces.public.entries.table.park_facilities.columns;
  for (const name of ["has_nursing_room", "has_diaper_change"]) {
    assert.equal(columns[name].nullable, true); assert.equal(columns[name].default, undefined);
  }
  const ops = JSON.parse(fs.readFileSync("migrations/app/20260922T1806_add_facility_baby_amenities/ops.json", "utf8"));
  assert.equal(ops.length, 2);
  assert.ok(ops.every(op => op.operationClass === "additive" && op.target.details.table === "park_facilities"));
});
