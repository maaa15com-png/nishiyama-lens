import test from "node:test";
import assert from "node:assert/strict";
import { additionalLensSeeds, cherrySeasonSeed, seasonalFindSeeds } from "../prisma/issue-47-data.mts";
import { seedIssue47 } from "../prisma/issue-47-seed.mts";
import { fixtureDatabase, serverModules } from "./helpers/issue-47-db.mjs";

const fallbackId = "36aa761d-24b9-4300-b2df-73ad6ba781a5";
const slugs = [...new Set([...additionalLensSeeds.flatMap(l => l.courses.flatMap(c => c.slots.map(s => s.slug))), ...seasonalFindSeeds.map(s => s.spotSlug)])];
function initial() {
  return { Spot: slugs.map((slug,i) => ({ id: slug === "seasonal-highlight" ? fallbackId : "00000000-0000-4000-8000-" + String(i+1).padStart(12,"0"), slug, name: slug, description: slug, category: "FLOWER", latitude: "35.950000", longitude: "136.180000", isPublished: true })),
    Season: [5,11].map((month,i) => ({ id: "10000000-0000-4000-8000-"+String(i+1).padStart(12,"0"), slug: ["spring-azaleas","autumn-leaves"][i], name: "season", startMonth: month, startDay: null, endMonth: month, endDay: null, isPublished: true })) };
}
async function setup() { const db=fixtureDatabase(initial()); await seedIssue47(db); return {db,load:serverModules(db)}; }
const plain = value => JSON.parse(JSON.stringify(value));

