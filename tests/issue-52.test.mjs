import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { issue52Links } from "../prisma/issue-52-data.mts";
import { seedIssue52 } from "../prisma/issue-52-seed.mts";
import { officialNearbySpotSeeds } from "../prisma/official-nearby-spots.mts";
import { fixtureDatabase, serverModules } from "./helpers/issue-47-db.mjs";
const pandaId = "09b3e192-a214-446c-853e-fb6b592dac38";
const manabeId = "b23c8a02-a9d9-45b7-be8e-6d358a52a412";
const original = { id: "f268ac2d-f6c5-46a2-a866-1bfbbd72e8ba", lensId: pandaId, nearbySpotId: manabeId, priority: 1, recommendationReason: "既存理由", recommendationReasonEn: "Keep" };
function initial() {
  return {
    Lens: [{ id: pandaId, companion: "FAMILY", interest: "PANDA", isPublished: true }, ...[...new Map(issue52Links.map(s => [s.lensId, { id: s.lensId, companion: s.companion, interest: s.interest, isPublished: true }])).values()]],
    NearbySpot: [{ id: manabeId, slug: "sabae-manabe-museum", name: "鯖江市まなべの館", description: "鯖江の歴史・文化を紹介する博物館。", category: "SIGHTSEEING", externalUrl: "https://www.city.sabae.fukui.jp/", isPublished: true }, ...officialNearbySpotSeeds.map(s => ({ ...s, isPublished: true, category: "SIGHTSEEING" }))],
    LensNearbySpot: [original], Course: [{ id: "unchanged" }],
  };
}
async function setup() { const db = fixtureDatabase(initial()); await seedIssue52(db); return { db, get: serverModules(db)("src/lib/server/nearby-spots.ts").getNearbySpots }; }

