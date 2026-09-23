import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { fixtureDatabase, serverModules } from "./helpers/issue-47-db.mjs";
import { loadUI } from "./helpers/todays-lenses.mjs";

const makeLens = (id, companion, interest, patch = {}) => ({ id, name: companion + " × " + interest, companion, interest, description: "別の景色を楽しむ。", isPublished: true, ...patch });
function fixture() {
  const Lens = [makeLens("current", "FAMILY", "PANDA"), makeLens("play", "FAMILY", "PLAY"), makeLens("season", "FAMILY", "SEASON"), makeLens("solo", "SOLO", "PHOTO"), makeLens("couple", "COUPLE", "PHOTO"), makeLens("friends", "FRIENDS", "PHOTO")];
  return { Lens, Course: Lens.flatMap(l => ["MINUTES_30_60", "HOURS_1_2", "HOURS_2_3"].map(durationType => ({ id: l.id + durationType, lensId: l.id, durationType, isPublished: true }))) };
}
function functions(rows) { const db = fixtureDatabase(rows); const load = serverModules(db); return { db, get: load("src/lib/server/rediscovery-lenses.ts").getRediscoveryLenses, result: load("src/lib/server/lens-recommendation.ts").getLensRecommendation }; }
const ids = result => Array.from(result, l => l.id);

test("rediscovery excludes current Lens, prefers different Interest in same Companion, caps at two without duplicates", async () => {
  const { get } = functions(fixture()); const rows = await get("current");
  assert.deepEqual(ids(rows), ["season", "play"]); assert.equal(new Set(rows.map(l => l.id)).size, 2);
  assert.ok(rows.every(l => l.companion === "FAMILY" && l.interest !== "PANDA"));
});
test("one same-Companion candidate stays one instead of filling with another Companion", async () => {
  const f=fixture();f.Lens=f.Lens.filter(l=>l.id!=="play");
  assert.deepEqual(ids(await functions(f).get("current")),["season"]);
});
test("no same-Companion candidates uses other Companion in explicit Interest then Companion order", async () => {
  const f=fixture();f.Lens=f.Lens.filter(l=>!["play","season"].includes(l.id));
  assert.deepEqual(ids(await functions(f).get("current")),["solo","friends"]);
  f.Lens.push(makeLens("other-season","COUPLE","SEASON"));f.Course.push({id:"extra",lensId:"other-season",durationType:"HOURS_1_2",isPublished:true});
  assert.deepEqual(ids(await functions(f).get("current")),["other-season","solo"]);
});
test("reversing database Lens and Course order leaves recommendation order unchanged", async () => {
  for(const fallback of [false,true]){const f=fixture();if(fallback)f.Lens=f.Lens.filter(l=>!["play","season"].includes(l.id));const expected=ids(await functions(f).get("current"));f.Lens.reverse();f.Course.reverse();assert.deepEqual(ids(await functions(f).get("current")),expected);}
});
test("hidden Lens, absent/hidden Courses and legacy-only durations are excluded like Result", async () => {
  for(const change of [f=>f.Lens.find(l=>l.id==="season").isPublished=false,f=>f.Course=f.Course.filter(c=>c.lensId!=="season"),f=>f.Course.filter(c=>c.lensId==="season").forEach(c=>c.isPublished=false),f=>f.Course.filter(c=>c.lensId==="season").forEach(c=>c.durationType="HALF_DAY")]){
    const f=fixture();change(f);const {get,result}=functions(f);const rows=await get("current");assert.deepEqual(ids(rows),["play"]);
    for(const row of rows){const r=await result(row);assert.ok(r.recommendation?.courses.length>0);}
  }
});
test("every supported Duration is eligible; unsupported Companion cannot make an invalid Result URL", async () => {
  for(const durationType of ["MINUTES_30_60","HOURS_1_2","HOURS_2_3"]){const f=fixture();f.Course=[{id:"course",lensId:"season",durationType,isPublished:true}];assert.deepEqual(ids(await functions(f).get("current")),["season"]);}
  const f=fixture();f.Lens.find(l=>l.id==="season").companion="SMALL_CHILDREN";assert.deepEqual(ids(await functions(f).get("current")),["play"]);
});
test("zero candidates and missing/hidden current Lens return no suggestions", async () => {
  const f=fixture();f.Course=[];assert.equal((await functions(f).get("current")).length,0);
  const g=fixture();g.Lens.find(l=>l.id==="current").isPublished=false;assert.equal((await functions(g).get("current")).length,0);
  assert.equal((await functions(fixture()).get("not-an-id")).length,0);
});
const render=(lenses,query={})=>renderToStaticMarkup(React.createElement(loadUI("src/components/recap/RediscoveryLenses.tsx").default,{lenses,query}));
test("rediscovery UI hides zero and renders one/two semantic Japanese cards in JP and EN", async()=>{
  const lenses=await functions(fixture()).get("current");
  for(const lang of ["ja","en"])for(const count of [0,1,2]){const html=render(lenses.slice(0,count),{lang});if(!count){assert.equal(html,"");continue;}assert.equal((html.match(/<li /g)||[]).length,count);for(const text of ["<h2","<h3","Japanese only","focus-visible","min-h-12","子ども連れの家族と","季節・自然","FAMILY × SEASON：このLENSで見てみる"])assert.ok(html.includes(text));assert.doesNotMatch(html,/<button/);}
});
test("rediscovery CTA replaces answers, removes all durations, retains repeated and contextual query without mutation",async()=>{
  const lenses=await functions(fixture()).get("current");
  for(const lang of ["ja","en"])for(const duration of ["HALF_DAY",["HALF_DAY","HOURS_1_2"]]){
    const query={lang,foo:["1","2"],courseId:"old-course",duration,companion:["SOLO","COUPLE"],interest:"PHOTO"};const before=structuredClone(query);
    const links=[...render(lenses,query).matchAll(/href="([^"]+)"/g)];assert.equal(links.length,2);
    for(const [i,match] of links.entries()){const u=new URL(match[1].replaceAll("&amp;","&"),"https://example.com");assert.equal(u.pathname,"/lens/result");assert.deepEqual(u.searchParams.getAll("companion"),[lenses[i].companion]);assert.deepEqual(u.searchParams.getAll("interest"),[lenses[i].interest]);assert.equal(u.searchParams.has("duration"),false);assert.equal(u.searchParams.get("lang"),lang);assert.equal(u.searchParams.get("courseId"),"old-course");assert.deepEqual(u.searchParams.getAll("foo"),["1","2"]);}
    assert.deepEqual(query,before);
  }
});
test("long Lens name and description remain readable text, not truncated card buttons",()=>{
  const lens=makeLens("long","FAMILY","SEASON",{name:"長いLENS名".repeat(20),description:"長い説明文".repeat(100)});const html=render([lens]);assert.ok(html.includes(lens.name));assert.ok(html.includes(lens.description));assert.match(html,/break-words/);assert.doesNotMatch(html,/line-clamp|<button/);
});