test("Issue #47 inserts only 4 Lens/12 Course/28 slots/33 candidates/1 Season/3 Finds and reruns unchanged", async () => {
  const db=fixtureDatabase(initial()); const before=structuredClone(db.rows());
  assert.deepEqual((await seedIssue47(db)).inserted,{Lens:4,Course:12,CourseSpot:28,Season:1,TodaysFind:3,CourseSpotSeason:33});
  const first=structuredClone(db.rows());
  for(const n of Object.keys(before)) for(const row of before[n]) assert.deepEqual(first[n].find(r=>r.id===row.id),row);
  assert.equal((await seedIssue47(db)).totalInserted,0);assert.deepEqual(db.rows(),first);
  const ids=Object.values(first).flat().map(r=>r.id);assert.equal(new Set(ids).size,ids.length);
  for(const id of ids)assert.match(id,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(first.TodaysFind.length,3);assert.ok(first.TodaysFind.every(f=>f.lensId===null));
});

test("seed collision rolls back instead of replacing an existing Lens", async () => {
  const data=initial();data.Lens=[{...additionalLensSeeds[0],id:"other-existing-id"}];const db=fixtureDatabase(data);const before=structuredClone(db.rows());
  await assert.rejects(seedIssue47(db),/collision/);assert.deepEqual(db.rows(),before);
});
test("seed rejects overlapping seasons and preserves all existing data", async () => {
  const data=initial();Object.assign(data.Season[0],{startMonth:4,startDay:1,endMonth:5});const db=fixtureDatabase(data);const before=structuredClone(db.rows());
  await assert.rejects(seedIssue47(db),/overlap/);assert.deepEqual(db.rows(),before);
});

for(const lens of additionalLensSeeds)test(lens.name+" returns three Courses in Duration order",async()=>{
  const {load}=await setup();const {recommendation}=await load("src/lib/server/lens-recommendation.ts").getLensRecommendation(lens);
  assert.equal(recommendation.lens.id,lens.id);
  assert.deepEqual(Array.from(recommendation.courses,c=>c.id),lens.courses.map(c=>c.id));
  assert.ok(recommendation.courses.every(c=>!/分|時間/.test(c.name)));
});

for(const [date,slug] of [["2026-03-31T14:59:59Z","seasonal-highlight"],["2026-03-31T15:00:00Z","nishiyama-cherry-blossoms"],["2026-04-10T14:59:59Z","nishiyama-cherry-blossoms"],["2026-04-10T15:00:00Z","seasonal-highlight"],["2026-05-15T03:00:00Z","nishiyama-azaleas"],["2026-11-15T03:00:00Z","nishiyama-autumn-leaves"],["2026-08-15T03:00:00Z","seasonal-highlight"]])test("Course/Map/Spot membership/Recap agree at "+date,async()=>{
  const {db,load}=await setup();const at=new Date(date);
  const detail=load("src/lib/server/course-detail.ts").getCourseDetail,map=load("src/lib/server/course-map.ts").getCourseMap,recap=load("src/lib/server/recap.ts").getRecap,spotDetail=load("src/lib/server/spot-detail.ts").getSpotDetail;
  for(const lens of additionalLensSeeds)for(const definition of lens.courses){
    const course=await detail(definition.id,at),mapped=await map(definition.id,at),summary=await recap(definition.id,at);
    assert.deepEqual(Array.from(mapped.spots,s=>s.id),Array.from(course.courseSpots,s=>s.spotId));
    assert.deepEqual(plain(summary.course),plain(course));
    for(const [i,slot]of course.courseSpots.entries()){
      assert.equal(slot.sortOrder,i+1);assert.equal(slot.courseId,definition.id);assert.equal(slot.courseSpotId,definition.slots[i].id);
      assert.equal(slot.spot.slug,definition.slots[i].slug==="seasonal-highlight"?slug:definition.slots[i].slug);
      assert.equal(slot.spotId,slot.spot.id);
      assert.equal(slot.fallbackSpotId,db.rows().Spot.find(s=>s.slug===definition.slots[i].slug).id);
      const expectedSeason=definition.slots[i].slug==="seasonal-highlight"&&slug!=="seasonal-highlight"?db.rows().CourseSpotSeason.find(candidate=>candidate.courseSpotId===slot.courseSpotId&&candidate.spotId===slot.spotId).seasonId:null;
      assert.equal(slot.selectedSeasonId,expectedSeason);const spot=await spotDetail(slot.spot.slug);assert.ok(course.courseSpots.some(s=>s.spot.id===spot.id));
    }
    const usesSeason=definition.slots.some(s=>s.slug==="seasonal-highlight")&&slug!=="seasonal-highlight";
    assert.equal(summary.finds.length,usesSeason?1:0);
    if(usesSeason){const target=db.rows().Spot.find(s=>s.slug===slug);const finds=await load("src/lib/server/todays-find.ts").getTodaysFinds(target.id,lens.id,at);assert.deepEqual(plain(finds),plain(summary.finds));}
  }
});

for(const mode of ["hidden-season","hidden-candidate","overlap","hidden-fallback","no-candidates"])test(mode+" resolves safely",async()=>{
  const {db,load}=await setup();const row=db.rows();const courseId=additionalLensSeeds[0].courses[0].id;
  if(mode==="hidden-season")row.Season.find(s=>s.id===cherrySeasonSeed.id).isPublished=false;
  if(mode==="hidden-candidate")row.Spot.find(s=>s.slug==="nishiyama-cherry-blossoms").isPublished=false;
  if(mode==="overlap")Object.assign(row.Season.find(s=>s.slug==="spring-azaleas"),{startMonth:4,endMonth:4,startDay:1,endDay:10});
  if(mode==="hidden-fallback")row.Spot.find(s=>s.id===fallbackId).isPublished=false;
  if(mode==="no-candidates")row.CourseSpotSeason.length=0;
  const at=new Date(mode==="hidden-fallback"?"2026-08-01T03:00:00Z":"2026-04-05T03:00:00Z");
  const course=await load("src/lib/server/course-detail.ts").getCourseDetail(courseId,at);
  if(mode==="hidden-fallback")assert.equal(course.courseSpots.length,0);
  else {assert.equal(course.courseSpots[0].spotId,fallbackId);assert.equal(course.courseSpots[0].selectedSeasonId,null);}
});

test("unconfigured legacy slots retain their original Spot in every season",async()=>{
  const {db,load}=await setup();const legacy={id:"20000000-0000-4000-8000-000000000001",lensId:"legacy",name:"original",isPublished:true};db.rows().Course.push(legacy);db.rows().CourseSpot.push({id:"20000000-0000-4000-8000-000000000002",courseId:legacy.id,spotId:fallbackId,sortOrder:1});
  for(const month of [4,5,8,11]){const course=await load("src/lib/server/course-detail.ts").getCourseDetail(legacy.id,new Date(Date.UTC(2026,month-1,5)));assert.equal(course.courseSpots[0].spotId,fallbackId);}
});

test("seed preserves edited content and publication states on repeat execution",async()=>{
  const {db}=await setup();db.rows().Lens[0].description="edited";db.rows().Course[0].isPublished=false;db.rows().TodaysFind[0].description="edited Find";
  const before=structuredClone(db.rows());assert.equal((await seedIssue47(db)).totalInserted,0);assert.deepEqual(db.rows(),before);
});