test("Issue 52 inserts nine fixed unique links only and repeats without updates", async () => {
  assert.equal(issue52Links.length, 9);assert.equal(new Set(issue52Links.map(s => s.id)).size, 9);
  assert.equal(new Set(issue52Links.map(s => s.lensId + s.nearbySpotId)).size, 9);
  for (const s of issue52Links) assert.match(s.id, /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  const db = fixtureDatabase(initial()); const before = structuredClone(db.rows());
  assert.deepEqual(await seedIssue52(db), { inserted: 9, updated: 0, skipped: 0 });
  for (const m of Object.keys(before)) if (m !== "LensNearbySpot") assert.deepEqual(db.rows()[m], before[m]);
  assert.deepEqual(db.rows().LensNearbySpot.find(s => s.id === original.id), original);
  assert.equal(db.rows().LensNearbySpot.length, 10);
  const after = structuredClone(db.rows());
  assert.deepEqual(await seedIssue52(db), { inserted: 0, updated: 0, skipped: 9 });assert.deepEqual(db.rows(), after);
});
test("existing relation pair keeps its own ID, priority and reasons", async () => {
  const f = initial(), seed = issue52Links[0];
  const existing = { id: "existing-id", lensId: seed.lensId, nearbySpotId: seed.nearbySpotId, priority: 77, recommendationReason: "edited", recommendationReasonEn: "edited" };
  f.LensNearbySpot.push(existing);const db = fixtureDatabase(f);
  assert.equal((await seedIssue52(db)).inserted, 8);
  assert.deepEqual(db.rows().LensNearbySpot.find(r => r.id === existing.id), existing);
});
test("identity errors, unpublished new targets and UUID collisions roll back additions", async () => {
  const last = issue52Links.at(-1);
  for (const change of [f => f.NearbySpot = f.NearbySpot.filter(s => s.id !== last.nearbySpotId), f => f.NearbySpot.find(s => s.id === last.nearbySpotId).slug = "wrong", f => f.NearbySpot.find(s => s.id === last.nearbySpotId).isPublished = false, f => f.LensNearbySpot.push({ ...original, id: last.id }), f => f.Lens.find(l => l.id === last.lensId).companion = "FAMILY"]) {
    const f = initial(); change(f); const db = fixtureDatabase(f); const before = structuredClone(db.rows());
    await assert.rejects(seedIssue52(db)); assert.deepEqual(db.rows(), before);
  }
});
const expected = [
  ["FAMILY", "PANDA", ["鯖江市まなべの館"]],
  ["FAMILY", "SEASON", ["地蔵橋", "鯖江市まなべの館"]],
  ["COUPLE", "SEASON", ["本山誠照寺", "萬慶寺", "恵美写真館洋館・表門"]],
  ["FRIENDS", "PHOTO", ["地蔵橋", "めがねミュージアム"]],
  ["SOLO", "PHOTO", ["本山誠照寺", "王山古墳群"]],
];
for (const [companion,interest,names] of expected) test(companion + " × " + interest + " retrieves only its ordered destinations", async () => {
  const {db,get} = await setup(); const lens = db.rows().Lens.find(l => l.companion === companion && l.interest === interest);
  assert.deepEqual(Array.from(await get(lens.id), s => s.name), names);
});
test("missing/unpublished relations are removed before the three-card cap", async () => {
  const {db,get} = await setup();const lensId=issue52Links[0].lensId;
  db.rows().LensNearbySpot=db.rows().NearbySpot.map((s,i)=>({id:String(i),lensId,nearbySpotId:s.id,priority:i,recommendationReason:null}));
  db.rows().NearbySpot[0].isPublished=false; db.rows().NearbySpot.splice(1,1);
  const result=await get(lensId);assert.equal(result.length,3);assert.deepEqual(Array.from(result,s=>s.id),db.rows().NearbySpot.filter(s=>s.isPublished).slice(0,3).map(s=>s.id));
  db.rows().Lens.find(l=>l.id===lensId).isPublished=false;assert.equal((await get(lensId)).length,0);
  assert.equal((await get("invalid")).length,0);assert.equal((await get("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa")).length,0);
});
const require=createRequire(import.meta.url);
function loadUI(file, spots, recap, nearbyElement) {
  const context={exports:{},URL,URLSearchParams,require(name){
    if(name==="@/lib/server/nearby-spots")return{getNearbySpots:async()=>spots};
    if(name==="@/lib/server/rediscovery-lenses")return{getRediscoveryLenses:async()=>[{id:"next-lens",name:"FAMILY × PLAY",description:"別の楽しみ方",companion:"FAMILY",interest:"PLAY"}]};
    if(name==="@/lib/server/recap")return{getRecap:async()=>recap};
    if(name==="@/components/nearby/NearbySpots")return{__esModule:true,default:()=>nearbyElement};
    if(name==="next/link")return{__esModule:true,default:props=>React.createElement("a",props)};
    if(name==="next/navigation")return{notFound:()=>{throw Error("NOT_FOUND")}};
    if(name.startsWith("@/"))return loadUI("src/"+name.slice(2)+(name.includes("components/")?".tsx":".ts"),spots,recap,nearbyElement);
    if(name.startsWith("."))return loadUI(path.resolve(path.dirname(file),name+".ts"),spots,recap,nearbyElement);
    return require(name);
  }};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,context);return context.exports;
}
async function nearbyElement(spots) { return loadUI("src/components/nearby/NearbySpots.tsx",spots).default({lensId:pandaId}); }
test("Nearby UI renders zero/one/two/three cards with names, categories, reasons and named links", async()=>{
  const {get}=await setup();const rows=await get(issue52Links.find(s=>s.companion==="COUPLE").lensId);
  for(const count of [0,1,2,3]){const html=renderToStaticMarkup(await nearbyElement(rows.slice(0,count)));if(!count){assert.equal(html,"");continue;}assert.equal((html.match(/<li /g)||[]).length,count);assert.match(html,/観光・文化/);assert.match(html,/おすすめの理由/);assert.match(html,/focus-visible/);assert.match(html,/aria-label="本山誠照寺の施設の案内を見る（別タブ）"/);assert.doesNotMatch(html,/<button/);}
  const html=renderToStaticMarkup(await nearbyElement(rows));assert.match(html,/内部非公開/);assert.match(html,/事前問い合わせ/);
});
test("long text is preserved and missing official URL never makes an empty link", async()=>{
  const s={id:"one",name:"長い施設名".repeat(20),description:"長い説明".repeat(100),category:"SIGHTSEEING",recommendationReason:"理由",externalUrl:null};
  const html=renderToStaticMarkup(await nearbyElement([s]));assert.ok(html.includes(s.name)&&html.includes(s.description));assert.doesNotMatch(html,/<a /);
});
test("Recap retains current Lens, Course, Find and contextual next action with only one nearby section",async()=>{
  const {get}=await setup();const spots=await get(pandaId);const nearby=await nearbyElement(spots);
  const recap={lens:{id:pandaId,name:"FAMILY × PANDA",title:"現在のLENS",companion:"FAMILY",interest:"PANDA"},course:{name:"現在のCourse",description:"コース説明",durationType:"MINUTES_30_60",durationMinutes:60},finds:[{id:"find",title:"今日の発見テーマ",description:"発見説明",season:null}],action:{href:"/courses/next",label:"既存の次のCTA",needsDiagnosis:false}};
  const page=loadUI("src/app/recap/page.tsx",spots,recap,nearby).default;
  const html=renderToStaticMarkup(await page({searchParams:Promise.resolve({courseId:"keep",lang:"en",foo:["1","2"]})}));
  for(const text of ["FAMILY × PANDA","現在のCourse","今日の発見テーマ","既存の次のCTA","lang=en","foo=1&amp;foo=2"])assert.ok(html.includes(text));
  assert.equal((html.match(/id="nearby-title"/g)||[]).length,1);
  assert.equal((html.match(/id="rediscovery-title"/g)||[]).length,1);
  assert.ok(html.indexOf('id="nearby-title"') < html.indexOf('id="rediscovery-title"'));
  assert.ok(html.includes("FAMILY × PLAY") && html.includes("interest=PLAY"));
});
