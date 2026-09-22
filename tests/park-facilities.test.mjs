import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parkFacilitySeeds } from "../prisma/park-facility-data.mts";
import { seedParkFacilities } from "../prisma/park-facilities.mts";
import { fixtureDatabase, serverModules } from "./helpers/issue-47-db.mjs";
const plain = value => JSON.parse(JSON.stringify(value));

test("facility seed matches official named coordinates, unique stable UUIDs and types", () => {
  const evidence = JSON.parse(fs.readFileSync(new URL("../docs/sources/issue-50-facilities.json", import.meta.url), "utf8"));
  const source = evidence.flatMap(e => e.rows);
  assert.equal(parkFacilitySeeds.length,10);
  assert.equal(new Set(parkFacilitySeeds.map(f=>f.id)).size,10);
  assert.equal(new Set(parkFacilitySeeds.map(f=>f.type+f.name)).size,10);
  assert.equal(parkFacilitySeeds.filter(f=>f.type==="TOILET").length,8);
  assert.equal(parkFacilitySeeds.filter(f=>f.type==="PARKING").length,2);
  for(const facility of parkFacilitySeeds){
    assert.match(facility.id,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    const row=source.find(r=>r["施設名"]===facility.name);assert.ok(row);
    assert.equal(facility.latitude,Number(row["緯度"]).toFixed(6));assert.equal(facility.longitude,Number(row["経度"]).toFixed(6));
    assert.equal(facility.nameEn,row["施設名(英語)"]||null);
    assert.equal(facility.descriptionEn,null);
  }
});

test("facility seed inserts only amenities and a second run leaves all values unchanged", async()=>{
  const db=fixtureDatabase({Spot:[{id:"existing-spot"}],Course:[{id:"existing-course"}]});
  const before=structuredClone(db.rows());assert.deepEqual(await seedParkFacilities(db),{inserted:10,skipped:0,updated:0});
  for(const model of Object.keys(before))if(model!=="ParkFacility")assert.deepEqual(db.rows()[model],before[model]);
  const after=structuredClone(db.rows());assert.deepEqual(await seedParkFacilities(db),{inserted:0,skipped:10,updated:0});assert.deepEqual(db.rows(),after);
});

test("facility seed preserves editorial changes and publication status",async()=>{
  const db=fixtureDatabase();await seedParkFacilities(db);db.rows().ParkFacility[0].description="edited";db.rows().ParkFacility[0].isPublished=false;
  const before=structuredClone(db.rows());await seedParkFacilities(db);assert.deepEqual(db.rows(),before);
});

test("facility seed identity conflict rolls back without overwriting",async()=>{
  const db=fixtureDatabase({ParkFacility:[{...parkFacilitySeeds[4],id:"existing-different-id"}]});const before=structuredClone(db.rows());
  await assert.rejects(seedParkFacilities(db),/collision/);assert.deepEqual(db.rows(),before);
});

test("facility query returns only published known types with valid coordinates and safe source links",async()=>{
  const seed=parkFacilitySeeds[0];const rows=[{...seed,id:"valid"},
    {...seed,id:"hidden",isPublished:false},{...seed,id:"bad-type",type:"SPOT"},
    ...[null,"", "NaN", "91"].map((latitude,i)=>({...seed,id:"bad-lat"+i,latitude})),
    {...seed,id:"bad-lng",longitude:"181"}, {...seed,id:"unsafe-url",externalUrl:"javascript:alert(1)"}];
  const load=serverModules(fixtureDatabase({ParkFacility:rows}));const result=await load("src/lib/server/park-facilities.ts").getParkFacilities();
  assert.deepEqual(Array.from(result,f=>f.id).sort(),["unsafe-url","valid"]);
  assert.equal(result.find(f=>f.id==="unsafe-url").externalUrl,null);
  assert.equal(result.find(f=>f.id==="valid").latitude,35.949591);
  assert.equal(result.find(f=>f.id==="valid").externalUrl,seed.externalUrl);
});

test("empty facilities are valid and do not add any Course map points",async()=>{
  const db=fixtureDatabase({Course:[{id:"10000000-0000-4000-8000-000000000001",isPublished:true,name:"course"}]});
  const load=serverModules(db);assert.deepEqual(plain(await load("src/lib/server/park-facilities.ts").getParkFacilities()),[]);
  await seedParkFacilities(db);const course=await load("src/lib/server/course-map.ts").getCourseMap(db.rows().Course[0].id);assert.equal(course.spots.length,0);
});
